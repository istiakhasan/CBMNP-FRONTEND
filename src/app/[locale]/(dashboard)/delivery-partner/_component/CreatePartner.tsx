import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import React from "react";
import { useFormContext } from "react-hook-form";

const CreatePartner = () => {
  return (
    <div>
      <h1 className="text-[20px]">Create Delivery Partner</h1>
      <GbForm submitHandler={(data: any) => console.log(data)}>
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
          Create
        </button>
      </div>
    </>
  );
};
