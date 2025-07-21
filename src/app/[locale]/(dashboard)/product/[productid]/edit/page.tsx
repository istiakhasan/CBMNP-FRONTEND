"use client";
import GbCascaderPicker from "@/components/forms/GbCascaderPicker";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React, { useEffect, useState } from "react";
import CubicMeters from "../../_component/CubicMeters";
import { Button, message } from "antd";
import { useParams } from "next/navigation";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { deleteImageFromImagebb, mapImagesForUpload } from "@/util/commonUtil";
import GbBDTInput from "@/components/forms/GbBTDInput";

const Page = () => {
  const { productid } = useParams();
  const [updateProduct] = useUpdateProductMutation();
  const { data, isLoading } = useGetProductByIdQuery({
    id: productid,
  });
  const productData = data?.data?.data;
  const [selectedValue, setSelectedValue] = useState<any>([]);
  useEffect(() => {
    setSelectedValue([data?.data?.data?.category?.id]);
  }, [data]);

  const defaultValue = {
    name: productData?.name,
    description: productData?.description,
    weight: productData?.weight,
    unit: productData?.unit,
    regularPrice: productData?.regularPrice,
    retailPrice: productData?.retailPrice,
    salePrice: productData?.salePrice,
    distributionPrice: productData?.distributionPrice,
    purchasePrice: productData?.purchasePrice,
    sku: productData?.sku,
    images: productData?.images,
    category: productData?.category,
  };
  return (
    <div>
      <GbHeader title="Edit product" />
      <div className="p-[16px]">
        <GbForm
          defaultValues={{ ...defaultValue }}
          submitHandler={async (payload: any) => {
            const { category, images, unit, ...rest } = payload;
            const alreadyInList = productData?.images?.filter((item: any) =>
              images?.some((ii: any) => ii.url === item?.url)
            );
            const newUploadedImages = images;

           let newUmageUrl:any=[];
            if(newUploadedImages?.filter((item: any) => !!item?.originFileObj)?.length> 0){
            newUmageUrl=await  mapImagesForUpload(newUploadedImages?.filter((item: any) => !!item?.originFileObj) || [])
            }

            const  addToDataBase:any=[...alreadyInList,...newUmageUrl]

            const modiedData = {
              ...rest,
              categoryId: category?.id,
              unit: unit?.value,
              images:addToDataBase
            };
            delete modiedData['internalId']
            const res = await updateProduct({
              id: productData?.id,
              data: modiedData,
            }).unwrap();
            if (res?.success) {
              message.success(`Product update successfully`);
            }
          }}
        >
          <div className="w-[427px]   mx-auto">
            <h1 className="text-[20px] text-center">Update Product</h1>
            <div>
              <p className="text-[rgba(0,0,0,.85)] text-[15px] mb-2">
                Product Images
              </p>
              <GbFileUpload name="images" defaultValue={productData?.images} />
              <p className="text-[#999] text-[12px]">
                Please upload maximum 6 images. (.jpeg, .jpg or .png. Max size
                3MB/file.)
              </p>
              <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
                Product Details
              </p>

              <div className="mb-4">
                <GbFormInput name="name" size="small" label="Product Name" />
              </div>
              <div className="mb-4">
                <GbFormTextArea
                  rows={1}
                  name="description"
                  size="small"
                  label="Product Summary"
                />
              </div>
              <div className="mb-4">
                <GbCascaderPicker
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  name="category"
                />
              </div>
              <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
                Product Specifications
              </p>
              <CubicMeters />
              <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
                MRP
              </p>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="regularPrice"
                  size="small"
                  type="Number"
                  label="Regular"
                />
              </div>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="salePrice"
                  size="small"
                  label="Sale"
                  type="Number"
                />
              </div>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="retailPrice"
                  size="small"
                  label="Retail Price"
                  type="Number"
                />
              </div>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="distributionPrice"
                  size="small"
                  label="Distributor Price"
                  type="Number"
                />
              </div>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="purchasePrice"
                  size="small"
                  label="Purchase Price"
                  type="Number"
                />
              </div>
              <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
                Additional Information
              </p>
              <div className="mb-4">
                <GbBDTInput
                  addon={"BDT"}
                  placeholder="0.00"
                  name="sku"
                  size="small"
                  label="SKU"
                />
              </div>
              <div className="mb-4">
                <GbFormInput
                  placeholder="Write Id"
                  name="internalId"
                  size="small"
                  label="Internal ID"
                />
              </div>
              <div className="flex gap-3 justify-end sticky bottom-0 bg-white py-5">
                {/* <Button
                  type="primary"
                  style={{ borderRadius: "0px" }}
                  ghost
                  onClick={() => message.success("Processing complete!")}
                >
                  Clear
                </Button> */}
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: "0px" }}
                  // onClick={(data:any) =>console.log(data,"form data") }
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </GbForm>
      </div>
    </div>
  );
};

export default Page;
