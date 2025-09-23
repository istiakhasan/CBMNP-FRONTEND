"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useGetOrdersCountByIdQuery } from "@/redux/api/statusApi";

const CreateCustomerEdit = ({customer}:{customer:any}) => {
  const params = useSearchParams();
  const editAbleCustomerId = params.get("customerId");
  const {data,isLoading}=useGetOrdersCountByIdQuery({
    id:editAbleCustomerId
  })

 if(isLoading){
  return 
 }
 const orderCount=data?.data
  return (
    <div className="w-[400px] h-[90vh] overflow-x-auto  pr-[16px] border-r  custom_scroll">
     
      {Object.values(customer).length > 1 && (
        <div className="">
            <div className="gb_border  mt-3 p-3">
            <div className="mb-2">
              <p className="text-white py-[3px] w-fit text-[10px] px-[15px] bg-primary">
                {customer?.customerType}
              </p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[14px] mb-2">Customer Id</p>
              <p className="text-[#000] font-[14px]">{customer?.customer_Id}</p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[12px] mb-2">Customer Name</p>
              <p className="text-[#000] font-[14px]">
                {customer?.customerName}
              </p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[12px] mb-2">Phone Number</p>
              <p className="text-[#000] font-[14px]">
                {customer?.customerPhoneNumber}
              </p>
            </div>
            <div className="mb-2 flex justify-between  flex-wrap">
              <p className="text-[#6e7c91] font-[12px]">Location</p>
              <p className="text-[#000] font-[14px] ">
                {customer?.address}
              </p>
            </div>
          </div>
          <div className="p-3  bg-[#FFFBF4] mt-3">
            <div className="flex items-center justify-between mb-2  gap-2">
           <div className="flex  items-center gap-3">
           <p className="text-[#000] font-[500]    text-[14px]">
                Ongoing Orders
              </p>
             
              <div className="bar-spinner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
           </div>


              <span className="bg-[#F6B44F] px-[15px] py-[5px] font-bold">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Total"
                  )?.count
                }
              </span>
            </div>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Total:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Total"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Approved:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
                {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Approved"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Cancel:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
                {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Cancel"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Pending:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Pending"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Store:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Store"
                  )?.count
                }
              </span>
            </p>
            {(customer?.orders?.length>5?customer?.orders?.slice(0,5):customer?.orders)?.map((abc: any, i: any) => (
              <div className="bg-white py-3 mb-2" key={i}>
                <div className="flex justify-between">
                  <p className="color_primary font-semibold">
                    {abc?.orderNumber}
                  </p>
                  <p className="bg-[#FFFBF4] px-[15px] py-1 text-[#7a5927] font-semibold ">
                    {abc?.orderStatus?.name}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-[600] text-[#242529] text-[12px]">
                    BDT:{" "}
                    {abc?.order_info
                      ?.reduce((a: any, b: any) => a + b.subTotal, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-[#7d7d7d] font-[500] text-[12px] pr-[15px]">
                    {moment(abc?.created_at).format("MMM D, YYYY, h:mm A")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        

        </div>
      )}
    </div>
  );
};

export default CreateCustomerEdit;
