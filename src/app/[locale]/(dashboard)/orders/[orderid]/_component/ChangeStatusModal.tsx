import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";

import {
  useChangeOrderStatusMutation,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormContext } from "react-hook-form";

const ChangeStatusModal = ({ setModalOpen, rowData }: any) => {
   const [handleUpdateOrder] = useChangeOrderStatusMutation()
  const userInfo: any = getUserInfo();
  const router=useRouter()

  const { data: orderStatus } = useGetAllStatusQuery({
    label:rowData?.status?.label
  });
  const { watch, handleSubmit } = useFormContext();
  const onsubmit = async (data: any) => {
    try {

      const res = await handleUpdateOrder({
        id: rowData?.id,
        data:{
          statusId:data?.orderStatus?.value,
          agentId:userInfo.userId,
          ...(data?.orderStatus?.label==="Hold"&&  {onHoldReason:data?.reason?.value,}),
          ...(data?.orderStatus?.label==="Cancel"&&  {onCancelReason:data?.reason?.value,}),
        },
      });
      if (res) {
        message.success("Order update successfully...");
        setModalOpen(false);
      }
    } catch (error) {
      message.error("Something went wrong");
      setModalOpen(false);
    }
  };



  return (
    <div className="p-[15px] bg-[#FFFFFF]">
      <div className="flex justify-between mb-6">
        <h1 className="font-[600] text-[#242529] text-[16px]">Change Status</h1>
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
              name="orderStatus"
              options={orderStatus?.data}
              label="Select Status"
            />
          </div>
          {watch()?.orderStatus?.label !== "Approved" &&
            !!watch()?.orderStatus?.label && (
              <div className="mt-3">
                <GbFormSelect
                  name="reason"
                  options={[
                    {
                      label: "Customer Not interested",
                      value: "Customer Not interested",
                    },
                    { label: "Multiple order", value: "Multiple order" },
                    { label: "Product Stock-out", value: "Product Stock-out" },
                    {
                      label: "Customer Unreachable",
                      value: "Customer Unreachable",
                    },
                    { label: "Delay Delivery", value: "Delay Delivery" },
                    {
                      label: "Urgent delivery (Out-side Dhaka)",
                      value: "Urgent delivery (Out-side Dhaka)",
                    },
                    {
                      label: "Urgent delivery (In Dhaka)",
                      value: "Urgent delivery (In Dhaka)",
                    },
                    { label: "Fake Order", value: "Fake Order" },
                    { label: "Financial Crisis", value: "Financial Crisis" },
                    {
                      label: "Mistakenly placed order by customer",
                      value: "Mistakenly placed order by customer",
                    },
                    {
                      label: "Not interested to pay in advance",
                      value: "Not interested to pay in advance",
                    },
                    { label: "Out of Coverage", value: "Out of Coverage" },
                    { label: "Price Issue", value: "Price Issue" },
                    {
                      label: "Customer Wants to cancel",
                      value: "Customer Wants to cancel",
                    },
                    {
                      label: "Will not available on delivery time",
                      value: "Will not available on delivery time",
                    },
                    { label: "Will order later", value: "Will order later" },
                    { label: "Test Order", value: "Test Order" },
                  ]}
                  label="Select Reason"
                />
              </div>
            )}

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

export default ChangeStatusModal;
