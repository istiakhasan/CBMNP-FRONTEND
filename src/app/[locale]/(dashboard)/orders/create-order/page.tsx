"use client";

import React, { useRef, useState } from "react";

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
import { CopyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { buildInvoiceText } from "@/util/buildInvoiceText";

const Page = () => {
  const [togglePage, setTogglePage] = useState(false);
  const userInfo: any = getUserInfo();
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [selectedCustomerOrdersCount, setSelectedCustomerOrderCount] =
    useState(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [invoiceText, setInvoiceText] = useState("");
  const [invoiceCopied, setInvoiceCopied] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const isSubmittingOrderRef = useRef(false);
  const [orderDetails, setOrderDetails] = useState<any>({
    orderSource: "Facebook",
    orderType: "Regular",
    shippingType: "Regular",
    shippingCharge: 0,
    discountAmount: 0,
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

  // NOTE: Actual shipping charge (based on division + free/regular shippingType)
  // is calculated and kept in sync by OrderDetailsPanel's internal useEffect.
  // This handler ONLY updates the selected address — it must NOT set shippingCharge
  // itself, otherwise it fights with OrderDetailsPanel and overwrites "Free" delivery
  // with a stale 70/130 value.
  const handleDeliveryAddressChange = (address: any) => {
    setOrderDetails((prev: any) => ({
      ...prev,
      deliveryAddress: address,
    }));
  };

  const addToCart = (product: any, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });

    const existingItem = cartItems.find(
      (item) => item.product.id === product.id,
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
        prev.filter((item) => item.product.id !== productId),
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      toast.info("Cart cleared");
    }
  };

  // Sum of product prices only — no shipping, no discount.
  const getItemsSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.salePrice * item.quantity,
      0,
    );
  };

  // Final payable total = items subtotal + shipping charge - discount.
  // Shipping is added ONCE (not per cart item), and discount is subtracted once.
  const getTotalAmount = () => {
    const itemsSubtotal = getItemsSubtotal();
    const shippingCharge = orderDetails?.shippingCharge || 0;
    const discountAmount = orderDetails?.discountAmount || 0;
    return Math.max(itemsSubtotal + shippingCharge - discountAmount, 0);
  };

  const resetForm = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setOrderDetails({
      orderSource: "",
      orderType: "Regular",
      shippingType: "Regular",
      shippingCharge: 0,
      discountAmount: 0,
      paymentStatus: "Pending",
      paymentMethod: "Cash on Delivery",
      deliveryNote: "",
      deliveryAddress: undefined,
      currier: undefined,
      warehouse: undefined,
    });
  };

  const handleCopyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(invoiceText);
      setInvoiceCopied(true);
      message.success("Invoice copied! এখন কাস্টমারকে পাঠাতে পারেন।");
      setTimeout(() => setInvoiceCopied(false), 2000);
    } catch {
      message.error("Copy করতে সমস্যা হয়েছে");
    }
  };

  const handleConfirmOrder = async () => {
    if (isSubmittingOrderRef.current) {
      return;
    }

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
      orderSource: orderDetails?.orderSource,
      currier: orderDetails?.currier,
      shippingCharge: orderDetails?.shippingCharge,
      shippingType: orderDetails?.shippingType,
      discountAmount: orderDetails?.discountAmount || 0,
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

    isSubmittingOrderRef.current = true;
    setIsSubmittingOrder(true);

    try {
      const res = await handleSubmitOrder(order).unwrap();
      if (res) {
        // Build a copy-ready invoice BEFORE resetting the form, since resetForm()
        // clears cartItems/orderDetails that the invoice needs.
        const invoice = buildInvoiceText({
          customer: selectedCustomer,
          cartItems,
          orderDetails,
          itemsSubtotal: getItemsSubtotal(),
          totalAmount: getTotalAmount(),
          orderId: res?.data?.id || res?.data?.orderId,
        });
        setInvoiceText(invoice);
        message.success("Order created successfully! 🎉");
        resetForm();
        setOrderSuccessModal(true);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to create order");
    } finally {
      isSubmittingOrderRef.current = false;
      setIsSubmittingOrder(false);
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
                    shippingCharge={orderDetails.shippingCharge} // 👈 নতুন
                    shippingType={orderDetails.shippingType} // 👈 নতুন
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
                    isConfirming={isSubmittingOrder}
                    onClearCart={clearCart}
                    getTotalAmount={getTotalAmount}
                    getItemsSubtotal={getItemsSubtotal}
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
                />
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#fafafa",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "inherit",
                    fontSize: 13,
                    lineHeight: 1.6,
                    maxHeight: "40vh",
                    overflowY: "auto",
                  }}
                >
                  {invoiceText}
                </pre>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 12,
                  }}
                >
                  <Button onClick={() => setOrderSuccessModal(false)}>
                    Close
                  </Button>
                  <Button
                    type="primary"
                    icon={
                      invoiceCopied ? <CheckCircleOutlined /> : <CopyOutlined />
                    }
                    onClick={handleCopyInvoice}
                  >
                    {invoiceCopied ? "Copied!" : "Copy Invoice"}
                  </Button>
                </div>
              </div>
            </GbModal>
          </div>
        </div>
      </div>
    );
  }
};

export default Page;
