"use client";

import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import ProductSearchPanel from "../_test/ProductSearchPanel";
import CustomerSearchPanel from "../_test/CustomerSearchPanel";
import MinimalAddressSelection from "../_test/MinimalAddressSelection";
import OrderSummary from "../_test/OrderSummary";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { message } from "antd";
import { getUserInfo } from "@/service/authService";
import {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import FixedCustomerDetails from "./_test/FixedCustomerDetailsEdit";
import { useSearchParams } from "next/navigation";
import { useGetCustomerByIdQuery } from "@/redux/api/customerApi";
import { useGetOrdersCountByIdQuery } from "@/redux/api/statusApi";
import OrderDetailsPanelEdit from "./_test/OrderDetailsPanelEdit";
import OrderSummaryEdit from "./_test/OrderSummaryEdit";
import FixedCustomerDetailsEdit from "./_test/FixedCustomerDetailsEdit";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { instance } from "@/helpers/axios/axiosInstance";
import MinimalAddressSelectionEdit from "./_test/MinimalAddressSelectionEdit";
import ProductSearchPanelEdit from "./_test/ProductSearchPanelEdit";

const Page = () => {
  const userInfo: any = getUserInfo();
  const params = useSearchParams();
  const [orderUpdateMutation] = useUpdateOrderMutation();
  const editAbleCustomerId = params.get("customerId");
  const editAbleOrderId = params.get("orderId");
  const { data: customer, isLoading: customerLoading } =
    useGetCustomerByIdQuery({
      id: editAbleCustomerId,
    });
  const { data: orderData, isLoading: orderLoading } = useGetOrderByIdQuery({
    id: editAbleOrderId,
  });
  const { data: orderCount, isLoading } = useGetOrdersCountByIdQuery({
    id: editAbleCustomerId,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [selectedCustomerOrdersCount, setSelectedCustomerOrderCount] = useState<
    any | null
  >(orderCount?.data);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>({
    warehouse: "",
    orderSource: "",
    orderType: "",
    shippingType: "",
    shippingCharge: 0,
    paymentStatus: "",
    paymentMethod: "",
    deliveryNote: "",
    deliveryAddress: undefined,
    currier: undefined,
    amount: 0,
  });


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
  useEffect(() => {
    if (customer?.data && orderData) {
      setCartItems(orderData?.products?.map((ab:any)=>{
        return {
            product:ab?.product,
            quantity:ab?.productQuantity
        }
      }))
      setSelectedCustomer(customer?.data);
      setCustomerAddresses(customer?.data?.addresses);
      setOrderDetails((prev: any) => {
        return {
          ...prev,
          deliveryAddress: orderData?.address,
          orderSource: orderData?.orderSource,
          orderType: orderData?.orderType,
          shippingType: orderData?.shippingType,
          shippingCharge: orderData?.shippingCharge,
          paymentMethod: orderData?.paymentMethod,
          paymentStatus: orderData?.paymentStatus,
          amount: orderData?.totalPaidAmount,
          warehouse: {
            label: orderData?.warehouse?.name,
            value: orderData?.warehouse?.id,
          },
          currier: {
            label: orderData?.partner?.partnerName,
            value: orderData?.partner?.id,
          },
        };
      });
    }
  }, [customer, orderData]);
  useEffect(()=>{
    instance.get(`${getBaseUrl()}/customers/orders-count/${editAbleCustomerId}`)
    .then(res=>setSelectedCustomerOrderCount(res?.data?.data))
    .catch(err=>console.log(err))
  },[editAbleCustomerId])
  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.product.salePrice * item.quantity +
        orderDetails?.shippingCharge,
      0
    );
  };



  const handleUpdateOrder = async () => {
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
    const order: any = {
      customerId: selectedCustomer?.customer_Id,
      receiverName: orderDetails?.deliveryAddress?.receiverName,
      receiverPhoneNumber: orderDetails?.deliveryAddress?.receiverPhoneNumber,
      receiverDivision: orderDetails?.deliveryAddress?.division,
      receiverDistrict: orderDetails?.deliveryAddress?.district,
      receiverThana: orderDetails?.deliveryAddress?.thana,
      receiverAddress: orderDetails?.deliveryAddress?.address,
      orderSource: orderDetails?.orderSource,
      currier: orderDetails?.currier?.value,
      shippingCharge: orderDetails?.shippingCharge,
      shippingType: orderDetails?.shippingType,
      orderType: orderDetails?.orderType,
      agentId: userInfo?.userId,
      totalPaidAmount: orderData?.totalPaidAmount,
      deliveryNote: orderDetails?.deliveryNote,
      addressId: orderDetails?.deliveryAddress?.id, 
      products: cartItems?.map((item: any) => {
        return {
          productId: item?.product?.id,
          productQuantity: item?.quantity,
        };
      }),
    };





    const res: any = await orderUpdateMutation({data:order,id:orderData?.id}).unwrap()
    console.log(res, "res");
    if (res) {
      message.success("Order Update successfully! 🎉");
    }
  };
console.log(orderDetails,"==========================",orderData);
  return (
    <div>
      <GbHeader title="Create Order" />
      <div className="px-[16px] h-[90vh] overflow-scroll custom_scroll">
        <div className=" bg-gray-50 sticky top-[200px] p-4">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Fixed Customer Details */}
              <div className="lg:col-span-3">
                <FixedCustomerDetailsEdit
                  selectedCustomer={selectedCustomer}
                  selectedDeliveryAddress={orderDetails.deliveryAddress}
                  selectedCustomerOrdersCount={selectedCustomerOrdersCount}
                />
              </div>

              {/* Middle Column - Products → Customer Search → Address Selection → Order Details */}
              <div className="lg:col-span-6 space-y-6">
                <ProductSearchPanelEdit onAddToCart={addToCart} />

                <CustomerSearchPanel
                  selectedCustomer={selectedCustomer}
                  onCustomerSelect={handleCustomerSelect}
                  setSelectedCustomerOrderCount={setSelectedCustomerOrderCount}
                  setOrderDetails={setOrderDetails}
                  setCustomerAddresses={setCustomerAddresses}
                  onDeliveryAddressSelect={handleDeliveryAddressChange}
                />

                {/* Minimal Address Selection - Shows after customer selection */}
                {selectedCustomer && (
                  <MinimalAddressSelectionEdit
                    customer={selectedCustomer}
                    addresses={customerAddresses}
                    onAddressUpdate={setCustomerAddresses}
                    selectedDeliveryAddress={orderDetails.deliveryAddress}
                    onDeliveryAddressSelect={handleDeliveryAddressChange}
                  />
                )}

                <OrderDetailsPanelEdit
                  orderDetails={orderDetails}
                  onOrderDetailsChange={setOrderDetails}
                  selectedCustomer={selectedCustomer}
                  getTotalAmount={getTotalAmount}
                />
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-3">
                <OrderSummaryEdit
                  cartItems={cartItems}
                  orderDetails={orderDetails}
                  onUpdateCartItem={updateCartItem}
                  onConfirmOrder={handleUpdateOrder}
                  onClearCart={clearCart}
                  getTotalAmount={getTotalAmount}
                />
              </div>
            </div>
          </div>

          {/* Toast Notifications */}
          {/* <ToastContainer position="top-right" closeButton /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
