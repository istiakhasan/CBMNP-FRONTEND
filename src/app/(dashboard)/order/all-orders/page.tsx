"use client";
import { useState, useRef } from "react";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useRouter } from "next/navigation";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbTable from "@/components/GbTable";
import { SearchOutlined } from "@ant-design/icons";

const Page = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const searchRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const { data, isLoading } = useGetAllOrdersQuery({
		page,
		limit: size,
		searchTerm,
	});

	const onPaginationChange = (page: number, pageSize: number) => {
		setPage(page);
		setSize(pageSize);
	};

	const handleSearch = () => {
		setSearchTerm(searchRef.current?.value || "");
	};

	const tableColumns = [
		{
			title: "Phone Number",
			dataIndex: "name1",
			render: (text: string, record: any) => (
				<span className="color_primary font-[500]">
					{record?.customerPhoneNumber}
				</span>
			),
		},
		{
			title: "Order ID",
			key: "orderId",
			render: (text: string, record: any) => (
				<span
					onClick={() => router.push(`/order/pending-orders/${record?.id}`)}
					className="color_primary font-[500] cursor-pointer"
				>
					{record?.orderNumber}
				</span>
			),
		},
		{
			title: "Name",
			key: "name",
			// align: 'center',
			render: (text: string, record: any) => (
				<h1 style={{ textAlign: "left" }}>{record?.customerName}</h1>
			),
		},
		{
			title: "Order Status",
			key: "orderStatus",
			align: "center",
			render: (_: any, record: any) => (
				<span className="processing_status">{record?.orderStatus?.name}</span>
			),
		},
		{
			title: "Payment Status",
			key: "paymentStatus",
			align: "center",
			render: (text: string, record: any) => (
				<span className="text-[#7D7D7D] font-[500]">
					{record?.transation_info[0]?.paymentMethods}
				</span>
			),
		},
		{
			title: "Price",
			key: "price",
			width: "60px",
			render: (text: string, record: any) => (
				<span className="text-[#7D7D7D] font-[500] text-center">
					{record?.transation_info[0]?.totalPurchesAmount}
				</span>
			),
		},
		{
			title: "Order Source",
			key: "orderSource",
			align: "end",
			render: (text: string, record: any) => (
				<span className="text-[#7D7D7D] font-[500]">
					{record?.orderFrom ? record?.orderFrom : "-"}
				</span>
			),
		},
	];

	return (
		<div>
			<GbHeader title={"All Orders"} />

			<div className="max-w-[494px] flex gap-2 items-center mb-[12px]">
				<div className="flex flex-1  items-center gap-[6px] bg-[#FFFFFF] p-[12px] rounded-[5px]">
					<SearchOutlined style={{ fontSize: "20px", color: "#BCBCBC" }} />
					<input
						ref={searchRef}
						style={{
							borderRadius: "4px",
							outline: "none",
							fontSize: "12px",
							fontWeight: "400",
							border: "none",
							background: "#FFFFFF",
							width: "100%",
						}}
						placeholder="Search by order id/phone number"
					/>
				</div>
				<button
					onClick={handleSearch}
					className="cm_button w-[86px] p-[10px] text-[12px] "
				>
					Search
				</button>
			</div>

			<GbTable
				loading={isLoading}
				columns={tableColumns}
				dataSource={data?.data}
				pageSize={data?.limit}
				totalPages={data?.totalCount}
				showPagination={true}
				onPaginationChange={onPaginationChange}
			/>
		</div>
	);
};

export default Page;
