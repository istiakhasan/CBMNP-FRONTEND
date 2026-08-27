"use client";

import React, { useEffect, useRef } from "react";
import { Card, Select, Badge, Input, Row, Col, Radio, Switch } from "antd";
import {
  TruckOutlined,
  MessageOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TeamOutlined,
  HomeOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
import GbFormSelect from "@/components/forms/GbFormSelect";

const { Option } = Select;
const { TextArea } = Input;

const orderSources = [
  { value: "Facebook", label: "Facebook", icon: FacebookOutlined },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageOutlined },
  { value: "Phone Call", label: "Phone Call", icon: PhoneOutlined },
  { value: "Telemarketing", label: "Telemarketing", icon: TeamOutlined },
  { value: "Employee", label: "Employee", icon: HomeOutlined },
];

const shippingTypeOptions = [
  { label: "Regular", value: "Regular" },
  { label: "Express", value: "Express" },
  { label: "Free", value: "Free" },
];

interface OrderDetailsPanelProps {
  orderDetails: any;
  onOrderDetailsChange: (details: any) => void;
  selectedCustomer: any | null;
  getTotalAmount: any;
}

export default function OrderDetailsPanelEdit({
  orderDetails,
  onOrderDetailsChange,
  selectedCustomer,
  getTotalAmount,
}: OrderDetailsPanelProps) {
  const { data: deliveryPartner } =
    useGetDeliveryPartnerOptionsQuery(undefined);
  const total = getTotalAmount();

  const { data: warehouses } = useLoadAllWarehouseOptionsQuery(undefined);

  const updateField = (field: keyof any, value: any) => {
    onOrderDetailsChange((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Base shipping rate purely based on DIVISION (not district)
  const calculateBaseShippingCharge = (division?: string) => {
    const normalized = division?.trim().toLowerCase();
    if (normalized === "dhaka") return 70;
    return 130;
  };

  const getShippingInfo = () => {
    if (orderDetails.manualShippingCharge) {
      return {
        message: `Manual shipping charge: ৳${orderDetails.shippingCharge || 0}`,
        charge: orderDetails.shippingCharge || 0,
        color: "purple",
      };
    }

    if (!orderDetails.deliveryAddress) {
      return {
        message: "Please select a delivery address to see shipping information",
        charge: 0,
        color: "gray",
      };
    }

    if (orderDetails.shippingType === "Free") {
      return {
        message: `Free delivery to ${orderDetails.deliveryAddress.district}: ৳0`,
        charge: 0,
        color: "gold",
      };
    }

    const division = orderDetails.deliveryAddress.division;
    const district = orderDetails.deliveryAddress.district;
    const charge = calculateBaseShippingCharge(division);

    return {
      message: `Shipping to ${district || division}: ৳${charge}`,
      charge,
      color: division?.trim().toLowerCase() === "dhaka" ? "green" : "blue",
    };
  };

  const shippingInfo = getShippingInfo();

  // One-time init check (runs once per order load, guarded by the ref below):
  // if the order already has a shippingCharge that doesn't match the standard
  // 70 (Dhaka) / 130 (outside Dhaka) formula — and it's not the Free-delivery
  // 0 case — it must have been set manually before, so flip manualShippingCharge
  // on automatically instead of letting the auto-calc effect stomp over it.
  const didInitCheck = useRef(false);

  // Combined effect — init-detection and auto-calc must happen atomically
  // in the SAME pass, otherwise a stale `manualShippingCharge` read in a
  // second effect can overwrite a correctly-detected manual charge before
  // React commits the flag (this caused e.g. 200 -> 70 on order load).
  useEffect(() => {
    if (!orderDetails.deliveryAddress) return; // wait until address data is loaded

    const standardCharge =
      orderDetails.shippingType === "Free"
        ? 0
        : calculateBaseShippingCharge(orderDetails.deliveryAddress.division);

    // One-time init check: if the order already has a shippingCharge that
    // doesn't match the standard 70/130 formula, it was set manually before —
    // flip the flag and STOP, so we don't also overwrite the value below.
    if (!didInitCheck.current) {
      didInitCheck.current = true;

      const hasExistingCharge =
        orderDetails.shippingCharge !== undefined &&
        orderDetails.shippingCharge !== null;

      if (
        !orderDetails.manualShippingCharge &&
        hasExistingCharge &&
        Number(orderDetails.shippingCharge) !== standardCharge
      ) {
        updateField("manualShippingCharge", true);
        return; // preserve the existing manual charge this pass
      }
    }

    // Skip auto-calc entirely while manual override is on.
    if (orderDetails.manualShippingCharge) return;

    if (Number(orderDetails.shippingCharge) !== standardCharge) {
      updateField("shippingCharge", standardCharge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderDetails.deliveryAddress,
    orderDetails.shippingType,
    orderDetails.manualShippingCharge,
  ]);

  const cancelReasonOptions = [
    { label: "Customer Not interested", value: "Customer Not interested" },
    { label: "Multiple order", value: "Multiple order" },
    { label: "Product Stock-out", value: "Product Stock-out" },
    { label: "Customer Unreachable", value: "Customer Unreachable" },
    { label: "Delay Delivery", value: "Delay Delivery" },
    {
      label: "Urgent delivery (Out-side Dhaka)",
      value: "Urgent delivery (Out-side Dhaka)",
    },
    {
      label: "Urgent delivery (In Dhaka)",
      value: "Urgent delivery (In Dhaka)",
    },
    { label: "Fake Order", value: "Fake Order" },
    { label: "Financial Crisis", value: "Financial Crisis" },
    {
      label: "Mistakenly placed order by customer",
      value: "Mistakenly placed order by customer",
    },
    {
      label: "Not interested to pay in advance",
      value: "Not interested to pay in advance",
    },
    { label: "Out of Coverage", value: "Out of Coverage" },
    { label: "Price Issue", value: "Price Issue" },
    { label: "Customer Wants to cancel", value: "Customer Wants to cancel" },
    {
      label: "Will not available on delivery time",
      value: "Will not available on delivery time",
    },
    { label: "Will order later", value: "Will order later" },
    { label: "Test Order", value: "Test Order" },
    { label: "Exchange parcel", value: "Exchange parcel" },
    { label: "Damage", value: "Damage" },
    { label: "Other", value: "Other" },
  ];

  const holdReasonOptions = [
    { label: "Customer Unreachable.", value: "Customer Unreachable." },
    { label: "Number Switched off.", value: "Number Switched off." },
    { label: "Waiting for payment", value: "Waiting for payment" },
    {
      label: "Customer want to add more products",
      value: "Customer want to add more products",
    },
    { label: "Address will be changed", value: "Address will be changed" },
    {
      label: "Expected delivery date will be change",
      value: "Expected delivery date will be change",
    },
    { label: "Product Stock-out", value: "Product Stock-out" },
    { label: "Advance Order", value: "Advance Order" },
    {
      label: "Awaiting customer decision",
      value: "Awaiting customer decision",
    },
    { label: "Other", value: "Other" },
  ];
  return (
    <Card
      title={
        <span>
          <TruckOutlined style={{ color: "#722ED1", marginRight: 8 }} />
          Operational Order Details
        </span>
      }
      style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      {/* Order Type & Shipping */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <label>Warehouse Selection *</label>
          <Select
            value={orderDetails.warehouse}
            labelInValue
            onChange={(value) => updateField("warehouse", value)}
            style={{ width: "100%" }}
            placeholder="Select warehouse"
          >
            {warehouses?.data?.map((w: any, i: any) => (
              <Option key={w.value} value={w.value}>
                <div>
                  <div style={{ fontSize: 12 }}>{w.label}</div>
                </div>
              </Option>
            ))}
          </Select>
          {selectedCustomer && orderDetails.warehouse && (
            <p style={{ fontSize: 12, color: "green", marginTop: 4 }}>
              ✓ Suggested based on customer location:{" "}
              {selectedCustomer?.location?.mapLocation}
            </p>
          )}
        </Col>
        <Col xs={24} md={12}>
          <label className="text-[12px]">Order Source *</label>
          <Select
            value={orderDetails.orderSource}
            onChange={(value) => updateField("orderSource", value)}
            style={{ width: "100%" }}
            placeholder="Select order source"
          >
            {orderSources.map((source) => {
              const Icon = source.icon;
              return (
                <Option key={source.value} value={source.value}>
                  <Icon style={{ marginRight: 4 }} />
                  {source.label}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col xs={24} className="mb-4" md={12}>
          <label className="text-[12px]">Order Type</label>
          <Select
            value={orderDetails?.orderType}
            onChange={(value) => updateField("orderType", value)}
            style={{ width: "100%" }}
          >
            {[
              { label: "Regular", value: "Regular" },
              { label: "Pre Order", value: "Pre Order" },
              { label: "Exchange", value: "Exchange" },
              { label: "Re-book", value: "Re-book" },
            ].map((type) => (
              <Option key={type.value} value={type.label}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={12}>
          <label className="text-[12px]">Shipping Type</label>
          <Select
            value={orderDetails?.shippingType || "Regular"}
            onChange={(value) => updateField("shippingType", value)}
            style={{ width: "100%" }}
          >
            {shippingTypeOptions.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.value === "Free" ? "Free (ফ্রি ডেলিভারি)" : type.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12}>
          <label className="text-[12px]">Shipping Method</label>
          <Select
            placeholder="Select shipping method"
            value={orderDetails?.currier}
            onChange={(value, options) => updateField("currier", options)}
            style={{ width: "100%" }}
            options={deliveryPartner?.data}
          />
        </Col>

        {/* Discount Amount */}
        <Col className="mt-[12px]" xs={24} md={12}>
          <label className="text-[12px]">
            <TagOutlined style={{ marginRight: 4 }} />
            Discount Amount (৳)
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={orderDetails?.discountAmount ?? 0}
            onChange={(e) => {
              const raw = e.target.value;
              const value = raw === "" ? 0 : Number(raw);
              if (isNaN(value) || value < 0) return;
              updateField("discountAmount", value);
            }}
          />
        </Col>

        {/* Manual Delivery Charge Override */}
        <Col className="mt-[12px]" xs={24} md={12}>
          <label
            className="text-[12px]"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <TruckOutlined style={{ marginRight: 4 }} />
            Manual Delivery Charge
            <Switch
              size="small"
              checked={!!orderDetails.manualShippingCharge}
              onChange={(checked) => {
                updateField("manualShippingCharge", checked);
                if (checked) {
                  // Switch on কারার সময় বর্তমান calculated/existing charge দিয়ে শুরু করি
                  // যাতে edit mode এ পুরনো order এর charge হঠাৎ ০ না হয়ে যায়।
                  updateField(
                    "shippingCharge",
                    orderDetails.shippingCharge ?? shippingInfo.charge,
                  );
                }
              }}
            />
          </label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            disabled={!orderDetails.manualShippingCharge}
            value={
              orderDetails.manualShippingCharge
                ? (orderDetails.shippingCharge ?? 0)
                : shippingInfo.charge
            }
            onChange={(e) => {
              const raw = e.target.value;
              const value = raw === "" ? 0 : Number(raw);
              if (isNaN(value) || value < 0) return;
              updateField("shippingCharge", value);
            }}
            style={{ marginTop: 8 }}
          />
        </Col>

        {orderDetails?.statusId === 1 && (
          <>
            <Col className="mt-[12px]" xs={24} md={12}>
              <label className="text-[12px]">Update Status</label>

              <Select
                placeholder="Select Status"
                value={orderDetails?.statusByAgent?.value}
                onChange={(value, options) => {
                  updateField("statusByAgent", options);

                  // Status change হলে আগের reason clear করে দিচ্ছি
                  if (value === "4") {
                    updateField("onHoldReason", null);
                  } else if (value === "3") {
                    updateField("onCancelReason", null);
                  } else {
                    updateField("onCancelReason", null);
                    updateField("onHoldReason", null);
                  }
                }}
                style={{ width: "100%" }}
                options={[
                  {
                    label: "Approved",
                    value: "2",
                  },
                  {
                    label: "Cancel",
                    value: "4",
                  },
                  {
                    label: "Hold",
                    value: "3",
                  },
                ]}
              />
            </Col>

            {/* Cancel Reason */}
          
                      {orderDetails?.statusByAgent?.value === "4" && (
              <Col className="mt-[12px]" xs={24} md={12}>
                <label className="text-[12px]">Cancel Reason*</label>
                <Select
                  options={cancelReasonOptions}
                  value={orderDetails?.onCancelReason || undefined}
                  onChange={(value: any) => {
                    updateField("onCancelReason", value);
                    if (value !== "Other") {
                      updateField("onCancelReasonOther", "");
                    }
                  }}
                  className="w-full"
                  placeholder="Select cancel reason"
                />
                {orderDetails?.onCancelReason === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Cancel reason লিখুন..."
                    value={orderDetails?.onCancelReasonOther || ""}
                    onChange={(e) =>
                      updateField("onCancelReasonOther", e.target.value)
                    }
                  />
                )}
              </Col>
            )}

            {orderDetails?.statusByAgent?.value === "3" && (
              <Col className="mt-[12px]" xs={24} md={12}>
                <label className="text-[12px]">Hold Reason*</label>
                <Select
                  className="w-full"
                  options={holdReasonOptions}
                  value={orderDetails?.onHoldReason || undefined}
                  onChange={(value: any) => {
                    updateField("onHoldReason", value);
                    if (value !== "Other") {
                      updateField("onHoldReasonOther", "");
                    }
                  }}
                  placeholder="Select hold reason"
                />
                {orderDetails?.onHoldReason === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Hold reason লিখুন..."
                    value={orderDetails?.onHoldReasonOther || ""}
                    onChange={(e) =>
                      updateField("onHoldReasonOther", e.target.value)
                    }
                  />
                )}
              </Col>
            )}
          </>
        )}
      </Row>

      {/* Shipping Info */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #f0f0f0",
          borderRadius: 6,
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>
            <TruckOutlined style={{ color: "#722ED1", marginRight: 4 }} />{" "}
            Shipping Information
          </span>
          {orderDetails.deliveryAddress && (
            <Badge
              count={orderDetails?.deliveryAddress?.label}
              style={{ backgroundColor: "#eee", color: "#555" }}
            />
          )}
        </div>
        <p style={{ color: shippingInfo.color }}>{shippingInfo.message}</p>
        {!!orderDetails?.discountAmount && orderDetails.discountAmount > 0 && (
          <p style={{ color: "#eb2f96" }}>
            Discount applied: -৳{orderDetails.discountAmount}
          </p>
        )}
        {orderDetails.deliveryAddress && (
          <p style={{ fontSize: 12, color: "#888" }}>
            Delivery to: {orderDetails.deliveryAddress.address}
          </p>
        )}
      </div>

      {/* Delivery Notes */}
      <div style={{ marginTop: 16 }}>
        <label className="text-[12px]">Delivery Notes</label>
        <TextArea
          value={orderDetails.deliveryNote}
          onChange={(e) => updateField("deliveryNote", e.target.value)}
          rows={3}
          placeholder="Special delivery instructions, customer preferences, or notes..."
        />
      </div>
    </Card>
  );
}
