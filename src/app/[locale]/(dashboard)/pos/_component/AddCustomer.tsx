import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useCreateCustomerMutation } from "@/redux/api/customerApi";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AddCustomer = ({setOpen,setCustomer,customer,searchValue}:{setOpen:any,setCustomer:any,customer:any,searchValue:any}) => {
  const [divisionData, setDivisionData] = useState([]);
  const [districtData, setdistrictData] = useState([]);
  const [thanaData, setThanaData] = useState([]);
  const [handleCreateCustomer] = useCreateCustomerMutation();
  
  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/divisions`)
      .then((res) => setDivisionData(res?.data))
      .catch((error) => console.log(error));
  }, []);


    const formSubmit = async (data: any, reset: any) => {
    try {
      const payload = { ...data };
      if(!!data?.district?.label && !!data?.district?.label && !!data?.thana?.label){
      payload["district"] = data?.district?.label;
      payload["division"] = data?.division?.label;
      payload["thana"] = data?.thana?.label;
      }

      payload["customerType"] = 'NON_PROBASHI';
    
      const res = await handleCreateCustomer(payload).unwrap();
      if (res?.success === true) {
        setCustomer(res?.data);
        message.success("Customer create successfully");
        setOpen(false);
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      }
      message.error("Something went wrong");
      reset();
    }
  };

console.log(searchValue,"earch value");
  return (
    <GbForm defaultValues={{
        customerPhoneNumber:searchValue
    }} submitHandler={formSubmit}>
      <h1 className="text-[#212B36] font-bold text-[18px] p-[10px] px-[20px]">
        Create
      </h1>
      <hr className="mb-[15px]" />
      <div className="grid grid-cols-2 gap-2 p-[10px] px-[20px]">
        <GbFormInput
          label="Name"
          name="customerName"
          required
          placeholder="Customer name"
        />
        <GbFormInput label="Phone" name="customerPhoneNumber" required />

        <div className="col-span-2">
          <GbFormSelect
            options={divisionData?.map((db: any) => {
              return {
                label: db?.name_en,
                value: db?.id,
              };
            })}
            handleChange={(option: any) => {
              axios
                .get(`${getBaseUrl()}/divisions/${option?.value}`)
                .then((res) => setdistrictData(res?.data?.district_info))
                .catch((error) => console.log(error));
            }}
            name="division"
            label="Division"
            size="small"
            placeholder="Division"
          />
        </div>

        <div className="col-span-2">
          <GbFormSelect
            options={districtData?.map((db: any) => {
              return {
                label: db?.name_en,
                value: db?.id,
              };
            })}
            handleChange={(option: any) => {
              axios
                .get(`${getBaseUrl()}/districts/${option?.value}`)
                .then((res) => setThanaData(res?.data?.thana_info))
                .catch((error) => console.log(error));
            }}
            name="district"
            label="District"
            placeholder="district"
            size="small"
          />
        </div>

        <div className="col-span-2">
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
            size="small"
          />
        </div>

        <GbFormTextArea label="address" name="address" />
        <div className="col-span-2 flex justify-end">
          <button className="bg-primary text-white px-[30px]  py-[10px]">Submit</button>
        </div>
      </div>
    </GbForm>
  );
};

export default AddCustomer;
