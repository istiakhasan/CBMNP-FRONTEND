"use client";
import React from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin, Progress } from "antd";
import {
  ShoppingOutlined,
  FileDoneOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link } from "@/i18n/routing";
import { useGetGarmentsDashboardQuery } from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function GarmentsDashboardPage() {
  const { data: res, isLoading, refetch } = useGetGarmentsDashboardQuery(undefined);
  const metrics = res?.data || {};

  const orderColumns = [
    {
      title: "Order #",
      key: "orderNo",
      render: (_: any, record: any) => (
        <span className="font-semibold text-blue-600">{record.orderNo || record.orderNumber || "-"}</span>
      ),
    },
    {
      title: "Buyer",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: "Style Name / Ref",
      dataIndex: "styleName",
      key: "styleName",
      render: (style: string) => style || "-",
    },
    {
      title: "Quantity (Pcs)",
      dataIndex: "orderQuantity",
      key: "orderQuantity",
      render: (qty: number) => <span>{Number(qty || 0).toLocaleString()} pcs</span>,
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const st = status || "pending";
        let color = "default";
        if (st === "running") color = "processing";
        if (st === "completed") color = "success";
        if (st === "pending") color = "warning";
        if (st === "cancelled") color = "error";
        return <Tag color={color} className="uppercase font-medium">{st}</Tag>;
      },
    },
  ];

  const poColumns = [
    {
      title: "PO #",
      key: "poNumber",
      render: (_: any, record: any) => (
        <span className="font-semibold text-purple-600">{record.supplierPoNo || record.poNumber || "-"}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      render: (_: any, record: any) => {
        const amt = record.totalAmount !== undefined ? record.totalAmount : record.grandTotal;
        return <span>{record.currency || "USD"} {Number(amt || 0).toLocaleString()}</span>;
      },
    },
    {
      title: "Approval Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "approved") color = "success";
        if (status === "pending_approval") color = "blue";
        if (status === "pending_check") color = "gold";
        if (status === "rejected") color = "error";
        return <Tag color={color} className="uppercase font-medium">{(status || "draft").replace("_", " ")}</Tag>;
      },
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments ERP Overview" />

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Garments Manufacturing Dashboard</h2>
          <p className="text-sm text-gray-500">
            Real-time tracking of Buyer Orders, BOMs, Purchase Orders, Fabric Stock, and Floor Materials.
          </p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Metrics Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Buyer Orders</span>}
                  value={metrics.totalOrders || 0}
                  prefix={<ShoppingOutlined className="text-blue-500 mr-2" />}
                />
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>Active production contracts</span>
                  <Link href="/garments/orders" className="text-blue-600 hover:underline">
                    View <ArrowRightOutlined />
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Approved BOMs</span>}
                  value={metrics.approvedBoms || 0}
                  prefix={<FileDoneOutlined className="text-green-500 mr-2" />}
                />
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>Consumption specs</span>
                  <Link href="/garments/bom" className="text-green-600 hover:underline">
                    View <ArrowRightOutlined />
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Purchase Orders</span>}
                  value={metrics.totalPos || 0}
                  prefix={<BarcodeOutlined className="text-purple-500 mr-2" />}
                />
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>Pending approval: {metrics.pendingPoApprovals || 0}</span>
                  <Link href="/garments/po" className="text-purple-600 hover:underline">
                    View <ArrowRightOutlined />
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                <Statistic
                  title={<span className="text-gray-600 font-medium">Inventory Items</span>}
                  value={metrics.totalInventoryItems || 0}
                  prefix={<InboxOutlined className="text-amber-500 mr-2" />}
                />
                <div className="mt-2 text-xs text-gray-400 flex justify-between">
                  <span>Fabrics & Trims</span>
                  <Link href="/garments/inventory" className="text-amber-600 hover:underline">
                    View <ArrowRightOutlined />
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 6-Stage Interactive Garments ERP Lifecycle Pipeline */}
          <Card
            title={
              <div className="flex items-center gap-2 text-gray-800">
                <span className="font-bold text-base">Complete Factory Production & Merchandising Workflow</span>
                <span className="text-xs font-normal text-gray-500 hidden sm:inline">(Click any stage to execute)</span>
              </div>
            }
            className="shadow-sm border border-gray-100"
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/samples">
                  <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="purple" className="font-bold text-[10px]">STEP 1</Tag>
                      </div>
                      <h4 className="font-bold text-purple-900 text-sm mt-1.5">Sample Dev & Fit</h4>
                      <p className="text-xs text-purple-700 mt-1">Proto, SMS, PPS & Buyer Approval</p>
                    </div>
                    <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-2">
                      Start Sampling <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/orders">
                  <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="blue" className="font-bold text-[10px]">STEP 2</Tag>
                      </div>
                      <h4 className="font-bold text-blue-900 text-sm mt-1.5">Buyer Bulk Orders</h4>
                      <p className="text-xs text-blue-700 mt-1">Commercial contracts & FOB specs</p>
                    </div>
                    <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-2">
                      Manage Orders <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/bom">
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="green" className="font-bold text-[10px]">STEP 3</Tag>
                      </div>
                      <h4 className="font-bold text-emerald-900 text-sm mt-1.5">Bill of Materials</h4>
                      <p className="text-xs text-emerald-700 mt-1">Consumption, presets & costing</p>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                      Build BOM <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/po">
                  <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 hover:border-indigo-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="indigo" className="font-bold text-[10px]">STEP 4</Tag>
                      </div>
                      <h4 className="font-bold text-indigo-900 text-sm mt-1.5">Purchase Orders</h4>
                      <p className="text-xs text-indigo-700 mt-1">Auto-draft PO & 2-tier approval</p>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-2">
                      Issue POs <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/po-receive">
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="gold" className="font-bold text-[10px]">STEP 5</Tag>
                      </div>
                      <h4 className="font-bold text-amber-900 text-sm mt-1.5">Goods Inward & QC</h4>
                      <p className="text-xs text-amber-700 mt-1">Roll / Lot / Shade inspection</p>
                    </div>
                    <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-2">
                      Receive Goods <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Link href="/garments/material-issue">
                  <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-500 transition cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Tag color="magenta" className="font-bold text-[10px]">STEP 6</Tag>
                      </div>
                      <h4 className="font-bold text-rose-900 text-sm mt-1.5">Floor Material Issue</h4>
                      <p className="text-xs text-rose-700 mt-1">Cutting floor dispatch & returns</p>
                    </div>
                    <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-2">
                      Issue to Floor <ArrowRightOutlined />
                    </span>
                  </div>
                </Link>
              </Col>
            </Row>
          </Card>

          {/* Tables Section */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title="Recent Buyer Orders"
                extra={<Link href="/garments/orders" className="text-blue-600 text-sm">View All</Link>}
                className="shadow-sm"
              >
                <Table
                  dataSource={metrics.recentOrders || []}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="Recent Purchase Orders"
                extra={<Link href="/garments/po" className="text-purple-600 text-sm">View All</Link>}
                className="shadow-sm"
              >
                <Table
                  dataSource={metrics.recentPos || []}
                  columns={poColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
