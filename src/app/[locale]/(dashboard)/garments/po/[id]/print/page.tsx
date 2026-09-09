"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Button, Table, Spin, Tag } from "antd";
import { PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetGarmentsPoByIdQuery } from "@/redux/api/garmentsApi";

export default function GarmentsPoPrintPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: res, isLoading } = useGetGarmentsPoByIdQuery(id, { skip: !id });
  const po = res?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!po) {
    return <div className="p-8 text-center text-red-500">Purchase Order not found.</div>;
  }

  const columns = [
    {
      title: "SL",
      key: "sl",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Item Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
      width: 140,
    },
    {
      title: "Description / Specifications",
      key: "desc",
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold text-gray-900">{record.itemName}</div>
          {record.specification && (
            <div className="text-xs text-gray-500">{record.specification}</div>
          )}
        </div>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Quantity",
      key: "quantity",
      width: 100,
      align: "right" as const,
      render: (_: any, record: any) => Number(record.qty || record.quantity || 0).toLocaleString(),
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      width: 100,
      align: "right" as const,
      render: (_: any, record: any) => Number(record.unitCost || record.unitPrice || 0).toFixed(2),
    },
    {
      title: "Total Amount",
      key: "totalPrice",
      width: 120,
      align: "right" as const,
      render: (_: any, record: any) => {
        const total = record.totalCost !== undefined ? record.totalCost : record.totalPrice;
        return Number(total || 0).toFixed(2);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back to Purchase Orders
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          className="bg-purple-600"
        >
          Print Factory PO
        </Button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm print:shadow-none border border-gray-200 print:border-none">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-wider text-gray-900 uppercase">
                GARMENTS MANUFACTURING ERP
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Factory & Export Division | Procurement & Material Inward
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded tracking-wide uppercase">
                PURCHASE ORDER
              </div>
              <div className="text-xl font-bold text-gray-800 mt-2">{po.supplierPoNo || po.poNumber}</div>
              <div className="text-xs text-gray-500">
                Date: {dayjs(po.createdAt).format("DD MMMM, YYYY")}
              </div>
            </div>
          </div>
        </div>

        {/* Supplier & PO Metadata */}
        <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">SUPPLIER / VENDOR DETAILS</h3>
            <div className="text-base font-bold text-gray-900">{po.supplierName}</div>
            <div className="text-xs text-gray-600 mt-1">{po.supplierContact || po.supplierDetails || "Direct Mill"}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">ORDER & DELIVERY TERMS</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-500">Delivery Date:</span>
              <span className="font-semibold">{po.deliveryDate || po.expectedDeliveryDate ? dayjs(po.deliveryDate || po.expectedDeliveryDate).format("DD MMM, YYYY") : "ASAP"}</span>
              <span className="text-gray-500">Payment Terms:</span>
              <span className="font-semibold">{po.shippingTerms || po.paymentTerms || "30 Days Net"}</span>
              <span className="text-gray-500">Delivery Terms:</span>
              <span className="font-semibold">{po.shippingMethod || po.deliveryTerms || "Ex-Factory"}</span>
              <span className="text-gray-500">Approval Status:</span>
              <span className="font-bold uppercase text-purple-700">{(po.status || "draft").replace("_", " ")}</span>
            </div>
          </div>
        </div>

        {/* Table of items */}
        <Table
          dataSource={po.items || []}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered
          className="mb-6"
        />

        {/* Total Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gray-50 p-4 rounded border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                {po.currency || "USD"} {Number(po.subtotal || po.totalAmount || po.grandTotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax / VAT ({po.taxRatePercent || 0}%):</span>
              <span className="font-semibold">
                {po.currency || "USD"} {((Number(po.subtotal || 0) * Number(po.taxRatePercent || 0)) / 100).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Grand Total:</span>
              <span className="text-purple-700">
                {po.currency || "USD"} {Number(po.totalAmount || po.grandTotal || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Remarks / Terms */}
        {po.remarks && (
          <div className="mb-8 p-3 bg-gray-50 rounded border text-xs text-gray-700">
            <strong>Quality & Inspection Note:</strong> {po.remarks}
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-300 text-center text-xs">
          <div>
            <div className="h-10 border-b border-dashed border-gray-400 mb-2"></div>
            <div className="font-bold text-gray-800">Prepared By</div>
            <div className="text-gray-500">{po.createdBy || "Merchandiser"}</div>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-gray-400 mb-2"></div>
            <div className="font-bold text-gray-800">Checked & Verified By</div>
            <div className="text-gray-500">{po.checkedBy || "Store In-Charge"}</div>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-gray-400 mb-2"></div>
            <div className="font-bold text-gray-800">Authorized Signature</div>
            <div className="text-gray-500">{po.approvedBy || "Managing Director / GM"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
