import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useCreateCustomerMutation } from "@/redux/api/customerApi";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AddCustomer = ({
  setOpen,
  setCustomer,
  searchValue,
}: {
  setOpen: any;
  setCustomer: any;
  customer: any;
  searchValue: any;
}) => {
  const [divisionData, setDivisionData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [thanaData, setThanaData] = useState([]);
  const [handleCreateCustomer, { isLoading }] = useCreateCustomerMutation();

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/divisions`)
      .then((res) => setDivisionData(res?.data))
      .catch((error) => console.log(error));
  }, []);

  const formSubmit = async (data: any, reset: any) => {
    try {
      const payload = { ...data };
      if (data?.district?.label && data?.division?.label && data?.thana?.label) {
        payload["district"] = data.district.label;
        payload["division"] = data.division.label;
        payload["thana"] = data.thana.label;
      }
      payload["customerType"] = "NON_PROBASHI";

      const res = await handleCreateCustomer(payload).unwrap();
      if (res?.success === true) {
        setCustomer(res?.data);
        message.success("Customer created successfully");
        setOpen(false);
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error.data.errorMessages.forEach((item: any) => message.error(item?.message));
      } else {
        message.error("Something went wrong");
      }
      reset();
    }
  };

  return (
    <GbForm defaultValues={{ customerPhoneNumber: searchValue }} submitHandler={formSubmit}>
      <div className="pos-modal-head">
        <h2>New customer</h2>
        <p>Add a customer to attach to this sale.</p>
      </div>

      <div className="pos-modal-body">
        <GbFormInput label="Name" name="customerName" required placeholder="Customer name" />
        <GbFormInput label="Phone" name="customerPhoneNumber" required />

        <div className="col-span-2">
          <GbFormSelect
            options={divisionData?.map((db: any) => ({ label: db?.name_en, value: db?.id }))}
            handleChange={(option: any) => {
              axios
                .get(`${getBaseUrl()}/divisions/${option?.value}`)
                .then((res) => setDistrictData(res?.data?.district_info))
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
            options={districtData?.map((db: any) => ({ label: db?.name_en, value: db?.id }))}
            handleChange={(option: any) => {
              axios
                .get(`${getBaseUrl()}/districts/${option?.value}`)
                .then((res) => setThanaData(res?.data?.thana_info))
                .catch((error) => console.log(error));
            }}
            name="district"
            label="District"
            placeholder="District"
            size="small"
          />
        </div>

        <div className="col-span-2">
          <GbFormSelect
            options={thanaData?.map((db: any) => ({ label: db?.name_en, value: db?.id }))}
            name="thana"
            placeholder="Thana"
            label="Thana"
            size="small"
          />
        </div>

        <GbFormTextArea label="Address" name="address" />
      </div>

      <div className="pos-modal-footer">
        <button type="button" className="pos-modal-cancel" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="pos-modal-submit" disabled={isLoading}>
          {isLoading ? "Saving…" : "Save customer"}
        </button>
      </div>
    </GbForm>
  );
};

export default AddCustomer;