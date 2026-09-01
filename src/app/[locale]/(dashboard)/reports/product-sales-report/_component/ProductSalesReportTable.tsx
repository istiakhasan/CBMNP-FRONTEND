"use client";
import React from "react";
import { Card, Table, Tag, Row, Col, Statistic, Spin } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface ProductSalesReportTableProps {
  reports: any;
  loading?: boolean;
}

const ProductSalesReportTable: React.FC<ProductSalesReportTableProps> = ({
  reports,
  loading = false,
}) => {
  const summary = reports?.summary || {};
  const data: any[] = reports?.data || [];

  const formatAmount = (value: any) =>
    Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalRevenue = Number(summary?.salesAmount || 0);

  const columns: any = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{name || "Product"}</span>
          {record.sku && (
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <BarcodeOutlined /> SKU: {record.sku}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Order Source",
      dataIndex: "orderSource",
      key: "orderSource",
      align: "center" as const,
      render: (source: string) => {
        let color = "blue";
        if (source === "Facebook") color = "geekblue";
        if (source === "WhatsApp") color = "green";
        if (source === "POS") color = "purple";
        if (source === "Website") color = "cyan";
        return <Tag color={color}>{source || "Direct"}</Tag>;
      },
    },
    {
      title: "Quantity Sold",
      dataIndex: "totalOrderQuantity",
      key: "totalOrderQuantity",
      align: "center" as const,
      sorter: (a: any, b: any) =>
        Number(a.totalOrderQuantity || 0) - Number(b.totalOrderQuantity || 0),
      render: (qty: number) => (
        <span className="font-extrabold text-blue-700">{Number(qty || 0).toLocaleString()} pcs</span>
      ),
    },
    {
      title: "Avg Unit Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (p: number) => `৳ ${formatAmount(p)}`,
    },
    {
      title: "Total Revenue (Tk)",
      dataIndex: "totalSaleAmount",
      key: "totalSaleAmount",
      align: "right" as const,
      sorter: (a: any, b: any) =>
        Number(a.totalSaleAmount || 0) - Number(b.totalSaleAmount || 0),
      render: (amt: number) => (
        <span className="font-extrabold text-emerald-700">
          ৳ {formatAmount(amt)}
        </span>
      ),
    },
    {
      title: "Orders Count",
      dataIndex: "orderCount",
      key: "orderCount",
      align: "center" as const,
      sorter: (a: any, b: any) =>
        Number(a.orderCount || 0) - Number(b.orderCount || 0),
      render: (cnt: number) => (
        <Tag color="default" className="font-semibold">
          {Number(cnt || 0).toLocaleString()} Orders
        </Tag>
      ),
    },
    {
      title: "Revenue Share",
      key: "share",
      align: "right" as const,
      render: (_: any, record: any) => {
        const val = Number(record.totalSaleAmount || 0);
        const percent = totalRevenue > 0 ? ((val / totalRevenue) * 100).toFixed(1) : "0.0";
        return <span className="text-xs font-bold text-gray-500">{percent}%</span>;
      },
    },
  ];

  const courierColumns: any = [
    {
      title: "Courier Partner",
      dataIndex: "courierName",
      key: "courierName",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <CarOutlined className="text-orange-500" />
          <span className="font-bold text-gray-800">{name || "Unassigned"}</span>
        </div>
      ),
    },
    {
      title: "Orders Shipped",
      dataIndex: "orderCount",
      key: "orderCount",
      align: "center" as const,
      render: (cnt: number) => `${Number(cnt || 0).toLocaleString()} Orders`,
    },
    {
      title: "Items Dispatched",
      dataIndex: "productQuantity",
      key: "productQuantity",
      align: "center" as const,
      render: (qty: number) => `${Number(qty || 0).toLocaleString()} pcs`,
    },
    {
      title: "Sales Dispatched (Tk)",
      dataIndex: "saleAmount",
      key: "saleAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-bold text-emerald-700">৳ {formatAmount(amt)}</span>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="space-y-6">
        {/* KPI Flash Metrics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Products Sold"
                value={Number(summary?.totalProductQuantity || 0)}
                valueStyle={{ fontWeight: 800, color: "#1e40af" }}
                suffix="pcs"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Orders"
                value={Number(summary?.totalOrders || 0)}
                valueStyle={{ fontWeight: 800, color: "#0369a1" }}
                suffix="orders"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-emerald-50/30">
              <Statistic
                title="Gross Sales"
                value={Number(summary?.salesAmount || 0)}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#047857" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-blue-50/30">
              <Statistic
                title="Paid Amount"
                value={Number(summary?.paidAmount || 0)}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#1d4ed8" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Courier Orders"
                value={Number(summary?.courierOrderCount || 0)}
                valueStyle={{ fontWeight: 800, color: "#d97706" }}
                suffix="orders"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Distinct Products"
                value={Number(summary?.totalProducts || data.length)}
                valueStyle={{ fontWeight: 800, color: "#475569" }}
                suffix="SKUs"
              />
            </Card>
          </Col>
        </Row>

        {/* Courier Dispatches Summary */}
        {summary?.courierBreakdown?.length > 0 && (
          <Card
            title={
              <span className="font-bold text-gray-700 text-sm">
                Courier Dispatches & Logistics Channel Breakdown
              </span>
            }
            className="rounded-xl border-gray-200 shadow-sm"
          >
            <Table
              dataSource={summary.courierBreakdown}
              columns={courierColumns}
              rowKey={(r) => r.courierId || r.courierName || Math.random().toString()}
              pagination={false}
              size="small"
            />
          </Card>
        )}

        {/* Product Sales Registry Table */}
        <Card
          title={
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-bold text-gray-800 text-base">
                Itemized Product Sales Breakdown ({data.length} Line Items)
              </span>
              {reports?.meta?.startDate && reports?.meta?.endDate && (
                <span className="text-xs text-gray-500 font-mono">
                  Period: {dayjs(reports.meta.startDate).format("DD MMM YYYY")} -{" "}
                  {dayjs(reports.meta.endDate).format("DD MMM YYYY")}
                </span>
              )}
            </div>
          }
          className="rounded-xl border-gray-200 shadow-sm"
        >
          <Table
            dataSource={data}
            columns={columns}
            rowKey={(r) => `${r.productId}-${r.orderSource}-${r.sku}`}
            pagination={{ pageSize: 20, showSizeChanger: true }}
            scroll={{ x: 800 }}
            summary={(pageData) => {
              const totalQty = pageData.reduce(
                (sum, r) => sum + Number(r.totalOrderQuantity || 0),
                0
              );
              const totalAmount = pageData.reduce(
                (sum, r) => sum + Number(r.totalSaleAmount || 0),
                0
              );
              const totalOrders = pageData.reduce(
                (sum, r) => sum + Number(r.orderCount || 0),
                0
              );

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row className="bg-gray-50 font-bold">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <span className="text-gray-900 font-bold">Page Total:</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="center">
                      <span className="text-blue-700 font-bold">{totalQty.toLocaleString()} pcs</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} />
                    <Table.Summary.Cell index={4} align="right">
                      <span className="text-emerald-700 font-bold">৳ {formatAmount(totalAmount)}</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="center">
                      <span className="text-gray-900 font-bold">{totalOrders.toLocaleString()} Orders</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} />
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </Card>
      </div>
    </Spin>
  );
};

export default ProductSalesReportTable;
