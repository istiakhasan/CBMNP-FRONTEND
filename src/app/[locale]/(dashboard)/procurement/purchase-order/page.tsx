"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React, { useState } from "react";
import OrderList from "./_component/OrderList";
import CreatePurchaseOrder from "./_component/CreatePurchaseOrder";
import GbModal from "@/components/ui/GbModal";
const Page = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GbHeader title="Purchase Order" />
      <div className="p-[16px]">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
          >
            Create Order
          </button>
        </div>
        <OrderList />
      </div>
      <GbModal
        width="1400px"
        closeModal={() => setOpen(false)}
        openModal={() => setOpen(true)}
        isModalOpen={open}
      >
        <CreatePurchaseOrder />
      </GbModal>
    </>
  );
};

export default Page;
