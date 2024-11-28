/* eslint-disable @next/next/no-img-element */
"use client";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbRadioButton from "@/components/forms/GbRadioButton";
import GbStepers from "@/components/ui/GbStepers";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import Image from "next/image";
import React, { useState } from "react";
import ProfileInfoPreview from "./_component/ProfileInfoPreview";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "@/redux/api/usersApi";
import { useRouter } from "next/navigation";
import { useGetAllOfficeQuery } from "@/redux/api/officeApi";
import { useGetDepartmentByOfficeQuery } from "@/redux/api/departmentApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { userCreateSchema } from "@/schema/schema";
const Page = () => {
  const [officeId,setOfficeId]=useState('')
  const [createUserHandler]=useCreateUserMutation()
  const {data,isLoading}=useGetAllOfficeQuery(undefined)
  const {data:departmentData}=  useGetDepartmentByOfficeQuery({id:officeId})
  const router=useRouter()
  const submitForm = async (data: any) => {
    try {
      let _data:any={}
      _data["employee"]=data?.employee
      _data["password"]=data?.Password
      _data["employeeId"]=data?.employee?.employeeId
      _data["role"]="agent"
      _data["employee"]["employmentStatus"]=data?.employmentStatus?.value
      _data["employee"]["blood_group"]=data?.blood_group?.value
      _data["employee"]["departmentId"]=data?.department?.value
      _data["employee"]["officeId"]=data?.office?.value
      if(data?.employee?.nationalId?.length<1){
        delete  _data["employee"]["nationalId"]
      }

      const res=await createUserHandler(_data).unwrap()
      if(res?.success){
        toast.success('User create successfully')
        router.push('/employee/profile')
      }
    } catch (error:any) {
      if(error?.data?.errorMessages){
        error?.data?.errorMessages?.forEach((item:any)=>toast.error(item?.message))
      }else{

        toast.error('Something went wrong')
      }
    }
   
  };
  const isDepartmentTrue=departmentData?.data?.length>0 ? false :true
  return (
    <div>
      <GbHeader title="Employee Insights" />
      <GbForm resolver={yupResolver(userCreateSchema)} submitHandler={submitForm}>
      <section className="grid grid-cols-12 gap-[40px]">
      <ProfileInfoPreview showUpload={false} />

        <div className="col-span-7 sdw_box">
         
            <GbStepers
              steps={[
                {
                  content: (
                    <div className="grid grid-cols-2 gap-[24px]">
                      <h1 className="text-[#343434] font-[700]  col-span-2 text-[20px] mb-[16px]">
                        Employee Information
                      </h1>
                      {/* <div className="mb-[10px]">
                        <GbFormSelect
                          name="id_type"
                          options={[
                            {
                              label: "item 1",
                              value: "item 1",
                            },
                          ]}
                          label="Id type"
                        />
                      </div> */}
                      <div className="mb-[10px]">
                        {/* done */}
                        <GbFormInput required={true} name="employee.employeeId" label="Employee Id" />
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
                            }
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
                        <GbFormSelect
                          name="office"
                          label="Office"
                          options={data?.data?.map((item:any)=>{
                            return {
                                label:item?.name,
                                value:item?.id
                            }
                            })}
                            handleChange={(v:any)=>{
                              setOfficeId(v.value)
                            }}
                        />
                      </div>
                      <div className="mb-[10px] ">
                        {/* done */}
                        <GbFormSelect disabled={isDepartmentTrue}  options={departmentData?.data?.map((item:any)=>{
                            return {
                                label:item?.name,
                                value:item?.id
                            }
                            })}  name="department" label="Department" />
                      </div>
                      <div className="mb-[10px] ">
                        {/* done */}
                        <GbFormInput name="employee.designation" label="Designation" />
                      </div>
                      <div className="mb-[10px] ">
                        {/* done */}
                        <GbFormInput
                          name="employee.reportingPerson"
                          label="Reporting person"
                        />
                      </div>
                      <div className="mb-[10px] ">
                        {/* done */}
                        <GbFormInput
                          name="employee.joiningDate"
                          type="date"
                          label="Date of joining"
                        />
                      </div>
                      <div className="mb-[10px] ">
                        {/* done */}
                        <GbFormSelect
                          name="employmentStatus"
                          label="Employment status"
                          options={[
                            {
                              label: "permanent",
                              value: "permanent",
                            },
                            {
                              label: "probation",
                              value: "probation",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  content:
                   <div className="">
                  <h1 className="text-[#343434] font-[700]  col-span-2 text-[20px] mb-[16px]">
                  Login information
                  </h1>
                
                  <div className="grid grid-cols-2">
                    <div>
                    <div className="mb-[10px]">
                    <GbFormSelect options={[
                      {
                        label:"agent",
                        value:"agent"
                      },
                      {
                        label:"ctgadmin",
                        value:"ctgadmin"
                      },
                      {
                        label:"cos",
                        value:"cos"
                      },
                    ]} name="employee.role" label="Role" />
                  </div>
                    <div className="mb-[10px]">
                    <GbFormInput name="employee.name" label="Username" />
                  </div>
                  <div className="mb-[10px]">
                    <GbFormInput name="Password" label="Password" />
                  </div>
                    </div>
                  </div>
                </div>,
                },
              ]}
            />
        </div>
      </section>
          </GbForm>
    </div>
  );
};

export default Page;
