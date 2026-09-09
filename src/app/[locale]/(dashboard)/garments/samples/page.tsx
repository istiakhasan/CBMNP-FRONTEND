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
  DatePicker,
  Tag,
  Space,
  Card,
  Popconfirm,
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Steps,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  SendOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  RocketOutlined,
  ArrowRightOutlined,
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

export default function SampleDevelopmentPage() {
  const { canCreateOrders, canEditOrders, canDeleteOrders, canApproveSamples } = useGarmentsPermission();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sampleTypeFilter, setSampleTypeFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);

  const [form] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const [bulkForm] = Form.useForm();

  // Load only sample development records (orderType: SAMPLE)
  const { data: res, isLoading, refetch } = useGetGarmentsOrdersQuery({
    page,
    limit,
    searchTerm,
    orderType: "SAMPLE",
  });

  const [createOrder, { isLoading: isCreating }] = useCreateGarmentsOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateGarmentsOrderMutation();
  const [deleteOrder] = useDeleteGarmentsOrderMutation();

  const samples = res?.data || [];
  const meta = res?.meta || { total: 0 };

  const pendingCount = samples.filter((s: any) => s.sampleStatus === "pending" || s.sampleStatus === "pattern_making").length;
  const inRoomCount = samples.filter((s: any) => s.sampleStatus === "in_sample_room" || s.sampleStatus === "measurement_qc").length;
  const approvedCount = samples.filter((s: any) => s.sampleStatus === "approved").length;

  const handleOpenModal = (sample: any = null) => {
    setSelectedSample(sample);
    if (sample) {
      form.setFieldsValue({
        buyerName: sample.buyerName,
        styleName: sample.styleName,
        itemType: sample.itemType || "T-Shirt / Polo",
        season: sample.season,
        sampleType: sample.sampleType || "Proto Sample",
        sampleStatus: sample.sampleStatus || "pending",
        sampleSize: sample.sampleSize || "M",
        orderQuantity: sample.orderQuantity || 2,
        unitPrice: sample.unitPrice || 25,
        currency: sample.currency || "USD",
        sampleDeadline: sample.sampleDeadline ? dayjs(sample.sampleDeadline) : null,
        techPackRef: sample.techPackRef,
        buyerFeedback: sample.buyerFeedback,
        remarks: sample.remarks,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        itemType: "T-Shirt / Polo",
        sampleType: "Proto Sample",
        sampleStatus: "pending",
        sampleSize: "M",
        orderQuantity: 2,
        unitPrice: 25.0,
        currency: "USD",
        sampleDeadline: dayjs().add(7, "day"),
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenFeedback = (sample: any) => {
    setSelectedSample(sample);
    feedbackForm.resetFields();
    feedbackForm.setFieldsValue({
      sampleStatus: sample.sampleStatus || "approved",
      buyerFeedback: sample.buyerFeedback || "",
    });
    setIsFeedbackModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        orderType: "SAMPLE",
        sampleDeadline: values.sampleDeadline ? values.sampleDeadline.toISOString() : null,
      };

      if (selectedSample) {
        await updateOrder({ id: selectedSample.id, data: payload }).unwrap();
        message.success("Sample development request updated");
      } else {
        await createOrder(payload).unwrap();
        message.success("Sample development request created with SMP code");
      }
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save sample");
    }
  };

  const handleFeedbackSubmit = async (values: any) => {
    try {
      await updateOrder({
        id: selectedSample.id,
        data: {
          sampleStatus: values.sampleStatus,
          buyerFeedback: values.buyerFeedback,
        },
      }).unwrap();
      message.success("Buyer fit feedback & stage updated successfully");
      setIsFeedbackModalOpen(false);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save feedback");
    }
  };

  const handleOpenBulkModal = (sample: any) => {
    setSelectedSample(sample);
    bulkForm.resetFields();
    bulkForm.setFieldsValue({
      buyerName: sample.buyerName,
      styleName: sample.styleName,
      itemType: sample.itemType || "T-Shirt / Polo",
      season: sample.season || "Summer 2026",
      currency: sample.currency || "USD",
      orderQuantity: 5000,
      unitPrice: 4.5,
      deliveryDate: dayjs().add(45, "day"),
      remarks: `Converted from Approved Sample ${sample.orderNo || ""}. Fit comments: ${sample.buyerFeedback || "Approved"}`,
    });
    setIsBulkModalOpen(true);
  };

  const handleBulkSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        orderType: "BULK",
        deliveryDate: values.deliveryDate ? values.deliveryDate.toISOString() : null,
      };

      await createOrder(payload).unwrap();
      message.success("Bulk Commercial Order created successfully with ORD prefix!");
      setIsBulkModalOpen(false);
      bulkForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create bulk order");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id).unwrap();
      message.success("Sample request deleted");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      title: "Sample #",
      key: "orderNo",
      render: (_: any, record: any) => (
        <div>
          <span className="font-bold text-purple-600">
            {record.orderNo || record.orderNumber || "-"}
          </span>
          <div className="mt-0.5">
            <Tag color="purple" className="text-xs font-semibold">
              <ExperimentOutlined className="mr-1" />
              {record.sampleType || "SAMPLE"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Buyer & Brand",
      dataIndex: "buyerName",
      key: "buyerName",
      render: (text: string) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: "Style & Category",
      key: "style",
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold text-gray-900">{record.styleName}</div>
          <div className="text-xs text-gray-500">
            {record.itemType || "Apparel"} • {record.season || "General"}
          </div>
          {record.sampleSize && (
            <div className="text-xs text-purple-700 font-medium mt-0.5">
              Size: {record.sampleSize} ({record.orderQuantity} pcs)
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tech Pack / Pattern",
      dataIndex: "techPackRef",
      key: "techPackRef",
      render: (t: string) => (t ? <Tag color="blue">{t}</Tag> : <span className="text-xs text-gray-400">Not specified</span>),
    },
    {
      title: "Target Dispatch Date",
      key: "deadline",
      render: (_: any, record: any) => {
        const d = record.sampleDeadline || record.deliveryDate;
        return d ? (
          <div>
            <div className="font-semibold text-gray-800">{dayjs(d).format("DD MMM, YYYY")}</div>
            <span className="text-xs text-purple-600 font-medium">
              {dayjs(d).diff(dayjs(), "day")} days left
            </span>
          </div>
        ) : "-";
      },
    },
    {
      title: "Development Stage",
      key: "status",
      render: (_: any, record: any) => {
        const st = record.sampleStatus || "pending";
        let color = "default";
        if (st === "approved") color = "success";
        if (st === "in_sample_room" || st === "pattern_making") color = "processing";
        if (st === "dispatched") color = "cyan";
        if (st === "revision_needed") color = "warning";
        if (st === "rejected") color = "error";

        return (
          <div>
            <Tag color={color} className="uppercase font-semibold text-xs">
              {st.replace(/_/g, " ")}
            </Tag>
            {record.buyerFeedback && (
              <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                "{record.buyerFeedback}"
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          {record.sampleStatus === "approved" && canApproveSamples && (
            <Tooltip title="Create Bulk Commercial Order from this Approved Sample">
              <Button
                size="small"
                type="primary"
                icon={<ShoppingOutlined />}
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleOpenBulkModal(record)}
              >
                Convert to Bulk
              </Button>
            </Tooltip>
          )}

          {canApproveSamples && (
            <Tooltip title="Update Buyer Fit Feedback & Stage">
              <Button
                size="small"
                type="primary"
                ghost
                icon={<CheckCircleOutlined />}
                onClick={() => handleOpenFeedback(record)}
              >
                Fit Feedback
              </Button>
            </Tooltip>
          )}

          {canEditOrders && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          )}

          {canDeleteOrders && (
            <Popconfirm
              title="Delete this sample request?"
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
      <GbHeader title="Garments / Sample Development & Proto Tracking" />

      {/* 5-Step Workflow Visual Guide */}
      <Card className="shadow-sm border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-indigo-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <ExperimentOutlined className="text-purple-600" />
              Standard Garments Sample Approval Pipeline
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Follow this 5-step standard flow to take buyer fit approval and convert proto to bulk order.
            </p>
          </div>
        </div>

        <Steps
          size="small"
          current={2}
          items={[
            {
              title: "1. Sample Request",
              description: "Proto / Fit / SMS spec",
            },
            {
              title: "2. Sample Room Make",
              description: "Pattern & sewing",
            },
            {
              title: "3. QC & Measurement",
              description: "Spec audit check",
            },
            {
              title: "4. Buyer Fit Comments",
              description: "Revise or Approved",
            },
            {
              title: "5. Convert to Bulk",
              description: "Bulk order & BOM",
            },
          ]}
        />
      </Card>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-l-4 border-l-amber-500">
            <Statistic
              title="Pending Pattern / Initial"
              value={pendingCount}
              prefix={<FileTextOutlined className="text-amber-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-l-4 border-l-purple-500">
            <Statistic
              title="Active in Sample Room / Sewing"
              value={inRoomCount}
              prefix={<ExperimentOutlined className="text-purple-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm border-l-4 border-l-green-500">
            <Statistic
              title="Buyer Approved (Ready for Bulk)"
              value={approvedCount}
              prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="Search sample #, buyer or style..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => refetch()}
              className="w-full md:w-72"
              allowClear
            />

            <Select
              placeholder="All Sample Types"
              value={sampleTypeFilter || undefined}
              onChange={(val) => setSampleTypeFilter(val || "")}
              allowClear
              className="w-full md:w-56"
            >
              {SAMPLE_TYPES.map((st) => (
                <Option key={st} value={st}>
                  {st}
                </Option>
              ))}
            </Select>

            <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading} />
          </div>

          {canCreateOrders && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              className="bg-purple-600"
            >
              New Sample Request
            </Button>
          )}
        </div>

        <Table
          dataSource={samples}
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

      {/* Create / Edit Sample Modal */}
      <Modal
        title={selectedSample ? "Edit Sample Development Request" : "New Garments Sample Development Request"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={750}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="buyerName"
              label="Buyer / Brand Name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="e.g. H&M, Zara, Target, Calvin Klein" />
            </Form.Item>

            <Form.Item
              name="styleName"
              label="Style Name / Design Code"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="e.g. Mens Washed Slim Denim Jacket" />
            </Form.Item>

            <Form.Item name="itemType" label="Item Category">
              <Select placeholder="Select category">
                <Option value="T-Shirt / Polo">T-Shirt / Polo</Option>
                <Option value="Woven Shirt">Woven Shirt</Option>
                <Option value="Denim Jeans">Denim Jeans</Option>
                <Option value="Outerwear / Jacket">Outerwear / Jacket</Option>
                <Option value="Sweater / Hoodie">Sweater / Hoodie</Option>
                <Option value="Activewear / Sportswear">Activewear / Sportswear</Option>
                <Option value="Other Apparel">Other Apparel</Option>
              </Select>
            </Form.Item>

            <Form.Item name="season" label="Season">
              <Input placeholder="e.g. Summer 2026 / SS26" />
            </Form.Item>

            <Form.Item
              name="sampleType"
              label="Sample Stage / Type"
              rules={[{ required: true }]}
            >
              <Select>
                {SAMPLE_TYPES.map((st) => (
                  <Option key={st} value={st}>
                    {st}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="sampleStatus"
              label="Sample Workflow Stage"
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

            <Form.Item name="unitPrice" label="Sample Development Cost ($)">
              <InputNumber min={0} step={0.5} className="w-full" />
            </Form.Item>

            <Form.Item name="techPackRef" label="Tech Pack / Pattern Reference" className="md:col-span-2">
              <Input placeholder="e.g. TP-2026-DK-01 / CAD Pattern v2" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Sample Room Special Instructions">
            <Input.TextArea rows={2} placeholder="Add specific stitch density, thread shade, wash formula, or pocket placement notes..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating} className="bg-purple-600">
              Save Sample Request
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Buyer Feedback / Stage Modal */}
      <Modal
        title={`Buyer Fit Feedback & Approval - ${selectedSample?.orderNo || ""}`}
        open={isFeedbackModalOpen}
        onCancel={() => setIsFeedbackModalOpen(false)}
        footer={null}
        width={550}
      >
        <Form form={feedbackForm} layout="vertical" onFinish={handleFeedbackSubmit}>
          <Form.Item
            name="sampleStatus"
            label="Updated Workflow Stage"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="pattern_making">Pattern Making (CAD)</Option>
              <Option value="in_sample_room">In Sample Room / Sewing</Option>
              <Option value="measurement_qc">Measurement / Sample QC Check</Option>
              <Option value="dispatched">Dispatched to Buyer</Option>
              <Option value="approved">Approved by Buyer (Ready for Bulk Order)</Option>
              <Option value="revision_needed">Revision Needed (Comments Received)</Option>
              <Option value="rejected">Rejected by Buyer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="buyerFeedback"
            label="Buyer Fit Comments & Revisions"
            rules={[{ required: true, message: "Please enter feedback or notes" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="e.g. Fit sample approved with 1cm sleeve extension. Ready for PPS sample..."
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsFeedbackModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-green-600" icon={<CheckCircleOutlined />}>
              Save Fit Feedback
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Convert to Bulk Order Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-emerald-800">
            <ShoppingOutlined className="text-emerald-600 text-lg" />
            <span>Convert Approved Sample to Bulk Commercial Order</span>
          </div>
        }
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        footer={null}
        width={650}
      >
        <Alert
          type="success"
          showIcon
          message="1-Click Bulk Conversion"
          description={`Converting Sample ${selectedSample?.orderNo || ""} (${selectedSample?.styleName || ""}) into a full commercial production contract with ORD prefix.`}
          className="mb-4"
        />

        <Form form={bulkForm} layout="vertical" onFinish={handleBulkSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="buyerName"
              label="Buyer / Brand Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. H&M Global Sourcing" />
            </Form.Item>

            <Form.Item
              name="styleName"
              label="Style Name / Article"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. HM-POLO-2026" />
            </Form.Item>

            <Form.Item
              name="itemType"
              label="Garment Category"
              rules={[{ required: true }]}
            >
              <Select>
                {SAMPLE_TYPES.map((t) => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
                <Option value="T-Shirt / Polo">T-Shirt / Polo</Option>
                <Option value="Denim Jeans">Denim Jeans</Option>
                <Option value="Woven Shirt">Woven Shirt</Option>
                <Option value="Twill / Chino Pants">Twill / Chino Pants</Option>
                <Option value="Outerwear / Jacket">Outerwear / Jacket</Option>
                <Option value="Sweater / Knitwear / Hoodie">Sweater / Knitwear / Hoodie</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="season"
              label="Production Season"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Summer 2026" />
            </Form.Item>

            <Form.Item
              name="orderQuantity"
              label="Bulk Order Quantity (Pcs)"
              rules={[{ required: true }]}
            >
              <InputNumber min={10} max={1000000} className="w-full font-bold text-blue-600" />
            </Form.Item>

            <Form.Item
              name="unitPrice"
              label="Unit FOB Price ($)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0.1} step={0.05} className="w-full font-bold text-green-600" />
            </Form.Item>

            <Form.Item
              name="deliveryDate"
              label="Commercial Delivery Deadline"
              rules={[{ required: true }]}
              className="md:col-span-2"
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Production Notes & Tech Pack Summary">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700"
              icon={<RocketOutlined />}
            >
              Create Bulk Commercial Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
