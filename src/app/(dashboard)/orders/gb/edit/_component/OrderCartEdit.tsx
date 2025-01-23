/* eslint-disable @next/next/no-img-element */
import { message } from "antd";
import React, { useState } from "react";
import { getBaseUrl } from "@/helpers/config/envConfig";
import GbForm from "@/components/forms/GbForm";
import OparationainfoFormEdit from "./OparationainfoFormEdit";
import ReceiverInfoFormEdit from "./ReceiverInfoFormEdit";
import { yupResolver } from "@hookform/resolvers/yup";
import { operationalSchemaUpdate, receiverFormSchema } from "@/schema/schema";
import { getUserInfo } from "@/service/authService";
import { useApprovedOrderMutation, useCreateOrderMutation } from "@/redux/api/orderApi";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";


const OrderCartEdit = ({
  setCart,
  cart,
  customer,
  orderData
}: any) => {
  const [fromLoading,setFromLoading]=useState(false)
  const params=useSearchParams()
  const isApproved=params.get('isApprove')
  const router=useRouter()
  const [active, setActive] = useState(1);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [formData, setFormData] = useState({});
  const userInfo: any = getUserInfo();
  const [handleOrderEdit,{isLoading}] = useApprovedOrderMutation();
  const handleFormSubmit = async (stepFormData: any, reset: any) => {
    setFormData((prev) => ({ ...prev, ...stepFormData }));
    if (active === 3) {
      setFromLoading(true)
      const finalData = { ...formData, ...stepFormData };
      const commonEntity:any = {
        orderFrom: finalData?.orderFrom?.label,
        currier: finalData?.currier?.label,
        deliveryCharge: finalData?.deliveryCharge?.value,
        deliveryType: finalData?.deliveryType?.label,
        orderType: finalData?.orderType?.label,
        paymentStatus: finalData?.paymentStatus?.label,
        employeeId: userInfo?.employeeId,
        agentId: userInfo?.employeeId,
        orderRemark: finalData?.orderRemark,
        paidAmount: finalData?.paidAmount || 0,
        transactionId: finalData?.transactionId || "",
        paymentMethods: finalData["paymentMethods"]?.value,
        // customer info or sender info
        customerName: customer?.customerName,
        customerPhoneNumber: customer?.customerPhoneNumber,
        customerAdditionalNumber: customer?.customerAdditionalNumber,
        customer_Id: customer?.customer_Id,
        // receiver info
        receiverName: finalData?.receiverName,
        receiverPhoneNumber: finalData?.receiverPhoneNumber,
        receiverAdditionalPhoneNumber: finalData?.receiverAdditionalPhoneNumber,
        shippingAddressDivision: finalData?.shippingAddressDivision?.label,
        shippingAddressDistrict: finalData?.shippingAddressDistrict?.label,
        shippingAddressThana: finalData?.shippingAddressThana?.label,
        shippingAddressTextArea: finalData?.shippingAddressTextArea,
        deliveryDate:finalData.deliveryDate, 
        isAction:true,
        // products
        orderDetails: cart,
      };

      if(!!isApproved){
        commonEntity["orderStatusValue"] = 2;
        commonEntity["orderStatus"] = {
          name: "Approved",
          value: "2",
        };
      }
      const res: any = await handleOrderEdit({
        data:commonEntity,
        id:orderData?.id
      }).unwrap();
      if (res) {
        router.push(`/orders/gb/${orderData?.id}`)
        return message.success("Order update successfully...");
      }
    }
    setActive((prev) => prev + 1);
    reset();
  };
  if (cart?.length < 1) {
    return (
      <div className="h-[85vh] flex-1 col-span-2 flex items-center justify-center">
        <h1>No product in cart</h1>
      </div>
    );
  }


  return (
    <>
      <div
        style={{ boxShadow: "-12px 0 16px -11px rgba(0, 0, 0, 0.1)" }}

        className="flex-1  md:h-[90vh] overflow-y-scroll custom_scroll"
      >
        {active === 1 && (
          <GbForm submitHandler={handleFormSubmit}>
            {" "}
            <h1 className="text-2xl  text-primary mb-3 sticky pt-10 top-0 bg-[#FFFFFF] pb-3 px-[20px]">
              Cart ({cart?.length})
            </h1>
            <div className="pb-5 md:min-h-[80vh] px-[20px]">
              {cart?.map((item: any, i: any) => (
                <div key={i} className="gb_border p-[10px] mb-2">
                  <div className="flex items-center gap-2 ">
                    <img
                      className="w-[70px] h-[70px] gb_border p-[2px] object-cover"
                      src={`${getBaseUrl()}/${item?.image}`}
                      alt=""
                    />
                    <div>
                      <p className=" text-gray-600 text-[14px]">
                        {item?.productNameEn}{" "}
                      </p>
                      <p className=" font-semibold text-[14px]">
                        BDT: {item?.current_prices?.toFixed(2)}
                        {Number(item?.discount_amount)>0 && <del className="ml-2 text-[#9e9e9e]">{item?.regular_prices?.toFixed(2) || "0.00"}</del>}
                      </p>
                      <span className="text-[12px] gb_border bg-[white] px-[15px] py-[4px]  inline-block">
                        Pack Size: {item?.productWeight}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ padding: "14px" }}
                    className="floating-label-input py-4 flex flex-wrap justify-between mt-5"
                  >
                    <div>
                      <label
                        htmlFor="customerSearch"
                        className="text-[#999] text-[12px]"
                      >
                        Price
                      </label>

                      <p>BDT {item?.subTotal?.toFixed(2)}</p>
                    </div>

                    <div className="border border-[#278EA5] h-fit">
                    <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.productId === item?.productId
                          );
                          const newQuantity = findProduct?.productQuantity - 1;
                          if (newQuantity < 1) {
                            const filterProduct=cart?.filter((fp:any)=>item?.productId !==fp?.productId)
                            setCart(filterProduct)
                            return
                          }
                          findProduct.productQuantity = newQuantity;
                          (findProduct.subTotal =
                            findProduct.current_prices * newQuantity),
                            setCart(_data);
                        }}
                        className="inline-block px-3  bg-primary text-white cursor-pointer py-[4px] gb_border"
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className="ri-subtract-fill"
                        ></i>
                      </span>
                      
                      <span className="inline-block px-[20px]  cursor-pointer  border-t-[#f0f0f0]  text-[18px]  py-[4px] ">
                        {item?.productQuantity}
                      </span>
                      <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.productId === item?.productId
                          );
                          const newQuantity = findProduct?.productQuantity + 1;
                          if(item?.stockQuantity<newQuantity){
                            return message.error('Not enough product in stock')
                          }
                          if (newQuantity > item?.inventory?.productQuantity) {
                            return message.error(
                              "Stock is not enough for the ordered amount of products"
                            );
                          }
                          if (newQuantity < 1) {
                            return message.error(
                              "Quantity should not be zero "
                            );
                          }
                          findProduct.productQuantity = newQuantity;
                          (findProduct.subTotal =
                            findProduct.current_prices * newQuantity),
                            setCart(_data);
                        }}
                        className="inline-block px-3 bg-primary text-white  cursor-pointer py-[4px] gb_border"
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className="ri-add-fill"
                        ></i>
                      </span>

                      <span
                        onClick={() => {
                          const filterItem = cart.filter(
                            (cp: any) => cp?.productId !== item?.productId
                          );
                          setCart(filterItem);
                        }}
                        className="px-3 py-[4px] bg-white inline-block ml-3 cursor-pointer"
                      >
                        <i className="ri-delete-bin-5-line text-[#F44336] text-[18px]"></i>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4"></div>
                </div>
              ))}
            </div>
            <div className="bg-[#FFFFFF] border-t-[1px]  sticky bottom-0 pt-[20px]">
              <div className="p-5 bg-[#E8F0F2] font-bold text-[16px] text-end mt-[20px] pr-[30px]">
                Total:
                {cart
                  ?.reduce((acc: any, b: any) => acc + b.subTotal, 0)
                  .toFixed(2)}
              </div>
              <div className="flex justify-end my-5">
                <button
                  disabled={
                    cart?.length < 1 || Object.values(customer).length < 1
                  }
                  type="submit"
                  className={` ${
                    cart?.length < 1 || Object.values(customer).length < 1
                      ? "bg-gray-400"
                      : "bg-[#278ea5]"
                  } text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[12px]`}
                >
                  Next
                </button>
              </div>
            </div>
          </GbForm>
        )}
        {active === 2 && (
          <GbForm
            resolver={yupResolver(receiverFormSchema)}
            // defaultValues={sameAsBilling ? defaultvalue : notSameAsBilling}
            defaultValues={{
              receiverName:orderData?.receiverName,
              receiverPhoneNumber:orderData?.receiverPhoneNumber,
              receiverAdditionalPhoneNumber:orderData?.receiverAdditionalPhoneNumber,
              ...(orderData?.shippingAddressDivision && {shippingAddressDivision: {
                label:orderData?.shippingAddressDivision,
                value:orderData?.shippingAddressDivision,
              }}),
              ...(orderData?.shippingAddressDistrict && {shippingAddressDistrict:{
                label:orderData?.shippingAddressDistrict,
                value:orderData?.shippingAddressDistrict,
              }}),
              ...(orderData?.shippingAddressThana&& {shippingAddressThana:{
                label:orderData?.shippingAddressThana,
                value:orderData?.shippingAddressThana,
            }}),
              shippingAddressTextArea:orderData?.shippingAddressTextArea,
              customerType:customer?.customerType,

            }}
            submitHandler={handleFormSubmit}
          >
            <ReceiverInfoFormEdit
              setActive={setActive}
              formData={formData}
              setFormData={setFormData}
              setSameAsBilling={setSameAsBilling}
            />
          </GbForm>
        )}
        {active === 3 && (
          <GbForm
            mode={"onChange"}
            defaultValues={{
              deliveryDate: moment(orderData?.deliveryDate?orderData?.deliveryDate:new Date()).format("YYYY-MM-DD"),
              orderFrom:{
                label:orderData?.orderFrom,
                value:orderData?.orderFrom,
              },
             ...(orderData?.orderType && { orderType:{
                label:orderData?.orderType,
                value:orderData?.orderType,
              }}),
             ...(orderData?.deliveryType && { deliveryType:{
                label:orderData?.deliveryType,
                value:orderData?.deliveryType,
              }}),
              deliveryCharge:{
                label:orderData?.deliveryCharge,
                value:orderData?.deliveryCharge,
              },
             ...(orderData?.currier && { currier:{
                label:orderData?.currier,
                value:orderData?.currier,
              }}),
             ...(orderData?.last_transaction?.totalPaidAmount && { paidAmount:orderData?.last_transaction?.totalPaidAmount}),
              // paymentStatus:{
              //   label:orderData?.paymentStatus,
              //   value:orderData?.paymentStatus,
              // },
              // paymentMethods:{
              //   label:orderData?.last_transaction?.paymentMethods,
              //   value:orderData?.last_transaction?.paymentMethods
              // },
              orderRemark:orderData?.orderRemark
              
            }}
            resolver={yupResolver(operationalSchemaUpdate)}
            submitHandler={handleFormSubmit}
          >
            <OparationainfoFormEdit setActive={setActive} isLoading={fromLoading}  cart={cart}/>
          </GbForm>
        )}
      </div>
    </>
  );
};

export default OrderCartEdit;
