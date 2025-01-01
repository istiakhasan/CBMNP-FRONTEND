import { useGetProductCountQuery } from "@/redux/api/productApi";
import { Tooltip } from "antd";

const stats = [
    {
      title: "Total SKU",
      tooltip: "Total number of active and inactive SKUs",
      color: "#47a2b3",
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
  
  const StatCard = ({ title, tooltip, color, count }: { title: string; tooltip: string; color: string; count: number }) => (
    <div className="px-[18px] py-[8px] min-h-[24px] border-[1px] border-[#f0f0f0]">
      <h1 className="text-[#656565] text-[16px] flex gap-4 items-center">
        {title}
        <Tooltip title={tooltip}>
          <i className="ri-information-line cursor-pointer"></i>
        </Tooltip>
      </h1>
      <h1 className="text-[20px] font-semibold" style={{ color }}>
        {count}
      </h1>
    </div>
  );
  
  const StatsContainer = () => {
      const {data:skuCount}=useGetProductCountQuery(undefined)
    return (
      <div className="flex gap-[20px]">
        {stats.map(({ title, tooltip, color, status }) => (
          <StatCard
            key={status}
            title={title}
            tooltip={tooltip}
            color={color}
            count={skuCount?.data?.find((item: any) => item?.status === status)?.count || 0}
          />
        ))}
      </div>
    );
  };


  export default StatsContainer
  