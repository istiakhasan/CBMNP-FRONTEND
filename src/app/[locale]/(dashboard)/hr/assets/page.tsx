"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  LaptopOutlined,
  CheckCircleOutlined,
  UndoOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetAssetsQuery,
  useAssignAssetMutation,
  useUpdateAssetStatusMutation,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function AssetsPage() {
  const [assetModal, setAssetModal] = useState(false);
  const [form] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetAssetsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [assignAsset, { isLoading: isAssigning }] = useAssignAssetMutation();
  const [updateStatus] = useUpdateAssetStatusMutation();

  const assets = data?.data || [];
  const employees = employeesData?.data || [];

  const assignedCount = assets.filter((a: any) => a.status === "Assigned").length;
  const returnedCount = assets.filter((a: any) => a.status === "Returned").length;

  const handleAssign = async (values: any) => {
    try {
      await assignAsset(values).unwrap();
      message.success("Asset assigned to employee successfully");
      setAssetModal(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to assign asset");
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await updateStatus({ id, status: "Returned", conditionNotes: "Returned in working order" }).unwrap();
      message.success("Asset marked as returned");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update asset");
    }
  };

  const columns: any = [
    {
      title: "Asset Details",
      dataIndex: "assetName",
      key: "assetName",
      render: (name: string, r: any) => (
        <div>
          <span className="font-bold text-gray-900 block text-sm">{name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {r.assetCode ? `Code: ${r.assetCode}` : ""} {r.serialNumber ? `• SN: ${r.serialNumber}` : ""}
          </span>
        </div>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, r: any) => (
        <div>
          <span className="font-semibold text-gray-800 text-xs block">{name}</span>
          <span className="text-[11px] text-gray-400 font-mono">
            {r.employee?.employeeCode} • {r.employee?.department?.name || "Staff"}
          </span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat || "IT Hardware"}</Tag>,
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      key: "assignedDate",
      render: (d: string) => <span className="font-mono text-xs">{d}</span>,
    },
    {
      title: "Condition & Notes",
      dataIndex: "conditionNotes",
      key: "notes",
      render: (n: string) => <span className="text-xs text-gray-600 block max-w-xs">{n || "Good"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Assigned" ? "green" : st === "Returned" ? "blue" : "volcano"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Assigned" && (
            <Popconfirm
              title="Mark this asset as returned by employee?"
              onConfirm={() => handleReturn(record.id)}
            >
              <Button size="small" icon={<UndoOutlined />} className="text-xs text-blue-600">
                Return Asset
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Company IT & Office Asset Management" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Assigned in Field</span>}
              value={assignedCount}
              prefix={<LaptopOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Returned to Inventory</span>}
              value={returnedCount}
              prefix={<CheckCircleOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Tracked Assets</span>}
              value={assets.length}
              prefix={<SafetyCertificateOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Asset Distribution Registry"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAssetModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Assign New Asset
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={assets}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* MODAL: ASSIGN ASSET */}
      <Modal
        title="Assign Asset to Employee"
        open={assetModal}
        onCancel={() => setAssetModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="employeeId"
            label="Assign to Employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select
              placeholder="Search employee..."
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assetName"
            label="Asset Item Name"
            rules={[{ required: true, message: "Please enter asset name" }]}
          >
            <Input placeholder="e.g. Dell Latitude 5420 Laptop, 4G SIM Card, Door Access Card" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category" initialValue="IT Hardware">
              <Select>
                <Option value="IT Hardware">IT Hardware (Laptop, Desktop, Monitor)</Option>
                <Option value="Mobile & SIM">Mobile Phone & Official SIM</Option>
                <Option value="Keys & Access Cards">Keys & Security Access Badge</Option>
                <Option value="Office Furniture">Office Equipment & Furniture</Option>
                <Option value="Company Vehicle">Company Car / Motorbike</Option>
              </Select>
            </Form.Item>

            <Form.Item name="assetCode" label="Internal Asset Code">
              <Input placeholder="e.g. AST-IT-0089" className="font-mono" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="serialNumber" label="Hardware Serial Number">
              <Input placeholder="e.g. SN-89241940" className="font-mono" />
            </Form.Item>

            <Form.Item
              name="assignedDate"
              label="Date Handed Over"
              initialValue={dayjs().format("YYYY-MM-DD")}
              rules={[{ required: true }]}
            >
              <Input type="date" className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="conditionNotes" label="Handover Condition & Accessories">
            <Input.TextArea rows={2} placeholder="Includes charger, original box, bag, pristine condition..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setAssetModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isAssigning}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Assign Asset
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
