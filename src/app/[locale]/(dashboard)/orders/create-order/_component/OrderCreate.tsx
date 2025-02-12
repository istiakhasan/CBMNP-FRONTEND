/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import CreateCustomer from "./CreateCustomer";
import { Button, Result } from "antd";
import LoadProducts from "./LoadProducts";
import OrderCart from "./OrderCart";
import { useState } from "react";
import GbModal from "@/components/ui/GbModal";
const OrderCreate = () => {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState<any>({});
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  return (
    <div>
      <GbHeader title="Create order" />
      <div className="flex gap-6  px-[16px] h-[90vh]">
        <CreateCustomer customer={customer} setCustomer={setCustomer} />
        <LoadProducts cart={cart} setCart={setCart} />
        <OrderCart
          setOrderSuccessModal={setOrderSuccessModal}
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
          <Result
            status="success"
            title="Order Created Successfully!"
            subTitle="Your order has been placed successfully. You can track it in the orders section."
            extra={[
              <Button
                type="primary"
                key="ok"
                onClick={() => setOrderSuccessModal(false)}
              >
                OK
              </Button>,
            ]}
          />
        </div>
      </GbModal>
    </div>
  );
};

export default OrderCreate;
