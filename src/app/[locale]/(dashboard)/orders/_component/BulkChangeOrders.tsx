import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";

import {
  useChangeHoldOrderStatusMutation,
  useChangeOrderStatusMutation,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

const BulkChangeOrders = ({ setModalOpen, selectedOrders, status }: any) => {
  const [handleUpdateOrder] = useChangeOrderStatusMutation();
  const [handleHoldUpdateOrderStatus] = useChangeHoldOrderStatusMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const userInfo: any = getUserInfo();
  const router = useRouter();

  const { data: userData } = useGetUserByIdQuery({ id: userInfo?.userId });
  const userPermissionLabels =
    userData?.permission?.map((item: any) => item?.label) || [];

  const { data: orderStatus } = useGetAllStatusQuery({
    label: status,
  });
  const { watch, handleSubmit } = useFormContext();

  const onsubmit = async (data: any) => {
    if (isSubmittingRef.current) {
      return;
    }
   isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const fromLabel = status?.toUpperCase().replace(/[\s-]/g, "_");
      const toLabel = data?.orderStatus?.label
        ?.toUpperCase()
        .replace(/[\s-]/g, "_");
      const requiredPermission = `${fromLabel}_TO_${toLabel}`;

      if (!userPermissionLabels.includes(requiredPermission)) {
        message.error(
          `${status} থেকে ${data?.orderStatus?.label} এ পরিবর্তন করার অনুমতি আপনার নেই`
        );
        return; // API call হবে না
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);

      let res: any = null;
      if (status === "Hold") {
        res = await handleHoldUpdateOrderStatus({
          orderIds: selectedOrders.map((item: any) => item?.id),
          statusId: data?.orderStatus?.value,
          agentId: userInfo.userId,
          ...(data?.orderStatus?.label === "Hold" && {
            onHoldReason: data?.reason?.value,
          }),
          currentStatus: selectedOrders[0]?.statusId,
        }).unwrap();
      } else {
        res = await handleUpdateOrder({
          orderIds: selectedOrders.map((item: any) => item?.id),
          statusId: data?.orderStatus?.value,
          agentId: userInfo.userId,
          ...(data?.orderStatus?.label === "Cancel" && {
            onCancelReason: data?.reason?.value,
          }),
          currentStatus: selectedOrders[0]?.statusId,
        }).unwrap();
      }

      if (res) {
        message.success("Order update successfully...");
        setModalOpen(false);
      }
    } catch (error) {
      message.error("Something went wrong");
      setModalOpen(false);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-[#FFFFFF]">
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
          options={status==="Pending"?orderStatus?.data?.filter((ab:any)=>ab?.label !=="Approved"):orderStatus?.data}
          label="Select Status"
        />
      </div>
      {(watch()?.orderStatus?.label === "Hold" ||
        watch()?.orderStatus?.label === "Cancel") &&
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
         disabled={isSubmitting}
          onClick={handleSubmit(onsubmit)}
          className={` ${
            true ? "bg-[#4F8A6D]" : "bg-[#CACACA]"
          } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]`}
        >
          {isSubmitting ? "Updating..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default BulkChangeOrders;
