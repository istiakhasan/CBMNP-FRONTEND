import GbFormSelect from "@/components/forms/GbFormSelect";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { countryData } from "./countryCode";

const CustomerType = () => {
  const { watch } = useFormContext();
  const [divisionData,setDivisionData]=useState([])
  const [districtData,setdistrictData]=useState([])
  const [thanaData,setThanaData]=useState([])
  useEffect(()=>{
    axios.get(`https://ghorerbazartech.xyz/divisions`)
    .then(res=>setDivisionData(res?.data))
    .catch(error=>console.log(error))
  },[])

  return (
    <>
      {watch()?.customerType?.value === "NON_PROBASHI" && (
        <>
          <div>
            <GbFormSelect
              options={divisionData?.map((db: any) => {
                return {
                  label: db?.name_en,
                  value: db?.id,
                };
              })}
              handleChange={(option: any) => {
                axios.get(`https://ghorerbazartech.xyz/divisions/${option?.value}`)
               .then(res=>setdistrictData(res?.data?.district_info))
               .catch(error=>console.log(error))
              }}
              name="division"
              label="Division"
              placeholder="Division"
            />
          </div>
          <div>
            <GbFormSelect
              options={districtData?.map((db: any) => {
                return {
                  label: db?.name_en,
                  value: db?.id,
                };
              })}
              handleChange={(option: any) => {
                axios.get(`https://ghorerbazartech.xyz/districts/${option?.value}`)
               .then(res=>setThanaData(res?.data?.thana_info))
               .catch(error=>console.log(error))
              }}
              name="district"
              label="District"
              placeholder="district"
            />
          </div>
          <div>
            <GbFormSelect
              options={thanaData?.map((db: any) => {
                return {
                  label: db?.name_en,
                  value: db?.id,
                };
              })}
              name="thana"
              placeholder="Thana"
              label="Thana"
            />
          </div>
        </>
      ) }
      {watch()?.customerType?.value === "PROBASHI" && (
        <>

          <div>
            <GbFormSelect
              options={countryData}
              name="country"
              label="Country"
              placeholder="Country"
            />
          </div>
        </>
      ) }
    </>
  );
};

export default CustomerType;
