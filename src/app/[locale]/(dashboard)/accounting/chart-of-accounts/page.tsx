"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  useGetChartOfAccountsTreeQuery,
  useGetAccountsListQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

const accountTypeColors: Record<string, string> = {
  Asset: "blue",
  Liability: "orange",
  Equity: "purple",
  Revenue: "green",
  Expense: "red",
};

const categoryOptions: Record<string, string[]> = {
  Asset: ["Current Asset", "Non-Current Asset"],
  Liability: ["Current Liability", "Long-Term Liability"],
  Equity: ["Equity"],
  Revenue: ["Operating Revenue", "Other Income"],
  Expense: [
    "Cost of Sales",
    "Operating Expense",
    "Administrative Expense",
    "Marketing Expense",
    "Financial Expense",
  ],
};

export default function ChartOfAccountsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>("Asset");

  const { data: treeData, isLoading, refetch } = useGetChartOfAccountsTreeQuery(undefined);
  const { data: flatAccounts } = useGetAccountsListQuery(undefined);

  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  const handleOpenAdd = (parent?: any) => {
    setEditingAccount(null);
    form.resetFields();
    if (parent) {
      setSelectedType(parent.accountType);
      form.setFieldsValue({
        parentAccountId: parent.id,
        accountType: parent.accountType,
        accountCategory: parent.accountCategory,
      });
    } else {
      setSelectedType("Asset");
      form.setFieldsValue({
        accountType: "Asset",
        accountCategory: "Current Asset",
      });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingAccount(record);
    setSelectedType(record.accountType);
    form.setFieldsValue({
      accountCode: record.accountCode,
      accountName: record.accountName,
      accountType: record.accountType,
      accountCategory: record.accountCategory,
      parentAccountId: record.parentAccountId,
      description: record.description,
    });
    setModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (editingAccount) {
        await updateAccount({ id: editingAccount.id, data: values }).unwrap();
        message.success("Account updated successfully");
      } else {
        await createAccount(values).unwrap();
        message.success("Account created successfully");
      }
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id).unwrap();
      message.success("Account deleted");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete account");
    }
  };

  const columns: any = [
    {
      title: "Account Code",
      dataIndex: "accountCode",
      key: "accountCode",
      width: "18%",
      render: (code: string, record: any) => (
        <Space>
          {record.children && record.children.length > 0 ? (
            <FolderOpenOutlined style={{ color: "#1890ff" }} />
          ) : (
            <FileTextOutlined style={{ color: "#8c8c8c" }} />
          )}
          <span className="font-semibold text-gray-800">{code}</span>
        </Space>
      ),
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      width: "28%",
      render: (name: string, record: any) => (
        <div>
          <span className="font-medium text-gray-900">{name}</span>
          {record.isSystemAccount && (
            <Tag color="default" className="ml-2 text-xs">
              System
            </Tag>
          )}
          {record.description && (
            <p className="text-xs text-gray-400 m-0">{record.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      width: "12%",
      render: (type: string) => (
        <Tag color={accountTypeColors[type] || "default"}>{type}</Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "accountCategory",
      key: "accountCategory",
      width: "18%",
      render: (category: string) => (
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {category}
        </span>
      ),
    },
    {
      title: "Balance (Tk)",
      dataIndex: "balance",
      key: "balance",
      align: "right" as const,
      width: "12%",
      render: (val: number) => {
        const num = Number(val || 0);
        return (
          <span
            className={`font-semibold ${
              num >= 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "12%",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            size="small"
            icon={<PlusOutlined />}
            title="Add Sub-Account"
            onClick={() => handleOpenAdd(record)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => handleOpenEdit(record)}
          />
          {!record.isSystemAccount && (
            <Popconfirm
              title="Delete Account"
              description="Are you sure you want to delete this account?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Quick summary counts
  const rawList = flatAccounts?.data || [];
  const totalAccounts = rawList.length;
  const assetCount = rawList.filter((a: any) => a.accountType === "Asset").length;
  const liabilityCount = rawList.filter((a: any) => a.accountType === "Liability").length;
  const equityCount = rawList.filter((a: any) => a.accountType === "Equity").length;
  const revenueCount = rawList.filter((a: any) => a.accountType === "Revenue").length;
  const expenseCount = rawList.filter((a: any) => a.accountType === "Expense").length;

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Chart of Accounts (COA)" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic title="Total Accounts" value={totalAccounts} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-cyan-500 shadow-sm">
            <Statistic title="Assets" value={assetCount} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-orange-500 shadow-sm">
            <Statistic title="Liabilities" value={liabilityCount} valueStyle={{ color: "#fa8c16" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-purple-500 shadow-sm">
            <Statistic title="Equity" value={equityCount} valueStyle={{ color: "#722ed1" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic title="Revenue" value={revenueCount} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card size="small" className="border-l-4 border-rose-500 shadow-sm">
            <Statistic title="Expenses" value={expenseCount} valueStyle={{ color: "#f5222d" }} />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={<span className="font-semibold text-lg">General Ledger Accounts Tree</span>}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenAdd()}
              style={{ backgroundColor: "#1890ff" }}
            >
              Add New Account
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={treeData?.data || []}
            rowKey="id"
            pagination={false}
            defaultExpandAllRows={true}
            size="middle"
          />
        )}
      </Card>

      {/* Add / Edit Account Modal */}
      <Modal
        title={editingAccount ? "Edit Account" : "Add Ledger Account"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="accountCode"
            label="Account Code"
            rules={[{ required: true, message: "Please enter unique account code" }]}
          >
            <Input placeholder="e.g. 1115" />
          </Form.Item>

          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[{ required: true, message: "Please enter account name" }]}
          >
            <Input placeholder="e.g. Dhaka Branch Petty Cash" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountType"
                label="Account Type"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(val) => {
                    setSelectedType(val);
                    form.setFieldsValue({
                      accountCategory: categoryOptions[val]?.[0] || "",
                    });
                  }}
                >
                  <Option value="Asset">Asset</Option>
                  <Option value="Liability">Liability</Option>
                  <Option value="Equity">Equity</Option>
                  <Option value="Revenue">Revenue</Option>
                  <Option value="Expense">Expense</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountCategory"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select>
                  {(categoryOptions[selectedType] || []).map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="parentAccountId" label="Parent Account (Optional)">
            <Select placeholder="Select parent account" allowClear showSearch optionFilterProp="children">
              {(flatAccounts?.data || []).map((acc: any) => (
                <Option key={acc.id} value={acc.id}>
                  {acc.accountCode} - {acc.accountName} ({acc.accountType})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description / Memo">
            <Input.TextArea rows={2} placeholder="Optional notes about this account" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
