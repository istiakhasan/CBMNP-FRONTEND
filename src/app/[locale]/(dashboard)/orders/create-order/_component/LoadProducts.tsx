/* eslint-disable @next/next/no-img-element */
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { Divider, message } from "antd";
import React, { useEffect, useState } from "react";

const LoadProducts = ({ setCart, cart }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
     // Debounce logic (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);
  const { data, isLoading } = useGetAllProductQuery({
    searchTerm: debouncedSearchTerm,
    limit: "200",
    active:true
  });
  if(isLoading){
    return 
  }
  return (
    <div className="flex-1   h-[85vh] overflow-scroll  custom_scroll  px-[10px] mt-[15px] ">
      <div className="px-4 pt-[15px]">
        <div className="pb-[30px] sticky top-0  z-50">
          <div className="floating-label-input ">
            <label
              htmlFor="customerSearch"
              className="text-[#999] block text-[14px]"
            >
              Product Search
            </label>
            <input
              id="customerSearch"
              placeholder="Search by product name"
              className="p-[14px] text-[14px] outline-none  bg-[#F6F6F6] w-full rounded-[4px]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {data?.data?.map((item: any, i: any) => (
          <div key={i} className="gb_border p-[10px] mb-4">
            <div className="flex items-center gap-2">
              <img
                className="w-[60px] h-[60px] gb_border p-[2px]"
                src={`${item?.images[0]?.url}`}
                alt=""
              />
             <div>
             <p className="text-gray-600 text-[14px] font-[400]">
                {item?.name}
              </p>
              <p className={` text-[12px] font-semibold ${(!item?.inventories?.stock || item?.inventories?.stock<1)?"text-red-400":"color_primary"}`}>
                  QTY: {item?.inventories?.stock || 0}
                </p>
             </div>
            </div>

            <Divider />
            <div className="flex justify-between">
              <div>
                 <p className=" font-semibold text-[14px] ">
                  BDT: {(+item?.salePrice || 0)?.toFixed(2)}
                  {Number(item?.regularPrice) >0 && <del className="text-slate-400 "> {(+item?.regularPrice || 0)?.toFixed(2)}</del>}
                </p>
                <span className="text-[14px] gb_border bg-[white] px-[15px] py-[2px] my-3 inline-block">
                  Pack Size: {item?.weight +" " +  item?.unit}
                </span>
              </div>
              <div>
                {cart?.some((exist: any) => exist?.id === item?.id) ? (
                  <>
                    <div className="border whitespace-nowrap">
                    <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.id === item?.id
                          );
                          const newQuantity = findProduct?.productQuantity - 1;
                          if (newQuantity < 1) {
                            const filterProduct=cart?.filter((fp:any)=>item?.id !==fp?.id)
                            setCart(filterProduct)
                            return 
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
                      
                      <span className="inline-block px-[20px]  cursor-pointer   text-[18px]  py-[4px] ">
                        {cart.find((ct: any) => ct.id === item?.id)
                          ?.productQuantity || 0}
                      </span>
                      <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.id === item?.id
                          );
                       
                          const newQuantity = (findProduct?.productQuantity || 0) + 1;
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
                           findProduct.productQuantity=newQuantity
                           setCart(_data);
                        }}
                        className="inline-block px-3  bg-primary text-white cursor-pointer py-[4px] gb_border"
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className="ri-add-fill"
                        ></i>
                      </span>

                      <span
                        onClick={() => {
                          const filterItem = cart.filter(
                            (cp: any) => cp?.id !== item?.id
                          );
                          setCart(filterItem);
                        }}
                        className="px-3 py-[4px] bg-[#FFF5F5] inline-block cursor-pointer"
                      >
                        <i className="ri-delete-bin-5-line text-[#F44336] text-[18px]"></i>
                      </span>
                    </div>
                  </>
                ) : (
                  <button 
                    disabled={(!item?.inventories?.stock  || item?.inventory?.inventories?.stock<1)?true:false}
                    onClick={() => {
                      if (
                        !item?.inventories?.stock ||
                        item?.inventories?.stock < 1
                      ) {
                        return message.error("Product is not in stock");
                      }
                      setCart([...cart, {...item,productQuantity:1}]);
                    }}
                    className={`rounded-[2px]  border-[1px] font-semibold  px-[15px] py-[3px] ${(!item?.inventories?.stock  || item?.inventory?.inventories?.stock<1)?"bg-gray-300 opacity-[.3]":"color_primary border-[#4F8A6D]"}`}
                  >
                    <i
                      style={{ fontSize: "18px" }}
                      className="ri-shopping-cart-2-line"
                    ></i>{" "}
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadProducts;
