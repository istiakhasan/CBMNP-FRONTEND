/* eslint-disable @next/next/no-img-element */
import { message } from "antd";
import React, { useState } from "react";
import GbForm from "@/components/forms/GbForm";

import { getUserInfo } from "@/service/authService";
import { useCreateOrderMutation, useUpdateOrderMutation } from "@/redux/api/orderApi";
import moment from "moment";
import ReceiverInfoFormEdit from "./ReceiverInfoFormEdit";
import OparationainfoFormEdit from "./OparationainfoFormEdit";

const OrderCartEdit = ({
  setCart,
  cart,
  customer,
  setOrderSuccessResponse,
  setOrderSuccessModal,
  orderData
}: any) => {
  const [active, setActive] = useState(1);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [formData, setFormData] = useState({});
  const userInfo: any = getUserInfo();
  const [handleUpdateOrder] = useUpdateOrderMutation();
  const handleFormSubmit = async (stepFormData: any, reset: any) => {
    setFormData((prev) => ({ ...prev, ...stepFormData }));
    if (active === 3) {
      const finalData = { ...formData, ...stepFormData };

      const commonEntity: any = {
        // customer info or sender info
        customerId: customer?.customer_Id,//exist
        // receiver info
        receiverName: finalData?.receiverName,//exist
        receiverPhoneNumber: finalData?.receiverPhoneNumber,//exist
        // receiverAdditionalPhoneNumber: finalData?.receiverAdditionalPhoneNumber,
        receiverDivision: finalData?.shippingAddressDivision?.label,//exist
        receiverDistrict: finalData?.shippingAddressDistrict?.label,//exist
        receiverThana: finalData?.shippingAddressThana?.label,//exist
        receiverAddress: finalData?.shippingAddressTextArea,//exist
        deliveryDate: finalData.deliveryDate,//exist
        totalPaidAmount: orderData.totalPaidAmount,//exist
        //  operational information
        orderSource: finalData?.orderSource?.label,//exist
        currier: finalData?.currier?.value,//exist
        shippingCharge: finalData?.shippingCharge?.value,//exist
        shippingType: finalData?.shippingType?.label,//exist
        orderType: finalData?.orderType?.label,///exist
        agentId: userInfo?.userId,//exist
        deliveryNote: finalData?.deliveryNote,//exist
        comments: finalData?.comments,
        // products
        products: cart?.map((item: any) => {
          return {
            productId: item?.id,
            productQuantity: item?.productQuantity,
          };
        }),  //exist
      };
 
      const res: any = await handleUpdateOrder({data:commonEntity,id:orderData?.id}).unwrap();
      if (res) {
        setCart([]);
        // setCustomer({});
        setOrderSuccessModal(true);
        setOrderSuccessResponse(res);
        setActive(1);
        setFormData({});
        return message.success("Order placed successfully...");
      }
    }
    setActive((prev) => prev + 1);
    // reset();
  };
  if (cart?.length < 1) {
    return (
      <div
        style={{ boxShadow: "-12px 0 16px -11px rgba(0, 0, 0, 0.1)" }}
        className="h-[85vh] flex-1 col-span-2 flex items-center justify-center"
      >
        <h1>No product in cart</h1>
      </div>
    );
  }

  const defaultvalue = {
    receiverName:
      customer?.customerType === "NON_PROBASHI" ? customer?.customerName : "",
    customerType: customer?.customerType,
    sameAsBilling: sameAsBilling,
    receiverPhoneNumber:
      customer?.customerType === "NON_PROBASHI"
        ? customer?.customerPhoneNumber
        : "",
    receiverAdditionalPhoneNumber:
      customer?.customerType === "NON_PROBASHI"
        ? customer?.customerAdditionalPhoneNumber
        : "",
    ...(customer?.division && {
      shippingAddressDivision: {
        label: customer?.division,
        value: customer?.division,
      },
    }),
    ...(customer?.district && {
      shippingAddressDistrict: {
        label: customer?.district,
        value: customer?.district,
      },
    }),
    ...(customer?.thana && {
      shippingAddressThana: {
        label: customer?.thana,
        value: customer?.thana,
      },
    }),
    ...(customer?.address && {
      shippingAddressTextArea:
        customer?.customerType === "NON_PROBASHI" ? customer?.address : "",
    }),
  };
  const notSameAsBilling = {
    customerType: customer?.customerType,
    sameAsBilling: sameAsBilling,
    receiverName: null,
    receiverPhoneNumber: null,
    receiverAdditionalPhoneNumber: null,
    shippingAddressDivision: null,
    shippingAddressDistrict: null,
    shippingAddressThana: null,
    shippingAddressTextArea: null,
  };
  return (
    <>
      <div
        style={{ boxShadow: "-12px 0 16px -11px rgba(0, 0, 0, 0.1)" }}
        className="flex-1  h-[86vh] overflow-y-scroll custom_scroll"
      >
        {active === 1 && (
          <GbForm submitHandler={handleFormSubmit}>
            {" "}
            <h1 className="text-2xl  text-primary mb-3 sticky pt-10 top-0 bg-[#FFFFFF] pb-3 px-[20px]">
              Cart ({cart?.length})
            </h1>
            <div className="pb-5 min-h-[80vh] px-[20px]">
              {cart?.map((item: any, i: any) => (
                <div key={i} className="gb_border p-[10px] mb-2">
                  <div className="flex items-center gap-2 ">
                    <img
                      className="w-[70px] h-[70px] gb_border p-[2px] object-cover"
                      src={`${item?.images[0]?.url}`}
                      alt=""
                    />
                    <div>
                      <p className=" text-gray-600 text-[14px]">
                        {item?.productNameEn}{" "}
                      </p>
                      <p className=" font-semibold text-[14px]">
                        BDT: {(+item?.salePrice || 0)?.toFixed(2)}
                      </p>
                      <span className="text-[12px] gb_border bg-[white] px-[15px] py-[4px]  inline-block">
                        Pack Size: {item?.weight} {item?.unit}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ padding: "14px" }}
                    className="floating-label-input py-4 flex justify-between mt-5"
                  >
                    <div>
                      <label
                        htmlFor="customerSearch"
                        className="text-[#999] text-[12px]"
                      >
                        Price
                      </label>

                      <p>
                        BDT{" "}
                        {(item?.salePrice * item?.productQuantity)?.toFixed(2)}
                      </p>
                    </div>

                    <div className="border border-[#4F8A6D] h-fit">
                      <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.id === item?.id
                          );
                          const newQuantity = findProduct?.productQuantity - 1;
                          if (newQuantity < 1) {
                            const filterProduct = cart?.filter(
                              (fp: any) => item?.id !== fp?.id
                            );
                            setCart(filterProduct);
                            return;
                          }
                          findProduct.productQuantity = newQuantity;
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
                            (j: any) => j.id === item?.id
                          );
                          const newQuantity = findProduct?.productQuantity + 1;
                          if (item?.stockQuantity < newQuantity) {
                            return message.error("Not enough product in stock");
                          }
                          if (newQuantity > item?.inventories?.stock) {
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
                          const filterItem = cart?.filter(
                            (cp: any) => cp?.id !== item?.id
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
            <div className="bg-[#FFFFFF] border-t-[1px] h-[150px] sticky bottom-0 pt-[20px]">
              <div className="p-5 bg-[#E8F0F2] font-bold text-[16px] text-end mt-[20px] pr-[30px]">
                Total:
                {cart
                  ?.reduce(
                    (acc: any, b: any) =>
                      acc + +b.salePrice * b?.productQuantity,
                    0
                  )
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
                      : "bg-[#4F8A6D]"
                  } text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[5px]`}
                >
                  Next
                </button>
              </div>
            </div>
          </GbForm>
        )}
        {active === 2 && (
          <GbForm
            // resolver={yupResolver(receiverFormSchema)}
            defaultValues={sameAsBilling ? defaultvalue : notSameAsBilling}
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
            // mode={"onChange"}
            defaultValues={{
              deliveryDate:orderData?.deliveryDate? moment(orderData?.deliveryDate).format("YYYY-MM-DD"):null,
              orderSource:{
                label:orderData?.orderSource,
                value:orderData?.orderSource,
              },
             ...(orderData?.orderType && { orderType:{
                label:orderData?.orderType,
                value:orderData?.orderType,
              }}),
             ...(orderData?.shippingType && { shippingType:{
                label:orderData?.shippingType,
                value:orderData?.shippingType,
              }}),
              shippingCharge:{
                label:orderData?.shippingCharge,
                value:orderData?.shippingCharge,
              },
             ...(orderData?.currier && { currier:{
                label:orderData?.partner?.partnerName,
                value:orderData?.partner?.id,
              }}),
             ...(orderData?.last_transaction?.totalPaidAmount && { paidAmount:orderData?.last_transaction?.totalPaidAmount}),
              orderRemark:orderData?.orderRemark
              
            }}
            // resolver={yupResolver(operationalSchema)}
            submitHandler={handleFormSubmit}
          >
            <OparationainfoFormEdit setActive={setActive} cart={cart} />
          </GbForm>
        )}
      </div>
    </>
  );
};

export default OrderCartEdit;
