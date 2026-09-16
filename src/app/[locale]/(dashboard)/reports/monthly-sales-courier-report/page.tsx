"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetMonthlySalesCourierReportQuery } from "@/redux/api/orderApi";
import {
  CarOutlined,
  DollarOutlined,
  InboxOutlined,
  RollbackOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card, DatePicker, Empty, Skeleton, Statistic } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

const money = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export default function MonthlySalesCourierReportPage() {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const { data: response, isFetching, isError } = useGetMonthlySalesCourierReportQuery({
    month: month.format("YYYY-MM"),
  });
  const report = response?.data;

  const cards = [
    { title: "Total Sales", value: report?.totalSales, icon: <ShoppingCartOutlined />, tone: "text-blue-600 bg-blue-50" },
    { title: "Advance Collected", value: report?.advanceCollected, icon: <WalletOutlined />, tone: "text-emerald-600 bg-emerald-50" },
    { title: "Courier Receivable", value: report?.courierReceivable, icon: <CarOutlined />, tone: "text-violet-600 bg-violet-50" },
    { title: "Courier Delivery Charge", value: report?.courierDeliveryCharge, icon: <InboxOutlined />, tone: "text-amber-600 bg-amber-50" },
    { title: "Customer Delivery Charge", value: report?.customerDeliveryCharge, icon: <DollarOutlined />, tone: "text-cyan-600 bg-cyan-50" },
    { title: "Return Value", value: report?.returnValue, icon: <RollbackOutlined />, tone: "text-rose-600 bg-rose-50" },
  ];

  return (
    <div>
      <GbHeader title="Monthly Sales & Courier Report" />
      <main className="p-4 sm:p-6 space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Monthly collection overview</h1>
              <p className="mt-1 text-sm text-slate-500">Sales, courier receivable, delivery charges, and returns for one month.</p>
            </div>
            <DatePicker
              picker="month"
              allowClear={false}
              value={month}
              onChange={(value) => value && setMonth(value)}
              className="w-full sm:w-48"
              format="MMMM YYYY"
            />
          </div>
        </section>

        {isFetching ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : isError || !report ? (
          <Card><Empty description="This monthly report could not be loaded." /></Card>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.title} className="!border-slate-200" bodyStyle={{ padding: 18 }}>
                  <div className="flex items-start justify-between gap-3">
                    <Statistic title={card.title} value={money(card.value)} valueStyle={{ fontSize: 21, fontWeight: 650, color: "#172033" }} />
                    <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${card.tone}`}>{card.icon}</span>
                  </div>
                </Card>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card title="Order volume" className="!border-slate-200">
                <Statistic value={report.totalOrders} suffix="orders" valueStyle={{ color: "#172033", fontWeight: 650 }} />
                <p className="mt-2 text-sm text-slate-500">Orders created during {month.format("MMMM YYYY")}.</p>
              </Card>
              <Card title="Returns" className="!border-slate-200">
                <Statistic value={report.returnQuantity} suffix="items" valueStyle={{ color: "#e11d48", fontWeight: 650 }} />
                <p className="mt-2 text-sm text-slate-500">Return quantity and value are based on return dates in this month.</p>
              </Card>
              <Card title="How amounts are calculated" className="!border-slate-200 lg:col-span-1">
                <div className="space-y-1.5 text-sm text-slate-600">
                  <p><b>Advance:</b> payments already collected from customers.</p>
                  <p><b>Courier receivable:</b> order total remaining after advance.</p>
                  <p><b>Delivery charges:</b> courier cost vs. amount charged to customer.</p>
                </div>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
