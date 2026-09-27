"use client";
import React, { useState } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Tag,
  Segmented,
  Tooltip,
  Badge,
  Spin,
  Alert,
} from "antd";
import {
  ShoppingOutlined,
  PictureOutlined,
  TagsOutlined,
  StarOutlined,
  CarOutlined,
  FileTextOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useGetEcommerceDashboardQuery,
  useGetStorefrontConfigQuery,
} from "@/redux/api/ecommerceApi";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function EcommerceOverviewPage() {
  const local = useLocale();
  const [previewDevice, setPreviewDevice] = useState<string>("desktop");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: dashRes, isLoading: dashLoading } = useGetEcommerceDashboardQuery(undefined);
  const { data: configRes, isLoading: configLoading } = useGetStorefrontConfigQuery(undefined);

  const stats = dashRes?.data || {};
  const config = configRes?.data || {};
  const settings = config?.settings || {};
  const banners = config?.banners || [];
  const collections = config?.collections || [];
  const reviews = config?.featuredReviews || [];

  const deviceWidthMap: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="E-Commerce & Storefront Studio" />

      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag color="#beaa8d" className="text-slate-950 font-bold border-none">
              ✨ Tabaya-Grade Engine
            </Tag>
            <span className="text-xs text-amber-200/80 font-medium">
              Live Storefront Synchronized
            </span>
          </div>
          <h2 className="text-2xl font-serif tracking-tight font-bold text-white">
            {settings?.storeName || "Tabaya Modest Wear"}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mt-1">
            {settings?.storeTagline || "Luxury Abayas, Hijabs & Contemporary Modest Fashion"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${local}/ecommerce/customizer`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="bg-amber-600 hover:bg-amber-500 border-none font-medium h-10 px-5"
            >
              Visual Customizer
            </Button>
          </Link>
          <Link href={`/${local}/ecommerce/settings`}>
            <Button
              ghost
              icon={<SettingOutlined />}
              className="border-slate-400 text-slate-200 hover:text-white h-10"
            >
              Store Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics & Entity KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">Hero Banners</span>}
              value={stats?.activeBanners || 0}
              prefix={<PictureOutlined className="text-blue-500 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">Collections</span>}
              value={stats?.curatedCollections || 0}
              prefix={<ShoppingOutlined className="text-amber-500 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">Active Coupons</span>}
              value={stats?.activeCoupons || 0}
              prefix={<TagsOutlined className="text-emerald-500 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">Approved Reviews</span>}
              value={stats?.verifiedReviews || 0}
              prefix={<StarOutlined className="text-amber-400 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">Shipping Rules</span>}
              value={stats?.shippingMethods || 0}
              prefix={<CarOutlined className="text-indigo-500 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="shadow-sm rounded-xl border-slate-200 hover:shadow-md transition">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">CMS Pages</span>}
              value={stats?.publishedPages || 0}
              prefix={<FileTextOutlined className="text-purple-500 mr-1" />}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Live Interactive Storefront Preview Simulator */}
      <Card
        className="shadow-md rounded-2xl border-slate-200 overflow-hidden"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2">
              <EyeOutlined className="text-amber-600 text-lg" />
              <span className="font-semibold text-slate-800 text-base">
                Interactive Live Storefront Preview (Tabaya Experience)
              </span>
            </div>

            {/* Device Switcher */}
            <Segmented
              value={previewDevice}
              onChange={(val) => setPreviewDevice(val as string)}
              options={[
                { label: "Desktop", value: "desktop", icon: <DesktopOutlined /> },
                { label: "Tablet", value: "tablet", icon: <TabletOutlined /> },
                { label: "Mobile", value: "mobile", icon: <MobileOutlined /> },
              ]}
              className="bg-slate-100"
            />
          </div>
        }
      >
        <div className="bg-slate-100 p-2 sm:p-4 rounded-xl flex justify-center items-start min-h-[700px] overflow-x-auto">
          {/* Simulated Browser Frame */}
          <div
            style={{ width: deviceWidthMap[previewDevice] }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 transition-all duration-300"
          >
            {/* Browser Address Bar */}
            <div className="bg-slate-800 text-slate-300 px-4 py-2 flex items-center gap-2 text-xs border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 bg-slate-900 px-3 py-1 rounded-md text-center text-slate-400 font-mono text-[11px] truncate">
                https://{settings?.storeName?.toLowerCase().replace(/\s+/g, "") || "tabaya"}.com
              </div>
            </div>

            {/* 1. TOP ANNOUNCEMENT BAR */}
            {settings?.announcementEnabled && (
              <div
                style={{
                  backgroundColor: settings?.announcementBg || "#1e293b",
                  color: settings?.announcementTextColor || "#ffffff",
                }}
                className="text-center py-2 px-4 text-xs font-medium tracking-wide flex justify-center items-center gap-2"
              >
                <span>{settings?.announcementText}</span>
              </div>
            )}

            {/* 2. LUXURY STORE HEADER */}
            <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div className="text-xl font-bold font-serif tracking-wider text-slate-900 uppercase">
                {settings?.storeName || "TABAYA"}
              </div>

              {/* Navigation Menu */}
              {previewDevice !== "mobile" && (
                <nav className="flex items-center gap-6 text-xs font-medium text-slate-700 tracking-wider uppercase">
                  <span className="text-amber-800 font-semibold cursor-pointer">New In</span>
                  <span className="hover:text-amber-700 cursor-pointer">Abayas</span>
                  <span className="hover:text-amber-700 cursor-pointer">Hijabs</span>
                  <span className="hover:text-amber-700 cursor-pointer">Kaftans</span>
                  <span className="hover:text-amber-700 cursor-pointer">Co-Ords</span>
                  <span className="hover:text-amber-700 cursor-pointer">Sale</span>
                </nav>
              )}

              {/* Action Icons */}
              <div className="flex items-center gap-4 text-slate-700">
                <i className="ri-search-line text-lg cursor-pointer hover:text-amber-700" />
                <i className="ri-user-3-line text-lg cursor-pointer hover:text-amber-700" />
                <div className="relative cursor-pointer">
                  <i className="ri-shopping-bag-line text-lg hover:text-amber-700" />
                  <span className="absolute -top-1.5 -right-2 bg-amber-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                </div>
              </div>
            </header>

            {/* 3. HERO SLIDESHOW / BANNER */}
            <div className="relative bg-slate-900 text-white min-h-[360px] flex items-center justify-center overflow-hidden">
              <img
                src={
                  banners[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop"
                }
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
              />
              <div className="relative z-10 text-center max-w-xl px-6 py-12">
                <Tag color="#beaa8d" className="text-slate-900 font-bold border-none mb-3 px-3 py-0.5 uppercase text-[11px] tracking-widest">
                  {banners[0]?.badgeText || "Autumn / Eid 2026 Collection"}
                </Tag>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 leading-tight">
                  {banners[0]?.title || "Timeless Modesty, Modern Grace"}
                </h1>
                <p className="text-sm text-slate-200 mb-6 font-light">
                  {banners[0]?.subtitle || "Handcrafted luxury abayas crafted with bespoke French crepe and intricate embroidery."}
                </p>
                <div className="flex justify-center gap-3">
                  <button className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full shadow-lg transition">
                    {banners[0]?.buttonText || "Shop Collection"}
                  </button>
                  <button className="border border-white/80 hover:bg-white hover:text-slate-900 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full transition">
                    View Lookbook
                  </button>
                </div>
              </div>
            </div>

            {/* 4. VALUE PROPS / TRUST BADGES */}
            <div className="bg-slate-50 border-y border-slate-200 py-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <i className="ri-truck-line text-amber-700 text-xl" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Nationwide Express</p>
                  <p className="text-[10px] text-slate-500">Free above ৳2500</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="ri-shield-check-line text-amber-700 text-xl" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">100% Authentic</p>
                  <p className="text-[10px] text-slate-500">Premium Fabrics</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="ri-arrow-go-back-line text-amber-700 text-xl" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Easy 7-Day Return</p>
                  <p className="text-[10px] text-slate-500">Hassle-free exchange</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <i className="ri-customer-service-2-line text-amber-700 text-xl" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Dedicated Support</p>
                  <p className="text-[10px] text-slate-500">24/7 WhatsApp Help</p>
                </div>
              </div>
            </div>

            {/* 5. CURATED COLLECTIONS GRID */}
            <div className="py-10 px-6 max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                  Curated Collections
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                  Explore Handcrafted Aesthetics
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    title: "Luxury Abayas",
                    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop",
                    count: "24 Items",
                  },
                  {
                    title: "Chiffon Hijabs",
                    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
                    count: "18 Items",
                  },
                  {
                    title: "Festive Kaftans",
                    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
                    count: "12 Items",
                  },
                  {
                    title: "Everyday Modest",
                    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
                    count: "30 Items",
                  },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden shadow-sm aspect-[3/4] bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={col.img}
                      alt={col.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                      <p className="font-serif font-bold text-sm tracking-wide">{col.title}</p>
                      <p className="text-[10px] text-slate-300">{col.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. BEST SELLER PRODUCTS WITH QUICK ADD */}
            <div className="py-8 px-6 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-end mb-6 max-w-6xl mx-auto">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">Featured Releases</h3>
                  <p className="text-xs text-slate-500">Most coveted pieces of the season</p>
                </div>
                <button className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1">
                  View All <ArrowRightOutlined className="text-[10px]" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {[
                  {
                    title: "Noor Midnight Velvet Abaya",
                    price: "৳ 4,250",
                    originalPrice: "৳ 5,000",
                    badge: "Best Seller",
                    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
                  },
                  {
                    title: "Zahra Floral Embroidered Kaftan",
                    price: "৳ 3,650",
                    originalPrice: "৳ 4,200",
                    badge: "New",
                    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
                  },
                  {
                    title: "Silk Crepe Modest Co-Ord Set",
                    price: "৳ 2,950",
                    originalPrice: "৳ 3,500",
                    badge: "Trending",
                    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop",
                  },
                  {
                    title: "Medina Pleated Chiffon Hijab",
                    price: "৳ 850",
                    originalPrice: "৳ 1,100",
                    badge: "Save 25%",
                    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group"
                  >
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <Tag
                        color="#beaa8d"
                        className="absolute top-2 left-2 text-[9px] font-bold text-slate-900 border-none px-2 py-0.5"
                      >
                        {item.badge}
                      </Tag>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-slate-950">{item.price}</span>
                          <span className="text-xs text-slate-400 line-through">{item.originalPrice}</span>
                        </div>
                      </div>

                      <button className="mt-3 w-full bg-slate-900 hover:bg-amber-700 text-white text-[11px] font-semibold py-2 rounded-lg transition uppercase tracking-wider">
                        + Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. FOOTER */}
            <footer className="bg-slate-900 text-slate-300 py-10 px-6 text-xs border-t border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div>
                  <h4 className="font-serif text-white font-bold text-base mb-2">
                    {settings?.storeName || "TABAYA"}
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Contemporary modest wear tailored for perfection. Crafted with premium imported fabrics.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] mb-2 tracking-wider">Shop</h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>New Arrivals</li>
                    <li>Premium Abayas</li>
                    <li>Modest Sets</li>
                    <li>Hijab Accessories</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] mb-2 tracking-wider">Help & Guide</h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>Size & Fabric Guide</li>
                    <li>Track Your Order</li>
                    <li>Shipping & Returns</li>
                    <li>Contact Us</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] mb-2 tracking-wider">Stay In Touch</h5>
                  <p className="text-slate-400 text-[11px] mb-2">
                    Subscribe for exclusive drops and Eid VIP promotions.
                  </p>
                  <div className="flex gap-1">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-white text-xs w-full focus:outline-none"
                    />
                    <button className="bg-amber-600 px-3 py-1.5 rounded text-white font-semibold text-xs">
                      Join
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 text-center text-slate-500 text-[10px]">
                {settings?.copyrightText || `© ${new Date().getFullYear()} Tabaya Modest Wear. All Rights Reserved.`}
              </div>
            </footer>
          </div>
        </div>
      </Card>
    </div>
  );
}
