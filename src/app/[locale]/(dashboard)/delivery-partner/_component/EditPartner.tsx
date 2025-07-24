import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useCreatePartnerMutation, useUpdatePartnerMutation } from "@/redux/api/partnerApi";
import { createPartnerSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

const EditPartner = ({setPartnerCreateModal,rowData}:{setPartnerCreateModal:any,rowData:any}) => {
  const [updatePartner] = useUpdatePartnerMutation();
  return (
    <div>
      <h1 className="text-[20px]">Edit Delivery Partner</h1>
      <GbForm 
        resolver={yupResolver(createPartnerSchema)}
        defaultValues={{
            partnerName:{
                label:rowData?.partnerName,
                value:rowData?.partnerName,
            },
            phone:rowData?.phone,
            api_key:rowData?.api_key,
            secret_key:rowData?.secret_key,
            contactPerson:rowData?.contactPerson
        }}
        submitHandler={async (data: any,reset:any) => {
          try {
            const { partnerName, ...rest } = data;
            const payload = {
              ...rest,
              partnerName: partnerName?.value,
            };

            if (partnerName?.value !== "SteadFast") {
              delete payload["secret_key"];
              delete payload["api_key"];
            }

            const res = await updatePartner({data:payload,id:rowData?.id}).unwrap();
            if(res?.message){
                message.success(res?.message)
                setPartnerCreateModal(false)
                reset()
            }
          } catch (error:any) {
            if(error?.data?.errorMessages){
                 error?.data?.errorMessages?.forEach((item:any)=>{
                    message.error(item?.message)
                })
            }else{
                message.error('Something went wrong')

            }
            console.log(error);
          }
        }}
      >
        <FormBody />
      </GbForm>
    </div>
  );
};

export default EditPartner;

const FormBody = () => {
  const { watch } = useFormContext();
  return (
    <>
      <div className="mb-2">
        <GbFormSelect
          label="Partner"
          disabled={true}
          name="partnerName"
          options={[
            {
              label: "SteadFast",
              value: "SteadFast",
            },
            {
              label: "FedEx",
              value: "FedEx",
            },
            {
              label: "Express",
              value: "Express",
            },
          ]}
        />
      </div>
      <div className="mb-2">
        <GbFormInput name="phone" label="phone" />
      </div>
      <div className="mb-2">
        <GbFormInput name="contactPerson" label="Contact Person" />
      </div>
      {watch()?.partnerName?.value === "SteadFast" && (
        <>
          <div className="mb-2">
            <GbFormInput name="api_key" label="Api Key" />
          </div>
          <div className="mb-4">
            <GbFormInput name="secret_key" label="Secret Key" />
          </div>
        </>
      )}
      <div className="mb-2 flex justify-end items-center">
        <button
          //   onClick={() => setPartnerCreateModal(true)}
          className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] uppercase"
        >
          Update
        </button>
      </div>
    </>
  );
};
