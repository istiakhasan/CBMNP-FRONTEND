"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Card,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined, ShopOutlined } from "@ant-design/icons";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
} from "@/redux/api/governanceApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function BranchesPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetBranchesQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();

  const handleFinish = async (values: any) => {
    try {
      await createBranch(values).unwrap();
      message.success("Branch outlet registered successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create branch");
    }
  };

  const branches = data?.data || [];
  const warehouses = warehousesData?.data || [];

  const columns: any = [
    {
      title: "Branch Code",
      dataIndex: "branchCode",
      key: "branchCode",
      render: (code: string) => <span className="font-bold text-blue-600">{code}</span>,
    },
    {
      title: "Outlet / Branch Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Default Warehouse",
      dataIndex: ["defaultWarehouse", "name"],
      key: "defaultWarehouse",
      render: (w: string) => <Tag color="blue">{w || "Default"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center" as const,
      render: (active: boolean) => (
        <Tag color={active ? "success" : "default"}>{active ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Multi-Branch & Retail Outlets" />

      <Card
        title="Business Branches & Outlets"
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
              Add Branch
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={branches} rowKey="id" loading={isLoading} pagination={false} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Register New Branch / Retail Outlet"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isActive: true }}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="branchCode" label="Branch Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. BR-DHK-01" />
            </Form.Item>

            <Form.Item name="name" label="Branch Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Dhanmondi Outlet" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="city" label="City">
              <Input placeholder="e.g. Dhaka" />
            </Form.Item>

            <Form.Item name="phone" label="Contact Phone">
              <Input placeholder="e.g. 01711000000" />
            </Form.Item>
          </div>

          <Form.Item name="defaultWarehouseId" label="Linked Warehouse Location">
            <Select
              placeholder="Select Warehouse"
              allowClear
              options={warehouses.map((w: any) => ({
                label: w.name || w.warehouseName || w.location || "Warehouse",
                value: w.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="address" label="Physical Address">
            <Input.TextArea rows={2} placeholder="Full address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
