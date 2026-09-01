"use client";
import React from "react";
import { Table, Card, Row, Col, Statistic, Button } from "antd";
import { ReloadOutlined, DollarOutlined } from "@ant-design/icons";
import { useGetInventoryValuationQuery, useGetLowStockAlertsQuery } from "@/redux/api/inventoryOperationsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function InventoryValuationPage() {
  const { data: valData, isLoading: valLoading, refetch: refetchVal } = useGetInventoryValuationQuery(undefined);
  const { data: alertsData, isLoading: alertsLoading, refetch: refetchAlerts } = useGetLowStockAlertsQuery(undefined);

  const valuation = valData?.data;
  const lowStock = alertsData?.data || [];

  const warehouseColumns: any = [
    {
      title: "Warehouse / Location",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
    },
    {
      title: "Total Stock Units",
      dataIndex: "units",
      key: "units",
      align: "right" as const,
      render: (u: number) => <span>{Number(u || 0).toLocaleString()} Units</span>,
    },
    {
      title: "Stock Asset Value (Tk)",
      dataIndex: "value",
      key: "value",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-bold text-emerald-700">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const lowStockColumns: any = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name || record.name}</span>
          <span className="text-xs text-gray-400 block">SKU: {record.sku}</span>
        </div>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "Current Stock",
      dataIndex: "currentStock",
      key: "currentStock",
      align: "right" as const,
      render: (qty: number) => <span className="text-rose-700 font-bold">{qty}</span>,
    },
    {
      title: "Reorder Threshold",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
      align: "right" as const,
    },
    {
      title: "Deficit",
      dataIndex: "deficit",
      key: "deficit",
      align: "right" as const,
      render: (def: number) => <span className="text-rose-600 font-semibold">-{def} Units</span>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Inventory Valuation & Low Stock Alerts" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic
              title="Total Inventory Asset Value"
              value={Number(valuation?.totalValuation || 0)}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic
              title="Total Units on Hand"
              value={Number(valuation?.totalUnits || 0)}
              suffix="Units"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-rose-500 shadow-sm">
            <Statistic
              title="Low Stock Alert Items"
              value={lowStock.length}
              valueStyle={{ color: "#cf1322" }}
              suffix="Products"
            />
          </Card>
        </Col>
      </Row>

      {/* Warehouse Valuation Breakdown */}
      <Card
        title="Stock Valuation by Warehouse"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetchVal()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={warehouseColumns} dataSource={valuation?.byWarehouse || []} rowKey="warehouseName" loading={valLoading} pagination={false} size="middle" />
      </Card>

      {/* Low Stock Alerts */}
      <Card
        title="Low Stock Reorder Alerts"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetchAlerts()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={lowStockColumns} dataSource={lowStock} rowKey="productId" loading={alertsLoading} pagination={{ pageSize: 10 }} size="middle" />
      </Card>
    </div>
  );
}
