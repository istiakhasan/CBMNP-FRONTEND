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
  DatePicker,
  Tag,
  Space,
  Card,
  Popconfirm,
  message,
  Tooltip,
  Divider,
  Row,
  Col,
  Steps,
  Alert,
  Spin,
} from "antd";
import {
  PlusOutlined,
  PrinterOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SendOutlined,
  EyeOutlined,
  InboxOutlined,
  AuditOutlined,
  BarcodeOutlined,
  ShoppingOutlined,
  FileDoneOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import dayjs from "dayjs";
import {
  useGetGarmentsPosQuery,
  useGetAllGarmentsOrdersListQuery,
  useGetAllGarmentsBomsListQuery,
  useCreateGarmentsPoMutation,
  useSubmitGarmentsPoCheckMutation,
  useDeleteGarmentsPoMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

function GarmentsPoContent() {
  const { canCreatePo, canCheckPo, canApprovePo } = useGarmentsPermission();
  const searchParams = useSearchParams();
  const preSelectedOrderId = searchParams ? searchParams.get("orderId") : null;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedBom, setSelectedBom] = useState<any>(null);

  const [form] = Form.useForm();

  const { data: res, isLoading, refetch } = useGetGarmentsPosQuery({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const { data: ordersRes } = useGetAllGarmentsOrdersListQuery(undefined);
  const ordersList = ordersRes?.data || [];

  const { data: bomsRes } = useGetAllGarmentsBomsListQuery(undefined);
  const bomsList = bomsRes?.data || [];

  const [createPo, { isLoading: isCreating }] = useCreateGarmentsPoMutation();
  const [submitCheck, { isLoading: isSubmitting }] = useSubmitGarmentsPoCheckMutation();
  const [deletePo] = useDeleteGarmentsPoMutation();

  const pos = res?.data || [];
  const meta = res?.meta || { total: 0 };

  const handleOrderSelect = (orderId: string) => {
    const foundOrder = ordersList.find((o: any) => o.id === orderId);
    setSelectedOrder(foundOrder || null);

    // Look for attached BOM
    const matchedBom = bomsList.find(
      (b: any) => b.orderId === orderId || b.buyerOrderId === orderId
    );

    if (matchedBom && matchedBom.items && matchedBom.items.length > 0) {
      setSelectedBom(matchedBom);
      const mappedItems = matchedBom.items.map((item: any) => ({
        itemCategory: item.itemCategory || "FABRICS",
        itemName: item.itemName,
        specification: item.specification || "",
        unit: item.unit || "KG",
        quantity: Number(item.totalQty || item.totalRequiredQty || 100),
        unitPrice: Number(item.itemPrice || item.unitPrice || 1.0),
      }));

      form.setFieldsValue({
        orderId,
        bomId: matchedBom.id,
        items: mappedItems,
        remarks: `Auto-generated from BOM: ${matchedBom.styleNo || matchedBom.bomNumber} for Buyer Order: ${foundOrder?.orderNo || ""} (${foundOrder?.buyerName || ""})`,
      });
      message.success(`Connected to BOM: Loaded ${mappedItems.length} materials for Order ${foundOrder?.orderNo}`);
    } else {
      setSelectedBom(null);
      form.setFieldsValue({
        orderId,
        remarks: `Purchase Order for Buyer Order: ${foundOrder?.orderNo || ""} (${foundOrder?.buyerName || ""}) - Style: ${foundOrder?.styleName || ""}`,
      });
      message.info(`Selected Order ${foundOrder?.orderNo}. (No BOM found yet - you can enter items manually).`);
    }
  };

  const handleBomSelect = (bomId: string) => {
    const matchedBom = bomsList.find((b: any) => b.id === bomId);
    if (matchedBom && matchedBom.items) {
      setSelectedBom(matchedBom);
      const foundOrder = ordersList.find((o: any) => o.id === (matchedBom.orderId || matchedBom.buyerOrderId));
      if (foundOrder) setSelectedOrder(foundOrder);

      const mappedItems = matchedBom.items.map((item: any) => ({
        itemCategory: item.itemCategory || "FABRICS",
        itemName: item.itemName,
        specification: item.specification || "",
        unit: item.unit || "KG",
        quantity: Number(item.totalQty || item.totalRequiredQty || 100),
        unitPrice: Number(item.itemPrice || item.unitPrice || 1.0),
      }));

      form.setFieldsValue({
        orderId: matchedBom.orderId || matchedBom.buyerOrderId || undefined,
        bomId,
        items: mappedItems,
        remarks: `Auto-generated from BOM: ${matchedBom.styleNo || matchedBom.bomNumber} for Buyer: ${matchedBom.buyerOrder?.buyerName || foundOrder?.buyerName || "General"}`,
      });
      message.success(`Loaded ${mappedItems.length} items from BOM ${matchedBom.styleNo || matchedBom.bomNumber}`);
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    setSelectedOrder(null);
    setSelectedBom(null);

    form.setFieldsValue({
      currency: "USD",
      paymentTerms: "30 Days Net",
      deliveryTerms: "FOB Factory",
      expectedDeliveryDate: dayjs().add(15, "day"),
      items: [
        {
          itemCategory: "FABRICS",
          itemName: "100% Cotton 30/1 Single Jersey",
          specification: "160 GSM, 72 inch open width",
          unit: "KG",
          quantity: 500,
          unitPrice: 3.8,
        },
      ],
    });

    if (preSelectedOrderId && ordersList.length > 0) {
      handleOrderSelect(preSelectedOrderId);
    }

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (preSelectedOrderId && ordersList.length > 0 && !isModalOpen) {
      handleOpenModal();
    }
  }, [preSelectedOrderId, ordersList]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        orderId: values.orderId,
        items: (values.items || []).map((item: any) => ({
          ...item,
          qty: Number(item.quantity ?? item.qty ?? 0),
          quantity: Number(item.quantity ?? item.qty ?? 0),
          unitCost: Number(item.unitPrice ?? item.unitCost ?? item.price ?? 0),
          unitPrice: Number(item.unitPrice ?? item.unitCost ?? item.price ?? 0),
        })),
        expectedDeliveryDate: values.expectedDeliveryDate
          ? values.expectedDeliveryDate.toISOString()
          : null,
      };

      await createPo(payload).unwrap();
      message.success("Purchase Order created successfully in draft status");
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create PO");
    }
  };

  const handleSubmitCheck = async (id: string) => {
    try {
      await submitCheck(id).unwrap();
      message.success("PO submitted for 2-stage verification and check");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit check");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePo(id).unwrap();
      message.success("Purchase order deleted");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete PO");
    }
  };

  const columns = [
    {
      title: "PO #",
      key: "poNumber",
      render: (_: any, record: any) => (
        <span className="font-bold text-purple-600">{record.supplierPoNo || record.poNumber || "-"}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (name: string, record: any) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{record.supplierContact || "Direct Mill"}</div>
        </div>
      ),
    },
    {
      title: "Grand Total",
      key: "grandTotal",
      render: (_: any, record: any) => {
        const amt = record.totalAmount !== undefined ? record.totalAmount : record.grandTotal;
        return (
          <span className="font-bold text-gray-800">
            {record.currency || "USD"} {Number(amt || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Expected Delivery",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (_: any, record: any) => {
        const date = record.deliveryDate || record.expectedDeliveryDate;
        return date ? dayjs(date).format("YYYY-MM-DD") : "-";
      },
    },
    {
      title: "Approval Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "draft") color = "default";
        if (status === "pending_check") color = "gold";
        if (status === "pending_approval") color = "blue";
        if (status === "approved") color = "success";
        if (status === "rejected") color = "error";
        return <Tag color={color} className="uppercase font-medium">{status?.replace("_", " ")}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === "draft" && canCheckPo && (
            <Tooltip title="Submit for Checker Verification">
              <Button
                size="small"
                type="primary"
                ghost
                icon={<SendOutlined />}
                onClick={() => handleSubmitCheck(record.id)}
                loading={isSubmitting}
              >
                Submit Check
              </Button>
            </Tooltip>
          )}

          {(record.status === "pending_check" || record.status === "pending_approval") && (canCheckPo || canApprovePo) && (
            <Tooltip title="Authorize & Approve this PO">
              <Link href="/garments/po-approval">
                <Button size="small" type="primary" ghost icon={<AuditOutlined />} className="text-amber-600 border-amber-500">
                  Approve PO
                </Button>
              </Link>
            </Tooltip>
          )}

          {record.status === "approved" && canReceiveMaterials && (
            <Tooltip title="Receive Inward Goods for this Approved PO">
              <Link href="/garments/po-receive">
                <Button size="small" type="primary" icon={<InboxOutlined />} className="bg-amber-600 hover:bg-amber-700">
                  Receive Goods
                </Button>
              </Link>
            </Tooltip>
          )}

          <Link href={`/garments/po/${record.id}/print`}>
            <Tooltip title="Print Factory PO Challan">
              <Button size="small" icon={<PrinterOutlined />}>
                Print
              </Button>
            </Tooltip>
          </Link>

          {record.status === "draft" && canCreatePo && (
            <Popconfirm
              title="Delete this draft PO?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Purchase Orders (PO)" />

      {/* 4-Step PO Procurement Roadmap */}
      <Card className="shadow-sm border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-pink-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
              <BarcodeOutlined className="text-purple-600" />
              Factory Purchase Orders & Goods Inward Flow
            </h3>
            <p className="text-xs text-purple-700 mt-0.5">
              Draft PO from BOM ➔ Store Verification ➔ Management Approval ➔ Goods Inward & QC Receive.
            </p>
          </div>
        </div>
        <Steps
          size="small"
          current={pos.length === 0 ? 0 : pos.some((p: any) => p.status === "approved") ? 3 : pos.some((p: any) => p.status === "pending_approval" || p.status === "pending_check") ? 2 : 1}
          items={[
            { title: "1. Auto-Draft from BOM", description: "BOM items loaded" },
            { title: "2. Checker Verify", description: "Store check" },
            { title: "3. Management Approval", description: "Financial sign-off" },
            { title: "4. Goods Inward", description: "Lot/Roll QC inward" },
          ]}
        />
      </Card>

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              placeholder="Filter by Status"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || "")}
              allowClear
              className="w-full md:w-60"
            >
              <Option value="draft">Draft</Option>
              <Option value="pending_check">Pending Check</Option>
              <Option value="pending_approval">Pending Approval</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>

          {canCreatePo && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className="bg-purple-600"
            >
              Create Purchase Order
            </Button>
          )}
        </div>

        <Table
          dataSource={pos}
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

      {/* Create PO Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-purple-900">
            <BarcodeOutlined className="text-purple-600 text-lg" />
            <span>Create Garments Purchase Order (Fabric, Trims & Accessories)</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={980}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Order & BOM Selection Banner */}
          <div className="bg-purple-50/60 p-3.5 rounded-lg border border-purple-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="orderId"
                label={<span className="font-bold text-purple-900 flex items-center gap-1"><ShoppingOutlined /> 1. Select Buyer Order (Contract)</span>}
                rules={[{ required: true, message: "Please select a Buyer Order" }]}
                className="mb-0"
              >
                <Select
                  placeholder="Choose Buyer Order (e.g. ORD-2026-1009)"
                  onChange={handleOrderSelect}
                  showSearch
                  optionFilterProp="children"
                >
                  {ordersList.map((o: any) => (
                    <Option key={o.id} value={o.id}>
                      {o.orderNo || o.orderNumber} - {o.buyerName} ({o.styleName}) | Qty: {Number(o.orderQuantity || 0).toLocaleString()} pcs
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="bomId"
                label={<span className="font-bold text-purple-900 flex items-center gap-1"><FileDoneOutlined /> 2. Linked BOM (Auto-Selected)</span>}
                className="mb-0"
              >
                <Select
                  placeholder="Auto-linked from order or choose BOM"
                  onChange={handleBomSelect}
                  allowClear
                >
                  {bomsList.map((b: any) => (
                    <Option key={b.id} value={b.id}>
                      {b.styleNo || b.bomNumber} - {b.buyerOrder?.buyerName || b.styleName} ({b.items?.length || 0} materials)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {selectedOrder && (
              <div className="mt-3 pt-2 border-t border-purple-200 text-xs text-purple-900 flex flex-wrap justify-between items-center">
                <span>
                  <strong>Order Info:</strong> {selectedOrder.orderNo} | Buyer: {selectedOrder.buyerName} | Style: {selectedOrder.styleName} | Qty: {selectedOrder.orderQuantity} pcs
                </span>
                {selectedBom ? (
                  <Tag color="success" className="font-semibold">
                    <ThunderboltOutlined className="mr-1" /> BOM Attached ({selectedBom.items?.length || 0} Materials Auto-Filled)
                  </Tag>
                ) : (
                  <Tag color="warning" className="font-semibold">
                    No BOM attached to this order yet (Enter items below)
                  </Tag>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="supplierName"
              label="Supplier / Mill Name"
              rules={[{ required: true, message: "Please enter supplier name" }]}
            >
              <Input placeholder="e.g. Apex Spinning & Knitting Mills" />
            </Form.Item>

            <Form.Item name="supplierContact" label="Supplier Contact / Email">
              <Input placeholder="e.g. sales@apexspinning.com / +88017..." />
            </Form.Item>

            <Form.Item name="expectedDeliveryDate" label="Expected Mill Delivery Date">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="paymentTerms" label="Payment Terms">
              <Input placeholder="e.g. LC at Sight / 30 Days Net" />
            </Form.Item>

            <Form.Item name="deliveryTerms" label="Delivery Terms">
              <Input placeholder="e.g. Ex-Mill / Delivered to Factory" />
            </Form.Item>

            <Form.Item name="currency" label="Currency">
              <Select>
                <Option value="USD">USD ($)</Option>
                <Option value="BDT">BDT (৳)</Option>
                <Option value="EUR">EUR (€)</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider orientation="left">PO Line Items (Materials)</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" className="bg-gray-50 border border-gray-200">
                    <Row gutter={[8, 8]}>
                      <Col xs={24} md={5}>
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

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "itemName"]}
                          label="Item Description"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Input placeholder="Item name" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={3}>
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
                            <Option value="CONE">CONE</Option>
                            <Option value="ROLL">ROLL</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={3}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Order Qty"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0.1} className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={3}>
                        <Form.Item
                          {...restField}
                          name={[name, "unitPrice"]}
                          label="Unit Price"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0.01} step={0.01} className="w-full" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={2} className="flex items-end justify-end">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          disabled={fields.length === 1}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      itemCategory: "FABRICS",
                      itemName: "",
                      unit: "KG",
                      quantity: 100,
                      unitPrice: 2.5,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add PO Item
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item name="remarks" label="Terms & Quality Specifications" className="mt-4">
            <Input.TextArea rows={2} placeholder="Add color matching tolerances, lab dip approvals, shrinkage limits..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isCreating} className="bg-purple-600">
              Save Draft PO
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function GarmentsPoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Spin size="large" /></div>}>
      <GarmentsPoContent />
    </Suspense>
  );
}
