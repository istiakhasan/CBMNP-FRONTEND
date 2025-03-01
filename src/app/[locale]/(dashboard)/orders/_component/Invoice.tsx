import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import { AiOutlinePrinter } from "react-icons/ai";
const Invoice = ({ rowData }:any) => {
  const {data}=useGetOrganizationByIdQuery(undefined)
  const organization=data?.data
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });
  return (
    <div>
       <button 
        onClick={reactToPrintFn} 
        className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] flex items-center gap-2 rounded-md hover:bg-blue-600 transition"
      >
        <AiOutlinePrinter /> Print Invoice
      </button>
      <div ref={contentRef}>
        <div>
          <h1 className="text-3xl font-semibold mb-0 text-[#000] text-center">{organization?.name}</h1>
          <h1 className="text-lg mb-0 text-[#000] text-center">{organization?.address}</h1>
          <h1 className="text-lg mb-0 text-[#000] text-center">+88{organization?.phone}</h1>
          <div className="flex justify-between">
            <div className="mb-3">
              <h2 className="text-[#000] font-[600] mb-0">Bill To: </h2>
              <h2 className="text-[#000] font-[600] mb-0">{rowData?.customer?.customerName}</h2>
              <h2 className="text-[#000] font-[600] mb-0">{rowData?.receiverPhoneNumber}</h2>
              <h2 className="text-[#000] font-[600] mb-0">{rowData?.receiverAddress}</h2>
            </div>
            <div className="mb-3">
              <h2 className="mb-0">Invoice No: <strong>{rowData?.invoiceNumber}</strong></h2>
              <h2 className="mb-0">Date: <strong>{moment(rowData?.deliveryDate).format('DD MMMM YYYY')}</strong></h2>
            </div>
          </div>
          <table className="warehouse-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Product Name</th>
                <th>Unit Price (Tk)</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.products?.map((item:any, index:any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.product?.name} {item?.product?.weight} {item?.product?.unit}</td>
                  <td>{item?.productPrice}</td>
                  <td>{item?.productQuantity}</td>
                  <td>{item?.subtotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td rowSpan={3} colSpan={2} style={{ padding: 0 }}>
                  <div className="mt-3">
                    <h1 className="mb-0 text-[#000] flex items-center gap-3"><i className="ri-discuss-line"></i> info.mishelinfo@gmail.com</h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3"><i className="ri-global-line"></i> infomishelinfo.com</h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3"><i className="ri-phone-fill"></i> +001835437676</h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3"><i className="ri-map-pin-line"></i> House-2, Road-16, Block-B, Nikunjo Dhaka-1230</h1>
                  </div>
                </td>
                <td colSpan={2} style={{ background: "#F7F7F7" }}>Sub Total</td>
                <td style={{ background: "#F7F7F7" }}>{Number(rowData?.productValue)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ background: "#EBEBEB" }}>Grand Total</td>
                <td style={{ background: "#EBEBEB" }}>{rowData?.totalPrice}</td>
              </tr>
              <tr style={{background:"#4F8A6D"}}>
                <td colSpan={2}>Due Total</td>
                <td>{rowData?.totalReceiveAbleAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;