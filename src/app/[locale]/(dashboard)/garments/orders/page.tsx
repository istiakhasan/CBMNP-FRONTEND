"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Radio,
  Tabs,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FileDoneOutlined,
  TagOutlined,
  ExperimentOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "@/i18n/routing";
import {
  useGetGarmentsOrdersQuery,
  useCreateGarmentsOrderMutation,
  useUpdateGarmentsOrderMutation,
  useDeleteGarmentsOrderMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

const DEFAULT_CATEGORIES = [
  "T-Shirt / Polo",
  "Woven Shirt",
  "Denim Jeans",
  "Twill / Chino Pants",
  "Outerwear / Jacket",
  "Sweater / Knitwear / Hoodie",
  "Activewear / Sportswear",
  "Innerwear / Undergarments",
  "Kids & Infant Wear",
  "Dress / Skirt / Ladies Wear",
  "Uniform / Workwear",
  "Sleepwear / Pajama Set",
  "Swimwear",
  "Accessories / Caps / Socks",
];

const SAMPLE_TYPES = [
  "Proto Sample",
  "Fit Sample / Size Set",
  "Salesman Sample (SMS)",
  "Pre-Production Sample (PPS)",
  "Top of Production (TOP)",
  "Counter Development Sample",
  "Photo Shoot Sample",
  "Gold Seal Sample",
];

export default function BuyerOrdersPage() {
  const { canCreateOrders, canEditOrders, canDeleteOrders, canCreateBom } = useGarmentsPermission();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("");
  const [orderTypeTab, setOrderTypeTab] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [currentOrderType, setCurrentOrderType] = useState<"BULK" | "SAMPLE">("BULK");

  // Dynamic Item Category state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [form] = Form.useForm();

  const { data: res, isLoading, refetch } = useGetGarmentsOrdersQuery({
    page,
    limit,
    searchTerm,
    orderType: orderTypeTab !== "ALL" ? orderTypeTab : undefined,
  });

  const [createOrder, { isLoading: isCreating }] = useCreateGarmentsOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateGarmentsOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteGarmentsOrderMutation();

  const orders = res?.data || [];
  const meta = res?.meta || { total: 0 };

  // Sync any unique categories from existing orders into the category list
  useEffect(() => {
    if (orders && orders.length > 0) {
      const existingInOrders = orders
        .map((o: any) => o.itemType)
        .filter((t: any) => t && typeof t === "string");

      setCategories((prev) => {
        const combined = Array.from(new Set([...prev, ...existingInOrders]));
        return combined;
      });
    }
  }, [orders]);

  const handleAddCategory = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      form.setFieldsValue({ itemType: trimmed });
      setNewCategoryName("");
      message.info(`Category "${trimmed}" is already in the list`);
      return;
    }

    setCategories((prev) => [...prev, trimmed]);
    form.setFieldsValue({ itemType: trimmed });
    setNewCategoryName("");
    message.success(`New Category "${trimmed}" added!`);
  };

  const handleOpenModal = (order: any = null) => {
    setEditingOrder(order);
    if (order) {
      const type = order.orderType || "BULK";
      setCurrentOrderType(type);
      if (order.itemType && !categories.includes(order.itemType)) {
        setCategories((prev) => [...prev, order.itemType]);
      }
      form.setFieldsValue({
        orderType: type,
        buyerName: order.buyerName,
        styleName: order.styleName,
        itemType: order.itemType,
        season: order.season,
        orderQuantity: order.orderQuantity,
        unitPrice: order.unitPrice,
        currency: order.currency || "USD",
        deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : null,
        status: order.status,
        remarks: order.remarks,
        // Sample fields
        sampleType: order.sampleType || "Proto Sample",
        sampleStatus: order.sampleStatus || "pending",
        sampleSize: order.sampleSize || "M",
        sampleDeadline: order.sampleDeadline ? dayjs(order.sampleDeadline) : null,
        techPackRef: order.techPackRef,
        buyerFeedback: order.buyerFeedback,
      });
    } else {
      form.resetFields();
      setCurrentOrderType("BULK");
      form.setFieldsValue({
        orderType: "BULK",
        currency: "USD",
        status: "pending",
        orderQuantity: 1000,
        unitPrice: 5.0,
        itemType: categories[0] || "T-Shirt / Polo",
        sampleType: "Proto Sample",
        sampleStatus: "pending",
        sampleSize: "M",
      });
    }
    setNewCategoryName("");
    setIsModalOpen(true);
  };

  const handleOrderTypeChange = (val: "BULK" | "SAMPLE") => {
    setCurrentOrderType(val);
    if (val === "SAMPLE") {
      if (!form.getFieldValue("orderQuantity") || form.getFieldValue("orderQuantity") > 50) {
        form.setFieldsValue({ orderQuantity: 2, unitPrice: 25.0 });
      }
    } else {
      if (form.getFieldValue("orderQuantity") <= 50) {
        form.setFieldsValue({ orderQuantity: 1000, unitPrice: 5.0 });
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        orderType: currentOrderType,
        deliveryDate: values.deliveryDate ? values.deliveryDate.toISOString() : null,
        sampleDeadline: values.sampleDeadline ? values.sampleDeadline.toISOString() : null,
      };

      if (editingOrder) {
        await updateOrder({ id: editingOrder.id, data: payload }).unwrap();
        message.success(
          currentOrderType === "SAMPLE"
            ? "Sample development request updated"
            : "Buyer order updated successfully"
        );
      } else {
        await createOrder(payload).unwrap();
        message.success(
          currentOrderType === "SAMPLE"
            ? "Sample development request created with SMP code"
            : "Buyer order created successfully"
        );
      }
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save order");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id).unwrap();
      message.success("Order deleted");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete order");
    }
  };

  // Filter orders by category locally if selected
  const displayedOrders = useMemo(() => {
    if (!selectedCategoryFilter) return orders;
    return orders.filter((o: any) => o.itemType === selectedCategoryFilter);
  }, [orders, selectedCategoryFilter]);

  const columns = [
    {
      title: "Order #",
      key: "orderNo",
      render: (_: any, record: any) => {
        const isSample = record.orderType === "SAMPLE";
        return (
          <div>
            <span className={`font-bold ${isSample ? "text-purple-600" : "text-blue-600"}`}>
              {record.orderNo || record.orderNumber || "-"}
            </span>
            <div className="mt-0.5">
              {isSample ? (
                <Tag color="purple" className="text-xs font-semibold">
                  <ExperimentOutlined className="mr-1" />
                  {record.sampleType || "SAMPLE"}
                </Tag>
              ) : (
                <Tag color="blue" className="text-xs font-semibold">
                  <ShoppingOutlined className="mr-1" />
                  BULK
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      key: "buyerName",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Style & Category",
      key: "style",
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{record.styleName}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <Tag color="cyan" className="text-xs">{record.itemType || "Apparel"}</Tag>
            <span className="text-xs text-gray-400">• {record.season || "General"}</span>
          </div>
          {record.orderType === "SAMPLE" && record.sampleSize && (
            <div className="text-xs text-purple-700 mt-0.5">Size: {record.sampleSize}</div>
          )}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "orderQuantity",
      key: "orderQuantity",
      render: (qty: number, r: any) => (
        <span className="font-semibold">
          {Number(qty || 0).toLocaleString()} {r.orderType === "SAMPLE" ? "sample pcs" : "pcs"}
        </span>
      ),
    },
    {
      title: "Unit Price / FOB",
      key: "price",
      render: (_: any, record: any) => (
        <span>{record.currency || "USD"} {Number(record.unitPrice || 0).toFixed(2)}</span>
      ),
    },
    {
      title: "Delivery / Deadline",
      key: "deliveryDate",
      render: (_: any, record: any) => {
        const date = record.orderType === "SAMPLE" ? (record.sampleDeadline || record.deliveryDate) : record.deliveryDate;
        return date ? (
          <div>
            <div className="font-medium">{dayjs(date).format("YYYY-MM-DD")}</div>
            {record.orderType === "SAMPLE" && <span className="text-xs text-purple-600 font-semibold">Sample Dispatch</span>}
          </div>
        ) : "-";
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: any) => {
        if (record.orderType === "SAMPLE" && record.sampleStatus) {
          let sColor = "default";
          const st = record.sampleStatus;
          if (st === "approved") sColor = "success";
          if (st === "in_sample_room" || st === "pattern_making") sColor = "processing";
          if (st === "dispatched") sColor = "cyan";
          if (st === "revision_needed") sColor = "warning";
          if (st === "rejected") sColor = "error";
          return (
            <div>
              <Tag color={sColor} className="uppercase font-medium text-xs">
                {st.replace(/_/g, " ")}
              </Tag>
            </div>
          );
        }

        const status = record.status || "pending";
        let color = "default";
        if (status === "running") color = "processing";
        if (status === "completed") color = "success";
        if (status === "pending") color = "warning";
        if (status === "cancelled") color = "error";
        return <Tag color={color} className="uppercase font-medium">{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          {canCreateBom && (
            <Tooltip title="Create / View BOM">
              <Link href={`/garments/bom?orderId=${record.id}`}>
                <Button size="small" type="primary" ghost icon={<FileDoneOutlined />}>
                  BOM
                </Button>
              </Link>
            </Tooltip>
          )}
          {canEditOrders && (
            <Tooltip title="Edit Order / Sample">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenModal(record)}
              />
            </Tooltip>
          )}
          {canDeleteOrders && (
            <Popconfirm
              title="Are you sure you want to delete this order/sample?"
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
      <GbHeader title="Garments / Buyer Orders & Sample Development" />

      <Card className="shadow-sm">
        {/* Order Type Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b pb-3">
          <Radio.Group
            value={orderTypeTab}
            onChange={(e) => setOrderTypeTab(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">All Contracts</Radio.Button>
            <Radio.Button value="BULK">
              <ShoppingOutlined className="mr-1" /> Bulk Production Orders
            </Radio.Button>
            <Radio.Button value="SAMPLE">
              <ExperimentOutlined className="mr-1" /> Sample Development Requests
            </Radio.Button>
          </Radio.Group>

          {canCreateOrders && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              className="bg-blue-600"
            >
              Create Order / Sample
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="Search by buyer, order # or style..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => refetch()}
              className="w-full md:w-72"
              allowClear
            />

            <Select
              placeholder="Filter by Category"
              value={selectedCategoryFilter || undefined}
              onChange={(val) => setSelectedCategoryFilter(val || "")}
              allowClear
              className="w-full md:w-56"
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>

            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>
        </div>

        <Table
          dataSource={displayedOrders}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: selectedCategoryFilter ? displayedOrders.length : meta.total,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* Modal for Create/Edit */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span>{editingOrder ? "Edit Order / Sample" : "New Contract / Request"}</span>
            <Tag color={currentOrderType === "SAMPLE" ? "purple" : "blue"}>
              {currentOrderType === "SAMPLE" ? "Sample Development" : "Bulk Production"}
            </Tag>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Order Mode Switcher */}
          <div className="bg-gray-50 p-3 rounded-lg border mb-4">
            <Form.Item label="Contract Type" className="mb-0">
              <Radio.Group
                value={currentOrderType}
                onChange={(e) => handleOrderTypeChange(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="BULK">
                  <ShoppingOutlined className="mr-1" /> Commercial Bulk Order (1,000s pcs)
                </Radio.Button>
                <Radio.Button value="SAMPLE">
                  <ExperimentOutlined className="mr-1 text-purple-300" /> Sample Development / Proto / Fit (1 - 20 pcs)
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="buyerName"
              label="Buyer / Brand Name"
              rules={[{ required: true, message: "Please enter buyer name" }]}
            >
              <Input placeholder="e.g. H&M, Zara, Target, Calvin Klein" />
            </Form.Item>

            <Form.Item
              name="styleName"
              label="Style Name / Design Ref #"
              rules={[{ required: true, message: "Please enter style name" }]}
            >
              <Input placeholder="e.g. Mens Washed Slim Denim Jacket" />
            </Form.Item>

            {/* Dynamic Item Category with Inline Category Creation */}
            <Form.Item
              name="itemType"
              label={
                <span className="flex items-center gap-1">
                  <TagOutlined /> Item Category (Apparel Type)
                </span>
              }
              rules={[{ required: true, message: "Please select or create item category" }]}
            >
              <Select
                placeholder="Select or create a new category"
                showSearch
                allowClear
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <div className="p-2 flex gap-2">
                      <Input
                        placeholder="Type new category (e.g. Tank Top, Romper)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") {
                            handleAddCategory(e);
                          }
                        }}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCategory}
                        className="bg-blue-600 shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
                options={categories.map((cat) => ({
                  label: cat,
                  value: cat,
                }))}
              />
            </Form.Item>

            <Form.Item name="season" label="Season / Collection">
              <Input placeholder="e.g. Summer 2026 / SS26" />
            </Form.Item>

            {/* If SAMPLE MODE: Show specialized Sample fields */}
            {currentOrderType === "SAMPLE" ? (
              <>
                <Form.Item
                  name="sampleType"
                  label="Sample Stage / Type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select sample type">
                    {SAMPLE_TYPES.map((st) => (
                      <Option key={st} value={st}>
                        {st}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="sampleStatus"
                  label="Sampling Workflow Stage"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="pending">Pending Pattern & Tech Pack</Option>
                    <Option value="pattern_making">Pattern Making (CAD)</Option>
                    <Option value="in_sample_room">In Sample Room / Sewing</Option>
                    <Option value="measurement_qc">Measurement / Sample QC Check</Option>
                    <Option value="dispatched">Dispatched to Buyer</Option>
                    <Option value="approved">Approved by Buyer (Ready for Bulk)</Option>
                    <Option value="revision_needed">Revision Needed (Comments Received)</Option>
                    <Option value="rejected">Rejected by Buyer</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="sampleSize" label="Sample Size(s)">
                  <Input placeholder="e.g. M, or S, M, L (Size Set)" />
                </Form.Item>

                <Form.Item name="sampleDeadline" label="Sample Target Dispatch Date">
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  name="orderQuantity"
                  label="Sample Quantity (Pcs)"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={100} className="w-full" />
                </Form.Item>

                <Form.Item
                  name="unitPrice"
                  label="Sample Development Cost / Charge"
                >
                  <InputNumber min={0} step={0.5} className="w-full" />
                </Form.Item>

                <Form.Item name="techPackRef" label="Tech Pack Ref / Pattern File" className="md:col-span-2">
                  <Input placeholder="e.g. TP-2026-DK-01 / CAD Pattern v2" />
                </Form.Item>

                <Form.Item name="buyerFeedback" label="Buyer Fit Comments & Revisions" className="md:col-span-2">
                  <Input.TextArea rows={2} placeholder="Add fit comments, neck drop adjustment, body length changes from buyer..." />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="orderQuantity"
                  label="Bulk Order Quantity (Pcs)"
                  rules={[{ required: true, message: "Please enter quantity" }]}
                >
                  <InputNumber min={1} className="w-full" />
                </Form.Item>

                <Form.Item
                  name="unitPrice"
                  label="FOB Unit Price ($)"
                  rules={[{ required: true, message: "Please enter price" }]}
                >
                  <InputNumber min={0.01} step={0.01} className="w-full" />
                </Form.Item>

                <Form.Item name="currency" label="Currency">
                  <Select>
                    <Option value="USD">USD ($)</Option>
                    <Option value="EUR">EUR (€)</Option>
                    <Option value="GBP">GBP (£)</Option>
                    <Option value="BDT">BDT (৳)</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="deliveryDate" label="Target Ex-Factory Date">
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item name="status" label="Bulk Production Status">
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="running">Running / In Production</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </Form.Item>
              </>
            )}
          </div>

          <Form.Item name="remarks" label="General Remarks / Washing Instructions">
            <Input.TextArea rows={2} placeholder="Special stitching, washing recipe, packaging, or courier tracking info..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              className={currentOrderType === "SAMPLE" ? "bg-purple-600" : "bg-blue-600"}
            >
              {currentOrderType === "SAMPLE" ? "Save Sample Request" : "Save Bulk Order"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
