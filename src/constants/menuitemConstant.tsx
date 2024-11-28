import { MenuProps } from "antd";
import Link from "next/link";
type MenuItem = Required<MenuProps>["items"][number];
export const agentMenu: MenuItem[] = [
	// {
	// 	key: "Order",
	// 	label: <p className="text-[14px]">Order</p>,
	// 	icon: (
	// 		<div>
	// 			<i style={{ fontSize: "18px" }} className="ri-file-list-3-fill"></i>
	// 		</div>
	// 	),
	// 	children: [
	// 		{
	// 			key: "/order/order-submission",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/order-submission"}>
	// 					Submit Order
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/pending-orders",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/pending-orders"}>
	// 					Pending Orders
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/approved-orders",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/approved-orders"}>
	// 					Approved Orders
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/order-list",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/all-orders"}>
	// 					All Orders
	// 				</Link>
	// 			),
	// 		},
	// 	],
	// },
	{
		key: "/employee/profile",
		label: (
			<Link href={"/employee/profile"}>
				{" "}
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

	// {
	// 	key: "Order",
	// 	label: <p className="text-[14px]">Order</p>,
	// 	icon: (
	// 		<div>
	// 			<i style={{ fontSize: "18px" }} className="ri-file-list-3-fill"></i>
	// 		</div>
	// 	),
	// 	children: [
	// 		{
	// 			key: "/order/order-submission",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/order-submission"}>
	// 					Submit Order
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/pending-orders",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/pending-orders"}>
	// 					Pending Orders
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/approved-orders",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/approved-orders"}>
	// 					Approved Orders
	// 				</Link>
	// 			),
	// 		},
	// 		{
	// 			key: "/order/order-list",
	// 			label: (
	// 				<Link className=" text-[14px]" href={"/order/all-orders"}>
	// 					All Orders
	// 				</Link>
	// 			),
	// 		},
	// 	],
	// },
];
export const menuItem: MenuItem[] = [
	// {
	//   key: "/profile",
	//   label: <Link style={{fontSize:"14px"}} className="text-[14px]" href={"/profile"}>Dashboard</Link>,
	//   icon:<i style={{fontSize:"18px"}} className="ri-layout-2-fill "></i>,
	// },
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
			// {
			//   key:"Ready For Shipping",
			//   label:<Link className="ml-[30px] text-[14px]" href={"/"}>Ready For Shipping</Link>,
			// },
			// {
			//   key:"Order In-transit",
			//   label:<Link className="ml-[30px] text-[14px]" href={"/"}>Order In-transit</Link>,
			// },
			// {
			//   key:"Order Transfer",
			//   label:<Link className="ml-[30px] text-[14px]" href={"/"}>Order Transfer</Link>,
			// },
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
			// {
			//   key:"/settings/product-category/sub-category",
			//   label:<Link className="ml-[30px]" href={"/settings/product-category/sub-category"}>Sub Category</Link>,
			// },
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
				{" "}
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
				key: "/inventory/product-receive",
				label: (
					<Link className=" text-[14px]" href={"/inventory/product-receive"}>
						Product Receive
					</Link>
				),
			},
			{
				key: "/inventory/stock-information",
				label: (
					<Link className=" text-[14px]" href={"/subscription/stock-information"}>
						Stock Information
					</Link>
				),
			},
		],
	},
];
export const hrMenuList: MenuItem[] = [
	{
		key: "/employee/profile",
		label: (
			<Link href={"/employee/profile"}>
				{" "}
				<p>Manage Employee</p>
			</Link>
		),
		icon: <i style={{ fontSize: "18px" }} className="ri-team-fill"></i>,
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
	if (role == "ctgadmin") {
		return ctgMenu;
	}
	return menuItem;
};
