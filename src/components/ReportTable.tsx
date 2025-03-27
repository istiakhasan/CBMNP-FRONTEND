"use client";
import moment from "moment";
import React, { useState } from "react";

const ReportTable = ({reports}:any) => {
 return (
    <div>
      <table className="report-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Invoice No</th>
            <th>Item Name</th>
            {/* <th>Warehouse</th> */}
            <th>UoM</th>
            <th style={{textAlign:"end"}}>Order Qty</th>
            <th style={{textAlign:"end"}}>Rcv Qty</th>
            <th style={{textAlign:"end"}}>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {reports?.map((row:any,i:any) => (
            <tr key={i}>
              <td align="center">{i+1}</td>
              <td align="center">{moment(row?.createdAt).format('DD-MM-YYYY')}</td>
              <td align="center">{row?.supplier?.contactPerson}</td>
              <td align="center">{row?.invoiceNumber}</td>
              <td align="center">{row?.items?.map((item:any)=>(
                <p key={item?.id}>{item?.product?.name}</p>
              ))}</td>
              <td align="center">{row?.items?.map((item:any)=>(
                <p key={item?.id}>{item?.product?.unit}</p>
              ))}</td>
              <td style={{textAlign:"end"}}>{row?.items?.map((item:any)=>(
                <p key={item?.id}>{item?.orderedQuantity}</p>
              ))}</td>
              <td style={{textAlign:"end"}}>{row?.items?.map((item:any)=>(
                <p key={item?.id}>{item?.receivedQuantity}</p>
              ))}</td>
              <td style={{textAlign:"end"}} align="center">{row?.items?.map((item:any)=>(
                <p key={item?.id}>{item?.totalPrice}</p>
              ))}</td>
            
            </tr>
          ))}
          <tr>
            <td colSpan={5}></td>
            <td>
              <span className="font-bold text-[14px]">Total </span>
            </td>
            <td style={{textAlign:"end"}}>
              <span className="font-bold text-[14px] text-end">{reports?.reduce((a:any,b:any)=>{
                 const subTotal=b?.items?.reduce((d:any,f:any)=>d+ Number(f.orderedQuantity),0)
                 return a+subTotal
              },0)}</span>
            </td>
            <td style={{textAlign:"end"}}>
              <span className="font-bold text-[14px] text-end">{reports?.reduce((a:any,b:any)=>{
                 const subTotal=b?.items?.reduce((d:any,f:any)=>d+ Number(f.receivedQuantity),0)
                 return a+subTotal
              },0)}</span>
            </td>
            <td style={{textAlign:"end"}}>
              <span className="font-bold text-[14px] text-end">{reports?.reduce((a:any,b:any)=>{
                 const subTotal=b?.items?.reduce((d:any,f:any)=>d+ Number(f.totalPrice),0)
                 return a+subTotal
              },0)}</span>
            </td>
            
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
