"use client";
import React, { useState, useEffect, Suspense } from "react";
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
  Popconfirm,
  message,
  Tooltip,
  Row,
  Col,
  Spin,
  Steps,
  Alert,
  Divider,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  BarcodeOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  CompassOutlined
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";
import {
  useGetGarmentsBomsQuery,
  useGetAllGarmentsOrdersListQuery,
  useCreateGarmentsBomMutation,
  useApproveGarmentsBomMutation,
  useDeleteGarmentsBomMutation,
  useGetGarmentsBomByIdQuery} from "@/redux/api/garmentsApi";

const { Option } = Select;

const PRESET_TEMPLATES: Record<string, any[]> = {
  POLO: [
    {
      itemCategory: "FABRICS",
      itemName: "100% Cotton 30/1 Single Jersey Fabric",
      specification: "180 GSM, 72 inch open width",
      unit: "KG",
      consumption: 0.24,
      wastagePercent: 5.0,
      itemPrice: 3.8,
    },
    {
      itemCategory: "SEWING_TRIMS",
      itemName: "Flat Knit 1x1 Rib Collar & Cuff Set",
      specification: "Matching body color",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 3.0,
      itemPrice: 0.45,
    },
    {
      itemCategory: "SEWING_TRIMS",
      itemName: "Sewing Thread 40/2",
      specification: "100% Spun Polyester",
      unit: "CONE",
      consumption: 0.05,
      wastagePercent: 2.0,
      itemPrice: 1.2,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "18L 4-Hole Horn Button",
      specification: "Placket front 3 pcs",
      unit: "PCS",
      consumption: 3.0,
      wastagePercent: 5.0,
      itemPrice: 0.02,
    },
    {
      itemCategory: "PACKAGING",
      itemName: "Polybag & Branded Hangtag",
      specification: "Self-adhesive printed poly",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 3.0,
      itemPrice: 0.12,
    },
    {
      itemCategory: "PACKAGING",
      itemName: "5-Ply Master Export Carton",
      specification: "60x40x30 cm, 24 pcs/ctn",
      unit: "PCS",
      consumption: 0.042,
      wastagePercent: 1.0,
      itemPrice: 1.5,
    },
  ],
  DENIM: [
    {
      itemCategory: "FABRICS",
      itemName: "100% Cotton 12.5 oz Indigo Denim",
      specification: "3/1 RHT 58/60 inch width",
      unit: "YDS",
      consumption: 1.45,
      wastagePercent: 6.0,
      itemPrice: 3.2,
    },
    {
      itemCategory: "FABRICS",
      itemName: "100% Cotton Pocketing Twill",
      specification: "120 GSM Natural Ecru",
      unit: "YDS",
      consumption: 0.35,
      wastagePercent: 5.0,
      itemPrice: 1.1,
    },
    {
      itemCategory: "SEWING_TRIMS",
      itemName: "Heavy Duty Jeans Thread 20/3 & 40/2",
      specification: "Golden Tan contrast stitching",
      unit: "CONE",
      consumption: 0.12,
      wastagePercent: 3.0,
      itemPrice: 1.5,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "Brass Metal Zipper #5",
      specification: "Autolock 5.5 inch",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 2.0,
      itemPrice: 0.28,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "Metal Shank Button & Rivets Set",
      specification: "Antiqued Brass 1 Shank + 6 Rivets",
      unit: "PCS",
      consumption: 7.0,
      wastagePercent: 4.0,
      itemPrice: 0.04,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "PU Leather Back Waistband Patch",
      specification: "Embossed brand logo",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 2.0,
      itemPrice: 0.18,
    },
  ],
  SHIRT: [
    {
      itemCategory: "FABRICS",
      itemName: "50/1 Cotton Poplin / Oxford Solid Fabric",
      specification: "120 GSM 58 inch width",
      unit: "YDS",
      consumption: 1.6,
      wastagePercent: 5.0,
      itemPrice: 2.8,
    },
    {
      itemCategory: "SEWING_TRIMS",
      itemName: "Fusible Woven Interlining",
      specification: "Collar, Cuff & Placket fuse",
      unit: "YDS",
      consumption: 0.25,
      wastagePercent: 4.0,
      itemPrice: 0.9,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "16L Pearl Finish Polyester Buttons",
      specification: "12 pcs front & cuffs",
      unit: "PCS",
      consumption: 12.0,
      wastagePercent: 5.0,
      itemPrice: 0.015,
    },
    {
      itemCategory: "PACKAGING",
      itemName: "Collar Butterfly, Bone & Clip Set",
      specification: "Packaging presentation set",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 2.0,
      itemPrice: 0.08,
    },
  ],
  HOODIE: [
    {
      itemCategory: "FABRICS",
      itemName: "Cotton/Poly 60/40 Brushed Fleece Fabric",
      specification: "280 GSM Heavyweight",
      unit: "KG",
      consumption: 0.48,
      wastagePercent: 6.0,
      itemPrice: 4.5,
    },
    {
      itemCategory: "FABRICS",
      itemName: "2x2 Lycra Heavy Rib",
      specification: "Waistband & Cuffs",
      unit: "KG",
      consumption: 0.08,
      wastagePercent: 4.0,
      itemPrice: 5.2,
    },
    {
      itemCategory: "SEWING_TRIMS",
      itemName: "Cotton Flat Hood Drawcord",
      specification: "Round metal aglet tips",
      unit: "PCS",
      consumption: 1.0,
      wastagePercent: 2.0,
      itemPrice: 0.22,
    },
    {
      itemCategory: "FINISHING_TRIMS",
      itemName: "Metal Eyelets for Hood Cord",
      specification: "Gunmetal finish 2 pcs",
      unit: "PCS",
      consumption: 2.0,
      wastagePercent: 5.0,
      itemPrice: 0.03,
    },
  ],
};

function GarmentsBomContent() {
  const { canCreateBom, canApproveBom, canCreatePo } = useGarmentsPermission();
  const searchParams = useSearchParams();
  const preSelectedOrderId = searchParams ? searchParams.get("orderId") : null;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(preSelectedOrderId || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingBomId, setViewingBomId] = useState<string | null>(null);

  const [form] = Form.useForm();

  // Queries
  const { data: res, isLoading, refetch } = useGetGarmentsBomsQuery({
    page,
    limit,
    orderId: selectedOrderId || undefined,
  });

  const { data: ordersRes } = useGetAllGarmentsOrdersListQuery(undefined);
  const ordersList = ordersRes?.data || [];

  const { data: viewingBomRes } = useGetGarmentsBomByIdQuery(
    viewingBomId!,
    { skip: !viewingBomId }
  );
  const viewingBom = viewingBomRes?.data;

  // Mutations
  const [createBom, { isLoading: isCreating }] = useCreateGarmentsBomMutation();
  const [approveBom, { isLoading: isApproving }] = useApproveGarmentsBomMutation();
  const [deleteBom] = useDeleteGarmentsBomMutation();

  const boms = res?.data || [];
  const meta = res?.meta || { total: 0 };

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

  const handleOrderChange = (orderId: string) => {
    const found = ordersList.find((o: any) => o.id === orderId);
    setSelectedOrderDetails(found);
  };

  const handleApplyPreset = (presetKey: string) => {
    const items = PRESET_TEMPLATES[presetKey];
    if (items) {
      form.setFieldsValue({ items });
      message.success(`Applied ${presetKey} material preset template`);
    }
  };

  useEffect(() => {
    if (preSelectedOrderId && ordersList.length > 0) {
      setSelectedOrderId(preSelectedOrderId);
      handleOrderChange(preSelectedOrderId);
    }
  }, [preSelectedOrderId, ordersList]);

  const handleOpenCreateModal = () => {
    form.resetFields();
    if (selectedOrderId) {
      form.setFieldsValue({ buyerOrderId: selectedOrderId, orderId: selectedOrderId });
      handleOrderChange(selectedOrderId);
    }
    form.setFieldsValue({
      items: PRESET_TEMPLATES.POLO,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const orderId = values.orderId || values.buyerOrderId;
      const foundOrder = ordersList.find((o: any) => o.id === orderId);

      const payload = {
        orderId,
        styleNo: foundOrder?.orderNo ? `BOM-${foundOrder.orderNo}` : `BOM-${Math.floor(1000 + Math.random() * 9000)}`,
        styleName: foundOrder?.styleName || "Apparel Style",
        orderQuantity: Number(foundOrder?.orderQuantity || 1000),
        items: values.items,
        remarks: values.remarks,
      };

      await createBom(payload).unwrap();
      message.success("BOM created successfully with auto consumption & cost formulas");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create BOM");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveBom(id).unwrap();
      message.success("BOM approved! Material requirements now active.");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to approve BOM");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBom(id).unwrap();
      message.success("BOM deleted");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete BOM");
    }
  };

  const columns = [
    {
      title: "BOM #",
      key: "bomNumber",
      render: (_: any, record: any) => (
        <span className="font-bold text-green-600">{record.styleNo || record.bomNumber || `BOM-${record.id?.slice(0, 6)}`}</span>
      ),
    },
    {
      title: "Buyer Order",
      key: "order",
      render: (_: any, record: any) => {
        const ord = record.order || record.buyerOrder;
        return (
          <div>
            <div className="font-semibold text-gray-900">{ord?.buyerName || "-"}</div>
            <div className="text-xs text-blue-600 font-mono">
              {ord?.orderNo || ord?.orderNumber || "-"} • {record.styleName || ord?.styleName || "-"}
            </div>
          </div>
        );
      },
    },
    {
      title: "Order Qty",
      key: "qty",
      render: (_: any, record: any) => {
        const ord = record.order || record.buyerOrder;
        const qty = record.orderQuantity || ord?.orderQuantity;
        return <span>{Number(qty || 0).toLocaleString()} pcs</span>;
      },
    },
    {
      title: "BOM Items",
      key: "itemsCount",
      render: (_: any, record: any) => <span>{record.items?.length || 0} materials</span>,
    },
    {
      title: "Total Estimated Cost",
      dataIndex: "totalEstimatedCost",
      key: "totalEstimatedCost",
      render: (cost: number, record: any) => {
        const ord = record.order || record.buyerOrder;
        const total = cost !== undefined ? cost : record.items?.reduce((s: number, i: any) => s + Number(i.totalCost || 0), 0);
        return (
          <span className="font-bold text-gray-800">
            {ord?.currency || "USD"} {Number(total || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "isApproved",
      render: (_: any, record: any) => {
        const approved = record.status === "approved" || record.isApproved === true;
        return (
          <Tag color={approved ? "success" : "warning"} className="uppercase font-medium">
            {approved ? "Approved" : "Draft / Pending"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const approved = record.status === "approved" || record.isApproved === true;
        return (
          <Space size="middle">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setViewingBomId(record.id)}
            >
              View
            </Button>

            {!approved && canApproveBom && (
              <Popconfirm
                title="Approve this BOM for production and PO generation?"
                onConfirm={() => handleApprove(record.id)}
                okText="Approve"
                cancelText="Cancel"
              >
                <Button size="small" type="primary" icon={<CheckCircleOutlined />} loading={isApproving} className="bg-green-600">
                  Approve
                </Button>
              </Popconfirm>
            )}

            {approved && canCreatePo && (
              <Tooltip title="Generate Factory Purchase Order (PO) from this BOM">
                <Link href="/garments/po">
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<BarcodeOutlined />}
                  >
                    Create PO
                  </Button>
                </Link>
              </Tooltip>
            )}

            {canCreateBom && (
              <Popconfirm
                title="Delete this BOM?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Bill of Materials (BOM) & Costing" />

      {/* 4-Step Procurement Roadmap */}
      <Card className="shadow-sm border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
              <CompassOutlined className="text-emerald-600" />
              Standard BOM & Material Procurement Flow
            </h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Define fabric & trims requirements, calculate total demand, approve costing, and auto-generate Purchase Orders.
            </p>
          </div>
        </div>
        <Steps
          size="small"
          current={boms.length > 0 ? 1 : 0}
          items={[
            { title: "1. Select Order", description: "Choose buyer contract" },
            { title: "2. Build BOM", description: "Fabric & trims formula" },
            { title: "3. Approve BOM", description: "Lock consumption & cost" },
            { title: "4. Auto-Issue PO", description: "1-click factory purchase" },
          ]}
        />
      </Card>

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              placeholder="Filter by Buyer Order"
              value={selectedOrderId || undefined}
              onChange={(val) => setSelectedOrderId(val || "")}
              allowClear
              className="w-full md:w-80"
            >
              {ordersList.map((o: any) => (
                <Option key={o.id} value={o.id}>
                  {o.orderNo || o.orderNumber} - {o.buyerName} ({o.styleName})
                </Option>
              ))}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>

          {canCreateBom && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
              className="bg-green-600"
            >
              Create BOM
            </Button>
          )}
        </div>

        <Table
          dataSource={boms}
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

      {/* Modal for Create BOM */}
      <Modal
        title="Create Bill of Materials (BOM) Sheet"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="orderId"
            label="Select Buyer Order"
            rules={[{ required: true, message: "Please select an order" }]}
          >
            <Select
              placeholder="Choose Buyer Order to attach BOM"
              onChange={handleOrderChange}
            >
              {ordersList.map((o: any) => (
                <Option key={o.id} value={o.id}>
                  {o.orderNo || o.orderNumber} - {o.buyerName} ({o.styleName}) | Order Qty: {o.orderQuantity} pcs
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedOrderDetails && (
            <div className="bg-blue-50 p-3 rounded mb-4 text-xs text-blue-900 border border-blue-200">
              <strong>Order Info:</strong> {selectedOrderDetails.buyerName} | Style: {selectedOrderDetails.styleName} | Quantity: {selectedOrderDetails.orderQuantity} pcs | Delivery: {selectedOrderDetails.deliveryDate ? new Date(selectedOrderDetails.deliveryDate).toLocaleDateString() : 'N/A'}
            </div>
          )}

          <Divider orientation="left">Raw Material & Consumption Specification</Divider>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
            <div>
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                <ThunderboltOutlined className="text-amber-500" /> 1-Click Zero-Loss Material Presets:
              </span>
              <p className="text-[11px] text-indigo-600 mb-0">Select a template to auto-populate fabrics, trims, buttons & packaging:</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button size="small" type="dashed" className="text-xs font-medium" onClick={() => handleApplyPreset("POLO")}>
                👕 Polo / T-Shirt
              </Button>
              <Button size="small" type="dashed" className="text-xs font-medium" onClick={() => handleApplyPreset("DENIM")}>
                👖 Denim Jeans
              </Button>
              <Button size="small" type="dashed" className="text-xs font-medium" onClick={() => handleApplyPreset("SHIRT")}>
                👔 Woven Shirt
              </Button>
              <Button size="small" type="dashed" className="text-xs font-medium" onClick={() => handleApplyPreset("HOODIE")}>
                🧥 Hoodie / Fleece
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2 italic">
            * Total Qty auto-calculated: OrderQty × Consumption × (1 + Wastage%/100). Total Cost: TotalQty × UnitPrice.
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" className="bg-gray-50 border border-gray-200 relative">
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "itemCategory"]}
                          label="Category"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            <Option value="FABRICS">FABRICS</Option>
                            <Option value="SEWING_TRIMS">SEWING TRIMS</Option>
                            <Option value="FINISHING_TRIMS">FINISHING TRIMS</Option>
                            <Option value="PACKAGING">PACKAGING</Option>
                            <Option value="OTHER">OTHER</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "itemName"]}
                          label="Material Item Name"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Input placeholder="e.g. 100% Cotton Single Jersey" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "specification"]}
                          label="Specification / Construction"
                        >
                          <Input placeholder="e.g. 180 GSM, 24/1 Combed" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "unit"]}
                          label="Unit"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            <Option value="KG">KG</Option>
                            <Option value="YDS">YDS</Option>
                            <Option value="MTR">MTR</Option>
                            <Option value="PCS">PCS</Option>
                            <Option value="DZN">DZN</Option>
                            <Option value="CONE">CONE</Option>
                            <Option value="ROLL">ROLL</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={5}>
                        <Form.Item
                          {...restField}
                          name={[name, "consumption"]}
                          label="Consumption / Pc"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0.0001} step={0.01} className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={5}>
                        <Form.Item
                          {...restField}
                          name={[name, "wastagePercent"]}
                          label="Wastage %"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} max={100} step={0.5} className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "itemPrice"]}
                          label="Est. Unit Price ($)"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0.01} step={0.01} className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={4} className="flex items-end justify-end">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          disabled={fields.length === 1}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      itemCategory: "SEWING_TRIMS",
                      itemName: "",
                      unit: "PCS",
                      consumption: 1,
                      wastagePercent: 3,
                      itemPrice: 0.5,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add Material Row
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item name="remarks" label="BOM Notes" className="mt-4">
            <Input.TextArea rows={2} placeholder="Optional notes for cutting & procurement..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isCreating} className="bg-green-600">
              Save BOM Sheet
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View BOM Detail Modal */}
      <Modal
        title={`BOM Specification Sheet: ${viewingBom?.styleNo || viewingBom?.bomNumber || ""}`}
        open={!!viewingBomId}
        onCancel={() => setViewingBomId(null)}
        footer={[
          <Button key="close" onClick={() => setViewingBomId(null)}>
            Close
          </Button>,
          viewingBom && viewingBom.status !== "approved" && (
            <Button
              key="approve"
              type="primary"
              className="bg-green-600"
              onClick={() => {
                handleApprove(viewingBom.id);
                setViewingBomId(null);
              }}
            >
              Approve BOM
            </Button>
          ),
        ]}
        width={950}
      >
        {viewingBom && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border">
              <div>
                <span className="text-xs text-gray-500">Buyer</span>
                <div className="font-semibold">{viewingBom.order?.buyerName || viewingBom.buyerOrder?.buyerName}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Order #</span>
                <div className="font-semibold text-blue-600">{viewingBom.order?.orderNo || viewingBom.buyerOrder?.orderNo || "-"}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Style</span>
                <div className="font-semibold">{viewingBom.styleName || viewingBom.order?.styleName}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Order Qty</span>
                <div className="font-semibold">{viewingBom.orderQuantity || viewingBom.order?.orderQuantity?.toLocaleString()} pcs</div>
              </div>
            </div>

            <Table
              dataSource={viewingBom.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Category",
                  dataIndex: "itemCategory",
                  key: "itemCategory",
                  render: (c: string) => <Tag color="blue">{c}</Tag>,
                },
                {
                  title: "Item Name & Spec",
                  key: "name",
                  render: (_: any, r: any) => (
                    <div>
                      <div className="font-semibold">{r.itemName}</div>
                      {r.itemColor && <div className="text-xs text-gray-500">Color: {r.itemColor}</div>}
                    </div>
                  ),
                },
                {
                  title: "Consumption",
                  key: "cons",
                  render: (_: any, r: any) => (
                    <span>{r.consumption} {r.unit} / pc</span>
                  ),
                },
                {
                  title: "Wastage",
                  dataIndex: "wastagePercent",
                  key: "wastagePercent",
                  render: (w: number) => <span>{w}%</span>,
                },
                {
                  title: "Required Qty",
                  key: "qty",
                  render: (_: any, r: any) => (
                    <span className="font-bold text-green-700">{Number(r.totalQty || r.totalRequiredQty || 0).toLocaleString()} {r.unit}</span>
                  ),
                },
                {
                  title: "Est. Cost",
                  key: "cost",
                  render: (_: any, r: any) => (
                    <span className="font-semibold">${Number(r.totalCost || r.totalEstimatedCost || 0).toFixed(2)}</span>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function GarmentsBomPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Spin size="large" /></div>}>
      <GarmentsBomContent />
    </Suspense>
  );
}
