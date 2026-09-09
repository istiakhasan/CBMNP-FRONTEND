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
  Progress,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BankOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetLoansQuery,
  useRequestLoanMutation,
  useUpdateLoanStatusMutation,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function LoansPage() {
  const [loanModal, setLoanModal] = useState(false);
  const [form] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetLoansQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [requestLoan, { isLoading: isRequesting }] = useRequestLoanMutation();
  const [updateLoanStatus] = useUpdateLoanStatusMutation();

  const loans = data?.data || [];
  const employees = employeesData?.data || [];

  const totalDisbursedLoans = loans
    .filter((l: any) => l.status === "Approved" || l.status === "Running" || l.status === "Paid")
    .reduce((sum: number, l: any) => sum + Number(l.principalAmount || 0), 0);

  const activeLoanCount = loans.filter((l: any) => l.status === "Approved" || l.status === "Running").length;
  const pendingRequests = loans.filter((l: any) => l.status === "Pending").length;

  const handleRequestLoan = async (values: any) => {
    try {
      await requestLoan(values).unwrap();
      message.success("Advance salary / loan application submitted");
      setLoanModal(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit loan request");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateLoanStatus({ id, status }).unwrap();
      message.success(`Loan status updated to ${status}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update loan status");
    }
  };

  const columns: any = [
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
      title: "Loan Type",
      dataIndex: "loanType",
      key: "loanType",
      render: (t: string) => <Tag color="blue">{t || "Salary Advance"}</Tag>,
    },
    {
      title: "Principal (BDT)",
      dataIndex: "principalAmount",
      key: "principalAmount",
      render: (amt: number) => (
        <span className="font-bold text-gray-900">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Monthly EMI Deduction",
      key: "emi",
      render: (_: any, r: any) => (
        <div>
          <span className="font-bold text-rose-600 block text-xs">
            ৳{Number(r.monthlyEmiAmount || 0).toLocaleString()} / mo
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            Over {r.totalInstallments} Month(s)
          </span>
        </div>
      ),
    },
    {
      title: "Repayment Progress",
      key: "progress",
      render: (_: any, r: any) => {
        const principal = Number(r.principalAmount || 1);
        const paid = Number(r.totalPaidAmount || 0);
        const pct = Math.min(100, Math.round((paid / principal) * 100));
        return (
          <div className="w-36">
            <Progress percent={pct} size="small" status={pct >= 100 ? "success" : "active"} />
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Approved" ? "green" : st === "Pending" ? "orange" : st === "Paid" ? "blue" : "volcano"}>
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
                title="Approve loan and start payroll EMI deduction?"
                onConfirm={() => handleStatusChange(record.id, "Approved")}
              >
                <Button size="small" type="primary" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                  Approve
                </Button>
              </Popconfirm>
              <Button
                size="small"
                danger
                onClick={() => handleStatusChange(record.id, "Rejected")}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === "Approved" && (
            <Tag color="cyan">Payroll Auto-Deduction Active</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Advance Salary & Company Loan Management" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Disbursed Loans</span>}
              value={totalDisbursedLoans}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Active Running Loans</span>}
              value={activeLoanCount}
              prefix={<CreditCardOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Pending Requests</span>}
              value={pendingRequests}
              prefix={<ClockCircleOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Loan Records</span>}
              value={loans.length}
              prefix={<BankOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Employee Loan & Advance Salary Ledger"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setLoanModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Request Loan / Advance
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={loans}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* MODAL: REQUEST LOAN */}
      <Modal
        title="New Employee Loan / Advance Salary Application"
        open={loanModal}
        onCancel={() => setLoanModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleRequestLoan}>
          <Form.Item
            name="employeeId"
            label="Select Employee"
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
                  {emp.fullName} ({emp.employeeCode} - Basic: ৳{Number(emp.basicSalary || 0).toLocaleString()})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="loanType" label="Application Type" initialValue="Salary Advance">
            <Select>
              <Option value="Salary Advance">Salary Advance (1-2 Months)</Option>
              <Option value="Company Loan">Company Loan (Long-term EMI)</Option>
              <Option value="Emergency Fund">Emergency Medical / Family Fund</Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="principalAmount"
              label="Loan Amount (BDT ৳)"
              initialValue={20000}
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber min={1000} className="w-full font-bold text-emerald-700" prefix="৳" />
            </Form.Item>

            <Form.Item
              name="totalInstallments"
              label="Repayment Months (EMI)"
              initialValue={4}
              rules={[{ required: true, message: "Please specify installments" }]}
            >
              <InputNumber min={1} max={36} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="reason" label="Purpose / Reason for Loan" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="State reason for advance salary..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setLoanModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isRequesting}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Submit Loan Application
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
