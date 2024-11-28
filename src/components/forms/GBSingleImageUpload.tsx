"use client"
import React from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useFormContext } from "react-hook-form";
import { getErrorMessageByPropertyName } from "@/util/schema-validator";

const fileList: UploadFile[] = [];

const GBSingleImageUpload = ({
  name,
  title,
  isMultiple
}: {
  name: string;
  title?: string;
  isMultiple?:boolean
}) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    setValue(name, info?.fileList);
  };
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
    <div className="product_upload_image_container">


      <Upload
        action="/api/file"
        listType="picture"
        style={{
            background:"red"
        }}
        defaultFileList={[...fileList]}
        onChange={handleChange}
        multiple={isMultiple} 
        name={name}
        
      >
        <div className="text-center">
          {title && <p className="text-[#343434] text-[10px] font-[500] my-[10px]">{title}</p>}
          {<i className="ri-image-add-line text-[24px]"></i>}
          <div className="text-[#343434] text-[10px] font-[500]">
            {" "}
            <span className="text-[#4E9EFC] font-[500] text-[10px] underline">
              Click to upload
            </span>{" "}
            OR
          </div>
          <div className="text-[#343434] text-[10px] font-[500]">
            drag and drop
          </div>
        </div>
      </Upload>
      <small style={{ color: "red" }}>{errorMessage}</small>
      </div>
    </>
  );
};

export default GBSingleImageUpload;