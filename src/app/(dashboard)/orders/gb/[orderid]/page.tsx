"use client";

import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Divider, message, Tooltip } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import OrderDetails from "./_component/OrderDetails";
import OrderLog from "./_component/OrderLog";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import { handleCopy } from "@/util/copyOrderInfo";

const Page = () => {
  const [active, setActive] = useState(1);
  const { orderid } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetOrderByIdQuery({
    id: orderid,
  });
  const component: any = {
    1: <OrderDetails data={data} />,
    2: <OrderLog data={data} />,
  };
  const [copyLoading, setCopyLoading] = useState(false);
  return (
    <div className="bg-white min-h-screen h-auto">
      <GbHeader title="Order" />
      <div className="bg-white">
        <div className="h-[90vh]  overflow-x-scroll custom_scroll">
          <div className="sticky top-0 bg-white z-50">
            <div className="p-[16px] flex  items-center  ">
              <button
                onClick={() => setActive(1)}
                className={`${
                  active === 1
                    ? "bg-[#F2F8FA]  text-[#288EAD] font-semibold "
                    : ""
                } px-[15px] py-[4px]`}
              >
                Details
              </button>
              <button
                onClick={() => setActive(2)}
                className={`${
                  active === 2
                    ? "bg-[#F2F8FA]  text-[#288EAD] font-semibold "
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
                    } className="border-[#288EAD] border text-[#288EAD]  cursor-pointer  px-[25px] py-[4px]  mr-2">
                  <i
                    className="ri-file-copy-2-line text-[18px]  cursor-pointer"
                  ></i>
                  Copy Info{" "}
                </p>
                {(data?.orderStatus?.value === "1" ||
                  data?.orderStatus?.value === "2") && (
                  <button
                    onClick={() =>
                      router.push(
                        `/orders/gb/edit?orderId=${data?.id}&customerId=${data?.customer_Id}`
                      )
                    }
                    className="bg-[#288EAD] text-white px-[25px] py-[4px] "
                  >
                    Edit
                  </button>
                )}
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
