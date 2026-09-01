"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Input,
  Card,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetSettlementsQuery,
  useReconcileSettlementMutation,
} from "@/redux/api/logisticsOperationsApi";
import { useGetDeliveryPartnersQuery } from "@/redux/api/partnerApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function CourierSettlementsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetSettlementsQuery(undefined);
  const { data: partnersData } = useGetDeliveryPartnersQuery(undefined);
  const [reconcileSettlement, { isLoading: isReconciling }] = useReconcileSettlementMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        settlementDate: values.settlementDate.format("YYYY-MM-DD"),
      };
      await reconcileSettlement(payload).unwrap();
      message.success("Courier settlement recorded and reconciled");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to reconcile settlement");
    }
  };

  const settlements = data?.data || [];
  const partners = partnersData?.data || [];

  const columns: any = [
    {
      title: "Settlement #",
      dataIndex: "settlementNumber",
      key: "settlementNumber",
      render: (num: string) => <span className="font-bold text-blue-600">{num}</span>,
    },
    {
      title: "Date",
      dataIndex: "settlementDate",
      key: "settlementDate",
    },
    {
      title: "Courier Partner",
      dataIndex: ["courierPartner", "partnerName"],
      key: "courierPartner",
      render: (name: string, record: any) => (
        <span className="font-semibold text-orange-600">{name || record.courierPartner?.name}</span>
      ),
    },
    {
      title: "COD Collected (Tk)",
      dataIndex: "totalCodCollected",
      key: "totalCodCollected",
      align: "right" as const,
      render: (amt: number) => Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      title: "Carrier Charges (Tk)",
      dataIndex: "totalDeliveryCharges",
      key: "totalDeliveryCharges",
      align: "right" as const,
      render: (amt: number) => (
        <span className="text-rose-600">
          -{Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Net Deposited (Tk)",
      dataIndex: "netDisbursedAmount",
      key: "netDisbursedAmount",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-bold text-emerald-700">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Discrepancy (Tk)",
      dataIndex: "variance",
      key: "variance",
      align: "right" as const,
      render: (v: number) => {
        const val = Number(v || 0);
        return (
          <span className={`font-bold ${Math.abs(val) < 1 ? "text-emerald-700" : "text-rose-700"}`}>
            {val === 0 ? "0.00 (Balanced)" : val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Reconciled" ? "green" : "volcano"}>{st}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Courier COD Remittance & Settlement Reconciliation" />

      <Card
        title="Settlement Statements"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Record Courier Remittance
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={settlements} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Record Courier Remittance Payout"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isReconciling}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ settlementDate: dayjs() }}>
          <Form.Item name="courierPartnerId" label="Courier Partner" rules={[{ required: true }]}>
            <Select placeholder="Select Courier Partner">
              {partners.map((p: any) => (
                <Option key={p.id} value={p.id}>
                  {p.partnerName || p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="settlementDate" label="Remittance Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="totalCodCollected" label="Total COD Collected (Tk)" rules={[{ required: true }]}>
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>

            <Form.Item name="totalDeliveryCharges" label="Courier Fees Deducted (Tk)" rules={[{ required: true }]}>
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="netDisbursedAmount" label="Net Amount Deposited in Bank (Tk)" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} className="w-full" />
          </Form.Item>

          <Form.Item name="bankDepositReference" label="Bank Reference / Deposit Slip #">
            <Input placeholder="e.g. BRAC-TRF-091238" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
