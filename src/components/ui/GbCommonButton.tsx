
const GbCommonButton = ({children,clickHandler}:{children:React.ReactNode,clickHandler:()=>void}) => {
    return <button onClick={clickHandler} className="bg-primary px-[12px] py-[8px] text-[#FFFFFF] text-[16px] rounded-[5px]">{children}</button>
};

export default GbCommonButton;