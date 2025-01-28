/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import CreateCustomer from "./CreateCustomer";
import {  message } from "antd";
import LoadProducts from "./LoadProducts";
import OrderCart from "./OrderCart";
import { useState } from "react";
import GbModal from "@/components/ui/GbModal";
import moment from "moment";

const OrderCreate = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState<any>({});
  const [orderSuccessResponse, setOrderSuccessResponse] = useState<any>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const handleCopy = () => {
    setCopyLoading(true);
  
    try {
      const formattedText = `
  Order ID: ${orderSuccessResponse?.order?.orderNumber || "--"}
  Name: ${orderSuccessResponse?.order?.receiverName || "--"}
  Products:
  ${orderSuccessResponse?.orderDetails
    ?.map(
      (item: any) =>
        `  - ${item?.productNameEn} ${item?.productWeight} (${item?.productQuantity})`
    )
    .join("\n") || "--"}
  Delivery Charge: ${orderSuccessResponse?.order?.deliveryCharge || "--"} tk
  Product Total: ${
        orderSuccessResponse?.orderDetails?.reduce(
          (a: any, b: any) => a + b?.subTotal,
          0
        ) || 0
      } tk
  Grand Total: ${orderSuccessResponse?.transaction?.totalPurchaseAmount || "--"} tk
  Payment Status: ${orderSuccessResponse?.transaction?.paymentStatus || "--"}
  Address: ${orderSuccessResponse?.order?.shippingAddressTextArea || "--"}
  Phone: ${orderSuccessResponse?.order?.receiverPhoneNumber || "--"}
  Date: ${moment().format("DD-MMM-YYYY")}
  Confirm by: Pending
      `.trim();
  
      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          message.success("Order information copied successfully!");
        })
        .catch((error) => console.error("Failed to copy text:", error));
    } catch (error) {
      console.error("Error formatting text for copy:", error);
      message.error("Failed to copy order information.");
    } finally {
      setCopyLoading(false);
    }
  };
  
  return (
    <div>
      <GbHeader  title="Create order" />

 
        <div className="flex gap-6  px-[16px] h-[90vh]">
          {/* Create customer */}
          <CreateCustomer customer={customer} setCustomer={setCustomer} />
          {/* Load products or products */}
          <LoadProducts cart={cart} setCart={setCart} />
          <OrderCart
            setOrderSuccessModal={setOrderSuccessModal}
            setOrderSuccessResponse={setOrderSuccessResponse}
            cart={cart}
            setCart={setCart}
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>
  

      <GbModal
        width="500px"
        isModalOpen={orderSuccessModal}
        openModal={() => setOrderSuccessModal(true)}
        closeModal={() => setOrderSuccessModal(false)}
        clseTab={false}
        cls="custom_ant_modal"
        centered
      >
        <div className="p-[20px] ">
          <div className="flex justify-between mb-4">
            <h1 className="text-[24px]  color_primary text-center font-semibold">
              Order Create Successfully
            </h1>
            <span
              className="cursor-pointer"
              onClick={() => {
                setOrderSuccessResponse(null);
                setOrderSuccessModal(false);
              }}
            >
              <i className="ri-close-large-fill"></i>
            </span>
          </div>

          {/* order info */}
          <div>
            {/* close button start */}
            <div className="flex justify-between mb-3">
              <p className="text-[18px]">Order Information</p>
            </div>
            {/* close button end */}

            <div>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Order Id: {orderSuccessResponse?.order?.orderNumber}
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                {orderSuccessResponse?.order?.receiverName}
              </p>
             
                {/* <p
                  key={i}
                  className="text-[12px] py-1 border-b-[1px] border-t-[1px]"
                >{`${item?.productNameEn} ${item?.productWeight} (${item?.productQuantity})`}</p> */}
                <p
                  className="text-[12px] py-1 border-b-[1px] border-t-[1px]"
                >{orderSuccessResponse?.orderDetails?.map((item:any,i:any)=>(
                  <p
                  key={i}
                  className="text-[12px] py-1 "
                >{`${item?.productNameEn} ${item?.productWeight} (${item?.productQuantity})`}</p>
                ))}</p>
            
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Delivery Charge: {orderSuccessResponse?.order?.deliveryCharge} Tk
                tk
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Product Total: {orderSuccessResponse?.orderDetails?.reduce((a:any,b:any)=>a+b?.subTotal,0)} tk
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Grand Total: {orderSuccessResponse?.transaction?.totalPurchaseAmount} tk
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Payment Status: {orderSuccessResponse?.transaction?.paymentStatus}
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Address: {orderSuccessResponse?.order?.shippingAddressTextArea}
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Phone: {orderSuccessResponse?.order?.receiverPhoneNumber}
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Date: {moment().format("DD-MMM-YYYY")}
              </p>
              <p className="text-[12px] py-1 border-b-[1px] border-t-[1px]">
                Confirm by: Pending
              </p>
            </div>
            <div className="flex justify-end mt-[50px]">
              <button
                onClick={handleCopy}
                type="button"
                className="cm_button bg-white border-[1px] gap-2 color_primary border-[#4F8A6D] py-[5px] text-[12px] flex items-center"
                disabled={copyLoading}
              >
                {/* {false ? ( */}
                {copyLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              Copy Info
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
        </div>
      </GbModal>
    </div>
  );
};

export default OrderCreate;
