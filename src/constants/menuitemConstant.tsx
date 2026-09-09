import { MenuProps } from "antd";
import Link from "next/link";
type MenuItem = Required<MenuProps>["items"][number];

export const agentMenu: MenuItem[] = [
	{
		key: "/employee/profile",
		label: (
			<Link href={"/employee/profile"}>
				<p>Dashboard</p>
			</Link>
		),
		icon: <i style={{ fontSize: "18px" }} className="ri-team-fill"></i>,
	},
	{
		key: "Subscription",
		label: <p className="text-[14px]">Subscription</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-shield-user-fill"></i>
			</div>
		),
		children: [
			{
				key: "/subscription/register",
				label: (
					<Link className=" text-[14px]" href={"/subscription/register"}>
						Create new subscription 
					</Link>
				),
			},
			{
				key: "/subscription/customer_list",
				label: (
					<Link className=" text-[14px]" href={"/subscription/customer_list"}>
						Subscriber list
					</Link>
				),
			},
		],
	},
];

export const menuItem: MenuItem[] = [
	{
		key: "Order",
		label: <p className="text-[14px]">Order</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-file-list-3-fill"></i>
			</div>
		),
		children: [
			{
				key: "/order/details-orders",
				label: (
					<Link className=" text-[14px]" href={"/order/details-orders"}>
						Details Order
					</Link>
				),
			},
			{
				key: "/order/order-submission",
				label: (
					<Link className=" text-[14px]" href={"/order/order-submission"}>
						Submit Order
					</Link>
				),
			},
			{
				key: "/order/pending-orders",
				label: (
					<Link className=" text-[14px]" href={"/order/pending-orders"}>
						Pending Orders
					</Link>
				),
			},
			{
				key: "/order/approved-orders",
				label: (
					<Link className=" text-[14px]" href={"/order/approved-orders"}>
						Approved Orders
					</Link>
				),
			},
			{
				key: "/order/order-list",
				label: (
					<Link className=" text-[14px]" href={"/order/all-orders"}>
						All Orders
					</Link>
				),
			},
			{
				key: "/order/ctg-orders",
				label: (
					<Link className=" text-[14px]" href={"/order/ctg-orders"}>
						Chittagong orders
					</Link>
				),
			},
		],
	},
	{
		key: "Store",
		label: <p>Store</p>,
		icon: <i style={{ fontSize: "18px" }} className="ri-store-2-fill"></i>,
		children: [
			{
				key: "/store/order-requisition",
				label: (
					<Link
						className="ml-[30px] text-[14px]"
						href={"/store/order-requisition"}
					>
						Order Requisition
					</Link>
				),
			},
			{
				key: "Order Packing",
				label: (
					<Link className="ml-[30px] text-[14px]" href={"/store/order-packing"}>
						Order Packing
					</Link>
				),
			},
		],
	},
	{
		key: "Product",
		label: (
			<Link className="text-[14px]" href={"/product"}>
				Product
			</Link>
		),
		icon: <i style={{ fontSize: "18px" }} className="ri-box-1-line"></i>,
	},
	{
		key: "Inventory",
		label: <p className="text-[14px]">Inventory</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-store-3-fill"></i>
			</div>
		),
		children: [
			{
				key: "/inventory",
				label: (
					<Link className=" text-[14px]" href={"/inventory"}>
						Stock & Movement Logs
					</Link>
				),
			},
			{
				key: "/inventory/adjustments",
				label: (
					<Link className=" text-[14px]" href={"/inventory/adjustments"}>
						Stock Adjustments
					</Link>
				),
			},
			{
				key: "/inventory/transfers",
				label: (
					<Link className=" text-[14px]" href={"/inventory/transfers"}>
						Stock Transfers
					</Link>
				),
			},
			{
				key: "/inventory/valuation",
				label: (
					<Link className=" text-[14px]" href={"/inventory/valuation"}>
						Valuation & Low Stock
					</Link>
				),
			},
		],
	},
	{
		key: "Procurement",
		label: <p className="text-[14px]">Procurement</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-luggage-cart-fill"></i>
			</div>
		),
		children: [
			{
				key: "/procurement/direct-purchase",
				label: (
					<Link className=" text-[14px]" href={"/procurement/direct-purchase"}>
						Direct Purchase
					</Link>
				),
			},
			{
				key: "/procurement/purchase-order",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-order"}>
						Purchase Orders
					</Link>
				),
			},
			{
				key: "/procurement/purchase-approved",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-approved"}>
						Purchase Approved
					</Link>
				),
			},
			{
				key: "/procurement/purchase-receive",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-receive"}>
						Purchase Receive
					</Link>
				),
			},
			{
				key: "/procurement/grn",
				label: (
					<Link className=" text-[14px]" href={"/procurement/grn"}>
						Goods Receipt (GRN & QA)
					</Link>
				),
			},
			{
				key: "/procurement/purchase-completed",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-completed"}>
						Purchase Completed
					</Link>
				),
			},
			{
				key: "/procurement/purchase-cancel",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-cancel"}>
						Purchase Canceled
					</Link>
				),
			},
			{
				key: "/procurement/returns",
				label: (
					<Link className=" text-[14px]" href={"/procurement/returns"}>
						Purchase Returns
					</Link>
				),
			},
			{
				key: "/procurement/supplier",
				label: (
					<Link className=" text-[14px]" href={"/procurement/supplier"}>
						Suppliers Directory
					</Link>
				),
			},
			{
				key: "/procurement/purchase-report",
				label: (
					<Link className=" text-[14px]" href={"/procurement/purchase-report"}>
						Purchase Reports
					</Link>
				),
			},
		],
	},
	{
		key: "Settings",
		label: <p>Settings</p>,
		icon: <i style={{ fontSize: "18px" }} className="ri-settings-fill"></i>,
		children: [
			{
				key: "/settings/product-category",
				label: (
					<Link
						className="ml-[30px] text-[14px]"
						href={"/settings/product-category"}
					>
						Product Category
					</Link>
				),
			},
			{
				key: "/settings/brand",
				label: (
					<Link className="ml-[30px] text-[14px]" href={"/settings/brand"}>
						Brand
					</Link>
				),
			},
			{
				key: "/settings/vendor",
				label: (
					<Link className="ml-[30px] text-[14px]" href={"/settings/vendor"}>
						Vendor
					</Link>
				),
			},
			{
				key: "/settings/office",
				label: (
					<Link className="ml-[30px] text-[14px]" href={"/settings/office"}>
						Office
					</Link>
				),
			},
			{
				key: "/settings/department",
				label: (
					<Link className="ml-[30px] text-[14px]" href={"/settings/department"}>
						Deparement
					</Link>
				),
			},
		],
	},
	{
		key: "/employee/profile",
		label: (
			<Link href={"/employee/profile"}>
				<p>Employee</p>
			</Link>
		),
		icon: <i style={{ fontSize: "18px" }} className="ri-team-fill"></i>,
	},
	{
		key: "Subscription",
		label: <p className="text-[14px]">Subscription</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-shield-user-fill"></i>
			</div>
		),
		children: [
			{
				key: "/subscription/register",
				label: (
					<Link className=" text-[14px]" href={"/subscription/register"}>
						Create new subscription 
					</Link>
				),
			},
			{
				key: "/subscription/customer_list",
				label: (
					<Link className=" text-[14px]" href={"/subscription/customer_list"}>
						Subscriber list
					</Link>
				),
			},
		],
	},
];

export const hrMenuList: MenuItem[] = [
	{
		key: "HR & Payroll",
		label: (
			<p>HR & Payroll</p>
		),
		icon: <i style={{ fontSize: "18px" }} className="ri-team-fill"></i>,
		children: [
			{
				key: "/hr/employees",
				label: (
					<Link className=" text-[14px]" href={"/hr/employees"}>
						Employee Directory
					</Link>
				),
			},
			{
				key: "/hr/attendance",
				label: (
					<Link className=" text-[14px]" href={"/hr/attendance"}>
						Daily Attendance
					</Link>
				),
			},
			{
				key: "/hr/leaves",
				label: (
					<Link className=" text-[14px]" href={"/hr/leaves"}>
						Leave Management
					</Link>
				),
			},
			{
				key: "/hr/payroll",
				label: (
					<Link className=" text-[14px]" href={"/hr/payroll"}>
						Monthly Payroll
					</Link>
				),
			},
			{
				key: "/hr/loans",
				label: (
					<Link className=" text-[14px]" href={"/hr/loans"}>
						Advance Salary & Loans
					</Link>
				),
			},
			{
				key: "/hr/claims",
				label: (
					<Link className=" text-[14px]" href={"/hr/claims"}>
						Expense Claims
					</Link>
				),
			},
			{
				key: "/hr/recruitment",
				label: (
					<Link className=" text-[14px]" href={"/hr/recruitment"}>
						Recruitment & ATS
					</Link>
				),
			},
			{
				key: "/hr/assets",
				label: (
					<Link className=" text-[14px]" href={"/hr/assets"}>
						Asset Management
					</Link>
				),
			},
			{
				key: "/hr/performance",
				label: (
					<Link className=" text-[14px]" href={"/hr/performance"}>
						Commissions & Targets
					</Link>
				),
			},
			{
				key: "/hr/setup",
				label: (
					<Link className=" text-[14px]" href={"/hr/setup"}>
						HR Setup & Biometrics
					</Link>
				),
			},
		],
	},
];

export const ctgMenu: MenuItem[] = [
	{
		key: "Order",
		label: <p className="text-[14px]">Order</p>,
		icon: (
			<div>
				<i style={{ fontSize: "18px" }} className="ri-file-list-3-fill"></i>
			</div>
		),
		children: [
			{
				key: "/order/ctg-orders",
				label: (
					<Link className=" text-[14px]" href={"/order/ctg-orders"}>
						Chittagong orders
					</Link>
				),
			},
		],
	},
];

export const getMenuItemByRole = (role: string) => {
	if (role === "agent") {
		return agentMenu;
	}
	if (role === "hr") {
		return hrMenuList;
	}
	if (role === "ctgadmin") {
		return ctgMenu;
	}
	return menuItem;
};
