'use client'
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { useGetSinglerequistionQuery } from "@/redux/api/requisitionApi";
import React, { useRef } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";

const ViewRequisition = ({ rowData }: { rowData: any }) => {
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Requisition_${rowData?.id}`,
  });

  const { data, isLoading } = useGetSinglerequistionQuery({
    id: rowData?.id,
  });
  const { data: organization } = useGetOrganizationByIdQuery(undefined);

  if (isLoading) return <p>Loading requisition...</p>;
  if (!data) return <p>No requisition data found.</p>;

  const requisition = data;

  return (
    <div className="py-6 bg-white rounded-lg mx-auto relative">
      <button
        onClick={reactToPrintFn}
        className="bg-primary hover:bg-primary text-white font-bold text-[12px] px-[20px] py-[5px] flex items-center gap-2 absolute left-0 top-[20px] rounded-md transition"
      >
        <AiOutlinePrinter /> Print
      </button>

      <div ref={contentRef} className="print-area">
        <div >

     
        {/* Organization Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">{organization?.data?.name}</h1>
          <p className="text-base text-gray-700">{organization?.data?.address}</p>
          <p className="text-base text-gray-700">
            Phone: +88{organization?.data?.phone}
          </p>
        </div>

        {/* Requisition Info */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Requisition #{requisition.requisitionNumber}
          </h2>
          <p className="text-gray-700">
            Date: {new Date(requisition.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Table */}
        <table className="requistion_form_table w-full border-collapse border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 text-left">Product Name</th>
              <th className="border border-gray-300 py-2 px-4 text-left">Pack Size</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Qty</th>
            </tr>
          </thead>
          <tbody>
            {requisition.products?.map((product: any, idx: number) => {
              const totalQuantity = product.orders.reduce(
                (sum: number, order: any) => sum + order.qty,
                0
              );
              return (
                <tr key={idx}>
                  <td className="border border-gray-300 py-2 px-4">{product.productName}</td>
                  <td className="border border-gray-300 py-2 px-4">{product.packSize}</td>
                  <td className="border border-gray-300 py-2 px-4 text-center">{totalQuantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer / Signature */}
        <div className="flex justify-between mt-12 text-center">
          <div>
            <p style={{ color: "rgba(0, 0, 0, .2)" }} className="font-medium mb-1">
              __________________________
            </p>
            <p>Prepared By</p>
          </div>
          <div>
            <p style={{ color: "rgba(0, 0, 0, .2)" }} className="font-medium mb-1">
              __________________________
            </p>
            <p>Approved By</p>
          </div>
        </div>
           </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .print-area {
            width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            padding: 20mm;
            margin: auto;
            background: #fff;
            color: #000;
            font-size: 12pt;
          }
          .requistion_form_table th,
          .requistion_form_table td {
            border: 1px solid #000 !important;
            padding: 6px 10px;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewRequisition;
