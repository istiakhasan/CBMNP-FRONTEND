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
  Tag,
  Space,
  Card,
  message,
  Divider,
  Row,
  Col,
  Progress,
} from "antd";
import {
  InboxOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetGarmentsPosQuery,
  useGetGarmentsPoByIdQuery,
  useReceiveGarmentsPoMutation,
} from "@/redux/api/garmentsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGarmentsPermission } from "@/hook/useGarmentsPermission";

const { Option } = Select;

export default function GarmentsPoReceivePage() {
  const { canReceiveMaterials } = useGarmentsPermission();
  const [selectedPoId, setSelectedPoId] = useState<string>("");
  const [selectedPoData, setSelectedPoData] = useState<any>(null);
  const [receivingItemsSummary, setReceivingItemsSummary] = useState<any[]>([]);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const [form] = Form.useForm();

  // Load approved POs ready for goods inward
  const { data: posRes, isLoading: isPosLoading, refetch } = useGetGarmentsPosQuery({
    status: "approved",
    limit: 100,
  });
  const approvedPos = posRes?.data || [];

  const { data: currentPoRes, isLoading: isPoDetailLoading } = useGetGarmentsPoByIdQuery(
    selectedPoId,
    { skip: !selectedPoId }
  );
  const currentPo = currentPoRes?.data;

  const [receivePo, { isLoading: isReceiving }] = useReceiveGarmentsPoMutation();

  const handleOpenReceiveModal = (po: any) => {
    setSelectedPoId(po.id);
    setSelectedPoData(po);
    form.resetFields();
    if (po.items) {
      const itemsPayload = po.items.map((item: any) => {
        const totalOrdered = Number(item.qty ?? item.quantity ?? 0);
        const alreadyReceived = Number(item.receivedQty ?? item.receivedQuantity ?? 0);
        const remainingDue = Math.max(0, totalOrdered - alreadyReceived);

        return {
          poItemId: item.id,
          itemName: item.itemName,
          itemCategory: item.itemCategory,
          unit: item.unit || "PCS",
          totalOrdered,
          alreadyReceived,
          remainingDue,
          receivedQuantity: remainingDue,
          receiveQty: remainingDue,
          lotNumber: `LOT-${dayjs().format("YYYYMMDD")}-${Math.floor(100 + Math.random() * 900)}`,
          shadeRollNumber: "ROLL-01",
          locationRack: "Main Store - Rack A1",
          qcRemarks: "QC Passed / 100% Inspected",
        };
      });
      setReceivingItemsSummary(itemsPayload);
      form.setFieldsValue({
        challanNumber: `CH-${Math.floor(100000 + Math.random() * 900000)}`,
        items: itemsPayload,
      });
    }
    setIsReceiveModalOpen(true);
  };

  const handleReceiveSubmit = async (values: any) => {
    try {
      const payload = {
        poId: selectedPoId,
        challanNumber: values.challanNumber,
        lotNumber: values.items?.[0]?.lotNumber || `LOT-${Date.now()}`,
        batchNumber: values.challanNumber,
        remarks: values.remarks,
        items: values.items.map((i: any) => ({
          poItemId: i.poItemId,
          receiveQty: Number(i.receivedQuantity || 0),
          receivedQuantity: Number(i.receivedQuantity || 0),
          lotNumber: i.lotNumber,
          shadeRollNumber: i.shadeRollNumber,
          locationRack: i.locationRack,
          qcRemarks: i.qcRemarks,
        })),
      };

      await receivePo(payload).unwrap();
      message.success("Goods inward successful! Inventory ledger and lots updated.");
      setIsReceiveModalOpen(false);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to receive goods");
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
      title: "Buyer Order",
      key: "order",
      render: (_: any, record: any) => {
        const ord = record.order || record.buyerOrder;
        return ord ? (
          <div>
            <div className="font-semibold text-blue-700">{ord.orderNo || ord.orderNumber}</div>
            <div className="text-xs text-gray-500">{ord.buyerName} ({ord.styleName})</div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Direct Mill</span>
        );
      },
    },
    {
      title: "Supplier Mill",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (name: string) => <span className="font-semibold text-gray-800">{name}</span>,
    },
    {
      title: "Expected Delivery",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (_: any, record: any) => {
        const d = record.deliveryDate || record.expectedDeliveryDate;
        return d ? dayjs(d).format("YYYY-MM-DD") : "-";
      },
    },
    {
      title: "Material Lines",
      key: "lines",
      render: (_: any, record: any) => (
        <span>{record.items?.length || 0} items</span>
      ),
    },
    {
      title: "Inward Status",
      key: "inwardStatus",
      render: (_: any, record: any) => {
        const totalOrdered = record.items?.reduce((s: number, i: any) => s + Number(i.qty || i.quantity || 0), 0) || 0;
        const totalReceived = record.items?.reduce((s: number, i: any) => s + Number(i.receivedQty || i.receivedQuantity || 0), 0) || 0;
        const percent = totalOrdered > 0 ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100)) : 0;
        return (
          <div className="w-40">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{totalReceived.toLocaleString()} / {totalOrdered.toLocaleString()}</span>
              <span>{percent}%</span>
            </div>
            <Progress percent={percent} size="small" status={percent >= 100 ? "success" : "active"} />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) =>
        canReceiveMaterials ? (
          <Button
            type="primary"
            icon={<InboxOutlined />}
            className="bg-amber-600 hover:bg-amber-700"
            size="small"
            onClick={() => handleOpenReceiveModal(record)}
          >
            Receive Goods (Inward)
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <GbHeader title="Garments / Goods Inward & Receive" />

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800">Approved Purchase Orders - Ready for Receiving</h3>
            <p className="text-xs text-gray-500">
              Receive fabrics and trims into warehouse stock with lot tracking, roll numbering, and QC inspections.
            </p>
          </div>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isPosLoading}>
            Refresh
          </Button>
        </div>

        <Table
          dataSource={approvedPos}
          columns={columns}
          rowKey="id"
          loading={isPosLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Receive Goods Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-amber-900">
            <InboxOutlined className="text-amber-600 text-lg" />
            <span>Goods Inward & Quality Inspection (QC Receive)</span>
          </div>
        }
        open={isReceiveModalOpen}
        onCancel={() => setIsReceiveModalOpen(false)}
        footer={null}
        width={1050}
      >
        {/* PO & Buyer Order Summary Header */}
        {selectedPoData && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/40 p-3.5 rounded-lg border border-amber-200 mb-4 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Inward Destination PO</div>
              <div className="text-base font-bold text-purple-700">{selectedPoData.supplierPoNo || selectedPoData.poNumber}</div>
            </div>
            {selectedPoData.order && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Buyer Contract</div>
                <div className="text-sm font-semibold text-blue-800">{selectedPoData.order.orderNo} ({selectedPoData.order.buyerName})</div>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Supplier Mill</div>
              <div className="text-sm font-semibold text-gray-900">{selectedPoData.supplierName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Materials</div>
              <Tag color="purple" className="font-bold">{receivingItemsSummary.length} Items</Tag>
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleReceiveSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item
              name="challanNumber"
              label={<span className="font-semibold text-gray-800">Supplier Delivery Challan / Gate Pass #</span>}
              rules={[{ required: true, message: "Please enter delivery challan number" }]}
            >
              <Input placeholder="e.g. CH-98234 / GP-102" />
            </Form.Item>

            <Form.Item name="remarks" label={<span className="font-semibold text-gray-800">Receiving Notes / Truck Info</span>}>
              <Input placeholder="e.g. Received at Gate 2, Truck # DHK-Metro-12" />
            </Form.Item>
          </div>

          <Divider orientation="left">
            <span className="font-bold text-gray-800 text-sm">Material-by-Material Receipt & QC Breakdown</span>
          </Divider>

          <Form.List name="items">
            {(fields) => (
              <div className="space-y-4">
                {fields.map(({ key, name }) => {
                  const itemSummary = receivingItemsSummary[name] || {};
                  return (
                    <Card
                      key={key}
                      size="small"
                      className="bg-white border-2 border-amber-200/80 rounded-lg shadow-sm overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* Live Comparison Header */}
                      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 p-3 border-b border-amber-200 flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{itemSummary.itemName || `Item ${name + 1}`}</span>
                          <Tag color="cyan" className="ml-2 font-semibold">{itemSummary.itemCategory || "MATERIAL"}</Tag>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                            <span className="text-blue-700 font-medium">Total Ordered: </span>
                            <strong className="text-blue-900 font-bold">{Number(itemSummary.totalOrdered || 0).toLocaleString()} {itemSummary.unit}</strong>
                          </div>

                          <div className="bg-gray-100 border border-gray-300 px-2.5 py-1 rounded">
                            <span className="text-gray-600 font-medium">Already In-House: </span>
                            <strong className="text-gray-900 font-bold">{Number(itemSummary.alreadyReceived || 0).toLocaleString()} {itemSummary.unit}</strong>
                          </div>

                          <div className="bg-amber-100 border border-amber-300 px-2.5 py-1 rounded">
                            <span className="text-amber-800 font-medium">Remaining Due: </span>
                            <strong className="text-amber-950 font-bold">{Number(itemSummary.remainingDue || 0).toLocaleString()} {itemSummary.unit}</strong>
                          </div>

                          <Button
                            size="small"
                            type="dashed"
                            className="text-xs bg-white text-emerald-700 border-emerald-500 font-semibold hover:bg-emerald-50"
                            onClick={() => {
                              form.setFieldValue(["items", name, "receivedQuantity"], itemSummary.remainingDue);
                              message.success(`Set to full remaining due: ${itemSummary.remainingDue} ${itemSummary.unit}`);
                            }}
                          >
                            ⚡ Full Due ({itemSummary.remainingDue} {itemSummary.unit})
                          </Button>
                        </div>
                      </div>

                      {/* Entry Inputs */}
                      <div className="p-3.5 bg-white">
                        <Row gutter={[12, 12]}>
                          <Col xs={24} sm={12} md={6}>
                            <Form.Item
                              name={[name, "receivedQuantity"]}
                              label={<span className="font-bold text-emerald-800">Receiving Qty Now ({itemSummary.unit})</span>}
                              rules={[{ required: true, message: "Enter receiving qty" }]}
                            >
                              <InputNumber
                                min={0}
                                max={itemSummary.remainingDue || 1000000}
                                className="w-full font-bold text-emerald-700 text-base"
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} md={6}>
                            <Form.Item
                              name={[name, "lotNumber"]}
                              label={<span className="font-medium text-gray-700">Lot / Batch Number</span>}
                              rules={[{ required: true, message: "Required" }]}
                            >
                              <Input placeholder="e.g. LOT-2026-081" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} md={6}>
                            <Form.Item
                              name={[name, "shadeRollNumber"]}
                              label={<span className="font-medium text-gray-700">Shade / Roll / Box #</span>}
                            >
                              <Input placeholder="e.g. Roll 01-10 / Shade B" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} md={6}>
                            <Form.Item
                              name={[name, "locationRack"]}
                              label={<span className="font-medium text-gray-700">Warehouse Location / Rack</span>}
                            >
                              <Input placeholder="e.g. Fabric Store - Rack 3B" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={24}>
                            <Form.Item
                              name={[name, "qcRemarks"]}
                              label={<span className="font-medium text-gray-700">QC Inspection & Defect Remarks</span>}
                              className="mb-0"
                            >
                              <Input placeholder="e.g. 100% Passed 4-Point System / No shade variation" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Form.List>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsReceiveModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isReceiving}
              className="bg-amber-600 hover:bg-amber-700"
              icon={<CheckCircleOutlined />}
            >
              Post Goods Inward to Inventory
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
