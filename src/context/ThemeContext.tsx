"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";

// ─── Theme Definitions ──────────────────────────────────────────────────────
export interface AppTheme {
  key: string;
  name: string;
  emoji: string;
  category: "Classic" | "Modern" | "Bold" | "Elegant";
  primaryColor: string;
  primaryHover: string;
  bgLight: string;
  bgBase: string;
  sidebarBg: string;
  sidebarText: string;
  headerBg: string;
  cardBg: string;
  secondaryText: string;
  borderColor: string;
  textPrimary: string;
  defaultFont?: string;
  defaultRadius?: BorderRadius;
}

export const THEMES: AppTheme[] = [
  // ── 1. Classic & Enterprise ───────────────────────────────────────────
  {
    key: "forest",
    name: "Forest Green (Default)",
    emoji: "🌿",
    category: "Classic",
    primaryColor: "#4F8A6D",
    primaryHover: "#3e6e56",
    bgLight: "#ffffff",
    bgBase: "#f4f8f6",
    sidebarBg: "#ffffff",
    sidebarText: "#306178",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Poppins",
    defaultRadius: "rounded",
  },
  {
    key: "ocean",
    name: "Ocean Blue",
    emoji: "🌊",
    category: "Classic",
    primaryColor: "#1a73e8",
    primaryHover: "#1557b0",
    bgLight: "#ffffff",
    bgBase: "#f0f7ff",
    sidebarBg: "#ffffff",
    sidebarText: "#1557b0",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Inter",
    defaultRadius: "rounded",
  },
  {
    key: "slate",
    name: "Slate Pro",
    emoji: "🪨",
    category: "Classic",
    primaryColor: "#334155",
    primaryHover: "#1e293b",
    bgLight: "#ffffff",
    bgBase: "#f8fafc",
    sidebarBg: "#1e293b",
    sidebarText: "#94a3b8",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#64748b",
    borderColor: "#e2e8f0",
    textPrimary: "#0f172a",
    defaultFont: "Inter",
    defaultRadius: "sharp",
  },
  {
    key: "royal-purple",
    name: "Royal Purple",
    emoji: "💜",
    category: "Classic",
    primaryColor: "#7c3aed",
    primaryHover: "#6d28d9",
    bgLight: "#ffffff",
    bgBase: "#f5f3ff",
    sidebarBg: "#ffffff",
    sidebarText: "#6d28d9",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Poppins",
    defaultRadius: "rounded",
  },
  {
    key: "sunset",
    name: "Sunset Orange",
    emoji: "🌅",
    category: "Classic",
    primaryColor: "#ea6c00",
    primaryHover: "#c25400",
    bgLight: "#ffffff",
    bgBase: "#fff7ed",
    sidebarBg: "#ffffff",
    sidebarText: "#9a3412",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Plus Jakarta Sans",
    defaultRadius: "rounded",
  },

  // ── 2. Modern & Tech ─────────────────────────────────────────────────
  {
    key: "nordic-cyan",
    name: "Nordic Cyan",
    emoji: "❄️",
    category: "Modern",
    primaryColor: "#0284c7",
    primaryHover: "#0369a1",
    bgLight: "#ffffff",
    bgBase: "#f0f9ff",
    sidebarBg: "#ffffff",
    sidebarText: "#0369a1",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Plus Jakarta Sans",
    defaultRadius: "pill",
  },
  {
    key: "emerald-mint",
    name: "Emerald Mint",
    emoji: "🍃",
    category: "Modern",
    primaryColor: "#059669",
    primaryHover: "#047857",
    bgLight: "#ffffff",
    bgBase: "#ecfdf5",
    sidebarBg: "#ffffff",
    sidebarText: "#047857",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Outfit",
    defaultRadius: "pill",
  },
  {
    key: "indigo-wave",
    name: "Indigo Wave",
    emoji: "🔮",
    category: "Modern",
    primaryColor: "#4f46e5",
    primaryHover: "#4338ca",
    bgLight: "#ffffff",
    bgBase: "#eef2ff",
    sidebarBg: "#ffffff",
    sidebarText: "#3730a3",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Inter",
    defaultRadius: "rounded",
  },
  {
    key: "electric-violet",
    name: "Electric Violet",
    emoji: "⚡",
    category: "Modern",
    primaryColor: "#8b5cf6",
    primaryHover: "#7c3aed",
    bgLight: "#ffffff",
    bgBase: "#f5f3ff",
    sidebarBg: "#ffffff",
    sidebarText: "#6d28d9",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Outfit",
    defaultRadius: "pill",
  },
  {
    key: "dark-slate-pro",
    name: "Dark Tech Sidebar",
    emoji: "🖤",
    category: "Modern",
    primaryColor: "#38bdf8",
    primaryHover: "#0ea5e9",
    bgLight: "#ffffff",
    bgBase: "#f8fafc",
    sidebarBg: "#0f172a",
    sidebarText: "#94a3b8",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#0f172a",
    defaultFont: "Inter",
    defaultRadius: "rounded",
  },

  // ── 3. Bold & Vibrant ────────────────────────────────────────────────
  {
    key: "ruby-crimson",
    name: "Ruby Crimson",
    emoji: "❤️",
    category: "Bold",
    primaryColor: "#e11d48",
    primaryHover: "#be123c",
    bgLight: "#ffffff",
    bgBase: "#fff1f2",
    sidebarBg: "#ffffff",
    sidebarText: "#9f1239",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Poppins",
    defaultRadius: "rounded",
  },
  {
    key: "amber-gold",
    name: "Amber Gold",
    emoji: "✨",
    category: "Bold",
    primaryColor: "#d97706",
    primaryHover: "#b45309",
    bgLight: "#ffffff",
    bgBase: "#fffbeb",
    sidebarBg: "#ffffff",
    sidebarText: "#92400e",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Plus Jakarta Sans",
    defaultRadius: "rounded",
  },
  {
    key: "fuchsia-neon",
    name: "Fuchsia Glow",
    emoji: "💖",
    category: "Bold",
    primaryColor: "#c026d3",
    primaryHover: "#a21caf",
    bgLight: "#ffffff",
    bgBase: "#fdf4ff",
    sidebarBg: "#ffffff",
    sidebarText: "#86198f",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Outfit",
    defaultRadius: "pill",
  },
  {
    key: "tangerine",
    name: "Tangerine Flare",
    emoji: "🍊",
    category: "Bold",
    primaryColor: "#f97316",
    primaryHover: "#ea580c",
    bgLight: "#ffffff",
    bgBase: "#fff7ed",
    sidebarBg: "#ffffff",
    sidebarText: "#c2410c",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Poppins",
    defaultRadius: "rounded",
  },
  {
    key: "cobalt-blue",
    name: "Deep Cobalt",
    emoji: "🔷",
    category: "Bold",
    primaryColor: "#2563eb",
    primaryHover: "#1d4ed8",
    bgLight: "#ffffff",
    bgBase: "#eff6ff",
    sidebarBg: "#ffffff",
    sidebarText: "#1e40af",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Inter",
    defaultRadius: "rounded",
  },

  // ── 4. Elegant & Minimal ─────────────────────────────────────────────
  {
    key: "clean-teal",
    name: "Clean Teal",
    emoji: "🩵",
    category: "Elegant",
    primaryColor: "#0d9488",
    primaryHover: "#0f766e",
    bgLight: "#ffffff",
    bgBase: "#f0fdfa",
    sidebarBg: "#ffffff",
    sidebarText: "#115e59",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Outfit",
    defaultRadius: "pill",
  },
  {
    key: "rose-elegance",
    name: "Rose Elegance",
    emoji: "🌸",
    category: "Elegant",
    primaryColor: "#db2777",
    primaryHover: "#be185d",
    bgLight: "#ffffff",
    bgBase: "#fdf2f8",
    sidebarBg: "#ffffff",
    sidebarText: "#9d174d",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Plus Jakarta Sans",
    defaultRadius: "rounded",
  },
  {
    key: "charcoal-minimal",
    name: "Charcoal Minimal",
    emoji: "✒️",
    category: "Elegant",
    primaryColor: "#18181b",
    primaryHover: "#27272a",
    bgLight: "#ffffff",
    bgBase: "#fafafa",
    sidebarBg: "#ffffff",
    sidebarText: "#52525b",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#71717a",
    borderColor: "#e4e4e7",
    textPrimary: "#09090b",
    defaultFont: "Inter",
    defaultRadius: "sharp",
  },
  {
    key: "sage-green",
    name: "Sage Botanical",
    emoji: "🌱",
    category: "Elegant",
    primaryColor: "#15803d",
    primaryHover: "#166534",
    bgLight: "#ffffff",
    bgBase: "#f0fdf4",
    sidebarBg: "#ffffff",
    sidebarText: "#166534",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    defaultFont: "Poppins",
    defaultRadius: "rounded",
  },
  {
    key: "corporate-navy",
    name: "Executive Navy",
    emoji: "👔",
    category: "Elegant",
    primaryColor: "#1e3a8a",
    primaryHover: "#172554",
    bgLight: "#ffffff",
    bgBase: "#eff6ff",
    sidebarBg: "#172554",
    sidebarText: "#93c5fd",
    headerBg: "#ffffff",
    cardBg: "#ffffff",
    secondaryText: "#475569",
    borderColor: "#e2e8f0",
    textPrimary: "#0f172a",
    defaultFont: "Roboto",
    defaultRadius: "rounded",
  },
];

// ─── Design Options ───────────────────────────────────────────────────────────
export type FontSize = "small" | "medium" | "large";
export type FontWeight = "regular" | "medium" | "semibold";
export type BorderRadius = "sharp" | "rounded" | "pill";
export type TableDensity = "compact" | "comfortable" | "spacious";
export type TableLayoutMode = "auto" | "fixed";
export type FontFamily =
  | "Poppins"
  | "Inter"
  | "Plus Jakarta Sans"
  | "Outfit"
  | "Roboto"
  | "DM Sans"
  | "Manrope"
  | "Montserrat"
  | "Nunito"
  | "Raleway"
  | "Open Sans"
  | "Lato"
  | "Quicksand"
  | "Space Grotesk"
  | "Fira Code";

export interface DesignOptions {
  fontSize: FontSize;
  fontWeight: FontWeight;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  tableDensity: TableDensity;
  tableLayout: TableLayoutMode;
  tableStriped: boolean;
  tableBordered: boolean;
  tableFullHeight: boolean;
}

export const FONT_LIST: { label: string; value: FontFamily }[] = [
  { label: "Poppins (Default)", value: "Poppins" },
  { label: "Inter (Modern Tech)", value: "Inter" },
  { label: "Plus Jakarta Sans (Sleek SaaS)", value: "Plus Jakarta Sans" },
  { label: "Outfit (Clean Geometric)", value: "Outfit" },
  { label: "Roboto (Classic Enterprise)", value: "Roboto" },
  { label: "DM Sans (Modern Professional)", value: "DM Sans" },
  { label: "Manrope (Bold Premium)", value: "Manrope" },
  { label: "Montserrat (Urban Corporate)", value: "Montserrat" },
  { label: "Nunito (Rounded Friendly)", value: "Nunito" },
  { label: "Raleway (Elegant Minimal)", value: "Raleway" },
  { label: "Open Sans (Clean Neutral)", value: "Open Sans" },
  { label: "Lato (Warm & Balanced)", value: "Lato" },
  { label: "Quicksand (Soft Curved)", value: "Quicksand" },
  { label: "Space Grotesk (Futuristic Tech)", value: "Space Grotesk" },
  { label: "Fira Code (Developer Monospace)", value: "Fira Code" },
];

const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 11,
  medium: 12,
  large: 13,
};

const FONT_WEIGHT_MAP: Record<FontWeight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

const BORDER_RADIUS_MAP: Record<BorderRadius, number> = {
  sharp: 2,
  rounded: 6,
  pill: 10,
};

const TABLE_DENSITY_MAP: Record<
  TableDensity,
  { cellPaddingBlock: number; cellPaddingInline: number; rowHeight: number }
> = {
  compact: { cellPaddingBlock: 5, cellPaddingInline: 8, rowHeight: 32 },
  comfortable: { cellPaddingBlock: 8, cellPaddingInline: 12, rowHeight: 40 },
  spacious: { cellPaddingBlock: 12, cellPaddingInline: 16, rowHeight: 48 },
};

const DEFAULT_DESIGN: DesignOptions = {
  fontSize: "medium",
  fontWeight: "regular",
  borderRadius: "rounded",
  fontFamily: "Poppins",
  tableDensity: "comfortable",
  tableLayout: "fixed",
  tableStriped: false,
  tableBordered: false,
  tableFullHeight: true,
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (key: string) => void;
  themes: AppTheme[];
  design: DesignOptions;
  setDesign: (opts: Partial<DesignOptions>) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
  design: DEFAULT_DESIGN,
  setDesign: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeKey, setActiveKey] = useState<string>("forest");
  const [design, setDesignState] = useState<DesignOptions>(DEFAULT_DESIGN);

  useEffect(() => {
    const savedTheme = localStorage.getItem("gb_theme");
    if (savedTheme && THEMES.find((t) => t.key === savedTheme)) {
      setActiveKey(savedTheme);
    }
    const savedDesign = localStorage.getItem("gb_design");
    if (savedDesign) {
      try {
        setDesignState({ ...DEFAULT_DESIGN, ...JSON.parse(savedDesign) });
      } catch {}
    }
  }, []);

  const theme = THEMES.find((t) => t.key === activeKey) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    const fs = FONT_SIZE_MAP[design.fontSize];
    const fw = FONT_WEIGHT_MAP[design.fontWeight];
    const br = BORDER_RADIUS_MAP[design.borderRadius];
    const tableDensity = TABLE_DENSITY_MAP[design.tableDensity];

    root.style.setProperty("--primaryColor", theme.primaryColor);
    root.style.setProperty("--primaryHover", theme.primaryHover);
    root.style.setProperty("--bglight", theme.bgLight);
    root.style.setProperty("--bgbase", theme.bgBase);
    root.style.setProperty("--secondaryText", theme.secondaryText);
    root.style.setProperty("--sidebarBg", theme.sidebarBg);
    root.style.setProperty("--sidebarText", theme.sidebarText);
    root.style.setProperty("--headerBg", theme.headerBg);
    root.style.setProperty("--cardBg", theme.cardBg);
    root.style.setProperty("--borderColor", theme.borderColor);
    root.style.setProperty("--textPrimary", theme.textPrimary);
    root.style.setProperty("--fontFamily", `"${design.fontFamily}", sans-serif`);
    root.style.setProperty("--app-font-size", `${fs}px`);
    root.style.setProperty("--app-font-weight", `${fw}`);
    root.style.setProperty("--radius-sm", `${br}px`);
    root.style.setProperty("--radius-md", `${br + 2}px`);
    root.style.setProperty("--radius-lg", `${br + 4}px`);
    root.style.setProperty("--table-cell-padding-y", `${tableDensity.cellPaddingBlock}px`);
    root.style.setProperty("--table-cell-padding-x", `${tableDensity.cellPaddingInline}px`);
    root.style.setProperty("--table-row-height", `${tableDensity.rowHeight}px`);
    root.style.setProperty("--table-header-font-weight", `${Math.max(fw, 600)}`);
    root.style.setProperty("--table-fill-height", "calc(100vh - 260px)");

    // Dynamic global style tag injection to force font family override on all tags & Ant Design while preserving icon fonts
    let fontStyleEl = document.getElementById("gb-dynamic-font-override") as HTMLStyleElement;
    if (!fontStyleEl) {
      fontStyleEl = document.createElement("style");
      fontStyleEl.id = "gb-dynamic-font-override";
      document.head.appendChild(fontStyleEl);
    }
    fontStyleEl.innerHTML = `
      *:not(i):not([class*="ri-"]):not(.anticon):not(.anticon *),
      *::before:not(i *):not([class*="ri-"] *):not(.anticon *),
      *::after:not(i *):not([class*="ri-"] *):not(.anticon *),
      html, body, p, span:not([class*="ri-"]):not(.anticon):not(.anticon *),
      div:not(.anticon), h1, h2, h3, h4, h5, h6,
      button:not(.anticon), input, select, textarea, a:not(.anticon), table, tr, th, td, label,
      .ant-typography, .ant-btn:not(.anticon), .ant-table, .ant-input, .ant-select,
      .ant-card, .ant-menu, .ant-drawer, .ant-modal, .ant-tag {
        font-family: "${design.fontFamily}", sans-serif !important;
      }
      body, p, span:not([class*="ri-"]):not(.anticon):not(.anticon *),
      div:not(.anticon), button:not(.anticon), input, select, textarea, a:not(.anticon),
      table, tr, th, td, label,
      .ant-typography, .ant-btn:not(.anticon), .ant-table, .ant-input, .ant-select,
      .ant-card, .ant-menu, .ant-drawer, .ant-modal, .ant-tag {
        font-size: var(--app-font-size) !important;
      }
      body, p, span:not([class*="ri-"]):not(.anticon):not(.anticon *),
      div:not(.anticon), button:not(.anticon), input, select, textarea, a:not(.anticon),
      table, tr, th, td, label,
      .ant-typography, .ant-btn:not(.anticon), .ant-table, .ant-input, .ant-select,
      .ant-card, .ant-menu, .ant-drawer, .ant-modal, .ant-tag {
        font-weight: var(--app-font-weight);
      }
      h1, h2, h3, h4, h5, h6,
      strong, b, .font-bold, .font-semibold {
        font-weight: 600 !important;
      }
      .font-medium {
        font-weight: 500 !important;
      }
      .ant-table-wrapper .ant-table,
      .ant-table-wrapper .ant-table-cell,
      .gb-table .ant-table-cell {
        font-family: "${design.fontFamily}", sans-serif !important;
        font-size: var(--app-font-size) !important;
      }
      .ant-table-wrapper table,
      .gb-table table {
        table-layout: ${design.tableLayout} !important;
      }
      .gb-table-wrapper[data-full-height="true"] {
        min-height: var(--table-fill-height);
      }
      .gb-table-wrapper[data-full-height="true"] .ant-table-wrapper,
      .gb-table-wrapper[data-full-height="true"] .ant-spin-nested-loading,
      .gb-table-wrapper[data-full-height="true"] .ant-spin-container,
      .gb-table-wrapper[data-full-height="true"] .ant-table {
        min-height: var(--table-fill-height);
      }
      .gb-table-wrapper[data-full-height="true"] .ant-table-container,
      .gb-table-wrapper[data-full-height="true"] .ant-table-body {
        min-height: calc(var(--table-fill-height) - 52px);
      }
      .dashboard-content .ant-table-wrapper {
        min-height: ${design.tableFullHeight ? "min(640px, calc(100vh - 260px))" : "auto"};
      }
      .dashboard-content .ant-table-wrapper .ant-table {
        min-height: ${design.tableFullHeight ? "min(640px, calc(100vh - 260px))" : "auto"};
      }
      .ant-table-wrapper .ant-table-thead > tr > th,
      .gb-table .ant-table-thead > tr > th {
        font-weight: var(--table-header-font-weight) !important;
        padding: var(--table-cell-padding-y) var(--table-cell-padding-x) !important;
      }
      .ant-table-wrapper .ant-table-tbody > tr > td,
      .gb-table .ant-table-tbody > tr > td {
        font-weight: var(--app-font-weight) !important;
        min-height: var(--table-row-height);
        padding: var(--table-cell-padding-y) var(--table-cell-padding-x) !important;
      }
      .ant-table-wrapper .ant-table-tbody > tr:nth-child(even) > td,
      .gb-table .ant-table-tbody > tr:nth-child(even) > td {
        background: ${design.tableStriped ? "color-mix(in srgb, var(--bgbase) 58%, white)" : "#ffffff"} !important;
      }
      .ant-table-wrapper .ant-table-container,
      .gb-table .ant-table-container {
        border: ${design.tableBordered ? "1px solid var(--borderColor)" : "0"} !important;
      }
      .ant-table-wrapper .ant-table-cell,
      .gb-table .ant-table-cell {
        border-inline-end: ${design.tableBordered ? "1px solid var(--borderColor)" : "0"} !important;
      }
      /* Protect RemixIcon & AntDesign icons */
      i[class*="ri-"], [class^="ri-"], [class*=" ri-"], .anticon, .anticon * {
        font-family: inherit;
      }
      i[class*="ri-"]::before, [class^="ri-"]::before, [class*=" ri-"]::before {
        font-family: "remixicon" !important;
      }
    `;

    root.setAttribute("data-theme", theme.key);
    if (theme.sidebarBg !== "#ffffff") {
      root.setAttribute("data-dark-sidebar", "true");
    } else {
      root.removeAttribute("data-dark-sidebar");
    }
  }, [theme, design]);

  const setTheme = (key: string) => {
    const target = THEMES.find((t) => t.key === key);
    setActiveKey(key);
    localStorage.setItem("gb_theme", key);

    // If the theme has a custom default font or radius and user hasn't overridden manually
    if (target?.defaultFont && !localStorage.getItem("gb_design_font_manual")) {
      setDesignState((prev) => {
        const next = {
          ...prev,
          fontFamily: (target.defaultFont as FontFamily) || prev.fontFamily,
          borderRadius: target.defaultRadius || prev.borderRadius,
        };
        localStorage.setItem("gb_design", JSON.stringify(next));
        return next;
      });
    }
  };

  const setDesign = (opts: Partial<DesignOptions>) => {
    if (opts.fontFamily) {
      localStorage.setItem("gb_design_font_manual", "true");
    }
    setDesignState((prev) => {
      const next = { ...prev, ...opts };
      localStorage.setItem("gb_design", JSON.stringify(next));
      return next;
    });
  };

  const fs = FONT_SIZE_MAP[design.fontSize];
  const br = BORDER_RADIUS_MAP[design.borderRadius];
  const tableDensity = TABLE_DENSITY_MAP[design.tableDensity];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, design, setDesign }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.primaryColor,
            fontFamily: `"${design.fontFamily}", sans-serif`,
            fontSize: fs,
            borderRadius: br,
            colorText: "#1e293b",
            colorTextSecondary: "#64748b",
            colorBorder: "#e2e8f0",
            colorBgContainer: "#ffffff",
          },
          components: {
            Table: {
              headerBg: "#f8fafc",
              headerColor: "#0f172a",
              borderColor: "#e2e8f0",
              fontSize: fs,
              cellFontSize: fs,
              headerBorderRadius: br,
              cellPaddingBlock: tableDensity.cellPaddingBlock,
              cellPaddingInline: tableDensity.cellPaddingInline,
              cellPaddingBlockSM: Math.max(tableDensity.cellPaddingBlock - 2, 3),
              cellPaddingInlineSM: Math.max(tableDensity.cellPaddingInline - 2, 6),
              rowHoverBg: "#f1f5f9",
            },
            Button: {
              borderRadius: br,
              fontSize: fs,
            },
            Card: {
              colorBgContainer: "#ffffff",
              borderRadius: br,
            },
            Menu: {
              colorItemBgSelected: theme.primaryColor,
              colorItemTextSelected: "#ffffff",
              fontSize: fs,
            },
            Input: {
              borderRadius: br,
              fontSize: fs,
            },
            Select: {
              borderRadius: br,
              fontSize: fs,
            },
            Tag: {
              borderRadius: br,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
