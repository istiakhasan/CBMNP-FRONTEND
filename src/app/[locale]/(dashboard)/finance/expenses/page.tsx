"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetExpensesQuery,
  useGetExpenseCategoriesQuery,
  useGetBankAccountsQuery,
  useCreateExpenseMutation,
  useCreateExpenseCategoryMutation,
} from "@/redux/api/financeApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function ExpensesPage() {
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useGetExpensesQuery({
    page,
    limit,
    categoryId: selectedCategory,
  });

  const { data: categoriesData, refetch: refetchCategories } = useGetExpenseCategoriesQuery(undefined);
  const { data: accountsData } = useGetBankAccountsQuery(undefined);
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateExpenseCategoryMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        expenseDate: values.expenseDate.format("YYYY-MM-DD"),
      };
      await createExpense(payload).unwrap();
      message.success("Expense recorded successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record expense");
    }
  };

  const handleCreateCategory = async (values: any) => {
    try {
      await createCategory(values).unwrap();
      message.success("Expense category created successfully");
      categoryForm.resetFields();
      setCategoryModalOpen(false);
      refetchCategories();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create category");
    }
  };

  const expenses = data?.data || [];
  const totalExpenseAmount = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

  const columns: any = [
    {
      title: "Expense #",
      dataIndex: "expenseNumber",
      key: "expenseNumber",
      render: (num: string) => <span className="font-bold text-rose-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
    },
    {
      title: "Category",
      dataIndex: ["expenseCategory", "name"],
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat || "General"}</Tag>,
    },
    {
      title: "Paid Through",
      dataIndex: ["bankAccount", "accountName"],
      key: "bankAccount",
      render: (name: string, record: any) => (
        <span>{name || record.bankAccount?.bankName || "Direct Cash"}</span>
      ),
    },
    {
      title: "Paid To",
      dataIndex: "paidTo",
      key: "paidTo",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount (Tk)",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-bold text-gray-900">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Paid" ? "green" : "orange"}>{st}</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Expense Management" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-rose-500 shadow-sm">
            <Statistic
              title="Total Recorded Expenses"
              value={totalExpenseAmount}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic title="Total Expense Transactions" value={data?.meta?.total || expenses.length} suffix="Vouchers" />
          </Card>
        </Col>
      </Row>

      {/* Toolbar & Table */}
      <Card
        title="Expense Vouchers"
        extra={
          <Space>
            <Select
              placeholder="Filter by Category"
              value={selectedCategory}
              onChange={(v) => setSelectedCategory(v)}
              allowClear
              style={{ width: 180 }}
            >
              {(categoriesData?.data || []).map((c: any) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setCategoryModalOpen(true)}
            >
              Expense Categories
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Record Expense
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table
          columns={columns}
          dataSource={expenses}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
          }}
          size="middle"
        />
      </Card>

      {/* Record Expense Modal */}
      <Modal
        title="Record New Business Expense"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ expenseDate: dayjs() }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="expenseDate" label="Expense Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expenseCategoryId"
                label={
                  <div className="flex justify-between items-center w-full">
                    <span>Expense Category</span>
                  </div>
                }
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select Category"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div className="p-2 border-t text-center">
                        <Button
                          type="link"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => setCategoryModalOpen(true)}
                        >
                          + Create New Category
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {(categoriesData?.data || []).map((c: any) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount (Tk)"
                rules={[{ required: true, message: "Please enter amount" }]}
              >
                <InputNumber min={1} precision={2} className="w-full" placeholder="e.g. 5000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bankAccountId" label="Payment Source (Bank/Cash/MFS)">
                <Select placeholder="Select Account / Drawer">
                  {(accountsData?.data || []).map((a: any) => (
                    <Option key={a.id} value={a.id}>
                      {a.accountName} (Balance: {Number(a.currentBalance || 0).toLocaleString()} Tk)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="paidTo" label="Paid To / Vendor Name">
                <Input placeholder="e.g. Office Landlord / Electricity Office" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="referenceNumber" label="Bill / Receipt / Memo #">
                <Input placeholder="e.g. BILL-9021" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description / Purpose"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={2} placeholder="e.g. Office internet and utility bill for the month" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Expense Category Management Modal */}
      <Modal
        title="Expense Categories Manager"
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div className="space-y-4">
          <Card size="small" title="Create New Expense Category" className="bg-gray-50">
            <Form
              form={categoryForm}
              layout="vertical"
              onFinish={handleCreateCategory}
            >
              <Form.Item
                name="name"
                label="Category Name"
                rules={[{ required: true, message: "Please enter category name" }]}
              >
                <Input placeholder="e.g. Office Rent, Utilities, Marketing, Packaging" />
              </Form.Item>
              <Form.Item name="description" label="Description / Notes">
                <Input placeholder="e.g. Monthly office recurring operational expense" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingCategory}
                icon={<PlusOutlined />}
                block
              >
                Save Category
              </Button>
            </Form>
          </Card>

          <div>
            <span className="font-semibold text-sm block mb-2">Existing Categories:</span>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded">
              {(categoriesData?.data || []).length === 0 ? (
                <span className="text-gray-400 text-xs">No categories created yet.</span>
              ) : (
                (categoriesData?.data || []).map((cat: any) => (
                  <Tag key={cat.id} color="blue" className="text-sm py-1 px-2">
                    {cat.name}
                  </Tag>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
