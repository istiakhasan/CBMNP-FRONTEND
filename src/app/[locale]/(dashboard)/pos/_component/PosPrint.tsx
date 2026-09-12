/* eslint-disable @next/next/no-img-element */
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";
import moment from "moment";
import React from "react";
import Barcode from "react-barcode";

const PosPrint = ({ responseData, onDone }: { responseData: any; onDone?: () => void }) => {
  const { data } = useGetOrganizationByIdQuery(undefined);
  const organization = data?.data;

  const handlePrint = () => window.print();

  return (
    <div className="pos-receipt">
      <div className="pos-receipt-print">
        <div className="pos-receipt-brand">
          {organization?.logo && <img src={organization.logo} alt={organization?.name} />}
          <h6>{organization?.name}</h6>
          <p>{organization?.phone}</p>
          {organization?.email && <p>{organization.email}</p>}
        </div>

        <div className="pos-receipt-meta">
          <div>
            <span>Name</span>
            <strong>{responseData?.receiverName}</strong>
          </div>
          <div>
            <span>Invoice No</span>
            <strong>{responseData?.invoiceNumber}</strong>
          </div>
          <div>
            <span>Customer ID</span>
            <strong>{responseData?.customerId}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{moment(responseData?.createdAt).format("DD.MM.YYYY")}</strong>
          </div>
        </div>

        <table className="pos-receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {responseData?.products?.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item?.product?.name}</td>
                <td>{item?.productPrice}</td>
                <td>{item?.productQuantity}</td>
                <td className="text-end">{item?.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pos-receipt-totals">
          <div>
            <span>Sub total</span>
            <span>{responseData?.productValue}</span>
          </div>
          <div>
            <span>Discount</span>
            <span>{responseData?.discount || 0}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{responseData?.shippingCharge || 0}</span>
          </div>
          <div className="pos-receipt-grand">
            <span>Total payable</span>
            <span>{Number(responseData?.productValue)}</span>
          </div>
          <div>
            <span>Due</span>
            <span>0</span>
          </div>
        </div>

        <div className="pos-receipt-footer">
          <p>VAT against this challan is payable through central registration. Thank you for your business!</p>
          {responseData?.orderNumber && (
            <div className="pos-receipt-barcode">
              <Barcode value={responseData.orderNumber} displayValue={false} height={45} />
            </div>
          )}
          <p className="pos-receipt-thanks">Thank you for shopping with us. Please come again.</p>
        </div>
      </div>

      <div className="pos-receipt-actions">
        <button className="pos-print-btn" onClick={handlePrint}>
          <i className="ri-printer-line" /> Print receipt
        </button>
        {onDone && (
          <button className="pos-done-btn" onClick={onDone}>
            New sale
          </button>
        )}
      </div>
    </div>
  );
};

export default PosPrint;