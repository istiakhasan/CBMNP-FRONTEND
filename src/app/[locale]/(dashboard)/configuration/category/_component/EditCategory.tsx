import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { createCategorySchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React from "react";

const EditCategory = ({ setEditCategory, rowData }: any) => {
  const [updateCategory] = useUpdateCategoryMutation();
  const formSubmit = async (data: any, reset: any) => {
    try {
      const res = await updateCategory({
        id: rowData?.id,
        data: data,
      }).unwrap();
      console.log(res, "ff");
      if (res?.success) {
        message.success(res?.message);
        setEditCategory(false);
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
        <h1 className="text-[20px]">Update Category</h1>
        <i
          onClick={() => setEditCategory(false)}
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
            onClick={() => setEditCategory(false)}
            style={{ border: "1px solid #4F8A6D" }}
            className="  text-black font-bold text-[12px]   px-[20px] py-[5px]"
          >
            Cancel
          </button>
          <button
            style={{ border: "1px solid #4F8A6D" }}
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
          >
            Update
          </button>
        </div>
      </GbForm>
    </div>
  );
};

export default EditCategory;
