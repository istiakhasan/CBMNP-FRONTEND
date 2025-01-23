/* eslint-disable @next/next/no-img-element */
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { Divider, message } from "antd";
import React, { useState } from "react";

const LoadProductsEdit = ({ setCart, cart }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAllProductQuery({
    searchProducts: searchTerm,
    limit: "200",
  });
  console.log(cart,"check cart");
  return (
    <div className="flex-1  h-[85vh] overflow-y-scroll bg-white custom_scroll p-[10px] pt-0">
      <div className="md:px-4">
        <div className="pb-[30px] sticky top-0 pt-[15px] bg-[#FFFFFF]">
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
              className="p-[14px] text-[14px] outline-none  bg-none w-full rounded-[4px]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {data?.data.map((item: any, i: any) => (
          <div key={i} className="gb_border p-[10px] mb-4">
            <div className="flex items-center gap-2">
              <img
                className="w-[60px] h-[60px] gb_border p-[2px]"
                src={`${getBaseUrl()}/${item?.product_image}`}
                alt=""
              />
              <p className="text-gray-600 text-[14px] font-[400]">
                {item?.product_title_en}
              </p>
            </div>

            <Divider />
            <div className="flex justify-between">
              <div>
                <p className=" font-semibold text-[14px] ">
                  BDT: {item?.current_prices?.toFixed(2)}
                </p>
                <span className="text-[14px] gb_border bg-[white] px-[15px] py-[2px] my-3 inline-block">
                  Pack Size: {item?.pack_size}
                </span>
              </div>
              <div>
                {cart?.some((exist: any) => exist?.productId === item?.id) ? (
                  <>
                    <div className="border">
                      <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.productId === item?.id
                          );

                          const newQuantity = findProduct?.productQuantity + 1;
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
                        className="inline-block px-3  bg-primary text-white cursor-pointer py-[4px] gb_border"
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className="ri-add-fill"
                        ></i>
                      </span>
                      <span className="inline-block px-[20px]  cursor-pointer   text-[18px]  py-[4px] ">
                        {cart.find((ct: any) => ct.productId === item?.id)
                          ?.productQuantity || 0}
                      </span>
                      <span
                        onClick={() => {
                          const _data = [...cart];
                          const findProduct = _data?.find(
                            (j: any) => j.productId === item?.id
                          );
                          const newQuantity = findProduct?.productQuantity - 1;
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
                        className="inline-block px-3  bg-primary text-white cursor-pointer py-[4px] gb_border"
                      >
                        <i
                          style={{ fontSize: "18px" }}
                          className="ri-subtract-fill"
                        ></i>
                      </span>

                      <span
                        onClick={() => {
                          const filterItem = cart.filter(
                            (cp: any) => cp?.productId !== item?.id
                          );
                          setCart(filterItem);
                        }}
                        className="px-3 py-[4px] bg-[#FFF5F5] inline-block ml-3 cursor-pointer"
                      >
                        <i className="ri-delete-bin-5-line text-[#F44336] text-[18px]"></i>
                      </span>
                    </div>
                  </>
                ) : (
                  <button 
                    disabled={item?.active_status===2?true:false}
                    onClick={() => {
                      if (
                        !item?.inventory?.productQuantity ||
                        item?.inventory?.productQuantity < 1
                      ) {
                        return message.error("Product is not in stock");
                      }
                      const payload = {
                        productId: item?.id,
                        current_prices: item?.current_prices,
                        productNameEn: item?.product_title_en,
                        singleProductPrices: item?.current_prices,
                        productQuantity: item?.productQuantity || 1,
                        subTotal:
                          item.current_prices * (item.productQuantity || 1),
                        isCancel: false,
                        productWeight: item?.pack_size,
                        image: item?.product_image,
                      };
                      setCart([...cart, payload]);
                    }}
                    className={`rounded-[2px]  border-[1px] font-semibold  px-[15px] py-[3px] ${(!item?.inventory?.productQuantity || item?.inventory?.productQuantity<1 || item?.active_status===2)?"bg-gray-300 opacity-[.3]":"text-[#278ea5] border-[#278ea5]"}`}
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

export default LoadProductsEdit;
