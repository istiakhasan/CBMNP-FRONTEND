"use client";
import {useLazyTopCustomersReportsQuery } from "@/redux/api/customerApi";
import { Card, Statistic, Pagination } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const TopCustomers = ({ reports, startDate, endDate, setData,status }: any) => {
  const [loadProcurement] = useLazyTopCustomersReportsQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(val || 0);
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
              <th className="px-3 py-2 border">Rank</th>
              <th className="px-3 py-2 border">Customer ID</th>
              <th style={{textAlign:"left"}} className="px-3 py-2 border">Customer Type</th>
              <th style={{textAlign:"left"}} className="px-3 py-2 border">Name</th>
              <th style={{textAlign:"left"}} className="px-3 py-2 border">Phone</th>
              <th style={{textAlign:"left"}} className="px-3 py-2 border">Address</th>
              <th className="px-3 py-2 border">Order Count</th>
              <th style={{textAlign:"end"}} className="px-3 py-2 border">Order Value</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.length > 0 ? (
              reports?.data?.map((row: any, i: number) => (
                <tr key={row.id} className="text-center border-b hover:bg-gray-50">
                  <td className="px-3 py-1 border">{(page - 1) * size + (i + 1)}</td>
                  <td className="px-3 py-1 border">{row?.customer_id}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.customertype}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.customername}</td>
                  <td style={{textAlign:"left"}} className="px-3 py-1 border">{row?.customerphonenumber}</td>
                  <td style={{textAlign:"start"}} className="px-3 py-1 border">{row?.address}</td>
                  <td style={{textAlign:"center"}} className="px-3 py-1 border">{row?.total_orders}</td>
                  <td style={{textAlign:"end"}} className="px-3 py-1 border">{row?.total_value}</td>
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
              startDate: startDate ? dayjs(startDate).toISOString() : dayjs(new Date()).toISOString(),
              endDate: endDate ? dayjs(endDate).toISOString() : dayjs(new Date()).toISOString(),
              page: p,
              limit: s,
              statusId:status
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

export default TopCustomers;
