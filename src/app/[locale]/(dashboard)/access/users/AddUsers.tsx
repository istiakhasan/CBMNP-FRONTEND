import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useCreateUserMutation } from "@/redux/api/usersApi";
import { createUserSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React from "react";

const AddUsers = ({setOpenAddUserModal}:any) => {
  const [handleCreateUser]=useCreateUserMutation()
  const formSubmit=async(data:any,reset:any)=>{
    try {
      const res=await handleCreateUser({...data,role:data?.role.value}).unwrap()
      console.log(res);
      if(res?.success){
        message.success(res?.message)
        setOpenAddUserModal(false)
        reset()
      }
    } catch (error:any) {
      error?.data?.errorMessages?.forEach((item:any)=>{
        message.error(item?.message)
      })
    }
  }
  return (
   <div className="pt-[20px] px-[20px]">
    <div className="flex justify-between items-center">
        <h1 className="text-[20px]">Add User</h1>
        <i onClick={()=>setOpenAddUserModal(false)} style={{fontSize:"18px"}} className="ri-close-large-fill cursor-pointer"></i>
    </div>
    <div style={{background:"rgba(0,0,0,.1)"}} className="mb-4 h-[1px]"></div>
     <GbForm resolver={yupResolver(createUserSchema)} submitHandler={formSubmit}>
      <div className="mb-3">
        <GbFormSelect name="role" options={[
          {
            label:'Admin',
            value:'admin',
          },
          {
            label:'Owner',
            value:'owner',
          },
          {
            label:'User',
            value:'user',
          },
        ]} label="Role" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormInput name="name" label="Name" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormInput name="internalId" label="Internal ID" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormInput name="email" label="Email" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormInput name="phone" label="Phone Number" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormTextArea name="address" label="Address" />
      </div>
      <div className="mb-3">
        {/* exist */}
        <GbFormInput name="password" label="Password" />
      </div>

        <div className="flex items-center justify-end  my-[20px] gap-2">
             <button onClick={()=>setOpenAddUserModal(false)} style={{border:"1px solid #4F8A6D"}}  className="  text-black font-bold text-[12px]   px-[20px] py-[5px]">
              Cancel
            </button>
             <button style={{border:"1px solid #4F8A6D"}}   className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]">
              Create
            </button>
        </div>
    </GbForm>
   </div>
  );
};

export default AddUsers;
