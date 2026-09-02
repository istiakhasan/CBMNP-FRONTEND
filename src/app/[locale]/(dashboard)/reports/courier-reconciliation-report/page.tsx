"use client";
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Tag,
  Statistic,
  Input,
  Space,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  message,
  Alert,
} from "antd";
import {
  CarOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetDeliveryPartnersQuery } from "@/redux/api/partnerApi";
import {
  useGetSettlementsQuery,
  useReconcileSettlementMutation,
} from "@/redux/api/logisticsOperationsApi";

const { RangePicker } = DatePicker;

export default function CourierReconciliationReport() {
  const local = useLocale();
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerId, setPartnerId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any>(null);

  const queryParams: any = {};
  if (partnerId) queryParams.partnerId = partnerId;
  if (dateRange && dateRange[0] && dateRange[1]) {
    queryParams.startDate = dateRange[0].format("YYYY-MM-DD");
    queryParams.endDate = dateRange[1].format("YYYY-MM-DD");
  }

  const { data: partnerRes } = useGetDeliveryPartnersQuery(undefined);
  const { data: settleRes, isLoading, refetch } = useGetSettlementsQuery(queryParams);
  const [reconcileSettlement, { isLoading: isReconciling }] = useReconcileSettlementMutation();

  const partners: any[] = partnerRes?.data || [];
  const settlements: any[] = settleRes?.data || [];

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        settlementDate: values.settlementDate.format("YYYY-MM-DD"),
      };
      await reconcileSettlement(payload).unwrap();
      message.success("Courier settlement recorded and reconciled successfully!");
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record courier settlement");
    }
  };

  const totalCollected = settlements.reduce(
    (s, st) => s + Number(st.totalCodCollected || st.totalCollectedCod || 0),
    0
  );
  const totalCourierFees = settlements.reduce(
    (s, st) => s + Number(st.totalDeliveryCharges || st.totalDeliveryCharge || 0),
    0
  );
  const totalRemitted = settlements.reduce(
    (s, st) => s + Number(st.netDisbursedAmount || st.netRemittedAmount || 0),
    0
  );
  const totalVariance = settlements.reduce(
    (s, st) => s + Number(st.variance || st.varianceAmount || 0),
    0
  );

  const filteredSettlements = settlements.filter((st: any) => {
    const partnerName = st.courierPartner?.name || st.partner?.name || "";
    return (
      st.settlementNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.bankDepositReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns: any = [
    {
      title: "Settlement #",
      dataIndex: "settlementNumber",
      key: "settlementNumber",
      render: (num: string) => <Tag color="blue" className="font-mono">{num}</Tag>,
    },
    {
      title: "Courier Partner",
      key: "partner",
      render: (_: any, record: any) => {
        const pName = record.courierPartner?.name || record.partner?.name || "Courier Partner";
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
              <CarOutlined />
            </div>
            <span className="font-bold text-gray-800">{pName}</span>
          </div>
        );
      },
    },
    {
      title: "Settlement Date",
      dataIndex: "settlementDate",
      key: "settlementDate",
    },
    {
      title: "COD Collected (Tk)",
      key: "totalCodCollected",
      sorter: (a: any, b: any) =>
        Number(a.totalCodCollected || a.totalCollectedCod || 0) -
        Number(b.totalCodCollected || b.totalCollectedCod || 0),
      render: (_: any, record: any) => {
        const val = Number(record.totalCodCollected || record.totalCollectedCod || 0);
        return `৳ ${val.toLocaleString()}`;
      },
    },
    {
      title: "Courier Deductions (Tk)",
      key: "totalDeliveryCharges",
      render: (_: any, record: any) => {
        const val = Number(record.totalDeliveryCharges || record.totalDeliveryCharge || 0);
        return (
          <span className="text-amber-700 font-semibold">
            ৳ ${val.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Net Bank Remitted (Tk)",
      key: "netDisbursedAmount",
      sorter: (a: any, b: any) =>
        Number(a.netDisbursedAmount || a.netRemittedAmount || 0) -
        Number(b.netDisbursedAmount || b.netRemittedAmount || 0),
      render: (_: any, record: any) => {
        const val = Number(record.netDisbursedAmount || record.netRemittedAmount || 0);
        return (
          <span className="font-extrabold text-emerald-700">
            ৳ ${val.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Variance / Loss (Tk)",
      key: "variance",
      render: (_: any, record: any) => {
        const val = Number(record.variance || record.varianceAmount || 0);
        if (val > 0) {
          return <span className="text-rose-600 font-bold">৳ {val.toLocaleString()} (Discrepancy)</span>;
        } else if (val < 0) {
          return <span className="text-amber-600 font-semibold">৳ {val.toLocaleString()}</span>;
        }
        return <Tag color="success">Reconciled</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "Reconciled" || status === "Verified") return <Tag color="success">Reconciled</Tag>;
        if (status === "Discrepancy" || status === "Disputed") return <Tag color="error">Discrepancy</Tag>;
        return <Tag color="warning">{status || "Unreconciled"}</Tag>;
      },
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Courier COD Remittance & Variance Reconciliation Report" />
      <div className="p-4 md:p-6 space-y-6  mx-auto">
        {/* Header with Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Courier COD Reconciliation & Settlements
            </h2>
          </Space>
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              className="bg-blue-600"
            >
              + Record Courier Settlement
            </Button>
            <RangePicker
              value={dateRange}
              onChange={(val) => setDateRange(val)}
              className="w-64"
              placeholder={["Start Date", "End Date"]}
            />
            <Select
              placeholder="Filter by Courier Partner"
              className="w-56"
              allowClear
              value={partnerId}
              onChange={(v) => setPartnerId(v)}
              options={partners.map((p: any) => ({
                label: p.name || p.partnerName || "Courier",
                value: p.id,
              }))}
            />
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Statement
            </Button>
          </Space>
        </div>

        {/* Informational Guidance Banner if 0 settlements */}
        {settlements.length === 0 && (
          <Alert
            message="How Courier COD Reconciliation Works"
            description="When delivery partners (e.g. Steadfast, Pathao, RedX) deposit collected cash into your bank account, click '+ Record Courier Settlement' above or visit Logistics Ops > COD Settlements to log the batch statement. The ERP will automatically verify variances between expected order totals and actual bank deposits."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="rounded-xl border-blue-200 bg-blue-50/50"
          />
        )}

        {/* KPI Flash Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total COD Collected"
                value={totalCollected}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#1e3a8a" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Cash collected by delivery carriers
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-amber-50/40">
              <Statistic
                title="Delivery Fee Deductions"
                value={totalCourierFees}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#b45309" }}
              />
              <span className="text-xs text-amber-700 mt-1 block">
                Carrier shipping charges deducted
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-emerald-50/40">
              <Statistic
                title="Net Bank Remittances"
                value={totalRemitted}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#059669" }}
              />
              <span className="text-xs text-emerald-700 mt-1 block">
                Total cash deposited into bank
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-rose-50/40">
              <Statistic
                title="Reconciliation Variance"
                value={totalVariance}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#dc2626" }}
              />
              <span className="text-xs text-rose-700 mt-1 block">
                COD variance & settlement shortages
              </span>
            </Card>
          </Col>
        </Row>

        {/* Table View */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Courier COD Settlements Registry ({filteredSettlements.length} Batches)
            </span>
            <Input
              placeholder="Search by Settlement #, Courier, Bank Ref..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredSettlements}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </Card>

        {/* Record Settlement Modal */}
        <Modal
          title="Record Courier COD Remittance & Settlement Payout"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          confirmLoading={isReconciling}
          destroyOnClose
          width={650}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ settlementDate: dayjs() }}
          >
            <Form.Item
              name="courierPartnerId"
              label="Courier Partner"
              rules={[{ required: true, message: "Please select courier partner" }]}
            >
              <Select
                placeholder="Select Courier Partner"
                options={partners.map((p: any) => ({
                  label: p.name || p.partnerName || "Courier",
                  value: p.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="settlementDate"
              label="Bank Remittance Date"
              rules={[{ required: true, message: "Please select settlement date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="totalCodCollected"
                label="Total COD Collected by Courier (Tk)"
                rules={[{ required: true, message: "Enter total COD amount" }]}
              >
                <InputNumber min={0} precision={2} className="w-full" placeholder="e.g. 50000" />
              </Form.Item>

              <Form.Item
                name="totalDeliveryCharges"
                label="Delivery Fees Deducted (Tk)"
                rules={[{ required: true, message: "Enter courier delivery charges" }]}
              >
                <InputNumber min={0} precision={2} className="w-full" placeholder="e.g. 3500" />
              </Form.Item>
            </div>

            <Form.Item
              name="netDisbursedAmount"
              label="Net Cash Deposited in Bank (Tk)"
              rules={[{ required: true, message: "Enter net deposited amount" }]}
            >
              <InputNumber min={0} precision={2} className="w-full" placeholder="e.g. 46500" />
            </Form.Item>

            <Form.Item name="bankDepositReference" label="Bank Transaction Ref / Invoice #">
              <Input placeholder="e.g. TXN-STD-998271" />
            </Form.Item>

            <Form.Item name="notes" label="Reconciliation Notes">
              <Input.TextArea rows={2} placeholder="Optional settlement comments" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
