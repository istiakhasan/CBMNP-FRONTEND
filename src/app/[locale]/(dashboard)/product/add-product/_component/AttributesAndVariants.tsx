/* eslint-disable react/no-unescaped-entities */
import { Button, Checkbox, Input } from "antd";
import React, { useState } from "react";
import GbCollaps from "./GbCollaps";
import VariantsCollaps from "./VariantsCollaps";
import { useFieldArray, useFormContext } from "react-hook-form";

const panelStyle: React.CSSProperties = {
  borderRadius: "0",
  border: "none",
  backgroundColor: "white",
  borderBottom: "1px solid rgba(0,0,0,.1)",
};
const AttributesAndVariants = ({setSelectedValue,selectedValue}:any) => {
  const [attributes, setAttributes] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const { watch, control, setValue,formState:{errors} } = useFormContext();
  console.log(errors,"errors");
  const { fields, append, remove,update } = useFieldArray({
    control,
    name: "variants",
  });
  const addVariant = () => {
    append({
      name: "",
      description: "",
      weight: "",
      unit: "",
      volume: "",
      volumeUnit: "",
      regularPrice: "",
      salePrice: "",
      retailPrice: "",
      distributionPrice: "",
      purchasePrice: "",
      variantSku: "",
      internalId: "",
      product_image: [],
      attributes:[]
    });
  };

  function generateNestedArray(data: any) {
    function combine(arrays: any, index = 0, current: any = []) {
      if (index === arrays.length) {
        result.push(current);
        return;
      }
      arrays[index].forEach((item: any) => {
        combine(arrays, index + 1, [...current, item]);
      });
    }
    const valueArrays = data.map((category: any) =>category.attributesvalue);
    const result: any = [];
    combine(valueArrays);
    return result;
  }
  return (
    <div className="grid grid-cols-3 gap-[24px]">
      <div className="bg-[#fafafa] p-[24px]  gap-[24px]">
        <h1 className="font-semibold">Attributes</h1>
        <div className="floating-label-input mb-2">
          <label className="text-[#999] text-[12px]">Attribute Name</label>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            autoComplete="off"
            value={inputValue}
            style={{
              boxShadow: "none",
              border: "none",
            }}
            placeholder={"Attribute Name"}
          />
        </div>
        <div className="flex gap-[24px]">
          <Button 
            disabled
            type="primary"
            ghost
            className="flex-1"
            style={{
              borderRadius: "0",
              background: "#fff",
              fontWeight: "bold",
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setAttributes([
                ...attributes,
                {
                  style: panelStyle,
                  label: inputValue,
                },
              ]);
              setInputValue("");
            }}
            disabled={inputValue?.length > 0 ? false : true}
            type="primary"
            className="flex-1"
            style={{ borderRadius: "0" }}
          >
            Add Attribute
          </Button>
        </div>
        <GbCollaps attributes={attributes} setAttributes={setAttributes} />
      </div>
      <div className="h-auto bg-[#fafafa] col-span-2 p-[24px] ">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
          <h1 className="font-semibold mb-0">Variants</h1>
          <Button disabled={attributes?.length<1||attributes?.map((item:any)=>item?.attributesvalue)?.filter((item:any)=>item !==undefined)?.length<1} style={{borderRadius:"0",boxShadow:"none",padding:"5px 30px"}}  onClick={()=>{
              remove(); 
              const combinations = generateNestedArray(attributes);
              combinations.forEach((combination:any) => {
                append({
                  name: "",
                  description: "",
                  weight: "",
                  unit: "",
                  volume: "",
                  volumeUnit: "",
                  regularPrice: "",
                  salePrice: "",
                  retailPrice: "",
                  distributionPrice: "",
                  purchasePrice: "",
                  variantSku: "",
                  internalId: "",
                  product_image: [],
                  attributes: combination 
                });
              });
            
            }}  type="primary">Genarate Variants</Button>
          </div>
          <Button
            style={{ borderRadius: "0px" }}
            onClick={addVariant}
            type="primary"
          >
            Add Variant
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <p>Sync Base Product's :</p>
          <div>
            <Checkbox
              style={{
                borderRadius: "0px",
                fontSize: "17px",
                color: "#252525",
              }}
              onChange={(e) =>{
                if (e.target.checked) {
                  fields.forEach((field, index) => {
                    update(index, { ...field, name: watch()?.name });
                  });
                } else {
                  fields.forEach((field, index) => {
                    update(index, { ...field, name: "" });
                  });
                }
              
              }}
            >
              Name{" "}
            </Checkbox>
            <Checkbox
              style={{
                borderRadius: "0px",
                fontSize: "17px",
                color: "#252525",
              }}
              onChange={(e) =>{
                if (e.target.checked) {
                  fields.forEach((field, index) => {
                    update(index, { ...field, sku: watch()?.sku });
                  });
                } else {
                  fields.forEach((field, index) => {
                    update(index, { ...field, sku: "" });
                  });
                }
              
              }}
            >
              SKU{" "}
            </Checkbox>
            <Checkbox
              style={{
                borderRadius: "0px",
                fontSize: "17px",
                color: "#252525",
              }}
              name="name"
            >
              Images{" "}
            </Checkbox>
            <Checkbox
              style={{
                borderRadius: "0px",
                fontSize: "17px",
                color: "#252525",
              }}
              name="name"
            >
              Weight/Volume{" "}
            </Checkbox>
            <Checkbox
              style={{
                borderRadius: "0px",
                fontSize: "17px",
                color: "#252525",
              }}
              name="name"
            >
              Prices{" "}
            </Checkbox>
          </div>
        </div>

        {/* variants collaps */}

        <VariantsCollaps
          addVariant={addVariant}
          remove={remove}
          fields={fields}
          attributes={attributes}
        />
      </div>
    </div>
  );
};

export default AttributesAndVariants;
