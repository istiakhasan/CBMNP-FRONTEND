"use client";
import { useLazyGetOrdersReportsQuery } from "@/redux/api/orderApi";
import StatusBadge from "@/util/StatusBadge";
import { Card, Statistic, Tag, Pagination } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const OrderReportTable = ({
  orderSources,
  reports,
  startDate,
  endDate,
  setData,
  status,
  agentIds,
  warehosueIds,
  courierIds,
  paymentMethodIds,
  productIds,
}: any) => {
  const [loadProcurement] = useLazyGetOrdersReportsQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  // Format currency nicely
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(val || 0);

  return (
    <div className="space-y-4">
      {/* --- Compact Summary Cards --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <Card size="small" className="text-center py-2">
          <Statistic title="Total Orders" value={reports?.meta?.total || 0} />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic title="Total Sales" value={formatCurrency(reports?.meta?.totalAmount || 0)} />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic
            title="Total Paid"
            value={formatCurrency(reports?.meta?.totalPaidAmount || 0)}
          />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic title="Damage Qty" value={reports?.meta?.damageQuantity || 0} />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic   style={{fontSize:"12px"}} title="Return Qty" value={reports?.meta?.totalReturnQty || 0} />
        </Card>
      </div>

      {/* --- Scrollable Report Table --- */}
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="report-table w-full border-collapse text-sm">
          <thead className="sticky z-[1000] top-0 bg-gray-100">
            <tr>
              <th className="px-2 py-1">SL</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Order ID</th>
              <th className="px-2 py-1">Source</th>
              <th className="px-2 py-1">Delivery Partner</th>
              <th className="px-2 py-1">Delivery Charge</th>
              <th className="px-2 py-1">Product Value</th>
              <th className="px-2 py-1">Total Price</th>
              <th className="px-2 py-1">Paid Amount</th>
              <th className="px-2 py-1">Payment Method</th>
              <th className="px-2 py-1">Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.length > 0 ? (
              reports?.data?.map((row: any, i: number) => (
                <tr key={i} className="text-center border-b">
                  <td className="px-2 py-1">{(page - 1) * size + (i + 1)}</td>
                  <td className="px-2 py-1">{dayjs(row?.createdAt).format("DD-MM-YYYY")}</td>
                  <td className="px-2 py-1"><StatusBadge status={{label:row?.status?.label}} /></td>
                  <td className="px-2 py-1">
                    <Tag color="blue">{row?.orderNumber}</Tag>
                  </td>
                  <td className="px-2 py-1">{row?.orderSource || "-"}</td>
                  <td className="px-2 py-1">{row?.partner?.partnerName || "-"}</td>
                  <td className="px-2 py-1">{formatCurrency(row?.shippingCharge)}</td>
                  <td className="px-2 py-1">{formatCurrency(row?.productValue)}</td>
                  <td className="px-2 py-1">{formatCurrency(row?.totalPrice)}</td>
                  <td className="px-2 py-1 text-green-600">{formatCurrency(row?.totalPaidAmount)}</td>
                  <td className="px-2 py-1">{row?.paymentMethod || "-"}</td>
                  <td className="px-2 py-1 text-red-500">{formatCurrency(row?.totalReceiveAbleAmount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className="mt-2 flex justify-end bg-white p-2 sticky bottom-0 shadow">
        <Pagination
          current={page}
          pageSize={size}
          total={reports?.meta?.total || 0}
          onChange={async (p, s) => {
            setPage(p);
            setSize(s);
            const result = await loadProcurement({
              startDate: startDate ? dayjs(startDate).toISOString() : null,
              endDate: endDate ? dayjs(endDate).toISOString() : null,
              page: p,
              limit: s,
              statusId: status,
              agentIds,
              locationId: warehosueIds,
              currier: courierIds,
              paymentMethodIds,
              orderSources,
              productId: productIds,
            }).unwrap();
            setData(result);
          }}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "100", "500", "1000"]}
        />
      </div>
    </div>
  );
};

export default OrderReportTable;
