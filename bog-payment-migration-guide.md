# გადახდის სისტემის მიგრაცია: Mock → Bank of Georgia (BOG)

ეს დოკუმენტი აღწერს, რა უნდა **დაემატოს**, რა უნდა **შეიცვალოს** და რა უნდა **წაიშალოს**, რომ დღევანდელი mock/simulate გადახდის სისტემა შეიცვალოს რეალური Bank of Georgia (BOG) გადახდის API-ით.

არსებული არქიტექტურა (`PAYMENT_PROVIDER` interface + DI token) სწორედ ამ მიგრაციისთვისაა მოსახერხებელი — არ გვჭირდება `PaymentService`-ის ლოგიკის გადაწერა, მხოლოდ **ახალი provider implementation** და **გამომძახებელი endpoint-ების** ცვლილება.

---

## 0. BOG API — მოკლე რეფერენსი

| პარამეტრი            | მნიშვნელობა                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| OAuth URL            | `https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token`         |
| API Base             | `https://api.bog.ge/payments/v1`                                              |
| Auth მეთოდი          | OAuth 2.0 Client Credentials (Basic auth header `client_id:client_secret`)    |
| Order შექმნა         | `POST /ecommerce/orders`                                                      |
| გადახდის დეტალები    | `GET /receipt/{order_id}`                                                     |
| Refund               | `POST /payment/refund/{order_id}`                                             |
| ველი callback-ისთვის | `callback_url` (server-to-server, HTTPS აუცილებელია)                          |
| Callback ხელმოწერა   | RSA public key-ით ვერიფიცირებადი (`Callback-Signature` header, SHA256withRSA) |

> **შენიშვნა**: BOG-ის ოფიციალური დოკუმენტაცია (`api.bog.ge/docs`) დროთა განმავლობაში იცვლება — endpoint-ების და response ველების ზუსტი ფორმატი გადაამოწმე იქ, სანამ production-ში წახვალ. ქვემოთ მოცემული სტრუქტურა ასახავს ამჟამინდელ საჯარო დოკუმენტაციას, მაგრამ საბოლოო კონტრაქტი (ველების სახელები, callback JSON structure) BOG-ის Merchant dashboard-იდან/დოკუმენტაციიდან დაადასტურე.

---

## 1. რა უნდა დარჩეს უცვლელი

- `PaymentProvider` interface (`providers/payment-provider.interface.ts`)
- `PaymentService.simulatePayment`-ის **შიდა ლოგიკა** (status-ების transaction-ში განახლება, `registerStoreSales`/`restoreOrderStock`, notification-ები) — ეს ლოგიკა უნდა გამოძახდეს **callback handler**-იდან, არა აღარ public endpoint-იდან
- `OrderService.createOrder` — stock-ის რეზერვაცია შეკვეთის შექმნისას არ იცვლება
- Prisma schema (`Payment`, `Order`, `Store`)

## 2. რა უნდა დაემატოს

### 2.1. `BogPaymentProvider` — ახალი provider implementation

ახალი ფაილი: `src/modules/payment/providers/bog-payment.provider.ts`

პასუხისმგებლობები:

- **`createTransactionId(paymentId)`** → აღარ არის მარტივი UUID/mock; ის ხდება რეალური BOG API call: OAuth token აღება (cache-ით, `expires_in`-ის მიხედვით), შემდეგ `POST /ecommerce/orders` callback_url-ით, `external_order_id`-ად internal `paymentId`-ის გადაცემით. საპასუხოდ იბრუნება BOG-ის `order_id` და `redirect.href` — ეს ორივე უნდა შეინახო `Payment` მოდელზე (იხ. schema ცვლილება ქვემოთ).
- **`mapSimulationOutcome`** → ეს მეთოდი აღარ არის საჭირო ამ provider-ისთვის (mock-specific იყო); მისი ადგილი იკავებს **callback status მაპინგი** (BOG-ის response code → შენი `PaymentStatus` enum). BOG აბრუნებს code-ებს, მაგ. `100` = წარმატებული გადახდა, `101–112` სხვადასხვა უარყოფის მიზეზი — ეს ყველა უნდა დაიმეპოს `FAILED`-ზე, გარდა წარმატებულისა.
- **ახალი მეთოდი: `verifyCallbackSignature(rawBody, signatureHeader)`** — BOG-ის callback-ს ხელს აწერს RSA key-ით; შენ მხარეს საჯარო key-ით (BOG-ისგან მოწოდებული) ვერიფიცირდება ხელმოწერა SHA256withRSA ალგორითმით, სანამ callback body-ს ენდობი.
- **ახალი მეთოდი: `getOrderStatus(bogOrderId)`** — `GET /receipt/{order_id}` reconciliation/cron-ისთვის (იხ. 2.3).

### 2.2. Webhook/Callback endpoint

ახალი endpoint, მაგ. `POST /payments/bog/callback` (**public**, მაგრამ signature-verified, არა JWT-guarded — BOG სერვერი ეხება, არა ბრაუზერი).

ლოგიკა:

1. წაიკითხე raw body და `Callback-Signature` header
2. `bogPaymentProvider.verifyCallbackSignature(...)` — თუ ვერიფიკაცია ჩავარდა → 400, ჩაწერე security log
3. იპოვე `Payment` შენს DB-ში `bogOrderId`-ით (არა `paymentId`-ით URL-დან — არასდროს ენდო client-გადაცემულ ID-ს)
4. გამოიძახე **იგივე** ლოგიკა, რაც ახლა `simulatePayment`-შია (status update + `registerStoreSales`/`restoreOrderStock` + notification) — საუკეთესოა ეს ლოგიკა გავიტანოთ ცალკე პრივატულ მეთოდში, მაგ. `finalizePayment(tx, paymentId, nextStatus)`, რომელსაც გამოიძახებს **ორივე** — მომავალში წაშლილი `simulatePayment` (dev-ზე) და ახალი callback handler
5. **Idempotency**: callback შეიძლება რამდენჯერმე მოვიდეს იმავე შედეგზე (BOG-ის retry მექანიზმი) — `payment.status !== "PENDING"` შემთხვევაში უბრალოდ დააბრუნე `200 OK` ისე, რომ ხელახლა არ დაამუშავო (ეს ლოგიკა უკვე გაქვს `updateMany({ where: { status: "PENDING" } })`-ის სახით — ის ბუნებრივად idempotent-ია, უბრალოდ დარწმუნდი callback handler 200-ს აბრუნებს ასეთ შემთხვევაშიც და არა 400/500-ს, თორემ BOG გააგრძელებს retry-ს)
6. დააბრუნე `200 OK` სწრაფად (BOG-ს timeout აქვს callback-ზე)

### 2.3. Reconciliation cron (რეკომენდებული, არა სავალდებულო)

ვინაიდან callback-ი ქსელური მოვლენაა და შეიძლება დაიკარგოს, დაამატე პერიოდული job (მაგ. `@nestjs/schedule`-ით ყოველ 5-10 წუთში), რომელიც:

- პოულობს ყველა `Payment`-ს `status: PENDING` და `createdAt`-ით X წუთზე ძველს
- `bogPaymentProvider.getOrderStatus(bogOrderId)`-ით ამოწმებს რეალურ სტატუსს BOG-ის მხარეს
- თუ განსხვავდება → იძახებს იმავე `finalizePayment` ლოგიკას

### 2.4. Schema ცვლილება

`Payment` მოდელს დასჭირდება:

```prisma
model Payment {
  // ... არსებული ველები
  providerOrderId String?  // BOG-ის order_id, callback-ის მოსაძებნად
  redirectUrl     String?  // BOG-ის hosted payment page URL, checkout-ზე გადასამისამართებლად
}
```

საჭირო იქნება ახალი migration (`npx prisma migrate dev --name add_bog_fields`).

### 2.5. Environment ცვლადები

```
BOG_CLIENT_ID=
BOG_CLIENT_SECRET=
BOG_PUBLIC_KEY=          # callback ხელმოწერის ვერიფიკაციისთვის
BOG_CALLBACK_URL=        # https://yourdomain.com/payments/bog/callback
PAYMENT_PROVIDER=mock | bog   # environment switch-ისთვის
```

### 2.6. DI Factory — provider switch

`payment.module.ts`-ში:

```typescript
{
  provide: PAYMENT_PROVIDER,
  useFactory: (config: ConfigService, http: HttpService) =>
    config.get("PAYMENT_PROVIDER") === "bog"
      ? new BogPaymentProvider(config, http)
      : new MockPaymentProvider(),
  inject: [ConfigService, HttpService],
}
```

ასე dev/staging-ზე `PAYMENT_PROVIDER=mock`, production-ზე `PAYMENT_PROVIDER=bog` — კოდი არ იცვლება, მხოლოდ env.

---

## 3. რა უნდა შეიცვალოს

### 3.1. `createPayment` (payment.service.ts)

ამჟამად აბრუნებს მხოლოდ `Payment` ჩანაწერს. BOG provider-ის შემთხვევაში, controller-ს/frontend-ს დასჭირდება **redirect URL**, არა simulate ღილაკები. დააბრუნე პასუხში `redirectUrl` (Payment ველიდან), რომ frontend-მა `window.location.href`-ით გადაამისამართოს მომხმარებელი BOG-ის გვერდზე.

### 3.2. `simulatePayment` endpoint — წვდომის შეზღუდვა

ეს endpoint **არ უნდა წაიშალოს** — dev/QA-სთვის სასარგებლოა — მაგრამ production-ზე უნდა იყოს **მიუწვდომელი**:

```typescript
@Post(":id/simulate")
async simulate(...) {
  if (this.config.get("PAYMENT_PROVIDER") !== "mock") {
    throw new ForbiddenException("Simulation is disabled in this environment");
  }
  // ...
}
```

ეს კრიტიკულია — ახლა ნებისმიერ authenticated user-ს შეუძლია საკუთარი payment ხელოვნურად "დაასრულოს" SUCCESS-ზე. Real provider-ზე გადასვლისას, ეს endpoint სულ მინიმუმ ასეთი guard-ით უნდა დაიხუროს, სანამ საერთოდ არ წაშლი მას.

### 3.3. `checkout/page.tsx` (frontend)

`showPaymentActions` ბლოკი (სამივე simulate ღილაკი) გახდეს env-დამოკიდებული:

```typescript
const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE; // "mock" | "bog"

const showPaymentActions = Boolean(
  paymentMode === "mock" && order && payment && payment.status === "PENDING",
);

const showRedirecting = Boolean(
  paymentMode === "bog" && order && payment && payment.status === "PENDING",
);
```

`showRedirecting` შემთხვევაში — `useEffect`-ით, როგორც კი `payment.redirectUrl` მოვა `paymentApi.create`-ის პასუხში, გააკეთე `window.location.href = payment.redirectUrl` (არა SPA client-side navigation, რადგან BOG-ის დომენზე გადადის).

დამატებით საჭირო იქნება **`success`/`fail` redirect გვერდები** (`redirect_urls.success` / `redirect_urls.fail` BOG-ის order create request-ში) — მომხმარებელი BOG-იდან უკან ბრუნდება ამ URL-ებზე, სადაც უბრალოდ აჩვენებ "დამუშავების პროცესშია" state-ს და pollavl `GET /payments/:id`-ს, სანამ callback არ დაასრულებს რეალურ status update-ს (callback ჩვეულებრივ redirect-ზე უფრო ადრე ან პარალელურად მოდის, ამიტომ frontend-მა **არ უნდა** ენდოს redirect URL-ს, როგორც "გადახდა წარმატებულია"-ს დადასტურებას — ეს მხოლოდ callback-ის საქმეა).

---

## 4. რა უნდა წაიშალოს (გვიან ეტაპზე, არა ახლა)

- `MockPaymentProvider` და `simulate` endpoint — მხოლოდ მას შემდეგ, რაც BOG ინტეგრაცია სრულად ტესტირებულია production-ზე და staging გარემო აღარ არის საჭირო
- `PaymentOutcome` type/DTO (`SimulatePaymentDto`) — იმავე დროს

**რეკომენდაცია: არაფერი წაშალო ჯერჯერობით.** დატოვე mock provider `PAYMENT_PROVIDER=mock` switch-ის უკან permanently dev/staging-ისთვის — ეს ღირებულია ავტომატური ტესტებისთვისაც (E2E ტესტებს არ სჭირდებათ რეალურ BOG sandbox-თან დაკავშირება).

---

## 5. მიგრაციის თანმიმდევრობა (checklist)

1. [ ] დარეგისტრირდი BOG Merchant პორტალზე (`bonline.bog.ge`), მიიღე `client_id`/`client_secret`/public key
2. [ ] Schema migration — `providerOrderId`, `redirectUrl` `Payment`-ზე
3. [ ] დაწერე `BogPaymentProvider` (OAuth token caching-ით)
4. [ ] დაწერე callback endpoint + signature verification
5. [ ] გაიტანე საერთო `finalizePayment` ლოგიკა `simulatePayment`-იდან, გამოიყენე ორივემ
6. [ ] DI factory switch (`PAYMENT_PROVIDER` env)
7. [ ] `simulate` endpoint-ს დაუმატე `mock`-only guard
8. [ ] Frontend: redirect flow + success/fail გვერდები + `NEXT_PUBLIC_PAYMENT_MODE`
9. [ ] ტესტირება BOG sandbox-ში სრული flow-ით (order → redirect → callback → sales/stock)
10. [ ] Reconciliation cron (რეკომენდებული)
11. [ ] Production credentials + `PAYMENT_PROVIDER=bog` production env-ში

---

## 6. ღია საკითხები, რომლებიც შენ უნდა დაადასტურო BOG-ის დოკუმენტაციაში/dashboard-ში

- ზუსტი callback JSON payload structure (ველების სახელები `order_status`, `response_code` და ა.შ. შეიძლება განსხვავდებოდეს დოკუმენტაციის ვერსიის მიხედვით)
- callback signature header-ის ზუსტი სახელი და ვერიფიკაციის ალგორითმი (public key ფორმატი — PEM?)
- refund/partial refund საჭიროა თუ არა შენს business flow-ში (ამ დოკუმენტში მოცემულია, მაგრამ არ არის დეტალურად გაშლილი)
- multi-currency საჭიროებაა თუ მხოლოდ GEL
