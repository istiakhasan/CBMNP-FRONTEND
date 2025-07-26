"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Divider, message, Tooltip } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import OrderDetails from "./_component/OrderDetails";
import OrderLog from "./_component/OrderLog";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import { handleCopy } from "@/util/copyOrderInfo";
import { getUserInfo } from "@/service/authService";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { useLocale } from "next-intl";


const Page = () => {
  const [active, setActive] = useState(1);
  const { orderid } = useParams();
  const router = useRouter();
  const local=useLocale()
  const { data, isLoading } = useGetOrderByIdQuery({
    id: orderid,
  });
  const userInfo: any = getUserInfo();
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  const component: any = {
    1: <OrderDetails data={data} permission={permission} />,
    2: <OrderLog data={data} />,
  };
  const [copyLoading, setCopyLoading] = useState(false);
  return (
    <div >
      <div className="mb-2">
      <GbHeader title="Order" />
      </div>
      <div className=" ">
        <div className="h-[90vh]  overflow-x-scroll custom_scroll">
          <div className="sticky top-0 mt-[16px] bg-white  z-50">
            <div className="p-[16px] flex  items-center  ">
              <button
                onClick={() => setActive(1)}
                className={`${
                  active === 1
                    ? "bg-[#F2F8FA]  text-[#4F8A6D] font-semibold "
                    : ""
                } px-[15px] py-[4px]`}
              >
                Details
              </button>
              <button
                onClick={() => setActive(2)}
                className={`${
                  active === 2
                    ? "bg-[#F2F8FA]  text-[#4F8A6D] font-semibold "
                    : ""
                } px-[15px] py-[4px]`}
              >
                Logs
              </button>
              {/* copy order info */}

              <div className="ml-auto flex">
                <p onClick={() =>
                      handleCopy(data, setCopyLoading, () => {
                        message.success(
                          "Order information copied successfully!"
                        );
                      })
                    } className="border-[#4F8A6D] border text-[#4F8A6D]  cursor-pointer  px-[25px] py-[4px]  mr-2">
                  <i
                    className="ri-file-copy-2-line text-[18px]  cursor-pointer"
                  ></i>
                  Copy Info{" "}
                </p>
                { permission?.includes("UPDATE_ORDERS") && 
                  <button
                    onClick={() =>
                      router.push(
                        `/${local}/orders/edit?orderId=${data?.id}&customerId=${data?.customerId}`
                      )
                    }
                    className="bg-[#4F8A6D] text-white px-[25px] py-[4px] "
                  >
                    Edit
                  </button>
                }
              </div>
            </div>
            <Divider style={{ padding: "0", margin: "0" }} />
          </div>
          <div className="p-[16px]">{component[active]}</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
