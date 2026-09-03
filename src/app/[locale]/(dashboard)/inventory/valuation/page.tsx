"use client";
import React, { useState } from "react";
import { Table, Card, Row, Col, Statistic, Button, Space, Modal, Form, Select, InputNumber, Switch, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  useGetInventoryValuationQuery,
  useGetLowStockAlertsQuery,
  useGetReorderRulesQuery,
  useSetReorderRuleMutation,
} from "@/redux/api/inventoryOperationsApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function InventoryValuationPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: valData, isLoading: valLoading, refetch: refetchVal } = useGetInventoryValuationQuery(undefined);
  const { data: alertsData, isLoading: alertsLoading, refetch: refetchAlerts } = useGetLowStockAlertsQuery(undefined);
  const { data: rulesData, isLoading: rulesLoading, refetch: refetchRules } = useGetReorderRulesQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery({ limit: "1000" });
  const [setReorderRule, { isLoading: isSavingRule }] = useSetReorderRuleMutation();

  const valuation = valData?.data;
  const lowStock = alertsData?.data || [];
  const reorderRules = rulesData?.data || [];
  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const openRuleModal = (record?: any) => {
    form.setFieldsValue({
      productId: record?.productId,
      warehouseId: record?.warehouseId,
      minStockLevel: record?.minStockLevel ?? 10,
      maxStockLevel: record?.maxStockLevel ?? 100,
      reorderQuantity: record?.reorderQuantity ?? 50,
      isAlertActive: record?.isAlertActive ?? true,
    });
    setModalOpen(true);
  };

  const handleRuleFinish = async (values: any) => {
    try {
      await setReorderRule(values).unwrap();
      message.success("Reorder rule saved");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save reorder rule");
    }
  };

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
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => openRuleModal(record)}>
          Update Rule
        </Button>
      ),
    },
  ];

  const reorderRuleColumns: any = [
    {
      title: "Product",
      key: "product",
      render: (_: any, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{record?.product?.name || "Product"}</span>
          <span className="text-xs text-gray-400 block">SKU: {record?.product?.sku || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Warehouse",
      key: "warehouse",
      render: (_: any, record: any) => record?.warehouse?.name || "N/A",
    },
    {
      title: "Min",
      dataIndex: "minStockLevel",
      key: "minStockLevel",
      align: "right" as const,
    },
    {
      title: "Max",
      dataIndex: "maxStockLevel",
      key: "maxStockLevel",
      align: "right" as const,
    },
    {
      title: "Reorder Qty",
      dataIndex: "reorderQuantity",
      key: "reorderQuantity",
      align: "right" as const,
    },
    {
      title: "Alert",
      dataIndex: "isAlertActive",
      key: "isAlertActive",
      align: "center" as const,
      render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => openRuleModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 h-screen">
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
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchAlerts()}>
              Refresh
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openRuleModal()}>
              Add Reorder Rule
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={lowStockColumns} dataSource={lowStock} rowKey={(record: any) => `${record.productId}-${record.warehouseId}`} loading={alertsLoading} pagination={{ pageSize: 10 }} size="middle" />
      </Card>

      <Card
        title="Product Reorder Rules"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetchRules()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={reorderRuleColumns} dataSource={reorderRules} rowKey="id" loading={rulesLoading} pagination={{ pageSize: 10 }} size="middle" />
      </Card>

      <Modal
        title="Reorder Rule"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={isSavingRule}
        destroyOnClose
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRuleFinish}
          initialValues={{
            minStockLevel: 10,
            maxStockLevel: 100,
            reorderQuantity: 50,
            isAlertActive: true,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="productId" label="Product" rules={[{ required: true, message: "Select product" }]}>
              <Select
                placeholder="Select product"
                showSearch
                allowClear
                optionFilterProp="label"
                options={products.map((p: any) => ({
                  label: `${p.name || p.productName || "Unnamed Product"} ${p.sku || p.SKU || ""}`,
                  value: p.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true, message: "Select warehouse" }]}>
              <Select
                placeholder="Select warehouse"
                showSearch
                allowClear
                optionFilterProp="label"
                options={warehouses.map((w: any) => ({
                  label: w.name || w.warehouseName || w.location || "Warehouse",
                  value: w.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="minStockLevel" label="Minimum Stock Level" rules={[{ required: true, message: "Enter minimum stock" }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="maxStockLevel"
              label="Maximum Stock Level"
              dependencies={["minStockLevel"]}
              rules={[
                { required: true, message: "Enter maximum stock" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minStockLevel = Number(getFieldValue("minStockLevel") || 0);
                    if (Number(value || 0) >= minStockLevel) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Maximum stock must be greater than or equal to minimum stock"));
                  },
                }),
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="reorderQuantity" label="Reorder Quantity" rules={[{ required: true, message: "Enter reorder quantity" }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="isAlertActive" label="Low Stock Alert" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
