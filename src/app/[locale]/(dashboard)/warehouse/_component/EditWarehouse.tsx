import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import {  useUpdateWarehouseMutation } from "@/redux/api/warehouse";
import { createWarehouseSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ConfigProvider, message, Spin } from "antd";
import React, { useState } from "react";

const EditWarehouse = ({setOpen,rowData}:any) => {
    const [submitLoading,setSubmitLoading]=useState(false)
    const [updateWarehouse]=useUpdateWarehouseMutation()
  return (
    <div className="p-[20px]">
        <h1 className="text-[20px]">Edit Warehouse</h1>
      <GbForm resolver={yupResolver(createWarehouseSchema)} defaultValues={{
        name:rowData?.name,
        contactPerson:rowData?.contactPerson,
        phone:rowData?.phone,
        location:rowData?.location
      }} submitHandler={async(data: any,reset:any) => {
        try {
            setSubmitLoading(true)
            const res=await updateWarehouse({
              id:rowData?.id,
              data:data
            }).unwrap()
            if(!!res?.success){
                message.success(res?.message)
                setSubmitLoading(false)
                setOpen(false)
                reset()
            }
        } catch (error:any) {
            if(error?.data?.errorMessages){
                error?.data?.errorMessages?.forEach((item:any)=>{
                       message.error(item?.message)
                }) 
            }
            setSubmitLoading(false)
        }
      }}>
        <div className="mb-4">
          <GbFormInput name="name" label="name" />
        </div>
        <div className="mb-4">
          <GbFormInput name="contactPerson" label="Contact person" />
        </div>
        <div className="mb-4">
          <GbFormInput name="phone" label="Phone" />
        </div>
        <div className="mb-4">
          <GbFormTextArea name="location" label="Location" />
        </div>
        <div className="flex justify-end gap-2 mt-5 pt-5">
          <button type="button" onClick={()=>setOpen(false)} className="text-[#4F8A6D] border-[#4F8A6D] border-[1px] font-bold text-[12px]  px-[20px] py-[5px]">
            Close
          </button>
          <button 
          disabled={submitLoading}
          type="submit"
          className="bg-[#4F8A6D] w-[100px] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]"
        >
          {submitLoading ? (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "white", // Default primary color (used in Spin)
                },
              }}
            >
              <Spin />
            </ConfigProvider>
          ) : (
            "Update"
          )}
        </button>
        </div>
      </GbForm>
    </div>
  );
};

export default EditWarehouse;
