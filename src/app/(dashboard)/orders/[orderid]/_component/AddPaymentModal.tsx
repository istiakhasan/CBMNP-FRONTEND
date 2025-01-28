
"use client"
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useAddPaymentMutation } from "@/redux/api/orderApi";

import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

const AddPaymentModal = ({ setModalOpen ,rowData}: any) => {

   const userInfo:any=getUserInfo()  
  const [addPaymentHandler]=useAddPaymentMutation()
  const {watch,handleSubmit,setValue}=useFormContext()
  const onsubmit=async(data:any)=>{
    try {
         const payload:any={
            paidAmount:data?.paymentStatus?.label==="Paid"? Number(rowData?.totalPrice)-Number(rowData?.totalPaidAmount):data?.paidAmount,
            paymentStatus: data?.paymentStatus?.label,
            transactionId: data?.transactionId || "",
            paymentMethod: data["paymentMethod"]?.value,
            orderId: rowData?.id,
            userId: userInfo?.userId,
         }
         console.log(payload,"payload");
        const res = await addPaymentHandler({ id: rowData?.id, data:payload });
        if (res) {
          message.success("Payment added");
          setModalOpen(false)
        }
      } catch (error) {
        message.error("Something went wrong");
        setModalOpen(false)
      }
  }


 
  return (
    <div className="p-[15px] bg-[#FFFFFF]">
      <div className="flex justify-between mb-6">
        <h1 className="font-[600] text-[#242529] text-[16px]">Add Payment</h1>
        <svg
          onClick={() => setModalOpen(false)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>

     
     
        <div className="mb-4">
              <GbFormSelect
                name="paymentStatus"
                options={[
                  {
                    label: "Pending",
                    value: "Pending",
                  },
                  {
                    label: "Paid",
                    value: "Paid",
                  },
                  {
                    label: "Partial",
                    value: "Partial",
                  },
                ]}
                handleChange={(v: any) => {
                  setValue("paymentMethod", null);
                  if (v?.value === "Pending") {
                    setValue("paymentMethod", {
                      label: "COD",
                      value: "COD",
                    });

                    setValue("paidAmount",0);
                  }
                  if (v?.value === "Paid") {
                    setValue("paidAmount",rowData?.last_transaction?.dueAmount);
                  }
                }}
                label="Payment Status"
              />
            </div>
            <div className="mb-4">
              <GbFormSelect
                disabled={
                  watch()?.paymentStatus?.value === "Pending" ? true : false
                }
                name="paymentMethod"
                options={[
                  ...(watch()?.paymentStatus?.value === "Pending"
                    ? [
                        {
                          label: "COD",
                          value: "COD",
                        },
                      ]
                    : []),
                  {
                    label: "Bkash Personal",
                    value: "Bkash Personal",
                  },
                  {
                    label: "Bkash Agent",
                    value: "Bkash Agent",
                  },
                  {
                    label: "Bkash Merchant",
                    value: "Bkash Merchant",
                  },
                  {
                    label: "Bkash GB-Agent",
                    value: "Bkash GB-Agent",
                  },
                  {
                    label: "Nagad(nur)",
                    value: "Nagad(nur)",
                  },
                  {
                    label: "Bank Payment",
                    value: "Bank Payment",
                  },
                ]}
                label="Payment method"
              />
            </div>
            {watch()?.paymentStatus?.value === "Partial" && (
              <div className="mb-4">
                <GbFormInput name="paidAmount" label="Amount" />
              </div>
            )}
            {(watch()?.paymentStatus?.value === "Paid" ||
              watch()?.paymentStatus?.value === "Partial") && (
              <div className="mb-4">
                <GbFormInput name="transactionId" label="TrxID" />
              </div>
            )}


       <div className="mt-6 flex justify-end gap-3">
       <button 
         onClick={()=>setModalOpen(false)}
          className={` ${
            true ? "border-[#4F8A6D] text-[#4F8A6D]" : "bg-[#CACACA]"
          }  border-[rgba(0,0,0,.2)] border  font-bold px-[30px] py-[5px]`}
        >
          Cancel
        </button>
       <button 
          onClick={handleSubmit(onsubmit)}
          className={` ${
            true ? "bg-[#4F8A6D]" : "bg-[#CACACA]"
          } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]`}
        >
          Confirm
        </button>
       </div>
     
    </div>
  );
};

export default AddPaymentModal;
