"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React from "react";
import { Tabs } from "antd";
import OrderList from "./_component/OrderList";
import CreatePurchaseOrder from "./_component/CreatePurchaseOrder";

const items = [
  {
    label: `Purchase Order List`,
    key: "1",
    children: <OrderList /> ,
    style: { height: 800 }
  },
  {
    label: `Create Order`,
    key: "2",
    children: <CreatePurchaseOrder />,
    style: { height: 200 }
  },
];

const Page = () => {
  return (
    <>
      <GbHeader title="Purchase Order" />
      <div className="px-[16px]">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </>
  );
};

export default Page;
