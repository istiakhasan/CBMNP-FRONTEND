import GbBTDInput from "@/components/forms/GbBTDInput";
import GbCascaderPicker from "@/components/forms/GbCascaderPicker";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useCreateProductMutation } from "@/redux/api/productApi";
import CubicMeters from "./CubicMeters";
import { useForm, useFormContext } from "react-hook-form";
import { message } from "antd";
import { useState } from "react";

const AddSimpleProuct = ({setDrawerOpen}:any) => {
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [createProduct]=useCreateProductMutation()
    const handleSubmit=async(data:any,reset:any)=>{
      try {
        const {category,unit,images,...rest}=data
        const payload={...rest}
        payload['categoriesId']=category[0]?.id
        payload['unit']=unit?.label
        const formData=new FormData()
        for(let item in payload){
             formData.append(item,payload[item])
        }
        for (let item in images) {
          formData.append(
            "images",
            images[item]?.originFileObj
          );
        }
        const res=await createProduct(formData).unwrap()
        if(!!res?.success){
          message.success(res?.message)
          setDrawerOpen(false)
          setSelectedValue([])
          reset()
        }
      } catch (error) {
        message.error('Something went wrong ,please debug the error')
        console.log(error,"error");
      }
    }
  return (
    <GbForm submitHandler={handleSubmit}>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4">
        Product Images
      </p>
      <GbFileUpload name="images" />
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
          name="description"
          size="small"
          label="Product Summary"
        />
      </div>
      <div className="mb-4">
        <GbCascaderPicker selectedValue={selectedValue} setSelectedValue={setSelectedValue} name="category" />
      </div>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Product Specifications
      </p>
      <CubicMeters />
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Prices
      </p>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        MRP
      </p>
     
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="regularPrice" size="small" label="Regular" />
        </div>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="salePrice" size="small" label="Sale" />
        </div>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="retailPrice" size="small" label="Retail Price" />
        </div>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="distributionPrice" size="small" label="Distributor Price" />
        </div>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="purchasePrice" size="small" label="Purchase Price" />
        </div>
        <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Additional Information
      </p>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="sku" size="small" label="SKU" />
        </div>
        <div className="mb-4">
          <GbBTDInput addon={'BTD'} placeholder="0.00" name="internalId" size="small" label="Internal ID" />
        </div>

        <div className="bg-white py-[30px] sticky bottom-0 flex items-center gap-2 justify-end">
          <button className="text-[#278ea5] border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]">Clear</button>
          <button type="submit" className="bg-[#278ea5] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]">Create</button>
        </div>
    </GbForm>
  );
};

export default AddSimpleProuct;
