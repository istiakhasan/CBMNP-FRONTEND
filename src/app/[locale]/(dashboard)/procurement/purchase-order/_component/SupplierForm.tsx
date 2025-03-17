import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import IEPModalAction from "@/components/IEPModalAction";
import { useCreateSupplierMutation } from "@/redux/api/supplierApi";
import { message } from "antd";
import React, { useState } from "react";

const SupplierForm = ({ setSupplierModal }: any) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [handleCreateSupplier] = useCreateSupplierMutation();
  return (
    <div>
      <h1 className="text-2xl">Add Supplier</h1>
      <GbForm
        submitHandler={async (data: any, reset: any) => {
          try {
            const res = await handleCreateSupplier(data).unwrap();
            if (!!res?.success) {
              message.success(res?.message);
              setSubmitLoading(false);
              setSupplierModal(false);
              reset();
            }
          } catch (error: any) {
            if (error?.data?.errorMessages) {
              error?.data?.errorMessages?.forEach((item: any) => {
                message.error(item?.message);
              });
            }
            setSubmitLoading(false);
          }
        }}
      >
        <div className="mb-4">
          <GbFormInput name="company" label="Company Name" />
        </div>
        <div className="mb-4">
          <GbFormInput name="contactPerson" label="Contact Person" />
        </div>
        <div className="mb-4">
          <GbFormInput name="phone" label="Phone" />
        </div>
        <div className="mb-4">
          <GbFormInput name="email" label="Email" />
        </div>
        <IEPModalAction
          onClose={() => setSupplierModal(false)}
          submitLoading={submitLoading}
        />
      </GbForm>
    </div>
  );
};

export default SupplierForm;
