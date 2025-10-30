// import React from 'react';
// import OrderCreate from './_component/OrderCreate';
// import { Metadata } from 'next';
// export const metadata: Metadata = {
//     title: "Create Order",
//   };
// const page = () => {
//     return (
//         <div>
//             <OrderCreate />
//         </div>
//     );
// };

// export default page;

"use client";

import React, { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import FixedCustomerDetails from "../_test/FixedCustomerDetails";
import ProductSearchPanel from "../_test/ProductSearchPanel";
import CustomerSearchPanel from "../_test/CustomerSearchPanel";
import MinimalAddressSelection from "../_test/MinimalAddressSelection";
import OrderDetailsPanel from "../_test/OrderDetailsPanel";
import OrderSummary from "../_test/OrderSummary";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Button, message, Result } from "antd";
import { getUserInfo } from "@/service/authService";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import OrderCreate from "./_component/OrderCreate";
import GbModal from "@/components/ui/GbModal";

const Page = () => {
  const [togglePage, setTogglePage] = useState(false);
  const userInfo: any = getUserInfo();
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [selectedCustomerOrdersCount, setSelectedCustomerOrderCount] = useState<
    any | null
  >(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>({
    orderSource: "Facebook",
    orderType: "Regular",
    shippingType: "Regular",
    shippingCharge: 0,
    paymentStatus: "Pending",
    paymentMethod: "Cash on Delivery",
    deliveryNote: "",
    deliveryAddress: undefined,
    currier: undefined,
    warehouse: undefined,
  });
  const [handleSubmitOrder] = useCreateOrderMutation();

  const handleCustomerSelect = (customer: any | null) => {
    if (customer?.id !== selectedCustomer?.id) {
      setCustomerAddresses([]);
      setOrderDetails((prev: any) => ({
        ...prev,
        deliveryAddress: undefined,
        shippingCharge: 0,
      }));
    }
    setSelectedCustomer(customer);
  };

  const calculateShippingCharge = (address?: any) => {
    if (!address) return 0;

    const dhakaDistricts = ["Dhaka"];
    const otherDistricts = [
      "Rajshahi",
      "Barishal",
      "Khulna",
      "Sylhet",
      "Chittagong",
      "Rangpur",
      "Mymensingh",
    ];

    if (address.district && dhakaDistricts.includes(address.district)) {
      return 70;
    } else if (address.district && otherDistricts.includes(address.district)) {
      return 120;
    }

    return 70;
  };

  const handleDeliveryAddressChange = (address: any) => {
    const shippingCharge = calculateShippingCharge(address);
    setOrderDetails((prev: any) => ({
      ...prev,
      deliveryAddress: address,
      shippingCharge,
    }));
  };

  const addToCart = (product: any, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      message.success(`Updated ${product.name} quantity in cart`);
    } else {
      message.success(`Added ${product.name} to cart`);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const item = cartItems.find((item) => item.product.id === productId);
      if (item) {
        toast.info(`Removed ${item.product.name} from cart`);
      }
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      toast.info("Cart cleared");
    }
  };
  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.product.salePrice * item.quantity +
        orderDetails?.shippingCharge,
      0
    );
  };

  const resetForm = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setOrderDetails({
      orderSource: "",
      orderType: "Regular",
      shippingType: "Regular",
      shippingCharge: 0,
      paymentStatus: "Pending",
      paymentMethod: "Cash on Delivery",
      deliveryNote: "",
      deliveryAddress: undefined,
      currier: undefined,
      warehouse: undefined,
    });
  };

  const handleConfirmOrder = async () => {
    if (!selectedCustomer || cartItems.length === 0) {
      message.error("Cannot place order");
      return;
    }

    if (!orderDetails.warehouse) {
      message.error("Missing warehouse selection");
      return;
    }

    if (!orderDetails.orderSource) {
      message.error("Missing order source");
      return;
    }

    if (!orderDetails.deliveryAddress) {
      message.error("Missing delivery address");
      return;
    }

    if (orderDetails.paymentMethod.length === 0) {
      message.error("Missing payment method");
      return;
    }
    const order: any = {
      customerId: selectedCustomer?.customer_Id,
      receiverName: orderDetails?.deliveryAddress?.receiverName,
      receiverPhoneNumber: orderDetails?.deliveryAddress?.receiverPhoneNumber,
      receiverDivision: orderDetails?.deliveryAddress?.division,
      receiverDistrict: orderDetails?.deliveryAddress?.district,
      receiverThana: orderDetails?.deliveryAddress?.thana,
      receiverAddress: orderDetails?.deliveryAddress?.address,
      // deliveryDate: orderDetails?.details?.deliveryAddress?.address,
      orderSource: orderDetails?.orderSource,
      currier: orderDetails?.currier,
      shippingCharge: orderDetails?.shippingCharge,
      shippingType: orderDetails?.shippingType,
      orderType: orderDetails?.orderType,
      agentId: userInfo?.userId,
      deliveryNote: orderDetails?.deliveryNote,
      locationId: orderDetails?.warehouse?.value,
      statusId: 2,
      paymentMethod: orderDetails?.paymentMethod,
      paymentStatus: orderDetails?.paymentStatus,
      addressId: orderDetails?.deliveryAddress?.id,
      products: cartItems?.map((item: any) => {
        return {
          productId: item?.product?.id,
          productQuantity: item?.quantity,
        };
      }),
    };

    if (orderDetails["paymentStatus"] !== "Pending") {
      order["paymentHistory"] = [
        {
          paidAmount: orderDetails?.amount || 0,
          paymentStatus: orderDetails?.paymentStatus,
          transactionId: orderDetails?.transactionId || "",
          paymentMethod: orderDetails?.paymentMethod,
        },
      ];
    }

    const res = await handleSubmitOrder(order).unwrap();
    if (res) {
      message.success("Order created successfully! 🎉");
      resetForm();
      setOrderSuccessModal(true);
    }
  };

  if (togglePage) {
    return <OrderCreate />;
  } else {
    return (
      <div>
        <GbHeader title="Create Order" />
        <div className="px-[16px] h-[90vh] overflow-scroll custom_scroll">
          <div className=" bg-gray-50 sticky top-[200px] p-4">
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Fixed Customer Details */}
                <div className="lg:col-span-3">
                  <FixedCustomerDetails
                    selectedCustomer={selectedCustomer}
                    selectedDeliveryAddress={orderDetails.deliveryAddress}
                    selectedCustomerOrdersCount={selectedCustomerOrdersCount}
                  />
                </div>

                {/* Middle Column - Products → Customer Search → Address Selection → Order Details */}
                <div className="lg:col-span-6 space-y-6">
                  <ProductSearchPanel onAddToCart={addToCart} />

                  <CustomerSearchPanel
                    selectedCustomer={selectedCustomer}
                    onCustomerSelect={handleCustomerSelect}
                    setSelectedCustomerOrderCount={
                      setSelectedCustomerOrderCount
                    }
                    setOrderDetails={setOrderDetails}
                    setCustomerAddresses={setCustomerAddresses}
                    onDeliveryAddressSelect={handleDeliveryAddressChange}
                  />

                  {/* Minimal Address Selection - Shows after customer selection */}
                  {selectedCustomer && (
                    <MinimalAddressSelection
                      customer={selectedCustomer}
                      addresses={customerAddresses}
                      onAddressUpdate={setCustomerAddresses}
                      selectedDeliveryAddress={orderDetails.deliveryAddress}
                      onDeliveryAddressSelect={handleDeliveryAddressChange}
                    />
                  )}

                  <OrderDetailsPanel
                    orderDetails={orderDetails}
                    onOrderDetailsChange={setOrderDetails}
                    selectedCustomer={selectedCustomer}
                    getTotalAmount={getTotalAmount}
                  />
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-3">
                  <OrderSummary
                    cartItems={cartItems}
                    orderDetails={orderDetails}
                    onUpdateCartItem={updateCartItem}
                    onConfirmOrder={handleConfirmOrder}
                    onClearCart={clearCart}
                    getTotalAmount={getTotalAmount}
                  />
                </div>
              </div>
            </div>
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
                <Result
                  status="success"
                  title="Order Created Successfully!"
                  subTitle="Your order has been placed successfully. You can track it in the orders section."
                  extra={[
                    <Button
                      type="primary"
                      key="ok"
                      onClick={() => setOrderSuccessModal(false)}
                    >
                      OK
                    </Button>,
                  ]}
                />
              </div>
            </GbModal>
            {/* Toast Notifications */}
            {/* <ToastContainer position="top-right" closeButton /> */}
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
