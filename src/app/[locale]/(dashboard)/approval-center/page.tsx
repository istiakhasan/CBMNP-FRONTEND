"use client";

import React, { useState } from "react";
import { Card, Tag, Button, Modal, Form, Input, Select, Space, message, Empty, Alert, Badge } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetApprovalCenterItemsQuery,
  useApproveLeaveMutation,
  useApproveExpenseClaimMutation,
  useApproveOvertimeRequestMutation,
  useApproveAttendanceCorrectionMutation,
  useApproveHolidayMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  leave: { label: "Leave", icon: <CalendarOutlined />, color: "blue" },
  expense: { label: "Expense Claim", icon: <DollarOutlined />, color: "gold" },
  overtime: { label: "Overtime", icon: <ClockCircleOutlined />, color: "purple" },
  correction: { label: "Attendance Correction", icon: <FileTextOutlined />, color: "cyan" },
  holiday: { label: "Holiday", icon: <CalendarOutlined />, color: "magenta" },
};

export default function ApprovalCenterPage() {
  const { data, isLoading, isFetching, refetch } = useGetApprovalCenterItemsQuery(undefined);
  const [approveLeave] = useApproveLeaveMutation();
  const [approveExpense] = useApproveExpenseClaimMutation();
  const [approveOvertime] = useApproveOvertimeRequestMutation();
  const [approveCorrection] = useApproveAttendanceCorrectionMutation();
  const [approveHoliday] = useApproveHolidayMutation();

  const [reviewItem, setReviewItem] = useState<any>(null);
  const [reviewForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const result = data?.data || {};
  const items: any[] = result.items || [];

  const openReview = (item: any) => {
    setReviewItem(item);
    reviewForm.setFieldsValue({ approved: true, remarks: "" });
  };

  const handleDecision = async (values: any) => {
    if (!reviewItem) return;
    setSubmitting(true);
    try {
      const payload = { id: reviewItem.id, approved: values.approved, remarks: values.remarks || "" };
      const mutationByType: Record<string, any> = {
        leave: approveLeave,
        expense: approveExpense,
        overtime: approveOvertime,
        correction: approveCorrection,
        holiday: approveHoliday,
      };
      const mutate = mutationByType[reviewItem.requestType];
      await mutate(payload).unwrap();
      message.success(
        values.approved
          ? reviewItem.approvalStage === "PendingDeptHead"
            ? "Approved — moved on to the Final Approver"
            : "Approved — fully finalized"
          : "Rejected"
      );
      setReviewItem(null);
      reviewForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record your decision");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Approval Center" />

      {!isLoading && (
        <Alert
          type="info"
          showIcon
          message={
            result.isDeptHead && result.isFinalApprover
              ? `You're acting as Department Head (${result.headedDepartments?.join(", ")}) and Final Approver`
              : result.isDeptHead
              ? `You're seeing Stage 1 requests for: ${result.headedDepartments?.join(", ")}`
              : result.isFinalApprover
              ? "You're seeing all Stage 2 (Final Approval) requests, org-wide"
              : "Nothing is routed to you for approval — you're not a Department Head or Final Approver"
          }
          className="mb-2"
        />
      )}

      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title={
          <div className="flex items-center gap-2">
            <span>Pending Your Decision</span>
            <Badge count={items.length} showZero color={items.length ? "#dc2626" : "#9ca3af"} />
          </div>
        }
        extra={<Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button>}
      >
        {items.length === 0 ? (
          <div className="py-14">
            <Empty description={isLoading || isFetching ? "Loading..." : "Nothing waiting on you right now"} />
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => {
              const meta = TYPE_META[item.requestType] || { label: item.requestType, icon: null, color: "default" };
              return (
                <div
                  key={`${item.requestType}-${item.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Tag color={meta.color} className="flex items-center gap-1">
                        {meta.icon} {meta.label}
                      </Tag>
                      <Tag color={item.approvalStage === "PendingDeptHead" ? "gold" : "blue"}>
                        {item.approvalStage === "PendingDeptHead" ? "Step 1: Dept Head" : "Step 2: Final Approver"}
                      </Tag>
                      <span className="text-xs text-gray-400">{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {item.employee?.fullName}
                      <span className="text-xs text-gray-400 font-normal ml-2">
                        {item.employee?.department?.name || "Staff"} · {item.employee?.employeeCode}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-0.5">{item.summary}</div>
                    {item.reason && <div className="text-xs text-gray-500 mt-0.5 max-w-2xl truncate">{item.reason}</div>}
                  </div>
                  <Button
                    type="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 border-none shrink-0"
                    onClick={() => openReview(item)}
                  >
                    Review / Decide
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        title={
          reviewItem ? (
            <span className="flex items-center gap-2">
              {TYPE_META[reviewItem.requestType]?.icon} {TYPE_META[reviewItem.requestType]?.label} — {reviewItem.employee?.fullName}
            </span>
          ) : ""
        }
        open={Boolean(reviewItem)}
        onCancel={() => setReviewItem(null)}
        footer={null}
        destroyOnClose
      >
        {reviewItem && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border text-xs space-y-1">
            <div><span className="text-gray-400">Employee: </span><span className="font-bold text-gray-900">{reviewItem.employee?.fullName}</span></div>
            <div><span className="text-gray-400">Details: </span><span className="font-semibold text-gray-800">{reviewItem.summary}</span></div>
            {reviewItem.reason && <div><span className="text-gray-400">Reason: </span><span className="text-gray-700">{reviewItem.reason}</span></div>}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Tag color={reviewItem.approvalStage === "PendingDeptHead" ? "gold" : "blue"}>
                {reviewItem.approvalStage === "PendingDeptHead" ? "You are acting as Department Head" : "You are acting as Final Approver"}
              </Tag>
            </div>
          </div>
        )}

        <Form form={reviewForm} layout="vertical" onFinish={handleDecision}>
          <Form.Item name="approved" label="Decision" initialValue={true}>
            <Select>
              <Option value={true}><CheckCircleOutlined className="text-emerald-600 mr-1" /> Approve</Option>
              <Option value={false}><CloseCircleOutlined className="text-rose-600 mr-1" /> Reject</Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks / Comments">
            <Input.TextArea rows={2} placeholder="Optional notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setReviewItem(null)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} className="bg-emerald-600 hover:bg-emerald-700 border-none">
              Confirm Decision
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
