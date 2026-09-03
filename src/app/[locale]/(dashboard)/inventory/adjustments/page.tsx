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
  const { data: productsData } = useGetAllProductQuery({
    limit:"1000"
  });

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
  onCancel={() => {
    setModalOpen(false);
    form.resetFields();
  }}
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
      adjustmentDate: dayjs(),
      reason: "CountMismatch",
      items: [
        {
          productId: undefined,
          systemQuantity: 0,
          countedQuantity: 0,
          unitCost: 0,
        },
      ],
    }}
  >
    {/* Adjustment Information */}
    <div className="grid grid-cols-3 gap-4">
      <Form.Item
        name="warehouseId"
        label="Warehouse"
        rules={[
          {
            required: true,
            message: "Please select a warehouse",
          },
        ]}
      >
        <Select
          placeholder="Select a warehouse"
          allowClear
          showSearch
          optionFilterProp="label"
          options={warehouses.map((w: any) => ({
            label:
              w.name ||
              w.warehouseName ||
              w.location ||
              "Warehouse",
            value: w.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="reason"
        label="Adjustment Reason"
        rules={[
          {
            required: true,
            message: "Please select an adjustment reason",
          },
        ]}
      >
        <Select placeholder="Select adjustment reason">
          <Option value="CountMismatch">
            Physical Count Mismatch
          </Option>
          <Option value="Damage">
            Damaged Goods
          </Option>
          <Option value="Expired">
            Expired Stock
          </Option>
          <Option value="TheftOrLoss">
            Theft / Loss
          </Option>
          <Option value="FoundStock">
            Found Extra Stock
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="adjustmentDate"
        label="Audit Date"
        rules={[
          {
            required: true,
            message: "Please select the audit date",
          },
        ]}
      >
        <DatePicker
          className="w-full"
          placeholder="Select audit date"
          format="DD-MM-YYYY"
        />
      </Form.Item>
    </div>

    {/* Products */}
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">
              Variance Products
            </span>

            <span className="text-xs text-gray-500">
              Add products and enter physical count details
            </span>
          </div>

          {fields.map(({ key, name, ...restField }) => (
            <div
              key={key}
              className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-lg border"
            >
              {/* Product */}
        
{/* Product */}

{/* Product */}
<div className="col-span-4">
  <Form.Item
    {...restField}
    name={[name, "productId"]}
    label="Product"
    rules={[
      {
        required: true,
        message: "Please select a product",
      },
    ]}
    className="mb-0"
  >
    <Select
      placeholder="Select product"
      showSearch
      allowClear
      optionFilterProp="label"
      popupMatchSelectWidth={false}
      className="w-full"
      options={products.map((p: any) => {
        const productName =
          p.name || p.productName || "Unnamed Product";

        const sku = p.sku || p.SKU || "N/A";

        return {
          value: p.id,

          // Search করার জন্য Product Name + SKU
          label: `${productName} ${sku}`,

          // Dropdown-এর ভিতরের সুন্দর UI
          children: (
            <div className="py-1">
              <div className="font-medium text-gray-800 whitespace-normal break-words">
                {productName}
              </div>

              <div className="text-xs text-gray-500 mt-0.5">
                SKU: {sku}
              </div>
            </div>
          ),
        };
      })}
    />
  </Form.Item>
</div>




              {/* System Quantity */}
              <div className="col-span-2">
                <Form.Item
                  {...restField}
                  name={[name, "systemQuantity"]}
                  label="System Qty"
                  rules={[
                    {
                      required: true,
                      message: "Enter system quantity",
                    },
                  ]}
                  className="mb-0"
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="System qty"
                  />
                </Form.Item>
              </div>

              {/* Counted Quantity */}
              <div className="col-span-2">
                <Form.Item
                  {...restField}
                  name={[name, "countedQuantity"]}
                  label="Counted Qty"
                  rules={[
                    {
                      required: true,
                      message: "Enter counted quantity",
                    },
                  ]}
                  className="mb-0"
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Physical qty"
                  />
                </Form.Item>
              </div>

              {/* Unit Cost */}
              <div className="col-span-2">
                <Form.Item
                  {...restField}
                  name={[name, "unitCost"]}
                  label="Unit Cost"
                  rules={[
                    {
                      required: true,
                      message: "Enter unit cost",
                    },
                  ]}
                  className="mb-0"
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Unit cost"
                    precision={2}
                  />
                </Form.Item>
              </div>

              {/* Remove */}
              <div className="col-span-2">
                {fields.length > 1 && (
                  <Button
                    danger
                    block
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={() =>
              add({
                productId: undefined,
                systemQuantity: 0,
                countedQuantity: 0,
                unitCost: 0,
              })
            }
            block
            icon={<PlusOutlined />}
          >
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
