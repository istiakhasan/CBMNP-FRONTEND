/* eslint-disable @next/next/no-img-element */
"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import ProfileCover from "../../../../../assets/images/profile_cover.png";
import Image from "next/image";
import { useState } from "react";
import { DatePicker } from "antd";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import ProfileCard from "../../_component/ProfileCard";

// Import ApexChart dynamically
const ApexChart = dynamic(() => import("@/components/ui/ProfileChart"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

const { RangePicker } = DatePicker;

const AgentProfile = () => {
  const [isClicked, setIsClicked] = useState<number>(0);
  const [graphButton, setGraphButton] = useState<string[]>([
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly",
  ]);
  const [graphButtonClick, setGraphButtonClick] = useState<string>("Daily");

  return (
    <div>
      {/* <GbHeader /> */}
      <div className="sdw_box">
        <div>
          <Image alt="" src={ProfileCover} height={240} className="w-full" />

          {/* Profile Info */}
          <div className="md:flex justify-between items-center">
            <div className="flex gap-[14px]">
              {/* Profile Picture */}
              <img
                alt="Profile Picture"
                src="https://sm.askmen.com/askmen_in/article/f/facebook-p/facebook-profile-picture-affects-chances-of-gettin_fr3n.jpg"
                width={190}
                height={190}
                className="rounded-[20px] overflow-hidden ml-[45px] mt-[-95px] object-cover"
              />

              <div className="mt-[15px]">
                <h1 className="text-[#343434] text-[20px] font-[700]">
                  Tafsir Ahmed{" "}
                  <i className="ri-verified-badge-line text-[#00A438]"></i>
                </h1>
                <p className="text-[#7D7D7D] font-[400] text-[14px]">
                  Tele sales executive
                </p>
              </div>
            </div>
            <p className="text-[#7D7D7D] font-[400] text-[14px]">
              <i className="ri-map-pin-user-line mr-[8px] text-[#F48C13] font-[17px]"></i>
              4517 Washington Ave. Manchester, Kentucky 39495
            </p>
          </div>
        </div>

        {/* Range Picker */}
        <div className="md:flex justify-between items-center mt-[50px]">
          <div className="bg-[#DCD9FB] mb-[4px] md:mb-0 p-[3px] rounded-[18px] w-fit">
            {[...Array(2).keys()].map((item) => (
              <button
                onClick={() => setIsClicked(item)}
                key={item}
                className={`${
                  isClicked === item && "bg-[#4A3AFF]"
                } px-[15px] py-[7px] text-[#FFFFFF] font-[600] text-[10px] rounded-[18px]`}
              >
                Overall sales
              </button>
            ))}
          </div>
          <RangePicker size={"middle"} />
        </div>

        {/* Profile Cards */}
        <div className="grid md:grid-cols-4 gap-[30px] my-[24px]">
          <ProfileCard
            bg_color={"bg-[#F7E3F3]"}
            title={" Total order quantity"}
            price={7000}
          >
            <div className="h-[34px] w-[34px] bg-[#FCC9F1] rounded-[50%] flex items-center justify-center">
              <i className="ri-blogger-line text-[#FFFFFF] text-[20px]"></i>
            </div>
          </ProfileCard>
          <ProfileCard
            bg_color={"bg-[#D2FBEE]"}
            title={" Total product quantity"}
            price={26000}
          >
            <div className="h-[34px] w-[34px] bg-[#9FEED6] rounded-[50%] flex items-center justify-center">
              <i className="ri-shopping-basket-2-line text-[#FFFFFF] text-[20px]"></i>
            </div>
          </ProfileCard>
          <ProfileCard
            bg_color={"bg-[#E3F2FD]"}
            title={" Total cancel order quantity"}
            price={2400}
          >
            <div className="h-[34px] w-[34px] bg-[#C0E4FF] rounded-[50%] flex items-center justify-center">
              <i className="ri-emotion-sad-line text-[#FFFFFF] text-[20px]"></i>
            </div>
          </ProfileCard>
          <ProfileCard
            bg_color={" bg-[#E8E0FF]"}
            title={" Delivered order quantity"}
            price={4600}
          >
            <div className="h-[34px] w-[34px] bg-[#D2C3FF] rounded-[50%] flex items-center justify-center">
              <i className="ri-rocket-line text-[#FFFFFF] text-[20px]"></i>
            </div>
          </ProfileCard>
        </div>

        {/* Graph Section */}
        <div className="md:grid md:grid-cols-12 gap-[30px]">
          <div className="col-span-7">
            <div className="flex justify-between items-center mt-[50px] mb-[40px]">
              <div className="flex items-center gap-[10px]">
                <div>
                  <p className="text-[#9291A5] text-[12px] font-[400]">
                    Sales 2022
                  </p>
                  <h1 className="text-[#343434] text-[24px] font-[600]">
                    220k
                  </h1>
                </div>
                <p className="text-[#A2A2A2] text-[14px] font-[400]">
                  <span className="text-[#04CE00] font-bold">+12.6%</span> vs
                  last year
                </p>
              </div>
              <div className="bg-[#DCD9FB] p-[3px] rounded-[18px] w-fit">
                {graphButton.map((item) => (
                  <button
                    onClick={() => setGraphButtonClick(item)}
                    key={item}
                    className={`${
                      graphButtonClick === item && "bg-[#4A3AFF]"
                    } px-[15px] py-[7px] text-[#FFFFFF] font-[600] text-[10px] rounded-[18px]`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <ApexChart />
          </div>
          <div className="md:col-span-5">
            <div className="grid md:grid-cols-2 gap-[30px]">
              <ProfileCard
                bg_color={" bg-[#F7F9FB]"}
                title={" Total order valuation"}
                price={"20M"}
              >
                <div className="h-[34px] w-[34px] bg-[#FCC9F1] rounded-[50%] flex items-center justify-center">
                  <i className="ri-blogger-line text-[#FFFFFF] text-[20px]"></i>
                </div>
              </ProfileCard>
              <ProfileCard
                bg_color={" bg-[#F7F9FB]"}
                title={"Total product valuation"}
                price={"35M"}
              >
                <div className="h-[34px] w-[34px] bg-[#9FEED6] rounded-[50%] flex items-center justify-center">
                  <i className="ri-shopping-basket-2-line text-[#FFFFFF] text-[20px]"></i>
                </div>
              </ProfileCard>
              <ProfileCard
                bg_color={" bg-[#F7F9FB]"}
                title={"Cancel order Valuation"}
                price={"2.8M"}
              >
                <div className="h-[34px] w-[34px] bg-[#C0E4FF] rounded-[50%] flex items-center justify-center">
                  <i className="ri-emotion-sad-line text-[#FFFFFF] text-[20px]"></i>
                </div>
              </ProfileCard>
              <ProfileCard
                bg_color={" bg-[#F7F9FB]"}
                title={"Delivery Evaluation"}
                price={"5.5M"}
              >
                <div className="h-[34px] w-[34px] bg-[#D2C3FF] rounded-[50%] flex items-center justify-center">
                  <i className="ri-rocket-line text-[#FFFFFF] text-[20px]"></i>
                </div>
              </ProfileCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
