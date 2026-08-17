"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminPageHeader, Button, Spinner } from "@/components";
import OrderStatusBadge from "@/components/admin/orders/OrderStatusBadge";
import { formatCurrency, formatDate, getProductTitle } from "@/components/admin/orders/orderFormatters";
import { orderApi } from "@/lib/orderApi";
import type { AdminOrder } from "@/types";

const AdminOrderDetailsPage = () => {
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const orderId = Number(params.slug);
  const hasInvalidOrderId = !Number.isInteger(orderId);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasInvalidOrderId) return;

    void orderApi
      .getByIdForAdmin(orderId)
      .then(setOrder)
      .catch(() => setError("Order details could not be loaded."));
  }, [hasInvalidOrderId, orderId]);

  if (hasInvalidOrderId || error) return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{hasInvalidOrderId ? "This order ID is invalid." : error}</div>;
  if (!order) return <div className="flex min-h-64 items-center justify-center rounded-xl border border-border"><Spinner size="lg" /></div>;
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <>
    <AdminPageHeader title={`Order #${order.id}`} description={`Created ${formatDate(order.createdAt, locale)}`} actions={<Button asChild variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}><Link href={`/${locale}/admin/orders`}>All orders</Link></Button>} />
    <div className="grid gap-6 lg:grid-cols-3"><section className="rounded-xl border border-border bg-card p-5 lg:col-span-2"><h2 className="font-semibold">Order overview</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Order status</dt><dd className="mt-1"><OrderStatusBadge status={order.status} /></dd></div><div><dt className="text-xs text-muted-foreground">Payment status</dt><dd className="mt-1">{order.payment ? <OrderStatusBadge status={order.payment.status} kind="payment" /> : "Not created"}</dd></div><div><dt className="text-xs text-muted-foreground">Total</dt><dd className="mt-1 font-semibold">{formatCurrency(order.total, locale)}</dd></div><div><dt className="text-xs text-muted-foreground">Items</dt><dd className="mt-1 font-semibold">{order.items.length}</dd></div></dl></section><section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Customer</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Name</dt><dd>{order.user.name}</dd></div><div><dt className="text-xs text-muted-foreground">Email</dt><dd className="break-all">{order.user.email}</dd></div><div><dt className="text-xs text-muted-foreground">Phone</dt><dd>{order.user.phone ?? order.phone}</dd></div></dl></section></div>
    <section className="overflow-x-auto rounded-xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="font-semibold">Order items</h2></div><table className="w-full min-w-150 text-sm"><thead className="bg-card-soft text-left text-xs text-muted-foreground"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Variant</th><th className="px-5 py-3">Unit price</th><th className="px-5 py-3">Quantity</th><th className="px-5 py-3 text-right">Item total</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id} className="border-t border-border"><td className="px-5 py-4 font-medium">{getProductTitle(item.product, locale)}</td><td className="px-5 py-4 text-muted-foreground">{item.variant ?? "-"}</td><td className="px-5 py-4">{formatCurrency(item.price, locale)}</td><td className="px-5 py-4">{item.quantity}</td><td className="px-5 py-4 text-right font-medium">{formatCurrency(item.price * item.quantity, locale)}</td></tr>)}</tbody></table></section>
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Delivery</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{order.address}<br />{order.city}{order.zip ? `, ${order.zip}` : ""}<br />{order.phone}</p></section><section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Financial summary</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt>Items subtotal</dt><dd>{formatCurrency(itemsTotal, locale)}</dd></div><div className="flex justify-between border-t border-border pt-3 font-semibold"><dt>Total</dt><dd>{formatCurrency(order.total, locale)}</dd></div><p className="text-xs text-muted-foreground">Shipping, discounts, and taxes are not stored separately for this order.</p></dl></section></div>
    <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Payment information</h2>{order.payment ? <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-xs text-muted-foreground">Payment ID</dt><dd className="mt-1 break-all font-mono text-xs">{order.payment.id}</dd></div><div><dt className="text-xs text-muted-foreground">Provider</dt><dd className="mt-1">{order.payment.provider}</dd></div><div><dt className="text-xs text-muted-foreground">Amount</dt><dd className="mt-1">{formatCurrency(order.payment.amount, locale)}</dd></div><div><dt className="text-xs text-muted-foreground">Transaction ID</dt><dd className="mt-1 break-all">{order.payment.transactionId ?? "Not assigned"}</dd></div><div><dt className="text-xs text-muted-foreground">Status</dt><dd className="mt-1"><OrderStatusBadge status={order.payment.status} kind="payment" /></dd></div><div><dt className="text-xs text-muted-foreground">Created</dt><dd className="mt-1">{formatDate(order.payment.createdAt, locale)}</dd></div></dl> : <p className="mt-3 text-sm text-muted-foreground">No payment has been created for this order.</p>}</section>
  </>;
};

export default AdminOrderDetailsPage;