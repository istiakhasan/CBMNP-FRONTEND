"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Drawer,
  Divider,
  Popconfirm,
  Badge,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetPayrollSheetsQuery,
  useGeneratePayrollMutation,
  useDisbursePayrollMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function PayrollPage() {
  const [generateModal, setGenerateModal] = useState(false);
  const [sheetDrawer, setSheetDrawer] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [payslipModal, setPayslipModal] = useState(false);
  const [selectedPayslipItem, setSelectedPayslipItem] = useState<any>(null);

  const [form] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetPayrollSheetsQuery(undefined);

  // Mutations
  const [generatePayroll, { isLoading: isGenerating }] = useGeneratePayrollMutation();
  const [disbursePayroll, { isLoading: isDisbursing }] = useDisbursePayrollMutation();

  const sheets = data?.data || [];

  const totalDisbursed = sheets
    .filter((s: any) => s.status === "Disbursed")
    .reduce((sum: number, s: any) => sum + Number(s.totalNetSalary || 0), 0);

  const pendingPayroll = sheets
    .filter((s: any) => s.status === "Draft")
    .reduce((sum: number, s: any) => sum + Number(s.totalNetSalary || 0), 0);

  const handleGenerate = async (values: any) => {
    try {
      await generatePayroll(values).unwrap();
      message.success("Monthly payroll sheet generated successfully");
      setGenerateModal(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to generate payroll");
    }
  };

  const handleDisburse = async (sheetId: string) => {
    try {
      await disbursePayroll(sheetId).unwrap();
      message.success("Monthly payroll disbursed successfully");
      refetch();
      if (selectedSheet) {
        setSelectedSheet({ ...selectedSheet, status: "Disbursed" });
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to disburse payroll");
    }
  };

  const handleOpenSheet = (sheet: any) => {
    setSelectedSheet(sheet);
    setSheetDrawer(true);
  };

  const handleOpenPayslip = (item: any) => {
    setSelectedPayslipItem(item);
    setPayslipModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const sheetColumns: any = [
    {
      title: "Payroll Sheet",
      dataIndex: "sheetName",
      key: "sheetName",
      render: (name: string) => <span className="font-bold text-gray-900">{name}</span>,
    },
    {
      title: "Gross Salary",
      dataIndex: "totalGrossSalary",
      key: "totalGrossSalary",
      render: (amt: number) => (
        <span className="font-semibold text-gray-700">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Commissions",
      dataIndex: "totalCommissions",
      key: "totalCommissions",
      render: (amt: number) => (
        <span className="font-semibold text-emerald-700">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Deductions",
      dataIndex: "totalDeductions",
      key: "totalDeductions",
      render: (amt: number) => (
        <span className="font-semibold text-rose-600">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Net Payable (BDT)",
      dataIndex: "totalNetSalary",
      key: "totalNetSalary",
      render: (amt: number) => (
        <span className="font-bold text-emerald-800 text-sm">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Disbursed" ? "green" : "orange"} className="font-medium">
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
          <Button
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleOpenSheet(record)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Sheet
          </Button>
          {record.status === "Draft" && (
            <Popconfirm
              title="Disburse this payroll?"
              description="This will finalize payouts and mark all salary items as Paid."
              onConfirm={() => handleDisburse(record.id)}
            >
              <Button size="small" type="primary" className="bg-emerald-600 hover:bg-emerald-700">
                Disburse
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const itemColumns: any = [
    {
      title: "Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-bold text-gray-900 block text-xs">{name}</span>
          <span className="text-[11px] text-gray-400">
            {record.employee?.employeeCode} • {record.employee?.department?.name || "Staff"}
          </span>
        </div>
      ),
    },
    {
      title: "Basic Salary",
      dataIndex: "basicSalary",
      key: "basicSalary",
      render: (amt: number) => <span>৳{Number(amt || 0).toLocaleString()}</span>,
    },
    {
      title: "Allowances",
      dataIndex: "totalAllowances",
      key: "totalAllowances",
      render: (amt: number) => <span className="text-emerald-700">৳{Number(amt || 0).toLocaleString()}</span>,
    },
    {
      title: "Commissions",
      dataIndex: "commissionsEarned",
      key: "commissionsEarned",
      render: (amt: number) => <span className="text-purple-700">৳{Number(amt || 0).toLocaleString()}</span>,
    },
    {
      title: "Deductions",
      dataIndex: "taxDeductions",
      key: "taxDeductions",
      render: (amt: number) => <span className="text-rose-600">৳{Number(amt || 0).toLocaleString()}</span>,
    },
    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
      render: (amt: number) => (
        <span className="font-bold text-emerald-800">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Paid" ? "green" : "default"}>{st}</Tag>,
    },
    {
      title: "Payslip",
      key: "payslip",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          size="small"
          icon={<PrinterOutlined />}
          onClick={() => handleOpenPayslip(record)}
          className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
        >
          Slip
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Monthly Payroll & Payslip Generation" />

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Disbursed (BDT)</span>}
              value={totalDisbursed}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Pending Draft Payroll</span>}
              value={pendingPayroll}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Payroll Sheets</span>}
              value={sheets.length}
              prefix={<FileTextOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Active Disbursed</span>}
              value={sheets.filter((s: any) => s.status === "Disbursed").length}
              prefix={<SafetyCertificateOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Monthly Payroll Sheets"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setGenerateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Generate Monthly Payroll
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={sheets}
          rowKey="id"
          columns={sheetColumns}
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          className="custom_scroll"
        />
      </Card>

      {/* DRAWER: DETAILED PAYROLL SHEET WITH EMPLOYEES */}
      <Drawer
        title={
          <span className="font-bold text-base text-gray-900">
            {selectedSheet?.sheetName} (Status: {selectedSheet?.status})
          </span>
        }
        width={850}
        open={sheetDrawer}
        onClose={() => setSheetDrawer(false)}
        extra={
          selectedSheet?.status === "Draft" && (
            <Popconfirm
              title="Disburse this payroll?"
              onConfirm={() => handleDisburse(selectedSheet.id)}
            >
              <Button type="primary" className="bg-emerald-600 hover:bg-emerald-700">
                Disburse Payouts
              </Button>
            </Popconfirm>
          )
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border text-center">
            <div>
              <span className="text-[11px] text-gray-400 block uppercase font-bold">Gross Total</span>
              <span className="text-sm font-bold text-gray-800">
                ৳{Number(selectedSheet?.totalGrossSalary || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block uppercase font-bold">Commissions</span>
              <span className="text-sm font-bold text-purple-700">
                ৳{Number(selectedSheet?.totalCommissions || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block uppercase font-bold">Deductions</span>
              <span className="text-sm font-bold text-rose-600">
                ৳{Number(selectedSheet?.totalDeductions || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block uppercase font-bold">Net Payable</span>
              <span className="text-sm font-bold text-emerald-800">
                ৳{Number(selectedSheet?.totalNetSalary || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <Table
            dataSource={selectedSheet?.items || []}
            rowKey="id"
            columns={itemColumns}
            pagination={{ pageSize: 8 }}
            size="small"
          />
        </div>
      </Drawer>

      {/* MODAL 1: GENERATE MONTHLY PAYROLL */}
      <Modal
        title="Generate Monthly Payroll Sheet"
        open={generateModal}
        onCancel={() => setGenerateModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleGenerate}>
          <Form.Item
            name="year"
            label="Payroll Year"
            initialValue={new Date().getFullYear()}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={2025}>2025</Option>
              <Option value={2026}>2026</Option>
              <Option value={2027}>2027</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="month"
            label="Payroll Month"
            initialValue={new Date().getMonth() + 1}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={1}>January</Option>
              <Option value={2}>February</Option>
              <Option value={3}>March</Option>
              <Option value={4}>April</Option>
              <Option value={5}>May</Option>
              <Option value={6}>June</Option>
              <Option value={7}>July</Option>
              <Option value={8}>August</Option>
              <Option value={9}>September</Option>
              <Option value={10}>October</Option>
              <Option value={11}>November</Option>
              <Option value={12}>December</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setGenerateModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Generate Payroll Now
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: PROFESSIONAL PRINTABLE PAYSLIP */}
      <Modal
        open={payslipModal}
        onCancel={() => setPayslipModal(false)}
        width={650}
        footer={[
          <Button key="close" onClick={() => setPayslipModal(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 border-none"
          >
            Print Payslip
          </Button>,
        ]}
      >
        {selectedPayslipItem && (
          <div className="p-4 space-y-4 text-gray-900" id="printable-payslip">
            {/* Payslip Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold tracking-tight text-emerald-800">CBMNP ENTERPRISE ERP</h2>
              <p className="text-xs text-gray-500 font-medium">Headquarters: Dhaka, Bangladesh</p>
              <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs mt-2 uppercase tracking-wide">
                Salary Payslip / Disbursement Advice
              </div>
            </div>

            {/* Employee & Pay Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border text-xs">
              <div>
                <span className="text-gray-400 block">Employee Name</span>
                <span className="font-bold text-gray-900 text-sm">
                  {selectedPayslipItem.employee?.fullName}
                </span>
                <span className="text-gray-500 block font-mono">
                  ID: {selectedPayslipItem.employee?.employeeCode}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block">Department & Designation</span>
                <span className="font-semibold text-gray-800">
                  {selectedPayslipItem.employee?.department?.name || "General"}
                </span>
                <span className="text-gray-500 block">
                  Payment Status: <Tag color="green">{selectedPayslipItem.paymentStatus}</Tag>
                </span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="border rounded-lg p-3 bg-white space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase border-b pb-1">Earnings</h4>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-semibold">৳{Number(selectedPayslipItem.basicSalary || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Allowances</span>
                  <span className="font-semibold">৳{Number(selectedPayslipItem.totalAllowances || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Sales Commissions</span>
                  <span className="font-semibold text-purple-700">
                    ৳{Number(selectedPayslipItem.commissionsEarned || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t pt-2 text-emerald-900">
                  <span>Gross Earnings</span>
                  <span>
                    ৳{(
                      Number(selectedPayslipItem.basicSalary || 0) +
                      Number(selectedPayslipItem.totalAllowances || 0) +
                      Number(selectedPayslipItem.commissionsEarned || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deductions */}
              <div className="border rounded-lg p-3 bg-white space-y-2">
                <h4 className="text-xs font-bold text-rose-800 uppercase border-b pb-1">Deductions</h4>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tax / TDS</span>
                  <span className="font-semibold text-rose-600">
                    ৳{Number(selectedPayslipItem.taxDeductions || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Unpaid Leaves</span>
                  <span className="font-semibold text-rose-600">৳0</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t pt-2 text-rose-900">
                  <span>Total Deductions</span>
                  <span>৳{Number(selectedPayslipItem.taxDeductions || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Pay Highlight */}
            <div className="flex items-center justify-between bg-emerald-700 text-white p-4 rounded-xl">
              <div>
                <span className="text-xs text-emerald-100 block uppercase font-bold tracking-wider">
                  Net Payable Amount
                </span>
                <span className="text-xl font-bold">
                  ৳{Number(selectedPayslipItem.netSalary || 0).toLocaleString()} BDT
                </span>
              </div>
              <BankOutlined className="text-3xl text-emerald-300" />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-gray-500">
              <div className="border-t pt-1">
                <span>Authorized Signatory (HR & Accounts)</span>
              </div>
              <div className="border-t pt-1">
                <span>Employee Signature</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
