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


const LoginPage = () => {
  const local = useLocale();
  const [handleUserLogin] = useSignInMutation();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userInfo: any = getUserInfo();

  const handleSubmit = async (data: any) => {
    try {
      const res = await handleUserLogin(data).unwrap();
      if (res?.data?.accessToken) {
        const result: { role: string } = jwtDecode(res?.data?.accessToken);
        storeUserInfo({ accessToken: res?.data?.accessToken });
        router.push(`/${local}/dashboard`);
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
    } else {
      setLoading(false);
    }
  }, [userInfo?.role, local]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f0f4f8] to-[#e6edf3] px-4">
      {loading ? (
        <div className="text-lg text-gray-700">Loading...</div>
      ) : (
        <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white">
          {/* Left: Illustration or Branding */}
          <div className="hidden md:flex flex-col items-center justify-center bg-[#248095] text-white p-10">
            <h2 className="text-3xl font-bold font-serif">Welcome to GB-SME</h2>
            <p className="mt-4 text-lg text-center">
              Manage your business smartly and efficiently.
            </p>
            {/* Optional: Add an SVG or image here */}
          </div>

          {/* Right: Login Form */}
          <div className="p-10 md:p-16 bg-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center font-serif">
              Sign In
            </h1>
            <GbForm
              submitHandler={handleSubmit}
              resolver={yupResolver(loginSchema)}
            >
              <div className="mb-5">
                <GbLoginInput
                  name="userId"
                  type="text"
                  label="User ID"
                  placeholder="Enter your user ID"
                />
              </div>
              <div className="mb-5">
                <GbLoginInput
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                htmlType="submit"
                type="primary"
                className="w-full py-2 text-lg font-semibold rounded-md bg-[#248095] hover:bg-[#1b5f6c] transition-all duration-200"
              >
                Login
              </Button>
            </GbForm>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoginPage;
