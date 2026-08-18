"use client";

import React, { useEffect } from "react";
import { Card, Select, Badge, Input, Row, Col, Radio } from "antd";
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
  // { label: "Express", value: "Express" },
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

  // Single source of truth for shippingCharge: recalculated here whenever the
  // address or shippingType changes, and written back to orderDetails.
  // Nothing else (page-level handleDeliveryAddressChange included) should
  // set orderDetails.shippingCharge directly.
  useEffect(() => {
    if (orderDetails.shippingCharge !== shippingInfo.charge) {
      updateField("shippingCharge", shippingInfo.charge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderDetails.deliveryAddress?.division,
    orderDetails.deliveryAddress?.district,
    orderDetails.shippingType,
  ]);

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

        {orderDetails?.statusId === 1 && (
          <Col className="mt-[12px]" xs={24} md={12}>
            <label className="text-[12px]">Update Status</label>
            <Select
              placeholder="Select Status"
              onChange={(value, options) =>
                updateField("statusByAgent", options)
              }
              style={{ width: "100%" }}
              options={[
                {
                  label: "Approved",
                  value: "2",
                },
              ]}
            />
          </Col>
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