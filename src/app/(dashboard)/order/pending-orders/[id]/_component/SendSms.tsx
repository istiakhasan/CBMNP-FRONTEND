"use client"
import Image from "next/image";
import SmsImage from "../../../../../../assets/images/icons/sms_img.png";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";

const SendSms = () => {
  return (
    <div>
      <Image className="block mx-auto" alt="" src={SmsImage} />
      <h1 className="text-[#333333] font-[600] text-[14px] mb-[10px]">
        Do you want to submit a sms?
      </h1>
        <div className="mb-[10px]">
          <GbFormSelect
            options={[
              {
                label: "Issue 1",
                value: "issue 1",
              },
            ]}
            name="sms_to"
            label="Send sms to"
            placeholder="Please select an option"
          />
        </div>
        <div className="mb-[10px]">
          <GbFormInput name="sms" label="Sms" />
        </div>
        <div className="flex gap-[10px]">
            <button className="border-[1px] flex-1 border-[#F48C13] text-[#F48C13] text-[14px] font-[500] p-[11px]">Cancel</button>
            <button className=" flex-1 bg-[#F48C13] text-[white] text-[14px] font-[500] p-[11px]">Submit</button>
        </div>
     
    </div>
  );
};

export default SendSms;
