import React from "react";
import GLogo from "../../../assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserInfo } from "@/service/authService";
import GLogovtwo from '../../../assets/images/gblogovtwo.png'
const AgentSidebar = () => {
  const location = usePathname();
  const modifyLocationUrl = location.split("/");
  const handleActiveMenu = (url: string) => modifyLocationUrl.includes(url);
  const userInfo:any=getUserInfo()
  return (
    <div className="w-[90px] bg-[#FFFFFF]">
      <Link href={"/dashboard"}>
      <Image
        className="block mx-auto my-[20px]"
        width={38}
        height={40}
        src={GLogovtwo}
        alt=""
      />
      </Link>
      <div className="mt-[30px]">
      {userInfo?.role !=="agent" &&  <Link href="/dashboard">
          <p
            className={`h-[48px] hover_menu flex items-center justify-center cursor-pointer ${
              handleActiveMenu("dashboard") ? "bg-[#D1D1D1]" : ""
            }`}
          >
            <i
              className={`ri-dashboard-horizontal-fill text-[24px] ${
                handleActiveMenu("dashboard")
                  ? "text-[#6D6D6D]"
                  : "text-[#343434]"
              }`}
            ></i>
          </p>
        </Link>}

        <div className="hover_menu">
          <p
            className={`h-[48px] hover_menu flex items-center justify-center cursor-pointer ${
              handleActiveMenu("subscription") ? "bg-[#D1D1D1]" : ""
            }`}
          >
            <i
              className={`ri-shield-user-fill text-[24px] ${
                handleActiveMenu("subscription")
                  ? "text-[#6D6D6D]"
                  : "text-[#343434]"
              }`}
            ></i>
          </p>
          <div className="hover_menu_item shadow-md">
            {[
              { href: "/subscription/register", text: "Create new subscription" },
              { href: "/subscription/customer_list", text: "Subscriber list" },
            ].map((link, index) => (
              <p key={index} className="text-nowrap">
                <Link
                  className={`w-full rounded-[4px] hover:text-[#6D6D6D] ${
                    handleActiveMenu(link.href.split("/")[2])
                      ? "text-[#6D6D6D] bg-[#D1D1D1]"
                      : "text-[#343434]"
                  } font-bold text-[12px] px-[14px] py-[10px] inline-block`}
                  href={link.href}
                >
                  {link.text}
                </Link>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;
