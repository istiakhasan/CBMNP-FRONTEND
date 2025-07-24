/* eslint-disable @next/next/no-img-element */
import CircleChar from "@/components/CircleChar";
import GbTable from "@/components/GbTable";
import { useTopSellingProductsQuery } from "@/redux/api/dashboardApi";
import { Card } from "antd";
import React from "react";

const TopProducts = () => {
  const { data, isLoading } = useTopSellingProductsQuery(undefined);
  if (isLoading) {
    return;
  }

  console.log(data, "data");
  return (
    <Card style={{ height: "100%" }}>
      <p className="text-[18px]  font-bold  leading-none">
        Top Selling Products
      </p>
      <div className="mt-5">
        {data?.data?.map((item: any, i: any) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-3">
              <img className="border-[1px] border-gray-200 p-2" height={60} width={60} src={item?.url} alt="" />
              <div>
                <p className="text-[16px]">{item?.label}</p>
                <p className="text-gray-500 font-semibold">
                  {item?.orders} orders
                </p>
              </div>
            </div>
            <p className="color_primary font-semibold">৳ {item?.totalSales}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProducts;
