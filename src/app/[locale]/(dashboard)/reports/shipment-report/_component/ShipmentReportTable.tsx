"use client";
import React from "react";

const ShipmentReportTable = ({ reports }: any) => {
  // Calculate totals
  const totals = reports?.data?.reduce(
    (acc: any, row: any) => {
      acc.deliveryCharge += row?.deliveryCharge || 0;
      acc.orderQty += row?.orderQty || 0;
      acc.productQty += row?.productQty || 0;
      acc.productPrice += row?.productPrice || 0;
      acc.total += row?.total || 0;
      acc.advancePaid += row?.advancePaid || 0;
      acc.totalPaid += row?.totalPaid || 0;
      acc.dueAmount += row?.dueAmount || 0;
      return acc;
    },
    {
      deliveryCharge: 0,
      orderQty: 0,
      productQty: 0,
      productPrice: 0,
      total: 0,
      advancePaid: 0,
      totalPaid: 0,
      dueAmount: 0,
    }
  );

  return (
    <div>
      <div className="table_wrapper custom_scroll">
        <table className="report-table">
          <thead>
            <tr>
              <th>Delivery Partner</th>
              <th style={{ textAlign: "right" }}>Delivery Charge</th>
              <th style={{ textAlign: "center" }}>Order Qty</th>
              <th style={{ textAlign: "center" }}>Product Qty</th>
              <th style={{ textAlign: "right" }}>Product Price</th>
              <th style={{ textAlign: "right" }}>Total</th>
              <th style={{ textAlign: "right" }}>Total Advance Paid Amount</th>
              <th>Payment Method</th>
              <th style={{ textAlign: "right" }}>Total Paid Amount</th>
              <th style={{ textAlign: "right" }}>Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {reports?.data?.map((row: any, i: number) => {
              const payments = row?.payments?.length
                ? row.payments
                : [{ method: "N/A", amount: 0 }];

              return payments.map((payment: any, j: number) => (
                <tr key={`${i}-${j}`}>
                  {j === 0 && (
                    <>
                      <td rowSpan={payments.length} align="center">
                        {row?.deliveryPartner || "N/A"}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.deliveryCharge || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "center" }}>
                        {row?.orderQty || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "center" }}>
                        {row?.productQty || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.productPrice || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.total || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.advancePaid || 0}
                      </td>
                    </>
                  )}

                  {/* Dynamic payment row */}
                  <td>
                    {payment.method} ({payment.amount})
                  </td>

                  {j === 0 && (
                    <>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.totalPaid || 0}
                      </td>
                      <td rowSpan={payments.length} style={{ textAlign: "right" }}>
                        {row?.dueAmount || 0}
                      </td>
                    </>
                  )}
                </tr>
              ));
            })}
          </tbody>

          {/* Footer totals */}
          <tfoot>
            <tr>
              <td style={{ fontWeight: "bold" }}>Total</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.deliveryCharge}</td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>{totals?.orderQty}</td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>{totals?.productQty}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.productPrice}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.total}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.advancePaid}</td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>—</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.totalPaid}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals?.dueAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ShipmentReportTable;
