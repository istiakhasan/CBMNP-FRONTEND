
import Link from "next/link";
import React from "react";
import sliderImage from "../../../../../assets/images/slider.svg";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { Image, message } from "antd";
import moment from "moment";
import { useDeleteSliderMutation } from "@/redux/api/sliderApi";
import GBconfirmModal from "@/components/ui/GbConfirmModal";

const Card = ({item}:{item:any}) => { 
	const [handleDeleteSlider]=useDeleteSliderMutation()
	return (
		<div className="h-[315px] w-[234px] p-4 rounded-xl shadow bg-[#FFFFFF]">
			<div>
				<div className="w-full flex items-start justify-between">
					<div className=" flex flex-col space-y-2 mb-9 w-[70%]">
						<h1 className=" capitalize font-medium text-sm">
							{item?.name}
						</h1>
						<p className=" text-xs">{moment(item?.created_at).format('MMM DD, YYYY')}</p>
						{/* <p className=" text-xs">June 19, 2024</p> */}
						{/* <p className="text-[10px] text-[#A2A2A2] capitalize">
							Category: <span>oil</span>
						</p> */}
					</div>
					<div>
						<div>
							<p className=" capitalize text-[8px] py-1 px-3 bg-[#00A4384D] text-[#00A438] rounded-full">
								active
							</p>
						</div>
					</div>
				</div>
				<Link href="/">
					<div className=" relative">
						<div className=" overflow-hidden relative">
							<Image
								src={`${getBaseUrl()}/${item?.image}`}
								alt="sliderImage"
								width={202}
								height={144}
								preview={false}
								className="mx-auto"
								// layout="responsive"
							/>
						</div>
					</div>
				</Link>

				<div className="my-3 flex items-end justify-end space-x-2">
					<button  onClick={()=>GBconfirmModal(handleDeleteSlider,item?.id,()=>{
              message.success("Slider remove successfully.");
            })} className=" capitalize rounded bg-[#EB2B2B] text-white text-center text-[8px] cursor-pointer py-1 px-3">
						Remove
					</button>
					<button className=" capitalize rounded bg-[#A2A2A2] text-white text-center text-[8px] cursor-pointer py-1 px-3">
						in active
					</button>
					<button className=" capitalize rounded bg-[#A1C4ED] text-white text-center text-[8px] cursor-pointer py-1 px-3">
						active
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
