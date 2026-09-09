"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Tag,
  Space,
  Card,
  message,
  Tabs,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGarmentsPosQuery,
  useDecideGarmentsPoCheckMutation,
  useDecideGarmentsPoApprovalMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

export default function GarmentsPoApprovalPage() {
  const { canCheckPo, canApprovePo } = useGarmentsPermission();
  const [activeTab, setActiveTab] = useState<string>("pending_check");
  const [selectedPo, setSelectedPo] = useState<any>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [stage, setStage] = useState<"check" | "approval">("check");

  const [form] = Form.useForm();

  const { data: checkRes, isLoading: isCheckLoading, refetch: refetchCheck } = useGetGarmentsPosQuery({
    status: "pending_check",
    limit: 50,
  });

  const { data: approvalRes, isLoading: isApprLoading, refetch: refetchAppr } = useGetGarmentsPosQuery({
    status: "pending_approval",
    limit: 50,
  });

  const [decideCheck, { isLoading: isDecidingCheck }] = useDecideGarmentsPoCheckMutation();
  const [decideApproval, { isLoading: isDecidingAppr }] = useDecideGarmentsPoApprovalMutation();

  const checkList = checkRes?.data || [];
  const approvalList = approvalRes?.data || [];

  const handleOpenDecision = (po: any, actionStage: "check" | "approval") => {
    setSelectedPo(po);
    setStage(actionStage);
    form.resetFields();
    form.setFieldsValue({ decision: "approved" });
    setDecisionModalOpen(true);
  };

  const handleDecisionSubmit = async (values: any) => {
    try {
      if (stage === "check") {
        await decideCheck({
          id: selectedPo.id,
          decision: values.decision,
          note: values.note,
        }).unwrap();
        message.success(`PO check marked as ${values.decision}`);
      } else {
        await decideApproval({
          id: selectedPo.id,
          decision: values.decision,
          note: values.note,
        }).unwrap();
        message.success(`PO approval marked as ${values.decision}`);
      }
      setDecisionModalOpen(false);
      refetchCheck();
      refetchAppr();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit decision");
    }
  };

  const getColumns = (currentStage: "check" | "approval") => [
    {
      title: "PO #",
      key: "poNumber",
      render: (_: any, record: any) => (
        <span className="font-bold text-purple-600">{record.supplierPoNo || record.poNumber || "-"}</span>
      ),
    },
    {
      title: "Buyer Order",
      key: "order",
      render: (_: any, record: any) => {
        const ord = record.order || record.buyerOrder;
        return ord ? (
          <div>
            <div className="font-semibold text-blue-700">{ord.orderNo || ord.orderNumber}</div>
            <div className="text-xs text-gray-500">{ord.buyerName}</div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (name: string) => <span className="font-semibold text-gray-800">{name}</span>,
    },
    {
      title: "Line Items",
      key: "items",
      render: (_: any, record: any) => (
        <span>{record.items?.length || 0} items ({record.items?.map((i: any) => i.itemName).slice(0, 2).join(", ")}...)</span>
      ),
    },
    {
      title: "Grand Total",
      key: "grandTotal",
      render: (_: any, record: any) => {
        const amt = record.totalAmount !== undefined ? record.totalAmount : record.grandTotal;
        return (
          <span className="font-bold text-green-700">
            {record.currency || "USD"} {Number(amt || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Created By / Date",
      key: "created",
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-gray-800">{record.createdBy || "Admin"}</div>
          <div className="text-xs text-gray-400">{dayjs(record.createdAt).format("DD MMM YYYY")}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const isAllowed = currentStage === "check" ? canCheckPo : canApprovePo;
        return (
          <Space size="small">
            {isAllowed ? (
              <Button
                type="primary"
                icon={<AuditOutlined />}
                size="small"
                className={currentStage === "check" ? "bg-amber-600" : "bg-green-600"}
                onClick={() => handleOpenDecision(record, currentStage)}
              >
                {currentStage === "check" ? "Check & Verify" : "Authorize Approval"}
              </Button>
            ) : (
              <Tooltip title={currentStage === "check" ? "Requires PO Checker permission" : "Requires PO Final Approver permission"}>
                <Tag color="orange">Pending Authorized Person</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / PO Verification & Approval" />

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800">Multi-Stage Purchase Order Approvals</h3>
            <p className="text-xs text-gray-500">
              Stage 1: Store/Checker Verification → Stage 2: Management/GM Final Approval.
            </p>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              refetchCheck();
              refetchAppr();
            }}
          >
            Refresh
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "pending_check",
              label: (
                <span>
                  Stage 1: Pending Check <Badge count={checkList.length} offset={[8, -2]} />
                </span>
              ),
              children: (
                <Table
                  dataSource={checkList}
                  columns={getColumns("check")}
                  rowKey="id"
                  loading={isCheckLoading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: "pending_approval",
              label: (
                <span>
                  Stage 2: Final Approval <Badge count={approvalList.length} offset={[8, -2]} />
                </span>
              ),
              children: (
                <Table
                  dataSource={approvalList}
                  columns={getColumns("approval")}
                  rowKey="id"
                  loading={isApprLoading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Decision Modal */}
      <Modal
        title={`${stage === "check" ? "Stage 1: PO Checker Review" : "Stage 2: Final PO Approval"} - ${selectedPo?.poNumber || ""}`}
        open={decisionModalOpen}
        onCancel={() => setDecisionModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedPo && (
          <Form form={form} layout="vertical" onFinish={handleDecisionSubmit}>
            <div className="bg-gray-50 p-3 rounded mb-4 text-xs space-y-1 border">
              <div><strong>Supplier:</strong> {selectedPo.supplierName}</div>
              <div><strong>Grand Total:</strong> {selectedPo.currency || "USD"} {Number(selectedPo.grandTotal || 0).toLocaleString()}</div>
              <div><strong>Items Count:</strong> {selectedPo.items?.length || 0} line items</div>
            </div>

            <Form.Item
              name="decision"
              label="Decision"
              rules={[{ required: true }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="approved">
                  <CheckCircleOutlined className="mr-1 text-green-500" />
                  {stage === "check" ? "Pass Check (Move to Final Approval)" : "Authorize Approval"}
                </Radio.Button>
                <Radio.Button value="rejected">
                  <CloseCircleOutlined className="mr-1 text-red-500" />
                  Reject PO
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="note" label="Approval / Rejection Remarks">
              <Input.TextArea rows={3} placeholder="Add any comments, verification notes, or price adjustments..." />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setDecisionModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isDecidingCheck || isDecidingAppr}
                className="bg-blue-600"
              >
                Submit Decision
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
