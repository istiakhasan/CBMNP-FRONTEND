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
  Checkbox,
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
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
  useSetSalaryStructureMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function PayrollPage() {
  const [generateModal, setGenerateModal] = useState(false);
  const [structureModal, setStructureModal] = useState(false);
  const [sheetDrawer, setSheetDrawer] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [payslipModal, setPayslipModal] = useState(false);
  const { data: departmentsData } = useGetDepartmentsQuery(undefined);
  const [selectedPayslipItem, setSelectedPayslipItem] = useState<any>(null);

  const [form] = Form.useForm();
  const [structureForm] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetPayrollSheetsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [generatePayroll, { isLoading: isGenerating }] = useGeneratePayrollMutation();
  const [disbursePayroll, { isLoading: isDisbursing }] = useDisbursePayrollMutation();
  const [setSalaryStructure, { isLoading: isSavingStructure }] = useSetSalaryStructureMutation();

  const sheets = data?.data || [];
  const employees = employeesData?.data || [];

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
  const saveSalaryStructure = async (values: any) => { try { await setSalaryStructure({ ...values, basicSalary: Number(values.basicSalary || 0), houseRentAllowance: Number(values.houseRentAllowance || 0), medicalAllowance: Number(values.medicalAllowance || 0), conveyanceAllowance: Number(values.conveyanceAllowance || 0), taxDeduction: Number(values.taxDeduction || 0), providentFundDeduction: Number(values.providentFundDeduction || 0), customEarnings: (values.customEarnings || []).map((item: any) => ({ name: item.name, amount: Number(item.amount || 0) })), customDeductions: (values.customDeductions || []).map((item: any) => ({ name: item.name, amount: Number(item.amount || 0) })) }).unwrap(); message.success("Employee salary structure saved"); setStructureModal(false); structureForm.resetFields(); } catch (err: any) { message.error(err?.data?.message || "Could not save salary structure"); } };

  const handleDisburse = async (sheetId: string) => {
    try {
      const response: any = await disbursePayroll(sheetId).unwrap();
      message.success("Monthly payroll disbursed successfully");
      await refetch();
      if (selectedSheet) {
        const serverSheet = response?.data;
        setSelectedSheet({ ...selectedSheet, ...serverSheet, status: "Disbursed", items: (serverSheet?.items || selectedSheet.items || []).map((item: any) => ({ ...item, paymentStatus: "Paid" })) });
      }
      if (selectedPayslipItem?.payrollSheetId === sheetId) setSelectedPayslipItem({ ...selectedPayslipItem, paymentStatus: "Paid" });
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
    if (!selectedPayslipItem) return;

    const escapeHtml = (value: unknown) =>
      String(value ?? "-")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const money = (value: unknown) => `৳${Number(value || 0).toLocaleString()}`;
    const payslip = selectedPayslipItem;
    const earnings = [
      ["Basic Salary", payslip.basicSalary],
      ["Total Allowances", payslip.totalAllowances],
      ["Sales Commissions", payslip.commissionsEarned],
      ...(payslip.earningsBreakdown || []).map((item: any) => [item.name, item.amount]),
    ];
    const deductions = [
      ["Tax / TDS", payslip.taxDeductions],
      ["Salary Advance / Loan EMI", payslip.loanDeductions || payslip.unpaidLeaveDeductions],
      ...(payslip.deductionsBreakdown || []).map((item: any) => [item.name, item.amount]),
    ];
    const detailRows = (items: any[]) => items
      .map(([label, amount]) => `<tr><td>${escapeHtml(label)}</td><td>${money(amount)}</td></tr>`)
      .join("");
    const printWindow = window.open("", "_blank", "width=820,height=1000");

    if (!printWindow) {
      message.error("Allow pop-ups to print the payslip");
      return;
    }

    printWindow.document.write(`<!doctype html><html><head><title>Payslip - ${escapeHtml(payslip.employee?.employeeCode)}</title><style>@page{margin:14mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;margin:0;font-size:12px}.header{text-align:center;border-bottom:2px solid #087f5b;padding-bottom:14px}.header h1{font-size:20px;color:#087f5b;margin:0 0 5px}.header p{margin:3px 0;color:#667085}.badge{display:inline-block;margin-top:7px;padding:5px 11px;background:#d1fae5;color:#065f46;border-radius:12px;font-size:10px;font-weight:bold;text-transform:uppercase}.info{display:grid;grid-template-columns:1fr 1fr;gap:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:7px;margin:18px 0;padding:12px}.right{text-align:right}.label{display:block;color:#6b7280;font-size:10px;margin-bottom:3px}.value{font-size:14px;font-weight:bold} .tables{display:grid;grid-template-columns:1fr 1fr;gap:16px}section{border:1px solid #d1d5db;border-radius:7px;padding:12px}h2{font-size:12px;text-transform:uppercase;margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid #d1d5db;color:#065f46}table{width:100%;border-collapse:collapse}td{padding:5px 0}td:last-child{text-align:right;font-weight:600}.total{border-top:1px solid #9ca3af;font-weight:bold}.net{background:#087f5b;color:#fff;border-radius:8px;margin-top:18px;padding:15px;display:flex;justify-content:space-between;align-items:center}.net span{display:block}.net strong{font-size:20px}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:45px;margin-top:85px;text-align:center;color:#4b5563}.signature{border-top:1px solid #374151;padding-top:6px}@media print{body{font-size:12px}}</style></head><body><div class="header"><h1>CBMNP ENTERPRISE ERP</h1><p>Headquarters: Dhaka, Bangladesh</p><span class="badge">Salary Payslip / Disbursement Advice</span></div><div class="info"><div><span class="label">Employee Name</span><span class="value">${escapeHtml(payslip.employee?.fullName)}</span><span class="label">ID: ${escapeHtml(payslip.employee?.employeeCode)}</span></div><div class="right"><span class="label">Department & Designation</span><span class="value">${escapeHtml(payslip.employee?.department?.name || "General")}</span><span class="label">Payment Status: ${escapeHtml(payslip.paymentStatus)}</span></div></div><div class="tables"><section><h2>Earnings</h2><table>${detailRows(earnings)}<tr class="total"><td>Gross Earnings</td><td>${money(Number(payslip.basicSalary || 0) + Number(payslip.totalAllowances || 0) + Number(payslip.commissionsEarned || 0))}</td></tr></table></section><section><h2>Deductions</h2><table>${detailRows(deductions)}<tr class="total"><td>Total Deductions</td><td>${money(Number(payslip.taxDeductions || 0) + Number(payslip.loanDeductions || payslip.unpaidLeaveDeductions || 0))}</td></tr></table></section></div><div class="net"><span>NET PAYABLE AMOUNT</span><strong>${money(payslip.netSalary)} BDT</strong></div><div class="signatures"><div class="signature">Authorized Signatory (HR & Accounts)</div><div class="signature">Employee Signature</div></div><script>window.onload=function(){window.focus();window.print();}</script></body></html>`);
    printWindow.document.close();
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
      key: "deductions",
      render: (_: any, record: any) => <span className="text-rose-600">৳{(Number(record.taxDeductions || 0) + Number(record.loanDeductions || record.unpaidLeaveDeductions || 0)).toLocaleString()}</span>,
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

          <Form.Item name="departmentId" label="Department" tooltip="Leave empty to generate payroll for all departments.">
            <Select allowClear placeholder="All Departments" options={(departmentsData?.data || []).map((department: any) => ({ value: department.id, label: department.name }))} />
          </Form.Item>

          <Form.Item name="regenerate" valuePropName="checked">
            <Checkbox>Regenerate existing Draft payroll</Checkbox>
          </Form.Item>
          <p className="-mt-3 mb-4 text-xs text-amber-600">This replaces an existing Draft sheet for the selected month. Disbursed payroll cannot be regenerated.</p>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setGenerateModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Generate / Regenerate Payroll
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal title="Employee-wise Salary Structure" open={structureModal} onCancel={() => setStructureModal(false)} footer={null} width={760} destroyOnClose>
        <Form form={structureForm} layout="vertical" onFinish={saveSalaryStructure} initialValues={{ customEarnings: [], customDeductions: [] }}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Select an employee" }]}><Select showSearch optionFilterProp="label" options={employees.map((employee: any) => ({ value: employee.id, label: `${employee.fullName} (${employee.employeeCode})` }))} /></Form.Item>
          <p className="mb-3 text-xs font-bold uppercase text-emerald-700">Standard earnings & deductions</p><Row gutter={12}><Col span={12}><Form.Item name="basicSalary" label="Basic Salary"><InputNumber min={0} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="houseRentAllowance" label="House Rent"><InputNumber min={0} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="medicalAllowance" label="Medical"><InputNumber min={0} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="conveyanceAllowance" label="Conveyance"><InputNumber min={0} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="taxDeduction" label="Tax / TDS"><InputNumber min={0} className="w-full" /></Form.Item></Col><Col span={12}><Form.Item name="providentFundDeduction" label="Provident Fund"><InputNumber min={0} className="w-full" /></Form.Item></Col></Row>
          <DynamicComponents name="customEarnings" title="Custom earnings" addText="Add earning component" positive />
          <DynamicComponents name="customDeductions" title="Custom deductions" addText="Add deduction component" />
          <div className="mt-5 flex justify-end gap-2 border-t pt-4"><Button onClick={() => setStructureModal(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSavingStructure}>Save Salary Structure</Button></div>
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
                {(selectedPayslipItem.earningsBreakdown || []).map((item: any, index: number) => <div key={index} className="flex justify-between text-xs"><span className="text-gray-600">{item.name}</span><span className="font-semibold text-emerald-700">৳{Number(item.amount || 0).toLocaleString()}</span></div>)}
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
                  <span className="text-gray-600">Salary Advance / Loan EMI</span>
                  <span className="font-semibold text-rose-600">৳{Number(selectedPayslipItem.loanDeductions || selectedPayslipItem.unpaidLeaveDeductions || 0).toLocaleString()}</span>
                </div>
                {(selectedPayslipItem.deductionsBreakdown || []).map((item: any, index: number) => <div key={index} className="flex justify-between text-xs"><span className="text-gray-600">{item.name}</span><span className="font-semibold text-rose-600">৳{Number(item.amount || 0).toLocaleString()}</span></div>)}
                <div className="flex justify-between text-xs font-bold border-t pt-2 text-rose-900">
                  <span>Total Deductions</span>
                  <span>৳{(Number(selectedPayslipItem.taxDeductions || 0) + Number(selectedPayslipItem.loanDeductions || selectedPayslipItem.unpaidLeaveDeductions || 0)).toLocaleString()}</span>
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

function DynamicComponents({ name, title, addText, positive = false }: any) {
  return <Form.List name={name}>{(fields, { add, remove }) => <div className={`mb-4 rounded-xl border p-3 ${positive ? "border-emerald-100 bg-emerald-50/40" : "border-rose-100 bg-rose-50/40"}`}><div className="mb-2 flex items-center justify-between"><b className="text-sm">{title}</b><Button size="small" type="dashed" onClick={() => add({ name: "", amount: 0 })}>{addText}</Button></div>{fields.map(({ key, name: index }) => <Row key={key} gutter={8} className="mb-2"><Col span={13}><Form.Item name={[index, "name"]} rules={[{ required: true, message: "Component name required" }]} noStyle><Input placeholder="e.g. Food allowance" /></Form.Item></Col><Col span={8}><Form.Item name={[index, "amount"]} noStyle><InputNumber min={0} className="w-full" placeholder="Amount" /></Form.Item></Col><Col span={3}><Button danger size="small" onClick={() => remove(index)}>Remove</Button></Col></Row>)}</div>}</Form.List>;
}
