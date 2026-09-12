"use client";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { toggleSidebar } from "@/redux/feature/menuSlice";
import { RootState } from "@/redux/store";
import { getUserInfo } from "@/service/authService";
import { Tooltip } from "antd";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
interface MenuItem {
  href: string;
  title: string;
  icon: string;
  children?: any;
}

const GbSidebar = () => {
  const userInfo: any = getUserInfo();
  const rstate=useSelector((state:RootState)=>state.menu)
  const dispatch=useDispatch()
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  const menuItems: any[] = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: "ri-bar-chart-box-line",
    },
    {
      href: "/orders",
      title: "Orders",
      icon: "ri-shopping-bag-3-line",
    },
    {
      href: "/inventory",
      title: "Inventory",
      icon: "ri-store-3-line",
      children: [
        {
          href: "/inventory",
          title: "Stock & Movement Logs",
        },
        {
          href: "/inventory/adjustments",
          title: "Stock Adjustments",
        },
        {
          href: "/inventory/transfers",
          title: "Stock Transfers",
        },
        {
          href: "/inventory/valuation",
          title: "Valuation & Low Stock",
        },
      ],
    },
    {
      href: "/products",
      title: "Products",
      icon: "ri-box-3-line",
    },
    {
      href: "/access",
      title: "Access",
      icon: "ri-git-repository-private-line",
      children: [
        {
          href: "/access/users",
          title: "Users",
        },
        //  {
        //   href:"/access/group-permission",
        //   title:"Group Permission"
        //  }
      ],
    },
    {
      href: "/requisition",
      title: "Requisitions",
      icon: "ri-store-2-line",
      children: [
        {
          href: "/requisition/manage",
          title: "Manage Requisitions",
        },
      ],
    },

    {
      href: "/warehouse",
      title: "Warehouse",
      icon: "ri-map-pin-line ",
    },
    {
      href: "/delivery-partner",
      title: "Delivery Partner",
      icon: "ri-truck-line",
    },
    {
      href: "/procurement",
      title: "Procurement",
      icon: "ri-luggage-cart-line",
      children: [
        {
          href: "/procurement/direct-purchase",
          title: "Direct Purchase",
        },
        {
          href: "/procurement/purchase-order",
          title: "Purchase Orders",
        },
        {
          href: "/procurement/purchase-approved",
          title: "Purchase Approved",
        },
        {
          href: "/procurement/purchase-receive",
          title: "Purchase Receive",
        },
        {
          href: "/procurement/grn",
          title: "Goods Receipt (GRN & QA)",
        },
        {
          href: "/procurement/purchase-completed",
          title: "Purchase Completed",
        },
        {
          href: "/procurement/purchase-cancel",
          title: "Purchase Canceled",
        },
        {
          href: "/procurement/returns",
          title: "Purchase Returns",
        },
        {
          href: "/procurement/supplier",
          title: "Suppliers Directory",
        },
        {
          href: "/procurement/purchase-report",
          title: "Purchase Reports",
        },
      ],
    },
    {
      href: "/garments",
      title: "Garments ERP",
      icon: "ri-t-shirt-2-line",
      children: [
        {
          href: "/garments",
          title: "Garments Dashboard",
        },
        {
          href: "/garments/orders",
          title: "Buyer Orders",
        },
        {
          href: "/garments/samples",
          title: "Sample Development",
        },
        {
          href: "/garments/bom",
          title: "Bill of Materials (BOM)",
        },
        {
          href: "/garments/po",
          title: "Purchase Orders (PO)",
        },
        {
          href: "/garments/po-approval",
          title: "PO Approvals",
        },
        {
          href: "/garments/po-receive",
          title: "Goods Inward & Receive",
        },
        {
          href: "/garments/inventory",
          title: "Fabric & Trims Inventory",
        },
        {
          href: "/garments/inventory-adjustments",
          title: "Stock Adjustments",
        },
        {
          href: "/garments/material-issue",
          title: "Floor Material Issue",
        },
      ],
    },
    {
      href: "/customers",
      title: "Customers",
      icon: "ri-group-line",
    },
    {
      href: "/configuration",
      title: "Configuration",
      icon: "ri-settings-2-line",
      children: [
        {
          href: "/configuration/category",
          title: "Category",
        },
      ],
    },
    {
      href: "/pos",
      title: "Pos",
      icon: "ri-computer-line",
    },
    {
      href: "/accounting",
      title: "Accounting",
      icon: "ri-money-dollar-circle-line",
      children: [
        {
          href: "/accounting/chart-of-accounts",
          title: "Chart of Accounts",
        },
        {
          href: "/accounting/journal-entries",
          title: "Journal Vouchers",
        },
        {
          href: "/accounting/general-ledger",
          title: "General Ledger",
        },
        {
          href: "/accounting/trial-balance",
          title: "Trial Balance",
        },
        {
          href: "/accounting/profit-loss",
          title: "Profit & Loss",
        },
        {
          href: "/accounting/balance-sheet",
          title: "Balance Sheet",
        },
      ],
    },
    {
      href: "/finance",
      title: "Finance & Banking",
      icon: "ri-bank-card-line",
      children: [
        {
          href: "/finance/bank-accounts",
          title: "Bank & MFS Accounts",
        },
        {
          href: "/finance/expenses",
          title: "Expenses",
        },
        {
          href: "/finance/fund-transfer",
          title: "Fund Transfers",
        },
        {
          href: "/finance/customer-aging",
          title: "Customer Aging (AR)",
        },
        {
          href: "/finance/supplier-bills",
          title: "Supplier Bills (AP)",
        },
      ],
    },
    {
      title: "Sales Ops & POS",
      icon: "ri-shopping-cart-2-line",
      children: [
        {
          href: "/sales/quotations",
          title: "Quotations / Estimates",
        },
        {
          href: "/sales/coupons",
          title: "Coupons & Promos",
        },
        {
          href: "/pos-session",
          title: "POS Register Shifts",
        },
      ],
    },
    {
      title: "HR & Payroll",
      icon: "ri-user-star-line",
      children: [
        {
          href: "/hr/employees",
          title: "Employee Directory",
        },
        {
          href: "/hr/attendance",
          title: "Daily Attendance",
        },
        {
          href: "/hr/leaves",
          title: "Leave Management",
        },
        {
          href: "/hr/payroll",
          title: "Monthly Payroll",
        },
        {
          href: "/hr/loans",
          title: "Advance Salary & Loans",
        },
        {
          href: "/hr/claims",
          title: "Expense Claims",
        },
        {
          href: "/hr/recruitment",
          title: "Recruitment & ATS",
        },
        {
          href: "/hr/assets",
          title: "Asset Management",
        },
        {
          href: "/hr/performance",
          title: "Commissions & Targets",
        },
        {
          href: "/hr/setup",
          title: "HR Setup & Biometrics",
        },
      ],
    },
    {
      title: "Logistics Ops",
      icon: "ri-truck-line",
      children: [
        {
          href: "/logistics/routing",
          title: "Courier Routing Rules",
        },
        {
          href: "/logistics/settlements",
          title: "COD Settlements",
        },
      ],
    },
    {
      title: "Governance & Audit",
      icon: "ri-shield-check-line",
      children: [
        {
          href: "/governance/branches",
          title: "Branches & Outlets",
        },
        {
          href: "/governance/audit-logs",
          title: "System Audit Trail",
        },
        {
          href: "/activity-logs",
          title: "Activity Logs",
        },
        {
          href: "/settings/notifications",
          title: "SMS & Notifications",
        },
      ],
    },
    {
      href: "/reports",
      title: "Reports",
      icon: "ri-folder-chart-line",
      children: [
        {
          href: "/reports",
          title: "Reports Hub (All)",
        },
        {
          href: "/reports/sales-reports",
          title: "Sales Reports",
        },
        {
          href: "/reports/product-sales-report",
          title: "Product Sales Reports",
        },
        {
          href: "/reports/area-sales-report",
          title: "Area & Regional Sales",
        },
        {
          href: "/reports/inventory-valuation-report",
          title: "Inventory Valuation & Aging",
        },
        {
          href: "/reports/customer-aging-report",
          title: "Customer Aging (AR)",
        },
        {
          href: "/reports/supplier-aging-report",
          title: "Supplier Bills Aging (AP)",
        },
        {
          href: "/reports/expense-analysis-report",
          title: "Operating Expense Analysis",
        },
        {
          href: "/reports/courier-reconciliation-report",
          title: "Courier COD Reconciliation",
        },
        {
          href: "/reports/customer-retention-report",
          title: "Customer Retention Report",
        },
        {
          href: "/reports/top-customers",
          title: "Top Customers",
        },
        {
          href: "/reports/shipment-report",
          title: "Shipment Report",
        },
      ],
    },
    // {
    //   href: "/TbTest",
    //   title: "TbTest",
    //   icon: "ri-folder-chart-line",
    // },
  ].filter(
    (mi: any) => {
      const userRole = String(userInfo?.role || "").toLowerCase();
      const isSuperOrAdmin = ["admin", "super_admin", "owner"].includes(userRole);
      if (isSuperOrAdmin) return true;

      if (permission?.includes(mi.title)) return true;
      if (mi.title === "Garments ERP" && (permission?.includes("Garments") || permission?.includes("Garments ERP") || permission?.includes("VIEW_GARMENTS_ORDERS"))) {
        return true;
      }
      return mi.children?.some((child: any) => permission?.includes(child.title));
    }
  );

  const pathName = usePathname();
  const local = useLocale();
  const [isActive, setIsActive] = useState(true);
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Strip locale prefix from current URL path
  const cleanPath = React.useMemo(() => {
    if (!pathName) return "/";
    const regex = new RegExp(`^/${local}(?=/|$)`);
    const stripped = pathName.replace(regex, "");
    return stripped === "" ? "/" : stripped;
  }, [pathName, local]);

  // Find the exact or most specific matching leaf route
  const activeLeafHref = React.useMemo(() => {
    const allLeafHrefs: string[] = [];
    menuItems.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item.children.forEach((c: any) => {
          if (c.href) allLeafHrefs.push(c.href);
        });
      } else if (item.href) {
        allLeafHrefs.push(item.href);
      }
    });

    // 1. Exact match with a leaf item
    if (allLeafHrefs.includes(cleanPath)) {
      return cleanPath;
    }

    // 2. Longest prefix match with '/' boundary (for dynamic sub-routes)
    const matching = allLeafHrefs
      .filter((h) => h !== "/" && cleanPath.startsWith(h + "/"))
      .sort((a, b) => b.length - a.length);

    return matching[0] || cleanPath;
  }, [cleanPath, menuItems]);

  // Auto-expand the active section based on current activeLeafHref
// Stop navigation loader whenever the actual route changes
useEffect(() => {
  setLoading(false);
}, [pathName]);

// Auto-expand active menu
useEffect(() => {
  menuItems.forEach((item, index) => {
    if (item.children) {
      const hasActiveChild = item.children.some(
        (child: any) => child?.href === activeLeafHref
      );

      if (hasActiveChild) {
        setOpenMenus((prev) => ({
          ...prev,
          [index]: true,
        }));
      }
    }
  });
}, [activeLeafHref]);

  const toggleSubMenu = (index: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

const handleButtonClick = (path: string) => {
  if (!path) return;

  const targetPath = path.startsWith("/") ? path : `/${path}`;

  if (cleanPath === targetPath) return;

  setLoading(true);

  const targetUrl = `/${local}${targetPath}`;
  router.push(targetUrl);
};

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(toggleSidebar({ show: false }));
        setIsActive(false);
      } else {
        dispatch(toggleSidebar({ show: true }));
        setIsActive(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {loading && <Loader />}
      {rstate?.toggle && (
        <aside
          className={`gb_sidebar sticky top-0 ${
            isActive ? "show overflow-y-scroll h-[100vh]" : "hide h-fit"
          }`}
        >
          <div className="toggle_btn flex items-center justify-between">
            <i
              onClick={() => setIsActive(!isActive)}
              className="ri-menu-fill hidden md:block cursor-pointer text-gray-700 hover:text-emerald-700 transition"
            ></i>
            <i
              onClick={() => dispatch(toggleSidebar({ show: false }))}
              className="ri-close-large-fill md:hidden cursor-pointer text-gray-700"
            ></i>
          </div>

          <div className="menu_list_wraper space-y-1">
            {menuItems?.map((item, index) => {
              const hasChildren = item?.children && item.children.length > 0;
              const isChildActive =
                hasChildren &&
                item.children.some((child: any) => child?.href === activeLeafHref);
              const isDirectActive = !hasChildren && item?.href === activeLeafHref;
              const isParentActive = isChildActive || isDirectActive;
              const isOpen = openMenus[index] || false;

              return (
                <Fragment key={index}>
                  {hasChildren ? (
                    <div className="relative group rounded-md">
                      <Tooltip
                        placement="right"
                        title={isActive ? "" : item.title}
                      >
                        <div
                          onClick={() => toggleSubMenu(index)}
                          className={`cursor-pointer menu_list flex items-center justify-between rounded-md transition-all duration-200 px-3 py-2.5 ${
                            isParentActive
                              ? "bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                          }`}
                        >
                          <div className="flex items-center min-w-0">
                            <i className={`${item.icon} text-[18px] shrink-0`}></i>
                            {isActive && (
                              <span className="ml-3 text-[13px] font-medium truncate">
                                {item.title}
                              </span>
                            )}
                          </div>

                          {isActive && (
                            <i
                              className={`ri-arrow-down-s-line text-[16px] text-gray-400 transition-transform duration-300 shrink-0 ml-2 ${
                                isOpen ? "rotate-180 text-emerald-600 font-bold" : ""
                              }`}
                            ></i>
                          )}
                        </div>
                      </Tooltip>

                      {/* Expanded Submenu for Active Sidebar */}
                      {isActive && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-[800px] opacity-100 my-1" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="border-l-2 border-emerald-200 ml-5 pl-2.5 space-y-1">
                            {item?.children?.map((child: any, count: number) => {
                              const isSubActive = child?.href === activeLeafHref;
                              return (
                                <div
                                  key={count}
                                  onClick={() => handleButtonClick(child?.href)}
                                  className={`cursor-pointer px-2.5 py-1.5 rounded-md text-[12px] flex items-center justify-between transition-colors ${
                                    isSubActive
                                      ? "bg-emerald-600 text-white font-semibold shadow-sm"
                                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <i
                                      className={`ri-corner-down-right-line text-[11px] ${
                                        isSubActive ? "text-white" : "text-gray-400"
                                      }`}
                                    ></i>
                                    <span className="truncate">{child?.title}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Flyout Submenu for Collapsed Sidebar */}
                      {!isActive && (
                        <div
                          className={`sub_menu_collaps shadow-xl rounded-lg p-2 ${
                            isOpen ? "active" : ""
                          }`}
                        >
                          <div className="text-xs font-bold text-gray-900 border-b pb-1.5 mb-2 px-2">
                            {item.title}
                          </div>
                          {item?.children?.map((child: any, count: number) => {
                            const isSubActive = child?.href === activeLeafHref;
                            return (
                              <div
                                key={count}
                                onClick={() => handleButtonClick(child?.href)}
                                className={`cursor-pointer px-3 py-1.5 rounded text-[12px] whitespace-nowrap transition ${
                                  isSubActive
                                    ? "bg-emerald-600 text-white font-semibold"
                                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                                }`}
                              >
                                {child?.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => handleButtonClick(item?.href)}
                      key={index}
                      className="cursor-pointer"
                    >
                      <Tooltip
                        placement="right"
                        title={isActive ? "" : item.title}
                      >
                        <div
                          className={`menu_list flex items-center rounded-md px-3 py-2.5 transition-all duration-200 ${
                            isParentActive
                              ? "bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                          }`}
                        >
                          <i className={`${item.icon} text-[18px] shrink-0`}></i>
                          {isActive && (
                            <span className="ml-3 text-[13px] font-medium truncate">
                              {item.title}
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </aside>
      )}
    </>
  );
};

export default GbSidebar;

export const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[1000001]">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #343434;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
