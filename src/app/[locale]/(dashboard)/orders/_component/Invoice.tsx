import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { AiOutlinePrinter } from "react-icons/ai";

const Invoice = ({ rowData }: any) => {
  const { data } = useGetOrganizationByIdQuery(undefined);
  const organization = data?.data;
  const contentRef = useRef(null);

  const formatDate = (dateString?: string) => {
    if (!dateString)
      return new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });
console.log(rowData,"row data");
  return (
    <div>
      {/* Print Button */}
      <button
        onClick={reactToPrintFn}
        className="bg-primary text-white font-bold text-[12px] px-[20px] py-[5px] flex items-center gap-2 rounded-md hover:bg-blue-600 transition"
      >
        <AiOutlinePrinter /> Print Invoice
      </button>

      {/* Printable Section */}
      <div ref={contentRef} className="p-8 bg-white" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">{organization?.name}</h1>
            <p className="text-gray-600">{organization?.address}</p>
            <p className="text-gray-600">Phone: +88{organization?.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-1">INVOICE</h2>
            <p className="text-gray-600 mb-1">Invoice #{rowData?.invoiceNumber}</p>
            <p className="text-gray-600">{formatDate(rowData?.deliveryDate)}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
            <p className="font-medium">{rowData?.customer?.customerName}</p>
            <p>{rowData?.receiverAddress || "-"}</p>
            <p>{rowData?.receiverPhoneNumber}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Details:</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">
                  {rowData?.status?.label || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">৳{rowData?.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">SL</th>
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-center">Qty</th>
                <th className="border px-4 py-2 text-right">Price</th>
                <th className="border px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.products?.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {item?.product?.name} {item?.product?.weight} {item?.product?.unit}
                  </td>
                  <td className="border px-4 py-2 text-center">{item?.productQuantity}</td>
                  <td className="border px-4 py-2 text-right">৳{item?.productPrice}</td>
                  <td className="border px-4 py-2 text-right font-medium">
                    ৳{item?.subtotal}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-right font-semibold">
                  Subtotal:
                </td>
                <td className="border px-4 py-2 text-right">৳{rowData?.productValue}</td>
              </tr>
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-right font-semibold">
                  Grand Total:
                </td>
                <td className="border px-4 py-2 text-right font-bold">৳{rowData?.totalPrice}</td>
              </tr>
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-right font-semibold">
                  Due:
                </td>
                <td className="border px-4 py-2 text-right text-red-600">
                  ৳{rowData?.totalReceiveAbleAmount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
