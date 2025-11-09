/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Row, Col, Space } from "antd";
import { PlusOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import GbTable from "@/components/GbTable";
import axios from "axios";
import GbModal from "@/components/ui/GbModal";
import { getBaseUrl } from "@/helpers/config/envConfig";

const OrganizationPage = () => {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // ✅ Fetch organization list
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${getBaseUrl()}/organization?page=${page}&limit=${size}`);
      setOrganizations(data);
    } catch (error: any) {
      message.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page,size]);

  // ✅ Handle create organization
  const handleCreate = async (values: any) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/organization", values);
      message.success("Organization created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchOrganizations();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Creation failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle add user
  const handleAddUser = async (values: any) => {
    if (!selectedOrgId) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/users", values, {
        headers: { "x-organization-id": selectedOrgId },
      });
      message.success("User added successfully!");
      setIsUserModalOpen(false);
      userForm.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to add user!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch users for organization
  const fetchUsersByOrganization = async (orgId: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${getBaseUrl()}/user`, {
        headers: { "x-organization-id": orgId },
      });
      setUsers(data?.data || []);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Table columns for organizations
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      render: (logo: string) => (
        <img
          src={logo}
          alt="Logo"
          style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    { title: "Address", dataIndex: "address", align: "right" },
    {
      title: "Actions",
      align: "right",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<UserOutlined />}
            onClick={() => {
              setSelectedOrgId(record.id);
              setIsUserModalOpen(true);
            }}
          >
            Add User
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrgId(record.id);
              setIsViewUserModalOpen(true);
              fetchUsersByOrganization(record.id);
            }}
          >
            View Users
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Columns for users inside the modal
  const userColumns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Role", dataIndex: "role" },
    { title: "Address", dataIndex: "address" },
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
      {/* Header row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Organizations</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Create Organization
        </Button>
      </Row>

      {/* Table */}
      <GbTable
        loading={loading}
        columns={columns}
        totalPages={organizations?.total}
        dataSource={organizations?.data}
        showPagination={true}
        onPaginationChange={onPaginationChange}
      />

      {/* Create Organization Modal */}
      <GbModal
        isModalOpen={isModalOpen}
        openModal={() => setIsModalOpen(true)}
        closeModal={() => setIsModalOpen(false)}
        width="600px"
        centered
      >
        <h3>Create Organization</h3>
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Logo URL" name="logo" rules={[{ required: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
          </div>
        </Form>
      </GbModal>

      {/* Add User Modal */}
      <GbModal
        isModalOpen={isUserModalOpen}
        openModal={() => setIsUserModalOpen(true)}
        closeModal={() => setIsUserModalOpen(false)}
        width="600px"
        centered
      >
        <h3>Add User</h3>
        <Form layout="vertical" form={userForm} onFinish={handleAddUser}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                <Input placeholder="admin / staff / etc" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setIsUserModalOpen(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add User
            </Button>
          </div>
        </Form>
      </GbModal>

      {/* View Users Modal */}
      <GbModal
        isModalOpen={isViewUserModalOpen}
        openModal={() => setIsViewUserModalOpen(true)}
        closeModal={() => setIsViewUserModalOpen(false)}
        width="800px"
        centered
      >
        <h3>Organization Users</h3>
        <GbTable
          loading={loading}
          columns={userColumns}
          dataSource={users}
          showPagination={false}
          
        />
      </GbModal>
    </div>
  );
};

export default OrganizationPage;
