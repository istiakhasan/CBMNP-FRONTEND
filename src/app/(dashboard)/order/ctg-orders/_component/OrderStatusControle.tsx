"use client";
import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";
import {
	useApprovedOrderMutation,
	useGetAllOrderStatusQuery,
} from "@/redux/api/orderApi";
import { message } from "antd";
import React, { useRef, useState } from "react";

const OrderStatusControle = ({ toggleEdit, id }: any) => {
	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [approvedOrderHandler] = useApprovedOrderMutation();

	const { data: orderStatus } = useGetAllOrderStatusQuery(undefined);

	const toggleDropdownOrderStatus = () => {
		setDropdownOpen(!isDropdownOpen);
	};
	return (
		<GbForm
			submitHandler={async (data: any) => {
				const res = await approvedOrderHandler({
					id: id,
					data: { orderStatusValue: data?.orderStatus?.value },
				}).unwrap();
				if (res) {
					toggleEdit();
					message.success("success");
				}
			}}
		>
			<div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 shadow-lg bg-white p-8 rounded-lg">
				<div className="flex flex-col space-y-4">
					<div className="flex items-start justify-between space-x-8 capitalize text-sm">
						<div className="flex flex-col space-y-2">
							<p>order id</p>
							<p className=" text-[#969696]">3425453454</p>
						</div>
						<div className="flex flex-col space-y-2">
							<p>phone number</p>
							<p className=" text-[#969696]">12834834585</p>
						</div>
					</div>
					<div>
						{/* <h2 className=" capitalize">order status</h2> */}
						<div>
							<div className={`w-full gap-4 py-3`} ref={dropdownRef}>
								{/* <div className="w-full flex items-center justify-between gap-x-4">
									<div
										onClick={toggleDropdownOrderStatus}
										className="w-full flex items-center justify-between shadow-md pl-2 font-medium cursor-pointer rounded py-3 bg-[#F6F6F6] capitalize"
									>
										<div className="text-sm capitalize">
											Select Order Status
										</div>
										<div>
											{!isDropdownOpen ? (
												<IoIosArrowDown className=" mx-4 font-medium text-lg" />
											) : (
												<IoIosArrowUp className="mx-4 font-medium text-lg" />
											)}
										</div>
									</div>
								</div> */}
								<GbFormSelect
									name="orderStatus"
									label="Order Status"
									options={orderStatus?.map((item: any) => {
										return { label: item?.name, value: item?.value };
									})}
								/>
								{/* <div className="w-full relative">
									<div className="w-full">
										<div
											className={`w-full absolute shadow-lg bg-white top-1 left-0 flex flex-col items-start rounded-sm z-40 smooth-animation ${
												isDropdownOpen ? "opacity-100" : "hidden opacity-0"
											}`}
										>
											<ul className="w-full capitalize">
												<li className="w-full py-2 px-3 border-b text-xs border-borderLine bg-brandServiceBg hover:text-[#ffffff] hover:bg-[#F68821] hover:opacity-90 transition-all duration-500 ease-in-out"></li>
												<li className="w-full py-2 px-3 border-b text-xs border-borderLine bg-brandServiceBg hover:text-[#ffffff] hover:bg-[#F68821] hover:opacity-90 transition-all duration-500 ease-in-out">
													CTG-Packing
												</li>
												<li className="w-full py-2 px-3 border-b text-xs border-borderLine bg-brandServiceBg hover:text-[#ffffff] hover:bg-[#F68821] hover:opacity-90 transition-all duration-500 ease-in-out">
													CTG-Ready To Ship
												</li>
												<li className="w-full py-2 px-3 border-b text-xs border-borderLine bg-brandServiceBg hover:text-[#ffffff] hover:bg-[#F68821] hover:opacity-90 transition-all duration-500 ease-in-out">
													CTG-Delivered
												</li>
												<li className="w-full py-2 px-3 border-b text-xs border-borderLine bg-brandServiceBg hover:text-[#ffffff] hover:bg-[#F68821] hover:opacity-90 transition-all duration-500 ease-in-out">
													CTG-Returned
												</li>
											</ul>
										</div>
									</div>
								</div> */}
							</div>
						</div>
					</div>
					<div className=" flex items-center justify-between">
						<button
							className=" w-[64px] h-[32px] capitalize bg-[#4E9EFC] rounded"
							onClick={toggleEdit}
						>
							back
						</button>
						<button className=" w-[64px] h-[32px] capitalize bg-[#4E9EFC] rounded">
							done
						</button>
					</div>
				</div>
			</div>
		</GbForm>
	);
};

export default OrderStatusControle;
