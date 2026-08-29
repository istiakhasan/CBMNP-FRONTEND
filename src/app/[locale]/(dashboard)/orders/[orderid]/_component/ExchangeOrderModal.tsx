// src/app/[locale]/(dashboard)/orders/[orderid]/_component/ExchangeOrderModal.tsx
"use client";
import { useState } from "react";
import { Form, Select, InputNumber, Input, Button, message, Divider, Spin, Alert } from "antd";
import { useExchangeOrderProductMutation } from "@/redux/api/orderApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function ExchangeOrderModal({ setModalOpen, rowData }: any) {
  const [form] = Form.useForm();
  const router = useRouter();
  const local = useLocale();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [selectedNewPrice, setSelectedNewPrice] = useState<number | null>(null);
  const [selectedOldPrice, setSelectedOldPrice] = useState<number | null>(null);

  const [exchangeOrderProduct, { isLoading }] = useExchangeOrderProductMutation();

  const { data: productsRes, isFetching } = useGetAllProductQuery({
    searchTerm,
    limit: "50",
    active: true,
  });

  const orderProducts = rowData?.products || [];

  const handleOldProductSelect = (productId: string) => {
    const line = orderProducts.find((p: any) => p.productId === productId);
    setSelectedOldPrice(line ? Number(line.productPrice) : null);
    form.setFieldValue("oldQuantity", 1);
  };

  const handleNewProductSelect = (productId: string) => {
    const product = productsRes?.data?.find((p: any) => p.id === productId);
    const stock = Number(product?.inventories?.stock || 0);
    setSelectedStock(stock);
    setSelectedNewPrice(Number(product?.salePrice || 0));
    form.setFieldValue("newQuantity", 1);
  };

  // Live preview — কত টাকা customer আরো দেবে / ফেরত পাবে
  const oldQuantity = Form.useWatch("oldQuantity", form) || 0;
  const newQuantity = Form.useWatch("newQuantity", form) || 0;
  const estimatedDifference =
    selectedNewPrice !== null && selectedOldPrice !== null
      ? selectedNewPrice * newQuantity - selectedOldPrice * oldQuantity
      : null;

  const handleFinish = async (values: any) => {
    if (selectedStock !== null && values.newQuantity > selectedStock) {
      message.error(`Only ${selectedStock} unit(s) available in stock`);
      return;
    }
    try {
      const result = await exchangeOrderProduct({
        orderId: rowData?.id,
        ...values,
      }).unwrap();

      message.success(
        `Exchange complete. New order ${result?.newOrder?.orderNumber || ""} created for the replacement product.`,
      );
      form.resetFields();
      setModalOpen(false);

      if (result?.newOrder?.id) {
        router.push(`/${local}/orders/${result.newOrder.id}`);
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Exchange failed");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-1">Exchange Product</h3>
      <p className="text-sm text-gray-500 mb-3">
        The returned product goes back to this order. A new order is created for the replacement.
      </p>
      <Divider className="my-3" />

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="oldProductId"
          label="Product to Return"
          rules={[{ required: true, message: "Select the product to return" }]}
        >
          <Select
            placeholder="Select product from this order"
            onChange={handleOldProductSelect}
            options={orderProducts.map((p: any) => ({
              value: p.productId,
              label: `${p?.product?.name || p.productId} (qty: ${p.productQuantity})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="oldQuantity"
          label="Return Quantity"
          rules={[{ required: true, message: "Enter return quantity" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Divider className="my-3" />

        <Form.Item
          name="newProductId"
          label="New Product"
          rules={[{ required: true, message: "Select the new product" }]}
        >
          <Select
            showSearch
            filterOption={false}
            placeholder="Search product by name or SKU..."
            notFoundContent={isFetching ? <Spin size="small" /> : "No products found"}
            onSearch={(value) => setSearchTerm(value)}
            onChange={handleNewProductSelect}
            options={productsRes?.data?.map((p: any) => {
              const stock = Number(p?.inventories?.stock || 0);
              return {
                value: p.id,
                label: `${p.name} (sku: ${p.sku}) - ৳${p.salePrice} — ${
                  stock > 0 ? `${stock} in stock` : "Out of stock"
                }`,
                disabled: stock <= 0,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="newQuantity"
          label="New Quantity"
          rules={[{ required: true, message: "Enter new quantity" }]}
        >
          <InputNumber min={1} max={selectedStock ?? undefined} style={{ width: "100%" }} />
        </Form.Item>

        {estimatedDifference !== null && (
          <Alert
            className="mb-4"
            type={estimatedDifference > 0 ? "warning" : estimatedDifference < 0 ? "success" : "info"}
            showIcon
            message={
              estimatedDifference > 0
                ? `Customer needs to pay an extra ৳${estimatedDifference.toFixed(2)} on the new order`
                : estimatedDifference < 0
                  ? `Customer is owed ৳${Math.abs(estimatedDifference).toFixed(2)} back`
                  : "No price difference"
            }
          />
        )}

        <Form.Item name="reason" label="Reason (optional)">
          <Input.TextArea rows={2} />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Confirm Exchange
          </Button>
        </div>
      </Form>
    </div>
  );
}