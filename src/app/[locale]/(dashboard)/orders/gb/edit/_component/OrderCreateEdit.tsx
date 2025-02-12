/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import CreateCustomerEdit from "./CreateCustomerEdit";
import { Divider } from "antd";
import LoadProductsEdit from "./LoadProductsEdit";

import { useState } from "react";
import GbForm from "@/components/forms/GbForm";
import GbModal from "@/components/ui/GbModal";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import OrderCartEdit from "./OrderCartEdit";

const OrderCreateEdit = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState<any>({});
  const [orderSuccessResponse, setOrderSuccessResponse] = useState<any>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  return (
    <div>
      <GbHeader className={"mb-0"} title="Create order" />

      <div className=" ">
        <div className="flex gap-6 bg-[#FFFFFF] px-[16px] h-[90vh]">
          {/* Create customer */}
          <CreateCustomerEdit customer={customer} setCustomer={setCustomer} />
          {/* Load products or products */}
          <LoadProductsEdit cart={cart} setCart={setCart} />
          <OrderCartEdit
            setOrderSuccessModal={setOrderSuccessModal}
            setOrderSuccessResponse={setOrderSuccessResponse}
            cart={cart}
            setCart={setCart}
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>
      </div>
      {/* </GbForm> */}

      {/* order success modal */}
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
          <div className="flex justify-end">
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
          <h1 className="text-[28px]  color_primary text-center font-bold">
            Order Update Successfully
          </h1>
          <h1 className="text-center text-[16px]">
            {orderSuccessResponse?.order?.orderNumber}{" "}
            <i
              onClick={() =>
                copyToClipboard(orderSuccessResponse?.order?.orderNumber)
              }
              className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px]"
            ></i>
          </h1>
        </div>
      </GbModal>
    </div>
  );
};

export default OrderCreateEdit;
