"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  useCreateCommissionRuleMutation,
  useGetCommissionRulesQuery,
  useGetCommissionsQuery,
  useGetEmployeesQuery,
  useGetSalesTargetsQuery,
  useSetSalesTargetMutation,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

type ModalType = "commissionRule" | "target";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function HrPerformancePage() {
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data: rulesData, isLoading: rulesLoading, refetch: refetchRules } = useGetCommissionRulesQuery(undefined);
  const { data: commissionsData, isLoading: commissionsLoading, refetch: refetchCommissions } = useGetCommissionsQuery(undefined);
  const { data: targetsData, isLoading: targetsLoading, refetch: refetchTargets } = useGetSalesTargetsQuery(undefined);
  const [createCommissionRule, { isLoading: creatingRule }] = useCreateCommissionRuleMutation();
  const [setSalesTarget, { isLoading: savingTarget }] = useSetSalesTargetMutation();

  const employees = employeesData?.data || [];
  const rules = rulesData?.data || [];
  const commissions = commissionsData?.data || [];
  const targets = targetsData?.data || [];

  const openModal = (type: ModalType) => {
    setModalType(type);
    form.resetFields();
    form.setFieldsValue({
      commissionType: "PercentageOfOrder",
      rate: 0,
      triggerOrderStatusId: 8,
      isActive: true,
      periodType: "Monthly",
      year: new Date().getFullYear(),
      periodValue: new Date().getMonth() + 1,
      targetRevenue: 0,
      targetOrdersCount: 0,
    });
  };

  const handleFinish = async (values: any) => {
    try {
      if (modalType === "commissionRule") {
        await createCommissionRule(values).unwrap();
        message.success("Commission rule created");
      }
      if (modalType === "target") {
        await setSalesTarget(values).unwrap();
        message.success("Sales target saved");
      }
      setModalType(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Unable to save performance data");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Commissions & Sales Targets" />

      <Card
        title="Commission Rules"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchRules()} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("commissionRule")}>
              Add Rule
            </Button>
          </Space>
        }
      >
        <Table
          columns={[
            { title: "Rule", dataIndex: "name", key: "name", render: (name: string) => <span className="font-semibold">{name}</span> },
            { title: "Type", dataIndex: "commissionType", key: "commissionType", render: (type: string) => type === "PercentageOfOrder" ? "Percentage of Order" : "Flat Amount" },
            { title: "Rate", dataIndex: "rate", key: "rate", align: "right", render: (rate: number, record: any) => record.commissionType === "PercentageOfOrder" ? `${Number(rate || 0)}%` : `Tk ${Number(rate || 0).toLocaleString()}` },
            { title: "Applies To", dataIndex: ["specificEmployee", "fullName"], key: "specificEmployee", render: (name: string) => name || "All eligible employees" },
            { title: "Status", dataIndex: "isActive", key: "isActive", render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag> },
          ]}
          dataSource={rules}
          rowKey="id"
          loading={rulesLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Card
        title="Sales Targets"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchTargets()} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("target")}>
              Set Target
            </Button>
          </Space>
        }
      >
        <Table
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee", render: (name: string, record: any) => <span className="font-semibold">{name} ({record.employee?.employeeCode || "N/A"})</span> },
            { title: "Period", key: "period", render: (_: any, record: any) => record.periodType === "Monthly" ? `${months[(record.periodValue || 1) - 1]} ${record.year}` : `${record.periodType} ${record.periodValue}, ${record.year}` },
            { title: "Target Revenue", dataIndex: "targetRevenue", key: "targetRevenue", align: "right", render: (amount: number) => Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            { title: "Achieved Revenue", dataIndex: "achievedRevenue", key: "achievedRevenue", align: "right", render: (amount: number) => Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            { title: "Target Orders", dataIndex: "targetOrdersCount", key: "targetOrdersCount", align: "right" },
            { title: "Achieved Orders", dataIndex: "achievedOrdersCount", key: "achievedOrdersCount", align: "right" },
          ]}
          dataSource={targets}
          rowKey="id"
          loading={targetsLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Card
        title="Earned Commissions"
        extra={<Button icon={<ReloadOutlined />} onClick={() => refetchCommissions()} />}
      >
        <Table
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee" },
            { title: "Order ID", dataIndex: "orderId", key: "orderId" },
            { title: "Order Amount", dataIndex: "orderAmount", key: "orderAmount", align: "right", render: (amount: number) => Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
            { title: "Commission", dataIndex: "commissionAmount", key: "commissionAmount", align: "right", render: (amount: number) => <span className="font-semibold text-emerald-700">{Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> },
            { title: "Earned Date", dataIndex: "earnedDate", key: "earnedDate" },
            { title: "Status", dataIndex: "status", key: "status", render: (status: string) => <Tag color={status === "Approved" ? "green" : "orange"}>{status}</Tag> },
          ]}
          dataSource={commissions}
          rowKey="id"
          loading={commissionsLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Modal
        title={modalType === "commissionRule" ? "Add Commission Rule" : "Set Sales Target"}
        open={!!modalType}
        onCancel={() => setModalType(null)}
        onOk={() => form.submit()}
        confirmLoading={creatingRule || savingTarget}
        destroyOnClose
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {modalType === "commissionRule" && (
            <>
              <Form.Item name="name" label="Rule Name" rules={[{ required: true, message: "Enter rule name" }]}>
                <Input placeholder="e.g. Delivered order incentive" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="commissionType" label="Commission Type" rules={[{ required: true }]}>
                  <Select
                    options={[
                      { label: "Percentage of Order", value: "PercentageOfOrder" },
                      { label: "Flat Amount Per Order", value: "FlatAmountPerOrder" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="rate" label="Rate" rules={[{ required: true, message: "Enter rate" }]}>
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="specificEmployeeId" label="Specific Employee">
                  <Select allowClear showSearch optionFilterProp="label" options={employees.map((employee: any) => ({ label: `${employee.fullName} (${employee.employeeCode})`, value: employee.id }))} />
                </Form.Item>
                <Form.Item name="triggerOrderStatusId" label="Trigger Order Status ID">
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
              </div>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </>
          )}

          {modalType === "target" && (
            <>
              <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Select employee" }]}>
                <Select showSearch optionFilterProp="label" options={employees.map((employee: any) => ({ label: `${employee.fullName} (${employee.employeeCode})`, value: employee.id }))} />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="periodType" label="Period Type" rules={[{ required: true }]}>
                  <Select options={[{ label: "Monthly", value: "Monthly" }, { label: "Quarterly", value: "Quarterly" }, { label: "Yearly", value: "Yearly" }]} />
                </Form.Item>
                <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                  <InputNumber min={2020} max={2100} className="w-full" />
                </Form.Item>
                <Form.Item name="periodValue" label="Period Value" rules={[{ required: true }]}>
                  <InputNumber min={1} max={12} className="w-full" />
                </Form.Item>
                <Form.Item name="targetOrdersCount" label="Target Orders">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="targetRevenue" label="Target Revenue" rules={[{ required: true, message: "Enter target revenue" }]}>
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
