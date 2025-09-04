"use client";
import { useLazyGetCustomerRetentionReportsQuery } from "@/redux/api/customerApi";
import { Card, Statistic, Pagination } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const RetentionReportTable = ({ reports, startDate, endDate, setData }: any) => {
  const [loadProcurement] = useLazyGetCustomerRetentionReportsQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(val || 0);
console.log(reports,"abcd");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <Card size="small" className="text-center py-2">
          <Statistic title="Total Customers" value={reports?.meta?.total || 0} />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic title="Total Orders" value={reports?.meta?.overallTotalOrders || 0} />
        </Card>
        <Card size="small" className="text-center py-2">
          <Statistic title="Total Spent" value={formatCurrency(reports?.meta?.overallTotalSpent || 0)} />
        </Card>
      </div>
 
      {/* --- Table --- */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {/* <th className="px-3 py-2 border">SL</th> */}
              <th className="px-3 py-2 border">Customer ID</th>
              <th className="px-3 py-2 border">Name</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">Phone</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">Type</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">Total Orders</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">Total Spent</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">First Order Date</th>
              <th style={{textAlign:"start"}} className="px-3 py-2 border">Last Order Date</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.length > 0 ? (
              reports?.data?.map((row: any, i: number) => (
                <tr key={row.id} className="text-center border-b hover:bg-gray-50">
                  {/* <td className="px-3 py-1 border">{(page - 1) * size + (i + 1)}</td> */}
                  <td className="px-3 py-1 border">{row?.customerid}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.customername}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.customerphonenumber}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.customertype}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.ordercount}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{formatCurrency(row?.totalspent)}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{dayjs(row?.firstorderdate).format("DD-MM-YYYY")}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{dayjs(row?.lastorderdate).format("DD-MM-YYYY")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">
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
            }).unwrap();
            setData(result);
          }}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50", "100"]}
        />
      </div>
    </div>
  );
};

export default RetentionReportTable;
