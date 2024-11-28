"use client";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { Pagination, Select } from "antd";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Image from "next/image";
import TagImage from "../../../../../assets/images/icons/tags.png";
import FilterImage from "../../../../../assets/images/icons/filter_icon.png";
import FilterForm from "../../pending-orders/[id]/_component/FilterForm";
import ExpandOrderForm from "./ExpandOrderForm";
const OrderItem = () => {
  const [derivateData, setDerivateData] = useState("2");
  const [activeFilterForm, setActiveFilterForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expand, setExpand] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: size,
    searchTerm,
  });
  return (
    <>
      <div className="flex  gap-[40px]">
        <div className="flex-1">
          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="sdw_box p-[8px]  flex-1 px-[20px]  flex items-center">
              <SearchOutlined style={{ fontSize: "20px", color: "#BCBCBC" }} />
              <Input
                style={{
                  borderRadius: "4px",
                  outline: "none",
                  fontSize: "16px",
                  fontWeight: "400",
                  border: "none",
                }}
                placeholder={
                  "Search by Order Number/ Delivery, Shipping Phone Number or Email Address"
                }
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Image width={24} alt="" src={TagImage} />
                <p className="text-[#7D7D7D] text-[14px] font-[400]">Tags</p>
              </div>
            </div>
            <div
              onClick={() => setActiveFilterForm(!activeFilterForm)}
              className="sdw_box w-fit cursor-pointer"
            >
              <Image width={16} alt="" src={FilterImage} />
            </div>
          </div>
          <div
            className={`${
              activeFilterForm ? "h-fit" : "h-[0px] overflow-hidden"
            } duration-300 mb-[12px]`}
          >
            <FilterForm />
          </div>
        </div>
        <div className="w-[342px] flex ">
          <small className="text-[#A2A2A2] mt-[12px] font-[400] text-[12px] text-nowrap mr-2">
            Select viewing option
          </small>

          <Select
            onChange={(selectedValue, selectedOption: any) => {
              setDerivateData(selectedOption.value);
            }}
            options={[
              {
                label: "Derivative data",
                value: "1",
              },
              {
                label: "Sort data",
                value: "2 ",
              },
            ]}
            style={{ width: "100%", fontSize: "4px" }}
          />
        </div>
      </div>
      <div className="max-h-[700px] overflow-auto custom_scroll">
        {data?.data?.map((item: any, i: any) => (
          <div key={i}>
            <ExpandOrderForm
              expand={expand}
              setExpand={setExpand}
              derivateData={derivateData}
              item={item}
              i={i}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-[30px]">
        <Pagination
          pageSize={size}
          total={data?.totalCount}
          onChange={(v, d) => {
            setPage(v);
            setSize(d);
          }}
        />
      </div>
    </>
  );
};

export default OrderItem;
