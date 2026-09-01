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
  Input,
  Card,
  Tag,
  Space,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, ReloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetPurchaseReturnsQuery,
  useCreatePurchaseReturnMutation,
  useApprovePurchaseReturnMutation,
} from "@/redux/api/purchaseReturnsApi";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function PurchaseReturnsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetPurchaseReturnsQuery(undefined);
  const { data: suppliersData } = useGetAllSupplierQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery(undefined);

  const [createReturn, { isLoading: isCreating }] = useCreatePurchaseReturnMutation();
  const [approveReturn] = useApprovePurchaseReturnMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        returnDate: values.returnDate.format("YYYY-MM-DD"),
      };
      await createReturn(payload).unwrap();
      message.success("Purchase return created");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create return");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReturn(id).unwrap();
      message.success("Purchase return approved & Debit Note generated");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Approval failed");
    }
  };

  const returns = data?.data || [];
  const suppliers = suppliersData?.data || [];
  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const columns: any = [
    {
      title: "Return #",
      dataIndex: "returnNumber",
      key: "returnNumber",
      render: (num: string) => <span className="font-bold text-rose-600">{num}</span>,
    },
    {
      title: "Debit Note #",
      dataIndex: "debitNoteNumber",
      key: "debitNoteNumber",
      render: (num: string) => num ? <span className="font-bold text-blue-600">{num}</span> : <span className="text-gray-400">-</span>,
    },
    {
      title: "Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "Supplier",
      dataIndex: ["supplier", "company"],
      key: "supplier",
      render: (name: string, record: any) => (
        <span className="font-semibold">{name || record.supplier?.contactPerson || record.supplier?.name}</span>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: ["warehouse", "name"],
      key: "warehouse",
    },
    {
      title: "Total Return (Tk)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-bold text-gray-900">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Approved" ? "green" : "orange"}>{st}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Draft" && (
            <Popconfirm
              title="Approve Purchase Return"
              description="Deduct stock from warehouse and issue Debit Note?"
              onConfirm={() => handleApprove(record.id)}
            >
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} style={{ backgroundColor: "#52c41a" }}>
                Approve Return
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Purchase Returns & Debit Notes" />

      <Card
        title="Supplier Returns Register"
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
              Create Purchase Return
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={returns} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Create Purchase Return to Supplier"
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
            returnDate: dayjs(),
            items: [{ productId: undefined, quantity: 1, unitPrice: 0 }],
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="supplierId" label="Supplier" rules={[{ required: true }]}>
              <Select placeholder="Select Supplier" showSearch optionFilterProp="children">
                {suppliers.map((s: any) => (
                  <Option key={s.id} value={s.id}>
                    {s.company || s.contactPerson || s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="warehouseId" label="Return From Warehouse" rules={[{ required: true }]}>
              <Select placeholder="Select Warehouse">
                {warehouses.map((w: any) => (
                  <Option key={w.id} value={w.id}>
                    {w.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="returnDate" label="Return Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="reason" label="Return Reason">
              <Input placeholder="e.g. Expired batch or damaged in shipping" />
            </Form.Item>
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                <span className="font-semibold text-sm block">Return Line Items:</span>
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
                      <Form.Item {...restField} name={[name, "quantity"]} rules={[{ required: true }]} className="m-0">
                        <InputNumber min={1} placeholder="Qty" className="w-full" />
                      </Form.Item>
                    </div>

                    <div className="w-28">
                      <Form.Item {...restField} name={[name, "unitPrice"]} rules={[{ required: true }]} className="m-0">
                        <InputNumber min={0} placeholder="Price" className="w-full" />
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
