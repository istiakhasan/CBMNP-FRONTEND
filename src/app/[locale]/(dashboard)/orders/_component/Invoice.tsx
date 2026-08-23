import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { AiOutlinePrinter } from "react-icons/ai";
import Barcode from "react-barcode";

const Invoice = ({ rowData }: any) => {
  const { data } = useGetOrganizationByIdQuery(undefined);
  const organization = data?.data;
  const contentRef = useRef(null);

  const formatDate = (dateString?: string) => {
    if (!dateString)
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
    pageStyle: `
      @page {
        size: 102mm 152mm;
        margin: 0;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
      }
      .invoice-page {
        width: 102mm !important;
        max-height: 148mm !important;
        margin: 0 !important;
        overflow: hidden !important;
        page-break-after: avoid !important;
        page-break-before: avoid !important;
        break-after: avoid !important;
      }
    `,
  });

  return (
    <div>
      {/* Print Button - hidden on print */}
      <button
        onClick={reactToPrintFn}
        className="print:hidden bg-primary text-white font-bold text-[12px] px-[20px] py-[5px] flex items-center gap-2 rounded-md hover:bg-blue-600 transition"
      >
        <AiOutlinePrinter /> Print Invoice
      </button>

      {/* Printable Section - 4x6 (102mm x 152mm) */}
      <div
        ref={contentRef}
        className="invoice-page"
        style={{
          width: "102mm",
          maxHeight: "148mm",
          padding: "3.5mm",
          background: "#fff",
          boxSizing: "border-box",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: "9.5px",
          color: "#1a1a1a",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5mm" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.3px",
            }}
          >
            {organization?.name}
          </div>
          <div style={{ fontSize: "8px", color: "#666", marginTop: "0.5px" }}>
            {organization?.address}
          </div>
          <div style={{ fontSize: "8px", color: "#666" }}>
            +88{organization?.phone}
          </div>
        </div>

        {/* Barcode strip — integrated, bordered, full-width */}
        <div
          style={{
            // border: "1px solid #000",
            borderRadius: "2px",
            padding: "1.5mm 0 0.8mm",
            marginBottom: "1.5mm",
            textAlign: "center",
            background: "#fff",
          }}
        >
          {/* Invoice meta */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.2mm",
            }}
          >
            {/* <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.5px" }}>
            INVOICE
          </div> */}
            <div
              style={{
                textAlign: "right",
                fontSize: "8.5px",
                color: "#333",
                lineHeight: 1.35,
              }}
            >
              <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
                {formatDate(rowData?.deliveryDate || rowData?.createdAt)}
              </div>
            </div>

            <Barcode
              value={rowData?.invoiceNumber || "N/A"}
              format="CODE128"
              width={1.15}
              height={26}
              fontSize={9}
              margin={0}
              marginTop={2}
              displayValue={true}
              textMargin={2}
            />
          </div>
        </div>

        {/* Customer + Status box */}
        <div
          style={{
            background: "#f7f7f7",
            borderRadius: "2px",
            // padding: "1.3mm 2.5mm",
            marginBottom: "1.2mm",
          }}
        >
          <div
            style={{
              fontSize: "7.5px",
              fontWeight: 700,
              color: "#888",
              textTransform: "uppercase",
              marginBottom: "0.5px",
            }}
          >
            Bill To
          </div>
          <div style={{ fontSize: "9.5px", fontWeight: 700 }}>
            {rowData?.customer?.customerName || rowData?.receiverName}
          </div>
          <div style={{ fontSize: "8.5px", color: "#444" }}>
            {rowData?.receiverAddress || "-"}
          </div>
          <div style={{ fontSize: "8.5px", color: "#444" }}>
            {rowData?.receiverPhoneNumber}
          </div>
        </div>

        {/* Item Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.7mm 0",
                  width: "7%",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                SL
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.7mm 1mm",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                SKU
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.7mm 1mm",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                Product
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "0.7mm 0",
                  width: "10%",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "0.7mm 0",
                  width: "17%",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                Price
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "0.7mm 0",
                  width: "17%",
                  fontSize: "8px",
                  borderBottom: "1px solid #000",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rowData?.products?.map((item: any, index: number) => (
              <tr key={index} style={{ borderBottom: "1px dotted #ddd" }}>
                <td style={{ padding: "0.7mm 0", verticalAlign: "top" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "0.7mm 0", verticalAlign: "top" }}>
                  {item?.product?.sku || "N/A"}
                </td>
                <td
                  style={{
                    padding: "0.7mm 1mm",
                    verticalAlign: "top",
                    lineHeight: 1.25,
                  }}
                >
                  {item?.product?.name}{" "}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.7mm 0",
                    verticalAlign: "top",
                  }}
                >
                  {item?.productQuantity}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "0.7mm 0",
                    verticalAlign: "top",
                  }}
                >
                  ৳{item?.productPrice}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "0.7mm 0",
                    verticalAlign: "top",
                    fontWeight: 700,
                  }}
                >
                  ৳{item?.subtotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginTop: "1.2mm", paddingTop: "0.8mm" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.3mm 0",
              fontSize: "8.5px",
              color: "#444",
            }}
          >
            <span>Subtotal</span>
            <span>৳{rowData?.productValue}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.3mm 0",
              fontSize: "8.5px",
              color: "#444",
            }}
          >
            <span>Delivery Charge</span>
            <span>৳{rowData?.shippingCharge}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5mm 0",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            <span>Grand Total</span>
            <span>৳{rowData?.totalPrice}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.7mm 1.5mm",
              fontSize: "9.5px",
              fontWeight: 700,
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: "2px",
              marginTop: "0.4mm",
            }}
          >
            <span>Due</span>
            <span>৳{rowData?.totalReceiveAbleAmount}</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "1.2mm",
            textAlign: "center",
            fontSize: "7px",
            color: "#999",
            borderTop: "1px dashed #ddd",
            paddingTop: "0.8mm",
          }}
        >
          Thank you for your business!
        </div>
      </div>
    </div>
  );
};

export default Invoice;
