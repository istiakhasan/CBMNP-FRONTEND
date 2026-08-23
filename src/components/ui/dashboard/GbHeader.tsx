/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, MenuProps, Space } from "antd";
import GbDropdown from "./GbDropdown";
import { getUserInfo, removeUserInfo } from "@/service/authService";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/redux/feature/menuSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import GbModal from "../GbModal";
import UserPasswordChangeForm from "@/components/UserPasswordChangeForm";
const GbHeader = ({ title }: { title?: string }) => {
  const rstate=useSelector((state:RootState)=>state.menu)
  const dispatch = useDispatch();
  const router = useRouter();
  const local = useLocale();
  const userInfo: any = getUserInfo();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const items: MenuProps["items"] = [
    // {
    //   label: (
    //     <Link href="/profile">
    //       <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
    //         <i style={{ fontSize: "20px" }} className="ri-user-line"></i>
    //         <span>Profile</span>
    //       </span>
    //     </Link>
    //   ),
    //   key: "0",
    // },
    // {
    //   label: (
    //     <Link href="/profile">
    //       <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
    //         <i style={{ fontSize: "20px" }} className="ri-settings-3-line"></i>
    //         <span>Company Settings</span>
    //       </span>
    //     </Link>
    //   ),
    //   key: "1",
    // },
    // {
    //   label: (
    //     <Link href="/profile">
    //       <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
    //         <i style={{ fontSize: "20px" }} className="ri-bank-card-line"></i>
    //         <span>Payments</span>
    //       </span>
    //     </Link>
    //   ),
    //   key: "2",
    // },
    // {
    //   label: (
    //     <Link href="/profile">
    //       <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
    //         <i style={{ fontSize: "20px" }} className="ri-question-fill"></i>
    //         <span>Help desk</span>
    //       </span>
    //     </Link>
    //   ),
    //   key: "3",
    // },
    // {
    //   label: (
    //     <Link href="/profile">
    //       <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
    //         <i style={{ fontSize: "20px" }} className="ri-message-2-line"></i>
    //         <span>Live Support</span>
    //       </span>
    //     </Link>
    //   ),
    //   key: "4",
    // },
    {
      label: (
        <>
          <span
            onClick={() => setOpenPasswordModal(true)}
            className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center"
          >
            <i
              style={{ fontSize: "20px" }}
              className="ri-lock-password-line"
            ></i>
            <span>Change Password</span>
          </span>
        </>
      ),
      key: "change-password",
    },
    {
      label: (
        <>
          <span
            onClick={() => {
              removeUserInfo("token");
              router.push(`/${local}/login`);
            }}
            className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center"
          >
            <i
              style={{ fontSize: "20px" }}
              className="ri-logout-circle-r-line"
            ></i>
            <span>Logout</span>
          </span>
        </>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <div
        style={{ zIndex: "1000" }}
        className="bg-[#FFFFFF] gb-header h-[65px] px-[16px] flex items-center sticky top-0 z-50"
      >
     {!rstate?.toggle && <div className="toggle_btn md:hidden">
        <i
          onClick={() => dispatch(toggleSidebar({ show: true }))}
          className="ri-menu-fill"
        ></i>
      </div>}
      <h1 className="text-2xl  text-primary">{title}</h1>
      <div className="ml-auto flex items-center gap-[32px]">
        <div>{/* <LocalSwitcher /> */}</div>
        {/* <div>
          <i
            style={{ fontSize: "20px", cursor: "pointer" }}
            className="ri-notification-3-line"
          ></i>
        </div> */}

        <div>
          <GbDropdown items={items}>
            <div className="cursor-pointer flex gap-[8px]">
              <Avatar
                src
                size={39}
                icon={
                  <img
                    className="object-cover"
                    src={
                      "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                    }
                    alt=""
                  />
                }
              />
              <Space>
                <i
                  style={{ fontSize: "24px" }}
                  className="ri-arrow-down-s-fill text-gray-700"
                ></i>
              </Space>
            </div>
          </GbDropdown>
        </div>
      </div>
      </div>
      <GbModal
        isModalOpen={openPasswordModal}
        openModal={() => setOpenPasswordModal(true)}
        closeModal={() => setOpenPasswordModal(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <div className="pt-[20px] px-[20px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[20px]">Change Password</h1>
            <i
              onClick={() => setOpenPasswordModal(false)}
              style={{ fontSize: "18px" }}
              className="ri-close-large-fill cursor-pointer"
            ></i>
          </div>
          <div style={{ background: "rgba(0,0,0,.1)" }} className="mb-4 h-[1px]"></div>
          <UserPasswordChangeForm
            userId={userInfo?.id}
            onClose={() => setOpenPasswordModal(false)}
          />
        </div>
      </GbModal>
    </>
  );
};

export default GbHeader;
