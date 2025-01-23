import GbFormCheckbox from "@/components/forms/GbCheckbox";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormInputV2 from "@/components/forms/GbFormInputV2";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormSelectV2 from "@/components/forms/GbFormSelectV2";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import GbFormTextAreav2 from "@/components/forms/GbFormTextAreaV2";
import React from "react";
import { useFormContext } from "react-hook-form";

const OparationainfoFormEdit = ({ setActive, cart,isLoading }: any) => {
  const {
    watch,
    setValue,
    formState: { isValid },
  } = useFormContext();


  const deliveryCharge:number = Number(watch()?.deliveryCharge?.value) || 0;
const cartTotal:number = cart?.reduce((acc: number, item: any) => acc + (item.subTotal || 0), 0) || 0;
const paidAmount:number = Number(watch()?.paidAmount) || 0;
const totalAmount:number=(cartTotal+deliveryCharge)-paidAmount
  return (
    <div>
      {" "}
      <div className=" sticky top-0 bg-white z-50  font-semibold pt-10 px-[20px]">
        <h1 className="text-2xl  text-primary mb-3  bg-light pb-3 font-semibold">
          Operational information
        </h1>
      </div>
      <div>
        <div className="px-[20px]">
          <div className="min-h-[70vh]">
            <div className="mb-4">
              <GbFormSelectV2
                options={[
                  {
                    label: "Facebook",
                    value: "Facebook",
                  },
                  {
                    label: "Whats App",
                    value: "Whats App",
                  },
                  {
                    label: "In comming call",
                    value: "In comming call",
                  },
                  {
                    label: "Telesales",
                    value: "Telesales",
                  },
                ]}
                name="orderFrom"
                label="Order source"
              />
            </div>
            <div className="mb-4">
              <GbFormSelectV2
                options={[
                  {
                    label: "Regular",
                    value: "Regular",
                  },
                  {
                    label: "Pre Order",
                    value: "Pre Order",
                  },
                  {
                    label: "Exchange",
                    value: "Exchange",
                  },
                  {
                    label: "Re-book",
                    value: "Re-book",
                  },
                ]}
                name="orderType"
                label="Order type"
              />
            </div>
            {watch().orderType?.value === "Exchange" && (
              <div className="mb-4">
                <GbFormInputV2
                  label="Enter Pre-Order number"
                  name="preOrderNumber"
                />
              </div>
            )}
            <div className="mb-4">
              <GbFormSelectV2
                name="deliveryType"
                options={[
                  {
                    label: "Regular",
                    value: "Regular",
                  },
                  {
                    label: "Express",
                    value: "Express",
                  },
                  // {
                  //   label:"Free",
                  //   value:"Free",
                  // },
                ]}
                label="Shipping type"
                handleChange={(v: any) => {
                  if (v?.value === "Free") {
                    setValue("deliveryCharge", {
                      label: "Free",
                      value: "0",
                    });
                  }
                  if (v?.value === "Express") {
                    setValue("deliveryCharge", {
                      label: "100",
                      value: "100",
                    });
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <GbFormSelectV2
                options={[
                  {
                    label: "130",
                    value: "130",
                  },
                  {
                    label: "70",
                    value: "70",
                  },
                  {
                    label: "Free",
                    value: "0",
                  },
                ]}
                disabled={
                  (watch()?.deliveryType?.value === "Free" || watch()?.deliveryType?.value === "Express") ? true : false
                }
                handleChange={(v:any)=>{
                  if(watch()?.paymentStatus?.value==="Paid"){
                    setValue('paidAmount',cartTotal+ +v.value)
                  }

                }}
                name="deliveryCharge"
                label="Shipping charge"
              />
            </div>
            <div className="mb-4">
              <GbFormInputV2
                type="date"
                name="deliveryDate"
                label="Delivery Date"
              />
            </div>
            <div className="mb-4">
              <GbFormSelectV2
                name="currier"
                label="Shipping Method"
                options={[
                  {
                    label: "SteadFast",
                    value: "SteadFast",
                  },
                  // {
                  //   label: "eCurior",
                  //   value: "eCurior",
                  // },
                ]}
              />
            </div>
            {/* <div className="mb-4">
              <GbFormSelectV2
                name="paymentStatus"
                options={[
                  {
                    label: "Pending",
                    value: "Pending",
                  },
                  {
                    label: "Paid",
                    value: "Paid",
                  },
                  {
                    label: "Partial",
                    value: "Partial",
                  },
                ]}
                handleChange={(v: any) => {
                  setValue("paymentMethods", null);
                  if (v?.value === "Pending") {
                    setValue("paymentMethods", {
                      label: "COD",
                      value: "COD",
                    });

                    setValue("paidAmount",0);
                  }
                  if (v?.value === "Paid") {
                    setValue("paidAmount",cartTotal+deliveryCharge);
                  }
                }}
                label="Payment Status"
              />
            </div> */}
            {/* <div className="mb-4">
              <GbFormSelectV2
                disabled={
                  watch()?.paymentStatus?.value === "Pending" ? true : false
                }
                name="paymentMethods"
                options={[
                  ...(watch()?.paymentStatus?.value === "Pending"
                    ? [
                        {
                          label: "COD",
                          value: "COD",
                        },
                      ]
                    : []),
                  {
                    label: "Bkash Personal",
                    value: "Bkash Personal",
                  },
                  {
                    label: "Bkash Agent",
                    value: "Bkash Agent",
                  },
                  {
                    label: "Bkash Merchant",
                    value: "Bkash Merchant",
                  },
                  {
                    label: "Bkash GB-Agent",
                    value: "Bkash GB-Agent",
                  },
                  {
                    label: "Nagad(nur)",
                    value: "Nagad(nur)",
                  },
                  {
                    label: "Bank Payment",
                    value: "Bank Payment",
                  },
                ]}
                label="Payment method"
              />
            </div> */}
            {/* {watch()?.paymentStatus?.value === "Partial" && (
              <div className="mb-4">
                <GbFormInputV2 name="paidAmount" label="Amount" />
              </div>
            )}
            {(watch()?.paymentStatus?.value === "Paid" ||
              watch()?.paymentStatus?.value === "Partial") && (
              <div className="mb-4">
                <GbFormInputV2 name="transactionId" label="TrxID" />
              </div>
            )} */}
            <div className="col-span-4 mb-4">
              <GbFormTextAreav2 name="orderRemark" label="Delivery Note" rows={3} />
            </div>
            {/* <div className="col-span-4 mb-4">
              <GbFormCheckbox name="isHold" label="Hold"  />
            </div> */}
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF]  sticky bottom-0 border-t py-[5px]">
        <div className="px-[20px] my-5">
          <p className="flex justify-between text-[14px] text-[#00171d] mb-3">
            <span>Subtotal:</span>
            <span>
              {" "}
              {cart
                ?.reduce((acc: any, b: any) => acc + b.subTotal, 0)
                .toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-[14px] text-[#00171d] mb-3">
            <span>Discount:</span>
            <span>0.00</span>
          </p>
          <p className="flex justify-between text-[14px] text-[#00171d] mb-3">
            <span>Delivery Fee:</span>
            <span>
              {(watch()?.deliveryCharge?.value ? (+watch()?.deliveryCharge?.value).toFixed(2):"0.00")}
            </span>
          </p>
          <p className="flex justify-between text-[14px] text-[#00171d] mb-3">
            <span>Advance Payment:</span>
            <span>{watch()?.paidAmount || 0.00}</span>
          </p>
          <p className="flex justify-between text-[14px] text-[#00171d] mb-3 border-t border-b py-4">
            <strong>Total:</strong>
            <strong> {totalAmount}</strong>
          </p>
        </div>
        <div className="flex justify-end items-end  h-full gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActive(2)}
            className="border-1 text-[#278ea5] border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[12px]"
          >
            Back
          </button>
          <button
            disabled={isLoading}
            // onClick={() => setActive(3)}
            className={` ${
              isValid ? "bg-[#278ea5]" : "bg-[#CACACA]"
            } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[12px]`}
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OparationainfoFormEdit;
