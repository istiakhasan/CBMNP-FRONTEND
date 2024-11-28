import React, { useRef, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import GbForm from "../forms/GbForm";
import GbFormInput from "../forms/GbFormInput";
import GbFileUpload from "../forms/GbFileUpload";
import GbFormTextArea from "../forms/GbFormTextArea";
import GbCascaderPicker from "../forms/GbCascaderPicker";
import CubicMeters from "@/app/(dashboard)/product/_component/CubicMeters";
import GbBTDInput from "../forms/GbBTDInput";
import AttributesAndVariants from "@/app/(dashboard)/product/add-product/_component/AttributesAndVariants";
import { useCreateProductMutation, useCreateVariantProductMutation } from "@/redux/api/productApi";

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
            1MB/file.)
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
              name="productSummary"
              size="small"
              label="Product Summary"
            />
          </div>
          <div className="mb-4">
            <GbCascaderPicker name="category" />
          </div>
          <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
            Product Specifications
          </p>
          <CubicMeters />
          <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
            Prices
          </p>
          <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">MRP</p>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
              placeholder="0.00"
              name="regularPrice"
              size="small"
              label="Regular"
            />
          </div>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
              placeholder="0.00"
              name="salePrice"
              size="small"
              label="Sale"
            />
          </div>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
              placeholder="0.00"
              name="retailerPrice"
              size="small"
              label="Retail Price"
            />
          </div>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
              placeholder="0.00"
              name="distributorPrice"
              size="small"
              label="Distributor Price"
            />
          </div>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
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
            <GbBTDInput
              addon={"BTD"}
              placeholder="0.00"
              name="sku"
              size="small"
              label="SKU"
            />
          </div>
          <div className="mb-4">
            <GbBTDInput
              addon={"BTD"}
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
    content: <AttributesAndVariants />,
  },
];

const GbSteps: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const divRef: any = useRef();
  const [createProduct]=useCreateVariantProductMutation()
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


  const submitHandler=async(data:any)=>{
    try {
  
      const payload={...data}
      payload['volumeUnit']=data?.volumeUnit?.value
      payload['weightUnit']=data?.weightUnit?.value
      payload['category']=Number(data?.category[0]?.id)
      payload['status']=true
      payload['addProductType']="variants"
      delete payload["product_image"]
      payload['variants']=data?.variants?.map((item:any)=>{
          const {id,...rest}=item
          return {
            ...rest,
            attributes:item?.attributes?.map((jtem:any)=>{
              return {
                attributesName:jtem?.attributeName,
                attributesValue:jtem?.value,
              }
            })
          }
      })
      
    
      // const formdata = new FormData();
      // for (let item in payload) {
      //   formdata.append(item, payload[item]);
      // }
      // for (let item in data["product_image"]) {
      //   formdata.append(
      //     "product_gallery",
      //     data["product_image"][item]?.originFileObj
      //   );
      // }
      const res=await createProduct(payload).unwrap()
      // message.success('Product create successfully...') 
    } catch (error) {
      
    }
  }

  return (
    <div className="">
      <GbForm submitHandler={submitHandler}>
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
          {true && (
            <Button
              type="primary"
              style={{ borderRadius: "0px" }}
              ghost
              onClick={() => message.success("Processing complete!")}
            >
              Clear
            </Button>
          )}
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
