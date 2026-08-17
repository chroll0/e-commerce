"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
  AdminPagination,
  ConfirmModal,
  OrdersFilters,
  OrdersTable,
  Spinner,
} from "@/components";
import { orderApi } from "@/lib/orderApi";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/types";

const PAGE_SIZE = 10;
const orderStatuses: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PAYMENT_FAILED",
  "SHIPPED",
  "CANCELLED",
];
const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
];

const AdminOrdersPage = () => {
  const locale = useLocale();
  const t = useTranslations("admin.orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const [cancellationTarget, setCancellationTarget] =
    useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await orderApi.getAllForAdmin());
    } catch {
      setError(t("errors.load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        [String(order.id), order.user.name, order.user.email].some((value) =>
          value.toLowerCase().includes(query),
        )
      );
    })
    .filter((order) => !orderStatus || order.status === orderStatus)
    .filter(
      (order) => !paymentStatus || order.payment?.status === paymentStatus,
    )
    .sort(
      (left, right) =>
        (sortNewest ? 1 : -1) *
        (new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()),
    );
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateOrderStatus = async (order: AdminOrder, status: OrderStatus) => {
    if (status === "CANCELLED") {
      setCancellationTarget(order);
      return;
    }
    try {
      setUpdatingId(order.id);
      const updated = await orderApi.updateStatus(order.id, status);
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, ...updated } : item,
        ),
      );
    } catch {
      setError(t("errors.update", { id: order.id }));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />

      <OrdersFilters
        search={search}
        onSearchChange={setSearch}
        orderStatus={orderStatus}
        onOrderStatusChange={setOrderStatus}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        sortNewest={sortNewest}
        onToggleSort={() => setSortNewest((value) => !value)}
        orderStatuses={orderStatuses}
        paymentStatuses={paymentStatuses}
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-border">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <AdminErrorState
          message={error}
          retryLabel={t("actions.retry")}
          onRetry={loadOrders}
        />
      ) : !filteredOrders.length ? (
        <AdminEmptyState message={t("table.empty")} />
      ) : (
        <OrdersTable
          orders={visibleOrders}
          locale={locale}
          updatingId={updatingId}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      {!loading && !error && filteredOrders.length > PAGE_SIZE && (
        <AdminPagination
          page={currentPage}
          totalPages={totalPages}
          countLabel={t("pagination.count", { count: filteredOrders.length })}
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

      <ConfirmModal
        isOpen={!!cancellationTarget}
        loading={updatingId === cancellationTarget?.id}
        title={t("cancelModal.title")}
        description={t("cancelModal.description", {
          id: cancellationTarget?.id ?? "",
        })}
        cancelLabel={t("cancelModal.cancel")}
        confirmLabel={t("cancelModal.confirm")}
        onClose={() => setCancellationTarget(null)}
        onConfirm={async () => {
          if (!cancellationTarget) return;
          try {
            setUpdatingId(cancellationTarget.id);
            const updated = await orderApi.updateStatus(
              cancellationTarget.id,
              "CANCELLED",
            );
            setOrders((current) =>
              current.map((order) =>
                order.id === updated.id ? { ...order, ...updated } : order,
              ),
            );
            setCancellationTarget(null);
          } catch {
            setError(t("errors.cancel", { id: cancellationTarget.id }));
          } finally {
            setUpdatingId(null);
          }
        }}
      />
    </>
  );
};

export default AdminOrdersPage;
