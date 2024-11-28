"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { Image, Tabs } from "antd";
import React from "react";
import Description from "./_component/Description";
import HealthBenifits from "./_component/HealthBenifits";
import Certification from "./_component/Certification";

const Page = (props: any) => {
  const { data, isLoading } = useGetProductByIdQuery({ id: props?.params?.id });
  if (isLoading) {
    return;
  }
  return (
    <div>
      <GbHeader title="Product content" />
      <h1 className="text-[#343434]  text-[24px] font-[500] mb-[8px]">
        {data?.product_title_en}
      </h1>
      <h1 className="text-[#7D7D7D]  text-[16px] font-[400] mb-[30px]">
        {data?.pack_size} product code {data?.product_code}
      </h1>

      <div className="mb-[40px]">
        <h1 className="text-[#343434]  text-[16px] font-[500] mb-[8px] ">
          Image gallery
        </h1>
        <div className="flex gap-[16px]">
          {data?.product_image && (
            <div className="relative w-fit">
              <Image
                src={`${getBaseUrl()}/${data?.product_image}` || ""}
                alt=""
                width={185}
                height={185}
              />
              <span className="bg-[#F48C13] px-[16px] py-[6px] text-[10px] font-bold text-white rounded-full absolute right-[8px] top-[8px]">
                Thumbnail
              </span>
            </div>
          )}
          {data?.product_gallery?.map((item: any) => (
            <Image
              key={item?.id}
              src={`${getBaseUrl()}/${item}` || ""}
              alt=""
              width={185}
              height={185}
            />
          ))}
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        color="red"
        items={[
          {
            key: "1",
            label: `About`,
            children: <Description data={data} />,
          },
          {
            key: "2",
            label: `Health benefits`,
            children: <><HealthBenifits data={data} /></>,
          },
          {
            key: "3",
            label: `Useability `,
            children: <></>,
          },
          {
            key: "4",
            label: `Side effect`,
            children: <></>,
          },
          {
            key: "5",
            label: `Certification`,
            children: <><Certification /></>,
          }
        ]}
      />
    </div>
  );
};

export default Page;
