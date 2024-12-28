"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import convertNumberToShorthand from "@/util/convertNumberToShorthand";
import { Spin } from "antd";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AllOrders from "./AllOrders";

const OrdersPage = () => {
  // all states
  const [activeTab, setActiveTab] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");
   const router=useRouter()
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: "R-000000001",
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  const tabs = [
    { id: "1", name: "Pending BD", count: 100 },
    { id: "2", name: "Pending NRB", count: 10000 },
    { id: "3", name: "Approved", count: 100 },
    { id: "4", name: "Hold", count: 100 },
    { id: "5", name: "Store", count: 100 },
    { id: "6", name: "Packing", count: 100 },
    { id: "7", name: "In-Transit", count: 100 },
    { id: "8", name: "Delivered", count: 100 },
    { id: "10", name: "Unreachable", count: 100 },
    { id: "11", name: "Cancel", count: 100 },
    { id: "9", name: "All", count: 100 },
  ];

  const components: { [key: string]: any } = {
    // "1": <PendingBd dateRange={dateRange} activeUsers={users} searchTerm={searchTerm} />,
    // "2": <PendingNRB activeUsers={users} dateRange={dateRange} searchTerm={searchTerm} />,
    // "3": <Approved activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "4": <Hold activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    "9": <AllOrders searchTerm={searchTerm} />,
    // "5": <Store activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "6": <Packing activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "7": <InTransit activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "8": <Delivered activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "10": <Unreachable activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
    // "11": <Cancel activeUsers={users} dateRange={dateRange} searchTerm={searchTerm}  />,
  };

  return (
    <div>
      <GbHeader title="Orders" />
      <div className="p-[16px]">
        {getUserLoading ? (
          <>
            <div className="flex items-center justify-center h-screen">
              <Spin size="large" />
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
                    <span className=" primary_border bg-primary text-white text-[10px] px-[4px]  top-[5px]">
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
