/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useGetAllCustomersQuery } from "@/redux/api/customerApi";
import { Input, message, Select } from "antd";
import GbModal from "@/components/ui/GbModal";
import AddCustomer from "./AddCustomer";
import {
  useCreateOrderMutation,
  useCreatePOSOrderMutation,
} from "@/redux/api/orderApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import PosPrint from "./PosPrint";
const ProductOrderList = ({
  cart,
  setCart,
  handleQuantityChange,
}: {
  cart: any;
  handleQuantityChange: any;
  setCart: any;
}) => {
  const { data, isLoading } = useGetAllCustomersQuery(undefined);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<any>({});
  const [handleSubmitOrder] = useCreatePOSOrderMutation();
  const { data: warehouseData, isLoading: warehouseLoading } =
    useLoadAllWarehouseOptionsQuery(undefined);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [successModal, setSuccessModal] = useState<any>(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>("");
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = data?.data?.filter((item: any) => {
    const text = `${item?.customerName}-(${item?.customerPhoneNumber}) ${item?.customer_Id}`;
    return text.toLowerCase().includes(inputValue.toLowerCase());
  });

  return (
    <aside className="product-order-list bg-secondary-transparent flex-fill">
      {/* Order Card */}
      <div className="card">
        <div className="card-body">
          {/* Order Head */}
          <div className="order-head border-b-[1px] flex items-center justify-between w-full">
            <div>
              <h3 className="text-[#212B36] text-[18px] font-bold">
                Order List
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-dark fs-10 fw-medium badge-xs">
                #ORD123
              </span>
              <a className="link-danger fs-16" href="#">
                <i className="ti ti-trash-x-filled"></i>
              </a>
            </div>
          </div>

          {/* Customer Info */}
          <div className="customer-info block-section">
            <h5 className="mb-2 text-[#212B36] text-[14px] font-bold">
              Selected Shop
            </h5>
            <div className="border py-2">
              {warehouseData?.data?.length > 0 && (
                <h1 className="mb-0 px-2">{warehouseData?.data[0]?.label}</h1>
              )}
            </div>
          </div>
          {/* Customer Info */}
          <div className="customer-info block-section">
            <h5 className="mb-2 text-[#212B36] text-[14px] font-bold">
              Customer Information
            </h5>
            <div className="flex items-center gap-2">
              <div className="flex-grow-[1]">
                <div
                  ref={wrapperRef}
                  className="relative w-full border px-[10px]"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Select Customer"
                    className="h-[34px] text-sm"
                  />

                  {dropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-52 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {filteredOptions?.length ? (
                        filteredOptions.map((item: any) => (
                          <div
                            key={item?.customer_Id}
                            onClick={() => {
                              setCustomer({
                                customer_Id: item?.customer_Id,
                                customerName: item?.customerName,
                                customerPhoneNumber: item?.customerPhoneNumber,
                              });
                              setInputValue(
                                `${item?.customerName}-(${item?.customerPhoneNumber})`
                              );
                              setDropdownOpen(false);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            {item?.customerName} - ({item?.customerPhoneNumber})
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No results
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="btn btn-teal btn-icon fs-20 flex items-center justify-center"
                data-bs-toggle="modal"
                data-bs-target="#create"
              >
                <i className="ri-user-add-line"></i>
              </button>
              <GbModal
                cls="custom_ant_modal"
                openModal={() => setOpen(true)}
                closeModal={() => setOpen(false)}
                isModalOpen={open}
              >
                <AddCustomer
                  customer={customer}
                  setCustomer={setCustomer}
                  setOpen={setOpen}
                  searchValue={inputValue}
                />
              </GbModal>
            </div>
          </div>

          {/* Order Details */}
          <div className="product-added block-section">
            <div className="head-text flex items-center justify-between my-3">
              <div className="flex items-center">
                <h5 className="mr-2 text-[1rem] text-[#212B36] mb-0">
                  Order Details
                </h5>
                <div className="badge bg-light text-gray-9 fs-12 fw-semibold py-2 border rounded">
                  Items : <span className="text-teal">{cart?.length || 0}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCustomer({});
                  setCart([]);
                  setResponseData(null);
                  setSuccessModal(false);
                  setPaymentMethod("");
                  message.success("Form reset");
                }}
                className="flex items-center clear-icon text-[10px] fw-medium"
              >
                Clear all
              </button>
            </div>

            {/* Product List */}
            <div className="product-wrap">
              <div className="empty-cart" style={{ display: "none" }}>
                <div className="fs-24 mb-1">
                  <i className="ti ti-shopping-cart"></i>
                </div>
                <p className="fw-bold">No Products Selected</p>
              </div>

              <div className="pos_table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style={{ textAlign: "center" }}>QTY</th>
                      <th style={{ textAlign: "end" }}>Cost</th>
                      <th style={{ textAlign: "end" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.map((item: any, i: any) => (
                      <tr key={i}>
                        <td>{item?.name}</td>
                        <td align="center">
                          <div className="flex items-center border border-gray-300 w-fit rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item?.id, -1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{item?.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item?.id, 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td align="right">
                          {item?.quantity * item?.salePrice}
                        </td>
                        <td style={{ textAlign: "end" }}>
                          <i
                            onClick={() => {
                              const _data = [...cart];
                              _data.splice(i, 1); // remove 1 item at position 'index'
                              setCart(_data); // update state if cart is state
                            }}
                            className="ri-delete-bin-line cursor-pointer text-red-700"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="order-total bg-total bg-white p-0 table-responsive">
            <h5 className="mb-2 text-[#212B36] text-[14px] font-bold">
              Payment Summary
            </h5>
            <div className="pos_table">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-gray-9 text-end">৳ 0</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-danger">Discount</span>
                    </td>
                    <td className="text-danger text-end">৳ 0</td>
                  </tr>
                  <tr>
                    <td>Sub Total</td>
                    <td className="text-gray-9 text-end">
                      ৳{" "}
                      {cart?.reduce(
                        (a: any, b: any) => a + b?.quantity * b?.salePrice,
                        0
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold border-top border-dashed">
                      Total Payable
                    </td>
                    <td className="text-gray-9 fw-bold text-end border-top border-dashed">
                      {cart?.reduce(
                        (a: any, b: any) => a + b?.quantity * b?.salePrice,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card payment-method">
        <div className="card-body">
          <h5 className="mb-2 text-[#212B36] text-[14px] font-bold">
            Select Payment
          </h5>
          <div className="grid grid-cols-4 gap-2 items-center methods">
            {[
              {
                icon: "https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/cash-icon.svg",
                label: "Cash",
              },
              {
                icon: "https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/card.svg",
                label: "Card",
              },
              {
                icon: "https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/points.svg",
                label: "Points",
              },
              {
                icon: "https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/deposit.svg",
                label: "Deposit",
              },
              {
                icon: "https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/cheque.svg",
                label: "Cheque",
              },
            ].map((item, idx) => (
              <div key={idx} className="">
                <button
                  onClick={() => setPaymentMethod(item?.label)}
                  className={`flex items-center border rounded flex-1 gap-2 justify-center p-2 ${
                    paymentMethod === item?.label ? "border-primary" : ""
                  }`}
                >
                  <img
                    src={`${item.icon}`}
                    style={{ height: "20px" }}
                    alt={item.label}
                  />
                  <p className="text-[12px] fw-medium">{item.label}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="btn-row flex items-center justify-end gap-3 mt-4">
        {/* <button className="bg-white text-primary border font-bold text-[12px] px-[20px] py-[5px]">
          <i className="ri-printer-line"></i>Print Order
        </button> */}
        <button
          onClick={async () => {
            if (Object.keys(customer)?.length < 1) {
              return message.error("Please select a customer");
            }

            if (cart?.length < 1) {
              return message.error("Product is empty");
            }

            const payload = {
              customerId: customer?.customer_Id,
              receiverPhoneNumber: customer?.customerPhoneNumber,
              receiverName: customer?.customerName,
              shippingCharge: 0,
              locationId: warehouseData?.data[0]?.value,
              statusId: 8,
              paymentMethod: paymentMethod,
              paymentStatus: "Paid",
              paymentHistory: [
                {
                  paidAmount:
                    cart?.reduce(
                      (a: any, b: any) => a + b?.quantity * b?.salePrice,
                      0
                    ) || 0,
                  paymentStatus: "Paid",
                  transactionId: "",
                  paymentMethod: paymentMethod,
                },
              ],
              products: cart?.map((item: any) => {
                return {
                  productId: item?.id,
                  productQuantity: item?.quantity,
                };
              }),
            };

            const res = await handleSubmitOrder(payload).unwrap();
            setResponseData(res);
            setSuccessModal(true);
            console.log(res, "res");
            console.log(payload);
          }}
          className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
        >
          <i className="ri-shopping-cart-line"></i>Place Order
        </button>
      </div>
      <GbModal
        cls="custom_ant_modal"
        width="380px"
        closeModal={() => setSuccessModal(false)}
        openModal={() => setSuccessModal(true)}
        isModalOpen={successModal}
      >
        <PosPrint responseData={responseData} />
      </GbModal>
    </aside>
  );
};

export default ProductOrderList;
