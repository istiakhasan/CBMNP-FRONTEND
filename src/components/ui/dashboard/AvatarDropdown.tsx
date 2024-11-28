/* eslint-disable @next/next/no-img-element */
"use client";
import type { MenuProps } from "antd";
import { Dropdown, Space, Avatar, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AvatarImage from "../../../assets/images/icons/avatar.png";
import { removeUserInfo } from "@/service/authService";
import { authKey } from "@/constants/storageKey";
import { toast } from "react-toastify";
import { useGetProfileInfoQuery } from "@/redux/api/authApi";
import { getBaseUrl } from "@/helpers/config/envConfig";

const AvatarDropdown = () => {
  const { data, isLoading,error } = useGetProfileInfoQuery<any>(undefined);
  const router = useRouter();
  if (isLoading) {
    return;
  }
  const user = data?.data?.employee;
  const profileImageUrl = user?.profile_img ? `${getBaseUrl()}/${user?.profile_img}` : AvatarImage.src;

  const items: MenuProps["items"] = [
    // {
    //   key: "1",
    //   label: (
    //     <div className="min-w-[200px]">
    //       <h1
    //         onClick={() => router.push("/employee/profile/edit-profile")}
    //         className="text-[12px] py-2 border-b-[1px] border-gray-100 font-bold"
    //       >
    //         My Profile
    //       </h1>
    //     </div>
    //   ),
    // },
    // {
    //   key: "2",
    //   label: (
    //     <div className="min-w-[200px]">
    //       <h1 className="text-[12px] py-2 border-b-[1px] border-gray-100 font-bold">
    //         Setting
    //       </h1>
    //     </div>
    //   ),
    // },
    {
      key: "3",
      label: (
        <div className="min-w-[200px]">
          <h1
            onClick={() => {
              removeUserInfo(authKey);
              router.push("/login");
              toast.success("Sign out successfully...");
            }}
            className="text-[12px] py-2 border-b-[1px] border-gray-100 font-bold"
          >
            Logout
          </h1>
        </div>
      ),
    },
  ];
// if(error && error?.data?.errorMessages){
//   message.error(error?.data?.errorMessages[0]?.message)
//   removeUserInfo(authKey);
//   window.location.href = "/login";
// }
  return (
    <Space direction="vertical">
      <Dropdown
        className="cursor-pointer"
        menu={{ items }}
        placement="bottomRight"
        arrow={{ pointAtCenter: false }}
      >
        <div className="flex items-center justify-between gap-[8px]">
          <Avatar
            src
            size={39}
            icon={<img className="object-cover"  src={profileImageUrl} alt=""  />}
            // icon={<Image src={AvatarImage} alt="" width={39} />}
          />
          <div>
            <h1 className="font-[500] text-[14px] text-[#333333]">
              {user?.firstName + " " + user?.lastName}
            </h1>
            <span className="text-[#A3A3A3] text-[12px] font-[400]">
              {user?.designation}
            </span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
    </Space>
  );
};

export default AvatarDropdown;
