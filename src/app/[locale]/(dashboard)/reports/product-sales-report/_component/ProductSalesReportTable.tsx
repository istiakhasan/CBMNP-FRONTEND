"use client";
import moment from "moment";
import React from "react";

const ProductSalesReportTable = ({ reports }: any) => {
  const summary = reports?.summary || {};
  const formatAmount = (value: any) =>
    Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const summaryItems = [
    { label: "Products Sold", value: summary?.totalProductQuantity || 0 },
    { label: "Orders", value: summary?.totalOrders || 0 },
    { label: "Courier Orders", value: summary?.courierOrderCount || 0 },
    { label: "Paid Amount", value: formatAmount(summary?.paidAmount) },
    { label: "Sales Amount", value: formatAmount(summary?.salesAmount) },
    { label: "Order Amount", value: formatAmount(summary?.totalOrderAmount) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="border bg-white p-3">
            <p className="text-[12px] text-gray-500">{item.label}</p>
            <p className="text-[20px] font-semibold color_primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="border bg-white">
        <div className="bg-[#eeeeee] h-[34px] flex px-3 items-center">
          <strong>Courier Breakdown</strong>
        </div>
        <div className="overflow-x-auto">
          <table className="report-table">
            <thead>
              <tr>
                <th>Courier</th>
                <th style={{ textAlign: "center" }}>Order Qty</th>
                <th style={{ textAlign: "center" }}>Product Qty</th>
                <th style={{ textAlign: "end" }}>Sales Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary?.courierBreakdown?.length ? (
                summary.courierBreakdown.map((row: any, i: number) => (
                  <tr key={`${row?.courierId || "unassigned"}-${i}`}>
                    <td align="center">{row?.courierName || "Unassigned"}</td>
                    <td style={{ textAlign: "center" }}>{row?.orderCount || 0}</td>
                    <td style={{ textAlign: "center" }}>{row?.productQuantity || 0}</td>
                    <td style={{ textAlign: "end" }}>{formatAmount(row?.saleAmount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} align="center">
                    No courier data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  {formatAmount(row?.totalSaleAmount)}
                </td>
                <td style={{ textAlign: "end" }}>{row?.orderCount || "N/A"}</td>
              </tr>
            ))}
            {!reports?.data?.length && (
              <tr>
                <td colSpan={5} align="center">
                  No product sales found
                </td>
              </tr>
            )}
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
