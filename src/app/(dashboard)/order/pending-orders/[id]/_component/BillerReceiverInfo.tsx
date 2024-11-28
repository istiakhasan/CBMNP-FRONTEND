"use client";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useGetAllDivisionQuery, useGetDistrictByIdQuery, useGetThanaByIdQuery } from "@/redux/api/divisionsApi";
import { useGetAllDistrictQuery } from "@/redux/api/locationApi";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const BillerReceiverInfo = ({ data }: { data: any }) => {
  const [divisioinId,setDivisionId]=useState('')
  const [districtId,setDistrictId]=useState('')
  const { data: divisionData } = useGetAllDivisionQuery(undefined);
  const { data: districtData } = useGetDistrictByIdQuery({id:divisioinId});
  const { data: thanaData } = useGetThanaByIdQuery({id:districtId});
  const p_secon = "text-[12px] font-[500] text-[#3D3D3D]";
  const {setValue}=useFormContext()
  const isTrue=districtData?.length>0 ? false :true

  return (
    <>
      <div className="sdw_box ">
        <div className="flex items-center justify-between">
          <h1 className="text-[#000000] text-[14px] font-[500]">Biller</h1>
          <i className="ri-line-chart-fill text-[18px] text-[#000000]"></i>
        </div>
        <p className={p_secon}>{data?.customerName}</p>
        <p className={p_secon}>{data?.customerPhoneNumber}</p>
        <p className={p_secon}>ismailhoque@example.com</p>
        <p className={p_secon}>{data?.billingAddressTextArea}</p>

        <div className="flex justify-between gap-[32px] my-[12px]">
          <p className="text-[#000000] text-[14px] font-[500] my-[6px] w-fit text-nowrap">
            Payment type
          </p>
          <GbFormSelect
            placeholder="COD"
            name="payment_method"
            options={[
              {
                label: "COD",
                value: "COD",
              },
            ]}
          />
        </div>
        <h1 className="text-[#000000] text-[14px] font-[500] my-[6px]">
          Receiver
        </h1>
        <p className={p_secon}>{data?.receiverName}</p>
        <p className={p_secon}>{data?.receiverPhoneNumber}</p>
        <p className={p_secon}>ismailhoque@example.com</p>
        <p className={` ${p_secon}`}>
          {`${data?.shippingAddressDivision},${data?.shippingAddressDistrict},${data?.shippingAddressThana}`}
        </p>
        <p className={`mb-[16px] ${p_secon}`}>
          {data?.shippingAddressTextArea}
        </p>

        <div className="my-[6px]">
          <GbFormSelect
            placeholder="Division"
            name="shippingAddressDivision"
            options={divisionData?.map((db: any) => {
              return {
                label: db?.name_en,
                value: db?.id,
              };
            })}
            handleChange={(data:any)=>{
              setValue("shippingAddressDistrict","")
              setValue("shippingAddressThana","")
              setDivisionId(data?.value)
            }}
          />
        </div>
        <div className="mb-[6px]">
          <GbFormSelect
            placeholder="District"
            name="shippingAddressDistrict"
            options={districtData?.map((db: any) => {
              return {
                label: db?.name_en,
                value: db?.id,
              };
            })}
            handleChange={(data:any)=>{
              setValue("shippingAddressThana","")
              setDistrictId(data?.value)
            }}
            disabled={isTrue}
          />
        </div>
        <div className="mb-[6px]">
          <GbFormSelect
            placeholder="Thana"
            name="shippingAddressThana"
            disabled={districtData?.length>0?false:true}
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
          />
        </div>
      </div>
    </>
  );
};

export default BillerReceiverInfo;
