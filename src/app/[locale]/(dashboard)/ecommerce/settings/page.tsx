"use client";
import React, { useEffect } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Select,
  Divider,
  message,
  Tabs,
  Space,
} from "antd";
import {
  SaveOutlined,
  ShopOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  CodeOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import {
  useGetEcommerceSettingsQuery,
  useUpdateEcommerceSettingsMutation,
} from "@/redux/api/ecommerceApi";

export default function EcommerceSettingsPage() {
  const [form] = Form.useForm();
  const { data: settingsRes, isLoading } = useGetEcommerceSettingsQuery(undefined);
  const [updateSettings, { isLoading: isSaving }] = useUpdateEcommerceSettingsMutation();

  const settings = settingsRes?.data || {};

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        storeName: settings.storeName || "Tabaya Modest Wear",
        storeTagline: settings.storeTagline || "Bespoke & Ready-to-Wear Luxury Abayas",
        logoUrl: settings.logoUrl || "https://tabaya.com/cdn/shop/files/Tabaya_Logo_Gold.png",
        faviconUrl: settings.faviconUrl || "",
        supportEmail: settings.supportEmail || "concierge@tabaya.com",
        supportPhone: settings.supportPhone || "+880 1700-000000",
        whatsappNumber: settings.whatsappNumber || "+8801700000000",
        facebookUrl: settings.facebookUrl || "https://facebook.com/tabaya",
        instagramUrl: settings.instagramUrl || "https://instagram.com/tabaya",
        youtubeUrl: settings.youtubeUrl || "",
        currencySymbol: settings.currencySymbol || "৳",
        currencyCode: settings.currencyCode || "BDT",
        freeShippingThreshold: Number(settings.freeShippingThreshold) || 2500,
        enableCod: settings.enableCod ?? true,
        enableBkash: settings.enableBkash ?? true,
        bkashMerchantNumber: settings.bkashMerchantNumber || "01700000000",
        enableNagad: settings.enableNagad ?? true,
        nagadMerchantNumber: settings.nagadMerchantNumber || "01700000000",
        headerStyle: settings.headerStyle || "sticky-luxury",
        footerStyle: settings.footerStyle || "four-column",
        footerAboutText:
          settings.footerAboutText ||
          "Tabaya is an artisanal luxury modest fashion brand devoted to creating sophisticated, timeless silhouettes with the finest fabrics.",
        copyrightText:
          settings.copyrightText || "© 2026 Tabaya. All Rights Reserved. Powered by CBMNP E-Commerce Suite.",
        customCss: settings.customCss || "",
      });
    }
  }, [settings, form]);

  const handleSubmit = async (values: any) => {
    try {
      await updateSettings(values).unwrap();
      message.success("E-Commerce Store Settings saved successfully!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update settings");
    }
  };

  const tabItems = [
    {
      key: "general",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <ShopOutlined /> General & Branding
        </span>
      ),
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item name="storeName" label="Storefront Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Tabaya Luxury Wear" />
            </Form.Item>

            <Form.Item name="storeTagline" label="Tagline / Slogan">
              <Input placeholder="e.g. Bespoke Luxury Abayas & Modest Elegance" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="logoUrl"
              label="Store Logo URL (Header)"
              extra="Transparent PNG or SVG recommended. Default 200x50px."
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item name="faviconUrl" label="Favicon URL" extra="32x32px or 64x64px browser tab icon.">
              <Input placeholder="https://..." />
            </Form.Item>
          </div>

          <Divider orientation="left" className="text-sm text-slate-500 font-bold">
            Header & Footer Configuration
          </Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item name="headerStyle" label="Storefront Navigation Layout">
              <Select
                options={[
                  { label: "Sticky Luxury Navigation (Tabaya Style)", value: "sticky-luxury" },
                  { label: "Centered Logo Minimalist", value: "centered-logo" },
                  { label: "Classic Wide Bar", value: "minimal" },
                ]}
              />
            </Form.Item>

            <Form.Item name="footerStyle" label="Footer Layout">
              <Select
                options={[
                  { label: "4-Column Comprehensive (Brand, Links, Policies, Newsletter)", value: "four-column" },
                  { label: "3-Column Balanced", value: "three-column" },
                  { label: "Minimalist Compact", value: "minimal" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="footerAboutText" label="Footer About Story">
            <Input.TextArea rows={3} placeholder="Brief summary of the brand displayed in the footer." />
          </Form.Item>

          <Form.Item name="copyrightText" label="Footer Copyright Notice">
            <Input placeholder="© 2026 Your Brand. All Rights Reserved." />
          </Form.Item>
        </div>
      ),
    },
    {
      key: "payments",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <CreditCardOutlined /> Payments & Checkout
        </span>
      ),
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item name="currencySymbol" label="Currency Symbol" rules={[{ required: true }]}>
              <Input placeholder="৳" />
            </Form.Item>

            <Form.Item name="currencyCode" label="Currency Code" rules={[{ required: true }]}>
              <Input placeholder="BDT" />
            </Form.Item>

            <Form.Item
              name="freeShippingThreshold"
              label="Free Delivery Threshold (৳)"
              extra="Orders over this amount qualify for automated free delivery ticker"
            >
              <InputNumber min={0} className="w-full" placeholder="2500" />
            </Form.Item>
          </div>

          <Divider orientation="left" className="text-sm text-slate-500 font-bold">
            Payment Methods
          </Divider>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Cash on Delivery (COD)</div>
                <div className="text-xs text-slate-500">Allow customers to pay upon package receipt.</div>
              </div>
              <Form.Item name="enableCod" valuePropName="checked" className="mb-0">
                <Switch />
              </Form.Item>
            </div>
          </div>

          <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">bKash Merchant / Personal Payment</div>
                <div className="text-xs text-slate-500">Enable bKash payment method on storefront checkout.</div>
              </div>
              <Form.Item name="enableBkash" valuePropName="checked" className="mb-0">
                <Switch />
              </Form.Item>
            </div>
            <Form.Item name="bkashMerchantNumber" label="bKash Wallet / Merchant Number">
              <Input placeholder="01700000000" className="max-w-md" />
            </Form.Item>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Nagad Payment</div>
                <div className="text-xs text-slate-500">Enable Nagad payment method on storefront checkout.</div>
              </div>
              <Form.Item name="enableNagad" valuePropName="checked" className="mb-0">
                <Switch />
              </Form.Item>
            </div>
            <Form.Item name="nagadMerchantNumber" label="Nagad Wallet / Merchant Number">
              <Input placeholder="01700000000" className="max-w-md" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <PhoneOutlined /> Concierge & Socials
        </span>
      ),
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item name="supportEmail" label="Customer Care Email">
              <Input placeholder="concierge@brand.com" />
            </Form.Item>

            <Form.Item name="supportPhone" label="Helpline Number">
              <Input placeholder="+880 1700-000000" />
            </Form.Item>

            <Form.Item
              name="whatsappNumber"
              label="WhatsApp Concierge Number"
              extra="Enables floating WhatsApp luxury chat assistant"
            >
              <Input placeholder="+8801700000000" />
            </Form.Item>
          </div>

          <Divider orientation="left" className="text-sm text-slate-500 font-bold">
            Social Media Handles
          </Divider>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item name="facebookUrl" label="Facebook Page URL">
              <Input placeholder="https://facebook.com/..." />
            </Form.Item>

            <Form.Item name="instagramUrl" label="Instagram Handle / URL">
              <Input placeholder="https://instagram.com/..." />
            </Form.Item>

            <Form.Item name="youtubeUrl" label="YouTube Channel URL">
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: "advanced",
      label: (
        <span className="flex items-center gap-1.5 font-medium">
          <CodeOutlined /> Custom Scripts & CSS
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item
            name="customCss"
            label="Custom CSS Overrides & Analytics Snippets"
            extra="Add custom CSS styles, Google Tag Manager IDs, or Facebook Pixel head snippets."
          >
            <Input.TextArea
              rows={10}
              className="font-mono text-xs leading-relaxed"
              placeholder="/* Add custom styles or script tags here */"
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Store Settings & Payment Gateways" />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card
          className="rounded-2xl shadow-sm border-slate-200"
          title={<span className="font-bold text-slate-800 text-base">E-Commerce Storefront Configuration</span>}
          extra={
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSaving || isLoading}
              className="bg-slate-900 hover:bg-slate-800 px-6 font-semibold"
            >
              Save Changes
            </Button>
          }
        >
          <Tabs items={tabItems} defaultActiveKey="general" />
        </Card>
      </Form>
    </div>
  );
}
