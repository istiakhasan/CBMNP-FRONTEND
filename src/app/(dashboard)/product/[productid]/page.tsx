"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { Image, Switch } from "antd";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [updateProduct] = useUpdateProductMutation();
  const [activeImage,setActiveImage]=useState<any>(null)
  const params = useParams();
  const { data, isLoading } = useGetProductByIdQuery({
    id: params?.productid,
  });
  if (isLoading) {
    return;
  }
  console.log(data, "data", params);
  return (
    <div>
      <GbHeader />
      <div className="p-[16px]">
        <p className="text-[20px] mb-5">
          <>Simple Product:</>{" "}
          <span className="text-[#4b5766]">{data?.name}</span>
        </p>
       <div className="flex gap-[24px]">
       <div>
       <Image
          src={`${getBaseUrl()}/${activeImage ||  data?.product_gallery?.length>0&&data?.product_gallery[0]}`}
          width={280}
          height={280}
          alt=""
        />
        <div className="flex gap-2 mt-2">
            {
                data?.product_gallery?.map((item:any,i:any)=>(
                    <Image onClick={()=>setActiveImage(item)} style={{border:"1px solid rgb(39, 142, 165)"}} className="cursor-pointer" preview={false} height={38} width={38} key={i} src={`${getBaseUrl()}/${item}`} alt="" />
                ))
            }
        </div>
       </div>

       <div className="flex-1">
        {/* summary box */}
       <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
          <div className="flex justify-between mb-5">
            <p className="text-[16px] font-semibold">{data?.name}</p>
           <div className="flex items-center gap-2">
           <p className="text-slate-500"> {data?.status?"Active":"Inactive"}</p>
           <Switch
              size="small"
              onChange={async (a) => {
                const res = await updateProduct({
                  id: data?.id,
                  data: {
                    status: a,
                  },
                });
              }}
              defaultChecked={data?.status}
            />
           </div>
          </div>
          <div className="grid grid-cols-3">
            <div>
                <p className="text-[#656565]">SKU</p>
                <p className="text-[#00171d] font-semibold">{data?.sku}</p>
            </div>
            <div>
                <p className="text-[#656565]">Internal ID</p>
                <p className="text-[#00171d] font-semibold">{data?.internalId}</p>
            </div>
            <div>
                <p className="text-[#656565]">Category</p>
                <p className="text-[#00171d] font-semibold">{data?.categories?.name}</p>
            </div>

          </div>
          <div className="grid grid-cols-3 mt-6">
            <div>
                <p className="text-[#656565]">Summary</p>
                <p className="text-[#00171d] font-semibold">{data?.productSummary?data?.productSummary:'N/A'}</p>
            </div>
        

          </div>
        </div>
        {/* Amount box */}
       <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
          <div className="flex justify-between mb-5">
            <p className="text-[16px] font-semibold">Amount</p>
          </div>
          <div className="grid grid-cols-4">
            <div>
                <p className="text-[#656565]">MRP</p>
                <p className="text-[#00171d] font-semibold">{data?.mrp || "N/A"}</p>
            </div>
            <div>
                <p className="text-[#656565]">Retail Price</p>
                <p className="text-[#00171d] font-semibold">{data?.retailerPrice}</p>
            </div>
            <div>
                <p className="text-[#656565]">Distributor Price</p>
                <p className="text-[#00171d] font-semibold">{data?.distributorPrice}</p>
            </div>
            <div>
                <p className="text-[#656565]">Purchase Price</p>
                <p className="text-[#00171d] font-semibold">{data?.purchasePrice}</p>
            </div>
          </div>
        </div>
     <div className="grid grid-cols-2 gap-[16px]">
           {/* Attributes box */}
       <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
          <div className="flex justify-between mb-5">
            <p className="text-[16px] font-semibold">Attributes</p>
          </div>
          <div className="grid grid-cols-4">
            <div>
                <p className="text-[#00171d] font-semibold">No Attributes</p>
            </div>
           
          </div>
        </div>
        {/* Attributes box */}
       <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
          <div className="flex justify-between mb-5">
            <p className="text-[16px] font-semibold">Specifications</p>
          </div>
          <div className="grid grid-cols-4">
            <div>
                <p className="text-[#656565]">Weight</p>
                <p className="text-[#00171d] font-semibold">{data?.weight +" "+ data?.weightUnit}</p>
            </div>
           
          </div>
        </div>
     </div>
       </div>
       </div>
      </div>
    </div>
  );
};

export default Page;
