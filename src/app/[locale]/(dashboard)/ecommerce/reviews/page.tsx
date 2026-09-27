"use client";
import React, { useState } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Card,
  Rate,
  Avatar,
  Image,
  Tabs,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

export default function ReviewsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [form] = Form.useForm();

  const { data: reviewsRes, isLoading } = useGetEcommerceResourceQuery({ resource: "reviews" });
  const [createReview, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deleteReview] = useDeleteEcommerceResourceMutation();

  const reviews: any[] = reviewsRes?.data || [];

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : "5.0";
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        photos: record.photos?.join("\n") || "",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        rating: 5,
        status: "approved",
        isVerifiedPurchase: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        photos: values.photos
          ? values.photos
              .split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      };
      if (editingItem) {
        await updateReview({ resource: "reviews", id: editingItem.id, data: payload }).unwrap();
        message.success("Review updated successfully!");
      } else {
        await createReview({ resource: "reviews", data: payload }).unwrap();
        message.success("Review created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateReview({ resource: "reviews", id, data: { status } }).unwrap();
      message.success(`Review status changed to ${status}`);
    } catch (err: any) {
      message.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview({ resource: "reviews", id }).unwrap();
      message.success("Review deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete review");
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_: any, r: any) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-slate-700 text-white shrink-0" />
          <div>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              {r.customerName}
              {r.isVerifiedPurchase && (
                <Tag color="green" className="text-[10px] px-1 py-0 border-0">
                  Verified
                </Tag>
              )}
            </div>
            <div className="text-xs text-slate-400">{r.customerEmail || "No email"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (name: string) => <span className="font-medium text-slate-700">{name}</span>,
    },
    {
      title: "Rating & Feedback",
      key: "rating",
      render: (_: any, r: any) => (
        <div className="max-w-md space-y-1">
          <div className="flex items-center gap-1">
            <Rate disabled defaultValue={r.rating} className="text-amber-500 text-xs" />
            <span className="font-bold text-xs text-slate-700">({r.rating}/5)</span>
          </div>
          {r.reviewTitle && <div className="font-semibold text-xs text-slate-900">{r.reviewTitle}</div>}
          <div className="text-xs text-slate-600 line-clamp-2">{r.comment}</div>
          {r.photos && r.photos.length > 0 && (
            <div className="flex gap-1.5 pt-1">
              {r.photos.map((url: string, idx: number) => (
                <Image
                  key={idx}
                  src={url}
                  alt="Review photo"
                  width={36}
                  height={36}
                  className="rounded object-cover border border-slate-200"
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "approved" ? "success" : status === "pending" ? "warning" : "error";
        return (
          <Tag color={color} className="uppercase font-semibold text-[11px]">
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Quick Action",
      key: "action",
      render: (_: any, r: any) => (
        <Space>
          {r.status !== "approved" && (
            <Button
              size="small"
              icon={<CheckCircleOutlined />}
              className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
              onClick={() => handleStatusChange(r.id, "approved")}
            >
              Approve
            </Button>
          )}
          {r.status !== "rejected" && (
            <Button
              size="small"
              icon={<CloseCircleOutlined />}
              className="text-rose-600 border-rose-300 hover:bg-rose-50"
              onClick={() => handleStatusChange(r.id, "rejected")}
            >
              Reject
            </Button>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(r)} />
          <Popconfirm title="Delete review?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Customer Reviews & Social Proof" />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Average Store Rating</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-900">{avgRating}</span>
            <Rate disabled allowHalf defaultValue={Number(avgRating)} className="text-amber-500 text-sm" />
          </div>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Total Reviews</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{reviews.length}</div>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Approved & Visible</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{approvedCount}</div>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Awaiting Moderation</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</div>
        </Card>
      </div>

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="-mb-3"
            items={[
              { label: `All Reviews (${reviews.length})`, key: "all" },
              { label: `Pending (${pendingCount})`, key: "pending" },
              { label: `Approved (${approvedCount})`, key: "approved" },
              { label: "Rejected", key: "rejected" },
            ]}
          />
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Add Review
          </Button>
        }
      >
        <Table
          dataSource={filteredReviews}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Customer Review" : "Add New Customer Review"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Ayesha Siddiqa" />
            </Form.Item>
            <Form.Item name="customerEmail" label="Customer Email">
              <Input placeholder="ayesha@example.com" />
            </Form.Item>
          </div>

          <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Royal Silk Embroidered Abaya" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="rating" label="Star Rating" rules={[{ required: true }]}>
              <Rate className="text-amber-500" />
            </Form.Item>
            <Form.Item name="status" label="Moderation Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Approved (Public)", value: "approved" },
                  { label: "Pending (Under Review)", value: "pending" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="reviewTitle" label="Review Title / Headline">
            <Input placeholder="e.g. Outstanding quality & luxurious fabric!" />
          </Form.Item>

          <Form.Item name="comment" label="Review Content" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Write detailed customer feedback..." />
          </Form.Item>

          <Form.Item
            name="photos"
            label="Customer Photo URLs (1 URL per line)"
            extra="Optional image proof uploaded by buyer"
          >
            <Input.TextArea rows={2} placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item name="isVerifiedPurchase" valuePropName="checked">
            <Switch checkedChildren="Verified Buyer Badge" unCheckedChildren="Standard Review" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
