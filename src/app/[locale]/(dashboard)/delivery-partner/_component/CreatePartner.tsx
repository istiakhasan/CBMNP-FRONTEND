import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useCreatePartnerMutation } from "@/redux/api/partnerApi";
import { createPartnerSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

const CreatePartner = ({setPartnerCreateModal}:{setPartnerCreateModal:any}) => {
  const [createPartner] = useCreatePartnerMutation();
  return (
    <div>
      <h1 className="text-[20px]">Create Delivery Partner</h1>
      <GbForm 
        resolver={yupResolver(createPartnerSchema)}
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
            if (partnerName?.value === "Other") {
              payload["partnerName"]=rest?.other_partnerName
              delete payload["other_partnerName"];
            }

            const res = await createPartner(payload).unwrap();
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

export default CreatePartner;

const FormBody = () => {
  const { watch } = useFormContext();
  return (
    <>
      <div className="mb-2">
        <GbFormSelect 
          label="Partner"
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
            {
              label: "Other",
              value: "Other",
            },
          ]}
        />
      </div>
          {watch()?.partnerName?.value === "Other" && (
        <>
          <div className="mb-2">
            <GbFormInput name="other_partnerName" label="Name" />
          </div>
        </>
      )}
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
          Create
        </button>
      </div>
    </>
  );
};
