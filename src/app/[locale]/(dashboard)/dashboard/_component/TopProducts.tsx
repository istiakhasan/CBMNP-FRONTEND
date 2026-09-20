/* eslint-disable @next/next/no-img-element */
import CircleChar from "@/components/CircleChar";
import GbTable from "@/components/GbTable";
import { Card } from "antd";
import React from "react";

const TopProducts = ({ items, isLoading }: { items?: any[]; isLoading?: boolean }) => {
  if (isLoading) {
    return <Card style={{ height: "100%" }} loading />;
  }

  return (
    <Card style={{ height: "100%" }}>
      <p className="text-[18px]  font-bold  leading-none">
        Top Selling Products
      </p>
      <div className="mt-5">
        {items?.map((item: any, i: any) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-3">
              <img className="border-[1px] border-gray-200 p-2" height={60} width={60} src={item?.url || "/placeholder.svg"} alt="" />
              <div>
                <p className="text-[16px]">{item?.productName || item?.label}</p>
                <p className="text-gray-500 font-semibold">
                  {item?.quantitySold ?? item?.orders ?? 0} units sold
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
