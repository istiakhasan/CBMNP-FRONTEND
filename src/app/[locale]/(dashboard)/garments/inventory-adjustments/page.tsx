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
  Tag,
  Space,
  Card,
  message,
  Tabs,
  Badge,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGarmentsAdjustmentsQuery,
  useGetGarmentsPendingAdjustmentsQuery,
  useGetGarmentsInventoryCatalogQuery,
  useProposeGarmentsAdjustmentMutation,
  useDecideGarmentsAdjustmentMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

export default function GarmentsAdjustmentsPage() {
  const { isAdmin, has } = useGarmentsPermission();
  const canProposeAdjustment = isAdmin || has("Edit Inventory") || has("RECEIVE_GARMENTS_MATERIALS");
  const canDecideAdjustment = isAdmin || has("Edit Inventory") || has("APPROVE_GARMENTS_PO");

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  // Queries
  const { data: res, isLoading, refetch } = useGetGarmentsAdjustmentsQuery({ page, limit });
  const { data: pendingRes, isLoading: isPendingLoading, refetch: refetchPending } =
    useGetGarmentsPendingAdjustmentsQuery(undefined);
  const { data: catalogRes } = useGetGarmentsInventoryCatalogQuery("");

  const adjustments = res?.data || [];
  const pendingList = pendingRes?.data || [];
  const catalogList = catalogRes?.data || [];
  const meta = res?.meta || { total: 0 };

  // Mutations
  const [proposeAdjustment, { isLoading: isProposing }] = useProposeGarmentsAdjustmentMutation();
  const [decideAdjustment, { isLoading: isDeciding }] = useDecideGarmentsAdjustmentMutation();

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      adjustmentType: "decrease",
      reason: "Cutting floor fabric wastage & defect cut-piece scrap",
    });
    setIsModalOpen(true);
  };

  const handleMaterialSelect = (inventoryId: string) => {
    const found = catalogList.find((c: any) => c.id === inventoryId);
    if (found) {
      form.setFieldsValue({
        itemCategory: found.itemCategory,
        itemName: found.itemName,
        unit: found.unit,
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await proposeAdjustment(values).unwrap();
      message.success("Adjustment proposed successfully! Pending manager review.");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
      refetchPending();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to propose adjustment");
    }
  };

  const handleDecide = async (id: string, decision: "approved" | "rejected") => {
    try {
      await decideAdjustment({
        id,
        decision,
        note: `Decided as ${decision} on ${dayjs().format("YYYY-MM-DD HH:mm")}`,
      }).unwrap();
      message.success(`Adjustment ${decision}`);
      refetch();
      refetchPending();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to process adjustment");
    }
  };

  const columns = [
    {
      title: "Adj #",
      dataIndex: "adjustmentNumber",
      key: "adjustmentNumber",
      render: (t: string) => <span className="font-bold text-amber-600">{t}</span>,
    },
    {
      title: "Item Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (t: string) => <span className="font-semibold text-gray-900">{t}</span>,
    },
    {
      title: "Type",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
      render: (type: string) => {
        let color = "default";
        if (type === "increase") color = "green";
        if (type === "decrease") color = "red";
        if (type === "damage") color = "volcano";
        if (type === "audit_correction") color = "purple";
        return <Tag color={color} className="uppercase font-medium">{type}</Tag>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty: number, r: any) => (
        <span className="font-bold">
          {r.adjustmentType === "decrease" || r.adjustmentType === "damage" ? "-" : "+"}
          {Number(qty || 0).toLocaleString()} {r.unit}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (r: string) => <span className="text-xs text-gray-600">{r}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (st: string) => {
        let color = "default";
        if (st === "approved") color = "success";
        if (st === "pending") color = "warning";
        if (st === "rejected") color = "error";
        return <Tag color={color} className="uppercase font-medium">{st}</Tag>;
      },
    },
    {
      title: "Requested By / Date",
      key: "date",
      render: (_: any, r: any) => (
        <div className="text-xs">
          <div>{r.adjustedBy || "Store In-Charge"}</div>
          <div className="text-gray-400">{dayjs(r.createdAt).format("DD MMM YYYY")}</div>
        </div>
      ),
    },
  ];

  const pendingColumns = [
    ...columns.filter((c) => c.key !== "status"),
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) =>
        canDecideAdjustment ? (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              className="bg-green-600"
              onClick={() => handleDecide(record.id, "approved")}
              loading={isDeciding}
            >
              Approve
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleDecide(record.id, "rejected")}
              loading={isDeciding}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <Tag color="orange">Pending Manager Review</Tag>
        ),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Inventory Stock Adjustments" />

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800">Material Stock Adjustments & Wastage Audit</h3>
            <p className="text-xs text-gray-500">
              Propose and approve physical count corrections, fabric roll shrinkages, and floor cut wastage.
            </p>
          </div>

          <div className="flex gap-2">
            <Button icon={<ReloadOutlined />} onClick={() => { refetch(); refetchPending(); }} />
            {canProposeAdjustment && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className="bg-amber-600"
              >
                Propose Stock Adjustment
              </Button>
            )}
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "all",
              label: "All Adjustments Log",
              children: (
                <Table
                  dataSource={adjustments}
                  columns={columns}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize: limit,
                    total: meta.total,
                    onChange: (p, l) => {
                      setPage(p);
                      setLimit(l);
                    },
                    showSizeChanger: true,
                  }}
                />
              ),
            },
            {
              key: "pending",
              label: (
                <span>
                  Pending Approval <Badge count={pendingList.length} offset={[8, -2]} />
                </span>
              ),
              children: (
                <Table
                  dataSource={pendingList}
                  columns={pendingColumns}
                  rowKey="id"
                  loading={isPendingLoading}
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Propose Adjustment Modal */}
      <Modal
        title="Propose Stock Adjustment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="inventoryId"
            label="Select Inventory Material Item"
            rules={[{ required: true, message: "Please select material item" }]}
          >
            <Select
              placeholder="Search and select existing material item"
              onChange={handleMaterialSelect}
              showSearch
              filterOption={(input, option: any) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {catalogList.map((c: any) => (
                <Option key={c.id} value={c.id}>
                  [{c.itemCategory}] {c.itemName} (Available: {c.availableQuantity} {c.unit})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="adjustmentType"
              label="Adjustment Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="decrease">Stock Decrease (-)</Option>
                <Option value="increase">Stock Increase (+)</Option>
                <Option value="damage">Damaged / Scrap (-)</Option>
                <Option value="audit_correction">Audit Physical Count Adjustment</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Adjustment Quantity"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0.01} step={0.1} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label="Reason / Investigation Note"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea rows={3} placeholder="Explain reason (e.g. physical store discrepancy, shrinkage on fabric inspection, damaged cones)..." />
          </Form.Item>

          {/* Hidden metadata */}
          <Form.Item name="itemCategory" hidden><Input /></Form.Item>
          <Form.Item name="itemName" hidden><Input /></Form.Item>
          <Form.Item name="unit" hidden><Input /></Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isProposing}
              className="bg-amber-600"
            >
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
