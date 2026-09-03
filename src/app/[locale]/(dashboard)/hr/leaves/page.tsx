"use client";
import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useApplyLeaveMutation,
  useApproveLeaveMutation,
  useCreateLeaveTypeMutation,
  useGetEmployeesQuery,
  useGetLeaveRequestsQuery,
  useGetLeaveTypesQuery,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

type ModalType = "type" | "request";

export default function LeaveManagementPage() {
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const { data: typesData, isLoading: typesLoading, refetch: refetchTypes } = useGetLeaveTypesQuery(undefined);
  const { data: requestsData, isLoading: requestsLoading, refetch: refetchRequests } = useGetLeaveRequestsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const [createLeaveType, { isLoading: creatingType }] = useCreateLeaveTypeMutation();
  const [applyLeave, { isLoading: applyingLeave }] = useApplyLeaveMutation();
  const [approveLeave] = useApproveLeaveMutation();

  const leaveTypes = typesData?.data || [];
  const leaveRequests = requestsData?.data || [];
  const employees = employeesData?.data || [];

  const openModal = (type: ModalType) => {
    setModalType(type);
    form.resetFields();
    form.setFieldsValue({ daysAllowedPerYear: 14, isPaid: true, isActive: true });
  };

  const handleFinish = async (values: any) => {
    try {
      if (modalType === "type") {
        await createLeaveType(values).unwrap();
        message.success("Leave type created");
      }
      if (modalType === "request") {
        const startDate = values.dateRange?.[0];
        const endDate = values.dateRange?.[1];
        await applyLeave({
          ...values,
          dateRange: undefined,
          startDate: startDate?.format("YYYY-MM-DD"),
          endDate: endDate?.format("YYYY-MM-DD"),
          daysCount: endDate && startDate ? endDate.diff(startDate, "day") + 1 : values.daysCount,
        }).unwrap();
        message.success("Leave request submitted");
      }
      setModalType(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Unable to save leave data");
    }
  };

  const handleApproval = async (id: string, approved: boolean) => {
    try {
      await approveLeave({ id, approved, remarks: approved ? "Approved from HR panel" : "Rejected from HR panel" }).unwrap();
      message.success(approved ? "Leave approved" : "Leave rejected");
      refetchRequests();
    } catch (err: any) {
      message.error(err?.data?.message || "Unable to update leave status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Leave Management" />

      <Card
        title="Leave Requests"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchRequests()} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("request")}>
              Apply Leave
            </Button>
          </Space>
        }
      >
        <Table
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee", render: (name: string, record: any) => <span className="font-semibold">{name} ({record.employee?.employeeCode || "N/A"})</span> },
            { title: "Leave Type", dataIndex: ["leaveType", "name"], key: "leaveType" },
            { title: "Start", dataIndex: "startDate", key: "startDate" },
            { title: "End", dataIndex: "endDate", key: "endDate" },
            { title: "Days", dataIndex: "daysCount", key: "daysCount", align: "right" },
            { title: "Reason", dataIndex: "reason", key: "reason", ellipsis: true },
            { title: "Status", dataIndex: "status", key: "status", render: (status: string) => <Tag color={status === "Approved" ? "green" : status === "Rejected" ? "red" : "orange"}>{status}</Tag> },
            {
              title: "Action",
              key: "action",
              align: "center",
              render: (_: any, record: any) =>
                record.status === "Pending" ? (
                  <Space>
                    <Popconfirm title="Approve leave?" onConfirm={() => handleApproval(record.id, true)}>
                      <Button size="small" type="primary" icon={<CheckCircleOutlined />}>Approve</Button>
                    </Popconfirm>
                    <Popconfirm title="Reject leave?" onConfirm={() => handleApproval(record.id, false)}>
                      <Button size="small" danger icon={<CloseCircleOutlined />}>Reject</Button>
                    </Popconfirm>
                  </Space>
                ) : null,
            },
          ]}
          dataSource={leaveRequests}
          rowKey="id"
          loading={requestsLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Card
        title="Leave Types"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchTypes()} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("type")}>
              Add Leave Type
            </Button>
          </Space>
        }
      >
        <Table
          columns={[
            { title: "Name", dataIndex: "name", key: "name", render: (name: string) => <span className="font-semibold">{name}</span> },
            { title: "Days / Year", dataIndex: "daysAllowedPerYear", key: "daysAllowedPerYear", align: "right" },
            { title: "Paid", dataIndex: "isPaid", key: "isPaid", render: (paid: boolean) => <Tag color={paid ? "green" : "default"}>{paid ? "Paid" : "Unpaid"}</Tag> },
            { title: "Status", dataIndex: "isActive", key: "isActive", render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag> },
          ]}
          dataSource={leaveTypes}
          rowKey="id"
          loading={typesLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Modal
        title={modalType === "type" ? "Add Leave Type" : "Apply Leave"}
        open={!!modalType}
        onCancel={() => setModalType(null)}
        onOk={() => form.submit()}
        confirmLoading={creatingType || applyingLeave}
        destroyOnClose
        width={modalType === "request" ? 720 : 520}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {modalType === "type" && (
            <>
              <Form.Item name="name" label="Leave Type" rules={[{ required: true, message: "Enter leave type" }]}>
                <Input placeholder="e.g. Casual Leave" />
              </Form.Item>
              <Form.Item name="daysAllowedPerYear" label="Days Allowed Per Year">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="isPaid" label="Paid Leave" valuePropName="checked">
                  <Switch checkedChildren="Paid" unCheckedChildren="Unpaid" />
                </Form.Item>
                <Form.Item name="isActive" label="Status" valuePropName="checked">
                  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>
              </div>
            </>
          )}

          {modalType === "request" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Select employee" }]}>
                  <Select showSearch optionFilterProp="label" options={employees.map((employee: any) => ({ label: `${employee.fullName} (${employee.employeeCode})`, value: employee.id }))} />
                </Form.Item>
                <Form.Item name="leaveTypeId" label="Leave Type" rules={[{ required: true, message: "Select leave type" }]}>
                  <Select showSearch optionFilterProp="label" options={leaveTypes.map((type: any) => ({ label: type.name, value: type.id }))} />
                </Form.Item>
              </div>
              <Form.Item name="dateRange" label="Leave Dates" rules={[{ required: true, message: "Select leave dates" }]}>
                <DatePicker.RangePicker className="w-full" defaultPickerValue={[dayjs(), dayjs()]} />
              </Form.Item>
              <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Enter leave reason" }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
