/* eslint-disable @next/next/no-img-element */
import GbForm from "@/components/forms/GbForm";
import { Divider } from "antd";
import React, { useState } from "react";
import CreateCustomer from "./CreateCustomer";

const OrderCart = () => {
    const [active,setActive]=useState(true)
  return (
    <div className="col-span-2 px-[10px]  h-[85vh] overflow-y-scroll ">
    {!!active && <> <h1 className="text-2xl  text-primary mb-3 sticky top-0 bg-light pb-3">Cart (10)</h1>
      { [...Array(3).keys()].map((item:any)=>(
        <div key={item} className="gb_border p-[10px] mb-2">
        <div className="flex items-center gap-2 ">
          <img
            className="w-[70px] h-[70px] gb_border p-[2px] object-cover"
            src="https://smallscalefarms.ca/cdn/shop/collections/8.png?v=1605814079"
            alt=""
          />
          <div>
            <p className=" text-gray-600 text-[14px]">Honey Raj </p>
            <p className=" font-semibold text-[14px]">BTD: 900.00</p>
          </div>
        </div>
        <span className="text-[12px] gb_border bg-[white] px-[15px] py-[6px] my-6 inline-block">
          Pack Size: .5Kg
        </span>
        <div style={{padding:"14px"}} className="floating-label-input py-4">
          <label htmlFor="customerSearch" className="text-[#999] text-[12px]">
            Unit Price
          </label>

          <p>BTD 120.00</p>
        </div>

        <div className="flex justify-between mt-4">
          <div>
            <button className="text-[#278ea5] rounded-[2px] font-semibold border-[#278ea5] border-[1px]  px-[15px] py-[7px]">
              Add Discount
            </button>
          </div>
          <div>
            <span className="inline-block px-3 hover:bg-gray-200 cursor-pointer py-[4px] gb_border"><i style={{fontSize:"18px"}} className="ri-add-fill"></i></span>
            <span className="inline-block px-[20px]  cursor-pointer border-t-[#f0f0f0] border-t-[1px] text-[18px] border-b-[1px] py-[4px] ">1</span>
            <span className="inline-block px-3 hover:bg-gray-200 cursor-pointer py-[4px] gb_border"><i style={{fontSize:"18px"}} className="ri-subtract-fill"></i></span>

            <span className="px-3 py-[4px] bg-[#FFF5F5] inline-block ml-3 cursor-pointer"><i className="ri-delete-bin-5-line text-[#F44336] text-[18px]"></i></span>
          </div>
        </div>
      </div>
      ))}

      <div className="bg-white h-[150px] sticky bottom-0 pt-[20px]">
          <div className="p-5 bg-[#E8F0F2] font-bold text-[16px] text-end mt-[20px]">Total:120.00</div>
         <div className="flex justify-end my-5">
         <button onClick={()=>setActive(false)} className="bg-[#278ea5] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[5px]">Next</button>
         </div>
      </div></> }
    {!active && <> <h1 className="text-2xl  text-primary mb-3 sticky top-0 bg-light pb-3 font-semibold">Delivery & Payment</h1>
                  <div className="min-h-[1000vh]">
                    <GbForm submitHandler={(data:any)=>console.log(data)}>
                    <CreateCustomer />
                    </GbForm>
                  </div>

      <div className="bg-white h-[100px] sticky bottom-0 py-[5px]">
         <div className="flex justify-end items-end  h-full gap-2 mb-4">
         <button onClick={()=>setActive(true)} className="border-1 text-[#278ea5] border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[30px] py-[5px]">Back</button>
         <button onClick={()=>setActive(false)} className=" bg-[#CACACA] text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]">Proceed to Checkout</button>
         </div>
      </div></> }
    </div>
  );
};

export default OrderCart;
