import Image from "next/image";
import React from "react";
const HrmEmployeeCard = ({
  title,
  bg_color,
  children,
  img,
  total
}: {
  title?: string;
  bg_color?: string;
  children?:React.ReactElement,
  img?:any
  total?:any
}) => {
  return (
    <div
      style={{ background: bg_color }}
      className={`rounded-[20px] px-[14px] pb-[14px] pt-[40px] flex flex-col justify-between`}
    >
      <div>
        <h1 className="text-[#000000] text-[20px] font-[600]">{title}</h1>
        <p
          style={{ color: "rgba(0, 0, 0, 0.3)" }}
          className="text-[12px] font-[500] my-[6px]"
        >
          {total}
        </p>
        {children}
      </div>
      <Image src={img} alt="" height={124} className="w-full" />
    </div>
  );
};

export default HrmEmployeeCard;
