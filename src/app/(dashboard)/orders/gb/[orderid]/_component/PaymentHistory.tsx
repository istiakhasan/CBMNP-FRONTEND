import moment from "moment";
import React from "react";

const PaymentHistory = ({ data }: any) => {
    const _data = data?.transation_info;
    const sortTransation = [...(_data || [])].reverse();
  return (
    <div className="responsive_order_details_view_table mt-3  min-h-[300px] py-[30px]">
       <h1 className="font-semibold  text-[18px] mb-3">Payment History</h1> 
      <table>
        <thead>
            <tr>
                <th style={{background:"white"}}>Date&Time</th>
                <th style={{background:"white"}}>Payment Status</th>
                <th style={{background:"white"}}>Payment Method</th>
                <th style={{background:"white"}}>TrxID</th>
                <th style={{background:"white"}}>Paid Amount</th>
                <th style={{background:"white"}}>Total Paid Amount</th>
                <th style={{background:"white"}}>Due Amount</th>
                <th style={{background:"white"}}>Total </th>
            </tr>
        </thead>
        <tbody>
        {
            sortTransation?.reverse()?.map((item:any,i:any)=>(
           <tr key={i}>
                <td> {moment(item?.created_at).format("hh:mm A [On] D MMM YYYY")}</td>
                <td>{item?.paymentStatus || "N/A"}</td>
                <td>{item?.paymentMethods || "N/A"}</td>
                <td>{item?.transactionId || "N/A"}</td>
                <td ><span className="font-semibold">BDT:  {item?.paidAmount?.toFixed(2) || "N/A"}</span></td>
                <td ><span className="font-semibold">BDT:  {item?.totalPaidAmount?.toFixed(2) || "N/A"}</span></td>
                <td ><span className="font-semibold">BDT:  {item?.dueAmount?.toFixed(2) || 0}</span></td>
                <td><span className="font-semibold">BDT:  {item?.totalPurchaseAmount?.toFixed(2) || "N/A"} </span></td>
            </tr>
            ))
        }
            
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
