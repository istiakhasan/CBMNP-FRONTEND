"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import convertNumberToShorthand from "@/util/convertNumberToShorthand";
import { Spin } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AllOrders from "./AllOrders";
import PendingOrders from "./PendingOrders";
import ApprovedOrders from "./ApprovedOrders";
import HoldOrders from "./HoldOrders";
import StoreOrders from "./StoreOrders";
import PackingOrders from "./PackingOrders";
import InTransitOrders from "./InTransitOrders";
import Delivered from "./Delivered";
import UnreachableOrders from "./UnreachableOrders";
import CancelOrders from "./CancelOrders";
import { useGetOrdersCountQuery } from "@/redux/api/statusApi";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");
   const router=useRouter()
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: "R-000000001",
  });
  const { data: countData, isLoading: countLoading } = useGetOrdersCountQuery({
    id: "R-000000001",
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  const tabs = [
    { id: "1", name: "Pending", count: 100 ,color:"bg-[#FFC107]"},
    { id: "3", name: "Approved", count: 100 ,color:"bg-[#4CAF50]"},
    { id: "4", name: "Hold", count: 100 ,color:"bg-[#9C27B0]"},
    { id: "5", name: "Store", count: 100 ,color:"bg-[#FF9800]"},
    { id: "6", name: "Packing", count: 100 ,color:"bg-[#3F51B5]"},
    { id: "7", name: "In-Transit", count: 100 ,color:"bg-[#00BCD4]"},
    { id: "8", name: "Delivered", count: 100 ,color:"bg-[#009688]"},
    { id: "10", name: "Unreachable", count: 100 ,color:"bg-[#795548]"},
    { id: "11", name: "Cancel", count: 100 ,color:"bg-[#F44336]"},
    { id: "9", name: "All", count: 100 ,color:"bg-[#009688]"},
  ].map((item) => ({
    ...item,
    //@ts-ignore
    count: countData?.data?.find((od:any)=>od?.label?.toLowerCase()===item?.name?.toLowerCase())?.count || "0",
  }));

  const components: { [key: string]: any } = {
    "1": <PendingOrders  searchTerm={searchTerm} />,
    "3": <ApprovedOrders  searchTerm={searchTerm}  />,
    "4": <HoldOrders  searchTerm={searchTerm}  />,
    "9": <AllOrders searchTerm={searchTerm} />,
    "5": <StoreOrders  searchTerm={searchTerm}  />,
    "6": <PackingOrders  searchTerm={searchTerm}  />,
    "7": <InTransitOrders  searchTerm={searchTerm}  />,
    "8": <Delivered  searchTerm={searchTerm}  />,
    "10": <UnreachableOrders  searchTerm={searchTerm}  />,
    "11": <CancelOrders  searchTerm={searchTerm}  />,
  };

  return (
    <div>
      <GbHeader title="Orders" />
      <div className="p-[16px]">
        {getUserLoading ? (
          <>
            <div className="flex items-center justify-center h-screen">
              <Spin size="small" />
            </div>
          </>
        ) : (
          <>
            {permission?.includes("CREATE_ORDERS") && (
              <div className="flex items-center justify-end gap-3 flex-wrap">
                <button
                    onClick={() => router.push('/orders/create-order')}
                  className="bg-[#47a2b3] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
                >
                  Create order
                </button>
              </div>
            )}
            <div className="flex gap-[20px] bg-white  my-2">
              <>
                {tabs.map((tab) => (
                  <p
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-[12px] font-[400] py-[5px] px-[15px] relative hover:text-[#000000] ${
                      activeTab === tab.id
                        ? " text-[#278ea5]  bg-[#F2F8FA]"
                        : "text-[#7D7D7D]"
                    }   hover:text-[#278ea5] hover:bg-[#F2F8FA] cursor-pointer`}
                    id={`tab-${tab.id}`}
                  >
                    {tab.name}{" "}
                    <span className={` ${tab?.color} text-white text-[10px] px-[4px]  top-[5px]`}>
                      {convertNumberToShorthand(tab?.count || 0)}
                    </span>
                  </p>
                ))}
              </>
            </div>
            {components[activeTab]}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
