"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Tabs,
  Progress,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  TrophyOutlined,
  DollarOutlined,
  RiseOutlined,
  FundOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetSalesTargetsQuery,
  useSetSalesTargetMutation,
  useGetCommissionRulesQuery,
  useCreateCommissionRuleMutation,
  useGetCommissionsQuery,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { TabPane } = Tabs;

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState("targets");

  // Modals
  const [targetModal, setTargetModal] = useState(false);
  const [ruleModal, setRuleModal] = useState(false);

  // Forms
  const [targetForm] = Form.useForm();
  const [ruleForm] = Form.useForm();

  // Queries
  const { data: targetsData, isLoading: targetsLoading, refetch: refetchTargets } = useGetSalesTargetsQuery(undefined);
  const { data: rulesData, isLoading: rulesLoading, refetch: refetchRules } = useGetCommissionRulesQuery(undefined);
  const { data: commsData, isLoading: commsLoading, refetch: refetchComms } = useGetCommissionsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [setSalesTarget, { isLoading: isSettingTarget }] = useSetSalesTargetMutation();
  const [createRule, { isLoading: isCreatingRule }] = useCreateCommissionRuleMutation();

  const targets = targetsData?.data || [];
  const rules = rulesData?.data || [];
  const commissions = commsData?.data || [];
  const employees = employeesData?.data || [];

  const totalCommissionsPaid = commissions.reduce(
    (sum: number, c: any) => sum + Number(c.commissionAmount || 0),
    0
  );

  const handleSetTarget = async (values: any) => {
    try {
      await setSalesTarget(values).unwrap();
      message.success("Sales target set successfully");
      setTargetModal(false);
      targetForm.resetFields();
      refetchTargets();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to set sales target");
    }
  };

  const handleCreateRule = async (values: any) => {
    try {
      await createRule(values).unwrap();
      message.success("Commission rule created successfully");
      setRuleModal(false);
      ruleForm.resetFields();
      refetchRules();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create commission rule");
    }
  };

  const targetColumns: any = [
    {
      title: "Sales Representative / Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900 block text-sm">{name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {record.employee?.employeeCode} • {record.employee?.department?.name || "Sales"}
          </span>
        </div>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_: any, r: any) => (
        <span className="font-semibold text-gray-800 text-xs">
          {r.period} ({r.periodValue}/{r.year})
        </span>
      ),
    },
    {
      title: "Target Amount",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (amt: number) => (
        <span className="font-bold text-gray-900">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Achieved Amount",
      dataIndex: "achievedAmount",
      key: "achievedAmount",
      render: (amt: number) => (
        <span className="font-bold text-emerald-700">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Achievement Progress",
      key: "progress",
      render: (_: any, record: any) => {
        const target = Number(record.targetAmount || 1);
        const achieved = Number(record.achievedAmount || 0);
        const pct = Math.min(100, Math.round((achieved / target) * 100));
        return (
          <div className="w-48">
            <Progress
              percent={pct}
              status={pct >= 100 ? "success" : pct >= 50 ? "active" : "exception"}
              strokeColor={pct >= 100 ? "#059669" : pct >= 50 ? "#2563eb" : "#d97706"}
            />
          </div>
        );
      },
    },
  ];

  const ruleColumns: any = [
    {
      title: "Rule Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
    },
    {
      title: "Commission Type",
      dataIndex: "commissionType",
      key: "commissionType",
      render: (t: string) => (
        <Tag color={t === "PercentageOfOrder" ? "blue" : "purple"}>
          {t === "PercentageOfOrder" ? "Percentage (%)" : "Fixed Amount (BDT)"}
        </Tag>
      ),
    },
    {
      title: "Rate / Value",
      dataIndex: "rate",
      key: "rate",
      render: (r: number, record: any) => (
        <span className="font-bold text-emerald-800">
          {record.commissionType === "PercentageOfOrder" ? `${r}%` : `৳${r} BDT`}
        </span>
      ),
    },
    {
      title: "Applicable To",
      key: "applicable",
      render: (_: any, r: any) =>
        r.specificEmployee ? (
          <Tag color="cyan">{r.specificEmployee.fullName}</Tag>
        ) : (
          <Tag color="green">All Sales Agents (Universal)</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center" as const,
      render: (act: boolean) => (
        <Tag color={act !== false ? "green" : "default"}>{act !== false ? "Active" : "Disabled"}</Tag>
      ),
    },
  ];

  const commColumns: any = [
    {
      title: "Earned Date",
      dataIndex: "earnedDate",
      key: "earnedDate",
      render: (d: string) => <span className="font-mono text-xs">{d}</span>,
    },
    {
      title: "Sales Rep",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, r: any) => (
        <div>
          <span className="font-semibold text-gray-900 block text-xs">{name}</span>
          <span className="text-[10px] text-gray-400 font-mono">{r.employee?.employeeCode}</span>
        </div>
      ),
    },
    {
      title: "Order Reference",
      dataIndex: "orderId",
      key: "orderId",
      render: (id: string) => <span className="font-mono text-xs text-blue-600">{id ? `#${id.substring(0, 8)}` : "-"}</span>,
    },
    {
      title: "Order Value",
      dataIndex: "orderAmount",
      key: "orderAmount",
      render: (amt: number) => <span>৳{Number(amt || 0).toLocaleString()}</span>,
    },
    {
      title: "Commission Earned",
      dataIndex: "commissionAmount",
      key: "commissionAmount",
      render: (amt: number) => (
        <span className="font-bold text-emerald-700">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Approved" ? "green" : "orange"}>{st}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Sales Targets & Performance Commissions" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Active Sales Targets</span>}
              value={targets.length}
              prefix={<TrophyOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Commission Rules</span>}
              value={rules.length}
              prefix={<PercentageOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Commissions Earned</span>}
              value={totalCommissionsPaid}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Commission Payouts Count</span>}
              value={commissions.length}
              prefix={<FundOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabbed Card */}
      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          {/* TAB 1: SALES TARGETS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <TrophyOutlined className="text-amber-600" />
                Sales Targets & Achievements
              </span>
            }
            key="targets"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Representative Target Performance</span>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => refetchTargets()}>
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setTargetModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 border-none"
                  >
                    Set Sales Target
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={targets}
                rowKey="id"
                columns={targetColumns}
                loading={targetsLoading}
                pagination={{ pageSize: 8 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>

          {/* TAB 2: COMMISSION RULES */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <PercentageOutlined className="text-purple-600" />
                Commission Rules ({rules.length})
              </span>
            }
            key="rules"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Commission Rates & Automation</span>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => refetchRules()}>
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setRuleModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 border-none"
                  >
                    Add Commission Rule
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={rules}
                rowKey="id"
                columns={ruleColumns}
                loading={rulesLoading}
                pagination={{ pageSize: 8 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>

          {/* TAB 3: EARNED COMMISSIONS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <DollarOutlined className="text-emerald-600" />
                Commissions Log ({commissions.length})
              </span>
            }
            key="logs"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Order-by-Order Earned Commissions</span>
                <Button icon={<ReloadOutlined />} onClick={() => refetchComms()}>
                  Refresh
                </Button>
              </div>

              <Table
                dataSource={commissions}
                rowKey="id"
                columns={commColumns}
                loading={commsLoading}
                pagination={{ pageSize: 10 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* MODAL 1: SET SALES TARGET */}
      <Modal
        title="Set Sales Representative Target"
        open={targetModal}
        onCancel={() => setTargetModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={targetForm} layout="vertical" onFinish={handleSetTarget}>
          <Form.Item
            name="employeeId"
            label="Sales Representative"
            rules={[{ required: true, message: "Please select sales representative" }]}
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

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="year"
              label="Year"
              initialValue={new Date().getFullYear()}
              rules={[{ required: true }]}
            >
              <Select>
                <Option value={2025}>2025</Option>
                <Option value={2026}>2026</Option>
                <Option value={2027}>2027</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="period"
              label="Target Period"
              initialValue="Monthly"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Monthly">Monthly</Option>
                <Option value="Quarterly">Quarterly</Option>
                <Option value="Yearly">Yearly</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="periodValue"
            label="Month Number (1-12)"
            initialValue={new Date().getMonth() + 1}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={12} className="w-full" />
          </Form.Item>

          <Form.Item
            name="targetAmount"
            label="Sales Target Amount (BDT ৳)"
            initialValue={500000}
            rules={[{ required: true, message: "Please set target amount" }]}
          >
            <InputNumber min={1000} className="w-full font-bold text-emerald-700" prefix="৳" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setTargetModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSettingTarget}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Save Target
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: ADD COMMISSION RULE */}
      <Modal
        title="Create Sales Commission Rule"
        open={ruleModal}
        onCancel={() => setRuleModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={ruleForm} layout="vertical" onFinish={handleCreateRule}>
          <Form.Item
            name="name"
            label="Rule Name"
            rules={[{ required: true, message: "Please enter rule name" }]}
          >
            <Input placeholder="e.g. Standard 2% Commission on Delivered Orders" />
          </Form.Item>

          <Form.Item
            name="commissionType"
            label="Commission Calculation Mode"
            initialValue="PercentageOfOrder"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="PercentageOfOrder">Percentage (%) of Delivered Order Value</Option>
              <Option value="FixedPerDeliveredOrder">Fixed Amount (BDT) per Delivered Order</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="rate"
            label="Rate / Amount"
            initialValue={2}
            rules={[{ required: true, message: "Please specify commission rate" }]}
          >
            <InputNumber min={0.1} step={0.1} className="w-full font-bold" />
          </Form.Item>

          <Form.Item name="specificEmployeeId" label="Applicable Employee (Optional - Leave blank for all)">
            <Select placeholder="All Sales Agents" allowClear>
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setRuleModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingRule}
              className="bg-purple-600 hover:bg-purple-700 border-none"
            >
              Create Commission Rule
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
