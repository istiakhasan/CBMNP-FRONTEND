"use client";
import React, { useState } from "react";
import {
  Card,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Spin,
  Table,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetBalanceSheetQuery } from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const { data, isLoading, refetch } = useGetBalanceSheetQuery({
    asOfDate,
  });

  const report = data?.data;

  const itemColumns: any = [
    {
      title: "Account Code",
      dataIndex: "accountCode",
      key: "accountCode",
      width: "25%",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      width: "45%",
    },
    {
      title: "Balance (Tk)",
      dataIndex: "balance",
      key: "balance",
      align: "right" as const,
      width: "30%",
      render: (val: number) => (
        <span className="font-semibold">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const totalAssets = Number(report?.assets?.totalAssets || 0);
  const totalLiabilities = Number(report?.liabilities?.totalLiabilities || 0);
  const totalEquity = Number(report?.equity?.totalEquity || 0);
  const totalLiabilitiesAndEquity = Number(report?.totalLiabilitiesAndEquity || 0);

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Balance Sheet Statement" />

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

      {/* Balance Equation Status Alert */}
      {report && (
        <div>
          {report.isBalanced ? (
            <Alert
              message="Balance Sheet Equation is Balanced"
              description={`Total Assets (${totalAssets.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk) = Total Liabilities & Equity (${totalLiabilitiesAndEquity.toLocaleString(
                undefined,
                { minimumFractionDigits: 2 }
              )} Tk). Fundamental accounting equation verified.`}
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              className="rounded-md"
            />
          ) : (
            <Alert
              message="Balance Sheet Out of Balance Warning"
              description={`Total Assets (${totalAssets.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} Tk) does not equal Total Liabilities & Equity (${totalLiabilitiesAndEquity.toLocaleString(
                undefined,
                { minimumFractionDigits: 2 }
              )} Tk). Variance: ${Number(report.difference || 0).toLocaleString(
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

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic
              title="Total Assets"
              value={totalAssets}
              precision={2}
              valueStyle={{ color: "#1890ff" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-orange-500 shadow-sm">
            <Statistic
              title="Total Liabilities"
              value={totalLiabilities}
              precision={2}
              valueStyle={{ color: "#fa8c16" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-purple-500 shadow-sm">
            <Statistic
              title="Total Equity"
              value={totalEquity}
              precision={2}
              valueStyle={{ color: "#722ed1" }}
              suffix="Tk"
            />
          </Card>
        </Col>
      </Row>

      {/* Balance Sheet Statement */}
      <Card className="shadow-sm rounded-lg">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* ================= ASSETS ================= */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-900 border-b pb-2 m-0">
                1. ASSETS
              </h3>

              {/* Current Assets */}
              <div>
                <div className="flex justify-between items-center bg-blue-50 p-2.5 rounded-t-lg font-bold text-blue-950">
                  <span>Current Assets (Cash, Bank, Receivables, Inventory)</span>
                  <span>
                    {Number(report?.assets?.totalCurrentAssets || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 }
                    )}{" "}
                    Tk
                  </span>
                </div>
                <Table
                  columns={itemColumns}
                  dataSource={report?.assets?.currentAssets || []}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>

              {/* Non-Current Assets */}
              {(report?.assets?.nonCurrentAssets || []).length > 0 && (
                <div>
                  <div className="flex justify-between items-center bg-blue-50 p-2.5 rounded-t-lg font-bold text-blue-950">
                    <span>Non-Current / Fixed Assets</span>
                    <span>
                      {Number(
                        report?.assets?.totalNonCurrentAssets || 0
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                      Tk
                    </span>
                  </div>
                  <Table
                    columns={itemColumns}
                    dataSource={report?.assets?.nonCurrentAssets || []}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </div>
              )}

              {/* Total Assets Subtotal */}
              <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg font-bold text-lg text-blue-950 border border-blue-300">
                <span>TOTAL ASSETS</span>
                <span className="text-xl">
                  {totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                  Tk
                </span>
              </div>
            </div>

            <Divider />

            {/* ================= LIABILITIES ================= */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-900 border-b pb-2 m-0">
                2. LIABILITIES
              </h3>

              {/* Current Liabilities */}
              <div>
                <div className="flex justify-between items-center bg-orange-50 p-2.5 rounded-t-lg font-bold text-orange-950">
                  <span>Current Liabilities (Accounts Payable, Tax Payable)</span>
                  <span>
                    {Number(
                      report?.liabilities?.totalCurrentLiabilities || 0
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                    Tk
                  </span>
                </div>
                <Table
                  columns={itemColumns}
                  dataSource={report?.liabilities?.currentLiabilities || []}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>

              {/* Total Liabilities Subtotal */}
              <div className="flex justify-between items-center bg-orange-100 p-3 rounded-lg font-bold text-base text-orange-950 border border-orange-300">
                <span>TOTAL LIABILITIES</span>
                <span>
                  {totalLiabilities.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  Tk
                </span>
              </div>
            </div>

            {/* ================= EQUITY ================= */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-900 border-b pb-2 m-0">
                3. OWNER EQUITY
              </h3>

              <div>
                <div className="flex justify-between items-center bg-purple-50 p-2.5 rounded-t-lg font-bold text-purple-950">
                  <span>Capital & Retained Earnings</span>
                  <span>
                    {totalEquity.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}{" "}
                    Tk
                  </span>
                </div>
                <Table
                  columns={itemColumns}
                  dataSource={report?.equity?.items || []}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>

              {/* Total Equity Subtotal */}
              <div className="flex justify-between items-center bg-purple-100 p-3 rounded-lg font-bold text-base text-purple-950 border border-purple-300">
                <span>TOTAL OWNER EQUITY</span>
                <span>
                  {totalEquity.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  Tk
                </span>
              </div>
            </div>

            {/* ================= FINAL TOTAL LIABILITIES & EQUITY ================= */}
            <div className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-xl font-bold text-xl shadow-md">
              <div>
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className="block text-xs font-normal text-gray-300 mt-1">
                  Liabilities ({totalLiabilities.toLocaleString()}) + Equity (
                  {totalEquity.toLocaleString()})
                </span>
              </div>
              <span className="text-2xl text-emerald-400">
                {totalLiabilitiesAndEquity.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                Tk
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
