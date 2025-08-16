/* eslint-disable @next/next/no-img-element */
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import moment from "moment";
import React from "react";
import Barcode from "react-barcode";
const PosPrint = ({responseData}:{responseData:any}) => {
  const handlePrint = () => {
    window.print();
  };
  const { data } = useGetOrganizationByIdQuery(undefined);
  const organization = data?.data;

  return (
    <div className="pos-body">
      <div className="icon-head text-center flex items-center justify-center">
        <img
          src={organization?.logo}
          width={100}
          height={30}
          alt="Receipt Logo"
        />
      </div>

      <div className="text-center info ">
        <h6>{organization?.name}</h6>
        <p className="mb-0">Phone Number: {organization?.phone}</p>
       {organization?.email &&  <p className="mb-0">
          Email: <a href="mailto:example@gmail.com">{organization?.email || 'N/A'}</a>
        </p>}
      </div>

      <div className="tax-invoice">
        <h6 className="text-center">Invoice</h6>
        <div className="grid grid-cols-2">
          <div className="">
            <div className="invoice-user-name">
              <span>Name: </span>{responseData?.receiverName}
            </div>
            <div className="invoice-user-name">
              <span>Invoice No: </span>{responseData?.invoiceNumber}
            </div>
          </div>
          <div className="">
            <div className="invoice-user-name">
              <span>Customer Id: </span>{responseData?.customerId}
            </div>
            <div className="invoice-user-name">
              <span>Date: </span>{moment(responseData?.createdAt).format('DD.MM.yyyy')}
            </div>
          </div>
        </div>
      </div>

      <table className="table-borderless w-100 table-fit">
        <thead>
          <tr>
            <th># Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th style={{textAlign:"end"}}>Total</th>
          </tr>
        </thead>
        <tbody>
         {
          responseData?.products?.map((item:any,i:any)=>(
            <tr key={i}>
            <td>1.{item?.product?.name}</td>
            <td>{item?.productPrice}</td>
            <td>{item?.productQuantity}</td>
            <td className="text-end">{item?.subtotal}</td>
          </tr>
          ))
         }
          
          <tr>
            <td colSpan={4}>
              <table className="table-borderless w-100 table-fit">
                <tbody>
                  <tr>
                    <td className="fw-bold">Sub Total :</td>
                    <td className="text-end">{responseData?.productValue}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Discount :</td>
                    <td className="text-end">{responseData?.discount}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Shipping :</td>
                    <td className="text-end">{responseData?.shippingCharge}</td>
                  </tr>
                  {/* <tr>
                    <td className="fw-bold">Tax (5%) :</td>
                    <td className="text-end">{((responseData?.productValue ?? 0) * (taxRate / 100)).toFixed(2)}</td>
                  </tr> */}
                  <tr>
                    <td className="fw-bold">Total Bill :</td>
                    <td className="text-end">{Number(responseData?.productValue)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Due :</td>
                    <td className="text-end">0</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Total Payable :</td>
                    <td className="text-end">{Number(responseData?.productValue)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-center invoice-bar">
        <div className="border-bottom border-dashed">
          <p>
            **VAT against this challan is payable through central registration.
            Thank you for your business!
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Barcode value={responseData?.orderNumber} displayValue={false} className="w-[158px] h-[55px]" />
        </div>

        <p className="text-dark fw-bold">Sale 31</p>
        <p>Thank You For Shopping With Us. Please Come Again</p>
        <button className="btn btn-md btn-primary" onClick={handlePrint}>
          Print Receipt
        </button>
      </div>

      <div className="flex justify-center items-center mt-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary  text-white text-sm font-medium rounded-lg shadow transition-all">
        <i className="ri-printer-line text-lg"></i>
        Print Receipt
      </button>
      </div>
    </div>
  );
};

export default PosPrint;
