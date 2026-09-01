"use client";
import React, { useState } from "react";
import { Table, Card, Button, Input, Space, Tag } from "antd";
import { ReloadOutlined, AuditOutlined, SearchOutlined } from "@ant-design/icons";
import { useGetAuditLogsQuery } from "@/redux/api/governanceApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function AuditLogsPage() {
  const [entityFilter, setEntityFilter] = useState("");
  const { data, isLoading, refetch } = useGetAuditLogsQuery({ entityName: entityFilter || undefined });

  const logs = data?.data || [];

  const columns: any = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: "Entity",
      dataIndex: "entityName",
      key: "entityName",
      render: (e: string) => <Tag color="blue">{e}</Tag>,
    },
    {
      title: "Entity ID",
      dataIndex: "entityId",
      key: "entityId",
      render: (id: string) => <span className="font-mono text-xs">{id}</span>,
    },
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      align: "center" as const,
      render: (a: string) => (
        <Tag color={a === "CREATE" ? "green" : a === "DELETE" ? "red" : a === "VOID" ? "volcano" : "orange"}>
          {a}
        </Tag>
      ),
    },
    {
      title: "User / Actor",
      dataIndex: "userName",
      key: "userName",
      render: (u: string, r: any) => u || r.userId || "System",
    },
    {
      title: "Audit Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Universal System Audit Trail & Compliance" />

      <Card
        title="Entity Change Logs"
        extra={
          <Space>
            <Input
              placeholder="Filter entity (e.g. Order, Expense)"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 220 }}
            />
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={logs} rowKey="id" loading={isLoading} pagination={{ pageSize: 20 }} size="middle" />
      </Card>
    </div>
  );
}
