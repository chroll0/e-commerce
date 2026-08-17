"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
  AdminPagination,
  PaymentsFilters,
  PaymentsTable,
  Spinner,
} from "@/components";
import { paymentApi } from "@/lib/paymentApi";
import type { AdminPaymentRecord, PaymentStatus } from "@/types";

const PAGE_SIZE = 10;
const statuses: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED", "CANCELLED"];

const AdminPaymentsPage = () => {
  const locale = useLocale();
  const t = useTranslations("admin.payments");
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const providers = [
    ...new Set(payments.map((payment) => payment.provider)),
  ].sort();

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");
      setPayments(await paymentApi.getAllForAdmin());
    } catch {
      setError(t("errors.load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPayments = payments
    .filter((payment) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        [
          payment.id,
          payment.transactionId ?? "",
          String(payment.orderId),
          payment.order.user.name,
          payment.order.user.email,
        ].some((value) => value.toLowerCase().includes(query))
      );
    })
    .filter((payment) => !status || payment.status === status)
    .filter((payment) => !provider || payment.provider === provider)
    .sort(
      (left, right) =>
        (sortNewest ? 1 : -1) *
        (new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()),
    );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visiblePayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />

      <PaymentsFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        provider={provider}
        onProviderChange={setProvider}
        sortNewest={sortNewest}
        onToggleSort={() => setSortNewest((value) => !value)}
        statuses={statuses}
        providers={providers}
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-border">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <AdminErrorState
          message={error}
          retryLabel={t("actions.retry")}
          onRetry={loadPayments}
        />
      ) : !filteredPayments.length ? (
        <AdminEmptyState message={t("table.empty")} />
      ) : (
        <PaymentsTable payments={visiblePayments} locale={locale} />
      )}

      {!loading && !error && filteredPayments.length > PAGE_SIZE && (
        <AdminPagination
          page={currentPage}
          totalPages={totalPages}
          countLabel={t("pagination.count", {
            count: filteredPayments.length,
          })}
          previousLabel={t("pagination.previous")}
          nextLabel={t("pagination.next")}
          pageLabel={t("pagination.pageOf", {
            current: currentPage,
            total: totalPages,
          })}
          onPrevious={() => setPage((current) => current - 1)}
          onNext={() => setPage((current) => current + 1)}
        />
      )}
    </>
  );
};

export default AdminPaymentsPage;
