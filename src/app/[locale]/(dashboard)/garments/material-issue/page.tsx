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
  Row,
  Col,
  message,
  Tabs,
  Progress,
} from "antd";
import {
  SendOutlined,
  RollbackOutlined,
  ReloadOutlined,
  FileDoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGarmentsMaterialIssuesQuery,
  useGetAllGarmentsBomsListQuery,
  useGetGarmentsInventoryCatalogQuery,
  useCreateGarmentsMaterialIssueMutation,
  useCreateGarmentsMaterialReturnMutation,
  useGetGarmentsMaterialSummaryByBomQuery,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

export default function GarmentsMaterialIssuePage() {
  const { canIssueMaterials } = useGarmentsPermission();
  const [activeTab, setActiveTab] = useState("logs");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedBomId, setSelectedBomId] = useState<string>("");

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [issueForm] = Form.useForm();
  const [returnForm] = Form.useForm();

  // Queries
  const { data: res, isLoading, refetch } = useGetGarmentsMaterialIssuesQuery({
    page,
    limit,
    bomId: selectedBomId || undefined,
  });

  const { data: bomsRes } = useGetAllGarmentsBomsListQuery(undefined);
  const bomsList = bomsRes?.data || [];

  const { data: catalogRes } = useGetGarmentsInventoryCatalogQuery("");
  const catalogList = catalogRes?.data || [];

  const { data: summaryRes, isLoading: isSummaryLoading, refetch: refetchSummary } =
    useGetGarmentsMaterialSummaryByBomQuery(selectedBomId, { skip: !selectedBomId });
  const bomSummary = summaryRes?.data;

  // Mutations
  const [createIssue, { isLoading: isIssuing }] = useCreateGarmentsMaterialIssueMutation();
  const [createReturn, { isLoading: isReturning }] = useCreateGarmentsMaterialReturnMutation();

  const issueLogs = res?.data || [];
  const meta = res?.meta || { total: 0 };

  const handleOpenIssueModal = () => {
    issueForm.resetFields();
    if (selectedBomId) {
      issueForm.setFieldsValue({ bomId: selectedBomId });
    }
    issueForm.setFieldsValue({ floorSection: "Cutting Floor", issuedTo: "Cutting Master" });
    setIsIssueModalOpen(true);
  };

  const handleOpenReturnModal = () => {
    returnForm.resetFields();
    if (selectedBomId) {
      returnForm.setFieldsValue({ bomId: selectedBomId });
    }
    returnForm.setFieldsValue({ floorSection: "Sewing Floor", remarks: "Surplus trims returned from line" });
    setIsReturnModalOpen(true);
  };

  const handleMaterialSelect = (formInstance: any, inventoryId: string) => {
    const found = catalogList.find((c: any) => c.id === inventoryId);
    if (found) {
      formInstance.setFieldsValue({
        itemCategory: found.itemCategory,
        itemName: found.itemName,
        unit: found.unit,
      });
    }
  };

  const handleIssueSubmit = async (values: any) => {
    try {
      await createIssue(values).unwrap();
      message.success("Material successfully issued to production floor!");
      setIsIssueModalOpen(false);
      issueForm.resetFields();
      refetch();
      if (selectedBomId) refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to issue material");
    }
  };

  const handleReturnSubmit = async (values: any) => {
    try {
      await createReturn(values).unwrap();
      message.success("Surplus material returned to store stock!");
      setIsReturnModalOpen(false);
      returnForm.resetFields();
      refetch();
      if (selectedBomId) refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to return material");
    }
  };

  const columns = [
    {
      title: "Issue #",
      dataIndex: "issueNumber",
      key: "issueNumber",
      render: (t: string) => <span className="font-bold text-blue-600">{t}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "issue" ? "blue" : "green"} className="uppercase font-semibold">
          {type === "issue" ? "Floor Issue" : "Store Return"}
        </Tag>
      ),
    },
    {
      title: "BOM / Buyer Order",
      key: "bom",
      render: (_: any, r: any) => (
        <div>
          <div className="font-semibold text-gray-800">{r.bom?.bomNumber || "General Issue"}</div>
          <div className="text-xs text-gray-500">
            {r.bom?.buyerOrder?.buyerName} ({r.bom?.buyerOrder?.styleName})
          </div>
        </div>
      ),
    },
    {
      title: "Material Item",
      key: "item",
      render: (_: any, r: any) => (
        <div>
          <span className="font-medium">{r.itemName}</span>
          <div className="text-xs text-gray-400">{r.itemCategory}</div>
        </div>
      ),
    },
    {
      title: "Floor Section",
      dataIndex: "floorSection",
      key: "floorSection",
      render: (s: string) => <Tag color="cyan">{s}</Tag>,
    },
    {
      title: "Quantity",
      key: "qty",
      render: (_: any, r: any) => (
        <span className={`font-bold ${r.type === "issue" ? "text-blue-700" : "text-green-700"}`}>
          {r.type === "issue" ? "-" : "+"}
          {Number(r.quantity || 0).toLocaleString()} {r.unit}
        </span>
      ),
    },
    {
      title: "Issued / Received By",
      key: "issuedBy",
      render: (_: any, r: any) => (
        <div className="text-xs">
          <div>{r.issuedBy}</div>
          <div className="text-gray-400">{dayjs(r.createdAt).format("DD MMM YYYY HH:mm")}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Floor Material Issue & Returns" />

      {/* Action and Filter Header */}
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select
              placeholder="Filter by Buyer BOM Order"
              value={selectedBomId || undefined}
              onChange={(val) => setSelectedBomId(val || "")}
              allowClear
              className="w-full md:w-80"
            >
              {bomsList.map((b: any) => (
                <Option key={b.id} value={b.id}>
                  {b.bomNumber} - {b.buyerOrder?.buyerName} ({b.buyerOrder?.styleName})
                </Option>
              ))}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>

          {canIssueMaterials && (
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleOpenIssueModal}
                className="bg-blue-600"
              >
                Issue Material to Floor
              </Button>
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={handleOpenReturnModal}
                className="bg-green-600"
              >
                Return Unused Material
              </Button>
            </div>
          )}
        </div>

        {/* BOM Floor Requirement vs Issued Progress Summary */}
        {selectedBomId && bomSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FileDoneOutlined /> BOM Material Fulfillment Progress - {bomSummary.bom?.bomNumber}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bomSummary.itemProgress?.map((item: any) => {
                const percent = Math.min(100, Math.round((Number(item.issuedQty || 0) / Number(item.requiredQty || 1)) * 100));
                return (
                  <div key={item.id} className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{item.itemName}</div>
                        <div className="text-xs text-gray-500">{item.itemCategory}</div>
                      </div>
                      <Tag color={percent >= 100 ? "success" : "blue"}>{percent}%</Tag>
                    </div>
                    <div className="mt-2 text-xs flex justify-between text-gray-600">
                      <span>Issued: {item.issuedQty} {item.unit}</span>
                      <span>Required: {item.requiredQty} {item.unit}</span>
                    </div>
                    <Progress percent={percent} size="small" status={percent >= 100 ? "success" : "active"} className="mt-1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Table
          dataSource={issueLogs}
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
      </Card>

      {/* Issue Modal */}
      <Modal
        title="Issue Material to Production Floor"
        open={isIssueModalOpen}
        onCancel={() => setIsIssueModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={issueForm} layout="vertical" onFinish={handleIssueSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="bomId" label="Target BOM / Buyer Order">
              <Select placeholder="Select BOM (Optional)" allowClear>
                {bomsList.map((b: any) => (
                  <Option key={b.id} value={b.id}>
                    {b.bomNumber} - {b.buyerOrder?.buyerName} ({b.buyerOrder?.styleName})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="floorSection"
              label="Production Floor Section"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Cutting Floor">Cutting Floor</Option>
                <Option value="Sewing Floor">Sewing Floor</Option>
                <Option value="Finishing & Packing">Finishing & Packing</Option>
                <Option value="Embroidery / Print">Embroidery / Print Section</Option>
                <Option value="Washing Plant">Washing Plant</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="inventoryId"
              label="Select Material from Store Stock"
              rules={[{ required: true, message: "Required" }]}
              className="md:col-span-2"
            >
              <Select
                placeholder="Search stock material"
                onChange={(val) => handleMaterialSelect(issueForm, val)}
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

            <Form.Item
              name="quantity"
              label="Issue Quantity"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0.1} step={0.1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="issuedTo"
              label="Issued To (Floor Master / Line In-Charge)"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Master Md. Rafiq / Line 4 Supervisor" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Issue Remarks / Roll Identifiers">
            <Input.TextArea rows={2} placeholder="Add roll numbers, shade lots, or batch references..." />
          </Form.Item>

          {/* Hidden fields */}
          <Form.Item name="itemCategory" hidden><Input /></Form.Item>
          <Form.Item name="itemName" hidden><Input /></Form.Item>
          <Form.Item name="unit" hidden><Input /></Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isIssuing} className="bg-blue-600">
              Confirm Floor Issue
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Return Modal */}
      <Modal
        title="Return Surplus Material to Store Stock"
        open={isReturnModalOpen}
        onCancel={() => setIsReturnModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={returnForm} layout="vertical" onFinish={handleReturnSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="bomId" label="Target BOM / Buyer Order">
              <Select placeholder="Select BOM (Optional)" allowClear>
                {bomsList.map((b: any) => (
                  <Option key={b.id} value={b.id}>
                    {b.bomNumber} - {b.buyerOrder?.buyerName} ({b.buyerOrder?.styleName})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="floorSection"
              label="Returning From Floor Section"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Cutting Floor">Cutting Floor</Option>
                <Option value="Sewing Floor">Sewing Floor</Option>
                <Option value="Finishing & Packing">Finishing & Packing</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="inventoryId"
              label="Select Material Item"
              rules={[{ required: true, message: "Required" }]}
              className="md:col-span-2"
            >
              <Select
                placeholder="Search material to return"
                onChange={(val) => handleMaterialSelect(returnForm, val)}
                showSearch
              >
                {catalogList.map((c: any) => (
                  <Option key={c.id} value={c.id}>
                    [{c.itemCategory}] {c.itemName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Return Quantity"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min={0.1} step={0.1} className="w-full" />
            </Form.Item>

            <Form.Item
              name="issuedTo"
              label="Returned By"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Line 2 Floor Master" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Condition / Return Notes">
            <Input.TextArea rows={2} placeholder="Reason for return (e.g. order completed, surplus cones)..." />
          </Form.Item>

          {/* Hidden fields */}
          <Form.Item name="itemCategory" hidden><Input /></Form.Item>
          <Form.Item name="itemName" hidden><Input /></Form.Item>
          <Form.Item name="unit" hidden><Input /></Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsReturnModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isReturning} className="bg-green-600">
              Confirm Store Return
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
