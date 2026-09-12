/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { useGetAllCustomersQuery } from "@/redux/api/customerApi";
import { message } from "antd";
import GbModal from "@/components/ui/GbModal";
import AddCustomer from "./AddCustomer";
import { useCreatePOSOrderMutation } from "@/redux/api/orderApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import PosPrint from "./PosPrint";

const PAYMENT_METHODS = ["Cash", "Card", "Points", "Deposit", "Cheque"];
const QUICK_CASH = [100, 200, 500, 1000];

const ProductOrderList = ({
  cart,
  setCart,
  handleQuantityChange,
  customer,
  setCustomer,
}: {
  cart: any;
  setCart: any;
  handleQuantityChange: any;
  customer: any;
  setCustomer: any;
}) => {
  const { data } = useGetAllCustomersQuery(undefined);
  const [open, setOpen] = useState(false);
  const [handleSubmitOrder, { isLoading: placingOrder }] = useCreatePOSOrderMutation();
  const { data: warehouseData } = useLoadAllWarehouseOptionsQuery(undefined);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [shippingCharge, setShippingCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState<number | "">("");

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(customer?.customerName ? `${customer.customerName}-(${customer.customerPhoneNumber})` : "");
  }, [customer]);

  const filteredOptions = data?.data?.filter((item: any) => {
    const text = `${item?.customerName}-(${item?.customerPhoneNumber}) ${item?.customer_Id}`;
    return text.toLowerCase().includes(inputValue.toLowerCase());
  });

  const subTotal = cart?.reduce((a: number, b: any) => a + b.quantity * b.salePrice, 0) || 0;
  const totalPayable = Math.max(subTotal - discount, 0) + Number(shippingCharge || 0);
  const changeDue = useMemo(() => {
    if (paymentMethod !== "Cash" || cashReceived === "") return 0;
    return Math.max(Number(cashReceived) - totalPayable, 0);
  }, [cashReceived, totalPayable, paymentMethod]);

  const resetForm = () => {
    setCustomer({});
    setCart([]);
    setResponseData(null);
    setSuccessModal(false);
    setPaymentMethod("Cash");
    setShippingCharge(0);
    setDiscount(0);
    setCashReceived("");
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(customer || {}).length < 1) return message.error("Please select a customer");
    if (!cart?.length) return message.error("Cart is empty");
    if (!paymentMethod) return message.error("Please select a payment method");

    const payload = {
      customerId: customer?.customer_Id,
      receiverPhoneNumber: customer?.customerPhoneNumber,
      receiverName: customer?.customerName,
      shippingCharge: Number(shippingCharge) || 0,
      discount: Number(discount) || 0,
      locationId: warehouseData?.data?.[0]?.value,
      statusId: 8,
      paymentMethod,
      paymentStatus: "Paid",
      paymentHistory: [
        {
          paidAmount: totalPayable,
          paymentStatus: "Paid",
          transactionId: "",
          paymentMethod,
        },
      ],
      products: cart?.map((item: any) => ({
        productId: item?.id,
        productQuantity: item?.quantity,
      })),
    };

    try {
      const res = await handleSubmitOrder(payload).unwrap();
      setResponseData(res);
      setSuccessModal(true);
    } catch (error: any) {
      message.error(error?.data?.message || "Could not place order");
    }
  };

  // F9 = place order, Esc = clear sale (both ignored while a modal is open)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (open || successModal) return;
      if (e.key === "F9") {
        e.preventDefault();
        handlePlaceOrder();
      }
      if (e.key === "Escape" && (cart?.length || customer?.customerName)) {
        resetForm();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, successModal, cart, customer, paymentMethod, discount, shippingCharge, cashReceived]);

  return (
    <aside className="pos-order">
      <div className="pos-order-section">
        <div className="pos-order-head">
          <h3>Bill</h3>
          <button className="pos-clear-btn" onClick={resetForm} disabled={!cart?.length && !customer?.customerName}>
            <i className="ri-refresh-line" /> Clear [Esc]
          </button>
        </div>

        <div className="pos-field-row">
          <div className="pos-field">
            <label>Shop</label>
            <div className="pos-static-field">{warehouseData?.data?.[0]?.label || "—"}</div>
          </div>
          <div className="pos-field">
            <label>Customer</label>
            <div className="pos-customer-picker" ref={wrapperRef}>
              <div className="pos-customer-input">
                <input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Search customer"
                />
                <button onClick={() => setOpen(true)} aria-label="Add customer">
                  <i className="ri-user-add-line" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="pos-customer-dropdown">
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
                          setDropdownOpen(false);
                        }}
                      >
                        <strong>{item?.customerName}</strong>
                        <span>{item?.customerPhoneNumber}</span>
                      </div>
                    ))
                  ) : (
                    <div className="pos-customer-empty">No match — add new</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pos-bill-table-wrap custom_scroll">
        <table className="pos-bill-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th className="text-end">Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!cart?.length ? (
              <tr>
                <td colSpan={6} className="pos-bill-empty">
                  Scan or click a product to add it to the bill
                </td>
              </tr>
            ) : (
              cart.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="pos-bill-name">{item?.name}</td>
                  <td>
                    <div className="pos-line-qty">
                      <button onClick={() => handleQuantityChange(item?.id, -1)}>−</button>
                      <span>{item?.quantity}</span>
                      <button onClick={() => handleQuantityChange(item?.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>৳{item?.salePrice}</td>
                  <td className="text-end">৳{(item?.quantity * item?.salePrice).toLocaleString()}</td>
                  <td>
                    <button
                      className="pos-line-remove"
                      onClick={() => setCart(cart.filter((_: any, idx: number) => idx !== i))}
                      aria-label="Remove item"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pos-order-section">
        <div className="pos-summary-row">
          <label>Discount (৳)</label>
          <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>
        <div className="pos-summary-row">
          <label>Shipping (৳)</label>
          <input type="number" min={0} value={shippingCharge} onChange={(e) => setShippingCharge(Number(e.target.value))} />
        </div>
        <div className="pos-summary-row pos-summary-subtotal">
          <label>Sub total</label>
          <span>৳{subTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="pos-total-display">
        <span>Total Payable</span>
        <strong>৳{totalPayable.toLocaleString()}</strong>
      </div>

      <div className="pos-order-section">
        <div className="pos-payment-rail">
          {PAYMENT_METHODS.map((m) => (
            <button key={m} className={paymentMethod === m ? "active" : ""} onClick={() => setPaymentMethod(m)}>
              {m}
            </button>
          ))}
        </div>

        {paymentMethod === "Cash" && (
          <div className="pos-cash-tender">
            <div className="pos-quick-cash">
              {QUICK_CASH.map((amt) => (
                <button key={amt} onClick={() => setCashReceived((prev) => (Number(prev) || 0) + amt)}>
                  +{amt}
                </button>
              ))}
              <button className="pos-quick-cash-clear" onClick={() => setCashReceived("")}>
                Reset
              </button>
            </div>
            <div className="pos-cash-inputs">
              <div>
                <label>Cash received</label>
                <input
                  type="number"
                  min={0}
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div className="pos-change-due">
                <label>Change due</label>
                <strong>৳{changeDue.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pos-actions">
        <button className="pos-place-btn" onClick={handlePlaceOrder} disabled={placingOrder}>
          <i className="ri-shopping-cart-line" />
          {placingOrder ? "Placing order…" : "Place Order [F9]"}
        </button>
      </div>

      <GbModal cls="custom_ant_modal" openModal={() => setOpen(true)} closeModal={() => setOpen(false)} isModalOpen={open}>
        <AddCustomer customer={customer} setCustomer={setCustomer} setOpen={setOpen} searchValue={inputValue} />
      </GbModal>

      <GbModal
        cls="custom_ant_modal"
        width="380px"
        closeModal={() => setSuccessModal(false)}
        openModal={() => setSuccessModal(true)}
        isModalOpen={successModal}
      >
        <PosPrint responseData={responseData} onDone={resetForm} />
      </GbModal>
    </aside>
  );
};

export default ProductOrderList;