"use client";

import React, { useRef } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";

import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { useGetSinglerequistionQuery } from "@/redux/api/requisitionApi";

interface ViewRequisitionProps {
  rowData: {
    id: number | string;
  };
}

/* -------------------------------------------
   Print CSS as a plain string.
   Passed to react-to-print's `pageStyle` option so it is
   guaranteed to be injected into the print iframe — it does
   NOT depend on react-to-print extracting document.styleSheets
   (which is what breaks with styled-jsx / antd cssinjs).
-------------------------------------------- */
const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 12mm;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    margin: 0;
    padding: 0;
    background: #ffffff !important;
  }

  .rq-document {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #222222;
  }

  .rq-header {
    text-align: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #d9d9d9;
  }

  .rq-header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111111;
  }

  .rq-header p {
    margin: 3px 0 0;
    font-size: 11px;
    color: #555555;
  }

  .rq-title {
    text-align: center;
    margin: 14px 0;
  }

  .rq-title h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #111111;
  }

  .rq-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 7px 9px;
    background: #fafafa;
    border: 1px solid #e5e5e5;
  }

  .rq-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rq-meta-label {
    font-size: 11px;
    color: #666666;
  }

  .rq-meta-value {
    font-size: 12px;
    font-weight: 600;
    color: #222222;
  }

  .rq-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .rq-table th,
  .rq-table td {
    border: 1px solid #999999 !important;
  }

  .rq-table th {
    padding: 7px 6px;
    background: #f5f5f5 !important;
    color: #111111 !important;
    font-size: 10px;
    font-weight: 600;
    text-align: left;
    vertical-align: middle;
  }

  .rq-table td {
    padding: 7px 6px;
    font-size: 10px;
    vertical-align: middle;
    color: #222222 !important;
  }

  .rq-col-product { width: 30%; }
  .rq-col-qty { width: 12%; text-align: center !important; }
  .rq-col-order { width: 33%; }
  .rq-col-total { width: 15%; text-align: center !important; }

  .rq-product-name {
    font-size: 11px;
    color: #222222 !important;
  }

  .rq-product-sku,
  .rq-product-pack {
    margin-top: 3px;
    font-size: 8px;
    color: #666666 !important;
  }

  .rq-qty-cell {
    text-align: center;
    font-weight: 500;
  }

  .rq-total-cell {
    text-align: center;
    font-weight: 600;
  }

  /* Keeps every row belonging to one product together so a
     rowSpan'd product/total cell never gets split by a page
     break — the whole product-group either fits on the page
     or moves entirely to the next one. */
  .rq-group {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  .rq-summary {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #999999;
  }

  .rq-summary-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #555555;
  }

  .rq-summary-item strong {
    font-size: 12px;
    color: #222222;
  }

  .rq-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 45px;
    padding: 0 30px;
  }

  .rq-signature-box {
    width: 180px;
    text-align: center;
  }

  .rq-signature-line {
    height: 1px;
    margin-bottom: 6px;
    background: #999999;
  }

  .rq-signature-title {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    color: #333333;
  }

  .rq-signature-name {
    min-height: 16px;
    margin: 3px 0 0;
    font-size: 10px;
    color: #666666;
  }

  .rq-no-print {
    display: none !important;
  }
`;

const ViewRequisition = ({ rowData }: ViewRequisitionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: requisition, isLoading } = useGetSinglerequistionQuery({
    id: rowData?.id,
  });

  const { data: organization, isLoading: organizationLoading } =
    useGetOrganizationByIdQuery(undefined);

const handlePrint = useReactToPrint({
  content: () => contentRef.current,
  documentTitle: requisition?.requisitionNumber
    ? `Requisition_${requisition.requisitionNumber}`
    : `Requisition_${rowData?.id}`,
  pageStyle: PRINT_STYLES,
});

  /* -------------------------------------------
     Loading
  -------------------------------------------- */
  if (isLoading || organizationLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading requisition...</p>
      </div>
    );
  }

  /* -------------------------------------------
     Empty state
  -------------------------------------------- */
  if (!requisition) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">No requisition data found.</p>
      </div>
    );
  }

  const organizationData = organization?.data;

  /* -------------------------------------------
     Precompute per-product totals once, so the table rows
     and the summary section always agree with each other.
  -------------------------------------------- */
  const productsWithTotals = (requisition.products || []).map(
    (product: any) => {
      const orders = product?.orders?.length
        ? product.orders
        : [{ invoiceNumber: "-", qty: 0 }];

      const totalQty =
        product?.totalQty ??
        orders.reduce(
          (sum: number, order: any) => sum + Number(order?.qty || 0),
          0
        );

      return { ...product, orders, totalQty };
    }
  );

  const grandTotalQty = productsWithTotals.reduce(
    (total: number, product: any) => total + Number(product.totalQty || 0),
    0
  );

  return (
    <div className="relative w-full bg-white">
      {/* =====================================================
          PRINT BUTTON
      ====================================================== */}
      <div className="mb-4 flex  ">
        <button
          type="button"
          onClick={() => handlePrint()}
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-primary
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
          "
        >
          <AiOutlinePrinter size={17} />
          Print
        </button>
      </div>

      {/* =====================================================
          DOCUMENT — everything inside this ref gets cloned
          into the print iframe, including the <style> tag
          below, so styling always travels with it.
      ====================================================== */}
      <div ref={contentRef} className="rq-document requisition-document">
        <style>{PRINT_STYLES}</style>

        {/* ===================================================
            HEADER
        ==================================================== */}
        <header className="rq-header">
          <div>
            <h1>{organizationData?.name || "Tabaya"}</h1>

            {organizationData?.address && <p>{organizationData.address}</p>}

            {organizationData?.phone && <p>+88{organizationData.phone}</p>}
          </div>
        </header>

        {/* ===================================================
            DOCUMENT TITLE
        ==================================================== */}
        <div className="rq-title">
          <h2>REQUISITION</h2>
        </div>

        {/* ===================================================
            REQUISITION META
        ==================================================== */}
        <div className="rq-meta">
          <div className="rq-meta-item">
            <span className="rq-meta-label">Requisition No.</span>
            <span className="rq-meta-value">
              {requisition.requisitionNumber}
            </span>
          </div>

          <div className="rq-meta-item">
            <span className="rq-meta-label">Date</span>
            <span className="rq-meta-value">
              {requisition.createdAt
                ? new Date(requisition.createdAt).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short", year: "numeric" }
                  )
                : "-"}
            </span>
          </div>
        </div>

        {/* ===================================================
            PRODUCTS TABLE
        ==================================================== */}
        <table className="rq-table">
          <thead>
            <tr>
              <th className="rq-col-product">Product Name</th>
              <th className="rq-col-qty">Qty</th>
              <th className="rq-col-order">Order Number (Inv)</th>
              <th className="rq-col-total">Total Qty</th>
            </tr>
          </thead>

          {productsWithTotals.map((product: any, productIndex: number) => (
            <tbody key={productIndex} className="rq-group">
              {product.orders.map((order: any, orderIndex: number) => {
                const isFirstRow = orderIndex === 0;

                return (
                  <tr key={`${productIndex}-${orderIndex}`}>
                    {isFirstRow && (
                      <td rowSpan={product.orders.length}>
                        <div className="rq-product-name">
                          {product?.productName || "-"}
                        </div>

                        {product?.sku && (
                          <div className="rq-product-sku">
                            SKU: {product.sku}
                          </div>
                        )}

                        {product?.packSize && product.packSize !== "0 g" && (
                          <div className="rq-product-pack">
                            Pack Size: {product.packSize}
                          </div>
                        )}
                      </td>
                    )}

                    <td className="rq-qty-cell">{order?.qty ?? 0}</td>

                    <td>{order?.invoiceNumber || "-"}</td>

                    {isFirstRow && (
                      <td rowSpan={product.orders.length} className="rq-total-cell">
                        {product.totalQty}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>

        {/* ===================================================
            SUMMARY
        ==================================================== */}
        <div className="rq-summary">
          <div className="rq-summary-item">
            <span>Total Products</span>
            <strong>{productsWithTotals.length}</strong>
          </div>

          <div className="rq-summary-item">
            <span>Total Requested Qty</span>
            <strong>{grandTotalQty}</strong>
          </div>
        </div>

        {/* ===================================================
            FOOTER / SIGNATURE
        ==================================================== */}
        <div className="rq-footer">
          <div className="rq-signature-box">
            <div className="rq-signature-line" />
            <p className="rq-signature-title">Prepared By</p>
            <p className="rq-signature-name">
              {requisition?.prepairedBy || "-"}
            </p>
          </div>

          <div className="rq-signature-box">
            <div className="rq-signature-line" />
            <p className="rq-signature-title">Approved By</p>
            <p className="rq-signature-name">&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequisition;