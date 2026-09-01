"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Select,
  InputNumber,
  Space,
  Row,
  Col,
  Divider,
  message,
  Typography,
  Tag,
  Alert,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dayjs from "dayjs";
import {
  useGetAccountsListQuery,
  useCreateJournalEntryMutation,
} from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;
const { Text } = Typography;

export default function CreateJournalEntryPage() {
  const router = useRouter();
  const local = useLocale();
  const [form] = Form.useForm();

  const { data: accountsData, isLoading: accountsLoading } = useGetAccountsListQuery(undefined);
  const [createJournalEntry, { isLoading: isSubmitting }] = useCreateJournalEntryMutation();

  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const calculateTotals = () => {
    const items = form.getFieldValue("items") || [];
    let debitSum = 0;
    let creditSum = 0;

    items.forEach((item: any) => {
      debitSum += Number(item?.debit || 0);
      creditSum += Number(item?.credit || 0);
    });

    setTotalDebit(debitSum);
    setTotalCredit(creditSum);
  };

  const isBalanced =
    totalDebit > 0 &&
    totalCredit > 0 &&
    Math.abs(totalDebit - totalCredit) < 0.001;

  const handleSubmit = async (values: any) => {
    if (!isBalanced) {
      message.error(
        `Journal entry is out of balance. Total Debit (${totalDebit.toFixed(
          2
        )}) must equal Total Credit (${totalCredit.toFixed(2)})`
      );
      return;
    }

    try {
      const payload = {
        ...values,
        entryDate: values.entryDate.format("YYYY-MM-DD"),
        items: values.items.map((i: any) => ({
          accountId: i.accountId,
          debit: Number(i.debit || 0),
          credit: Number(i.credit || 0),
          memo: i.memo || undefined,
        })),
      };

      await createJournalEntry(payload).unwrap();
      message.success("Journal voucher posted successfully!");
      router.push(`/${local}/accounting/journal-entries`);
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to post journal entry");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/${local}/accounting/journal-entries`)}
          >
            Back to Vouchers
          </Button>
          <h2 className="text-xl font-bold m-0">Post New Double-Entry Voucher</h2>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          entryDate: dayjs(),
          entryType: "ManualJournal",
          items: [
            { accountId: undefined, debit: 0, credit: 0, memo: "" },
            { accountId: undefined, debit: 0, credit: 0, memo: "" },
          ],
        }}
        onValuesChange={calculateTotals}
      >
        {/* Header Card */}
        <Card title="Voucher Header Details" className="shadow-sm">
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                name="entryDate"
                label="Voucher Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="entryType" label="Voucher Type" rules={[{ required: true }]}>
                <Select>
                  <Option value="ManualJournal">Manual Journal</Option>
                  <Option value="SalesInvoice">Sales Invoice</Option>
                  <Option value="PaymentReceipt">Payment Receipt</Option>
                  <Option value="PurchaseBill">Purchase Bill</Option>
                  <Option value="ExpenseVoucher">Expense Voucher</Option>
                  <Option value="FundTransfer">Fund Transfer</Option>
                  <Option value="OpeningBalance">Opening Balance</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="referenceType" label="Reference Type (Optional)">
                <Input placeholder="e.g. Order / PO / PettyCash" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="referenceId" label="Reference ID / #" >
                <Input placeholder="e.g. SO-1049 / PO-2025-01" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="narration"
            label="Narration / Description"
            rules={[{ required: true, message: "Please enter voucher description" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Cash transfer from main bank to petty cash drawer"
            />
          </Form.Item>
        </Card>

        {/* Double-Entry Line Items Card */}
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Debit & Credit Ledger Line Items</span>
              <span className="text-xs text-gray-400 font-normal">
                Minimum 2 lines required (1 Debit and 1 Credit)
              </span>
            </div>
          }
          className="shadow-sm"
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="p-3 bg-gray-50 border rounded-md flex flex-wrap md:flex-nowrap items-center gap-3"
                  >
                    <div className="w-8 font-bold text-gray-400 text-center">
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-[220px]">
                      <Form.Item
                        {...restField}
                        name={[name, "accountId"]}
                        rules={[{ required: true, message: "Select account" }]}
                        className="m-0"
                      >
                        <Select
                          placeholder="Select Account"
                          showSearch
                          optionFilterProp="children"
                          loading={accountsLoading}
                        >
                          {(accountsData?.data || []).map((acc: any) => (
                            <Option key={acc.id} value={acc.id}>
                              [{acc.accountCode}] {acc.accountName} ({acc.accountType})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="w-36">
                      <Form.Item
                        {...restField}
                        name={[name, "debit"]}
                        className="m-0"
                      >
                        <InputNumber
                          placeholder="Debit (Tk)"
                          min={0}
                          precision={2}
                          className="w-full"
                          onChange={(val) => {
                            if (Number(val || 0) > 0) {
                              form.setFieldValue(["items", name, "credit"], 0);
                            }
                            calculateTotals();
                          }}
                        />
                      </Form.Item>
                    </div>

                    <div className="w-36">
                      <Form.Item
                        {...restField}
                        name={[name, "credit"]}
                        className="m-0"
                      >
                        <InputNumber
                          placeholder="Credit (Tk)"
                          min={0}
                          precision={2}
                          className="w-full"
                          onChange={(val) => {
                            if (Number(val || 0) > 0) {
                              form.setFieldValue(["items", name, "debit"], 0);
                            }
                            calculateTotals();
                          }}
                        />
                      </Form.Item>
                    </div>

                    <div className="w-48">
                      <Form.Item
                        {...restField}
                        name={[name, "memo"]}
                        className="m-0"
                      >
                        <Input placeholder="Line memo (Optional)" />
                      </Form.Item>
                    </div>

                    <div>
                      {fields.length > 2 && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            remove(name);
                            setTimeout(calculateTotals, 100);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => {
                    add({ accountId: undefined, debit: 0, credit: 0, memo: "" });
                    setTimeout(calculateTotals, 100);
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Another Entry Line
                </Button>
              </div>
            )}
          </Form.List>

          <Divider />

          {/* Double-Entry Balance Calculation Footer */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
            <div>
              {isBalanced ? (
                <div className="flex items-center text-emerald-600 font-semibold gap-2">
                  <CheckCircleOutlined className="text-lg" />
                  <span>Entry is Balanced & Ready to Post</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-600 font-semibold gap-2">
                  <CloseCircleOutlined className="text-lg" />
                  <span>
                    Out of Balance (Variance:{" "}
                    {Math.abs(totalDebit - totalCredit).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}{" "}
                    Tk)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div>
                <Text type="secondary" className="block text-xs">
                  TOTAL DEBITS
                </Text>
                <span className="font-bold text-lg text-emerald-700">
                  {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk
                </span>
              </div>

              <div>
                <Text type="secondary" className="block text-xs">
                  TOTAL CREDITS
                </Text>
                <span className="font-bold text-lg text-blue-700">
                  {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk
                </span>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                disabled={!isBalanced}
                style={{ backgroundColor: isBalanced ? "#52c41a" : undefined }}
              >
                Post Journal Voucher
              </Button>
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
}
