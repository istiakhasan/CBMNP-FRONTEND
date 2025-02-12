import React from "react";

const ProfileCard = ({price,title,bg_color,children}:{price:number|string,title:string,bg_color:string,children:React.ReactElement}) => {
  return (
    <div className={`${bg_color} min-h-[140px] rounded-[10px] p-[20px]`}>
       {children}
      <h1 className="text-[#343434] text-[32px] font-[600]">{price}</h1>
      <p className="text-[#070707] font-[500] text-[16px] opacity-[.5]">
       {title}
      </p>
    </div>
  );
};

export default ProfileCard;
