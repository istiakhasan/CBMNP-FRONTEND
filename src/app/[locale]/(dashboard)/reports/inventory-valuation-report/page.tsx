"use client";
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Select,
  Tag,
  Statistic,
  Input,
  Space,
  Progress,
} from "antd";
import {
  InboxOutlined,
  DollarOutlined,
  WarningOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetInventoryValuationQuery } from "@/redux/api/inventoryOperationsApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";

const { Option } = Select;

export default function InventoryValuationReport() {
  const local = useLocale();
  const [warehouseId, setWarehouseId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: valRes, isLoading } = useGetInventoryValuationQuery({
    warehouseId,
  });
  const { data: warehouseRes } = useLoadAllWarehouseQuery(undefined);

  const warehouses: any[] = warehouseRes?.data || [];
  const valData = valRes?.data;
  const items: any[] = valData?.items || [];
  const summary = valData?.summary || {
    totalSkus: items.length,
    totalQuantity: items.reduce((s, i) => s + Number(i.totalQuantity || 0), 0),
    totalCostValuation: items.reduce((s, i) => s + Number(i.totalCostValuation || 0), 0),
    totalRetailValuation: items.reduce((s, i) => s + Number(i.totalRetailValuation || 0), 0),
    lowStockCount: items.filter((i) => i.isLowStock).length,
  };

  const filteredItems = items.filter(
    (i) =>
      i.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: any = [
    {
      title: "SKU / Code",
      dataIndex: "sku",
      key: "sku",
      render: (sku: string) => <Tag color="blue" className="font-mono">{sku || "N/A"}</Tag>,
    },
    {
      title: "Product Description",
      dataIndex: "productName",
      key: "productName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-bold text-gray-800 block">{name}</span>
          <span className="text-xs text-gray-400">{record.warehouseName || "All Locations"}</span>
        </div>
      ),
    },
    {
      title: "Stock on Hand",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      sorter: (a: any, b: any) => a.totalQuantity - b.totalQuantity,
      render: (qty: number, record: any) => (
        <div>
          <span className={`font-bold ${record.isLowStock ? "text-rose-600" : "text-gray-900"}`}>
            {qty} units
          </span>
          {record.isLowStock && (
            <Tag color="error" icon={<WarningOutlined />} className="ml-2">
              Low Stock
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Avg Unit Cost (Tk)",
      dataIndex: "averageCost",
      key: "averageCost",
      sorter: (a: any, b: any) => a.averageCost - b.averageCost,
      render: (cost: number) => `৳ ${Number(cost || 0).toLocaleString()}`,
    },
    {
      title: "Cost Valuation (Tk)",
      dataIndex: "totalCostValuation",
      key: "totalCostValuation",
      sorter: (a: any, b: any) => a.totalCostValuation - b.totalCostValuation,
      render: (val: number) => (
        <span className="font-bold text-blue-700">
          ৳ {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Retail Valuation (Tk)",
      dataIndex: "totalRetailValuation",
      key: "totalRetailValuation",
      sorter: (a: any, b: any) => a.totalRetailValuation - b.totalRetailValuation,
      render: (val: number) => (
        <span className="font-semibold text-emerald-700">
          ৳ {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Stock Status",
      key: "status",
      render: (_: any, record: any) => {
        if (record.totalQuantity <= 0) return <Tag color="default">Out of Stock</Tag>;
        if (record.isLowStock) return <Tag color="warning">Reorder Soon</Tag>;
        return <Tag color="success">Optimal Stock</Tag>;
      },
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Inventory Valuation & Stock Aging Report" />
      <div className="p-4 md:p-6 space-y-6  mx-auto">
        {/* Navigation & Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Inventory Valuation Report
            </h2>
          </Space>
          <Space>
            <Select
              placeholder="Filter by Warehouse"
              className="w-56"
              allowClear
              value={warehouseId}
              onChange={(val) => setWarehouseId(val)}
              options={warehouses.map((w: any) => ({
                label: w.name || w.warehouseName || w.location || "Warehouse",
                value: w.id || w.value,
              }))}
            />
            <Button icon={<DownloadOutlined />}>Export Excel</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Statement
            </Button>
          </Space>
        </div>

        {/* KPI Flash Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Stock Units"
                value={summary.totalQuantity}
                prefix={<InboxOutlined className="text-blue-500" />}
                valueStyle={{ fontWeight: 800, color: "#1e3a8a" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Across {summary.totalSkus || items.length} active SKUs
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Cost Valuation"
                value={summary.totalCostValuation}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#2563eb" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Asset value at acquisition cost
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Retail Value Potential"
                value={summary.totalRetailValuation}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#059669" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Estimated revenue at selling price
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-amber-50/40">
              <Statistic
                title="Low Stock Items"
                value={summary.lowStockCount}
                prefix={<WarningOutlined className="text-amber-500" />}
                valueStyle={{ fontWeight: 800, color: "#b45309" }}
              />
              <span className="text-xs text-amber-700 mt-1 block">
                Items requiring reorder attention
              </span>
            </Card>
          </Col>
        </Row>

        {/* Table View */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Product Stock Valuation Breakdown ({filteredItems.length} Products)
            </span>
            <Input
              placeholder="Search by Product name or SKU..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredItems}
            columns={columns}
            rowKey={(r: any) => r.sku || r.productId || Math.random()}
            loading={isLoading}
            pagination={{ pageSize: 12 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
}
