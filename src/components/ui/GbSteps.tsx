"use client";
import React, { useState } from "react";
import { Button, message } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "react-hook-form";

import GbForm from "../forms/GbForm";
import GbFileUpload from "../forms/GbFileUpload";
import GbCascaderPicker from "../forms/GbCascaderPicker";
import GbFormInput from "../forms/GbFormInput";
import GbFormTextArea from "../forms/GbFormTextArea";
import GbBDTInput from "../forms/GbBTDInput";

import CubicMeters from "@/app/[locale]/(dashboard)/products/_component/CubicMeters";
import AttributesAndVariants from "@/app/[locale]/(dashboard)/products/add-product/_component/AttributesAndVariants";

import { useCreateVariantProductMutation } from "@/redux/api/productApi";
import { createVariantProductSchema } from "@/schema/IepSchema";
import { uploadImageToImagebb } from "@/util/commonUtil";

/**
 * Notes on layout fixes:
 * - Right panel wrapped in a white card with padding and rounded corners
 * - Right panel made independently scrollable with a max-height (responsive)
 * - Grid columns responsive: stacked on small screens, two cols on md+
 * - Bottom sticky bar given z-index so it doesn't overlap content incorrectly
 */

const GbCreateVariantProduct: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [createProduct] = useCreateVariantProductMutation();

  const submitHandler = async (formData: any) => {
    try {
      const uploadImages = async (images: any[] = []) =>
        Promise.all(
          images.map(async (file: any) => {
            const form = new FormData();
            form.append("image", file.originFileObj);
            return await uploadImageToImagebb(form);
          })
        );

      const transformVariant = async (variant: any, categoryId: string) => ({
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
        images: await uploadImages(variant.product_image || []),
        attributes:
          variant.attributes?.map((item: any) => ({
            label: item?.label,
            attributeName: item?.attributeName,
          })) || [],
        categoryId,
        productType: "Base Product",
      });

      const categoryId = formData?.category?.id?.toString() || null;

      const transformedProduct = {
        name: formData.name,
        description: formData.description,
        weight: formData.weight,
        unit: formData.unit?.label || "",
        regularPrice: formData.regularPrice,
        salePrice: formData.salePrice,
        retailPrice: formData.retailPrice,
        distributionPrice: Number(formData.distributionPrice),
        purchasePrice: formData.purchasePrice,
        sku: formData.sku,
        internalId: formData.internalId,
        isBaseProduct: true,
        images: await uploadImages(formData.product_image || []),
        categoryId,
        variants: await Promise.all(
          (formData.variants || []).map((v: any) =>
            transformVariant(v, categoryId)
          )
        ),
        productType: "Variant",
      };

      await createProduct(transformedProduct).unwrap();
      message.success("✅ Product created successfully!");
    } catch (error) {
      console.error("Error during product creation:", error);
      message.error("Failed to create product.");
    }
  };

  return (
    <GbForm
      resolver={yupResolver(createVariantProductSchema)}
      submitHandler={submitHandler}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-28">
        {/* LEFT PANEL */}
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div>
            <p className="text-[15px] font-medium mb-2">Product Images</p>
            <GbFileUpload name="product_image" />
            <p className="text-xs text-gray-500 mt-2">
              Maximum 6 images (.jpeg, .jpg, .png). Max 3MB/file.
            </p>
          </div>

          <div className="space-y-3">
            <GbFormInput name="name" size="small" label="Product Name" />
            <GbFormTextArea
              name="description"
              size="small"
              rows={2}
              label="Product Summary"
            />
            <GbCascaderPicker
              name="category"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
          </div>

          <div>
            <p className="text-[15px] font-medium mb-3">Product Specifications</p>
            <CubicMeters />
          </div>

          <div>
            <p className="text-[15px] font-medium mb-3">Pricing</p>
            <div className="grid grid-cols-1 gap-3">
              <GbBDTInput addon="BDT" name="regularPrice" label="Regular" placeholder="0.00" />
              <GbBDTInput addon="BDT" name="salePrice" label="Sale" placeholder="0.00" />
              <GbBDTInput addon="BDT" name="retailPrice" label="Retail Price" placeholder="0.00" />
              <GbBDTInput addon="BDT" name="distributionPrice" label="Distributor Price" placeholder="0.00" />
              <GbBDTInput addon="BDT" name="purchasePrice" label="Purchase Price" placeholder="0.00" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-medium mb-3">Additional Information</p>
            <GbFormInput name="sku" label="SKU" size="small" />
            <GbFormInput name="internalId" label="Internal ID" size="small" />
          </div>
        </section>

        {/* RIGHT PANEL - FIXED DESIGN */}
        <section className="flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attributes & Variants</h3>
              <p className="text-sm text-gray-500">Manage options & SKUs</p>
            </div>

            {/* Make content scrollable independently so long lists don't push layout */}
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <AttributesAndVariants
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />
            </div>
          </div>

          {/* optional quick info / tips area beneath variants (keeps right column balanced) */}
          <div className="mt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-sm text-gray-600">
              Tip: Use attributes to generate variants automatically. Long lists will scroll inside the panel.
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM FIXED BUTTONS (ensure above content) */}
      <div className="flex items-center justify-center gap-3 sticky bottom-0 bg-white py-4 border-t z-50">
        <ClearButton />
        <Button type="primary" htmlType="submit" style={{ borderRadius: 0 }}>
          Create Product
        </Button>
      </div>
    </GbForm>
  );
};

export default GbCreateVariantProduct;

/** Clear Button Component */
export const ClearButton = () => {
  const { reset } = useFormContext();
  return (
    <Button
      type="primary"
      ghost
      htmlType="button"
      onClick={() => {
        reset();
        message.success("Form cleared");
      }}
      style={{ borderRadius: 0 }}
    >
      Clear
    </Button>
  );
};
