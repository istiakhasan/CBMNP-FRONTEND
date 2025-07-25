import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useCreateMainCategoryMutation, useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { createCategorySchema, updateUserSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React from "react";

const AddCategory = ({ setAddCategory, rowData }: any) => {
  const [createCategory] = useCreateMainCategoryMutation();
  const formSubmit = async (data: any, reset: any) => {
    try {
      const res = await createCategory(data).unwrap();
      if (res?.success) {
        message.success(res?.message);
        setAddCategory(false);
        reset();
      }
    } catch (error: any) {
      error?.data?.errorMessages?.forEach((item: any) => {
        message.error(item?.message);
      });
    }
  };
  console.log(rowData, "row data ");
  return (
    <div className="pt-[20px] px-[20px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px]">Add Category</h1>
        <i
          onClick={() => setAddCategory(false)}
          style={{ fontSize: "18px" }}
          className="ri-close-large-fill cursor-pointer"
        ></i>
      </div>
      <div
        style={{ background: "rgba(0,0,0,.1)" }}
        className="mb-4 h-[1px]"
      ></div>
      <GbForm
        resolver={yupResolver(createCategorySchema)}
        defaultValues={{
          label: rowData?.label,
        }}
        submitHandler={formSubmit}
      >
        <div className="mb-3">
          {/* exist */}
          <GbFormInput name="label" label="Category Name" />
        </div>

        <div className="flex items-center justify-end  my-[20px] gap-2">
          <button
            onClick={() => setAddCategory(false)}
            style={{ border: "1px solid #4F8A6D" }}
            className="  text-black font-bold text-[12px]   px-[20px] py-[5px]"
          >
            Cancel
          </button>
          <button
            style={{ border: "1px solid #4F8A6D" }}
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
          >
            Create
          </button>
        </div>
      </GbForm>
    </div>
  );
};

export default AddCategory;
