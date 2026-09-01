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
  useGetSupplierBillsQuery,
  useCreateSupplierBillMutation,
  useRecordSupplierPaymentMutation,
  useGetBankAccountsQuery,
} from "@/redux/api/financeApi";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function SupplierBillsPage() {
  const [billForm] = Form.useForm();
  const [payForm] = Form.useForm();
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const { data, isLoading, refetch } = useGetSupplierBillsQuery(undefined);
  const { data: suppliersData } = useGetAllSupplierQuery(undefined);
  const { data: accountsData } = useGetBankAccountsQuery(undefined);

  const [createBill, { isLoading: isCreatingBill }] = useCreateSupplierBillMutation();
  const [recordPayment, { isLoading: isRecordingPay }] = useRecordSupplierPaymentMutation();

  const handleCreateBill = async (values: any) => {
    try {
      const payload = {
        ...values,
        billDate: values.billDate.format("YYYY-MM-DD"),
        dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : undefined,
      };
      await createBill(payload).unwrap();
      message.success("Supplier bill recorded successfully");
      setBillModalOpen(false);
      billForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record bill");
    }
  };

  const handleRecordPayment = async (values: any) => {
    try {
      const payload = {
        ...values,
        supplierId: selectedBill.supplierId,
        supplierBillId: selectedBill.id,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
      };
      await recordPayment(payload).unwrap();
      message.success("Supplier payment recorded");
      setPayModalOpen(false);
      payForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record payment");
    }
  };

  const bills = data?.data || [];
  const totalBilled = bills.reduce((sum: number, b: any) => sum + Number(b.totalAmount || 0), 0);
  const totalDue = bills.reduce((sum: number, b: any) => sum + Number(b.dueAmount || 0), 0);

  const columns: any = [
    {
      title: "Bill #",
      dataIndex: "billNumber",
      key: "billNumber",
      render: (num: string) => <span className="font-bold text-orange-600">{num}</span>,
    },
    {
      title: "Bill Date",
      dataIndex: "billDate",
      key: "billDate",
    },
    {
      title: "Supplier Name",
      dataIndex: ["supplier", "company"],
      key: "supplier",
      render: (name: string, record: any) => (
        <span className="font-semibold text-gray-900">{name || record.supplier?.contactPerson || record.supplier?.name}</span>
      ),
    },
    {
      title: "Total Amount (Tk)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-medium">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Paid (Tk)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="text-emerald-700 font-medium">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Due (Tk)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="text-rose-700 font-bold">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Paid" ? "green" : st === "PartiallyPaid" ? "blue" : "volcano"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status !== "Paid" && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setSelectedBill(record);
                payForm.setFieldsValue({
                  amount: Number(record.dueAmount || 0),
                  paymentDate: dayjs(),
                });
                setPayModalOpen(true);
              }}
              style={{ backgroundColor: "#52c41a" }}
            >
              Pay Bill
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Accounts Payable: Supplier Bills & Payments" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-orange-500 shadow-sm">
            <Statistic title="Total Invoiced (AP)" value={totalBilled} precision={2} suffix="Tk" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-rose-500 shadow-sm">
            <Statistic
              title="Total Outstanding Supplier Dues"
              value={totalDue}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="Tk"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card
        title="Supplier Bills Register"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setBillModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Record Supplier Bill
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={bills} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Record Bill Modal */}
      <Modal
        title="Record Supplier Bill"
        open={billModalOpen}
        onCancel={() => setBillModalOpen(false)}
        onOk={() => billForm.submit()}
        confirmLoading={isCreatingBill}
        destroyOnClose
      >
        <Form form={billForm} layout="vertical" onFinish={handleCreateBill} initialValues={{ billDate: dayjs() }}>
          <Form.Item name="supplierId" label="Select Supplier" rules={[{ required: true }]}>
            <Select placeholder="Select Supplier" showSearch optionFilterProp="children">
              {(suppliersData?.data || []).map((s: any) => (
                <Option key={s.id} value={s.id}>
                  {s.company || s.contactPerson || s.name} ({s.phone || "No phone"})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="billDate" label="Bill Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="totalAmount" label="Total Amount (Tk)" rules={[{ required: true }]}>
            <InputNumber min={1} precision={2} className="w-full" placeholder="e.g. 75000" />
          </Form.Item>

          <Form.Item name="supplierInvoiceNumber" label="Supplier Invoice / Challan #">
            <Input placeholder="e.g. SUP-INV-0091" />
          </Form.Item>

          <Form.Item name="notes" label="Notes / Memo">
            <Input.TextArea rows={2} placeholder="Purchase description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Pay Bill Modal */}
      <Modal
        title={`Record Payment for Bill: ${selectedBill?.billNumber}`}
        open={payModalOpen}
        onCancel={() => setPayModalOpen(false)}
        onOk={() => payForm.submit()}
        confirmLoading={isRecordingPay}
        destroyOnClose
      >
        <Form form={payForm} layout="vertical" onFinish={handleRecordPayment}>
          <Form.Item name="amount" label="Payment Amount (Tk)" rules={[{ required: true }]}>
            <InputNumber min={1} max={Number(selectedBill?.dueAmount || 99999999)} precision={2} className="w-full" />
          </Form.Item>

          <Form.Item name="bankAccountId" label="Payment Account (Bank/Cash/MFS)" rules={[{ required: true }]}>
            <Select placeholder="Select Payment Source">
              {(accountsData?.data || []).map((a: any) => (
                <Option key={a.id} value={a.id}>
                  {a.accountName} (Balance: {Number(a.currentBalance || 0).toLocaleString()} Tk)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="referenceNumber" label="Cheque / Txn Ref #">
            <Input placeholder="e.g. CHQ-9901" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
