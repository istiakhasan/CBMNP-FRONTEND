import UserPasswordChangeForm from "@/components/UserPasswordChangeForm";
import React from "react";

const ChangeUserPassword = ({ rowData, setOpenPasswordModal }: any) => {
  return (
    <div className="pt-[20px] px-[20px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px]">Change Password</h1>
        <i
          onClick={() => setOpenPasswordModal(false)}
          style={{ fontSize: "18px" }}
          className="ri-close-large-fill cursor-pointer"
        ></i>
      </div>
      <p className="text-[13px] text-gray-500 mb-3">
        {rowData?.name} ({rowData?.userId})
      </p>
      <div style={{ background: "rgba(0,0,0,.1)" }} className="mb-4 h-[1px]"></div>

      <UserPasswordChangeForm
        userId={rowData?.id}
        onClose={() => setOpenPasswordModal(false)}
      />
    </div>
  );
};

export default ChangeUserPassword;
