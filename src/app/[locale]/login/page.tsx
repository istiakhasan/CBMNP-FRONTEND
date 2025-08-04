"use client";
import GbForm from "@/components/forms/GbForm";
import { Button, message } from "antd";
import GbLoginInput from "@/components/forms/GbLoginInput";
import { useSignInMutation } from "@/redux/api/authApi";
import { redirect, useRouter } from "next/navigation";
import { getUserInfo, storeUserInfo } from "@/service/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schema/schema";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const Page = () => {
  const local=useLocale()
  const [handleUserLogin] = useSignInMutation();
  const [loading,setLoading]=useState(true)
  const router = useRouter();
  const userInfo: any = getUserInfo();
  const handleSubmit = async (data: any) => {
    try {
      const res = await handleUserLogin(data).unwrap();
      if (res?.data?.accessToken) {
        const result: { role: string } = jwtDecode(res?.data?.accessToken);
        storeUserInfo({ accessToken: res?.data?.accessToken });
        router.push(`/${local}/dashboard"`);
      }
    } catch (error: any) {
      if (error) {
        error?.data?.errorMessages?.forEach((item: { message: string }) => {
          message.error(item?.message);
        });
      }
    }
  };
  useEffect(() => {
    if (userInfo?.role) {
      return redirect(`/${local}/dashboard`);
    }else{
      setLoading(false)
    }
  }, [userInfo?.role,local]);
  return (
    <section className=" h-[100vh] flex items-center justify-center bg-[#f7f7f7]  mx-auto">
     {
      loading?<div>Loading</div>:<>
       <div
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,.04)" }}
        className=" w-[462px] bg-[#fff] p-[60px]"
      >
        <GbForm
          submitHandler={handleSubmit}
          resolver={yupResolver(loginSchema)}
        >
          <h1 className="text-[24px] mb-[30px] text-center  uppercase font-serif font-bold">
            GB-SME
          </h1>
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

          <Button
            htmlType="submit"
            style={{ padding: "10px", height: "auto", background: "#248095" }}
            className="w-[100%]  bg-[#D1D1D1] mt-[30px]"
            type="primary"
          >
            Login
          </Button>
        </GbForm>
      </div>
      
      </>
     }
    </section>
  );
};

export default Page;
