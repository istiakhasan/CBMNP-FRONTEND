"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Button, Table, Spin } from "antd";
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

  const items = po.items || [];
  const getNumber = (value: unknown) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };
  const getItemTotal = (record: any) => {
    const savedTotal = [record.totalCost, record.totalPrice, record.totalAmount, record.amount]
      .map(getNumber)
      .find((total) => total !== 0);

    if (savedTotal !== undefined) return savedTotal;

    return getNumber(record.qty ?? record.quantity) * getNumber(record.unitCost ?? record.unitPrice);
  };
  // Calculate from line items so an incomplete API total cannot make a valid PO line show as 0.00.
  const subtotal = items.reduce((total: number, item: any) => total + getItemTotal(item), 0);
  const taxAmount = (subtotal * getNumber(po.taxRatePercent)) / 100;
  const grandTotal = subtotal + taxAmount;
  const currency = "BDT";

  const columns = [
    {
      title: "SL",
      key: "sl",
      width: 50,
      align: "center" as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Item Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
      width: 125,
    },
    {
      title: "Description / Specifications",
      key: "description",
      render: (_: any, record: any) => (
        <div className="leading-snug">
          <div className="font-semibold text-gray-900">{record.itemName || "—"}</div>
          {record.specification && (
            <div className="mt-1 text-xs text-gray-500">{record.specification}</div>
          )}
        </div>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 65,
      align: "center" as const,
    },
    {
      title: "Quantity",
      key: "quantity",
      width: 85,
      align: "right" as const,
      render: (_: any, record: any) => Number(record.qty || record.quantity || 0).toLocaleString(),
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      width: 95,
      align: "right" as const,
      render: (_: any, record: any) => Number(record.unitCost || record.unitPrice || 0).toFixed(2),
    },
    {
      title: "Total Amount",
      key: "totalPrice",
      width: 110,
      align: "right" as const,
      render: (_: any, record: any) => {
        return getItemTotal(record).toFixed(2);
      },
    },
  ];

  return (
    <div className="garments-po-print min-h-screen bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white">
      {/* Action Bar (Hidden on print) */}
      <div className=" mx-auto mb-6 flex justify-between items-center print:hidden">
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
      <div className="garments-po-print-sheet  mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm print:shadow-none border border-gray-200 print:border-none">
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
        <div className="po-header-details grid grid-cols-2 gap-8 mb-6 text-sm">
          <div className="po-supplier-details p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">SUPPLIER / VENDOR DETAILS</h3>
            <div className="text-base font-bold text-gray-900">{po.supplierName}</div>
            <div className="text-xs text-gray-600 mt-1">{po.supplierContact || po.supplierDetails || "Direct Mill"}</div>
          </div>

          <div className="po-delivery-details p-4 bg-gray-50 rounded border border-gray-200">
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
          dataSource={items}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered
          tableLayout="fixed"
          className="garments-po-items-table mb-6"
        />

        {/* Total Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gray-50 p-4 rounded border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax / VAT ({po.taxRatePercent || 0}%):</span>
              <span className="font-semibold">
                {currency} {taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Grand Total:</span>
              <span className="text-purple-700">
                {currency} {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        <div className="po-signature-row grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-300 text-center text-xs">
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

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          /* This page is rendered inside the dashboard shell; remove that shell
             from the printed layout so it cannot shrink the purchase order. */
          .dashboard-shell {
            display: block !important;
            min-height: 0 !important;
            background: #fff !important;
          }

          .dashboard-shell > .gb_sidebar,
          .dashboard-shell > aside,
          .dashboard-shell .gb_sidebar {
            display: none !important;
          }

          .dashboard-content {
            display: block !important;
            width: 100% !important;
            min-width: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          .garments-po-print {
            width: 100% !important;
            min-height: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .garments-po-print-sheet {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .garments-po-print .po-header-details {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 8mm !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .garments-po-print .po-signature-row {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 8mm !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .garments-po-print .ant-table-wrapper,
          .garments-po-print .ant-table-container,
          .garments-po-print .ant-table-content {
            overflow: visible !important;
          }

          .garments-po-print table {
            width: 100% !important;
          }

          .garments-po-items-table .ant-table-thead > tr > th {
            padding: 8px 7px !important;
            font-size: 10px !important;
            font-weight: 600 !important;
            line-height: 1.25 !important;
            white-space: normal !important;
          }

          /* Keep all item fields as separate columns, but reclaim the serial
             number space on paper where it is not needed. */
          .garments-po-items-table colgroup col:first-child,
          .garments-po-items-table .ant-table-thead > tr > th:first-child,
          .garments-po-items-table .ant-table-tbody > tr > td:first-child {
            display: none !important;
          }

          .garments-po-items-table .ant-table-tbody > tr > td {
            padding: 9px 7px !important;
            font-size: 10px !important;
            font-weight: 400 !important;
            vertical-align: top !important;
            overflow-wrap: anywhere;
          }

          .garments-po-items-table .ant-table-tbody > tr > td * {
            font-weight: 400 !important;
          }

          .garments-po-print tr,
          .garments-po-print .ant-table-row {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
