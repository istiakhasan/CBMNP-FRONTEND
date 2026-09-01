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
  Popconfirm,
} from "antd";
import { PlusOutlined, ReloadOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  useGetPayrollSheetsQuery,
  useGeneratePayrollMutation,
  useDisbursePayrollMutation,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function PayrollPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetPayrollSheetsQuery(undefined);
  const [generatePayroll, { isLoading: isGenerating }] = useGeneratePayrollMutation();
  const [disbursePayroll] = useDisbursePayrollMutation();

  const handleGenerate = async (values: any) => {
    try {
      await generatePayroll(values).unwrap();
      message.success("Monthly payroll sheet generated successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to generate payroll");
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      await disbursePayroll(id).unwrap();
      message.success("Payroll disbursed and salary payments recorded!");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Disbursement failed");
    }
  };

  const sheets = data?.data || [];

  const columns: any = [
    {
      title: "Payroll Cycle",
      dataIndex: "sheetName",
      key: "sheetName",
      render: (name: string) => <span className="font-bold text-gray-900">{name}</span>,
    },
    {
      title: "Gross Salaries (Tk)",
      dataIndex: "totalGrossSalary",
      key: "totalGrossSalary",
      align: "right" as const,
      render: (amt: number) => Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      title: "Sales Commissions (Tk)",
      dataIndex: "totalCommissions",
      key: "totalCommissions",
      align: "right" as const,
      render: (amt: number) => (
        <span className="text-blue-700 font-medium">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Tax & Deductions (Tk)",
      dataIndex: "totalDeductions",
      key: "totalDeductions",
      align: "right" as const,
      render: (amt: number) => (
        <span className="text-rose-700">
          -{Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Total Net Payable (Tk)",
      dataIndex: "totalNetSalary",
      key: "totalNetSalary",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-bold text-emerald-700">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Disbursed" ? "green" : "orange"}>{st}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Draft" && (
            <Popconfirm
              title="Disburse Payroll"
              description="Approve and mark payroll as disbursed?"
              onConfirm={() => handleDisburse(record.id)}
            >
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} style={{ backgroundColor: "#52c41a" }}>
                Disburse Salaries
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Monthly Payroll & Salary Disbursement" />

      <Card
        title="Payroll Sheets"
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
              Generate Monthly Payroll
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={sheets} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Generate Monthly Payroll Sheet"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isGenerating}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerate}
          initialValues={{
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Select>
                {[2024, 2025, 2026, 2027].map((y) => (
                  <Option key={y} value={y}>
                    {y}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="month" label="Month" rules={[{ required: true }]}>
              <Select>
                {[
                  { m: 1, n: "January" },
                  { m: 2, n: "February" },
                  { m: 3, n: "March" },
                  { m: 4, n: "April" },
                  { m: 5, n: "May" },
                  { m: 6, n: "June" },
                  { m: 7, n: "July" },
                  { m: 8, n: "August" },
                  { m: 9, n: "September" },
                  { m: 10, n: "October" },
                  { m: 11, n: "November" },
                  { m: 12, n: "December" },
                ].map((item) => (
                  <Option key={item.m} value={item.m}>
                    {item.n}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <p className="text-xs text-gray-500">
            Payroll engine will automatically calculate Basic Salaries + Allowances + Approved Commissions - Deductions for all active employees.
          </p>
        </Form>
      </Modal>
    </div>
  );
}
