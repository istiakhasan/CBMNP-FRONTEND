"use client";
import CustomTree from "@/components/ui/CustomTree";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbTree from "@/components/ui/GbTree";
import { useGetAllPermissionLabelQuery } from "@/redux/api/permission.Api";
import { useCreateUserPermissionMutation } from "@/redux/api/userPermission";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { message, Spin } from "antd";
import axios from "axios";
import { useParams } from "next/navigation";
import React, {  useState } from "react";

const UserPermission = () => {
  const params=useParams()
  const { data, isLoading } = useGetAllPermissionLabelQuery(undefined);
  const {data:userData,isLoading:getUserLoading}=useGetUserByIdQuery({id:params?.userid})
  const [createUserPermission]=useCreateUserPermissionMutation()
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const updatePermissionForm=async()=>{
    try {
      const modifyData=checkedKeys?.filter((item:any)=>typeof item !=='string')
      if(modifyData?.length<1){
        return message.error('Please select at least one permission')
      }
      const transFormed=Object.values(
        modifyData.reduce((acc:any,b:any)=>{
          acc[b]={
            userId:params?.userid,
            permissionId:b
          }
           return acc
        },{})
      )
      const res=await createUserPermission(transFormed).unwrap()
      if(res?.success){
        message.success(res?.message)
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <GbHeader title={"Permissions"} />
      <div className="p-[16px]" style={{height:"calc(100vh - 65px)",overflow:"scroll"}}>

      {isLoading || getUserLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
        <div>
          {/* <h1 className="text-2xl mb-[40px] text-primary"></h1> */}
          <div className="flex justify-center">
            {/* <GbTree defaultKey={userData?.permission} checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} treeData={data?.data} /> */}
            <CustomTree treeData={data?.data}  defaultKey={userData?.permission}  checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} />
          </div>
         
        </div>
        <div className="flex items-center justify-end mt-3 bg-white  py-3 sticky bottom-0">
          <button
              onClick={updatePermissionForm}
              className="bg-[#4F8A6D]  text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
              >
              Update permission
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default UserPermission;
