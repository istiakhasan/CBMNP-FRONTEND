import React, { useRef, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import GbForm from "../forms/GbForm";
import GbFormInput from "../forms/GbFormInput";
import GbFileUpload from "../forms/GbFileUpload";
import GbFormTextArea from "../forms/GbFormTextArea";
import GbCascaderPicker from "../forms/GbCascaderPicker";
import { useCreateVariantProductMutation } from "@/redux/api/productApi";
import { uploadImageToImagebb } from "@/util/commonUtil";
import { yupResolver } from "@hookform/resolvers/yup";
import { createVariantProductSchema } from "@/schema/IepSchema";
import CubicMeters from "@/app/[locale]/(dashboard)/product/_component/CubicMeters";
import AttributesAndVariants from "@/app/[locale]/(dashboard)/product/add-product/_component/AttributesAndVariants";
import GbBDTInput from "../forms/GbBTDInput";
import { useFormContext } from "react-hook-form";

const GbSteps: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const steps = [
    {
      title: "Product Details",
      content: (
        <div className="w-[427px]   mx-auto">
          <div>
            <p className="text-[rgba(0,0,0,.85)] text-[15px] mb-2">
              Product Images
            </p>
            <GbFileUpload name="product_image" />
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
              />
            </div>
            <div className="mb-4">
              <GbBDTInput
                addon={"BDT"}
                placeholder="0.00"
                name="retailPrice"
                size="small"
                label="Retail Price"
              />
            </div>
            <div className="mb-4">
              <GbBDTInput
                addon={"BDT"}
                placeholder="0.00"
                name="distributionPrice"
                size="small"
                label="Distributor Price"
              />
            </div>
            <div className="mb-4">
              <GbBDTInput
                addon={"BDT"}
                placeholder="0.00"
                name="purchasePrice"
                size="small"
                label="Purchase Price"
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
              <GbBDTInput
                addon={"BDT"}
                placeholder="0.00"
                name="internalId"
                size="small"
                label="Internal ID"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Attributes & Variants",
      content: (
        <AttributesAndVariants
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      ),
    },
  ];
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const divRef: any = useRef();
  const [createProduct] = useCreateVariantProductMutation();
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
    minHeight: "100vh",
  };

  const submitHandler = async (abc: any) => {
    try {
      const transformProductData = async (data: any) => {
        const mapImages = async (images: any) => {
          const imagePromises = images.map(async (item: any) => {
            const formData = new FormData();
            formData.append("image", item.originFileObj);
            const uploadedImage = await uploadImageToImagebb(formData);
            return uploadedImage;
          });

          const uploadedImages = await Promise.all(imagePromises);
          return uploadedImages;
        };

        const transformVariant = async (variant: any) => ({
          name: variant.name,
          description: variant.description,
          weight: variant.weight,
          unit: variant.unit?.label || "",
          volume: variant.volume || "",
          volumeUnit: variant.volumeUnit || "",
          isBaseProduct: false,
          regularPrice: variant.regularPrice,
          salePrice: variant.salePrice || "",
          retailPrice: variant.retailPrice,
          distributionPrice: Number(variant.distributionPrice) || "",
          purchasePrice: variant.purchasePrice,
          variantSku: variant.variantSku,
          internalId: variant.internalId,
          images: await mapImages(variant.product_image || []),
          attributes:
            variant.attributes?.map((item: any) => {
              return {
                label: item?.label,
                attributeName: item?.attributeName,
              };
            }) || [],
          categoryId: data.category?.id?.toString() || null,
          productType: "Base Product",
        });

        const transformedData = {
          name: data.name,
          description: data.description,
          weight: data.weight,
          unit: data.unit?.label || "",
          regularPrice: data.regularPrice,
          salePrice: data.salePrice,
          retailPrice: data.retailPrice,
          distributionPrice: Number(data.distributionPrice),
          purchasePrice: data.purchasePrice,
          sku: data.sku,
          internalId: data.internalId,
          isBaseProduct: true,
          images: await mapImages(data.product_image || []),
          categoryId: data.category?.id?.toString() || null,
          variants: await Promise.all(
            (data.variants || []).map(transformVariant)
          ),
          productType: "Variant",
        };

        return transformedData;
      };
      const result = await transformProductData(abc);

      const res = await createProduct(result).unwrap();
      message.success("Product created successfully...");
    } catch (error) {
      console.error("Error during product creation:", error);
      // Handle error appropriately (e.g., show error message)
    }
  };

  return (
    <div className="">
      <GbForm
        resolver={yupResolver(createVariantProductSchema)}
        submitHandler={submitHandler}
      >
        <div
          style={{ top: 60 }}
          className="flex sticky bg-[white] py-[15px]  z-20   items-center justify-center"
        >
          <Steps
            style={{ width: "560px", fontWeight: "bold" }}
            current={current}
            items={items}
          />
        </div>
        <div ref={divRef} style={contentStyle}>
          {steps[current].content}
        </div>
        <div
          className="flex items-center justify-center gap-3 sticky bottom-0 bg-[white] py-[20px]"
          style={{ marginTop: 24 }}
        >
          {true && <ClearButton />}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              style={{ borderRadius: "0px" }}
              onClick={() => next()}
            >
              Continue
            </Button>
          )}

          {current > 0 && (
            <Button
              style={{ margin: "0 8px", borderRadius: "0px" }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "0px" }}
              // onClick={(data:any) =>console.log(data,"form data") }
            >
              Create
            </Button>
          )}
        </div>
      </GbForm>
    </div>
  );
};

export default GbSteps;

export const ClearButton = () => {
  const {reset}=useFormContext()
  return (
    <Button
      type="primary"
      style={{ borderRadius: "0px" }}
      ghost
      htmlType="button"
      onClick={() => {
        reset()
        message.success("Reset Form");
      }}
    >
      Clear
    </Button>
  );
};
