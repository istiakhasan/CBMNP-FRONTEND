/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useEffect, useState } from "react";
import GbModal from "@/components/ui/GbModal";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import OrderCartEdit from "./_component/OrderCartEdit";
import LoadProductsEdit from "./_component/LoadProductsEdit";
import CreateCustomerEdit from "./_component/CreateCustomerEdit";
import { useSearchParams } from "next/navigation";
import { useGetAllCustomersQuery } from "@/redux/api/customerApi";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";

const Page = () => {
  const params = useSearchParams();
  const editAbleOrderId = params.get("orderId");
  const editAbleCustomerId = params.get("customerId");
  const { data, isLoading } = useGetOrderByIdQuery({
    id: editAbleOrderId,
  });
  const { data: customerData, isLoading: customerDataLoading } =
    useGetAllCustomersQuery({
      searchTerm: editAbleCustomerId,
    });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState<any>({});
  const [orderSuccessResponse, setOrderSuccessResponse] = useState<any>(null);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  useEffect(() => {
    if (customerData?.data?.data?.length > 0) {
      setCustomer(customerData?.data?.data[0]);
      setCart(data?.order_info?.map(({productId,product,singleProductPrices,productNameEn,productQuantity,subTotal,isCancel}:any)=>{
        return {
           productId,
          //  singleProductPrices,
           singleProductPrices:product?.current_prices,
           productNameEn,
           productQuantity,
           subTotal,
           isCancel,
           current_prices:product?.current_prices,
           image:product?.product_image,
        }
      }))
    }
  }, [editAbleCustomerId, customerData,data?.order_info]);
  if (isLoading) {
    return;
  }

  return (
    <div>
      <GbHeader className={"mb-0"} title="Edit order" />

      <div className=" ">
        <div className="flex gap-6 bg-[#FFFFFF] px-[16px] ">
          {/* Create customer */}
          <CreateCustomerEdit customer={customer} setCustomer={setCustomer} />
          {/* Load products or products */}
          <LoadProductsEdit cart={cart} setCart={setCart} />
          <OrderCartEdit
            setOrderSuccessModal={setOrderSuccessModal}
            setOrderSuccessResponse={setOrderSuccessResponse}
            cart={cart}
            setCart={setCart}
            customer={customer}
            setCustomer={setCustomer}
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
