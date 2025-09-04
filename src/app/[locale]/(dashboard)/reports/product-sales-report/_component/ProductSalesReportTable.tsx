"use client";
import CircleChar from "@/components/CircleChar";
import {
  useLazyGetOrdersReportsQuery,
  useLazyGetProductWiseSalesReportQuery,
} from "@/redux/api/orderApi";
import { Pagination } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import React from "react";

const ProductSalesReportTable = ({ reports }: any) => {
  return (
    <div>
      <div className="table_wrapper custom_scroll">
        <div className="bg-[#eeeeee] h-[30px] sticky bottom-0 flex  px-3 justify-between items-center mb-1 gap-[10px]">
          {reports?.data?.length > 0 && (
            <div>
              <strong>
                {moment(reports?.meta?.startDate).format("DD-MM-YYYY")} To{" "}
                {moment(reports?.meta?.endDate).format("DD-MM-YYYY")}
              </strong>
            </div>
          )}
          <div>
            <span>Total Products :</span>
            <strong>{reports?.meta?.total || 0}</strong>
          </div>
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Order Source</th>
              <th style={{ textAlign: "center" }}>Product Qty</th>
              {/* <th>Product Price</th> */}
              <th style={{ textAlign: "end" }}>Total Price</th>
              <th style={{ textAlign: "right" }}>Order Qty</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.map((row: any, i: number) => (
              <tr key={i}>
                <td align="center">{row?.productName || "N/A"}</td>
                <td align="center">{row?.orderSource || "N/A"}</td>
                <td style={{ textAlign: "center" }}>
                  {row?.totalOrderQuantity || "N/A"}
                </td>
                <td style={{ textAlign: "end" }}>
                  {row?.totalSaleAmount || "N/A"}
                </td>
                <td style={{ textAlign: "end" }}>{row?.orderCount || "N/A"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ position: "sticky", bottom: "0" }}>
            <tr>
              <th></th>
              <th></th>

              <th>
                <span className="flex justify-center gap-2 font-bold">
                  <span>Total:</span>
                  <span>
                    {reports?.data?.reduce(
                      (a: any, b: any) => a + b?.totalOrderQuantity,
                      0
                    ) || 0}
                  </span>
                </span>
              </th>
              <th>
                <span className="flex justify-end gap-2 font-bold">
                  <span>Total Sales:</span>
                  <span>
                    {reports?.data?.reduce(
                      (a: any, b: any) => a + b?.totalSaleAmount,
                      0
                    ) || 0}
                  </span>
                </span>
              </th>
              <th>
                <span className="flex justify-end gap-2 font-bold">
                  <span>Total Orders:</span>
                  <span>
                    {reports?.data?.reduce(
                      (a: any, b: any) => a + b?.orderCount,
                      0
                    ) || 0}
                  </span>
                </span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProductSalesReportTable;
