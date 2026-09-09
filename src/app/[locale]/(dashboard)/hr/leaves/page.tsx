"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Tabs,
  DatePicker,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetLeaveRequestsQuery,
  useApplyLeaveMutation,
  useApproveLeaveMutation,
  useGetLeaveTypesQuery,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function LeavesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [applyModal, setApplyModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetLeaveRequestsQuery({
    status: selectedStatus || undefined,
  });
  const { data: leaveTypesData } = useGetLeaveTypesQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [applyLeave, { isLoading: isApplying }] = useApplyLeaveMutation();
  const [approveLeave, { isLoading: isApproving }] = useApproveLeaveMutation();

  const requests = data?.data || [];
  const leaveTypes = leaveTypesData?.data || [];
  const employees = employeesData?.data || [];

  const pendingCount = requests.filter((r: any) => r.status === "Pending").length;
  const approvedCount = requests.filter((r: any) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r: any) => r.status === "Rejected").length;

  const handleApply = async (values: any) => {
    try {
      const [start, end] = values.dateRange || [];
      const startDate = start ? dayjs(start).format("YYYY-MM-DD") : undefined;
      const endDate = end ? dayjs(end).format("YYYY-MM-DD") : undefined;
      const diff = end && start ? dayjs(end).diff(dayjs(start), "day") + 1 : 1;

      const payload = {
        employeeId: values.employeeId,
        leaveTypeId: values.leaveTypeId,
        startDate,
        endDate,
        daysCount: diff,
        reason: values.reason,
        emergencyPhone: values.emergencyPhone,
      };

      await applyLeave(payload).unwrap();
      message.success("Leave application submitted successfully");
      setApplyModal(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit leave application");
    }
  };

  const handleOpenReview = (record: any) => {
    setSelectedRequest(record);
    reviewForm.setFieldsValue({
      approved: true,
      remarks: "",
    });
    setReviewModal(true);
  };

  const handleReviewSubmit = async (values: any) => {
    try {
      await approveLeave({
        id: selectedRequest.id,
        approved: values.approved,
        remarks: values.remarks,
      }).unwrap();
      message.success(`Leave request ${values.approved ? "Approved" : "Rejected"}`);
      setReviewModal(false);
      reviewForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update leave status");
    }
  };

  const columns: any = [
    {
      title: "Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900 block text-sm">{name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {record.employee?.employeeCode} • {record.employee?.department?.name || "Staff"}
          </span>
        </div>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: ["leaveType", "name"],
      key: "leaveType",
      render: (lt: string) => <Tag color="blue">{lt || "Casual Leave"}</Tag>,
    },
    {
      title: "Date Range",
      key: "dates",
      render: (_: any, record: any) => (
        <div>
          <span className="font-medium text-gray-800 text-xs block">
            {record.startDate} ~ {record.endDate}
          </span>
          <span className="text-[11px] text-gray-400 font-bold">
            Total: {record.daysCount} Day(s)
          </span>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (r: string) => <span className="text-xs text-gray-600 max-w-xs block truncate">{r}</span>,
    },
    {
      title: "Emergency Phone",
      dataIndex: "emergencyPhone",
      key: "emergencyPhone",
      render: (p: string) => <span className="text-xs font-mono">{p || "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag
          color={st === "Approved" ? "green" : st === "Rejected" ? "volcano" : "orange"}
          className="font-medium px-2 py-0.5"
        >
          {st}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "Pending" ? (
            <Button
              size="small"
              type="primary"
              className="bg-emerald-600 hover:bg-emerald-700 text-xs"
              onClick={() => handleOpenReview(record)}
            >
              Review / Action
            </Button>
          ) : (
            <span className="text-xs text-gray-400 italic">
              {record.approvalRemarks || "Completed"}
            </span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Leave Management & Applications" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Pending Requests</span>}
              value={pendingCount}
              prefix={<ClockCircleOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Approved Leaves</span>}
              value={approvedCount}
              prefix={<CheckCircleOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Rejected Requests</span>}
              value={rejectedCount}
              prefix={<CloseCircleOutlined className="text-rose-500" />}
              valueStyle={{ fontWeight: "bold", color: "#e11d48" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Applications</span>}
              value={requests.length}
              prefix={<CalendarOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Select
                placeholder="Filter by Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                allowClear
                style={{ width: 160 }}
              >
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </div>

            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setApplyModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 border-none"
              >
                Apply for Leave
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          dataSource={requests}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* MODAL 1: APPLY FOR LEAVE */}
      <Modal
        title="Submit Leave Application"
        open={applyModal}
        onCancel={() => setApplyModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleApply}>
          <Form.Item
            name="employeeId"
            label="Employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select
              placeholder="Search employee..."
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="leaveTypeId"
            label="Leave Policy / Type"
            rules={[{ required: true, message: "Please select leave type" }]}
          >
            <Select placeholder="Select leave type">
              {leaveTypes.map((lt: any) => (
                <Option key={lt.id} value={lt.id}>
                  {lt.name} ({lt.daysAllowedPerYear} days quota)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Leave Date Range (Start ~ End Date)"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item name="emergencyPhone" label="Emergency Contact Phone">
            <Input placeholder="017XXXXXXXX" />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason for Leave"
            rules={[{ required: true, message: "Please state reason" }]}
          >
            <Input.TextArea rows={3} placeholder="Provide details about the leave requirement..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setApplyModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isApplying}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Submit Application
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: APPROVE / REJECT LEAVE APPLICATION */}
      <Modal
        title="Supervisor Leave Approval / Review"
        open={reviewModal}
        onCancel={() => setReviewModal(false)}
        footer={null}
        destroyOnClose
      >
        {selectedRequest && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border text-xs space-y-1">
            <div>
              <span className="text-gray-400">Employee: </span>
              <span className="font-bold text-gray-900">{selectedRequest.employee?.fullName}</span>
            </div>
            <div>
              <span className="text-gray-400">Leave Duration: </span>
              <span className="font-semibold text-gray-800">
                {selectedRequest.startDate} ~ {selectedRequest.endDate} ({selectedRequest.daysCount} Days)
              </span>
            </div>
            <div>
              <span className="text-gray-400">Reason: </span>
              <span className="text-gray-700">{selectedRequest.reason}</span>
            </div>
          </div>
        )}

        <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
          <Form.Item name="approved" label="Decision" initialValue={true}>
            <Select>
              <Option value={true}>Approve Application</Option>
              <Option value={false}>Reject Application</Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Supervisor Remarks / Comments">
            <Input.TextArea rows={2} placeholder="Optional notes for the employee..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setReviewModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isApproving}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Confirm Decision
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
