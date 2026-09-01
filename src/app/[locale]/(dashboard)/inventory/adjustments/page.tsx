"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Tag,
  Space,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, ReloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useApproveAdjustmentMutation,
} from "@/redux/api/inventoryOperationsApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function StockAdjustmentsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAdjustmentsQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery(undefined);

  const [createAdjustment, { isLoading: isCreating }] = useCreateAdjustmentMutation();
  const [approveAdjustment] = useApproveAdjustmentMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        adjustmentDate: values.adjustmentDate.format("YYYY-MM-DD"),
      };
      await createAdjustment(payload).unwrap();
      message.success("Stock adjustment created");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create adjustment");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveAdjustment(id).unwrap();
      message.success("Stock adjustment approved & reconciled");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Approval failed");
    }
  };

  const adjustments = data?.data || [];
  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const columns: any = [
    {
      title: "Adjustment #",
      dataIndex: "adjustmentNumber",
      key: "adjustmentNumber",
      render: (num: string) => <span className="font-bold text-rose-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "adjustmentDate",
      key: "adjustmentDate",
    },
    {
      title: "Warehouse",
      dataIndex: ["warehouse", "name"],
      key: "warehouse",
      render: (name: string) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (r: string) => <Tag color="volcano">{r}</Tag>,
    },
    {
      title: "Items Adjusted",
      dataIndex: "items",
      key: "items",
      render: (items: any[]) => <span>{items?.length || 0} Products</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Approved" ? "green" : "orange"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "PendingApproval" && (
            <Popconfirm
              title="Approve Adjustment"
              description="Reconcile inventory stock with physical counts?"
              onConfirm={() => handleApprove(record.id)}
            >
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} style={{ backgroundColor: "#52c41a" }}>
                Approve
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Stock Adjustments & Physical Counts" />

      <Card
        title="Inventory Variance Adjustments"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              New Physical Count Adjustment
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={adjustments} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Record Stock Adjustment"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
        width={750}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            adjustmentDate: dayjs(),
            reason: "CountMismatch",
            items: [{ productId: undefined, systemQuantity: 0, countedQuantity: 0, unitCost: 0 }],
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
              <Select
                placeholder="Select Warehouse"
                options={warehouses.map((w: any) => ({
                  label: w.name || w.warehouseName || w.location || "Warehouse",
                  value: w.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="reason" label="Adjustment Reason" rules={[{ required: true }]}>
              <Select>
                <Option value="CountMismatch">Physical Count Mismatch</Option>
                <Option value="Damage">Damaged Goods</Option>
                <Option value="Expired">Expired Stock</Option>
                <Option value="TheftOrLoss">Theft / Loss</Option>
                <Option value="FoundStock">Found Extra Stock</Option>
              </Select>
            </Form.Item>

            <Form.Item name="adjustmentDate" label="Audit Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                <span className="font-semibold text-sm block">Variance Products:</span>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <Form.Item
                        {...restField}
                        name={[name, "productId"]}
                        rules={[{ required: true }]}
                        className="m-0"
                      >
                        <Select placeholder="Select Product" showSearch optionFilterProp="children">
                          {products.map((p: any) => (
                            <Option key={p.id} value={p.id}>
                              {p.name || p.productName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="w-28">
                      <Form.Item {...restField} name={[name, "systemQuantity"]} className="m-0">
                        <InputNumber min={0} placeholder="System Qty" className="w-full" />
                      </Form.Item>
                    </div>

                    <div className="w-28">
                      <Form.Item {...restField} name={[name, "countedQuantity"]} className="m-0" rules={[{ required: true }]}>
                        <InputNumber min={0} placeholder="Counted Qty" className="w-full" />
                      </Form.Item>
                    </div>

                    <div className="w-28">
                      <Form.Item {...restField} name={[name, "unitCost"]} className="m-0">
                        <InputNumber min={0} placeholder="Unit Cost" className="w-full" />
                      </Form.Item>
                    </div>

                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Item
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
