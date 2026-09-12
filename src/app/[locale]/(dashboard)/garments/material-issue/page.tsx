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
  Card,
  message,
  Progress,
} from "antd";
import {
  SendOutlined,
  RollbackOutlined,
  ReloadOutlined,
  FileDoneOutlined,
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

// ─────────────────────────────────────────────────────────────
// Helper: readable label for a BOM dropdown option
// Backend BOM shape: { id, styleNo, styleName, order: { buyerName, styleName } }
// ─────────────────────────────────────────────────────────────
function bomLabel(b: any): string {
  const buyer = b.order?.buyerName || "";
  const style = b.order?.styleName || b.styleName || "";
  return `${b.styleNo} — ${buyer} (${style})`;
}

// ─────────────────────────────────────────────────────────────
// Helper: readable label for an inventory / catalog item
// Backend Inventory shape: { id, itemCategory, itemName, stock, unit }
// Note: available stock field = `stock` (NOT `availableQuantity`)
// ─────────────────────────────────────────────────────────────
function catalogLabel(c: any): string {
  return `[${c.itemCategory}] ${c.itemName}  (Stock: ${Number(c.stock ?? 0)} ${c.unit})`;
}

export default function GarmentsMaterialIssuePage() {
  const { canIssueMaterials } = useGarmentsPermission();

  // ── Pagination & filter state ──────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedBomId, setSelectedBomId] = useState<string>("");

  // ── Modal open state ───────────────────────────────────────
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // ── Forms ──────────────────────────────────────────────────
  const [issueForm] = Form.useForm();
  const [returnForm] = Form.useForm();

  // ── API: Issue/Return logs (paginated, filterable by BOM) ──
  const { data: issueRes, isLoading, refetch } = useGetGarmentsMaterialIssuesQuery({
    page,
    limit,
    bomId: selectedBomId || undefined,
  });

  // ── API: All BOMs list for dropdowns ──────────────────────
  const { data: bomsRes } = useGetAllGarmentsBomsListQuery(undefined);
  const bomsList: any[] = bomsRes?.data || [];

  // ── API: Inventory catalog (all items currently in store) ──
  const { data: catalogRes } = useGetGarmentsInventoryCatalogQuery("");
  const catalogList: any[] = catalogRes?.data || [];

  // ── API: BOM fulfillment progress (only when BOM selected) ─
  // Response: { styleNo, styleName, summary: [{itemName, itemCategory, unit, requiredQty, issuedQty, balanceQty}] }
  const { data: summaryRes, refetch: refetchSummary } =
    useGetGarmentsMaterialSummaryByBomQuery(selectedBomId, {
      skip: !selectedBomId,
    });
  const bomSummary = summaryRes?.data;

  // ── API Mutations ──────────────────────────────────────────
  const [createIssue, { isLoading: isIssuing }] = useCreateGarmentsMaterialIssueMutation();
  const [createReturn, { isLoading: isReturning }] = useCreateGarmentsMaterialReturnMutation();

  const issueLogs: any[] = issueRes?.data || [];
  const meta = issueRes?.meta || { total: 0 };

  // ── Open Issue Modal ───────────────────────────────────────
  const handleOpenIssueModal = () => {
    issueForm.resetFields();
    if (selectedBomId) issueForm.setFieldsValue({ bomId: selectedBomId });
    issueForm.setFieldsValue({ floorSection: "Cutting Floor", issuedTo: "Cutting Master" });
    setIsIssueModalOpen(true);
  };

  // ── Open Return Modal ──────────────────────────────────────
  const handleOpenReturnModal = () => {
    returnForm.resetFields();
    if (selectedBomId) returnForm.setFieldsValue({ bomId: selectedBomId });
    returnForm.setFieldsValue({
      floorSection: "Sewing Floor",
      remarks: "Surplus trims returned from line",
    });
    setIsReturnModalOpen(true);
  };

  // ── Auto-fill hidden fields when a material is selected ───
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

  // ── Submit: Issue Material to Floor ───────────────────────
  // Backend DTO: { bomId, inventoryId, quantity, floorSection, issuedTo, remarks, itemCategory, itemName, unit }
  // Backend service accepts `quantity` OR `qty` → reduces inventory.stock
  const handleIssueSubmit = async (values: any) => {
    try {
      await createIssue(values).unwrap();
      message.success("✅ Material successfully issued to production floor!");
      setIsIssueModalOpen(false);
      issueForm.resetFields();
      refetch();
      if (selectedBomId) refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to issue material. Please try again.");
    }
  };

  // ── Submit: Return Material to Store ──────────────────────
  // Backend service accepts `quantity` OR `qty` → increases inventory.stock
  const handleReturnSubmit = async (values: any) => {
    try {
      await createReturn(values).unwrap();
      message.success("✅ Surplus material returned to store stock!");
      setIsReturnModalOpen(false);
      returnForm.resetFields();
      refetch();
      if (selectedBomId) refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to return material. Please try again.");
    }
  };

  // ── Table columns ──────────────────────────────────────────
  // Entity field mapping:
  //   type        → 'ISSUE' | 'RETURN'   (UPPERCASE — compare accordingly)
  //   qty         → the actual quantity  (NOT `quantity`)
  //   inventory   → related GarmentsInventory (for itemName, itemCategory, unit)
  //   bom         → related GarmentsBOM (bom.styleNo, bom.order.buyerName)
  //   floorSection, issuedBy, receivedBy, issuedTo, createdAt
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag color={type === "ISSUE" ? "blue" : "green"} className="uppercase font-semibold">
          {type === "ISSUE" ? "🔵 Floor Issue" : "🟢 Store Return"}
        </Tag>
      ),
    },
    {
      title: "BOM / Style",
      key: "bom",
      render: (_: any, r: any) =>
        r.bom ? (
          <div>
            <div className="font-semibold text-gray-800">{r.bom.styleNo}</div>
            <div className="text-xs text-gray-400">
              {r.bom.order?.buyerName} &bull; {r.bom.order?.styleName || r.bom.styleName}
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">General Issue</span>
        ),
    },
    {
      title: "Material Item",
      key: "item",
      render: (_: any, r: any) => (
        <div>
          <div className="font-medium text-gray-800">
            {r.inventory?.itemName || "—"}
          </div>
          <div className="text-xs text-gray-400">{r.inventory?.itemCategory}</div>
        </div>
      ),
    },
    {
      title: "Floor Section",
      dataIndex: "floorSection",
      key: "floorSection",
      render: (s: string) =>
        s ? <Tag color="cyan">{s}</Tag> : <span className="text-gray-300">—</span>,
    },
    {
      title: "Quantity",
      key: "qty",
      align: "right" as const,
      render: (_: any, r: any) => (
        <span className={`font-bold ${r.type === "ISSUE" ? "text-red-600" : "text-green-600"}`}>
          {r.type === "ISSUE" ? "−" : "+"}
          {Number(r.qty ?? 0).toLocaleString()}{" "}
          <span className="font-normal text-gray-400">{r.inventory?.unit}</span>
        </span>
      ),
    },
    {
      title: "Issued / Returned By",
      key: "issuedBy",
      render: (_: any, r: any) => (
        <div className="text-xs">
          <div className="font-medium text-gray-700">{r.issuedBy || r.receivedBy || "—"}</div>
          {r.issuedTo && <div className="text-gray-500">To: {r.issuedTo}</div>}
          <div className="text-gray-400 mt-0.5">
            {dayjs(r.createdAt).format("DD MMM YYYY HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (r: string) => <span className="text-xs text-gray-400">{r || "—"}</span>,
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Floor Material Issue & Returns" />

      <Card className="shadow-sm">

        {/* ── Top Filter & Action Bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">

          {/* BOM filter dropdown + refresh */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select
              placeholder="Filter by BOM / Style"
              value={selectedBomId || undefined}
              onChange={(val) => setSelectedBomId(val || "")}
              allowClear
              showSearch
              optionFilterProp="label"
              options={bomsList.map((b) => ({ value: b.id, label: bomLabel(b) }))}
              className="w-full md:w-96"
            />
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>

          {/* Action buttons — only for users with issue permission */}
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

        {/* ── BOM Fulfillment Progress Cards ── */}
        {/* Shown only when a BOM is selected in the filter */}
        {/* Backend summary fields: bomSummary.styleNo / .styleName / .summary[] */}
        {selectedBomId && bomSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <FileDoneOutlined />
              BOM Fulfillment Progress —{" "}
              <span className="text-blue-700">{bomSummary.styleNo}</span>
              <span className="font-normal text-sm text-blue-500">
                &nbsp;({bomSummary.styleName})
              </span>
            </h4>

            {bomSummary.summary?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Each item: { bomItemId, itemName, itemCategory, unit, requiredQty, issuedQty, balanceQty } */}
                {bomSummary.summary.map((item: any) => {
                  const percent = Math.min(
                    100,
                    Math.round(
                      (Number(item.issuedQty || 0) / Math.max(Number(item.requiredQty || 1), 1)) * 100
                    )
                  );
                  return (
                    <div
                      key={item.bomItemId}
                      className="bg-white p-3 rounded border border-blue-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{item.itemName}</div>
                          <div className="text-xs text-gray-400">{item.itemCategory}</div>
                        </div>
                        <Tag color={percent >= 100 ? "success" : "processing"}>{percent}%</Tag>
                      </div>
                      <div className="mt-2 text-xs flex justify-between text-gray-600">
                        <span>Issued: <b>{item.issuedQty}</b> {item.unit}</span>
                        <span>Required: <b>{item.requiredQty}</b> {item.unit}</span>
                      </div>
                      <Progress
                        percent={percent}
                        size="small"
                        status={percent >= 100 ? "success" : "active"}
                        className="mt-1"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No BOM items found for this style.</p>
            )}
          </div>
        )}

        {/* ── Issue / Return Log Table ── */}
        <Table
          dataSource={issueLogs}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: meta.total,
            onChange: (p, l) => { setPage(p); setLimit(l); },
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* ════════════════════════════════════════════════════════════
          ISSUE MATERIAL MODAL
          DTO sent to POST /garments/material-issues:
            bomId        → optional BOM UUID
            inventoryId  → inventory item UUID (required)
            quantity     → amount to issue (backend reads `quantity` OR `qty`)
            floorSection → which production section
            issuedTo     → recipient person name
            remarks      → optional note
            itemCategory, itemName, unit → auto-filled hidden fields
          Effect: inventory.issueQty += quantity → inventory.stock decreases
          ════════════════════════════════════════════════════════════ */}
      <Modal
        title="📦 Issue Material to Production Floor"
        open={isIssueModalOpen}
        onCancel={() => setIsIssueModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={issueForm} layout="vertical" onFinish={handleIssueSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Form.Item name="bomId" label="Target BOM / Style (Optional)">
              <Select
                placeholder="Link to a buyer style (optional)"
                allowClear
                showSearch
                optionFilterProp="label"
                options={bomsList.map((b) => ({ value: b.id, label: bomLabel(b) }))}
              />
            </Form.Item>

            <Form.Item
              name="floorSection"
              label="Production Floor Section"
              rules={[{ required: true, message: "Please select a floor section" }]}
            >
              <Select placeholder="Select floor section">
                <Option value="Cutting Floor">Cutting Floor</Option>
                <Option value="Sewing Floor">Sewing Floor</Option>
                <Option value="Finishing & Packing">Finishing &amp; Packing</Option>
                <Option value="Embroidery / Print">Embroidery / Print Section</Option>
                <Option value="Washing Plant">Washing Plant</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="inventoryId"
              label="Select Material from Store Stock"
              rules={[{ required: true, message: "Please select a material item" }]}
              className="md:col-span-2"
            >
              <Select
                placeholder="Search by item name or category..."
                showSearch
                optionFilterProp="label"
                onChange={(val) => handleMaterialSelect(issueForm, val)}
                options={catalogList.map((c) => ({ value: c.id, label: catalogLabel(c) }))}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Issue Quantity"
              rules={[
                { required: true, message: "Please enter quantity" },
                { type: "number", min: 0.001, message: "Must be greater than 0" },
              ]}
            >
              <InputNumber min={0.001} step={0.5} precision={3} className="w-full" placeholder="e.g. 25.5" />
            </Form.Item>

            <Form.Item
              name="issuedTo"
              label="Issued To (Floor Master / Line In-Charge)"
              rules={[{ required: true, message: "Please enter recipient name" }]}
            >
              <Input placeholder="e.g. Master Md. Rafiq / Line 4 Supervisor" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Remarks / Roll Identifiers">
            <Input.TextArea rows={2} placeholder="Roll numbers, shade lots, batch references (optional)..." />
          </Form.Item>

          {/* Auto-filled hidden fields when inventoryId is selected */}
          <Form.Item name="itemCategory" hidden><Input /></Form.Item>
          <Form.Item name="itemName" hidden><Input /></Form.Item>
          <Form.Item name="unit" hidden><Input /></Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isIssuing} className="bg-blue-600" icon={<SendOutlined />}>
              Confirm Floor Issue
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          RETURN MATERIAL MODAL
          DTO sent to POST /garments/material-issues/return:
            Same fields as Issue modal above.
          Effect: inventory.issueQty -= quantity → inventory.stock increases
          ════════════════════════════════════════════════════════════ */}
      <Modal
        title="♻️ Return Surplus Material to Store"
        open={isReturnModalOpen}
        onCancel={() => setIsReturnModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={returnForm} layout="vertical" onFinish={handleReturnSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Form.Item name="bomId" label="Related BOM / Style (Optional)">
              <Select
                placeholder="Link to a buyer style (optional)"
                allowClear
                showSearch
                optionFilterProp="label"
                options={bomsList.map((b) => ({ value: b.id, label: bomLabel(b) }))}
              />
            </Form.Item>

            <Form.Item
              name="floorSection"
              label="Returning From Floor Section"
              rules={[{ required: true, message: "Please select a floor section" }]}
            >
              <Select placeholder="Select floor section">
                <Option value="Cutting Floor">Cutting Floor</Option>
                <Option value="Sewing Floor">Sewing Floor</Option>
                <Option value="Finishing & Packing">Finishing &amp; Packing</Option>
                <Option value="Embroidery / Print">Embroidery / Print Section</Option>
                <Option value="Washing Plant">Washing Plant</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="inventoryId"
              label="Select Material to Return"
              rules={[{ required: true, message: "Please select a material item" }]}
              className="md:col-span-2"
            >
              <Select
                placeholder="Search by item name or category..."
                showSearch
                optionFilterProp="label"
                onChange={(val) => handleMaterialSelect(returnForm, val)}
                options={catalogList.map((c) => ({ value: c.id, label: catalogLabel(c) }))}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Return Quantity"
              rules={[
                { required: true, message: "Please enter quantity" },
                { type: "number", min: 0.001, message: "Must be greater than 0" },
              ]}
            >
              <InputNumber min={0.001} step={0.5} precision={3} className="w-full" placeholder="e.g. 10.0" />
            </Form.Item>

            <Form.Item
              name="issuedTo"
              label="Returned By"
              rules={[{ required: true, message: "Please enter the person's name" }]}
            >
              <Input placeholder="e.g. Line 2 Floor Master" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Return Reason / Condition Notes">
            <Input.TextArea rows={2} placeholder="e.g. Order completed — surplus cones returned (optional)..." />
          </Form.Item>

          <Form.Item name="itemCategory" hidden><Input /></Form.Item>
          <Form.Item name="itemName" hidden><Input /></Form.Item>
          <Form.Item name="unit" hidden><Input /></Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsReturnModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isReturning} className="bg-green-600" icon={<RollbackOutlined />}>
              Confirm Store Return
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
