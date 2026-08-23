"use client";

import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import { useUpdateUserByIdMutation } from "@/redux/api/usersApi";
import { changeUserPasswordSchema } from "@/schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

type UserPasswordChangeFormProps = {
  userId?: string | number;
  onClose: () => void;
};

const UserPasswordChangeForm = ({ userId, onClose }: UserPasswordChangeFormProps) => {
  const [updateUser] = useUpdateUserByIdMutation();

  const formSubmit = async (data: any, reset: any) => {
    if (!userId) {
      message.error("User information not found");
      return;
    }

    try {
      const res = await updateUser({
        id: userId,
        data: {
          password: data?.password,
        },
      }).unwrap();

      if (res?.success) {
        message.success("Password changed successfully");
        onClose();
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length) {
        error.data.errorMessages.forEach((item: any) => {
          message.error(item?.message);
        });
        return;
      }
      message.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <GbForm resolver={yupResolver(changeUserPasswordSchema)} submitHandler={formSubmit}>
      <div className="mb-3">
        <GbFormInput name="password" type="password" label="New Password" />
      </div>
      <div className="mb-3">
        <GbFormInput name="confirmPassword" type="password" label="Confirm Password" />
      </div>

      <div className="flex items-center justify-end my-[20px] gap-2">
        <button
          type="button"
          onClick={onClose}
          style={{ border: "1px solid #4F8A6D" }}
          className="text-black font-bold text-[12px] px-[20px] py-[5px]"
        >
          Cancel
        </button>
        <button
          style={{ border: "1px solid #4F8A6D" }}
          className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
        >
          Change
        </button>
      </div>
    </GbForm>
  );
};

export default UserPasswordChangeForm;
