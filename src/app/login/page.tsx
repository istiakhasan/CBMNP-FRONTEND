"use client";
import Image from "next/image";
import LoginImage from "../../assets/images/login-img.png";
import GbForm from "@/components/forms/GbForm";
import Link from "next/link";
import { Button, message } from "antd";
import GbLoginInput from "@/components/forms/GbLoginInput";
import { useSignInMutation } from "@/redux/api/authApi";
import { redirect, useRouter } from "next/navigation";
import { getUserInfo, storeUserInfo } from "@/service/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schema/schema";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const Page = () => {
  const [handleUserLogin] = useSignInMutation();
  const router=useRouter()
  const userInfo:any=getUserInfo()
  const handleSubmit = async (data: any) => {
    try {
      const res = await handleUserLogin(data).unwrap();
      if(res?.data?.token){
       const result:{role:string}= jwtDecode(res?.data?.token)
       if(result?.role==="agent"){
        router.push('/subscription/customer_list')
       }
      else if(result?.role==="cos"){
        router.push('/dashboard')
       }
       
       else{

         router.push('/employee/profile')
        }
         message.success(res?.message)
      }
      storeUserInfo({ accessToken: res?.data?.token });
    } catch (error:any) {
        if(error){
            error?.data?.errorMessages?.forEach((item:{message:string})=>{
                message.error(item?.message)
            })
        }
    }
  };
  useEffect(()=>{
    if(userInfo?.role){
       return redirect('/dashboard')
    }
  },[router])
  return (
    <section className=" h-[100vh] flex items-center justify-center bg-[#f7f7f7]  mx-auto">
     <div style={{boxShadow:"0 8px 24px rgba(0,0,0,.04)"}} className=" w-[462px] bg-[#fff] p-[60px]">

<GbForm submitHandler={handleSubmit} resolver={yupResolver(loginSchema)}>
  <h1 className="text-[24px] mb-[30px] text-center  uppercase font-serif font-bold">ERP</h1>
  <div className="mb-[20px]">
    <GbLoginInput
      name="userId"
      type="text"
      label="User Id"
      placeholder="Enter your userId"
    />
  </div>
  <div>
    <GbLoginInput
      name="password"
      type="password"
      label="Password"
      placeholder="Enter your pasword"
    />
  </div>
  {/* <div className="text-end">
    <Link
      className="text-[12px] text-[#4E9EFC] font-[500] "
      href={"/"}
    >
      Forgot password
    </Link>
  </div> */}
  <Button
    htmlType="submit"
    style={{ padding: "10px", height: "auto",background:"#248095" }}
    className="w-[100%]  bg-[#D1D1D1] mt-[30px]"
    type="primary"
  >
    Login
  </Button>
  {/* <p className="text-[14px] text-center font-[400] text-[#A2A2A2] mt-[20px]">
    Don’t have an account?{" "}
    <Link
      className="text-[12px] text-[#4E9EFC] font-[500] "
      href={"/"}
    >
      Sign Up
    </Link>
  </p> */}
</GbForm>
</div>
 
    </section>
  );
};

export default Page;
