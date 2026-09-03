"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetActivityLogsQuery } from "@/redux/api/activityLogApi";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const actionColors: Record<string, string> = {
  Created: "green",
  Updated: "blue",
  Deleted: "red",
  "Changed status": "orange",
  Approved: "green",
  Cancelled: "red",
  Dispatched: "cyan",
  Received: "geekblue",
  Returned: "volcano",
  Voided: "magenta",
  MANUAL: "purple",
};

export default function ActivityLogsPage() {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    module: undefined as string | undefined,
    action: undefined as string | undefined,
    search: "",
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  const query = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
    }),
    [filters],
  );

  const { data, isFetching, refetch } = useGetActivityLogsQuery(query);
  const logs = data?.data || [];

  const columns: any = [
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => dayjs(value).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 150,
      render: (value: string) => <Tag color="blue">{value || "system"}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (value: string) => (
        <Tag color={actionColors[value] || "default"}>{value}</Tag>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      width: 160,
      render: (value: string, record: any) =>
        value || record.userId || "System",
    },
    {
      title: "Activity",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (value: string) => value || "-",
    },
    {
      title: "Details",
      key: "details",
      width: 90,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedLog(record);
          }}
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Activity Logs" />

      <Card
        title="Project Activity"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            allowClear
            placeholder="Search activity"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                search: event.target.value,
              }))
            }
            className="w-full md:w-[260px]"
          />
          <Select
            allowClear
            placeholder="Module"
            value={filters.module}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, page: 1, module: value }))
            }
            className="w-full md:w-[180px]"
            options={[
              "Orders",
              "Inventory",
              "Inventory Operations",
              "Products",
              "Customers",
              "Users",
              "Hr Payroll",
              "Finance",
              "Accounting",
              "Procurement",
            ].map((item) => ({ label: item, value: item }))}
          />
          <Select
            allowClear
            placeholder="Action"
            value={filters.action}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, page: 1, action: value }))
            }
            className="w-full md:w-[150px]"
            options={[
              "Created",
              "Updated",
              "Deleted",
              "Changed status",
              "Approved",
              "Cancelled",
              "Dispatched",
              "Received",
              "Returned",
              "Voided",
              "MANUAL",
            ].map((item) => ({ label: item, value: item }))}
          />
          <RangePicker
            className="w-full md:w-[300px]"
            onChange={(dates) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                startDate: dates?.[0]?.startOf("day").toISOString(),
                endDate: dates?.[1]?.endOf("day").toISOString(),
              }))
            }
          />
        </div>

        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={isFetching}
          size="middle"
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => setSelectedLog(record),
          })}
          pagination={{
            current: Number(data?.page || filters.page),
            pageSize: Number(data?.limit || filters.limit),
            total: Number(data?.total || 0),
            showSizeChanger: true,
            onChange: (page, limit) =>
              setFilters((prev) => ({ ...prev, page, limit })),
          }}
        />
      </Card>

      <Drawer
        title="Activity Details"
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        width={620}
      >
        {selectedLog && (
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text type="secondary">Description</Text>
              <div>{selectedLog.description || "-"}</div>
            </div>
            <div>
              <Text type="secondary">User</Text>
              <div>{selectedLog.userName || selectedLog.userId || "System"}</div>
            </div>
            <div>
              <Text type="secondary">Module / Action</Text>
              <div>
                <Tag color="blue">{selectedLog.module || "-"}</Tag>
                <Tag color={actionColors[selectedLog.action] || "default"}>
                  {selectedLog.action || "-"}
                </Tag>
              </div>
            </div>
            <div>
              <Text type="secondary">Technical Reference</Text>
              <div className="font-mono text-xs break-all">
                {selectedLog.method || "-"} {selectedLog.path || "-"}
              </div>
              <div className="text-xs text-gray-500">
                Status: {selectedLog.statusCode || "-"}
              </div>
            </div>
            <div>
              <Text type="secondary">IP / User Agent</Text>
              <div>{selectedLog.ipAddress || "-"}</div>
              <div className="text-xs text-gray-500 break-all">
                {selectedLog.userAgent || "-"}
              </div>
            </div>
            <div>
              <Text type="secondary">Metadata</Text>
              <pre className="mt-2 max-h-[420px] overflow-auto rounded bg-gray-950 p-3 text-xs text-gray-100">
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
