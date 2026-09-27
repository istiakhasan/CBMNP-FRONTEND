"use client";
import React, { useEffect, useState } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Select,
  Button,
  ColorPicker,
  Radio,
  Divider,
  message,
  Tabs,
  Space,
} from "antd";
import {
  BgColorsOutlined,
  FontColorsOutlined,
  LayoutOutlined,
  NotificationOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useGetEcommerceSettingsQuery,
  useUpdateEcommerceSettingsMutation,
} from "@/redux/api/ecommerceApi";

const { TextArea } = Input;

export default function VisualCustomizerPage() {
  const [form] = Form.useForm();
  const { data: settingsRes, isLoading } = useGetEcommerceSettingsQuery(undefined);
  const [updateSettings, { isLoading: isUpdating }] = useUpdateEcommerceSettingsMutation();

  const settings = settingsRes?.data;

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  const onFinish = async (values: any) => {
    try {
      await updateSettings(values).unwrap();
      message.success("Theme and visual customization saved successfully!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update visual settings");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Visual Theme & Store Customizer" />

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Visual Styling Studio</h3>
          <p className="text-xs text-slate-500">
            Real-time customization for your Tabaya storefront branding, fonts, colors & announcement bar.
          </p>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isUpdating}
          onClick={() => form.submit()}
          className="bg-slate-900 hover:bg-slate-800 font-medium px-6 h-10"
        >
          Publish Changes
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={settings}>
        <Tabs
          defaultActiveKey="branding"
          type="card"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          items={[
            // ── 1. Announcement Bar ──────────────────────────────────────────
            {
              key: "announcement",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <NotificationOutlined /> Announcement Bar
                </span>
              ),
              children: (
                <div className="space-y-4 max-w-3xl">
                  <Form.Item
                    name="announcementEnabled"
                    valuePropName="checked"
                    label={<span className="font-semibold text-slate-700">Enable Announcement Ticker</span>}
                  >
                    <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                  </Form.Item>

                  <Form.Item
                    name="announcementText"
                    label={<span className="font-semibold text-slate-700">Announcement Banner Text</span>}
                    rules={[{ required: true, message: "Please enter announcement text" }]}
                  >
                    <Input placeholder="e.g. ✨ Free Nationwide Delivery on Orders Over ৳2,500 | Use Code: EID2026" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="announcementBg"
                        label={<span className="font-semibold text-slate-700">Background Color (Hex)</span>}
                      >
                        <Input placeholder="#1e293b" prefix={<BgColorsOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="announcementTextColor"
                        label={<span className="font-semibold text-slate-700">Text Color (Hex)</span>}
                      >
                        <Input placeholder="#ffffff" prefix={<FontColorsOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="announcementLink"
                    label={<span className="font-semibold text-slate-700">Click Destination URL</span>}
                  >
                    <Input placeholder="/collections/eid-special" />
                  </Form.Item>
                </div>
              ),
            },

            // ── 2. Brand Colors Palette ──────────────────────────────────────
            {
              key: "colors",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <BgColorsOutlined /> Brand Colors
                </span>
              ),
              children: (
                <div className="space-y-4 max-w-3xl">
                  <p className="text-xs text-slate-500 mb-4">
                    Choose luxury color accents inspired by the Tabaya luxury palette.
                  </p>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="primaryColor"
                        label={<span className="font-semibold text-slate-700">Primary Brand Color</span>}
                      >
                        <Input placeholder="#1e293b" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="accentColor"
                        label={<span className="font-semibold text-slate-700">Luxury Accent / Gold (`#beaa8d`)</span>}
                      >
                        <Input placeholder="#beaa8d" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="bgLightColor"
                        label={<span className="font-semibold text-slate-700">Warm Background Tone (`#f7efe3`)</span>}
                      >
                        <Input placeholder="#f7efe3" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="textColor"
                        label={<span className="font-semibold text-slate-700">Text Color</span>}
                      >
                        <Input placeholder="#1a1a1a" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },

            // ── 3. Typography ────────────────────────────────────────────────
            {
              key: "typography",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <FontColorsOutlined /> Typography
                </span>
              ),
              children: (
                <div className="space-y-4 max-w-3xl">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="headingFont"
                        label={<span className="font-semibold text-slate-700">Headings & Titles Font</span>}
                      >
                        <Select
                          options={[
                            { label: "Playfair Display (Luxury Editorial)", value: "Playfair Display" },
                            { label: "Poppins (Modern Bold)", value: "Poppins" },
                            { label: "Inter (Sleek Minimal)", value: "Inter" },
                            { label: "Plus Jakarta Sans (Geometric)", value: "Plus Jakarta Sans" },
                            { label: "Outfit (Contemporary)", value: "Outfit" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="bodyFont"
                        label={<span className="font-semibold text-slate-700">Body & Product Description Font</span>}
                      >
                        <Select
                          options={[
                            { label: "Inter (Clean & Highly Legible)", value: "Inter" },
                            { label: "Poppins (Rounded & Friendly)", value: "Poppins" },
                            { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
                            { label: "DM Sans (Modern Professional)", value: "DM Sans" },
                            { label: "Roboto (Classic Enterprise)", value: "Roboto" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },

            // ── 4. Header & Footer Layouts ───────────────────────────────────
            {
              key: "layout",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <LayoutOutlined /> Header & Footer
                </span>
              ),
              children: (
                <div className="space-y-4 max-w-3xl">
                  <Form.Item
                    name="headerStyle"
                    label={<span className="font-semibold text-slate-700">Header Style Variant</span>}
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="sticky-luxury">Sticky Luxury (Tabaya Style)</Radio.Button>
                      <Radio.Button value="minimal">Minimal Clean</Radio.Button>
                      <Radio.Button value="centered-logo">Centered Logo</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Divider />

                  <Form.Item
                    name="footerAboutText"
                    label={<span className="font-semibold text-slate-700">Footer Brand Summary</span>}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Contemporary modest wear tailored for perfection. Crafted with premium imported fabrics."
                    />
                  </Form.Item>

                  <Form.Item
                    name="copyrightText"
                    label={<span className="font-semibold text-slate-700">Copyright Notice</span>}
                  >
                    <Input placeholder="© 2026 Tabaya Modest Wear. All Rights Reserved." />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />
      </Form>
    </div>
  );
}
