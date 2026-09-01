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
import { PlusOutlined, ReloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetQuotationsQuery,
  useCreateQuotationMutation,
  useConvertToOrderMutation,
} from "@/redux/api/salesOperationsApi";
import { useGetAllCustomersQuery } from "@/redux/api/customerApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function QuotationsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetQuotationsQuery(undefined);
  const { data: customersData } = useGetAllCustomersQuery(undefined);
  const { data: productsData } = useGetAllProductQuery(undefined);

  const [createQuotation, { isLoading: isCreating }] = useCreateQuotationMutation();
  const [convertToOrder] = useConvertToOrderMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        quotationDate: values.quotationDate.format("YYYY-MM-DD"),
        expiryDate: values.expiryDate.format("YYYY-MM-DD"),
      };
      await createQuotation(payload).unwrap();
      message.success("Quotation created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create quotation");
    }
  };

  const handleConvert = async (id: string) => {
    try {
      const res = await convertToOrder(id).unwrap();
      message.success(`Quotation successfully converted to Order #${res.data?.order?.orderId || ""}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Conversion failed");
    }
  };

  const quotations = data?.data || [];
  const customers = customersData?.data || [];
  const products = productsData?.data || [];

  const columns: any = [
    {
      title: "Quotation #",
      dataIndex: "quotationNumber",
      key: "quotationNumber",
      render: (num: string) => <span className="font-bold text-blue-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "quotationDate",
      key: "quotationDate",
    },
    {
      title: "Valid Until",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Customer",
      dataIndex: ["customer", "customerName"],
      key: "customer",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name || record.customer?.fullName || record.customer?.name}</span>
          <span className="text-xs text-gray-400 block">{record.customer?.customerPhoneNumber || record.customer?.phone}</span>
        </div>
      ),
    },
    {
      title: "Grand Total (Tk)",
      dataIndex: "grandTotal",
      key: "grandTotal",
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
      render: (st: string) => (
        <Tag color={st === "Converted" ? "green" : st === "Draft" ? "orange" : "blue"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status !== "Converted" && (
            <Popconfirm
              title="Convert to Live Order"
              description="Convert this quotation to an active customer order?"
              onConfirm={() => handleConvert(record.id)}
            >
              <Button size="small" type="primary" icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#52c41a" }}>
                Convert to Order
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Quotations & Sales Estimates" />

      <Card
        title="Price Quotations"
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
              Create Quotation
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={quotations} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Create Price Quotation"
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
            quotationDate: dayjs(),
            expiryDate: dayjs().add(14, "day"),
            discountAmount: 0,
            deliveryCharge: 0,
            items: [{ productId: undefined, quantity: 1, unitPrice: 0 }],
          }}
        >
          <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
            <Select placeholder="Select Customer" showSearch optionFilterProp="children">
              {customers.map((c: any) => (
                <Option key={c.id} value={c.id}>
                  {c.customerName || c.fullName || c.name} ({c.customerPhoneNumber || c.phone})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="quotationDate" label="Quotation Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="expiryDate" label="Validity Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                <span className="font-semibold text-sm block">Quotation Line Items:</span>
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

                    <div className="w-24">
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

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Form.Item name="discountAmount" label="Discount Amount (Tk)">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="deliveryCharge" label="Delivery Charge (Tk)">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
