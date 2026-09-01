"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined, LockOutlined, DollarOutlined } from "@ant-design/icons";
import {
  useGetPosSessionsQuery,
  useOpenPosSessionMutation,
  useRecordCashMovementMutation,
  useClosePosSessionMutation,
} from "@/redux/api/salesOperationsApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function PosSessionPage() {
  const [openForm] = Form.useForm();
  const [closeForm] = Form.useForm();
  const [movementForm] = Form.useForm();

  const [openModal, setOpenModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [movementModal, setMovementModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const { data, isLoading, refetch } = useGetPosSessionsQuery(undefined);
  const { data: warehousesData } = useLoadAllWarehouseQuery(undefined);

  const [openSession, { isLoading: isOpening }] = useOpenPosSessionMutation();
  const [recordCashMovement, { isLoading: isMoving }] = useRecordCashMovementMutation();
  const [closeSession, { isLoading: isClosing }] = useClosePosSessionMutation();

  const handleOpen = async (values: any) => {
    try {
      await openSession(values).unwrap();
      message.success("POS Register shift opened successfully");
      setOpenModal(false);
      openForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to open shift");
    }
  };

  const handleCashMovement = async (values: any) => {
    try {
      await recordCashMovement({ ...values, sessionId: selectedSession.id }).unwrap();
      message.success("Cash movement recorded");
      setMovementModal(false);
      movementForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record movement");
    }
  };

  const handleClose = async (values: any) => {
    try {
      await closeSession({ id: selectedSession.id, ...values }).unwrap();
      message.success("POS Register shift closed and reconciled");
      setCloseModal(false);
      closeForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to close shift");
    }
  };

  const sessions = data?.data || [];
  const warehouses = warehousesData?.data || [];
  const activeSession = sessions.find((s: any) => s.status === "Open");

  const columns: any = [
    {
      title: "Shift #",
      dataIndex: "sessionNumber",
      key: "sessionNumber",
      render: (num: string) => <span className="font-bold text-blue-600">{num}</span>,
    },
    {
      title: "Opened At",
      dataIndex: "openedAt",
      key: "openedAt",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: "Closed At",
      dataIndex: "closedAt",
      key: "closedAt",
      render: (d: string) => d ? new Date(d).toLocaleString() : <Tag color="blue">Active Now</Tag>,
    },
    {
      title: "Opening Float (Tk)",
      dataIndex: "openingCash",
      key: "openingCash",
      align: "right" as const,
      render: (amt: number) => Number(amt || 0).toLocaleString(),
    },
    {
      title: "Cash Sales (Tk)",
      dataIndex: "totalCashSales",
      key: "totalCashSales",
      align: "right" as const,
      render: (amt: number) => Number(amt || 0).toLocaleString(),
    },
    {
      title: "Counted Cash (Tk)",
      dataIndex: "actualClosingCash",
      key: "actualClosingCash",
      align: "right" as const,
      render: (amt: number) => amt ? Number(amt || 0).toLocaleString() : "-",
    },
    {
      title: "Variance (Tk)",
      dataIndex: "cashVariance",
      key: "cashVariance",
      align: "right" as const,
      render: (amt: number) => {
        if (amt === null || amt === undefined) return "-";
        const val = Number(amt);
        return (
          <span className={`font-bold ${val === 0 ? "text-emerald-700" : val > 0 ? "text-blue-700" : "text-rose-700"}`}>
            {val > 0 ? `+${val}` : val}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Open" ? "green" : "default"}>{st}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Open" && (
            <>
              <Button
                size="small"
                onClick={() => {
                  setSelectedSession(record);
                  setMovementModal(true);
                }}
              >
                Cash In/Out
              </Button>
              <Button
                size="small"
                danger
                icon={<LockOutlined />}
                onClick={() => {
                  setSelectedSession(record);
                  setCloseModal(true);
                }}
              >
                Close Shift
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="POS Cash Register Shifts & Drawer Management" />

      {activeSession ? (
        <Card className="border-l-4 border-emerald-500 bg-emerald-50 shadow-sm">
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <h3 className="font-bold text-emerald-900 m-0">
                ACTIVE POS SHIFT: {activeSession.sessionNumber}
              </h3>
              <p className="text-emerald-700 text-sm m-0">
                Opened at {new Date(activeSession.openedAt).toLocaleTimeString()} with opening cash of{" "}
                <strong>{Number(activeSession.openingCash || 0).toLocaleString()} Tk</strong>.
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  onClick={() => {
                    setSelectedSession(activeSession);
                    setMovementModal(true);
                  }}
                >
                  Drawer Cash In / Out
                </Button>
                <Button
                  danger
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={() => {
                    setSelectedSession(activeSession);
                    setCloseModal(true);
                  }}
                >
                  End Shift & Count Cash
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className="border-l-4 border-amber-500 bg-amber-50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-amber-900 m-0">No Active POS Shift Open</h3>
              <p className="text-amber-700 text-sm m-0">Open a cashier register shift to begin processing POS sales.</p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Open Register Shift
            </Button>
          </div>
        </Card>
      )}

      {/* History */}
      <Card
        title="Shift History & Daily Register Closings"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={sessions} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Open Shift Modal */}
      <Modal
        title="Open POS Cash Register Shift"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => openForm.submit()}
        confirmLoading={isOpening}
        destroyOnClose
      >
        <Form form={openForm} layout="vertical" onFinish={handleOpen} initialValues={{ openingCash: 1000 }}>
          <Form.Item name="warehouseId" label="Counter / Branch Location">
            <Select
              placeholder="Select Outlet"
              allowClear
              options={warehouses.map((w: any) => ({
                label: w.name || w.warehouseName || w.location || "Branch Outlet",
                value: w.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="openingCash" label="Opening Drawer Float Cash (Tk)" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Cash In / Out Modal */}
      <Modal
        title="Drawer Cash In / Cash Out"
        open={movementModal}
        onCancel={() => setMovementModal(false)}
        onOk={() => movementForm.submit()}
        confirmLoading={isMoving}
        destroyOnClose
      >
        <Form form={movementForm} layout="vertical" onFinish={handleCashMovement} initialValues={{ type: "CashOut" }}>
          <Form.Item name="type" label="Movement Type" rules={[{ required: true }]}>
            <Select>
              <Option value="CashIn">Cash In (Float Top-up / Injection)</Option>
              <Option value="CashOut">Cash Out (Petty Expense / Drawer Drop)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount (Tk)" rules={[{ required: true }]}>
            <InputNumber min={1} precision={2} className="w-full" />
          </Form.Item>

          <Form.Item name="reason" label="Reason / Purpose" rules={[{ required: true }]}>
            <Input placeholder="e.g. Bought customer refreshments or cash drop to bank" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Close Shift Modal */}
      <Modal
        title="End Shift: Count Physical Drawer Cash"
        open={closeModal}
        onCancel={() => setCloseModal(false)}
        onOk={() => closeForm.submit()}
        confirmLoading={isClosing}
        destroyOnClose
      >
        <Form form={closeForm} layout="vertical" onFinish={handleClose}>
          <Form.Item name="actualClosingCash" label="Actual Counted Cash in Drawer (Tk)" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} className="w-full" placeholder="Enter counted physical notes & coins" />
          </Form.Item>

          <Form.Item name="closingNotes" label="Closing Notes / Discrepancy Explanation">
            <Input.TextArea rows={2} placeholder="Optional notes" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
