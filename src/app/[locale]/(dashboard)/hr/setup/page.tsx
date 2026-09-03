"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  useCreateDepartmentMutation,
  useCreateDesignationMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useGetEmployeesQuery,
  useSetSalaryStructureMutation,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

type ModalType = "department" | "designation" | "salary";

export default function HrSetupPage() {
  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const { data: deptsData, isLoading: deptsLoading, refetch: refetchDepartments } = useGetDepartmentsQuery(undefined);
  const { data: desigsData, isLoading: desigsLoading, refetch: refetchDesignations } = useGetDesignationsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const [createDepartment, { isLoading: creatingDepartment }] = useCreateDepartmentMutation();
  const [createDesignation, { isLoading: creatingDesignation }] = useCreateDesignationMutation();
  const [setSalaryStructure, { isLoading: savingSalary }] = useSetSalaryStructureMutation();

  const departments = deptsData?.data || [];
  const designations = desigsData?.data || [];
  const employees = employeesData?.data || [];

  const openModal = (type: ModalType) => {
    setModalType(type);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      basicSalary: 0,
      houseRentAllowance: 0,
      medicalAllowance: 0,
      conveyanceAllowance: 0,
      taxDeduction: 0,
      providentFundDeduction: 0,
    });
  };

  const handleFinish = async (values: any) => {
    try {
      if (modalType === "department") {
        await createDepartment(values).unwrap();
        message.success("Department created");
      }
      if (modalType === "designation") {
        await createDesignation(values).unwrap();
        message.success("Designation created");
      }
      if (modalType === "salary") {
        await setSalaryStructure(values).unwrap();
        message.success("Salary structure saved");
      }
      setModalType(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Unable to save HR setup");
    }
  };

  const departmentColumns: any = [
    { title: "Department", dataIndex: "name", key: "name", render: (name: string) => <span className="font-semibold">{name}</span> },
    { title: "Description", dataIndex: "description", key: "description", render: (text: string) => text || "-" },
    { title: "Status", dataIndex: "isActive", key: "isActive", align: "center", render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag> },
  ];

  const designationColumns: any = [
    { title: "Designation", dataIndex: "name", key: "name", render: (name: string) => <span className="font-semibold">{name}</span> },
    { title: "Department", dataIndex: ["department", "name"], key: "department", render: (name: string) => name || "Unassigned" },
    { title: "Status", dataIndex: "isActive", key: "isActive", align: "center", render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag> },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Setup" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card
          title="Departments"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchDepartments()} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("department")}>
                Add Department
              </Button>
            </Space>
          }
        >
          <Table columns={departmentColumns} dataSource={departments} rowKey="id" loading={deptsLoading} pagination={{ pageSize: 10 }} size="middle" />
        </Card>

        <Card
          title="Designations"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetchDesignations()} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("designation")}>
                Add Designation
              </Button>
            </Space>
          }
        >
          <Table columns={designationColumns} dataSource={designations} rowKey="id" loading={desigsLoading} pagination={{ pageSize: 10 }} size="middle" />
        </Card>
      </div>

      <Card
        title="Salary Structures"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal("salary")}>
            Set Salary Structure
          </Button>
        }
      >
        <Table
          columns={[
            { title: "Employee", dataIndex: "fullName", key: "fullName", render: (name: string, record: any) => <span className="font-semibold">{name} ({record.employeeCode})</span> },
            { title: "Department", dataIndex: ["department", "name"], key: "department", render: (name: string) => name || "-" },
            { title: "Basic Salary", dataIndex: "basicSalary", key: "basicSalary", align: "right", render: (amount: number) => Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) },
          ]}
          dataSource={employees}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>

      <Modal
        title={modalType === "department" ? "Add Department" : modalType === "designation" ? "Add Designation" : "Set Salary Structure"}
        open={!!modalType}
        onCancel={() => setModalType(null)}
        onOk={() => form.submit()}
        confirmLoading={creatingDepartment || creatingDesignation || savingSalary}
        destroyOnClose
        width={modalType === "salary" ? 760 : 560}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {modalType === "department" && (
            <>
              <Form.Item name="name" label="Department Name" rules={[{ required: true, message: "Enter department name" }]}>
                <Input placeholder="e.g. Sales & Marketing" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </>
          )}

          {modalType === "designation" && (
            <>
              <Form.Item name="name" label="Designation Name" rules={[{ required: true, message: "Enter designation name" }]}>
                <Input placeholder="e.g. Sales Executive" />
              </Form.Item>
              <Form.Item name="departmentId" label="Department">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={departments.map((department: any) => ({ label: department.name, value: department.id }))}
                />
              </Form.Item>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </>
          )}

          {modalType === "salary" && (
            <>
              <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Select employee" }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={employees.map((employee: any) => ({
                    label: `${employee.fullName} (${employee.employeeCode})`,
                    value: employee.id,
                  }))}
                />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="basicSalary" label="Basic Salary">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="houseRentAllowance" label="House Rent Allowance">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="medicalAllowance" label="Medical Allowance">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="conveyanceAllowance" label="Conveyance Allowance">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="taxDeduction" label="Tax Deduction">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
                <Form.Item name="providentFundDeduction" label="Provident Fund Deduction">
                  <InputNumber min={0} precision={2} className="w-full" />
                </Form.Item>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
