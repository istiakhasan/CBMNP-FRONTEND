"use client"
import GbForm from "@/components/forms/GbForm";
import {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
} from "@/redux/api/customerApi";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import CreateCustomerDrawar from "./CreateCustomerDrawar";
import { Input, message } from "antd";
import { createCustomerSchema } from "@/schema/schema";
import GbDrawer from "@/components/ui/GbDrawer";
import moment from "moment";
import axios from "axios";
import { getBaseUrl } from "@/helpers/config/envConfig";

const CreateCustomer = ({ setCustomer, customer }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [orderCount,setOrderCount]=useState<any>([])
  const containerRef: any = useRef(null);
  const { data: customerData, isLoading } = useGetAllCustomersQuery(
    {
      searchTerm,
      limit: 20,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );
  const [handleCreateCustomer] = useCreateCustomerMutation();
  const handleClickOutside = (event: any) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsFocus(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formSubmit = async (data: any, reset: any) => {
    try {
      const payload = { ...data };
      payload["customerType"] = data?.customerType?.value;
      payload["district"] = data?.district?.label;
      payload["division"] = data?.division?.label;
      payload["thana"] = data?.thana?.label;
      if (!!data?.country) {
        payload["country"] = data?.country?.value;
      }

      const res = await handleCreateCustomer(payload).unwrap();
      if (res?.success === true) {
        setCustomer(res?.data);
        message.success("Customer create successfully");
        setDrawerOpen(false);
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      }
      message.error("Something went wrong");
      reset();
    }
  };
  return (
    <div className="w-[400px] h-[90vh] overflow-x-auto  pr-[16px] border-r  custom_scroll">
      <div className="sticky top-0  pt-[15px] bg-white">
        <div ref={containerRef} className="relative">
          <div
            style={{ border: "1px solid #4F8A6D" }}
            className="floating-label-input "
          >
            <label
              htmlFor="customerSearch"
              className="text-[#999] block text-[12px]"
            >
              Search customer
            </label>
            <input
              id="customerSearch"
              className="p-[14px] text-[12px] outline-none bg-[#F6F6F6] w-full rounded-[4px]"
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocus(true)}
            />
          </div>
          {isFocus && (
            <div className="h-[300px] overflow-y-scroll border w-full absolute bg-white">
              {customerData?.data < 1 ? (
                <>
                  {" "}
                  <div className=" h-full flex items-center justify-center">
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
                    >
                      Add customer
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  {customerData?.data?.map((item: any) => (
                    <div
                      onClick={async() => {
                        const res=await axios.get(`${getBaseUrl()}/customers/orders-count/${item?.customer_Id}`)
                        setOrderCount(res?.data?.data)
                        setCustomer(item);
                        setIsFocus(false);
                      }}
                      key={item?.id}
                      className="flex justify-between items-center border-b px-[20px] py-[10px] hover:bg-gray-100 cursor-pointer"
                    >
                      <div>
                        <h1 className="bg-gray-500 px-[10px] py-[5px] text-white text-[10px] w-fit">
                          {item?.customerType}
                        </h1>
                        <h1 className="text-[12px] text-gray-500">
                          {item?.customerName}
                        </h1>
                        <h1 className="text-[12px] text-gray-500">
                          {item?.customerPhoneNumber}
                        </h1>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {Object.values(customer).length > 1 && (
        <div className="">
            <div className="gb_border  mt-3 p-3">
            <div className="mb-2">
              <p className="text-white py-[3px] w-fit text-[10px] px-[15px] bg-primary">
                {customer?.customerType}
              </p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[14px] mb-2">Customer Id</p>
              <p className="text-[#000] font-[14px]">{customer?.customer_Id}</p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[12px] mb-2">Customer Name</p>
              <p className="text-[#000] font-[14px]">
                {customer?.customerName}
              </p>
            </div>
            <div className="mb-2 flex justify-between border-b">
              <p className="text-[#6e7c91] font-[12px] mb-2">Phone Number</p>
              <p className="text-[#000] font-[14px]">
                {customer?.customerPhoneNumber}
              </p>
            </div>
            <div className="mb-2 flex justify-between  flex-wrap">
              <p className="text-[#6e7c91] font-[12px]">Location</p>
              <p className="text-[#000] font-[14px] ">
                {customer?.address}
              </p>
            </div>
          </div>
          <div className="p-3  bg-[#FFFBF4] mt-3">
            <div className="flex items-center justify-between mb-2  gap-2">
           <div className="flex  items-center gap-3">
           <p className="text-[#000] font-[500]    text-[14px]">
                Ongoing Orders
              </p>
             
              <div className="bar-spinner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
           </div>


              <span className="bg-[#F6B44F] px-[15px] py-[5px] font-bold">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Total"
                  )?.count
                }
              </span>
            </div>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Total:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Total"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Approved:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
                {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Approved"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Cancel:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
                {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Cancel"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Pending:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Pending"
                  )?.count
                }
              </span>
            </p>
            <p className="text-[12px] flex justify-between font-[500] text-[#000] mb-3">
              Store:{" "}
              <span className="inline-block bg-[#ececec] px-2 ml-2 ">
              {
                  orderCount?.find(
                    (ft: any) => ft?.label === "Store"
                  )?.count
                }
              </span>
            </p>
            {(customer?.orders?.length>5?customer?.orders?.slice(0,5):customer?.orders)?.map((abc: any, i: any) => (
              <div className="bg-white py-3 mb-2" key={i}>
                <div className="flex justify-between">
                  <p className="color_primary font-semibold">
                    {abc?.orderNumber}
                  </p>
                  <p className="bg-[#FFFBF4] px-[15px] py-1 text-[#7a5927] font-semibold ">
                    {abc?.orderStatus?.name}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-[600] text-[#242529] text-[12px]">
                    BDT:{" "}
                    {abc?.order_info
                      ?.reduce((a: any, b: any) => a + b.subTotal, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-[#7d7d7d] font-[500] text-[12px] pr-[15px]">
                    {moment(abc?.created_at).format("MMM D, YYYY, h:mm A")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        

        </div>
      )}

      {/* create customer drawer  */}
      <GbDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        title={"Add customer"}
      >
        <GbForm
          resolver={yupResolver(createCustomerSchema)}
          submitHandler={formSubmit}
          defaultValues={{
            customerPhoneNumber: searchTerm,
          }}
        >
          <CreateCustomerDrawar />
        </GbForm>
      </GbDrawer>
    </div>
  );
};

export default CreateCustomer;
