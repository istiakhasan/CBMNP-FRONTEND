import { useGetProductCountQuery } from "@/redux/api/productApi";
import { ConfigProvider, Spin, Tooltip } from "antd";

const stats = [
    {
      title: "Total SKU",
      tooltip: "Total number of active and inactive SKUs",
      color: "#4F8A6D",
      status: "Total",
    },
    {
      title: "Total Variants",
      tooltip: "Total number of active and inactive Product variants",
      color: "#28A745",
      status: "Variant",
    },
    {
      title: "Active SKU",
      tooltip: "Total number of active SKU",
      color: "#17C2A4",
      status: "Active",
    },
    {
      title: "Inactive SKU",
      tooltip: "Total number of inactive SKU",
      color: "#FFC107",
      status: "Inactive",
    },
  ];
  
  const StatCard = ({ title, tooltip, color, count,isLoading }: { title: string; tooltip: string; color: string; count: number;isLoading:boolean }) => (
    <div className="px-[18px] py-[4px] flex">
      <h1 className="text-[#656565] text-[16px] flex gap-4 items-center">
        {title}
        {/* <Tooltip title={tooltip}>
          <i className="ri-information-line cursor-pointer"></i>
        </Tooltip> */}
      </h1>
      <h1 className="text-[16px] font-semibold border-[1px] border-[#f0f0f0] px-[10px] ml-2" style={{ background: color,color:"white" }}>
        {
            isLoading? <ConfigProvider
            theme={{
              token: {
                colorPrimary: "white", // Default primary color (used in Spin)
              },
            }}
          >
            <Spin size="small" />
          </ConfigProvider>:<>{count}</>
        }
        
      </h1>
    </div>
  );
  
  const StatsContainer = () => {
      const {data:skuCount,isLoading}=useGetProductCountQuery(undefined)
    return (
      <div className="flex">
        {stats.map(({ title, tooltip, color, status }) => (
          <StatCard
            key={status}
            title={title}
            tooltip={tooltip}
            color={color}
            count={skuCount?.data?.find((item: any) => item?.status === status)?.count || 0}
            isLoading={isLoading}
          />
        ))}
      </div>
    );
  };


  export default StatsContainer
  