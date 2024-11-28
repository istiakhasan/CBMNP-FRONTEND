/* eslint-disable @next/next/no-img-element */
import { getBaseUrl } from "@/helpers/config/envConfig";
import React from "react";
import { useFormContext } from "react-hook-form";

const ProfileInfoPreview = ({showUpload=true}:{showUpload?:boolean}) => {
  const { watch,setValue,formState:{errors} } = useFormContext()
  return (
    <div className="bg-white p-[24px] col-span-5 rounded-[10px]">
      <div className="flex flex-col items-center mb-[40px]">
        <div className="rounded-[50%] h-[170px] w-[170px] border-[2px] border-[#FDE8D0] p-1 relative">
        <img
          className=" object-cover rounded-[50%] h-[100%] w-[100%] mb-[12px]"
          alt=""
          src={
            watch()?.file
              ? URL.createObjectURL(watch().file)
              : watch()?.employee?.profile_img
              ? `${getBaseUrl()}/${watch()?.employee?.profile_img}`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
        />
      {showUpload &&  <label className=" absolute bottom-[3%] right-[8%]" htmlFor="upload_id">
           <i className="ri-add-circle-fill text-[#2B66AC]  cursor-pointer text-[20px] "></i>
           <input onChange={(e)=>{
            if(e.target.files){
              setValue('file',e?.target?.files[0])   
            }
           }} className="hidden" type="file" id="upload_id" />
        </label>}
        
        </div>
        <h1 className="text-[#343434] text-[20px] font-[700] mb-[4px]">
          {watch()?.employee?.firstName ? watch()?.employee?.firstName : "-"}{" "}
          {watch()?.employee?.lastName ? watch()?.employee?.lastName : "-"}
        </h1>
        <p className="text-[#7D7D7D] font-[500] text-[14px]">
          {watch()?.employee?.employeeId ? watch()?.employee?.employeeId : "--"}
        </p>
      </div>

      <div className="mb-[38px]">
        <h1 className="text-[#343434] font-[500] text-[16px] mb-[12px]">
          Department and designation
        </h1>

        <button className="px-[12px] py-[8px] text-[#F48C13] bg-[#FDE8D0] font-[500] text-[10px] mr-[12px]">
          {watch()?.department?.label?watch()?.department?.label:"--"}
        </button>
        <button className="px-[12px] py-[8px] text-[#F48C13] bg-[#FDE8D0] font-[500] text-[10px] ">
          {watch()?.employee?.designation}
        </button>
      </div>
      <div className="">
        <h1 className="text-[#343434] font-[500] text-[16px] mb-[16px]">
          Profile details
        </h1>
        <div className="grid grid-cols-2">
          <div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Present address
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.presentAddress
                  ? watch()?.employee?.presentAddress
                  : "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Permanent address
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.permanentAddress || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Phone number
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.phoneNumber || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Additional phone number
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.additionalNumber || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Personal email
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.personalEmail || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Additional email
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.additionalEmail || "--"}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Reporting Person
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.reportingPerson || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                National Id
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.nationalId || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Gender
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.presentAddress
                  ? watch()?.employee?.gender
                  : "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Blood Group
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.blood_group?.value || watch()?.employee?.blood_group  || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Date of birth
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.dateOfBirth || "--"}
              </p>
            </div>
            <div className="mb-[14px]">
              <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                Date of Joining
              </h1>
              <p className="text-[#A2A2A2] text-[12px] font-[400]">
                {watch()?.employee?.joiningDate || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoPreview;
