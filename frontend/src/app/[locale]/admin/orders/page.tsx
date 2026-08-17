"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUpDown, Eye, Search } from "lucide-react";
import { AdminPageHeader, Button, ConfirmModal, Spinner } from "@/components";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/components/admin/orders/orderFormatters";
import { orderApi } from "@/lib/orderApi";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/types";

const PAGE_SIZE = 10;
const orderStatuses: OrderStatus[] = ["PENDING", "PAID", "PAYMENT_FAILED", "SHIPPED", "CANCELLED"];
const paymentStatuses: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED", "CANCELLED"];

const AdminOrdersPage = () => {
  const locale = useLocale();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const [cancellationTarget, setCancellationTarget] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await orderApi.getAllForAdmin());
    } catch {
      setError("Orders could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      const query = search.trim().toLowerCase();
      return !query || [String(order.id), order.user.name, order.user.email].some((value) => value.toLowerCase().includes(query));
    })
    .filter((order) => !orderStatus || order.status === orderStatus)
    .filter((order) => !paymentStatus || order.payment?.status === paymentStatus)
    .sort((left, right) => (sortNewest ? 1 : -1) * (new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
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
      setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, ...updated } : item)));
    } catch {
      setError(`Order #${order.id} could not be updated.`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader title="Orders" description="Monitor customer orders, payment progress, and fulfillment status." />
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium">Search
          <span className="relative mt-1 block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order ID, customer, or email" className="w-full rounded border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></span>
        </label>
        <label className="text-sm font-medium">Order status<select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)} className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"><option value="">All statuses</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="text-sm font-medium">Payment status<select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"><option value="">All statuses</option>{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <Button variant="outline" size="sm" onClick={() => setSortNewest((value) => !value)} leftIcon={<ArrowUpDown className="h-4 w-4" />}>{sortNewest ? "Newest first" : "Oldest first"}</Button>
      </div>
      {loading ? <div className="flex min-h-64 items-center justify-center rounded-xl border border-border"><Spinner size="lg" /></div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"><p>{error}</p><Button className="mt-3" variant="outline" size="sm" onClick={loadOrders}>Retry</Button></div> : !filteredOrders.length ? <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No orders match the current filters.</div> : <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-230 text-sm"><thead className="border-b border-border bg-card-soft text-left text-xs text-muted-foreground"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Order status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id} className="border-b border-border last:border-0"><td className="px-4 py-3 font-medium">#{order.id}</td><td className="px-4 py-3"><div>{order.user.name}</div><div className="text-xs text-muted-foreground">{order.user.email}</div></td><td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(order.createdAt, locale)}</td><td className="px-4 py-3">{order.items.length}</td><td className="px-4 py-3 font-medium whitespace-nowrap">{formatCurrency(order.total, locale)}</td><td className="px-4 py-3">{order.payment ? <OrderStatusBadge status={order.payment.status} kind="payment" /> : <span className="text-xs text-muted-foreground">Not created</span>}</td><td className="px-4 py-3"><select aria-label={`Update order ${order.id} status`} value={order.status} disabled={updatingId === order.id} onChange={(event) => void updateOrderStatus(order, event.target.value as OrderStatus)} className="rounded border border-border bg-background px-2 py-1 text-xs"><option value="PENDING">PENDING</option><option value="PAID">PAID</option><option value="PAYMENT_FAILED">PAYMENT FAILED</option><option value="SHIPPED">SHIPPED</option><option value="CANCELLED">CANCELLED</option></select></td><td className="px-4 py-3 text-right"><Button asChild variant="outline" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}><Link href={`/${locale}/admin/orders/${order.id}`}>Details</Link></Button></td></tr>)}</tbody></table></div>}
      {!loading && !error && filteredOrders.length > PAGE_SIZE && <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{filteredOrders.length} orders</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><span>Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}
      <ConfirmModal isOpen={!!cancellationTarget} loading={updatingId === cancellationTarget?.id} title="Cancel order" description={`Cancel order #${cancellationTarget?.id}? This is the only destructive order action available.`} cancelLabel="Keep order" confirmLabel="Cancel order" onClose={() => setCancellationTarget(null)} onConfirm={async () => { if (!cancellationTarget) return; try { setUpdatingId(cancellationTarget.id); const updated = await orderApi.updateStatus(cancellationTarget.id, "CANCELLED"); setOrders((current) => current.map((order) => order.id === updated.id ? { ...order, ...updated } : order)); setCancellationTarget(null); } catch { setError(`Order #${cancellationTarget.id} could not be cancelled.`); } finally { setUpdatingId(null); } }} />
    </>
  );
};

export default AdminOrdersPage;
