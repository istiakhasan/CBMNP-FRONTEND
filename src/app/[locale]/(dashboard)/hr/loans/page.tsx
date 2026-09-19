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
  Upload,
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
  useUploadSignedLoanDocumentMutation,
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
  const [uploadSignedDocument] = useUploadSignedLoanDocumentMutation();

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
  const uploadSignedFile = async (loanId: string, file: File) => { try { const formData = new FormData(); formData.append("document", file); await uploadSignedDocument({ id: loanId, formData }).unwrap(); message.success("Signed document attached"); refetch(); } catch (err: any) { message.error(err?.data?.message || "Document upload failed"); } return false; };
  const printLoanForm = (loan: any) => { const win = window.open("", "_blank", "width=820,height=900"); if (!win) return message.error("Allow pop-ups to print the form"); win.document.write(`<html><head><title>Advance Salary / Loan Application</title><style>body{font-family:Arial;padding:42px;color:#172033}h1{text-align:center}.row{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:12px 0}.sign{display:flex;justify-content:space-between;margin-top:120px}.sign div{width:28%;border-top:1px solid #333;padding-top:8px;text-align:center}</style></head><body><h1>Advance Salary / Loan Application</h1><p>Please obtain the required signatures and attach this signed copy before final HR approval.</p><div class="row"><b>Employee</b><span>${loan.employee?.fullName || "-"} (${loan.employee?.employeeCode || "-"})</span></div><div class="row"><b>Department</b><span>${loan.employee?.department?.name || "-"}</span></div><div class="row"><b>Request type</b><span>${loan.loanType}</span></div><div class="row"><b>Amount</b><span>BDT ${Number(loan.principalAmount || 0).toLocaleString()}</span></div><div class="row"><b>Installments</b><span>${loan.totalInstallments} month(s) · BDT ${Number(loan.monthlyEmiAmount || 0).toLocaleString()} per month</span></div><div class="row"><b>Reason</b><span>${loan.reason || "-"}</span></div><div class="sign"><div>Employee signature</div><div>Department Head recommendation</div><div>HR / Authorized approval</div></div></body></html>`); win.document.close(); win.focus(); win.print(); };

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
      width: 330,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space size="small" wrap className="justify-center">
          {record.status === "Pending" && (
            <>
              <Button size="small" onClick={() => printLoanForm(record)}>Print form</Button>
              <Upload accept=".pdf,.jpg,.jpeg,.png" showUploadList={false} beforeUpload={(file) => uploadSignedFile(record.id, file as File)}><Button size="small">{record.signedDocumentUrl ? "Replace signed copy" : "Attach signed copy"}</Button></Upload>
              <Popconfirm
                title={record.signedDocumentUrl ? "Approve loan and start payroll EMI deduction?" : "Attach the signed printed form before approving."}
                disabled={!record.signedDocumentUrl}
                onConfirm={() => handleStatusChange(record.id, "Approved")}
              >
                <Button disabled={!record.signedDocumentUrl} size="small" type="primary" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                  {record.signedDocumentUrl ? "Approve" : "Attach signed copy first"}
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
          scroll={{ x: 1450 }}
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
