import GbForm from "@/components/forms/GbForm";
import {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
  useGetOrderByCustomerIdQuery,
  useUpdateCustomerByIdMutation,
} from "@/redux/api/customerApi";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import CreateCustomerDrawar from "./CreateCustomerDrawar";
import { Input, message, Spin } from "antd";
import { createCustomerSchema } from "@/schema/schema";
import GbDrawer from "@/components/ui/GbDrawer";
import moment from "moment";
import EditCustomerDrawar from "../../../create-order/_component/EditCustomerDrawar";

const CreateCustomerEdit = ({ setCustomer, customer }: any) => {
  const {data:orderCount} =  useGetOrderByCustomerIdQuery({
    id: customer?.customer_Id,
  })
  const [isFocus, setIsFocus] = useState(false);
   const [editCustomerdrawar, setEditCustomerdrawar] = useState(false);
 const [handleUpdateCustomer,{ isLoading:updateLoading }] = useUpdateCustomerByIdMutation();
  const containerRef: any = useRef(null);

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

  // updatge customer handler
    const updateCustomerHandler = async (data: any, reset: any) => {
      try {
        const payload = { ...data };
        payload["customerType"] = data?.customerType?.value;
        payload["district"] = data?.district?.label;
        payload["division"] = data?.division?.label;
        payload["thana"] = data?.thana?.label;
        if (!!data?.country) {
          payload["country"] = data?.country?.value;
        }
        const res = await handleUpdateCustomer({data:payload,id:customer?.customer_Id}).unwrap();
        if (res?.success === true) {
          setCustomer(res?.data);
          message.success("Customer Update successfully");
          setEditCustomerdrawar(false);
          reset();
        }
      } catch (error: any) {
        if (error?.data?.errorMessages?.length > 0) {
          error?.data?.errorMessages?.forEach((item: any) => {
            message.error(item?.message);
          });
        }
        reset();
      }
    };
  console.log(orderCount,"order count");
  return (
    <div className="w-[400px] h-[90vh] overflow-x-auto  pr-[16px] border-r  custom_scroll">
      
       {Object.values(customer).length > 1 && (
              <div className="">
                <div className="gb_border  mt-3 p-3">
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-white py-[3px] w-fit text-[10px] px-[15px] bg-primary">
                      {customer?.customerType}
                    </p>
                    <span
                      onClick={() => setEditCustomerdrawar(true)}
                      className="flex items-center font-semibold text-[#278EA5] hover:[#278EA5] cursor-pointer"
                    >
                      <i className="ri-ball-pen-line mr-1"></i>Edit
                    </span>
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
                    <p className="text-[#000] font-[14px] ">{customer?.address}</p>
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
                      {orderCount?.data?.totalCount || "0"}
                    </span>
                  </div>
      
                  {orderCount?.data?.statusCounts?.map((os: any, i: any) => (
                    <p
                      key={i}
                      className="text-[12px] flex justify-between font-[500] text-[#000] mb-3"
                    >
                      {os?.label}:{" "}
                      <span className="inline-block bg-[#ececec] px-2 ml-2 ">
                        {os?.count}
                      </span>
                    </p>
                  ))}
      
                  {orderCount?.data?.lastOrders?.map((abc: any, i: any) => (
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


      {/* Edit customer drawer  */}
      <GbDrawer
        open={editCustomerdrawar}
        setOpen={setEditCustomerdrawar}
        title={"Update customer"}
      >
        <GbForm
          resolver={yupResolver(createCustomerSchema)}
          submitHandler={updateCustomerHandler}
          defaultValues={{
            ...customer,
            customerType:{
              label:customer?.customerType,
              value:customer?.customerType,
            },
            division:{
              label:customer?.division,
              value:customer?.division,
            },
            district:{
              label:customer?.district,
              value:customer?.district,
            },
            thana:{
              label:customer?.thana,
              value:customer?.thana,
            },
            country:{
              label:customer?.country,
              value:customer?.country,
            },
          }}
        >
           {
            updateLoading?<div className="flex items-center justify-center h-[80vh]">
              <Spin />
            </div>: <EditCustomerDrawar />
           }
         
        </GbForm>
      </GbDrawer>
    </div>
  );
};

export default CreateCustomerEdit;
