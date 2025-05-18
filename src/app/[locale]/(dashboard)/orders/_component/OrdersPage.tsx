"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import convertNumberToShorthand from "@/util/convertNumberToShorthand";
import { DatePicker, Divider, Spin, Tooltip } from "antd";
import React, { useState } from "react";
import { useLocale } from "next-intl";
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
import {
  useGetAllStatusQuery,
  useGetOrdersCountQuery,
} from "@/redux/api/statusApi";
import { getUserInfo } from "@/service/authService";
import { useRouter } from "next/navigation";
import OrderSearch from "@/components/OrderSearch";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const OrdersPage = () => {
  const [rangeValue, setRangeValue] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");
  const userInfo: any = getUserInfo();
  const router = useRouter();
  const local = useLocale();
  const { data: statusOptions, isLoading } = useGetAllStatusQuery({
    label: "all",
  });
  const { data: warehouseOptions, isLoading: warehosueLoading } =
    useLoadAllWarehouseOptionsQuery(undefined);
  const { data: deliveryPartnerOptions, isLoading: deliveryPartnerLoading } =
    useGetDeliveryPartnerOptionsQuery(undefined);
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });
  const {
    data: countData,
    isLoading: countLoading,
    refetch,
  } = useGetOrdersCountQuery({
    searchTerm,
  });
  const permission = userData?.permission?.map((item: any) => item?.label);

  const allTabs = [
    {
      id: "1",
      name: "Pending",
      permission: "VIEW_PENDING_ORDERS",
      color: "bg-[#FFC107]",
    },
    {
      id: "3",
      name: "Approved",
      permission: "VIEW_APPROVED_ORDERS",
      color: "bg-[#4CAF50]",
    },
    {
      id: "4",
      name: "Hold",
      permission: "VIEW_HOLD_ORDERS",
      color: "bg-[#9C27B0]",
    },
    {
      id: "5",
      name: "Store",
      permission: "VIEW_STORE_ORDERS",
      color: "bg-[#FF9800]",
    },
    {
      id: "6",
      name: "Packing",
      permission: "VIEW_PACKING_ORDERS",
      color: "bg-[#3F51B5]",
    },
    {
      id: "7",
      name: "In-Transit",
      permission: "VIEW_IN_TRANSIT_ORDERS",
      color: "bg-[#00BCD4]",
    },
    {
      id: "8",
      name: "Delivered",
      permission: "VIEW_DELIVERED_ORDERS",
      color: "bg-[#009688]",
    },
    {
      id: "10",
      name: "Unreachable",
      permission: "VIEW_UNREACHABLE_ORDERS",
      color: "bg-[#795548]",
    },
    {
      id: "11",
      name: "Cancel",
      permission: "VIEW_CANCEL_ORDERS",
      color: "bg-[#F44336]",
    },
    {
      id: "9",
      name: "All",
      permission: "VIEW_ALL_ORDERS",
      color: "bg-[#009688]",
    },
  ];

  const tabs = allTabs
    .filter((tab) => permission?.includes(tab.permission))
    .map((item) => ({
      ...item,
      //@ts-ignore
      count:
        countData?.data?.find(
          (od: any) => od?.label?.toLowerCase() === item?.name?.toLowerCase()
        )?.count || "0",
    }));

  const components: { [key: string]: any } = {
    "1": <PendingOrders countData={countData} searchTerm={searchTerm} />,
    "3": (
      <ApprovedOrders
        refetch={refetch}
        countData={countData}
        searchTerm={searchTerm}
      />
    ),
    "4": <HoldOrders searchTerm={searchTerm} />,
    "9": <AllOrders countData={countData} searchTerm={searchTerm} />,
    "5": <StoreOrders searchTerm={searchTerm} />,
    "6": <PackingOrders searchTerm={searchTerm} />,
    "7": <InTransitOrders searchTerm={searchTerm} />,
    "8": <Delivered searchTerm={searchTerm} />,
    "10": <UnreachableOrders searchTerm={searchTerm} />,
    "11": <CancelOrders searchTerm={searchTerm} />,
  };
  return (
    <div>
      <GbHeader title="Orders" />
      <div className="p-[16px]">
        {getUserLoading ? (
          <div className="flex items-center justify-center h-screen">
            <Spin size="small" />
          </div>
        ) : (
          <>
            {permission?.includes("CREATE_ORDERS") && (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-2">
                  <OrderSearch
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                  />

                  <Tooltip
                    styles={{
                      body: {
                        background: "white",
                        width: "500px",
                        padding: "20px",
                      },
                    }}
                    trigger={["click"]}
                    placement="rightBottom"
                    title={
                      <div>
                        <h1>Filter by status</h1>
                        <div className="flex gap-2 flex-wrap">
                          {statusOptions?.data?.map((item: any, i: any) => (
                            <span
                              className="text-black flex items-center gap-2"
                              key={i}
                            >
                              <input type="checkbox" value={item?.value} />
                              {item?.label}
                            </span>
                          ))}
                        </div>
                        <Divider />
                        <h1>Filter by warehouse</h1>
                        <div className="flex gap-2 flex-wrap">
                          {warehouseOptions?.data?.map((item: any, i: any) => (
                            <span
                              className="text-black flex items-center gap-2"
                              key={i}
                            >
                              <input type="checkbox" value={item?.value} />
                              {item?.label}
                            </span>
                          ))}
                        </div>
                        <Divider />
                        <h1>Delivery Partner</h1>
                        <div className="flex gap-2 flex-wrap">
                          {deliveryPartnerOptions?.data?.map(
                            (item: any, i: any) => (
                              <span
                                className="text-black flex items-center gap-2"
                                key={i}
                              >
                                <input type="checkbox" value={item?.value} />
                                {item?.label}
                              </span>
                            )
                          )}
                        </div>
                        <Divider />
                        <h1>Date Range</h1>
                        <div className="flex gap-2 flex-wrap">
                          <RangePicker
                            style={{
                              width: "100%",
                              height: "36px",
                              borderRadius: "0px",
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime
                            onChange={(dates) => {
                              if (dates) {
                                const [start, end] = dates;
                                const formattedStart = dayjs(start).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                );
                                const formattedEnd = dayjs(end).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                );
                                setRangeValue({
                                  startDate: formattedStart,
                                  endDate: formattedEnd,
                                });
                              } else {
                                setRangeValue(null);
                              }
                            }}
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] mt-3"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    }
                  >
                    <div className="border p-2 h-[35px] flex items-center gap-2 cursor-pointer">
                      <i
                        style={{ fontSize: "24px" }}
                        className="ri-equalizer-line text-gray-600"
                      ></i>{" "}
                      Filter Orders
                    </div>
                  </Tooltip>
                </div>
                <button
                  onClick={() => router.push(`/${local}/orders/create-order`)}
                  className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
                >
                  Create order
                </button>
              </div>
            )}
            <div className="flex gap-[20px] bg-white my-2">
              {tabs.map((tab) => (
                <p
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[12px] font-[400] py-[5px] px-[15px] relative hover:text-[#000000] ${
                    activeTab === tab.id
                      ? " color_primary  bg-[#F2F8FA]"
                      : "text-[#7D7D7D]"
                  } hover:color_primary hover:bg-[#F2F8FA] cursor-pointer`}
                  id={`tab-${tab.id}`}
                >
                  {tab.name}{" "}
                  <span
                    className={` ${tab?.color} text-white text-[10px] px-[4px]  top-[5px]`}
                  >
                    {convertNumberToShorthand(tab?.count || 0)}
                  </span>
                </p>
              ))}
            </div>
            {components[activeTab]}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
