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
import { PlusOutlined, ReloadOutlined, SendOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetTransfersQuery,
  useCreateTransferMutation,
  useDispatchTransferMutation,
  useReceiveTransferMutation,
} from "@/redux/api/inventoryOperationsApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function StockTransfersPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetTransfersQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery(undefined);

  const [createTransfer, { isLoading: isCreating }] = useCreateTransferMutation();
  const [dispatchTransfer] = useDispatchTransferMutation();
  const [receiveTransfer] = useReceiveTransferMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        transferDate: values.transferDate.format("YYYY-MM-DD"),
      };
      await createTransfer(payload).unwrap();
      message.success("Stock transfer created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create transfer");
    }
  };

  const handleDispatch = async (id: string) => {
    try {
      await dispatchTransfer(id).unwrap();
      message.success("Stock dispatched from source warehouse");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Dispatch failed");
    }
  };

  const handleReceive = async (id: string) => {
    try {
      await receiveTransfer({ id }).unwrap();
      message.success("Stock received into destination warehouse");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Receive failed");
    }
  };

  const transfers = data?.data || [];
  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const columns: any = [
    {
      title: "Transfer #",
      dataIndex: "transferNumber",
      key: "transferNumber",
      render: (num: string) => <span className="font-bold text-blue-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "transferDate",
      key: "transferDate",
    },
    {
      title: "From Warehouse",
      key: "fromWarehouse",
      render: (_: any, record: any) => (
        <span className="font-medium text-rose-700">
          {record.fromWarehouse?.name || record.fromWarehouseName || "Source Warehouse"}
        </span>
      ),
    },
    {
      title: "To Warehouse",
      key: "toWarehouse",
      render: (_: any, record: any) => (
        <span className="font-medium text-emerald-700">
          {record.toWarehouse?.name || record.toWarehouseName || "Destination Warehouse"}
        </span>
      ),
    },
    {
      title: "Items Count",
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
        <Tag color={st === "Received" ? "green" : st === "Dispatched" ? "blue" : "orange"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Draft" && (
            <Popconfirm
              title="Dispatch Stock"
              description="Deduct stock from source warehouse and dispatch?"
              onConfirm={() => handleDispatch(record.id)}
            >
              <Button size="small" type="primary">
                Dispatch
              </Button>
            </Popconfirm>
          )}
          {record.status === "Dispatched" && (
            <Popconfirm
              title="Receive Stock"
              description="Confirm arrival into destination warehouse?"
              onConfirm={() => handleReceive(record.id)}
            >
              <Button size="small" type="primary" className="bg-emerald-600">
                Receive
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Inter-Warehouse Stock Transfers" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 m-0">Stock Transfers Registry</h2>
          <p className="text-xs text-gray-500 m-0">Transfer inventory across warehouse branches with transit tracking</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          New Transfer
        </Button>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table columns={columns} dataSource={transfers} rowKey="id" loading={isLoading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* New Transfer Modal */}
      <Modal
        title="Create Inter-Warehouse Stock Transfer"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            transferDate: dayjs(),
            items: [{ productId: undefined, requestedQuantity: 1 }],
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="fromWarehouseId" label="Source Warehouse (From)" rules={[{ required: true }]}>
              <Select
                placeholder="Select Source"
                options={warehouses.map((w: any) => ({
                  label: w.name || w.warehouseName || w.location || "Warehouse",
                  value: w.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="toWarehouseId" label="Destination Warehouse (To)" rules={[{ required: true }]}>
              <Select
                placeholder="Select Destination"
                options={warehouses.map((w: any) => ({
                  label: w.name || w.warehouseName || w.location || "Warehouse",
                  value: w.id,
                }))}
              />
            </Form.Item>
          </div>

          <Form.Item name="transferDate" label="Transfer Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                <span className="font-semibold text-sm block">Transfer Products:</span>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <Form.Item
                        {...restField}
                        name={[name, "productId"]}
                        rules={[{ required: true, message: "Select product" }]}
                        className="m-0"
                      >
                        <Select placeholder="Select Product" showSearch optionFilterProp="children">
                          {products.map((p: any) => (
                            <Option key={p.id} value={p.id}>
                              {p.name || p.productName} ({p.sku})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="w-32">
                      <Form.Item
                        {...restField}
                        name={[name, "requestedQuantity"]}
                        rules={[{ required: true }]}
                        className="m-0"
                      >
                        <InputNumber min={1} placeholder="Qty" className="w-full" />
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
                  Add Product
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
