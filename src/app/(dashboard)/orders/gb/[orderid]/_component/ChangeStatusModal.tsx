import GbForm from "@/components/forms/GbForm";
import GbFormSelectV2 from "@/components/forms/GbFormSelectV2";
import {
  useApprovedOrderMutation,
  useGetAllOrderStatusQuery,
} from "@/redux/api/orderApi";
import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormContext } from "react-hook-form";

const ChangeStatusModal = ({ setModalOpen, rowData }: any) => {
  const [approvedOrderHandler] = useApprovedOrderMutation();
  const userInfo: any = getUserInfo();
  const router=useRouter()
  let order_status_value = "";
  if (
    rowData?.orderStatus?.value === "6" ||
    rowData?.orderStatus?.value === "5"
  ) {
    order_status_value = "Canceled";
  } else if (rowData?.orderStatus?.value === "2") {
    order_status_value = "Hold,Canceled";
  } else if (rowData?.orderStatus?.value === "4") {
    order_status_value = "Approved,Unreachable,Canceled";
  } else if (rowData?.orderStatus?.value === "3") {
    order_status_value = "Approved,Canceled";
  } else {
    order_status_value = "Approved,Unreachable,Hold,Canceled";
  }
  const { data: orderStatus } = useGetAllOrderStatusQuery({
    statuses: order_status_value,
  });
  const { watch, handleSubmit } = useFormContext();
  const onsubmit = async (data: any) => {
    try {
      const payload = {
        comments: watch()?.reason?.value,
        agentId: userInfo?.employeeId,
        isAction: true,
        cancelWithReason: watch()?.reason?.value,
        orderStatusValue: watch()["orderStatus"]?.value,
        orderStatus: {
          name: watch()["orderStatus"]?.label,
          value: watch()["orderStatus"]?.value,
        },
      };
      const payloadForApproved = {
        //   comments:watch()?.reason?.value,
        isAction: true,
        agentId: userInfo?.employeeId,
        orderStatusValue: watch()["orderStatus"]?.value,
        orderStatus: {
          name: watch()["orderStatus"]?.label,
          value: watch()["orderStatus"]?.value,
        },
        isApprove: true,
      };

      const res = await approvedOrderHandler({
        id: rowData?.id,
        data:
          watch()["orderStatus"]?.value === "Approved"
            ? payloadForApproved
            : payload,
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

  console.log(
    "row data",
    rowData?.deliveryDate, //
    rowData?.deliveryType, //
    rowData?.receiverName, //1
    rowData?.shippingAddressDistrict, //
    rowData?.shippingAddressDivision, //
    rowData?.shippingAddressTextArea, //
    rowData?.shippingAddressThana, //
    rowData?.deliveryCharge,
    rowData?.orderType, //
    rowData?.currier //
  );

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

      {!rowData?.deliveryDate ||
      !rowData?.deliveryType ||
      !rowData?.receiverName ||
      !rowData?.shippingAddressDistrict ||
      !rowData?.shippingAddressDivision ||
      !rowData?.shippingAddressTextArea ||
      !rowData?.shippingAddressThana ||
      !rowData?.orderType ||
      !rowData?.currier ? (
        <>
          <p>Some mandatory data missing,please navigate to edit page </p>
          <div className="flex justify-end mt-3">
            <button 
              onClick={()=>router.push(`/orders/gb/edit?orderId=${rowData?.id}&customerId=${rowData?.customer_Id}&isApprove=true`)}
              className={` ${
                true ? "bg-[#278ea5]" : "bg-[#CACACA]"
              } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]`}
            >
              Navigate
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <GbFormSelectV2
              name="orderStatus"
              options={orderStatus?.map((item: any) => {
                return { label: item?.name, value: item?.value };
              })}
              label="Select Status"
            />
          </div>
          {watch()?.orderStatus?.label !== "Approved" &&
            !!watch()?.orderStatus?.label && (
              <div className="mt-3">
                <GbFormSelectV2
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
                true ? "border-[#278ea5] text-[#278ea5]" : "bg-[#CACACA]"
              }  border-[rgba(0,0,0,.2)] border  font-bold px-[30px] py-[5px]`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onsubmit)}
              className={` ${
                true ? "bg-[#278ea5]" : "bg-[#CACACA]"
              } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]`}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChangeStatusModal;
