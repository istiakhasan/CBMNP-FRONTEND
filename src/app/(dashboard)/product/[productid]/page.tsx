"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { customError } from "@/constants/variableConstant";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { Image, message, Spin, Switch } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router=useRouter()
  const [updateProduct] = useUpdateProductMutation();
  const [activeImage, setActiveImage] = useState<any>(null);
  const params = useParams();
  const { data, isLoading } = useGetProductByIdQuery({
    id: params?.productid,
  });
  const productData=data?.data?.data
  const ids=data?.data?.ids
  return (
    <div>
      <GbHeader title="Product" />
      <div className="p-[16px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Spin />
          </div>
        ) : (
          <>
            <p className="text-[20px] mb-5 flex justify-between">
              <span className="text-[#4b5766]">{productData?.name}</span>
              <button onClick={()=>router.push(`/product/${productData?.id}/edit`)} className="bg-[#47a2b3] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]">
              Edit
            </button>
            </p>
           {ids?.length>0 && <div className="border-b-[1px] mb-[20px] border-b-[#ebebeb] flex items-center gap-10">
              {ids?.map((item: any, i: any) => (
                <span onClick={()=>router.push(`/product/${item?.id}`)} key={i} className={`pb-1 cursor-pointer text-[#656565] hover:text-[#288CA3] ${params?.productid===item?.id?"text-black font-bold":""}`}>
                  {item?.name}
                </span>
              ))}
            </div>}
            <div className="flex gap-[24px]">
              <div>
                <Image
                  src={productData?.images[0]?.url}
                  width={280}
                  height={280}
                  alt=""
                />
                <div className="flex gap-2 mt-2">
                  {data?.product_gallery?.map((item: any, i: any) => (
                    <Image
                      onClick={() => setActiveImage(item)}
                      style={{ border: "1px solid rgb(39, 142, 165)" }}
                      className="cursor-pointer"
                      preview={false}
                      height={38}
                      width={38}
                      key={i}
                      src={`${getBaseUrl()}/${item}`}
                      alt=""
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                {/* summary box */}
                <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
                  <div className="flex justify-between mb-5">
                    <p className="text-[16px] font-semibold">{productData?.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500">
                        {" "}
                        {productData?.active ? "Active" : "Inactive"}
                      </p>
                      <Switch
                        size="small"
                        onChange={async (a) => {
                          try {
                            const res = await updateProduct({
                              id: productData?.id,
                              data: {
                                active: a,
                              },
                            }).unwrap();
                            if (res?.success) {
                              message.success(
                                `Product ${productData?.name} ${
                                  a ? "active" : "inactive"
                                } successfully`
                              );
                            }
                          } catch (error) {
                            message.error(customError);
                          }
                        }}
                        defaultChecked={productData?.active}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div>
                      <p className="text-[#656565]">SKU</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.sku}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656565]">Internal ID</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.internalId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656565]">Category</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.category?.label}
                      </p>
                    </div>
                  </div>
                  <div className=" mt-6">
                    <div>
                      <p className="text-[#656565]">Summary</p>
                      <p className="text-[#00171d] ">
                        {productData?.description ? productData?.description : "N/A"}
                      </p>
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
                      <p className="text-[#656565]">Regular Price</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.regularPrice || "N/A"}Tk
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656565]">Retail Price</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.retailPrice || "N/A"} Tk
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656565]">Distributor Price</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.distributionPrice || "N/A"} Tk
                      </p>
                    </div>
                    <div>
                      <p className="text-[#656565]">Purchase Price</p>
                      <p className="text-[#00171d] font-semibold">
                        {productData?.purchasePrice || "N/A"} Tk
                      </p>
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
                      {productData?.attributes?.length > 0 ? (
                        <>
                          {productData?.attributes?.map((item: any, i: any) => (
                            <div key={i}>
                              <p className="text-[#656565]">
                                {item?.attributeName}
                              </p>
                              <p className="text-[#00171d] font-semibold">
                                {item?.label || "N/A"}
                              </p>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div>
                          <p className="text-[#00171d] ">No Attributes</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Attributes box */}
                  <div className="border-[1px] border-[#ebebeb] p-[16px] mb-[16px]">
                    <div className="flex justify-between mb-5">
                      <p className="text-[16px] font-semibold">
                        Specifications
                      </p>
                    </div>
                    <div className="grid grid-cols-4">
                      <div>
                        <p className="text-[#656565]">Weight</p>
                        <p className="text-[#00171d] font-semibold">
                          {productData?.weight + " " + productData?.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
