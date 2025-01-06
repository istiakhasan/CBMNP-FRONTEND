"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cascader, Input, Button, Divider, Space } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useCreateMainCategoryMutation,
  useGetAllMainCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApi";
import { useFormContext } from "react-hook-form";

const GbCascaderPicker = React.memo(({ name, selectedValue, setSelectedValue }: any) => {
  const { setValue, watch,formState:{errors} } = useFormContext();
  const { data } = useGetAllMainCategoryQuery(undefined);
  const [handleCreateCategory] = useCreateMainCategoryMutation();
  const [handleUpdateCategory] = useUpdateCategoryMutation();
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<any>({});
 console.log(errors,"check");
  const onChange: any = (value: string[], selectedOptions: any) => {
    if(selectedOptions?.length>0){
      setValue(name, selectedOptions[0]);
    }else{
      setValue(name, undefined);
    }
  };
  const addCategory = async () => {
    const res = await handleCreateCategory({ label: newCategory });
    if (res) {
      setNewCategory("");
    }
  };

  const startEditing = (index: number, option: any) => {
    setEditingIndex(index);
    setEditingValue(option);
  };

  const saveEditing = async () => {
    const res = await handleUpdateCategory({
      id: editingValue?.id,
      data: {
        label: editingValue?.name,
      },
    });
    if (res) {
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  useMemo(() => {
    const modifyCategoryData = data?.data?.map((item: any) => ({
      ...item,
      code: item?.id,
      name: item?.label,
      label: item?.label,
    }));
    setCategoryOptions(modifyCategoryData);
  }, [data]);
  return (
    <div className="custom_selector" style={{ width: "100%" }}>
      <Cascader
        value={watch()?.category?.label}
        style={{
          borderRadius: "0px",
          width: "100%",
          height: "55px",
          background: "#F6F6F6",
        }}
        fieldNames={{ label: "name", value: "id", children: "items" }}
        options={categoryOptions}
        onChange={onChange}
        placeholder="Product Category"
        dropdownRender={(menu) => (
          <div>
            <div className="h-[200px] overflow-auto">
              {editMode ? (
                <div className="h-[200px] overflow-auto">
                  {categoryOptions?.map((option: any, index: any) => (
                    <div key={option.code} style={{ display: "flex", alignItems: "center", padding: 8 }}>
                      {editingIndex === index ? (
                        <Input
                          value={editingValue?.name}
                          onChange={(e) =>
                            setEditingValue({ ...editingValue, name: e.target.value })
                          }
                          style={{ marginRight: 8 }}
                        />
                      ) : (
                        <span style={{ flex: "1" }}>{option.name}</span>
                      )}
                      {editingIndex === index ? (
                        <Space>
                          <Button htmlType="button" icon={<SaveOutlined />} onClick={saveEditing} />
                          <Button htmlType="button" icon={<CloseOutlined />} onClick={cancelEditing} />
                        </Space>
                      ) : (
                        <Button
                          htmlType="button"
                          icon={<EditOutlined />}
                          onClick={() => startEditing(index, option)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                menu
              )}
            </div>
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ padding: "20px" }}>
              <input
                className="mb-3 py-[20px] w-full outline-none"
                placeholder="Category Name"
                value={newCategory}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    if (newCategory?.length > 0) {
                      setNewCategory(newCategory.slice(0, newCategory?.length - 1));
                    }
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ borderRadius: "0px", padding: "10px", border: "1px solid #47A2B3" }}
              />
              <button
                type="button"
                className="bg-[#b3b2b2] text-white py-[8px] mb-3"
                onClick={addCategory}
                style={{
                  display: "block",
                  width: "100%",
                  borderRadius: "0",
                  fontSize: "12px",
                }}
              >
                Add Category
              </button>
              <button
                type="button"
                className="py-[8px]"
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "0px",
                  background: "#e65050",
                  color: "white",
                  fontSize: "12px",
                }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit Category"}
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
});

GbCascaderPicker.displayName = "GbCascaderPicker";

export default GbCascaderPicker;
