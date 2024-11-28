"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbTree from "@/components/ui/GbTree";
import { useGetAllPermissionLabelQuery } from "@/redux/api/permission.Api";
import { Spin } from "antd";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserPermission = () => {
  const { data, isLoading } = useGetAllPermissionLabelQuery(undefined);
  const [userData,setUserData]=useState<any>({})
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const params=useParams()
  useEffect(()=>{
    axios.get(`http://localhost:8080/api/v1/user/${params?.userid}`)
    .then(res=>setUserData(res?.data))
    .catch(error=>console.log(error))
  },[params?.userid])
  console.log(userData,"userDAta");
  return (
    <div>
      <GbHeader />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
        <div className="p-[16px]">
          <h1 className="text-2xl mb-[40px] text-primary">Permissions</h1>
          <div className="flex justify-center">
            <GbTree defaultKey={userData?.permission} checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} treeData={data?.data} />
          </div>
         
        </div>
        <div className="flex items-center justify-center mt-3 bg-white  py-3 sticky bottom-0">
          <button
              onClick={()=>console.log(checkedKeys.filter((item:any)=>typeof item !=='string'))}
              className="bg-[#47a2b3]  text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
            >
              Update permission
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPermission;
