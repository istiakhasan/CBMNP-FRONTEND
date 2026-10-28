"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "@/i18n/routing";
import { useGetGarmentsOrderByIdQuery } from "@/redux/api/garmentsApi";

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-[10px] font-bold tracking-wide text-slate-600 uppercase">{label}</div>
    <div className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</div>
  </div>
);

export default function GarmentsOrderPrintPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: result, isLoading } = useGetGarmentsOrderByIdQuery(id, { skip: !id });
  const order = result?.data;

  useEffect(() => {
    if (!isLoading && order && searchParams.get("autoPrint") === "1") {
      const timer = window.setTimeout(() => window.print(), 350);
      return () => window.clearTimeout(timer);
    }
  }, [isLoading, order, searchParams]);

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Spin size="large" /></div>;
  if (!order) return <div className="p-8 text-center text-red-600">Buyer order not found.</div>;

  const currency = order.currency || "USD";
  const quantity = Number(order.orderQuantity || 0);
  const unitPrice = Number(order.unitPrice || 0);
  const total = quantity * unitPrice;
  const deadline = order.orderType === "SAMPLE" ? order.sampleDeadline || order.deliveryDate : order.deliveryDate;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-[820px] justify-between print:hidden">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Back to Orders</Button>
        <Button type="primary" className="bg-emerald-700" icon={<PrinterOutlined />} onClick={() => window.print()}>Print Buyer Order</Button>
      </div>

      <main className="buyer-order-sheet mx-auto max-w-[820px] bg-white px-10 py-7 shadow print:shadow-none">
        <header className="flex items-start justify-between border-b border-slate-300 pb-6">
          <div>
            <div className="text-xs text-slate-500">{dayjs().format("DD MMM YYYY, hh:mm A")}</div>
            <h1 className="mt-10 text-2xl font-bold text-slate-700">Buyer Order</h1>
          </div>
          <div className="text-right">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-amber-950 text-[10px] font-bold text-white">Tabaya</div>
            <div className="mt-2 text-xs text-slate-600">Garments ERP</div>
          </div>
        </header>

        <section className="gap-x-12 py-7" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div className="space-y-5">
            <div><Field label="Company" value="Tabaya" /><div className="text-xs text-slate-600">Bangladesh</div></div>
            <Field label="Order Date" value={dayjs(order.createdAt).format("YYYY-MM-DD")} />
            <Field label="Buyer Order No." value={order.orderNo || order.orderNumber} />
            <Field label="Buyer" value={order.buyerName} />
          </div>
          <div className="space-y-5">
            <Field label="Style Name" value={order.styleName} />
            <Field label="Order Type" value={order.orderType === "SAMPLE" ? order.sampleType || "Sample" : "Bulk Production"} />
            <Field label="Category" value={order.itemType || "Apparel"} />
            <Field label="Season" value={order.season || "General"} />
            <Field label="Delivery / Deadline" value={deadline ? dayjs(deadline).format("YYYY-MM-DD") : "To be confirmed"} />
          </div>
        </section>

        <section className="border-y border-slate-300 py-4">
          <div className="grid grid-cols-[42px_1fr_90px_90px_110px] gap-2 border-b border-slate-300 pb-3 text-[10px] font-bold uppercase tracking-wide text-slate-600">
            <span>#</span><span>Description</span><span>Unit</span><span className="text-right">Qty</span><span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-[42px_1fr_90px_90px_110px] gap-2 py-4 text-sm text-slate-800">
            <span>1</span>
            <div><div className="font-semibold">{order.styleName || "Garments Order"}</div><div className="text-xs text-slate-500">{order.itemType || "Apparel"} · {order.season || "General"}</div></div>
            <span>PCS</span><span className="text-right">{quantity.toLocaleString()}</span><span className="text-right font-semibold">{currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-10 py-6">
          <div><div className="text-[10px] font-bold uppercase tracking-wide text-slate-700">Comments / Special Instructions</div><p className="mt-3 text-sm text-slate-600">{order.remarks || "—"}</p></div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Unit Price / FOB</span><span>{currency} {unitPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total Quantity</span><span>{quantity.toLocaleString()} pcs</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-semibold uppercase">{order.sampleStatus || order.status || "pending"}</span></div>
            <div className="flex justify-between border-t border-slate-400 pt-2 text-base font-bold"><span>Total</span><span>{currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          </div>
        </section>

        <footer className="mt-10 gap-8 border-t border-slate-300 pt-10 text-xs text-slate-600" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div><div className="border-b border-slate-500 pb-6" /><div className="mt-2 font-semibold">Prepared by</div></div>
          <div><div className="border-b border-slate-500 pb-6" /><div className="mt-2 font-semibold">Checked by</div></div>
        </footer>
      </main>
      <style jsx global>{`@media print { @page { size: A4 portrait; margin: 10mm; } body { background: white !important; } .buyer-order-sheet { max-width: none !important; min-height: 270mm; } aside, nav, header:not(.buyer-order-sheet header) { display: none !important; } }`}</style>
    </div>
  );
}
