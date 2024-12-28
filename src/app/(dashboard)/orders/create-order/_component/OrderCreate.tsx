/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import CreateCustomer from "./CreateCustomer";
import { Divider } from "antd";
import LoadProducts from "./LoadProducts";
import OrderCart from "./OrderCart";

const OrderCreate = () => {
  return (
    <div>
      <GbHeader title="Create order" />
      <div className="p-[16px]">
        <div className="grid grid-cols-5 gap-2">
          {/* Create customer */}
          <CreateCustomer />
          {/* Load products or products */}
          <LoadProducts />
            <OrderCart />
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;
