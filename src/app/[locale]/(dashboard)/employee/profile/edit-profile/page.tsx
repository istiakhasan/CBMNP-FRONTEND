/* eslint-disable @next/next/no-img-element */
"use client";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbRadioButton from "@/components/forms/GbRadioButton";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React from "react";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "@/redux/api/usersApi";
import { useRouter } from "next/navigation";
import ProfileInfoPreview from "../../hrm-dashboard/add-employee/_component/ProfileInfoPreview";
import { useGetProfileInfoQuery } from "@/redux/api/authApi";
const Page = () => {
  const { data, isLoading,error } = useGetProfileInfoQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();
  const router = useRouter();
  const submitForm = async (payload: any) => {
    try {
     const formData=new FormData()
     const _data:any={}
     if(payload['file']){
         _data['file']=payload['file']
     }
    _data['firstName']=payload?.employee?.firstName || ''
    _data['lastName']=payload?.employee?.lastName  || ''
    _data['nationalId']=payload?.employee?.nationalId  || ''
    _data['phoneNumber']=payload?.employee?.phoneNumber  || ''
    _data['additionalNumber']=payload?.employee?.additionalNumber  || ''
    _data['personalEmail']=payload?.employee?.personalEmail  || ''
    _data['additionalEmail']=payload?.employee?.additionalEmail  || ''
    _data['blood_group']=payload?.blood_group?.value  || ''
    _data['dateOfBirth']=payload?.employee?.dateOfBirth  || ''
    _data['gender']=payload?.employee?.gender  || ''
    for(let key in _data ){
        formData.append(key,_data[key])
    }
    const res=await updateProfile(formData).unwrap()
      if (res?.success) {
        toast.success("User Update Successfully");
        // router.push("/employee/profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  if(isLoading){
    return 
  }
  if(error){
    console.log(error,"error");
  }
  return (
    <div>
      <GbHeader title="Employee Insights" />
      <GbForm submitHandler={submitForm} defaultValues={{...data?.data,blood_group:{label:data?.data?.employee?.blood_group,value:data?.data?.employee?.blood_group}}}>
        <section className="grid grid-cols-12 gap-[40px]">
          <ProfileInfoPreview />

          <div className="col-span-7 sdw_box">
            <div className="grid grid-cols-2 gap-[24px]">
              <h1 className="text-[#343434] font-[700]  col-span-2 text-[20px] mb-[16px]">
                Employee Information
              </h1>
              <div className="mb-[10px]">
                {/* done */}
                <GbFormInput name="employee.employeeId" disabled={true} label="Employee Id" />
              </div>
              <div className="mb-[10px]">
                {/* done */}
                <GbFormInput name="employee.firstName" label="First name" />
              </div>
              <div className="mb-[10px]">
                {/* done */}
                <GbFormInput name="employee.lastName" label="Last name" />
              </div>
              <div className="mb-[10px]">
                {/* done */}
                <GbFormInput name="employee.nationalId" label="National id" />
              </div>
              <div className="mb-[10px]">
                <GbFormInput
                  name="employee.dateOfBirth"
                  type="date"
                  label="Date Of Birth"
                />
              </div>
              <div className="mb-[10px]">
                <GbFormSelect
                options={[
                    { "label": "A+", "value": "A+" },
                    { "label": "A-", "value": "A-" },
                    { "label": "B+", "value": "B+" },
                    { "label": "B-", "value": "B-" },
                    { "label": "AB+", "value": "AB+" },
                    { "label": "AB-", "value": "AB-" },
                    { "label": "O+", "value": "O+" },
                    { "label": "O-", "value": "O-" }
                  ]

                  }
                  name="blood_group"
                  label="Blood Group"
                />
              </div>
              <div className="mb-[10px] col-span-2">
                {/* done */}
                <GbRadioButton
                  classString="block"
                  name="employee.gender"
                  options={[
                    {
                      label: "Male",
                      value: "Male",
                    },
                    {
                      label: "Female",
                      value: "female",
                    },
                    {
                      label: "Prefer not to say",
                      value: "Prefer not to say",
                    },
                  ]}
                  label="Gender"
                />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput name="employee.phoneNumber" label="Phone number" />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput
                  name="employee.additionalNumber"
                  label="Additional number"
                />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput
                  name="employee.personalEmail"
                  label="Personal email"
                />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput
                  name="employee.additionalEmail"
                  label="Additional email"
                />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput
                  name="employee.reportingPerson"
                  label="Reporting person"
                  disabled={true}
                />
              </div>
              <div className="mb-[10px] ">
                {/* done */}
                <GbFormInput
                  name="employee.joiningDate"
                  type="date"
                  label="Date of joining"
                  disabled={true}
                />
              </div>
              {/* <div className="mb-[10px] ">
               <GbFileUpload name="file" />
              </div> */}
              <div className=" flex justify-end col-span-2">
              <button
            type="submit"
            className="cm_button w-fit px-[30px] cursor-pointer"
          >
            Update
          </button>
              </div>
            </div>
          </div>
        </section>
      </GbForm>
    </div>
  );
};

export default Page;
