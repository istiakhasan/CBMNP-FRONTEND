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
  Statistic,
  message,
  Alert,
  Divider,
  Tooltip,
  Tabs,
  Popconfirm,
} from "antd";
import {
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DollarCircleOutlined,
  PlusCircleOutlined,
  ExperimentOutlined,
  ShoppingOutlined,
  TagOutlined,
  AppstoreAddOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGarmentsInventoryQuery,
  useGetGarmentsLotsForItemQuery,
  useGetAllGarmentsOrdersListQuery,
  useDirectStockInGarmentsInventoryMutation,
  useGetGarmentsSampleInwardsQuery,
  useDecideGarmentsSampleInwardApprovalMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;
const { TabPane } = Tabs;

const SAMPLE_PRESET_ITEMS = [
  { name: "100% Cotton 4-Hole Horn Button", cat: "SEWING_TRIMS", unit: "Pcs", defaultQty: 5, cost: 2 },
  { name: "12oz Indigo Denim Fabric Swatch", cat: "FABRICS", unit: "Yds", defaultQty: 2, cost: 350 },
  { name: "YKK #5 Antique Brass Metal Zipper 7\"", cat: "SEWING_TRIMS", unit: "Pcs", defaultQty: 3, cost: 45 },
  { name: "100% Spun Poly Sewing Thread 40/2", cat: "SEWING_TRIMS", unit: "Cone", defaultQty: 1, cost: 120 },
  { name: "Main Woven Neck Label (Sample)", cat: "FINISHING_TRIMS", unit: "Pcs", defaultQty: 10, cost: 5 },
  { name: "Satin Care & Wash Instruction Label", cat: "FINISHING_TRIMS", unit: "Pcs", defaultQty: 10, cost: 3 },
  { name: "1/2\" Herringbone Cotton Twill Tape", cat: "SEWING_TRIMS", unit: "Yds", defaultQty: 5, cost: 15 },
  { name: "Single Jersey 100% Combed Cotton 180 GSM", cat: "FABRICS", unit: "Yds", defaultQty: 2, cost: 280 },
];

export default function GarmentsInventoryPage() {
  const { canCreateSampleInward, canApproveSampleInward } = useGarmentsPermission();
  const [activeTab, setActiveTab] = useState("ledger");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample inward tab state
  const [samplePage, setSamplePage] = useState(1);
  const [sampleLimit, setSampleLimit] = useState(10);
  const [sampleStatusFilter, setSampleStatusFilter] = useState<string>("");
  const [sampleSearchTerm, setSampleSearchTerm] = useState("");

  const [selectedItemForLots, setSelectedItemForLots] = useState<{ category: string; name: string } | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [approvalModalLot, setApprovalModalLot] = useState<any>(null);
  const [approvalDecision, setApprovalDecision] = useState<"approved" | "rejected">("approved");

  const [form] = Form.useForm();
  const [approvalForm] = Form.useForm();

  // Queries
  const { data: res, isLoading, refetch } = useGetGarmentsInventoryQuery({
    page,
    limit,
    category: category || undefined,
    search: searchTerm || undefined,
  });

  const {
    data: sampleInwardsRes,
    isLoading: isSampleInwardsLoading,
    refetch: refetchSampleInwards,
  } = useGetGarmentsSampleInwardsQuery({
    page: samplePage,
    limit: sampleLimit,
    approvalStatus: sampleStatusFilter || undefined,
    search: sampleSearchTerm || undefined,
  });

  const { data: ordersRes } = useGetAllGarmentsOrdersListQuery({});
  const ordersList = ordersRes?.data || [];

  const { data: lotsRes, isLoading: isLotsLoading } = useGetGarmentsLotsForItemQuery(
    selectedItemForLots || { category: "", name: "" },
    { skip: !selectedItemForLots }
  );
  const lotsList = lotsRes?.data || [];

  const [directStockIn, { isLoading: isSubmittingSample }] = useDirectStockInGarmentsInventoryMutation();
  const [decideApproval, { isLoading: isDecidingApproval }] = useDecideGarmentsSampleInwardApprovalMutation();

  const inventoryItems = res?.data || [];
  const meta = res?.meta || { total: 0 };

  const sampleInwards = sampleInwardsRes?.data || [];
  const sampleMeta = sampleInwardsRes?.meta || { total: 0 };

  const pendingSampleCount = sampleInwards.filter((s: any) => s.approvalStatus === "pending").length;

  // Calculate totals
  const totalStockValuation = inventoryItems.reduce(
    (sum: number, item: any) => {
      const stock = Number(item.stock ?? item.availableQuantity ?? (Number(item.receiveQty || 0) - Number(item.issueQty || 0)));
      const price = Number(item.unitPrice ?? item.avgUnitPrice ?? 0);
      return sum + (stock * price);
    },
    0
  );

  const handleApplyPreset = (preset: any) => {
    form.setFieldsValue({
      itemName: preset.name,
      itemCategory: preset.cat,
      unit: preset.unit,
      receiveQty: preset.defaultQty,
      unitPrice: preset.cost,
    });
  };

  const handleSampleInwardSubmit = async (values: any) => {
    try {
      await directStockIn({
        ...values,
        receiveQty: Number(values.receiveQty),
        unitPrice: Number(values.unitPrice || 0),
        approvalStatus: values.approvalStatus || "pending",
      }).unwrap();

      message.success("Sample material stock-in recorded successfully into Sample Room!");
      setIsSampleModalOpen(false);
      form.resetFields();
      refetch();
      refetchSampleInwards();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record sample material inward");
    }
  };

  const handleOpenApprovalModal = (lot: any, decision: "approved" | "rejected") => {
    setApprovalModalLot(lot);
    setApprovalDecision(decision);
    approvalForm.setFieldsValue({
      note: decision === "approved" ? "Sample shade and physical spec verified and approved." : "Quality discrepancy or shade mismatch.",
    });
  };

  const handleApprovalSubmit = async (values: any) => {
    if (!approvalModalLot) return;
    try {
      await decideApproval({
        id: approvalModalLot.id,
        decision: approvalDecision,
        note: values.note,
      }).unwrap();

      message.success(`Sample material inward ${approvalDecision} successfully!`);
      setApprovalModalLot(null);
      approvalForm.resetFields();
      refetchSampleInwards();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || `Failed to ${approvalDecision} sample material`);
    }
  };

  // Main Inventory Ledger Columns
  const columns = [
    {
      title: "Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
      render: (cat: string) => {
        let color = "blue";
        if (cat === "FABRICS") color = "cyan";
        if (cat === "SEWING_TRIMS") color = "purple";
        if (cat === "FINISHING_TRIMS") color = "gold";
        if (cat === "PACKAGING") color = "orange";
        return <Tag color={color} className="font-semibold">{cat}</Tag>;
      },
    },
    {
      title: "Material Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (name: string, record: any) => (
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">
            {record.itemColor ? `Color: ${record.itemColor} • ` : ""}
            {record.specification || "Standard Spec"}
          </div>
        </div>
      ),
    },
    {
      title: "Booking (BOM Demand)",
      dataIndex: "bookingQty",
      key: "bookingQty",
      render: (_: any, r: any) => {
        const qty = Number(r.bookingQty || 0);
        return <span className="text-blue-700 font-medium">{qty.toLocaleString()} {r.unit}</span>;
      },
    },
    {
      title: "Total Received (In-House)",
      key: "receiveQty",
      render: (_: any, r: any) => {
        const qty = Number(r.receiveQty ?? r.totalReceivedQuantity ?? 0);
        return <span className="text-gray-700 font-medium">{qty.toLocaleString()} {r.unit}</span>;
      },
    },
    {
      title: "Issued to Floor",
      key: "issueQty",
      render: (_: any, r: any) => {
        const qty = Number(r.issueQty ?? r.totalIssuedQuantity ?? 0);
        return <span className="text-orange-600 font-medium">-{qty.toLocaleString()} {r.unit}</span>;
      },
    },
    {
      title: "Current Available Stock",
      key: "stock",
      render: (_: any, r: any) => {
        const qty = Number(r.stock ?? r.availableQuantity ?? (Number(r.receiveQty || 0) - Number(r.issueQty || 0)));
        const isLow = qty <= Number(r.reorderLevel || 10);
        return (
          <span className={`font-bold ${isLow && qty <= 0 ? "text-red-600" : qty > 0 ? "text-green-700" : "text-gray-500"}`}>
            {qty.toLocaleString()} {r.unit}
            {isLow && qty <= 0 && <Tag color="error" className="ml-2 text-xs">Out of Stock</Tag>}
            {qty > 0 && <Tag color="success" className="ml-2 text-xs">In Stock</Tag>}
          </span>
        );
      },
    },
    {
      title: "Avg Unit Cost",
      key: "unitPrice",
      render: (_: any, r: any) => {
        const cost = Number(r.unitPrice ?? r.avgUnitPrice ?? 0);
        return <span>${cost.toFixed(2)}</span>;
      },
    },
    {
      title: "Total Valuation",
      key: "val",
      render: (_: any, r: any) => {
        const stockQty = Number(r.stock ?? r.availableQuantity ?? (Number(r.receiveQty || 0) - Number(r.issueQty || 0)));
        const cost = Number(r.unitPrice ?? r.avgUnitPrice ?? 0);
        const val = stockQty * cost;
        return <span className="font-bold text-gray-800">${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() =>
            setSelectedItemForLots({
              category: record.itemCategory,
              name: record.itemName,
            })
          }
        >
          View Lots / Rolls
        </Button>
      ),
    },
  ];

  // Lot breakdown modal columns
  const lotColumns = [
    {
      title: "Lot / Inward #",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (t: string) => <span className="font-bold text-purple-600">{t}</span>,
    },
    {
      title: "Batch / Sourcing Type",
      dataIndex: "batchNumber",
      key: "batchNumber",
      render: (b: string) => <Tag color={b?.includes("SAMPLE") ? "purple" : "blue"}>{b || "STANDARD_PO"}</Tag>,
    },
    {
      title: "Rack / Location",
      dataIndex: "locationRack",
      key: "locationRack",
      render: (loc: string) => <Tag color="cyan">{loc || "General Store"}</Tag>,
    },
    {
      title: "Received Qty",
      dataIndex: "receivedQty",
      key: "receivedQty",
      render: (q: number, r: any) => Number(q ?? r.receivedQuantity ?? 0).toLocaleString(),
    },
    {
      title: "Current Balance",
      dataIndex: "remainingQty",
      key: "remainingQty",
      render: (q: number, r: any) => (
        <span className="font-bold text-green-700">{Number(q ?? r.remainingQuantity ?? 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Approval Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      render: (st: string) => {
        let color = "orange";
        if (st === "approved") color = "green";
        if (st === "rejected") color = "red";
        return <Tag color={color} className="uppercase font-semibold text-xs">{st || "approved"}</Tag>;
      },
    },
    {
      title: "Remarks / Source Trace",
      dataIndex: "remarks",
      key: "remarks",
      render: (rem: string) => <span className="text-xs text-gray-600">{rem || "-"}</span>,
    },
  ];

  // Sample Inwards Register Columns with Approval Action
  const sampleInwardColumns = [
    {
      title: "Inward Lot #",
      dataIndex: "lotNumber",
      key: "lotNumber",
      render: (lotNo: string) => (
        <span className="font-bold text-purple-700 font-mono">{lotNo}</span>
      ),
    },
    {
      title: "Material & Category",
      key: "material",
      render: (_: any, r: any) => {
        const inv = r.inventory || {};
        return (
          <div>
            <div className="font-bold text-gray-900">{inv.itemName || "Sample Material"}</div>
            <div className="text-xs text-gray-500">
              <Tag color="purple" className="text-xs py-0 px-1">{inv.itemCategory || "TRIMS"}</Tag>
              {inv.itemColor && <span className="text-gray-600 ml-1">Color: {inv.itemColor}</span>}
            </div>
          </div>
        );
      },
    },
    {
      title: "Sourcing Channel & Source",
      key: "source",
      render: (_: any, r: any) => (
        <div>
          <Tag color="blue" className="text-xs font-medium">
            {r.sourceType?.replace(/_/g, " ") || "SAMPLE SOURCING"}
          </Tag>
          {r.supplierOrMarket && (
            <div className="text-xs text-gray-600 mt-0.5">
              🏪 {r.supplierOrMarket}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Related Order / Sample",
      dataIndex: "orderNo",
      key: "orderNo",
      render: (ord: string) => (
        ord ? <Tag color="geekblue" className="font-semibold">{ord}</Tag> : <span className="text-xs text-gray-400">General Swatch</span>
      ),
    },
    {
      title: "Sample Qty",
      key: "qty",
      render: (_: any, r: any) => {
        const unit = r.inventory?.unit || "Pcs";
        return <span className="font-bold text-purple-800 text-sm">{Number(r.receivedQty || 0).toLocaleString()} {unit}</span>;
      },
    },
    {
      title: "Location / Rack",
      dataIndex: "locationRack",
      key: "locationRack",
      render: (loc: string) => <Tag color="cyan">{loc || "Sample Room - Rack S1"}</Tag>,
    },
    {
      title: "Inward Date",
      dataIndex: "inHouseDate",
      key: "inHouseDate",
      render: (d: string, r: any) => (
        <div>
          <div className="text-xs font-semibold text-gray-700">{d ? dayjs(d).format("DD MMM, YYYY") : dayjs(r.createdAt).format("DD MMM, YYYY")}</div>
          <span className="text-[11px] text-gray-500">{dayjs(r.createdAt).format("hh:mm A")}</span>
        </div>
      ),
    },
    {
      title: "Quality Approval",
      key: "approvalStatus",
      render: (_: any, r: any) => {
        const st = r.approvalStatus || "pending";
        let color = "warning";
        let text = "Pending QC Check";
        if (st === "approved") {
          color = "success";
          text = "QC Approved";
        } else if (st === "rejected") {
          color = "error";
          text = "Rejected";
        }
        return (
          <div>
            <Tag color={color} className="font-semibold uppercase text-xs">
              {text}
            </Tag>
            {r.approvedBy && (
              <div className="text-[11px] text-gray-500 mt-0.5">
                by {r.approvedBy} {r.approvalNote ? `("${r.approvalNote}")` : ""}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions / Decision",
      key: "actions",
      render: (_: any, r: any) => {
        const st = r.approvalStatus || "pending";
        return (
          <Space size="small">
            {st === "pending" && (
              canApproveSampleInward ? (
                <>
                  <Tooltip title="Approve this sample material for sample room make">
                    <Button
                      size="small"
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      className="bg-emerald-600 hover:bg-emerald-700 font-medium"
                      onClick={() => handleOpenApprovalModal(r, "approved")}
                    >
                      Approve
                    </Button>
                  </Tooltip>

                  <Tooltip title="Reject due to shade / spec discrepancy">
                    <Button
                      size="small"
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleOpenApprovalModal(r, "rejected")}
                    >
                      Reject
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Only authorized QC / Head Merchandiser can approve">
                  <Tag color="orange">Pending Approver</Tag>
                </Tooltip>
              )
            )}

            {st === "approved" && (
              <Tag color="green" icon={<CheckCircleOutlined />}>Verified</Tag>
            )}

            {st === "rejected" && (
              <Tag color="red" icon={<CloseCircleOutlined />}>Spec Mismatch</Tag>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Fabric & Trims Inventory" />

      {/* Summary KPI */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <Statistic
              title="Total Material Items Tracked"
              value={meta.total || 0}
              prefix={<InboxOutlined className="text-blue-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <Statistic
              title="Estimated Stock Valuation"
              value={totalStockValuation}
              precision={2}
              prefix={<DollarCircleOutlined className="text-green-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="border-l-4 border-l-purple-500 shadow-sm bg-purple-50/40">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-purple-700 font-semibold uppercase tracking-wider">Sample Room Inward</div>
                <div className="text-sm text-gray-600 mt-1">Directly inward 5-10 sample buttons, fabric swatches & trims without bulk PO.</div>
              </div>
              {canCreateSampleInward && (
                <Button
                  size="small"
                  type="primary"
                  className="bg-purple-600 hover:bg-purple-700 font-medium"
                  onClick={() => {
                    form.resetFields();
                    form.setFieldsValue({
                      sourceType: "SAMPLE_MARKET_SOURCING",
                      locationRack: "Sample Room - Rack S1",
                      itemCategory: "SEWING_TRIMS",
                      unit: "Pcs",
                      receiveQty: 5,
                      unitPrice: 0,
                      approvalStatus: "pending",
                    });
                    setIsSampleModalOpen(true);
                  }}
                >
                  + Sample Inward
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          tabBarExtraContent={
            canCreateSampleInward ? (
              <Space>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  className="bg-purple-600 hover:bg-purple-700 font-medium"
                  onClick={() => {
                    form.resetFields();
                    form.setFieldsValue({
                      sourceType: "SAMPLE_MARKET_SOURCING",
                      locationRack: "Sample Room - Rack S1",
                      itemCategory: "SEWING_TRIMS",
                      unit: "Pcs",
                      receiveQty: 5,
                      unitPrice: 0,
                      approvalStatus: "pending",
                    });
                    setIsSampleModalOpen(true);
                  }}
                >
                  + Quick Sample / Swatch Inward
                </Button>
              </Space>
            ) : null
          }
        >
          {/* TAB 1: Main Fabric & Trims Ledger */}
          <TabPane
            tab={
              <span className="font-semibold flex items-center gap-1.5">
                <InboxOutlined /> 📦 Bulk & Raw Material Inventory (মেইন ফেব্রিক ও ট্রিমস স্টক)
              </span>
            }
            key="ledger"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-2">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search material item name..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={() => refetch()}
                  className="w-full md:w-60"
                  allowClear
                />

                <Select
                  placeholder="All Categories"
                  value={category || undefined}
                  onChange={(val) => setCategory(val || "")}
                  allowClear
                  className="w-full md:w-48"
                >
                  <Option value="FABRICS">FABRICS</Option>
                  <Option value="SEWING_TRIMS">SEWING TRIMS</Option>
                  <Option value="FINISHING_TRIMS">FINISHING TRIMS</Option>
                  <Option value="PACKAGING">PACKAGING</Option>
                  <Option value="OTHER">OTHER</Option>
                </Select>

                <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
              </div>
            </div>

            <Table
              dataSource={inventoryItems}
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
          </TabPane>

          {/* TAB 2: Sample & Swatch Inward Register with Approval */}
          <TabPane
            tab={
              <span className="font-semibold flex items-center gap-1.5 text-purple-700">
                <ExperimentOutlined /> 🧵 Sample & Swatch Inward Register (স্যাম্পল ইনওয়ার্ড ও কোয়ালিটি অনুমোদন)
                {pendingSampleCount > 0 && (
                  <Tag color="orange" className="ml-1 font-bold">{pendingSampleCount} Pending</Tag>
                )}
              </span>
            }
            key="sample_inwards"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-2">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search lot #, item name..."
                  prefix={<SearchOutlined />}
                  value={sampleSearchTerm}
                  onChange={(e) => setSampleSearchTerm(e.target.value)}
                  onPressEnter={() => refetchSampleInwards()}
                  className="w-full md:w-60"
                  allowClear
                />

                <Select
                  placeholder="All Approval Statuses"
                  value={sampleStatusFilter || undefined}
                  onChange={(val) => setSampleStatusFilter(val || "")}
                  allowClear
                  className="w-full md:w-52"
                >
                  <Option value="pending">⏳ Pending QC Approval</Option>
                  <Option value="approved">✔ Approved</Option>
                  <Option value="rejected">✖ Rejected</Option>
                </Select>

                <Button icon={<ReloadOutlined />} onClick={() => refetchSampleInwards()} loading={isSampleInwardsLoading} />
              </div>
            </div>

            <Table
              dataSource={sampleInwards}
              columns={sampleInwardColumns}
              rowKey="id"
              loading={isSampleInwardsLoading}
              pagination={{
                current: samplePage,
                pageSize: sampleLimit,
                total: sampleMeta.total,
                onChange: (p, l) => {
                  setSamplePage(p);
                  setSampleLimit(l);
                },
                showSizeChanger: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Lot / Roll breakdown modal */}
      <Modal
        title={`Lot & Roll Traceability: ${selectedItemForLots?.name || ""}`}
        open={!!selectedItemForLots}
        onCancel={() => setSelectedItemForLots(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedItemForLots(null)}>
            Close
          </Button>,
        ]}
        width={850}
      >
        <Table
          dataSource={lotsList}
          columns={lotColumns}
          rowKey="id"
          loading={isLotsLoading}
          pagination={false}
          size="small"
        />
      </Modal>

      {/* Direct Sample Material Inward Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-purple-800">
            <ExperimentOutlined className="text-xl text-purple-600" />
            <span className="font-bold text-base">Direct Sample Material Inward (স্যাম্পল ম্যাটেরিয়াল ও সোয়াচ স্টক এন্ট্রি)</span>
          </div>
        }
        open={isSampleModalOpen}
        onCancel={() => setIsSampleModalOpen(false)}
        footer={null}
        width={750}
      >
        <Alert
          type="info"
          showIcon
          className="mb-4 text-xs"
          message="Direct Sample Intake (কোন বাল্ক পিও ছাড়াই সরাসরি স্যাম্পল এন্ট্রি)"
          description="লোকাল মার্কেট (ইসলামপুর/এলিফ্যান্ট রোড), সাপ্লায়ার সোয়াচ কার্ড অথবা পেটি ক্যাশ থেকে আনা অল্প পরিমাণের স্যাম্পল ট্রিমস (যেমন: ৫টি বোতাম, ২ গজ ফেব্রিক সোয়াচ, স্যাম্পল জিপার) সরাসরি স্যাম্পল রুমে স্টক-ইন করুন।"
        />

        {/* Quick Presets */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <TagOutlined /> ⚡ Quick Material Presets (এক ক্লিকে স্যাম্পল আইটেম লোড করুন):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESET_ITEMS.map((preset, idx) => (
              <Tag
                key={idx}
                color="purple"
                className="cursor-pointer hover:opacity-80 transition-opacity py-0.5 px-2"
                onClick={() => handleApplyPreset(preset)}
              >
                + {preset.name} ({preset.defaultQty} {preset.unit})
              </Tag>
            ))}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSampleInwardSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="sourceType"
                label="Sourcing Channel (সংগ্রহের মাধ্যম)"
                rules={[{ required: true, message: "Please select sourcing type" }]}
              >
                <Select placeholder="Select sourcing channel">
                  <Option value="SAMPLE_MARKET_SOURCING">Local Market Sourcing (ইসলামপুর / স্থানীয় বাজার)</Option>
                  <Option value="SUPPLIER_SWATCH">Supplier Free Swatch / Sample (সাপ্লায়ার সোয়াচ)</Option>
                  <Option value="PETTY_CASH">Sample Development Petty Cash (পেটি ক্যাশ ক্রয়)</Option>
                  <Option value="OPENING_STOCK">Opening / Existing Development Stock (প্রারম্ভিক স্টক)</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="orderNo"
                label="Link to Sample / Buyer Order (Optional)"
              >
                <Select
                  placeholder="Select related Sample or Bulk Order"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {ordersList.map((ord: any) => (
                    <Option key={ord.id} value={ord.orderNo}>
                      {ord.orderNo} - {ord.buyerName} ({ord.styleName} - {ord.orderType || "BULK"})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="itemCategory"
                label="Material Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select placeholder="Select Category">
                  <Option value="FABRICS">FABRICS (ফেব্রিক ও সোয়াচ)</Option>
                  <Option value="SEWING_TRIMS">SEWING TRIMS (বাটন, জিপার, সুতা)</Option>
                  <Option value="FINISHING_TRIMS">FINISHING TRIMS (লেবেল, হ্যাংট্যাগ)</Option>
                  <Option value="PACKAGING">PACKAGING (পলিব্যাগ, কার্টন)</Option>
                  <Option value="ACCESSORIES">ACCESSORIES</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="itemName"
                label="Material Item Name"
                rules={[{ required: true, message: "Material name is required" }]}
              >
                <Input placeholder="e.g. 100% Cotton 4-Hole Horn Button" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="itemColor"
                label="Color / Shade / Spec"
              >
                <Input placeholder="e.g. Navy Blue / 18L / #001" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="receiveQty"
                label="Sample Quantity"
                rules={[{ required: true, message: "Quantity is required" }]}
              >
                <InputNumber
                  min={0.1}
                  className="w-full"
                  placeholder="e.g. 5"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="unit"
                label="Unit of Measure (UOM)"
                rules={[{ required: true, message: "Unit is required" }]}
              >
                <Select placeholder="Select unit">
                  <Option value="Pcs">Pcs (পিস / টুকরা)</Option>
                  <Option value="Yds">Yds (গজ)</Option>
                  <Option value="Mtr">Mtr (মিটার)</Option>
                  <Option value="Kg">Kg (কেজি)</Option>
                  <Option value="Cone">Cone (কোন)</Option>
                  <Option value="Dzn">Dzn (ডজন)</Option>
                  <Option value="Gross">Gross (গ্রোস)</Option>
                  <Option value="Pack">Pack (প্যাকেট)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="unitPrice"
                label="Unit Price / Cost (Optional)"
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="e.g. 10.00"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="supplierOrMarket"
                label="Shop / Market / Supplier"
              >
                <Input placeholder="e.g. Islampur Market - Bismillah Trims" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="locationRack"
                label="Store Location / Rack"
              >
                <Input placeholder="e.g. Sample Room - Rack S1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="approvalStatus"
                label="Initial Approval Status"
                initialValue="pending"
              >
                <Select>
                  <Option value="pending">⏳ Pending (Checker / QC Review Required)</Option>
                  <Option value="approved">✔ Auto-Approve (Directly Ready for Sample Make)</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="remarks"
                label="Sample Purpose / Notes"
              >
                <Input placeholder="e.g. 5 pcs horn buttons for Proto Sample HM-POLO-2026 fit test" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button onClick={() => setIsSampleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmittingSample}
              icon={<ExperimentOutlined />}
              className="bg-purple-600 hover:bg-purple-700 font-semibold"
            >
              Record Sample Inward to Stock
            </Button>
          </div>
        </Form>
      </Modal>

      {/* QC & Approver Decision Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {approvalDecision === "approved" ? (
              <CheckCircleOutlined className="text-green-600 text-lg" />
            ) : (
              <CloseCircleOutlined className="text-red-600 text-lg" />
            )}
            <span className="font-bold">
              {approvalDecision === "approved" ? "Approve Sample Material Quality" : "Reject Sample Material"}
            </span>
          </div>
        }
        open={!!approvalModalLot}
        onCancel={() => setApprovalModalLot(null)}
        footer={null}
        width={550}
      >
        <div className="bg-gray-50 p-3 rounded-md mb-4 text-xs space-y-1">
          <div><span className="font-semibold text-gray-700">Inward Lot:</span> <span className="font-mono text-purple-700 font-bold">{approvalModalLot?.lotNumber}</span></div>
          <div><span className="font-semibold text-gray-700">Material Item:</span> {approvalModalLot?.inventory?.itemName} ({approvalModalLot?.receivedQty} {approvalModalLot?.inventory?.unit})</div>
          <div><span className="font-semibold text-gray-700">Sourced From:</span> {approvalModalLot?.supplierOrMarket || "Local Market"}</div>
        </div>

        <Form
          form={approvalForm}
          layout="vertical"
          onFinish={handleApprovalSubmit}
        >
          <Form.Item
            name="note"
            label={approvalDecision === "approved" ? "QC & Approval Comments" : "Rejection Reason / Discrepancy Note"}
            rules={[{ required: true, message: "Please provide a note for this decision" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder={approvalDecision === "approved" ? "e.g. Shade and physical spec verified and approved for proto make" : "e.g. Button shade does not match buyer swatch"}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setApprovalModalLot(null)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isDecidingApproval}
              className={approvalDecision === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              Confirm {approvalDecision === "approved" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
