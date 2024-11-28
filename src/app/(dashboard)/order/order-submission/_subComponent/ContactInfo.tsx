import GbFormCheckbox from "@/components/forms/GbCheckbox";
import { Checkbox, Col, Row } from "antd";
import React, { useState } from "react";
import NonProbashiForm from "./NonProbashiForm";
import ProbashiForm from "./ProbashiForm";
import { useFormContext } from "react-hook-form";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import {
  useGetAllDivisionQuery,
  useGetDistrictByIdQuery,
  useGetThanaByIdQuery,
} from "@/redux/api/divisionsApi";
import axios from "axios";

const ContactInfo = () => {
  const [districtId,setDistrictId]=useState('')
  const [divisioinId, setDivisionId] = useState("");
  const { watch,formState:{errors},setValue } = useFormContext();
  const { data: divisionData } = useGetAllDivisionQuery(undefined);
  const { data: districtData } = useGetDistrictByIdQuery({ id: divisioinId });
  const { data: thanaData } = useGetThanaByIdQuery({id:districtId});
  // console.log(watch(),errors);
  return (
    <div className="sdw_box mb-[16px]">
      <h1 className="box_title mb-[20px]">Customer info</h1>
      <div className="flex justify-between items-center">
        <h1 className="text-[16px] font-[500] font-[#343434] mb-[20px]">
          Billing{" "}
        </h1>
        <GbFormCheckbox handleChange={(e:any)=>{
           if(!e){
             setValue('probashi',true)  
             setValue('isSameAsBillingAddress',true)  
           }else{
            setValue('probashi',false)
            setValue('isSameAsBillingAddress',false)  
           }
        }}  name="probashi" label="Probashi" />
      </div>
      <Row gutter={12}>
        {!!watch()["probashi"] ? <ProbashiForm /> : <NonProbashiForm />}
        <Col md={24} className="mb-[12px]">
          <GbFormCheckbox 
            name="isSameAsBillingAddress"
            label="Not same as billing"
          />
        </Col>
        {watch()["isSameAsBillingAddress"] && (
          <>
            <Col md={24} className="mb-[12px]">
              <h1 className="text-[16px] font-[500] font-[#343434] my-[20px]">
                Receiver{" "}
              </h1>
            </Col>
            
            <Col md={12} className="mb-[12px]">
              <GbFormInput
                name="receiverPhoneNumber"
                placeholder="Receiver number"
              />
            </Col>
            <Col md={12} className="mb-[12px]">
              <GbFormInput
                name="receiverAdditionalPhoneNumber"
                placeholder="Additional number"
              />
            </Col>
            <Col md={12} className="mb-[12px]">
              <GbFormInput name="receiverName" placeholder="Receiver name" />
            </Col>
            <Col md={12} className="mb-[12px]">
              <GbFormInput
                name="shippingAddressTextArea"
                placeholder="Receiver address"
              />
            </Col>
          
            <Col md={8} className="mb-[12px]">
              <GbFormSelect
                options={divisionData?.map((db: any) => {
                  return {
                    label: db?.name_en,
                    value: db?.id,
                  };
                })}
                handleChange={(data: any) => {
                  setDivisionId(data?.value);
                }}
                name="shippingAddressDivision"
                placeholder="Division"
              />
            </Col>
            <Col md={8} className="mb-[12px]">
              <GbFormSelect
                options={districtData?.map((db: any) => {
                  return {
                    label: db?.name_en,
                    value: db?.id,
                  };
                })}
                handleChange={(data:any)=>{
                  setDistrictId(data?.value)
                }}
                name="shippingAddressDistrict"
                placeholder="district"
              />
            </Col>
            <Col md={8} className="mb-[12px]">
              <GbFormSelect
                options={thanaData?.map((db: any) => {
                  return {
                    label: db?.name_en,
                    value: db?.id,
                  };
                })}
                handleChange={ async(option:any)=>{
                  const response=  await  axios.get(`https://ghorerbazartech.xyz/delivary-charge/${option?.value}`)
                  setValue('newDeliveryCharge',response?.data?.prices)
                  }}
                name="shippingAddressThana"
                placeholder="Thana"
              />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default ContactInfo;
