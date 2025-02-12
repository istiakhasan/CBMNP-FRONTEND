import { Button, Input, Switch } from "antd";
import React, { useState } from "react";
const CollapsChildren = ({ index ,setAttributes,attributes}: any) => {
  const [inputvalue, setInputValue] = useState("");
  const [attributesValue, setAttributesValue] = useState<any>([]);
  return (
    <div>
      <div className="floating-label-input">
        <label className="text-[#999] text-[12px]">Attribute Value</label>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          autoComplete="off"
          value={inputvalue}
          style={{
            boxShadow: "none",
            border: "none",
          }}
          placeholder={"Attribute Value"}
        />
      </div>
      <Button
        onClick={() => {
          setAttributesValue([
            ...attributesValue,
            {
              isActive: true,
              value: inputvalue
            },
          ]);
          setInputValue("");
          const _data=[...attributes]
          if(_data[index]?.attributesvalue?.length>0){
            _data[index].attributesvalue=[..._data[index].attributesvalue,{
              label:inputvalue,
              value:inputvalue,
              isActive:true,
              attributeName:_data[index]?.label
            }]
          }else{
            _data[index].attributesvalue=[{
              label:inputvalue,
              value:inputvalue,
              isActive:true,
              attributeName:_data[index]?.label
            }]
          }
          setAttributes(_data)
        }}
        disabled={inputvalue?.length > 0 ? false : true}
        type="primary"
        className="my-3"
        style={{ borderRadius: "0", width: "100%" }}
      >
        Add Attribute
      </Button>

      {attributesValue?.map((item: any, i: any) => (
        <span
          className="border-[1px] border-[rgba(0,0,0,.1)] font-semibold text-[12px] px-[10px] mr-2 py-[5px]"
          key={i}
        >
          <span>{item?.value}</span>{" "}
          <Switch onChange={(e)=>{
            const _data=[...attributesValue]
            _data[i].isActive=e
            setAttributesValue(_data)
          }} checked={item?.isActive} size="small" className="ml-4" />
        </span>
      ))}
    </div>
  );
};

export default CollapsChildren;
