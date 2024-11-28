"use client";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useUploadSliderMutation } from "@/redux/api/sliderApi";
import { message } from "antd";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";

const UploadCard = () => {
  const [switchCardToEdit, setSwitchCardToUpload] = useState<boolean>(false);
  const [handleUploadSlider] = useUploadSliderMutation();
  const handleCreateSlider = () => {
    setSwitchCardToUpload(!switchCardToEdit);
  };
  const submitHandler = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("url", data?.url);
      formData.append("image", data?.image);
      const res = await handleUploadSlider(formData);
      if(res){
		message.success('Slider crated successfully...')
	  }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`relative h-[315px] w-[234px] p-4 border border-borderLine rounded-xl shadow bg-[#FFFFFF] ${
        !switchCardToEdit
          ? "flex items-center justify-center "
          : "flex items-start justify-start"
      } cursor-pointer`}
    >
      <div className={`${switchCardToEdit ? "hidden" : ""}`}>
        <p
          className="capitalize text-[#A2A2A2] flex flex-col items-center justify-center space-y-2"
          onClick={handleCreateSlider}
        >
          <MdOutlineFileUpload className="text-2xl" />
          <span>Create new slider</span>
        </p>

        <div
          onClick={handleCreateSlider}
          className="w-[58px] h-[58px] absolute top-[-10%] left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-white shadow-lg rounded-full cursor-pointer"
        >
          <span className="">
            <LuPlus className="text-2xl" />
          </span>
        </div>
      </div>

      <div
        className={`w-full flex flex-col items-center justify-center space-y-3 ${
          switchCardToEdit ? "" : "hidden"
        }`}
      >
        <GbForm submitHandler={submitHandler}>
          <div>
            <label htmlFor="" className=" text-[10px] font-medium">
              Product Name
            </label>
            <GbFormInput name="name" />
          </div>
          <div className="mb-2">
            <label htmlFor="" className=" text-[10px] uppercase font-medium">
              url link
            </label>
            <GbFormInput name="url" />
          </div>
          <div>
            <GbFileUpload name="image" />
          </div>

          <div className="w-full my-3 flex items-end justify-end space-x-2 ">
            <button
              type="button"
              onClick={() => setSwitchCardToUpload(false)}
              className=" capitalize rounded bg-[#EB2B2B] text-white text-center text-[8px] cursor-pointer py-1 px-3"
            >
              Remove
            </button>
            <button className=" capitalize rounded bg-[#A1C4ED] text-white text-center text-[8px] cursor-pointer py-1 px-3">
              save
            </button>
          </div>
        </GbForm>
      </div>
    </div>
  );
};

export default UploadCard;
