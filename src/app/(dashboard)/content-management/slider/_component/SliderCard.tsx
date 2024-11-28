"use client"
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React from "react";
import Card from "./Card";
import UploadCard from "./UploadCard";
import { useGetAllSliderQuery } from "@/redux/api/sliderApi";

const SliderCard = () => {
	const {data}=useGetAllSliderQuery(undefined)
	return (
		<div className="relative">
			<GbHeader title={"Sliders"} />
			<div className="flex justify-center my-6">
				<UploadCard />
			</div>
			<div className="w-full grid grid-cols-6 gap-6 flex-wrap">
				{
                    data?.map((item:any)=>(
						<Card key={item?.id} item={item} />
					))
				}
			</div>
		</div>
	);
};

export default SliderCard;
