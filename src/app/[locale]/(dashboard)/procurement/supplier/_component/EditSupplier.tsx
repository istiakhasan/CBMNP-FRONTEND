import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import IEPModalAction from "@/components/IEPModalAction";
import { useCreateSupplierMutation, useUpdateSupplierMutation } from "@/redux/api/supplierApi";
import { supplierValidationSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {  message } from "antd";
import React, { useState } from "react";

const EditSupplier = ({
  setSupplierModal,
  rowData
}: {
  setSupplierModal: (v: boolean) => void;
  rowData:any
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [handleUpdateSupplier] = useUpdateSupplierMutation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Supplier</h1>
      <GbForm 
        defaultValues={rowData}
        resolver={yupResolver(supplierValidationSchema)}
        submitHandler={async (data: any, reset: any) => {
          setSubmitLoading(true);
          try {
            const res = await handleUpdateSupplier({data:data,id:rowData?.id}).unwrap();
            if (res?.success) {
              message.success(res.message || "Supplier update successfully");
              setSupplierModal(false);
              reset();
            }
          } catch (error: any) {
            if (error?.data?.errorMessages) {
              error.data.errorMessages.forEach((item: any) => {
                message.error(item.message);
              });
            } else {
              message.error("Failed to add supplier. Please try again.");
            }
          } finally {
            setSubmitLoading(false);
          }
        }}
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GbFormInput name="company" label="Company Name" placeholder="Enter company name" required />
          <GbFormInput name="contactPerson" label="Contact Person" placeholder="Enter contact person name" required />
          <GbFormInput name="phone" label="Phone" placeholder="+8801712345678" type="tel" required />
          <GbFormInput name="email" label="Email" placeholder="email@example.com" type="email" required />
           <GbFormInput name="address" label="Address" placeholder="123 Industrial Road" />
          <GbFormInput name="city" label="City" placeholder="Dhaka" />
          <GbFormInput name="country" label="Country" placeholder="Bangladesh" />
          <GbFormInput name="postalCode" label="Postal Code" placeholder="1205" />
          <GbFormInput name="website" label="Website" placeholder="https://www.example.com" type="url" />
           <GbFormInput name="binNumber" label="BIN Number" placeholder="BIN123456789" />
          <GbFormInput name="tinNumber" label="TIN Number" placeholder="TIN1234567890" />
          <GbFormInput name="vatRegistrationNumber" label="VAT Registration Number" placeholder="VAT123456" />
          <GbFormInput name="tradeLicenseNumber" label="Trade License Number" placeholder="TL123456" />
          <GbFormInput name="bankName" label="Bank Name" placeholder="BRAC Bank" />
          <GbFormInput name="bankAccountNumber" label="Bank Account Number" placeholder="0123456789" />
          <GbFormInput name="paymentTerms" label="Payment Terms" placeholder="Net 30, Advance Payment" />
          <GbFormInput name="supplierCode" label="Supplier Code" placeholder="SUP-001" />
          <GbFormInput name="rating" label="Rating" placeholder="4.5"  type="number" />
          <GbFormInput name="notes" label="Notes" placeholder="Enter any remarks about the supplier" type="textarea" />
        </div>
        {/* Actions */}
        <IEPModalAction
          onClose={() => setSupplierModal(false)}
          submitLoading={submitLoading}
          submitText="Update"
        />
      </GbForm>
    </div>
  );
};

export default EditSupplier;
