"use client";
import React, { useState } from "react";
import {
  Card,
  Select,
  DatePicker,
  Button,
  Table,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Divider,
  Spin,
} from "antd";
import {
  BookOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  useGetAccountsListQuery,
  useGetGeneralLedgerQuery,
} from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function GeneralLedgerPage() {
  const { data: accountsData, isLoading: accountsLoading } = useGetAccountsListQuery(undefined);
  const accountsList = accountsData?.data || [];

  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    accountsList[0]?.id
  );
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { data: ledgerData, isLoading: ledgerLoading, refetch } = useGetGeneralLedgerQuery(
    {
      accountId: selectedAccountId || accountsList[0]?.id,
      startDate,
      endDate,
    },
    { skip: !selectedAccountId && accountsList.length === 0 }
  );

  const report = ledgerData?.data;

  const columns: any = [
    {
      title: "Date",
      dataIndex: "entryDate",
      key: "entryDate",
      width: "12%",
    },
    {
      title: "Voucher #",
      dataIndex: "entryNumber",
      key: "entryNumber",
      width: "16%",
      render: (num: string) => (
        <span className="font-semibold text-blue-600">{num}</span>
      ),
    },
    {
      title: "Narration / Description",
      dataIndex: "narration",
      key: "narration",
      render: (text: string, record: any) => (
        <div>
          <span>{text}</span>
          {record.memo && (
            <span className="text-xs text-gray-400 block">Memo: {record.memo}</span>
          )}
        </div>
      ),
    },
    {
      title: "Debit (Tk)",
      dataIndex: "debit",
      key: "debit",
      align: "right" as const,
      width: "15%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-medium text-emerald-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
    {
      title: "Credit (Tk)",
      dataIndex: "credit",
      key: "credit",
      align: "right" as const,
      width: "15%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-medium text-blue-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
    {
      title: "Running Balance (Tk)",
      dataIndex: "runningBalance",
      key: "runningBalance",
      align: "right" as const,
      width: "18%",
      render: (val: number) => {
        const num = Number(val || 0);
        return (
          <span
            className={`font-bold ${
              num >= 0 ? "text-gray-900" : "text-rose-600"
            }`}
          >
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="General Ledger Statement" />

      {/* Account & Date Selection Card */}
      <Card size="small" className="shadow-sm">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={18}>
            <Space wrap>
              <Select
                placeholder="Select Account"
                value={selectedAccountId || accountsList[0]?.id}
                onChange={(val) => setSelectedAccountId(val)}
                loading={accountsLoading}
                showSearch
                optionFilterProp="children"
                style={{ width: 320 }}
              >
                {accountsList.map((acc: any) => (
                  <Option key={acc.id} value={acc.id}>
                    [{acc.accountCode}] {acc.accountName} ({acc.accountType})
                  </Option>
                ))}
              </Select>

              <RangePicker
                onChange={(dates, dateStrings) => {
                  setStartDate(dateStrings[0] || undefined);
                  setEndDate(dateStrings[1] || undefined);
                }}
              />

              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      {report && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-l-4 border-gray-400 shadow-sm">
              <Statistic
                title="Opening Balance"
                value={Number(report.openingBalance || 0)}
                precision={2}
                suffix="Tk"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
              <Statistic
                title="Period Debits"
                value={Number(report.totalDebit || 0)}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                suffix="Tk"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
              <Statistic
                title="Period Credits"
                value={Number(report.totalCredit || 0)}
                precision={2}
                valueStyle={{ color: "#1890ff" }}
                suffix="Tk"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="border-l-4 border-indigo-600 shadow-sm">
              <Statistic
                title="Closing Balance"
                value={Number(report.closingBalance || 0)}
                precision={2}
                valueStyle={{ color: "#2f54eb" }}
                suffix="Tk"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Ledger Table */}
      <Card
        title={
          report?.account ? (
            <div className="flex items-center gap-3">
              <BookOutlined className="text-blue-500" />
              <span>
                [{report.account.accountCode}] {report.account.accountName}
              </span>
              <Tag color="blue">{report.account.accountType}</Tag>
              <Tag color="cyan">{report.account.accountCategory}</Tag>
            </div>
          ) : (
            "Account Transactions Ledger"
          )
        }
        className="shadow-sm rounded-lg"
      >
        {ledgerLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={report?.transactions || []}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            size="middle"
            summary={() => (
              <Table.Summary.Row className="bg-gray-50 font-bold">
                <Table.Summary.Cell index={0} colSpan={3}>
                  Account Balance Summary
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right" className="text-emerald-700">
                  {Number(report?.totalDebit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right" className="text-blue-700">
                  {Number(report?.totalCredit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right" className="text-indigo-800">
                  {Number(report?.closingBalance || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        )}
      </Card>
    </div>
  );
}
