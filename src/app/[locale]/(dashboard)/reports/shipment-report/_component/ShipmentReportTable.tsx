"use client";

import React, { useRef, useState } from "react";
import { Button, Modal, Spin } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  useLazyGetDeliveryPartnerOrderDetailsQuery,
} from "@/redux/api/orderApi";

interface ShipmentReportTableProps {
  reports: any;
  startDate?: any;
  endDate?: any;
  warehosueIds?: any;
}

const ShipmentReportTable = ({
  reports,
  startDate,
  endDate,
  warehosueIds,
}: ShipmentReportTableProps) => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);

  const printRef = useRef<HTMLDivElement>(null);

  const [
    fetchDetails,
    { isFetching },
  ] = useLazyGetDeliveryPartnerOrderDetailsQuery();

  // =========================================================
  // Format Money
  // =========================================================

  const formatMoney = (amount: any) => {
    return `BDT ${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================================================
  // Main Report Totals
  // =========================================================

  const totals =
    reports?.data?.reduce(
      (acc: any, row: any) => {
        acc.deliveryCharge +=
          Number(row?.deliveryCharge) || 0;

        acc.orderQty +=
          Number(row?.orderQty) || 0;

        acc.productQty +=
          Number(row?.productQty) || 0;

        acc.productPrice +=
          Number(row?.productPrice) || 0;

        acc.total +=
          Number(row?.total) || 0;

        acc.advancePaid +=
          Number(row?.advancePaid) || 0;

        acc.totalPaid +=
          Number(row?.totalPaid) || 0;

        acc.dueAmount +=
          Number(row?.dueAmount) || 0;

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
    ) || {
      deliveryCharge: 0,
      orderQty: 0,
      productQty: 0,
      productPrice: 0,
      total: 0,
      advancePaid: 0,
      totalPaid: 0,
      dueAmount: 0,
    };

  // =========================================================
  // Row Click
  // =========================================================

  const handleRowClick = async (row: any) => {
    if (!row?.partnerId) {
      console.error(
        "Delivery partner ID is missing:",
        row
      );

      return;
    }

    setSelectedRow(row);
    setOrderDetails([]);

    try {
      const res = await fetchDetails({
        partnerId: row.partnerId,

        filters: {
          startDate: startDate || dayjs(),
          endDate: endDate || dayjs(),
          locationId: warehosueIds,
        },
      }).unwrap();

      const details =
        res?.data ?? res ?? [];

      setOrderDetails(
        Array.isArray(details)
          ? details
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch shipment details:",
        error
      );

      setOrderDetails([]);
    }
  };

  // =========================================================
  // In Transit Date
  // =========================================================

  const getTransitDate = () => {
    if (
      selectedRow?.inTransitDate &&
      typeof selectedRow.inTransitDate ===
        "string"
    ) {
      const dateText =
        selectedRow.inTransitDate;

      // Backend value:
      // Sun Aug 23 2026 ... - Sun Aug 23 2026 ...

      if (dateText.includes(" - ")) {
        const parts =
          dateText.split(" - ");

        if (parts.length >= 2) {
          const start = dayjs(parts[0]);
          const end = dayjs(parts[1]);

          if (
            start.isValid() &&
            end.isValid()
          ) {
            if (
              start.isSame(
                end,
                "day"
              )
            ) {
              return start.format(
                "MMM DD, YYYY"
              );
            }

            return `${start.format(
              "MMM DD, YYYY"
            )} - ${end.format(
              "MMM DD, YYYY"
            )}`;
          }
        }
      }

      const parsed =
        dayjs(dateText);

      if (parsed.isValid()) {
        return parsed.format(
          "MMM DD, YYYY"
        );
      }
    }

    // If detail data exists, calculate from details

    if (orderDetails.length) {
      const dates =
        orderDetails
          .map(
            (item: any) =>
              item?.inTransitDate
          )
          .filter(Boolean)
          .map((date: any) =>
            dayjs(date)
          )
          .filter((date: any) =>
            date.isValid()
          );

      if (dates.length) {
        const firstDate =
          dates[0];

        const lastDate =
          dates[dates.length - 1];

        if (
          firstDate.isSame(
            lastDate,
            "day"
          )
        ) {
          return firstDate.format(
            "MMM DD, YYYY"
          );
        }

        return `${firstDate.format(
          "MMM DD, YYYY"
        )} - ${lastDate.format(
          "MMM DD, YYYY"
        )}`;
      }
    }

    return "N/A";
  };

  // =========================================================
  // Modal Totals
  // =========================================================

  const modalTotalOrders =
    orderDetails.length;

  const modalTotalCod =
    orderDetails.reduce(
      (
        sum: number,
        order: any
      ) => {
        return (
          sum +
          Number(
            order?.codAmount || 0
          )
        );
      },
      0
    );

  // =========================================================
  // Close Modal
  // =========================================================

  const handleCloseModal = () => {
    setSelectedRow(null);
    setOrderDetails([]);
  };

  // =========================================================
  // Print
  // =========================================================

  const handlePrint = () => {
    if (!printRef.current) {
      return;
    }

    const printContent =
      printRef.current.innerHTML;

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1200,height=900"
      );

    if (!printWindow) {
      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Shipment Summary -
            ${
              selectedRow?.deliveryPartner ||
              "Delivery Partner"
            }
          </title>

          <style>

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #111;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            body {
              padding: 12mm;
            }

            .print-container {
              width: 100%;
            }

            /* =================================================
               REPORT HEADER
            ================================================= */

            .report-header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 14px;
              margin-bottom: 20px;
            }

            .report-header h2 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }

            .report-header p {
              margin: 5px 0 0;
              font-size: 12px;
              color: #666;
            }

            /* =================================================
               SCREEN CARDS
               
               Completely hidden during print
            ================================================= */

            .screen-summary {
              display: none !important;
            }

            /* =================================================
               PRINT SUMMARY ROW
            ================================================= */

            .print-summary {
              display: block !important;
              width: 100%;
              margin-bottom: 25px;
            }

            .print-summary table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }

            .print-summary th {
              background: #f1f1f1 !important;
              font-weight: 700;
              text-align: left;
            }

            .print-summary th,
            .print-summary td {
              border: 1px solid #888;
              padding: 9px 10px;
              font-size: 12px;
              vertical-align: middle;
            }

            .print-summary th:nth-child(1),
            .print-summary td:nth-child(1) {
              width: 25%;
            }

            .print-summary th:nth-child(2),
            .print-summary td:nth-child(2) {
              width: 25%;
            }

            .print-summary th:nth-child(3),
            .print-summary td:nth-child(3) {
              width: 20%;
              text-align: center;
            }

            .print-summary th:nth-child(4),
            .print-summary td:nth-child(4) {
              width: 30%;
              text-align: right;
            }

            /* =================================================
               SECTION TITLE
            ================================================= */

            .section-title {
              font-size: 16px;
              font-weight: 700;
              margin: 0 0 10px;
            }

            /* =================================================
               ORDER TABLE
            ================================================= */

            .order-table {
              width: 100%;
              border-collapse: collapse;
              table-layout: auto;
            }

            .order-table th {
              background: #f1f1f1 !important;
              font-weight: 700;
            }

            .order-table th,
            .order-table td {
              border: 1px solid #999;
              padding: 7px 8px;
              font-size: 10px;
              vertical-align: middle;
            }

            .order-table th {
              white-space: nowrap;
            }

            .order-table td {
              word-break: break-word;
            }

            .order-table thead {
              display: table-header-group;
            }

            .order-table tfoot {
              display: table-footer-group;
            }

            .order-table tr {
              page-break-inside: avoid;
            }

            /* =================================================
               TOTAL ROW
            ================================================= */

            .total-row td {
              border-top: 2px solid #222 !important;
              font-weight: 700;
              background: #fafafa !important;
            }

            /* =================================================
               SIGNATURE
            ================================================= */

            .signature-wrapper {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 55px;
              padding-top: 15px;
            }

            .signature {
              width: 220px;
              text-align: center;
            }

            .signature-line {
              border-top: 1px solid #222;
              padding-top: 7px;
              font-size: 11px;
            }

            .signature-name {
              margin-top: 4px;
              font-size: 12px;
              font-weight: 600;
            }

            /* =================================================
               NO PRINT
            ================================================= */

            .no-print {
              display: none !important;
            }

            /* =================================================
               PAGE
            ================================================= */

            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            @media print {

              html,
              body {
                width: 100%;
                background: #fff;
              }

              body {
                padding: 0;
              }

              .screen-summary {
                display: none !important;
              }

              .print-summary {
                display: block !important;
              }

              .no-print {
                display: none !important;
              }

              .order-table thead {
                display: table-header-group;
              }

              .order-table tfoot {
                display: table-footer-group;
              }

              tr {
                page-break-inside: avoid;
              }

            }

          </style>

        </head>

        <body>

          <div class="print-container">

            ${printContent}

          </div>

        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();

      printWindow.close();
    }, 500);
  };

  return (
    <div>

      {/* =====================================================
          MAIN REPORT TABLE
      ===================================================== */}

      <div className="table_wrapper custom_scroll">

        <table className="report-table">

          <thead>

            <tr>

              <th>
                Delivery Partner
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Delivery Charge
              </th>

              <th
                style={{
                  textAlign: "center",
                }}
              >
                Order Qty
              </th>

              <th
                style={{
                  textAlign: "center",
                }}
              >
                Product Qty
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Product Price
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Total
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Total Advance Paid Amount
              </th>

              <th>
                Payment Method
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Total Paid Amount
              </th>

              <th
                style={{
                  textAlign: "right",
                }}
              >
                Due Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {reports?.data?.map(
              (
                row: any,
                i: number
              ) => {

                const payments =
                  row?.payments?.length
                    ? row.payments
                    : [
                        {
                          method: "N/A",
                          amount: 0,
                        },
                      ];

                return payments.map(
                  (
                    payment: any,
                    j: number
                  ) => (

                    <tr
                      key={`${i}-${j}`}
                      onClick={() =>
                        handleRowClick(row)
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                      className="hover:bg-gray-50"
                    >

                      {/* =================================================
                          FIRST ROW CELLS
                      ================================================= */}

                      {j === 0 && (
                        <>
                          <td
                            rowSpan={
                              payments.length
                            }
                            align="center"
                          >
                            {row?.deliveryPartner ||
                              "N/A"}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.deliveryCharge
                            )}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "center",
                            }}
                          >
                            {row?.orderQty ||
                              0}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "center",
                            }}
                          >
                            {row?.productQty ||
                              0}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.productPrice
                            )}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.total
                            )}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.advancePaid
                            )}
                          </td>
                        </>
                      )}

                      {/* =================================================
                          PAYMENT METHOD
                      ================================================= */}

                      <td>
                        {payment?.method ||
                          "N/A"}

                        {" "}

                        (
                        {formatMoney(
                          payment?.amount
                        )}
                        )
                      </td>

                      {/* =================================================
                          TOTAL PAID / DUE
                      ================================================= */}

                      {j === 0 && (
                        <>
                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.totalPaid
                            )}
                          </td>

                          <td
                            rowSpan={
                              payments.length
                            }
                            style={{
                              textAlign:
                                "right",
                            }}
                          >
                            {formatMoney(
                              row?.dueAmount
                            )}
                          </td>
                        </>
                      )}

                    </tr>

                  )
                );
              }
            )}

          </tbody>

          {/* =====================================================
              MAIN TOTAL
          ===================================================== */}

          <tfoot>

            <tr>

              <td
                style={{
                  fontWeight:
                    "bold",
                }}
              >
                Total
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.deliveryCharge
                )}
              </td>

              <td
                style={{
                  textAlign:
                    "center",
                  fontWeight:
                    "bold",
                }}
              >
                {totals.orderQty}
              </td>

              <td
                style={{
                  textAlign:
                    "center",
                  fontWeight:
                    "bold",
                }}
              >
                {totals.productQty}
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.productPrice
                )}
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.total
                )}
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.advancePaid
                )}
              </td>

              <td
                style={{
                  textAlign:
                    "center",
                  fontWeight:
                    "bold",
                }}
              >
                —
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.totalPaid
                )}
              </td>

              <td
                style={{
                  textAlign:
                    "right",
                  fontWeight:
                    "bold",
                }}
              >
                {formatMoney(
                  totals.dueAmount
                )}
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <Modal
        open={!!selectedRow}
        onCancel={
          handleCloseModal
        }
        footer={null}
        width={1100}
        centered
        title={null}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >

        {/* ===================================================
            PRINT AREA
        =================================================== */}

        <div ref={printRef}>

          <div
            style={{
              background:
                "#fff",

              padding:
                "30px",

              fontFamily:
                "Arial, Helvetica, sans-serif",
            }}
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="report-header"
              style={{
                textAlign:
                  "center",

                // borderBottom:
                //   "2px solid #222",

                paddingBottom:
                  "15px",

                marginBottom:
                  "20px",
              }}
            >

              <h2
                style={{
                  margin: 0,

                  fontSize:
                    "24px",

                  fontWeight:
                    700,
                }}
              >
                Shipment Summary
              </h2>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "12px",

                  color:
                    "#666",
                }}
              >
                Delivery Shipment Report
              </p>

            </div>

            {/* =================================================
                SCREEN SUMMARY CARDS

                These show only on screen.
                They are hidden during print.
            ================================================= */}

            <div
              className="screen-summary"
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap:
                  "14px",

                marginBottom:
                  "25px",
              }}
            >

              {/* Delivery Partner */}

              <div
                style={{
                  border:
                    "1px solid #ddd",

                  padding:
                    "14px 16px",

                  borderRadius:
                    "6px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#777",

                    marginBottom:
                      "5px",
                  }}
                >
                  Delivery Partner
                </div>

                <div
                  style={{
                    fontSize:
                      "17px",

                    fontWeight:
                      700,
                  }}
                >
                  {selectedRow?.deliveryPartner ||
                    "N/A"}
                </div>

              </div>

              {/* In Transit */}

              <div
                style={{
                  border:
                    "1px solid #ddd",

                  padding:
                    "14px 16px",

                  borderRadius:
                    "6px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#777",

                    marginBottom:
                      "5px",
                  }}
                >
                  In-Transit Date
                </div>

                <div
                  style={{
                    fontSize:
                      "15px",

                    fontWeight:
                      600,
                  }}
                >
                  {getTransitDate()}
                </div>

              </div>

              {/* Total Orders */}

              <div
                style={{
                  border:
                    "1px solid #ddd",

                  padding:
                    "14px 16px",

                  borderRadius:
                    "6px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#777",

                    marginBottom:
                      "5px",
                  }}
                >
                  Total Orders
                </div>

                <div
                  style={{
                    fontSize:
                      "22px",

                    fontWeight:
                      700,
                  }}
                >
                  {isFetching
                    ? "..."
                    : modalTotalOrders}
                </div>

              </div>

              {/* Total COD */}

              <div
                style={{
                  border:
                    "1px solid #ddd",

                  padding:
                    "14px 16px",

                  borderRadius:
                    "6px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#777",

                    marginBottom:
                      "5px",
                  }}
                >
                  Total COD Amount
                </div>

                <div
                  style={{
                    fontSize:
                      "22px",

                    fontWeight:
                      700,
                  }}
                >
                  {isFetching
                    ? "..."
                    : formatMoney(
                        modalTotalCod
                      )}
                </div>

              </div>

            </div>

            {/* =================================================
                PRINT ONLY SUMMARY ROW
            ================================================= */}

            <div
              className="print-summary"
              style={{
                display:
                  "none",
              }}
            >

              <table
                style={{
                  width:
                    "100%",

                  borderCollapse:
                    "collapse",

                  marginBottom:
                    "25px",
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={
                        printThStyle
                      }
                    >
                      Delivery Partner
                    </th>

                    <th
                      style={
                        printThStyle
                      }
                    >
                      In-Transit Date
                    </th>

                    <th
                      style={
                        printThCenterStyle
                      }
                    >
                      Total Orders
                    </th>

                    <th
                      style={
                        printThRightStyle
                      }
                    >
                      Total COD Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td
                      style={
                        printTdStyle
                      }
                    >
                      {selectedRow?.deliveryPartner ||
                        "N/A"}
                    </td>

                    <td
                      style={
                        printTdStyle
                      }
                    >
                      {getTransitDate()}
                    </td>

                    <td
                      style={
                        printTdCenterStyle
                      }
                    >
                      {modalTotalOrders}
                    </td>

                    <td
                      style={
                        printTdRightStyle
                      }
                    >
                      {formatMoney(
                        modalTotalCod
                      )}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            {/* =================================================
                ORDER DETAILS HEADER
            ================================================= */}

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "12px",
              }}
            >

              <h3
                className="section-title"
                style={{
                  margin: 0,

                  fontSize:
                    "17px",

                  fontWeight:
                    700,
                }}
              >
                Order Details
              </h3>

              {/* Print Button */}

              <Button
                className="no-print"
                type="primary"
                icon={
                  <PrinterOutlined />
                }
                onClick={
                  handlePrint
                }
                disabled={
                  isFetching ||
                  !orderDetails.length
                }
              >
                Print
              </Button>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {isFetching ? (

              <div
                style={{
                  textAlign:
                    "center",

                  padding:
                    "70px 0",
                }}
              >

                <Spin size="large" />

                <div
                  style={{
                    marginTop:
                      "15px",

                    color:
                      "#666",
                  }}
                >
                  Loading shipment
                  details...
                </div>

              </div>

            ) : (

              <>

                {/* =================================================
                    ORDER DETAILS TABLE
                ================================================= */}

                <div
                  className="custom_scroll"
                  style={{
                    maxHeight:
                      "55vh",

                    overflowY:
                      "auto",

                    border:
                      "1px solid #ddd",
                  }}
                >

                  <table
                    className="order-table"
                    style={{
                      width:
                        "100%",

                      borderCollapse:
                        "collapse",
                    }}
                  >

                    <thead>

                      <tr>

                        <th
                          style={
                            thStyle
                          }
                        >
                          SL
                        </th>

                        <th
                          style={
                            thStyle
                          }
                        >
                          In-Transit Date
                        </th>

                        <th
                          style={
                            thStyle
                          }
                        >
                          Invoice No
                        </th>

                        <th
                          style={
                            thStyle
                          }
                        >
                          Delivery ID
                        </th>

                        <th
                          style={
                            thStyle
                          }
                        >
                          Name
                        </th>

                        <th
                          style={
                            thStyle
                          }
                        >
                          Mobile No.
                        </th>

                        <th
                          style={{
                            ...thStyle,

                            textAlign:
                              "right",
                          }}
                        >
                          COD Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {orderDetails.length ? (

                        orderDetails.map(
                          (
                            order: any,
                            idx: number
                          ) => (

                            <tr
                              key={`${order?.invoiceNumber || "order"}-${idx}`}
                            >

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {idx + 1}
                              </td>

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {order?.inTransitDate
                                  ? dayjs(
                                      order.inTransitDate
                                    ).format(
                                      "MMM DD, YYYY"
                                    )
                                  : "N/A"}
                              </td>

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {order?.invoiceNumber ||
                                  "N/A"}
                              </td>

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {order?.trackingId ||
                                  "N/A"}
                              </td>

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {order?.name ||
                                  "N/A"}
                              </td>

                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {order?.mobileNo ||
                                  "N/A"}
                              </td>

                              <td
                                style={{
                                  ...tdStyle,

                                  textAlign:
                                    "right",

                                  fontWeight:
                                    600,
                                }}
                              >
                                {formatMoney(
                                  order?.codAmount
                                )}
                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan={7}
                            style={{
                              textAlign:
                                "center",

                              padding:
                                "30px",

                              color:
                                "#777",
                            }}
                          >
                            No order details
                            found
                          </td>

                        </tr>

                      )}

                    </tbody>

                    {/* =================================================
                        TOTAL COD
                    ================================================= */}

                    {orderDetails.length >
                      0 && (

                      <tfoot>

                        <tr
                          className="total-row"
                        >

                          <td
                            colSpan={6}
                            style={{
                              padding:
                                "12px 10px",

                              // borderTop:
                              //   "2px solid #222",

                              textAlign:
                                "right",

                              fontWeight:
                                700,
                            }}
                          >
                            Total COD Amount
                          </td>

                          <td
                            style={{
                              padding:
                                "12px 10px",

                              // borderTop:
                              //   "2px solid #222",

                              textAlign:
                                "right",

                              fontWeight:
                                700,
                            }}
                          >
                            {formatMoney(
                              modalTotalCod
                            )}
                          </td>

                        </tr>

                      </tfoot>

                    )}

                  </table>

                </div>

                {/* =================================================
                    SIGNATURE
                ================================================= */}

                <div
                  className="signature-wrapper"
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "flex-end",

                    marginTop:
                      "40px",

                    paddingTop:
                      "20px",

              
                  }}
                >

                  {/* GhorerBazar */}

                  <div
                    className="signature"
                    style={{
                      width:
                        "200px",

                      textAlign:
                        "center",
                    }}
                  >

                    <div
                      className="signature-line"
                      style={{
                        borderTop:
                          "1px solid #222",

                        paddingTop:
                          "7px",

                        fontSize:
                          "12px",
                      }}
                    >
                      Authorized Signature
                    </div>

                    <div
                      className="signature-name"
                      style={{
                        marginTop:
                          "4px",

                        fontWeight:
                          600,
                      }}
                    >
                      GhorerBazar
                    </div>

                  </div>

                  {/* Delivery Partner */}

                  <div
                    className="signature"
                    style={{
                      width:
                        "200px",

                      textAlign:
                        "center",
                    }}
                  >

                    <div
                      className="signature-line"
                      style={{
                        borderTop:
                          "1px solid #222",

                        paddingTop:
                          "7px",

                        fontSize:
                          "12px",
                      }}
                    >
                      Authorized Signature
                    </div>

                    <div
                      className="signature-name"
                      style={{
                        marginTop:
                          "4px",

                        fontWeight:
                          600,
                      }}
                    >
                      {selectedRow?.deliveryPartner ||
                        "Delivery Partner"}
                    </div>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      </Modal>

    </div>
  );
};

// =========================================================
// Screen Table Header Style
// =========================================================

const thStyle: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

// =========================================================
// Screen Table Data Style
// =========================================================

const tdStyle: React.CSSProperties = {
  padding: "9px 8px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};

// =========================================================
// Print Header Styles
// =========================================================

const printThStyle: React.CSSProperties = {
  border: "1px solid #999",
  padding: "10px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: "12px",
};

// =========================================================
// Print Header Center
// =========================================================

const printThCenterStyle: React.CSSProperties = {
  ...printThStyle,
  textAlign: "center",
};

// =========================================================
// Print Header Right
// =========================================================

const printThRightStyle: React.CSSProperties = {
  ...printThStyle,
  textAlign: "right",
};

// =========================================================
// Print TD
// =========================================================

const printTdStyle: React.CSSProperties = {
  border: "1px solid #999",
  padding: "10px",
  fontSize: "12px",
};

// =========================================================
// Print TD Center
// =========================================================

const printTdCenterStyle: React.CSSProperties = {
  ...printTdStyle,
  textAlign: "center",
};

// =========================================================
// Print TD Right
// =========================================================

const printTdRightStyle: React.CSSProperties = {
  ...printTdStyle,
  textAlign: "right",
  fontWeight: 700,
};

export default ShipmentReportTable;