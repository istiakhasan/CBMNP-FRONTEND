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
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGRNsQuery,
  useCreateGRNMutation,
} from "@/redux/api/purchaseReturnsApi";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function GoodsReceiptPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetGRNsQuery(undefined);
  const { data: suppliersData } = useGetAllSupplierQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery(undefined);

  const [createGRN, { isLoading: isCreating }] = useCreateGRNMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        receivedDate: values.receivedDate.format("YYYY-MM-DD"),
      };
      await createGRN(payload).unwrap();
      message.success("Goods Receipt Note & QA Inspection recorded, stock updated!");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record GRN");
    }
  };

  const grns = data?.data || [];
  const suppliers = suppliersData?.data || [];
  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  const columns: any = [
    {
      title: "GRN #",
      dataIndex: "grnNumber",
      key: "grnNumber",
      render: (num: string) => <span className="font-bold text-blue-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "receivedDate",
      key: "receivedDate",
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
      title: "Challan #",
      dataIndex: "supplierDeliveryChallan",
      key: "supplierDeliveryChallan",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color="green">{st}</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Goods Receipt Notes (GRN) & Quality Inspection" />

      <Card
        title="Receiving & QA Records"
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
              Receive Goods (GRN + QA)
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={grns} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Record Goods Receipt Note & QA Inspection"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            receivedDate: dayjs(),
            items: [{ productId: undefined, orderedQuantity: 10, deliveredQuantity: 10, acceptedQuantity: 10, rejectedQuantity: 0 }],
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="supplierId" label="Supplier" rules={[{ required: true }]}>
              <Select placeholder="Select Supplier" showSearch optionFilterProp="children">
                {suppliers.map((s: any) => (
                  <Option key={s.id} value={s.id}>
                    {s.company || s.contactPerson || s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="warehouseId" label="Receiving Warehouse" rules={[{ required: true }]}>
              <Select
                placeholder="Select Warehouse"
                options={warehouses.map((w: any) => ({
                  label: w.name || w.warehouseName || w.location || "Warehouse",
                  value: w.id,
                }))}
              />
            </Form.Item>

            <Form.Item name="receivedDate" label="Receipt Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="supplierDeliveryChallan" label="Supplier Challan / Invoice #">
            <Input placeholder="e.g. CH-2025-998" />
          </Form.Item>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                <span className="font-semibold text-sm block">Inspected Items:</span>
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
                      <Form.Item {...restField} name={[name, "deliveredQuantity"]} rules={[{ required: true }]} className="m-0">
                        <InputNumber min={0} placeholder="Delivered" className="w-full" />
                      </Form.Item>
                    </div>

                    <div className="w-24">
                      <Form.Item {...restField} name={[name, "acceptedQuantity"]} rules={[{ required: true }]} className="m-0">
                        <InputNumber min={0} placeholder="Accepted (Stock)" className="w-full" />
                      </Form.Item>
                    </div>

                    <div className="w-24">
                      <Form.Item {...restField} name={[name, "rejectedQuantity"]} className="m-0">
                        <InputNumber min={0} placeholder="Rejected" className="w-full" />
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
