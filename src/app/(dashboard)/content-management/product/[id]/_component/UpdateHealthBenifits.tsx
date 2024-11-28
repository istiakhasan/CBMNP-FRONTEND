"use client";
import { Input, message } from "antd";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { textEditorModule } from "./contentConstant";

interface HealthBenefit {
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
}

const UpdateHealthBenifits = ({
  rowData,
  setRowData,
  rowIndex,
  setHealthBenifits,
  healthBenifits,
  setOpenModal
}: {
  rowData: any;
  setRowData: any;
  rowIndex: any;
  setHealthBenifits: any;
  healthBenifits: any;
  setOpenModal:any
}) => {
  const handleChangeTitleEn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowData((prev: HealthBenefit) => ({
      ...prev,
      title_en: e.target.value,
    }));
  };

  const handleChangeTitleBn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowData((prev: HealthBenefit) => ({
      ...prev,
      title_bn: e.target.value,
    }));
  };

  const handleChangeDescriptionEn = (content: string) => {
    setRowData((prev: HealthBenefit) => ({ ...prev, description_en: content }));
  };

  const handleChangeDescriptionBn = (content: string) => {
    setRowData((prev: HealthBenefit) => ({ ...prev, description_bn: content }));
  };

  const submitHandler = () => {
    const _data = [...healthBenifits];
    _data[rowIndex] = rowData;
    setHealthBenifits(_data);
    setOpenModal(false)
    message.success('Updated successfully...')
  };

  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "5px",
        padding: "15px",
        marginBottom: "10px",
      }}
      className="h-fit"
    >
      <InputField
        label="Title English"
        value={rowData?.title_en}
        onChange={handleChangeTitleEn}
      />
      <EditorField
        label="Description English"
        value={rowData?.description_en}
        onChange={handleChangeDescriptionEn}
      />
      <InputField
        label="Title Bangla"
        value={rowData?.title_bn}
        onChange={handleChangeTitleBn}
      />
      <EditorField
        label="Description Bangla"
        value={rowData?.description_bn}
        onChange={handleChangeDescriptionBn}
      />
      <button
        onClick={submitHandler}
        className="cm_button mt-[30px] px-[50px] ml-auto block"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateHealthBenifits;

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="mb-[16px]">
    <h1 className="text-[#343434] text-[20px] font-bold">{label}</h1>
    <Input
      onChange={onChange}
      value={value}
      style={{
        borderRadius: "4px",
        padding: "9px",
        background: "white",
        fontSize: "14px",
        fontWeight: "400",
      }}
    />
  </div>
);

const EditorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (content: string) => void;
}) => (
  <div className="mb-[16px]">
    <h1 className="text-[#343434] text-[20px] font-bold">{label}</h1>
    <ReactQuill
      placeholder="Write something.."
      value={value}
      onChange={onChange}
      modules={textEditorModule}
    />
  </div>
);
