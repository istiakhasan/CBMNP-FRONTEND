// lib/route-permissions.ts

export interface RoutePermission {
  href: string;
  requiredPermission: string;
}

export const routePermissionMap: RoutePermission[] = [
  { href: "/dashboard", requiredPermission: "Dashboard" },

  { href: "/orders", requiredPermission: "Orders" },

  { href: "/inventory", requiredPermission: "Inventory" },
  { href: "/inventory/adjustments", requiredPermission: "Inventory" },
  { href: "/inventory/transfers", requiredPermission: "Inventory" },
  { href: "/inventory/valuation", requiredPermission: "Inventory" },

  { href: "/products", requiredPermission: "Products" },

  { href: "/access", requiredPermission: "Access" },
  { href: "/access/users", requiredPermission: "Access" },

  { href: "/requisition", requiredPermission: "Requisitions" },
  { href: "/requisition/manage", requiredPermission: "Requisitions" },

  { href: "/warehouse", requiredPermission: "Warehouse" },

  { href: "/delivery-partner", requiredPermission: "Delivery Partner" },

  { href: "/procurement", requiredPermission: "Procurement" },
  { href: "/procurement/direct-purchase", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-order", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-approved", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-receive", requiredPermission: "Procurement" },
  { href: "/procurement/grn", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-completed", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-cancel", requiredPermission: "Procurement" },
  { href: "/procurement/returns", requiredPermission: "Procurement" },
  { href: "/procurement/supplier", requiredPermission: "Procurement" },
  { href: "/procurement/purchase-report", requiredPermission: "Procurement" },

//   { href: "/garments", requiredPermission: "Garments ERP" },
//   { href: "/garments/orders", requiredPermission: "Garments ERP" },
//   { href: "/garments/samples", requiredPermission: "Garments ERP" },
//   { href: "/garments/bom", requiredPermission: "Garments ERP" },
//   { href: "/garments/po", requiredPermission: "Garments ERP" },
//   { href: "/garments/po-approval", requiredPermission: "Garments ERP" },
//   { href: "/garments/po-receive", requiredPermission: "Garments ERP" },
//   { href: "/garments/inventory", requiredPermission: "Garments ERP" },
//   { href: "/garments/inventory-adjustments", requiredPermission: "Garments ERP" },
//   { href: "/garments/material-issue", requiredPermission: "Garments ERP" },
  { href: "/garments", requiredPermission: "Garments" },
  { href: "/garments/orders", requiredPermission: "Garments" },
  { href: "/garments/samples", requiredPermission: "Garments" },
  { href: "/garments/bom", requiredPermission: "Garments" },
  { href: "/garments/po", requiredPermission: "Garments" },
  { href: "/garments/po-approval", requiredPermission: "Garments" },
  { href: "/garments/po-receive", requiredPermission: "Garments" },
  { href: "/garments/inventory", requiredPermission: "Garments" },
  { href: "/garments/inventory-adjustments", requiredPermission: "Garments" },
  { href: "/garments/material-issue", requiredPermission: "Garments" },
  { href: "/customers", requiredPermission: "Customers" },

  { href: "/configuration", requiredPermission: "Configuration" },
  { href: "/configuration/category", requiredPermission: "Configuration" },

  { href: "/pos", requiredPermission: "Pos" },

  { href: "/accounting", requiredPermission: "Accounting" },
  { href: "/accounting/chart-of-accounts", requiredPermission: "Accounting" },
  { href: "/accounting/journal-entries", requiredPermission: "Accounting" },
  { href: "/accounting/general-ledger", requiredPermission: "Accounting" },
  { href: "/accounting/trial-balance", requiredPermission: "Accounting" },
  { href: "/accounting/profit-loss", requiredPermission: "Accounting" },
  { href: "/accounting/balance-sheet", requiredPermission: "Accounting" },

  { href: "/finance", requiredPermission: "Finance & Banking" },
  { href: "/finance/bank-accounts", requiredPermission: "Finance & Banking" },
  { href: "/finance/expenses", requiredPermission: "Finance & Banking" },
  { href: "/finance/fund-transfer", requiredPermission: "Finance & Banking" },
  { href: "/finance/customer-aging", requiredPermission: "Finance & Banking" },
  { href: "/finance/supplier-bills", requiredPermission: "Finance & Banking" },

  { href: "/sales/quotations", requiredPermission: "Sales Ops & POS" },
  { href: "/sales/coupons", requiredPermission: "Sales Ops & POS" },
  { href: "/pos-session", requiredPermission: "Sales Ops & POS" },

//   { href: "/hr/dashboard", requiredPermission: "HR & Payroll" },
//   { href: "/hr/employees", requiredPermission: "HR & Payroll" },
//   { href: "/hr/attendance", requiredPermission: "HR & Payroll" },
//   { href: "/hr/leaves", requiredPermission: "HR & Payroll" },
//   { href: "/hr/overtime", requiredPermission: "HR & Payroll" },
//   { href: "/hr/payroll", requiredPermission: "HR & Payroll" },
//   { href: "/hr/loans", requiredPermission: "HR & Payroll" },
//   { href: "/hr/claims", requiredPermission: "HR & Payroll" },
//   { href: "/hr/recruitment", requiredPermission: "HR & Payroll" },
//   { href: "/hr/letters", requiredPermission: "HR & Payroll" },
//   { href: "/hr/assets", requiredPermission: "HR & Payroll" },
//   { href: "/hr/performance", requiredPermission: "HR & Payroll" },
//   { href: "/hr/training", requiredPermission: "HR & Payroll" },
//   { href: "/hr/transfers", requiredPermission: "HR & Payroll" },
//   { href: "/hr/disciplinary", requiredPermission: "HR & Payroll" },
//   { href: "/hr/announcements", requiredPermission: "HR & Payroll" },
//   { href: "/hr/reports", requiredPermission: "HR & Payroll" },
//   { href: "/hr/setup", requiredPermission: "HR & Payroll" },
{ href: "/hr/dashboard", requiredPermission: "HR" },
  { href: "/hr/employees", requiredPermission: "HR" },
  { href: "/hr/attendance", requiredPermission: "HR" },
  { href: "/hr/leaves", requiredPermission: "HR" },
  { href: "/hr/overtime", requiredPermission: "HR" },
  { href: "/hr/payroll", requiredPermission: "HR" },
  { href: "/hr/loans", requiredPermission: "HR" },
  { href: "/hr/claims", requiredPermission: "HR" },
  { href: "/hr/recruitment", requiredPermission: "HR" },
  { href: "/hr/letters", requiredPermission: "HR" },
  { href: "/hr/assets", requiredPermission: "HR" },
  { href: "/hr/performance", requiredPermission: "HR" },
  { href: "/hr/training", requiredPermission: "HR" },
  { href: "/hr/transfers", requiredPermission: "HR" },
  { href: "/hr/disciplinary", requiredPermission: "HR" },
  { href: "/hr/announcements", requiredPermission: "HR" },
  { href: "/hr/reports", requiredPermission: "HR" },
  { href: "/hr/setup", requiredPermission: "HR" },
  { href: "/logistics/routing", requiredPermission: "Logistics Ops" },
  { href: "/logistics/settlements", requiredPermission: "Logistics Ops" },

  { href: "/governance/branches", requiredPermission: "Governance & Audit" },
  { href: "/governance/audit-logs", requiredPermission: "Governance & Audit" },
  { href: "/activity-logs", requiredPermission: "Governance & Audit" },
  { href: "/settings/notifications", requiredPermission: "Governance & Audit" },

  { href: "/reports", requiredPermission: "Reports" },
  { href: "/reports/sales-reports", requiredPermission: "Reports" },
  { href: "/reports/product-sales-report", requiredPermission: "Reports" },
  { href: "/reports/area-sales-report", requiredPermission: "Reports" },
  { href: "/reports/inventory-valuation-report", requiredPermission: "Reports" },
  { href: "/reports/customer-aging-report", requiredPermission: "Reports" },
  { href: "/reports/supplier-aging-report", requiredPermission: "Reports" },
  { href: "/reports/expense-analysis-report", requiredPermission: "Reports" },
  { href: "/reports/courier-reconciliation-report", requiredPermission: "Reports" },
  { href: "/reports/customer-retention-report", requiredPermission: "Reports" },
  { href: "/reports/top-customers", requiredPermission: "Reports" },
  { href: "/reports/shipment-report", requiredPermission: "Reports" },
];

/**
 * Longest-match strategy — একই যুক্তি sidebar-এর activeLeafHref খোঁজার মতো।
 * Route পাওয়া না গেলে null রিটার্ন করে (মানে public/unrestricted route,
 * অথবা তুমি map-এ যোগ করতে ভুলে গেছো — সেক্ষেত্রে explicitly handle করো)।
 */
export function getRequiredPermission(pathname: string): string | null {
  const matches = routePermissionMap.filter(
    (r) => pathname === r.href || pathname.startsWith(r.href + "/")
  );

  if (matches.length === 0) return null;

  matches.sort((a, b) => b.href.length - a.href.length);
  return matches[0].requiredPermission;
}

export const MASTER_ADMIN_ROLE = "master_admin";