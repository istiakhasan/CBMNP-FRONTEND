import moment from "moment";
import React from "react";

const PaymentHistory = ({ data }: any) => {
    const _data = data?.paymentHistory;
    const sortTransation = [...(_data || [])].reverse();
  return (
    <div className="responsive_order_details_view_table   min-h-[300px]  mt-4">
      
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
                <td> {moment(item?.createdAt).format("hh:mm A [On] D MMM YYYY")}</td>
                <td>{item?.paymentStatus || "N/A"}</td>
                <td>{item?.paymentMethod || "N/A"}</td>
                <td>{item?.transactionId || "N/A"}</td>
                <td ><span className="font-semibold">BDT:  {item?.paidAmount || "N/A"}</span></td>
                <td ><span className="font-semibold">BDT:  {data?.totalPaidAmount || "N/A"}</span></td>
                <td ><span className="font-semibold">BDT:  {data?.totalReceiveAbleAmount || 0}</span></td>
                <td><span className="font-semibold">BDT:  {data?.totalPrice  || "N/A"} </span></td>
            </tr>
            ))
        }
            
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
