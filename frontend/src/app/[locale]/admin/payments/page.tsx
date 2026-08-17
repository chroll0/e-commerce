"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUpDown, Search } from "lucide-react";
import { AdminPageHeader, Button, Spinner } from "@/components";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/components/admin/orders/orderFormatters";
import { paymentApi } from "@/lib/paymentApi";
import type { AdminPaymentRecord, PaymentStatus } from "@/types";

const PAGE_SIZE = 10;
const statuses: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED", "CANCELLED"];

const AdminPaymentsPage = () => {
  const locale = useLocale();
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const providers = [...new Set(payments.map((payment) => payment.provider))].sort();

  useEffect(() => { paymentApi.getAllForAdmin().then(setPayments).catch(() => setError("Payments could not be loaded. Please try again.")).finally(() => setLoading(false)); }, []);
  const filteredPayments = payments.filter((payment) => { const query = search.trim().toLowerCase(); return !query || [payment.id, payment.transactionId ?? "", String(payment.orderId), payment.order.user.name, payment.order.user.email].some((value) => value.toLowerCase().includes(query)); }).filter((payment) => !status || payment.status === status).filter((payment) => !provider || payment.provider === provider).sort((left, right) => (sortNewest ? 1 : -1) * (new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return <><AdminPageHeader title="Payments" description="Review financial transactions and their linked customer orders." /><div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-medium">Search<span className="relative mt-1 block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Payment, transaction, order, or customer" className="w-full rounded border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></span></label><label className="text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-medium">Provider<select value={provider} onChange={(event) => setProvider(event.target.value)} className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"><option value="">All providers</option>{providers.map((item) => <option key={item}>{item}</option>)}</select></label><Button variant="outline" size="sm" onClick={() => setSortNewest((value) => !value)} leftIcon={<ArrowUpDown className="h-4 w-4" />}>{sortNewest ? "Newest first" : "Oldest first"}</Button></div>{loading ? <div className="flex min-h-64 items-center justify-center rounded-xl border border-border"><Spinner size="lg" /></div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"><p>{error}</p><Button className="mt-3" variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button></div> : !filteredPayments.length ? <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No payments match the current filters.</div> : <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-250 text-sm"><thead className="border-b border-border bg-card-soft text-left text-xs text-muted-foreground"><tr><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Transaction ID</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr></thead><tbody>{visiblePayments.map((payment) => <tr key={payment.id} className="border-b border-border last:border-0"><td className="max-w-36 truncate px-4 py-3 font-mono text-xs" title={payment.id}>{payment.id}</td><td className="px-4 py-3"><Link href={`/${locale}/admin/orders/${payment.orderId}`} className="font-medium hover:underline">#{payment.orderId}</Link></td><td className="px-4 py-3"><div>{payment.order.user.name}</div><div className="text-xs text-muted-foreground">{payment.order.user.email}</div></td><td className="px-4 py-3 font-medium whitespace-nowrap">{formatCurrency(payment.amount, locale)}</td><td className="px-4 py-3">{payment.provider}</td><td className="max-w-44 truncate px-4 py-3 font-mono text-xs" title={payment.transactionId ?? ""}>{payment.transactionId ?? "Not assigned"}</td><td className="px-4 py-3"><OrderStatusBadge status={payment.status} kind="payment" /></td><td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(payment.createdAt, locale)}</td></tr>)}</tbody></table></div>}{!loading && !error && filteredPayments.length > PAGE_SIZE && <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{filteredPayments.length} payments</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><span>Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}</>;
};

export default AdminPaymentsPage;