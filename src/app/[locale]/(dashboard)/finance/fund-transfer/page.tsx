"use client";
import React from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Space,
  message,
  Typography,
} from "antd";
import { SwapOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dayjs from "dayjs";
import {
  useGetBankAccountsQuery,
  useTransferFundsMutation,
} from "@/redux/api/financeApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;
const { Text } = Typography;

export default function FundTransferPage() {
  const router = useRouter();
  const local = useLocale();
  const [form] = Form.useForm();

  const { data: accountsData } = useGetBankAccountsQuery(undefined);
  const [transferFunds, { isLoading }] = useTransferFundsMutation();

  const handleFinish = async (values: any) => {
    if (values.fromBankAccountId === values.toBankAccountId) {
      message.error("Source and Destination accounts must be different!");
      return;
    }

    try {
      const payload = {
        ...values,
        transferDate: values.transferDate.format("YYYY-MM-DD"),
      };
      await transferFunds(payload).unwrap();
      message.success("Funds transferred successfully!");
      router.push(`/${local}/finance/bank-accounts`);
    } catch (err: any) {
      message.error(err?.data?.message || "Fund transfer failed");
    }
  };

  const accounts = accountsData?.data || [];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/${local}/finance/bank-accounts`)}>
            Back to Accounts
          </Button>
          <h2 className="text-xl font-bold m-0">Transfer Funds Between Accounts / Wallets</h2>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ transferDate: dayjs(), transactionFee: 0 }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fromBankAccountId"
                label="Transfer FROM (Source Account)"
                rules={[{ required: true, message: "Select source account" }]}
              >
                <Select placeholder="Select Source Account">
                  {accounts.map((a: any) => (
                    <Option key={a.id} value={a.id}>
                      {a.accountName} (Balance: {Number(a.currentBalance || 0).toLocaleString()} Tk)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="toBankAccountId"
                label="Transfer TO (Destination Account)"
                rules={[{ required: true, message: "Select destination account" }]}
              >
                <Select placeholder="Select Destination Account">
                  {accounts.map((a: any) => (
                    <Option key={a.id} value={a.id}>
                      {a.accountName} (Balance: {Number(a.currentBalance || 0).toLocaleString()} Tk)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="amount"
                label="Transfer Amount (Tk)"
                rules={[{ required: true, message: "Enter amount" }]}
              >
                <InputNumber min={1} precision={2} className="w-full" placeholder="e.g. 20000" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="transactionFee" label="Bank / MFS Transfer Fee (Tk)">
                <InputNumber min={0} precision={2} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="transferDate" label="Transfer Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="referenceNumber" label="Transaction / Cheque / Ref #">
                <Input placeholder="e.g. TXN9849201" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="note" label="Transfer Memo / Note">
                <Input placeholder="e.g. Monthly petty cash replenishment" />
              </Form.Item>
            </Col>
          </Row>

          <div className="text-right mt-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SwapOutlined />}
              loading={isLoading}
              style={{ backgroundColor: "#1890ff" }}
            >
              Execute Fund Transfer
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
