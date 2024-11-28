"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import invoiceLogo from "../../../../../assets/images/invoice-logo.png";
import BarCodeComponent from "./BarCodeComponent";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import { useParams } from "next/navigation";
import { generatePdf } from "@/util/genaratePdf";

const CtgOrderInvoice = () => {
	const invoiceRef = useRef<HTMLDivElement>(null);

	const params = useParams();

	const numberToText = require("number-to-text");
	require("number-to-text/converters/en-us");

	const { data, isLoading } = useGetOrderByIdQuery({ id: params?.id });
	const deliveryCharge = data?.deliveryCharge;
	const totalPrice =
		data?.last_transaction?.totalPurchesAmount - deliveryCharge;
	const advanceAmount = data?.last_transaction?.totalPaidAmmount;
	const grandTotal = totalPrice + deliveryCharge - advanceAmount;
	const dueAmount = grandTotal - advanceAmount;

	const dueAmountInWords = numberToText.convertToText(dueAmount);

	if (isLoading) {
		return <div>loading....</div>;
	}

	const handleDownloadPdf = () => {
		const fileName = `Invoice_${data?.orderNumber || "default"}`;
		generatePdf("invoice", fileName);
	};

	return (
		<div className="max-w-[1280px] mx-auto">
			<button onClick={handleDownloadPdf}>Download PDF</button>
			<div id="invoice" ref={invoiceRef}>
				<div className="w-full">
					<Image
						src={invoiceLogo}
						alt=""
						width={28}
						height={28}
						className="mx-auto"
					/>
				</div>
				<div className=" mt-5">
					<p className=" uppercase text-lg flex items-center justify-center">
						order id: <span className=" font-bold">{data?.orderNumber}</span>
					</p>
					<div className="flex items-start justify-between">
						<div className=" capitalize">
							<h2 className=" capitalize">sender</h2>
							<div>
								<h3>{data?.customerName}</h3>
								<p>{data?.customerPhoneNumber}</p>
								<p>
									{data?.billingAddressDivision},{data?.billingAddressDistrict},
									{data?.billingAddressThana},{data?.billingAddressTextArea}
								</p>
							</div>
						</div>
						<div>
							<h2 className=" capitalize">reciever</h2>
							<div>
								<h3>{data?.receiverName}</h3>
								<p>{data?.receiverPhoneNumber}</p>
								<p>
									{data?.shippingAddressDivision},
									{data?.shippingAddressDistrict},{data?.shippingAddressThana},
									{data?.shippingAddressTextArea}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className=" my-12">
					<table className="min-w-full bg-white border border-gray-200">
						<thead>
							<tr>
								<th className="px-4 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product Code
								</th>
								<th className="px-4 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product Name
								</th>
								<th className="px-4 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Quantity
								</th>
								<th className="px-4 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product Price
								</th>
								<th className="px-4 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.order_info.map((item: any) => (
								<tr key={item.id} className="text-xs">
									<td className="px-6 py-2 border-b border-gray-200">
										{item?.productCode}
									</td>
									<td className="px-6 py-2 border-b border-gray-200">
										{item?.productNameEn}
									</td>
									<td className="px-4 py-2 border-b border-gray-200">
										{item?.productQuantity}
									</td>
									<td className="px-4 py-2 border-b border-gray-200">
										{item?.singleProductPrices}
									</td>
									<td className="px-4 py-2 border-b border-gray-200">
										{item?.subTotal}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="w-full flex items-start justify-between">
					<div className="w-[60%] capitalize flex flex-col">
						<div>
							PaymentMethod :&nbsp;
							<span className=" uppercase font-semibold">
								{data?.last_transaction?.paymentMethods}
							</span>
						</div>
						<div className="flex items-start justify-start my-4 font-semibold">
							<p className=" capitalize">In Words:&nbsp;</p>
							<p className=" capitalize">{dueAmountInWords} taka</p>
						</div>
					</div>

					<div className="w-full flex flex-col items-end justify-end">
						<div className="w-[60%] capitalize flex items-start justify-between py-4 border-b border-gray-500">
							<div className="w-[60%] flex flex-col">
								<span>subtotal: </span>
								<span>discount: </span>
								<span>vat: </span>
								<span>delivery charge: </span>
							</div>
							<div className="w-[40%] px-4">
								<p className=" uppercase">
									bdt:&nbsp;
									<span>{totalPrice?.toFixed(2)}</span>
								</p>
								<p className=" uppercase">
									bdt:&nbsp;<span>00.00</span>
								</p>
								<p className=" uppercase">
									bdt:&nbsp;<span>00.00</span>
								</p>
								<p className=" uppercase">
									bdt:&nbsp;<span>{data?.deliveryCharge?.toFixed(2)}</span>
								</p>
							</div>
						</div>

						<div className="w-[60%] capitalize flex items-start justify-between border-b border-gray-500 py-4">
							<div className="w-[60%] flex flex-col">
								<span>Total Amount: </span>
								<span>Advance Amount: </span>
							</div>
							<div className="w-[40%] px-4">
								<p className=" uppercase">
									bdt:&nbsp;<span>{grandTotal?.toFixed(2)}</span>
								</p>
								<p className=" uppercase">
									bdt:&nbsp;
									<span>{advanceAmount?.toFixed(2)}</span>
								</p>
							</div>
						</div>
						<div className="w-[60%] capitalize flex items-start justify-between font-semibold py-2">
							<div className="w-[60%] flex flex-col">
								<span>due amount: </span>
							</div>
							<div className="w-[40%] px-4">
								<p className=" uppercase">
									bdt:&nbsp;<span>{dueAmount?.toFixed(2)}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full flex items-start justify-between my-4">
					<div className="w-full capitalize flex flex-col space-y-10 pt-12">
						<div className=" flex items-start justify-start">
							<p>currier info:</p>
							<p>SteadFast</p>
						</div>
						<div>
							<p>For any questions please contact us at +8809642922922</p>
						</div>
					</div>
					<div>
						<BarCodeComponent value="347982364978394234" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CtgOrderInvoice;
