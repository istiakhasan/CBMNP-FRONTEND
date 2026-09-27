"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { CheckCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Progress, Tag } from "antd";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useGetSfaDmsDashboardQuery } from "@/redux/api/dashboardApi";
import SfaDmsWorkspace from "./_component/SfaDmsWorkspace";

const modules = [
  { title: "Sales Force Automation", subtitle: "Visits, geo check-in, order booking & daily attendance", icon: "ri-team-line", tone: "bg-sky-50 text-sky-600", stage: "Production Ready" },
  { title: "Distribution Management", subtitle: "Distributor onboarding, retailer network, route beat & stock", icon: "ri-truck-line", tone: "bg-indigo-50 text-indigo-600", stage: "Production Ready" },
  { title: "Trade Marketing & Schemes", subtitle: "Discounts, volume schemes, buy-X-get-Y promotions", icon: "ri-store-2-line", tone: "bg-emerald-50 text-emerald-600", stage: "Production Ready" },
  { title: "Sales Targets & KPIs", subtitle: "Monthly targets, actual sales, collection & visit tracking", icon: "ri-line-chart-line", tone: "bg-amber-50 text-amber-600", stage: "Production Ready" },
  { title: "Primary Indents & Dispatch", subtitle: "Replenishment indents, stock receipt & warehouse sync", icon: "ri-file-list-3-line", tone: "bg-violet-50 text-violet-600", stage: "Production Ready" },
  { title: "Field Collections", subtitle: "Cash, bKash, Nagad, bank & cheque collection with verification", icon: "ri-money-dollar-circle-line", tone: "bg-rose-50 text-rose-600", stage: "Production Ready" },
];

export default function SfaDmsPage() {
  const locale = useLocale();
  const { data: dashboardResponse, isFetching } = useGetSfaDmsDashboardQuery(undefined);
  const metrics = dashboardResponse?.data;
  return (
    <div className="min-h-full bg-slate-50">
      <GbHeader title="Sales Force Automation & DMS" />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Tag color="blue" className="!mb-3 !border-0 !bg-blue-500/20 !px-3 !py-1 !text-blue-100">SFA & DMS Workspace</Tag>
              <h1 className="m-0 text-2xl font-bold tracking-tight sm:text-3xl">A connected workspace for field sales and distribution</h1>
              <p className="mb-0 mt-3 text-sm leading-6 text-slate-300">Plan routes, capture field orders, control distributor stock, track collections, and keep dispatch accountable—without changing your current ERP data model.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-300">Active Outlets</div>
              <div className="mt-1 flex items-end gap-2"><span className="text-3xl font-bold">{isFetching ? "…" : metrics?.retailers || 0}</span><CheckCircleOutlined className="mb-1 text-emerald-400" /></div>
              <div className="mt-2 text-xs text-slate-300">Retailers · Production Active</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Territories", metrics?.territories, "ri-map-2-line"],
            ["Distributors", metrics?.distributors, "ri-truck-line"],
            ["Today's Visits", metrics?.visitsToday, "ri-footprint-line"],
            ["Today's Collection", metrics?.collectionToday, "ri-money-dollar-circle-line"],
          ].map(([label, value, icon]: any) => (
            <Card key={label} className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-xs text-slate-500">{label}</p>
                  <p className="mb-0 mt-1 text-xl font-bold text-slate-800">
                    {label === "Today's Collection" ? `৳ ${Number(value || 0).toLocaleString()}` : Number(value || 0).toLocaleString()}
                  </p>
                </div>
                <i className={`${icon} text-xl text-primary`} />
              </div>
            </Card>
          ))}
        </section>

        <SfaDmsWorkspace />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="m-0 text-lg font-semibold text-slate-800">Operational modules</h2>
              <p className="mb-0 mt-1 text-sm text-slate-500">Fully configured and integrated workflows with audit and approval controls.</p>
            </div>
            <Tag color="success">Production Ready</Tag>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <Card key={module.title} className="group !border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" bodyStyle={{ padding: 20 }}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${module.tone}`}><i className={module.icon} /></span>
                  <Tag color="success">{module.stage}</Tag>
                </div>
                <h3 className="mb-0 mt-5 text-base font-semibold text-slate-800">{module.title}</h3>
                <p className="mb-0 mt-1 min-h-10 text-sm leading-5 text-slate-500">{module.subtitle}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-emerald-600">
                  <span>Production Live</span>
                  <CheckCircleOutlined />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 !border-slate-200 shadow-sm" title="Implementation Readiness">
            <div className="space-y-4">
              {[
                ['Master data', 'Distributor, territory, route, beat, region/area and retailer setup', 100],
                ['Field execution & Sales', 'Field visits, geo check-in, secondary sales orders, primary indents, attendance & collections', 100],
                ['Controls & Analytics', 'Onboarding approval, collection verification, targets vs achievements & distributor stock ledger', 100],
              ].map(([title, description, value]: any) => (
                <div key={title}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{title}</span>
                    <span className="font-semibold text-emerald-600">{value}% configured</span>
                  </div>
                  <Progress percent={value} showInfo={false} strokeColor="#059669" trailColor="#e2e8f0" />
                  <p className="mb-0 mt-1 text-xs text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="!border-slate-200 shadow-sm" title="Connected ERP areas">
            <div className="space-y-3 text-sm">
              <Link href={`/${locale}/warehouse`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 font-medium text-slate-700 hover:text-primary">
                <span><i className="ri-building-line mr-2" />Warehouse management</span>
                <RightOutlined />
              </Link>
              <Link href={`/${locale}/inventory/transfers`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 font-medium text-slate-700 hover:text-primary">
                <span><i className="ri-arrow-left-right-line mr-2" />Stock transfers</span>
                <RightOutlined />
              </Link>
              <Link href={`/${locale}/logistics/settlements`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 font-medium text-slate-700 hover:text-primary">
                <span><i className="ri-truck-line mr-2" />Courier settlements</span>
                <RightOutlined />
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

