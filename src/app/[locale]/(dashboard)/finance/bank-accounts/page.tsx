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
  InputNumber,
} from "antd";
import { PlusOutlined, BankOutlined, ReloadOutlined, WalletOutlined } from "@ant-design/icons";
import {
  useGetBankAccountsQuery,
  useCreateBankAccountMutation,
} from "@/redux/api/financeApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function BankAccountsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetBankAccountsQuery(undefined);
  const [createAccount, { isLoading: isCreating }] = useCreateBankAccountMutation();

  const handleFinish = async (values: any) => {
    try {
      await createAccount(values).unwrap();
      message.success("Account added successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create account");
    }
  };

  const accounts = data?.data || [];
  const totalBalance = accounts.reduce((sum: number, a: any) => sum + Number(a.currentBalance || 0), 0);
  const bankAccountsCount = accounts.filter((a: any) => a.accountType === "Bank").length;
  const mfsAccountsCount = accounts.filter((a: any) => a.accountType === "MFS").length;
  const cashAccountsCount = accounts.filter((a: any) => a.accountType === "Cash" || a.accountType === "PettyCash").length;

  const columns: any = [
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-400 block">{record.bankName} {record.branchName ? `(${record.branchName})` : ""}</span>
        </div>
      ),
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (num: string) => <span className="font-mono text-blue-600">{num}</span>,
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (type: string) => (
        <Tag color={type === "Bank" ? "blue" : type === "MFS" ? "pink" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Current Balance (Tk)",
      dataIndex: "currentBalance",
      key: "currentBalance",
      align: "right" as const,
      render: (val: number) => (
        <span className={`font-bold ${Number(val || 0) >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
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
      <GbHeader title="Cash, Bank & MFS Accounts" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic
              title="Total Liquid Cash & Bank"
              value={totalBalance}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic title="Bank Accounts" value={bankAccountsCount} suffix="Accounts" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-pink-500 shadow-sm">
            <Statistic title="MFS Wallets (bKash/Nagad)" value={mfsAccountsCount} suffix="Wallets" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-amber-500 shadow-sm">
            <Statistic title="Cash & Petty Drawers" value={cashAccountsCount} suffix="Drawers" />
          </Card>
        </Col>
      </Row>

      {/* Accounts Table Card */}
      <Card
        title="Account Registry"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} style={{ backgroundColor: "#1890ff" }}>
              Add Account / Wallet
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={accounts} rowKey="id" loading={isLoading} pagination={false} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Add Bank, Cash or MFS Account"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ accountType: "Bank", openingBalance: 0 }}>
          <Form.Item name="accountName" label="Account Title / Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. BRAC Corporate Account or Main Office bKash" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="accountType" label="Account Type" rules={[{ required: true }]}>
                <Select>
                  <Option value="Bank">Bank Account</Option>
                  <Option value="Cash">Cash Drawer</Option>
                  <Option value="MFS">MFS (bKash/Nagad/Rocket)</Option>
                  <Option value="PettyCash">Petty Cash</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountNumber" label="Account / Phone Number" rules={[{ required: true }]}>
                <Input placeholder="e.g. 150120349281001 or 01711000000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bankName" label="Bank / Provider Name">
                <Input placeholder="e.g. BRAC Bank Ltd or bKash Merchant" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branchName" label="Branch / Outlet Name">
                <Input placeholder="e.g. Gulshan Branch" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="openingBalance" label="Opening Balance (Tk)">
            <InputNumber min={0} precision={2} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
