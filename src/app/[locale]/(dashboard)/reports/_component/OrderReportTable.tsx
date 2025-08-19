"use client";
import CircleChar from "@/components/CircleChar";
import { useLazyGetOrdersReportsQuery } from "@/redux/api/orderApi";
import { Pagination } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import StatusBadge from "@/util/StatusBadge";

const OrderReportTable = ({ reports, startDate, endDate, setData,status,agentIds }: any) => {
  const [loadProcurement] = useLazyGetOrdersReportsQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  return (
    <div>
      <div className="table_wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Status</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Invoice No</th>
              <th>Agent</th>
              <th style={{ textAlign: "end" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.map((row: any, i: number) => (
              <tr key={i}>
                <td align="center">{(page - 1) * size + (i + 1)}</td>
                <td align="center">
                  {moment(row?.createdAt).format("DD-MM-YYYY")}
                </td>
                <td align="center">
                  <StatusBadge status={{label:row?.status?.label}} />
                </td>
                <td align="center">
                  <span className="flex items-center gap-1">
                    <CircleChar text={row?.customer?.customerName} />
                    {row?.customer?.customerName || "N/A"}
                  </span>
                </td>
                <td align="center">
                  {row?.customer?.customerPhoneNumber || "N/A"}
                </td>
                <td align="center">{row?.invoiceNumber || "N/A"}</td>
                <td align="center">{row?.agent?.name || "N/A"}</td>
                <td style={{ textAlign: "end" }}>{row?.totalPrice || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-[#eeeeee] h-[30px] sticky bottom-0 flex justify-end items-center gap-[200px]">
          <span>Total</span>
          <strong>{reports?.meta?.totalAmount || 0}</strong>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end sticky bottom-0 bg-white p-[20px]">
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
              agentIds: agentIds,
            }).unwrap();

            setData(result);
          }}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "100", "500", "1000"]}
        />
      </div>
    </div>
  );
};

export default OrderReportTable;
