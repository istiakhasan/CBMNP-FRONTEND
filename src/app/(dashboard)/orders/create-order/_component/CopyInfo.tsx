import { useGetProfileInfoQuery } from "@/redux/api/authApi";
import { getUserInfo } from "@/service/authService";
import { message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const CopyInfo = ({ setCopyModalOpen, isGift, cartProduct,formData }: any) => {
  const { watch } = useFormContext();
  const { data, isLoading } = useGetProfileInfoQuery(undefined);
  const [copyLoading, setCopyLoading] = useState(false);

  if (isLoading) {
    return;
  }

  const handleCopy = () => {
    setCopyLoading(true);

    const formattedText = `
      Order ID: 
      Name: ${isGift ? watch().receiverName : watch().customerName}
      ${cartProduct
        ?.map(
          (item: any) =>
            `${item?.productNameEn} ${item?.productWeight} (${item?.productQuantity})`
        )
        .join("\n")}
      Delivery Charge: ${watch()?.deliveryCharge?.value || "--"} tk
      Product Total: ${cartProduct?.reduce((a: any, b: any) => a + b?.subTotal, 0)} tk
      Grand Total: ${cartProduct?.reduce((a: any, b: any) => a + b?.subTotal, 0) +Number(watch()?.deliveryCharge?.value)} tk
      Payment Status: ${watch()?.paymentStatus?.value}
      Address: ${isGift ? watch()?.shippingAddressTextArea : watch()?.address}
      Phone: ${isGift ? watch()?.receiverPhoneNumber : watch()?.customerPhoneNumber}
      Date: ${moment().format("DD-MMM-YYYY")}
      Confirm by: ${data?.data?.employee?.name || "--"}
    `;

    navigator.clipboard
      .writeText(formattedText.trim())
      .then(() => {
        message.success("Order information copied successfully!");
      })
      .catch((error) => console.error("Failed to copy text:", error))
      .finally(() => {
        setCopyLoading(false);
      });
  };
 console.log(formData,"form data");
  return (
    <div className="p-[20px]">
      {/* close button start */}
      <div className="flex justify-between mb-3">
        <p className="text-[28px]">Order Information</p>
        <span
          className="cursor-pointer"
          onClick={() => setCopyModalOpen(false)}
        >
          <i className="ri-close-large-fill"></i>
        </span>
      </div>
      {/* close button end */}

      <div>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">Order Id:</p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          { formData?.receiverName }
        </p>
        {cartProduct?.map((item: any, i: any) => (
          <p
            key={i}
            className="text-[12px] py-1 border-b-[1px] border-t-[1px]"
          >{`${item?.productNameEn} ${item?.productWeight} (${item?.productQuantity})`}</p>
        ))}
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Delivery Charge: {watch()?.deliveryCharge?.value || "--"} tk
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Product Total: {cartProduct?.reduce((a: any, b: any) => a + b?.subTotal, 0)} tk
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Grand Total: {cartProduct?.reduce((a: any, b: any) => a + b?.subTotal, 0)+Number(watch()?.deliveryCharge?.value)} tk
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Payment Status: {watch()?.paymentStatus?.value} 
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Address: {isGift ? watch()?.shippingAddressTextArea : watch()?.address}
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Phone: {isGift ? watch()?.receiverPhoneNumber : watch()?.customerPhoneNumber}
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Date: {moment().format("DD-MMM-YYYY")}
        </p>
        <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
          Confirm by: {data?.data?.employee?.name || "--"}
        </p>
      </div>
      <div className="flex justify-end mt-[50px]">
        <button
          onClick={handleCopy}
          type="button"
          className="cm_button bg-white border-[1px] gap-2 color_primary border-[#278EA5] py-[5px] text-[12px] flex items-center"
          disabled={copyLoading}
        >
          {copyLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              Copy Message
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyInfo;
