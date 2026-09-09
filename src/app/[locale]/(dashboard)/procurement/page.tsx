"use client";
import React from "react";
import { Card, Row, Col, Statistic, Button, Tag } from "antd";
import {
  ShoppingOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  RollbackOutlined,
  TeamOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetProcurementQuery } from "@/redux/api/procurementApi";
import { useGetPurchaseReturnsQuery, useGetGRNsQuery } from "@/redux/api/purchaseReturnsApi";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";

export default function ProcurementHubPage() {
  const locale = useLocale();
  const { data: procurementsData, isLoading } = useGetProcurementQuery({ limit: 100, page: 1 });
  const { data: returnsData } = useGetPurchaseReturnsQuery(undefined);
  const { data: grnData } = useGetGRNsQuery(undefined);
  const { data: suppliersData } = useGetAllSupplierQuery(undefined);

  const procurements = procurementsData?.data || [];
  const pendingOrders = procurements.filter((p: any) => p.status === "Pending" || !p.status);
  const approvedOrders = procurements.filter((p: any) => p.status === "Approved");
  const completedOrders = procurements.filter((p: any) => p.status === "Completed");
  const directPurchases = procurements.filter((p: any) => p.invoiceNumber?.startsWith("DIR-"));

  const modules = [
    {
      title: "Direct Purchase",
      desc: "Spot purchases with instant stock deposit into warehouse",
      icon: <ThunderboltOutlined className="text-2xl text-amber-500" />,
      href: `/${locale}/procurement/direct-purchase`,
      badge: "Instant Stock",
      badgeColor: "gold",
      action: "New Spot Purchase",
    },
    {
      title: "Purchase Orders (PO)",
      desc: "Create and draft new procurement purchase orders",
      icon: <ShoppingOutlined className="text-2xl text-blue-600" />,
      href: `/${locale}/procurement/purchase-order`,
      badge: `${procurements.length} Total POs`,
      badgeColor: "blue",
      action: "Manage POs",
    },
    {
      title: "Purchase Approved",
      desc: "Review and approve pending vendor purchase orders",
      icon: <CheckCircleOutlined className="text-2xl text-emerald-600" />,
      href: `/${locale}/procurement/purchase-approved`,
      badge: `${pendingOrders.length} Pending`,
      badgeColor: pendingOrders.length > 0 ? "orange" : "default",
      action: "Approve Orders",
    },
    {
      title: "Purchase Receive",
      desc: "Receive items against approved supplier purchase orders",
      icon: <InboxOutlined className="text-2xl text-teal-600" />,
      href: `/${locale}/procurement/purchase-receive`,
      badge: `${approvedOrders.length} Awaiting Receipt`,
      badgeColor: "cyan",
      action: "Receive Shipments",
    },
    {
      title: "Goods Receipt (GRN & QA)",
      desc: "Record GRNs with quality inspection and QA acceptance logs",
      icon: <FileDoneOutlined className="text-2xl text-purple-600" />,
      href: `/${locale}/procurement/grn`,
      badge: `${grnData?.data?.length || 0} GRNs`,
      badgeColor: "purple",
      action: "Record GRN",
    },
    {
      title: "Purchase Returns",
      desc: "Return damaged goods to suppliers and manage debit notes",
      icon: <RollbackOutlined className="text-2xl text-rose-600" />,
      href: `/${locale}/procurement/returns`,
      badge: `${returnsData?.data?.length || 0} Returns`,
      badgeColor: "red",
      action: "Process Returns",
    },
    {
      title: "Suppliers Directory",
      desc: "Manage registered vendor profiles, terms, and contacts",
      icon: <TeamOutlined className="text-2xl text-indigo-600" />,
      href: `/${locale}/procurement/supplier`,
      badge: `${suppliersData?.data?.length || 0} Vendors`,
      badgeColor: "geekblue",
      action: "View Suppliers",
    },
    {
      title: "Purchase Reports",
      desc: "Procurement volume, vendor breakdowns, and audit reports",
      icon: <BarChartOutlined className="text-2xl text-slate-700" />,
      href: `/${locale}/procurement/purchase-report`,
      badge: "Analytics",
      badgeColor: "default",
      action: "View Reports",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Procurement Hub & Supply Chain Overview" />

      {/* Top Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Purchase Orders</span>}
              value={procurements.length}
              loading={isLoading}
              prefix={<ShoppingOutlined className="text-blue-500" />}
              valueStyle={{ fontWeight: "bold", color: "#1e3a8a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Pending Approval</span>}
              value={pendingOrders.length}
              loading={isLoading}
              prefix={<CheckCircleOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Completed Deliveries</span>}
              value={completedOrders.length}
              loading={isLoading}
              prefix={<InboxOutlined className="text-emerald-500" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Direct Spot Inflows</span>}
              value={directPurchases.length}
              loading={isLoading}
              prefix={<ThunderboltOutlined className="text-purple-500" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Grid of Procurement Modules */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-4">Procurement Operations & Management</h2>
        <Row gutter={[16, 16]}>
          {modules.map((m) => (
            <Col xs={24} sm={12} lg={6} key={m.title}>
              <Card
                className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between"
                bodyStyle={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">{m.icon}</div>
                    <Tag color={m.badgeColor}>{m.badge}</Tag>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{m.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
                </div>
                <Link href={m.href}>
                  <Button type="default" block className="flex items-center justify-between text-xs font-medium">
                    <span>{m.action}</span>
                    <ArrowRightOutlined />
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
