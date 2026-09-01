"use client";
import React, { useState } from "react";
import {
  Card,
  DatePicker,
  Button,
  Table,
  Space,
  Row,
  Col,
  Tag,
  Alert,
  Spin,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetTrialBalanceQuery } from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const accountTypeColors: Record<string, string> = {
  Asset: "blue",
  Liability: "orange",
  Equity: "purple",
  Revenue: "green",
  Expense: "red",
};

export default function TrialBalancePage() {
  const [asOfDate, setAsOfDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const { data, isLoading, refetch } = useGetTrialBalanceQuery({
    asOfDate,
  });

  const report = data?.data;

  const columns: any = [
    {
      title: "Account Code",
      dataIndex: "accountCode",
      key: "accountCode",
      width: "16%",
      render: (code: string) => <span className="font-semibold">{code}</span>,
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      width: "32%",
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      width: "14%",
      render: (type: string) => (
        <Tag color={accountTypeColors[type] || "default"}>{type}</Tag>
      ),
    },
    {
      title: "Debit Balance (Tk)",
      dataIndex: "debit",
      key: "debit",
      align: "right" as const,
      width: "19%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-semibold text-emerald-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
    {
      title: "Credit Balance (Tk)",
      dataIndex: "credit",
      key: "credit",
      align: "right" as const,
      width: "19%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-semibold text-blue-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Trial Balance Statement" />

      {/* Filter Toolbar */}
      <Card size="small" className="shadow-sm">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Space align="center">
              <span className="text-gray-600 font-medium">As of Date:</span>
              <DatePicker
                value={asOfDate ? dayjs(asOfDate) : undefined}
                onChange={(date, dateString) => setAsOfDate(dateString as string)}
                allowClear={false}
              />
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Balance Verification Banner */}
      {report && (
        <div>
          {report.isBalanced ? (
            <Alert
              message="Trial Balance is Fully Balanced"
              description={`Total Debits (${Number(
                report.totalDebit || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk) exactly match Total Credits (${Number(
                report.totalCredit || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk). Double-entry accounting integrity verified.`}
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              className="rounded-md"
            />
          ) : (
            <Alert
              message="Trial Balance Out of Balance Warning"
              description={`Total Debits (${Number(
                report.totalDebit || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk) do not equal Total Credits (${Number(
                report.totalCredit || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk). Variance: ${Number(report.difference || 0).toLocaleString(
                undefined,
                { minimumFractionDigits: 2 }
              )} Tk.`}
              type="error"
              showIcon
              icon={<CloseCircleOutlined />}
              className="rounded-md"
            />
          )}
        </div>
      )}

      {/* Main Trial Balance Table */}
      <Card className="shadow-sm rounded-lg">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={report?.rows || []}
            rowKey="id"
            pagination={false}
            size="middle"
            summary={() => (
              <Table.Summary.Row className="bg-gray-100 font-bold text-base">
                <Table.Summary.Cell index={0} colSpan={3}>
                  Total Trial Balance
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
              </Table.Summary.Row>
            )}
          />
        )}
      </Card>
    </div>
  );
}
