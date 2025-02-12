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
                <td ><span >{item?.paidAmount || "N/A"} tk</span></td>
            </tr>
            ))
        }
             <tr>
               
                <td style={{border:0}} colSpan={3}></td>
                <td><strong>Total Paid</strong></td>
                <td ><span className="">{Number(data?.totalPaidAmount).toFixed(2) || "N/A"} tk</span></td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
