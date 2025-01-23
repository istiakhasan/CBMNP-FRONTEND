import GbFormInput from "@/components/forms/GbFormInput";
import React from "react";
import CustomerType from "./CustomerType";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import GbFormSelect from "@/components/forms/GbFormSelect";

const CreateCustomerDrawar = () => {
  return (
    <div className="flex flex-col min-h-[80vh]  gap-[12px] pb-[100px]">
      <div>
        <GbFormInput label="Name" name="customerName" />
      </div>
      <div>
        <GbFormInput name="customerPhoneNumber" label="Phone" />
      </div>
      <div>
        <GbFormInput
          name="customerAdditionalPhoneNumber"
          label="Additional number"
        />
      </div>

      <div>
        <GbFormSelect
          name="customerType"
          label="Customer type"
          placeholder="Customer type"
          options={[
            {
              label: "PROBASHI",
              value: "PROBASHI",
            },
            {
              label: "NON_PROBASHI",
              value: "NON_PROBASHI",
            },
          ]}
        />
      </div>

      <CustomerType />
      <div className="col-span-3">
        <GbFormTextArea
          name="address"
          label="Address"
          placeholder="Enter address"
        />
      </div>
      <div className=" py-[30px] absolute bottom-0 w-full right-[0px] pr-[20px] flex items-center gap-2 justify-end">
          <button type="submit" className="bg-[#278ea5] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]">Create</button>
        </div>
    </div>
  );
};

export default CreateCustomerDrawar;
