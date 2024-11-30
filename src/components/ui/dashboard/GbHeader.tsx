/* eslint-disable @next/next/no-img-element */

import { Avatar, MenuProps, Space } from "antd";
import GbDropdown from "./GbDropdown";
import Link from "next/link";
const GbHeader = ({title}:{title?:string}) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i style={{ fontSize: "20px" }} className="ri-user-line"></i>
            <span>Profile</span>
          </span>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i style={{ fontSize: "20px" }} className="ri-settings-3-line"></i>
            <span>Company Settings</span>
          </span>
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i style={{ fontSize: "20px" }} className="ri-bank-card-line"></i>
            <span>Payments</span>
          </span>
        </Link>
      ),
      key: "2",
    },
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i style={{ fontSize: "20px" }} className="ri-question-fill"></i>
            <span>Help desk</span>
          </span>
        </Link>
      ),
      key: "3",
    },
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i style={{ fontSize: "20px" }} className="ri-message-2-line"></i>
            <span>Live Support</span>
          </span>
        </Link>
      ),
      key: "4",
    },
    {
      label: (
        <Link href="/profile">
          <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
            <i
              style={{ fontSize: "20px" }}
              className="ri-logout-circle-r-line"
            ></i>
            <span>Logout</span>
          </span>
        </Link>
      ),
      key: "5",
    },
  ];

  return (
    <div className="bg-light gb-header h-[65px] px-[16px] flex items-center sticky top-0 z-50">
       <h1 className="text-2xl  text-primary">{title}</h1>
      <div className="ml-auto flex items-center gap-[32px]">
        <div>
          <i
            style={{ fontSize: "20px", cursor: "pointer" }}
            className="ri-notification-3-line"
          ></i>
        </div>
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
  );
};

export default GbHeader;
