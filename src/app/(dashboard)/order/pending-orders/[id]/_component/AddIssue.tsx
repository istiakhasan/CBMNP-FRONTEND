"use client"
import Image from "next/image";
import IssueImage from "../../../../../../assets/images/icons/add_issue_img.png";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";

const AddIssue = () => {
  return (
    <div>
      <Image className="block mx-auto" alt="" src={IssueImage} />
      <h1 className="text-[#333333] font-[600] text-[14px] mb-[10px]">
        Do you want to submit an issue?
      </h1>
        <div className="mb-[10px]">
          <GbFormSelect
            options={[
              {
                label: "Issue 1",
                value: "issue 1",
              },
            ]}
            name="issue"
            label="Issue"
            placeholder="Please select an option"
          />
        </div>
        <div className="mb-[10px]">
          <GbFormInput name="issue_reason" label="Issue reason" />
        </div>
        <div className="flex gap-[10px]">
            <button className="border-[1px] flex-1 border-[#F48C13] text-[#F48C13] text-[14px] font-[500] p-[11px]">Cancel</button>
            <button className=" flex-1 bg-[#F48C13] text-[white] text-[14px] font-[500] p-[11px]">Submit</button>
        </div>
     
    </div>
  );
};

export default AddIssue;
