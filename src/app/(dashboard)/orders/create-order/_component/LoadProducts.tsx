/* eslint-disable @next/next/no-img-element */
import { Divider } from 'antd';
import React from 'react';

const LoadProducts = () => {
    return (
            <div className="col-span-2  border-l border-r h-[85vh] overflow-y-scroll p-[10px] pt-0">
            {
                [...Array(10).keys()].map((item:any)=>(
                    <div key={item} className="gb_border p-[10px] mb-2">
              <div className="flex items-center gap-2">
                <img
                  className="w-[60px] h-[60px] gb_border p-[2px]"
                  src="https://smallscalefarms.ca/cdn/shop/collections/8.png?v=1605814079"
                  alt=""
                />
                <p className=" text-gray-600 text-[12px]">Honey Raj </p>
              </div>

              <Divider />
              <div className="flex justify-between">
                <div>
                  <p className="color_primary font-semibold text-[12px]">
                    BTD: 900.00
                  </p>
                  <span className="text-[12px] gb_border bg-[white] px-[15px] py-[2px]">
                    Pack Size: .5Kg
                  </span>
                </div>
                <div>
                  <button className="text-[#278ea5] rounded-[2px] border-[#278ea5] border-[1px] font-semibold  px-[15px] py-[3px]">
                  <i style={{fontSize:"18px"}} className="ri-shopping-cart-2-line"></i> Add To Cart
                  </button>
                </div>
              </div>
            </div>
                ))
            }
          </div>
     
    );
};

export default LoadProducts;