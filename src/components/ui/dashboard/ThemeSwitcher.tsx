"use client";
import React, { useState } from "react";
import { Drawer, Tooltip, Divider, Segmented, Select, Tabs } from "antd";
import {
  BgColorsOutlined, CheckOutlined, FontSizeOutlined,
  BorderOutlined, FontColorsOutlined,
} from "@ant-design/icons";
import { useAppTheme, DesignOptions, FONT_LIST, FontFamily } from "@/context/ThemeContext";

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-2 mt-4">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{icon} {title}</span>
  </div>
);

export default function ThemeSwitcher() {
  const { theme, themes, setTheme, design, setDesign } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Classic", "Modern", "Bold", "Elegant"];

  const filteredThemes = activeCategory === "All"
    ? themes
    : themes.filter((t) => t.category === activeCategory);

  return (
    <>
      {/* Trigger button in header */}
      <Tooltip title="Theme & Design Settings (20 Themes)" placement="bottom">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all hover:shadow-md cursor-pointer"
          style={{ borderColor: theme.primaryColor, background: "#f8fafc" }}
        >
          <BgColorsOutlined style={{ fontSize: 16, color: theme.primaryColor }} />
        </button>
      </Tooltip>

      {/* Settings Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <span className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
              <BgColorsOutlined style={{ color: theme.primaryColor }} /> 20 Themes & Design Studio
            </span>
            <span className="text-xs font-normal text-slate-400">
              {themes.length} Presets
            </span>
          </div>
        }
        placement="right"
        width={380}
        open={open}
        onClose={() => setOpen(false)}
        styles={{
          body: { padding: "0 16px 24px", background: "#ffffff" },
          header: { background: "#ffffff", borderBottom: "1px solid #e2e8f0" },
        }}
      >
        {/* ─── FONT FAMILY CHANGER ─────────────────────── */}
        <SectionTitle icon={<FontColorsOutlined />} title="Font Family" />
        <Select
          value={design.fontFamily}
          onChange={(val: FontFamily) => setDesign({ fontFamily: val })}
          className="w-full"
          options={FONT_LIST.map((f) => ({
            label: <span style={{ fontFamily: f.value }}>{f.label}</span>,
            value: f.value,
          }))}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Font changes apply instantly across the whole ERP interface.
        </p>

        {/* ─── FONT SIZE ─────────────────────────── */}
        <SectionTitle icon={<FontSizeOutlined />} title="Text Size" />
        <Segmented
          block
          value={design.fontSize}
          onChange={(v) => setDesign({ fontSize: v as DesignOptions["fontSize"] })}
          options={[
            { label: "Small (11px)", value: "small" },
            { label: "Normal (12px)", value: "medium" },
            { label: "Large (13px)", value: "large" },
          ]}
        />

        {/* ─── BORDER RADIUS / CORNERS ───────────── */}
        <SectionTitle icon={<BorderOutlined />} title="Corner Style" />
        <div className="grid grid-cols-3 gap-2">
          {(["sharp", "rounded", "pill"] as const).map((r) => {
            const labels = { sharp: "Sharp (2px)", rounded: "Rounded (6px)", pill: "Soft (10px)" };
            const radii = { sharp: "2px", rounded: "6px", pill: "10px" };
            const isActive = design.borderRadius === r;
            return (
              <button
                key={r}
                onClick={() => setDesign({ borderRadius: r })}
                className="flex flex-col items-center gap-1 p-2 border-2 transition-all cursor-pointer"
                style={{
                  borderColor: isActive ? theme.primaryColor : "#e2e8f0",
                  background: isActive ? theme.bgBase : "#ffffff",
                  borderRadius: "6px",
                }}
              >
                <div
                  className="w-8 h-4 border-2 border-dashed"
                  style={{
                    borderColor: isActive ? theme.primaryColor : "#94a3b8",
                    borderRadius: radii[r],
                  }}
                />
                <span className="text-[11px] font-medium" style={{ color: isActive ? theme.primaryColor : "#475569" }}>
                  {labels[r]}
                </span>
              </button>
            );
          })}
        </div>

        <Divider style={{ borderColor: "#e2e8f0", margin: "16px 0 12px" }} />

        {/* ─── 20 COLOR & DESIGN THEMES ─────────────────────── */}
        <div className="flex items-center justify-between mb-2">
          <SectionTitle icon={<BgColorsOutlined />} title="20 Color & Design Themes" />
        </div>

        {/* Category Filters */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-3 custom_scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-full border whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-slate-800 text-white border-slate-800 font-medium"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredThemes.map((t) => {
            const isActive = t.key === theme.key;
            return (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className="relative flex flex-col items-start p-2.5 rounded-lg border-2 transition-all hover:shadow-sm text-left cursor-pointer"
                style={{
                  borderColor: isActive ? t.primaryColor : "#e2e8f0",
                  background: isActive ? t.bgBase : "#ffffff",
                }}
              >
                {/* Visual Swatch */}
                <div className="flex gap-1 mb-1.5 w-full">
                  <div className="h-5 flex-1 rounded-sm shadow-inner" style={{ background: t.primaryColor }} />
                  <div
                    className="h-5 w-5 rounded-sm border border-slate-200"
                    style={{ background: t.sidebarBg !== "#ffffff" ? t.sidebarBg : t.bgBase }}
                    title={t.sidebarBg !== "#ffffff" ? "Dark Sidebar" : "Light Sidebar"}
                  />
                </div>

                <div className="text-xs font-semibold truncate w-full" style={{ color: isActive ? t.primaryColor : "#1e293b" }}>
                  {t.emoji} {t.name}
                </div>

                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span>{t.category}</span>
                  {t.sidebarBg !== "#ffffff" && (
                    <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-600">Dark Nav</span>
                  )}
                </div>

                {isActive && (
                  <div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    style={{ background: t.primaryColor }}
                  >
                    <CheckOutlined style={{ fontSize: 9, color: "#fff" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <Divider style={{ borderColor: "#e2e8f0", margin: "20px 0 12px" }} />

        {/* ─── RESET ─────────────────────────────── */}
        <button
          onClick={() => {
            localStorage.removeItem("gb_design_font_manual");
            setTheme("forest");
            setDesign({ fontSize: "medium", borderRadius: "rounded", fontFamily: "Poppins" });
          }}
          className="w-full py-2 text-xs font-medium rounded-lg border border-slate-200 transition-all hover:bg-slate-50 text-slate-600 cursor-pointer"
        >
          ↺ Reset to Original Forest Green
        </button>
      </Drawer>
    </>
  );
}
