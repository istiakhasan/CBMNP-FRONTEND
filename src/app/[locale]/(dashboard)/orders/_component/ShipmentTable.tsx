import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import moment from "moment";
import React, { useRef } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
const ShipmentTable = ({ selectedOrders,location }: any) => {

  const {data}=useGetOrganizationByIdQuery(undefined)
  const organization=data?.data
  const totalSalesPrice = selectedOrders?.reduce((acc:any, item:any) => acc + item?.totalPrice, 0);
  const totalshippingCharge = selectedOrders?.reduce((acc:any, item:any) => acc + item?.shippingCharge, 0);
  const totalPaidAmount = selectedOrders?.reduce((acc:any, item:any) => acc + item?.totalPaidAmount, 0);
  const rowData: any = {};
 const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });
  console.log(data,"data",location);
  return (
    <div className="p-[30px]">
             <button 
              onClick={reactToPrintFn} 
              className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] flex items-center gap-2 rounded-md hover:bg-blue-600 transition"
            >
              <AiOutlinePrinter /> Print Invoice
            </button>
      <div  ref={contentRef}>
        <div>
             <h1 className="text-3xl font-semibold mb-0 text-[#000] text-center">{organization?.name}</h1>
                    <h1 className="text-lg mb-0 text-[#000] text-center">{organization?.address}</h1>
                    <h1 className="text-lg mb-0 text-[#000] text-center">+88{organization?.phone}</h1>
                    <div className="flex justify-between">
                      <div className="mb-3">
                        <h2 className="text-[#000] font-[600] mb-0">Bill To: </h2>
                        <h2 className="text-[#000] font-[600] mb-0">{location?.label}</h2>
                        <h2 className="text-[#000] font-[600] mb-0">{rowData?.receiverPhoneNumber}</h2>
                        <h2 className="text-[#000] font-[600] mb-0">{rowData?.receiverAddress}</h2>
                      </div>
                      <div className="mb-3">
                        <h2 className="mb-0">Date: <strong>{moment(rowData?.deliveryDate).format('DD MMMM YYYY')}</strong></h2>
                      </div>
                    </div>
          <table className="warehouse-table">
            <thead>
              <tr>
                <th className="whitespace-nowrap">SL</th>
                <th className="whitespace-nowrap">Order No</th>
                <th className="whitespace-nowrap">Order Date</th>
                <th className="whitespace-nowrap">Payment Method</th>
                <th className="whitespace-nowrap">Sales Price</th>
                <th className="whitespace-nowrap">Shipping Charge</th>
                <th className="whitespace-nowrap">Paid Amount</th>
                <th className="whitespace-nowrap">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrders?.map((item: any, index: any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.orderNumber}</td>
                  <td>
                    <span className="whitespace-nowrap">
                      {moment(item?.createdAt).format("DD-MMM-YYYY")}
                    </span>
                  </td>
                  <td>{item?.paymentMethod}</td>
                  <td>{item?.totalPrice}</td>
                  <td>{item?.shippingCharge}</td>
                  <td>{item?.totalPaidAmount}</td>
                  <td>{item?.paymentDate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td rowSpan={3} style={{ padding: 0 }} colSpan={3}>
                  <div className="mt-3">
                    <h1 className="mb-0 text-[#000] flex items-center gap-3">
                      <i className="ri-discuss-line"></i>{" "}
                      info.mishelinfo@gmail.com
                    </h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3">
                      <i className="ri-global-line"></i> infomishelinfo.com
                    </h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3">
                      <i className="ri-phone-fill"></i> +88{organization?.phone}
                    </h1>
                    <h1 className="mb-0 text-[#000] flex items-center gap-3">
                      <i className="ri-map-pin-line"></i>
                      {organization?.address}
                    </h1>
                  </div>
                </td>
                <td colSpan={2}></td>
                <td colSpan={2} style={{ background: "#F7F7F7" }}>
                  Total Sales Price
                </td>
                <td style={{ background: "#F7F7F7" }}>
                  {Number(totalSalesPrice)}
                </td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td colSpan={2} style={{ background: "#EBEBEB" }}>
                  Total Shipping Charge
                </td>
                <td style={{ background: "#EBEBEB" }}>
                  {totalshippingCharge || "N/A"}
                </td>
              </tr>
              <tr style={{ background: "none" }}>
                <td colSpan={2}></td>
                <td style={{ background: "#4F8A6D" }} colSpan={2}>Total Paid</td>
                <td style={{ background: "#4F8A6D" }}>{totalPaidAmount || 0}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTable;
