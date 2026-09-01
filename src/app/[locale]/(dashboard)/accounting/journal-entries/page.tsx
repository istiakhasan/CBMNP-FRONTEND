"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Space,
  Input,
  DatePicker,
  Select,
  Tag,
  Modal,
  Popconfirm,
  message,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  useGetJournalEntriesQuery,
  useVoidJournalEntryMutation,
} from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;

const entryTypeColors: Record<string, string> = {
  ManualJournal: "blue",
  SalesInvoice: "green",
  PaymentReceipt: "cyan",
  PurchaseBill: "orange",
  ExpenseVoucher: "red",
  FundTransfer: "purple",
  OpeningBalance: "gold",
};

export default function JournalEntriesPage() {
  const router = useRouter();
  const local = useLocale();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetJournalEntriesQuery({
    page,
    limit,
    searchTerm: searchTerm || undefined,
    startDate,
    endDate,
    status,
  });

  const [voidJournalEntry, { isLoading: isVoiding }] = useVoidJournalEntryMutation();

  const handleVoid = async (id: string) => {
    try {
      await voidJournalEntry(id).unwrap();
      message.success("Journal voucher voided successfully");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to void voucher");
    }
  };

  const columns: any = [
    {
      title: "Voucher #",
      dataIndex: "entryNumber",
      key: "entryNumber",
      width: "16%",
      render: (num: string) => (
        <span className="font-bold text-blue-600">{num}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "entryDate",
      key: "entryDate",
      width: "12%",
      render: (date: string) => <span>{date}</span>,
    },
    {
      title: "Type",
      dataIndex: "entryType",
      key: "entryType",
      width: "14%",
      render: (type: string) => (
        <Tag color={entryTypeColors[type] || "default"}>{type}</Tag>
      ),
    },
    {
      title: "Narration / Memo",
      dataIndex: "narration",
      key: "narration",
      render: (text: string, record: any) => (
        <div>
          <p className="m-0 text-gray-800 font-medium">{text}</p>
          {record.referenceId && (
            <span className="text-xs text-gray-400">
              Ref: {record.referenceType} #{record.referenceId}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Total Amount (Tk)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right" as const,
      width: "15%",
      render: (amt: number) => (
        <span className="font-bold text-gray-900">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Posted" ? "success" : st === "Void" ? "error" : "default"}>
          {st}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "12%",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedVoucher(record);
              setDetailModalOpen(true);
            }}
          >
            View
          </Button>
          {record.status === "Posted" && (
            <Popconfirm
              title="Void Voucher"
              description="Are you sure you want to void this journal entry?"
              onConfirm={() => handleVoid(record.id)}
              okText="Void"
              cancelText="Cancel"
            >
              <Button size="small" danger icon={<StopOutlined />} title="Void" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const voucherItemsColumns: any = [
    {
      title: "Account Code",
      dataIndex: ["account", "accountCode"],
      key: "accountCode",
      width: "18%",
    },
    {
      title: "Account Name",
      dataIndex: ["account", "accountName"],
      key: "accountName",
      width: "32%",
      render: (name: string, record: any) => (
        <div>
          <span className="font-medium">{name}</span>
          {record.memo && (
            <p className="text-xs text-gray-400 m-0">Memo: {record.memo}</p>
          )}
        </div>
      ),
    },
    {
      title: "Debit (Tk)",
      dataIndex: "debit",
      key: "debit",
      align: "right" as const,
      width: "25%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-semibold text-emerald-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
    {
      title: "Credit (Tk)",
      dataIndex: "credit",
      key: "credit",
      align: "right" as const,
      width: "25%",
      render: (val: number) => {
        const num = Number(val || 0);
        return num > 0 ? (
          <span className="font-semibold text-blue-700">
            {num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-gray-300">-</span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Double-Entry Journal Vouchers" />

      {/* Filter & Action Toolbar */}
      <Card size="small" className="shadow-sm">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Space wrap>
              <Input
                placeholder="Search voucher #, narration..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 220 }}
                allowClear
              />
              <RangePicker
                onChange={(dates, dateStrings) => {
                  setStartDate(dateStrings[0] || undefined);
                  setEndDate(dateStrings[1] || undefined);
                }}
              />
              <Select
                placeholder="Status"
                value={status}
                onChange={(val) => setStatus(val)}
                allowClear
                style={{ width: 120 }}
              >
                <Option value="Posted">Posted</Option>
                <Option value="Void">Void</Option>
                <Option value="Draft">Draft</Option>
              </Select>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Reset
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8} className="text-right">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push(`/${local}/accounting/journal-entries/create`)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Post Journal Voucher
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Vouchers Table */}
      <Card className="shadow-sm rounded-lg">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
          size="middle"
        />
      </Card>

      {/* Voucher Detail Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-8">
            <span>Journal Voucher Details: {selectedVoucher?.entryNumber}</span>
            <Tag color={selectedVoucher?.status === "Posted" ? "green" : "red"}>
              {selectedVoucher?.status}
            </Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={750}
      >
        {selectedVoucher && (
          <div className="space-y-4 pt-2">
            <Row gutter={16}>
              <Col span={8}>
                <Text type="secondary">Voucher Date:</Text>
                <p className="font-semibold">{selectedVoucher.entryDate}</p>
              </Col>
              <Col span={8}>
                <Text type="secondary">Voucher Type:</Text>
                <p className="font-semibold">{selectedVoucher.entryType}</p>
              </Col>
              <Col span={8}>
                <Text type="secondary">Total Amount:</Text>
                <p className="font-semibold text-emerald-700">
                  {Number(selectedVoucher.totalAmount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  Tk
                </p>
              </Col>
            </Row>

            <div>
              <Text type="secondary">Narration / Description:</Text>
              <p className="bg-gray-50 p-2 rounded text-gray-700 mt-1">
                {selectedVoucher.narration}
              </p>
            </div>

            <Divider className="my-2" />

            <Table
              columns={voucherItemsColumns}
              dataSource={selectedVoucher.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              summary={(pageData) => {
                let totalDebit = 0;
                let totalCredit = 0;
                pageData.forEach(({ debit, credit }) => {
                  totalDebit += Number(debit || 0);
                  totalCredit += Number(credit || 0);
                });
                return (
                  <Table.Summary.Row className="bg-gray-100 font-bold">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Total Double-Entry Balance
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right" className="text-emerald-700">
                      {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right" className="text-blue-700">
                      {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
