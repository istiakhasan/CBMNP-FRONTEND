/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useEffect, useMemo, useState } from "react";
import GbModal from "@/components/ui/GbModal";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import OrderCartEdit from "./_component/OrderCartEdit";
import LoadProductsEdit from "./_component/LoadProductsEdit";
import CreateCustomerEdit from "./_component/CreateCustomerEdit";
import { useSearchParams } from "next/navigation";
import { useGetAllCustomersQuery, useGetCustomerByIdQuery } from "@/redux/api/customerApi";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";

const Page = () => {
  const params = useSearchParams();
  const editAbleCustomerId = params.get("customerId");
  const editAbleOrderId = params.get("orderId");
  const { data, isLoading } = useGetOrderByIdQuery({
    id: editAbleOrderId,
  });
  const {data:customer,isLoading:customerLoading}=useGetCustomerByIdQuery({
    id:editAbleCustomerId
  })
  const [cart, setCart] = useState([]);
  const [orderSuccessResponse, setOrderSuccessResponse] = useState<any>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  useMemo(()=>{
    if(data?.products){
      setCart(data?.products?.map((item:any)=>{
        return {
          ...item?.product,
          productQuantity:item?.productQuantity
        }
      }))
    }
  },[data])
  if (isLoading || customerLoading) {
    return;
  }

  return (
    <div>
      <GbHeader  title="Edit order" />

      <div className=" ">
        <div className="flex gap-6  px-[16px] ">
          <CreateCustomerEdit customer={customer?.data} />
          {/* Load products or products */}
          <LoadProductsEdit cart={cart} setCart={setCart} />
          <OrderCartEdit
            setOrderSuccessModal={setOrderSuccessModal}
            setOrderSuccessResponse={setOrderSuccessResponse}
            cart={cart}
            setCart={setCart}
            customer={customer?.data}
            // setCustomer={setCustomer}
            orderData={data}
          />
        </div>
      </div>
      {/* </GbForm> */}

      {/* order success modal */}
      <GbModal
        width="500px"
        isModalOpen={orderSuccessModal}
        openModal={() => setOrderSuccessModal(true)}
        closeModal={() => setOrderSuccessModal(false)}
        clseTab={false}
        cls="custom_ant_modal"
        centered
      >
        <div className="p-[20px] ">
          <div className="flex justify-end">
            <span
              className="cursor-pointer"
              onClick={() => {
                setOrderSuccessResponse(null);
                setOrderSuccessModal(false);
              }}
            >
              <i className="ri-close-large-fill"></i>
            </span>
          </div>
          <h1 className="text-[28px]  color_primary text-center font-bold">
            Order Create Successfully
          </h1>
          <h1 className="text-center text-[16px]">
            {orderSuccessResponse?.order?.orderNumber}{" "}
            <i
              onClick={() =>
                copyToClipboard(orderSuccessResponse?.order?.orderNumber)
              }
              className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px]"
            ></i>
          </h1>
        </div>
      </GbModal>
    </div>
  );
};

export default Page;
