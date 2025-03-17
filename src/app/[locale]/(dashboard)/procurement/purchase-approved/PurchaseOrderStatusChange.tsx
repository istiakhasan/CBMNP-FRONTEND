import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";

import {
  useChangeOrderStatusMutation,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import { useBulkUpdatePOStatusMutation } from "@/redux/api/procurementApi";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormContext } from "react-hook-form";

const PurchaseOrderStatusChange = ({ setModalOpen, selectedOrders }: any) => {
   const [handleUpdateOrderStatus] = useBulkUpdatePOStatusMutation()
   const userInfo: any = getUserInfo();
   console.log(selectedOrders,"abcd");

  const {  handleSubmit } = useFormContext();
  const onsubmit = async (data: any) => {
    try {
   const payload={
    poIds: selectedOrders.map((item:any)=>item?.id), 
    status:data?.status?.value
  }
       
      const res = await handleUpdateOrderStatus(payload);
        
      if (res) {
        message.success("Status change successfully...");
        setModalOpen(false);
      }
    } catch (error) {
      message.error("Something went wrong");
      setModalOpen(false);
    }
  };



  return (
    <div className=" bg-[#FFFFFF]">
      <div className="flex justify-between mb-6">
        <h1 className="font-[600] text-[#242529] text-[16px]">Action</h1>
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
          <div>
            <GbFormSelect
              name="status"
              options={[
                {
                    label:"Processing",
                    value:"Processing"
                },
                {
                    label:"Approved",
                    value:"Approved"
                },
                {
                    label:"Completed",
                    value:"Completed"
                },
                {
                    label:"Cancelled",
                    value:"Cancelled"
                },
              ]}
              label="Select Status"
            />
          </div>
      
 
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className={` ${
                true ? "border-[#4F8A6D] text-[#4F8A6D]" : "bg-[#CACACA]"
              }  border-[rgba(0,0,0,.2)] border  font-bold px-[30px] py-[5px]`}
            >
              Cancel
            </button>
            <button 
              type="button"
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

export default PurchaseOrderStatusChange;
