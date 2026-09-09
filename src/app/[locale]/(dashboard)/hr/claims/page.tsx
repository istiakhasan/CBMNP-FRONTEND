"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Popconfirm,
  Image,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetExpenseClaimsQuery,
  useSubmitExpenseClaimMutation,
  useApproveExpenseClaimMutation,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function ExpenseClaimsPage() {
  const [claimModal, setClaimModal] = useState(false);
  const [form] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetExpenseClaimsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [submitClaim, { isLoading: isSubmitting }] = useSubmitExpenseClaimMutation();
  const [approveClaim] = useApproveExpenseClaimMutation();

  const claims = data?.data || [];
  const employees = employeesData?.data || [];

  const totalReimbursed = claims
    .filter((c: any) => c.status === "Reimbursed")
    .reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);

  const pendingClaimsCount = claims.filter((c: any) => c.status === "Pending").length;
  const approvedClaimsCount = claims.filter((c: any) => c.status === "Approved").length;

  const handleSubmitClaim = async (values: any) => {
    try {
      await submitClaim(values).unwrap();
      message.success("Expense reimbursement claim submitted");
      setClaimModal(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit expense claim");
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await approveClaim({ id, approved, remarks: "Reviewed by HR/Accounts" }).unwrap();
      message.success(`Claim ${approved ? "Approved for next payroll reimbursement" : "Rejected"}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update claim");
    }
  };

  const columns: any = [
    {
      title: "Expense Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (d: string) => <span className="font-mono text-xs">{d}</span>,
    },
    {
      title: "Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-bold text-gray-900 block text-sm">{name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {record.employee?.employeeCode} • {record.employee?.department?.name || "Staff"}
          </span>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Amount (BDT)",
      dataIndex: "amount",
      key: "amount",
      render: (amt: number) => (
        <span className="font-bold text-emerald-800 text-sm">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Description / Purpose",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => <span className="text-xs text-gray-700 block max-w-xs">{desc}</span>,
    },
    {
      title: "Bill / Receipt",
      dataIndex: "receiptUrl",
      key: "receiptUrl",
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 flex items-center gap-1">
            <PaperClipOutlined /> View Receipt
          </a>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag
          color={st === "Reimbursed" ? "green" : st === "Approved" ? "cyan" : st === "Pending" ? "orange" : "volcano"}
        >
          {st}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Pending" && (
            <>
              <Popconfirm
                title="Approve expense for payroll reimbursement?"
                onConfirm={() => handleApprove(record.id, true)}
              >
                <Button size="small" type="primary" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                  Approve
                </Button>
              </Popconfirm>
              <Button size="small" danger onClick={() => handleApprove(record.id, false)}>
                Reject
              </Button>
            </>
          )}
          {record.status === "Approved" && (
            <Tag color="cyan">Ready for Payroll Disbursal</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Staff Expense Claims & Official Reimbursements" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Pending Expense Claims</span>}
              value={pendingClaimsCount}
              prefix={<ClockCircleOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Approved for Payroll</span>}
              value={approvedClaimsCount}
              prefix={<CheckCircleOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Reimbursed (BDT)</span>}
              value={totalReimbursed}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Claims Filed</span>}
              value={claims.length}
              prefix={<FileDoneOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Expense Reimbursement Claims Ledger"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setClaimModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Submit Expense Claim
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={claims}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* MODAL: SUBMIT CLAIM */}
      <Modal
        title="Submit Expense Reimbursement Claim"
        open={claimModal}
        onCancel={() => setClaimModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitClaim}>
          <Form.Item
            name="employeeId"
            label="Claiming Employee"
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

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="Expense Category"
              initialValue="Travel & Conveyance"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Travel & Conveyance">Travel & Conveyance</Option>
                <Option value="Client Entertainment">Client Entertainment / Food</Option>
                <Option value="Office Supplies">Office Stationery & Supplies</Option>
                <Option value="Medical / Health">Medical / Emergency</Option>
                <Option value="Internet & Mobile Bill">Internet & Mobile Bill</Option>
                <Option value="Other Expenses">Other Expenses</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="expenseDate"
              label="Expense Date"
              initialValue={dayjs().format("YYYY-MM-DD")}
              rules={[{ required: true }]}
            >
              <Input type="date" className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="amount"
              label="Claim Amount (BDT ৳)"
              rules={[{ required: true, message: "Please enter claim amount" }]}
            >
              <InputNumber min={1} className="w-full font-bold text-emerald-700" prefix="৳" />
            </Form.Item>

            <Form.Item name="receiptUrl" label="Receipt / Voucher Link">
              <Input placeholder="https://drive.google.com/..." />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description / Business Purpose"
            rules={[{ required: true, message: "Please provide description" }]}
          >
            <Input.TextArea rows={3} placeholder="Details about travel route, client meeting, items purchased..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setClaimModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Submit Claim for Approval
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
