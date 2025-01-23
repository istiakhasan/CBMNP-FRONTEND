import GbFormSelect from "@/components/forms/GbFormSelect";
import {
  useGetAllDivisionQuery,
  useGetDistrictByIdQuery,
  useGetThanaByIdQuery,
} from "@/redux/api/divisionsApi";
import axios from "axios";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { countryData } from "./countryCode";

const CustomerType = () => {
  const { watch, setValue } = useFormContext();
  const [districtId, setDistrictId] = useState("");
  const [divisioinId, setDivisionId] = useState("");
  const { data: divisionData } = useGetAllDivisionQuery(undefined);
  const { data: districtData } = useGetDistrictByIdQuery({ id: divisioinId });
  const { data: thanaData } = useGetThanaByIdQuery({ id: districtId });
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
              handleChange={(data: any) => {
                setDivisionId(data?.value);
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
              handleChange={(data: any) => {
                setDistrictId(data?.value);
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
