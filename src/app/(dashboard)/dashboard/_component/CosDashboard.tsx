"use client"
import GbHeader from "@/components/ui/dashboard/GbHeader";
import React from "react";
// import SubscriberAnalyticsBarChart from "./_component/SubscriberAnalyticsBarChart";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetSubscriberCountQuery, useGetSubscribersQuery } from "@/redux/api/subscriberApi";
const SubscriberAnalyticsBarChart = dynamic(() => import('./../_component/SubscriberAnalyticsBarChart'), {
  ssr: false 
});
const   CosDashboard = () => {
    const route=useRouter()
    const {data,isLoading}=useGetSubscriberCountQuery(undefined)
    
    const { data:expiredSoonData, isLoading:expiredSoonisLoading } = useGetSubscribersQuery(
      {  page: "1", limit: "10", status: "Active", expiryDaysLeft :"28"},
      {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );

    if(isLoading || expiredSoonisLoading){
      return 
    }

  return (
    <>
      <GbHeader title="Subscription dashboard" />
     <div  className="mx-[20px]">
     <div className="p-[23px] border border-[#EFEFEF] bg-white grid grid-cols-5 gap-[8px] rounded-[10px]">
        <div className="p-[16px]  min-h-[161px]  rounded-[10px] opacity_background">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h1 className="text-[#3A3A3A] text-[48px] font-[700]">{data?.totalSubscribers}</h1>
            <h1 className="text-[#6D6D6D] text-[18px] font-[400]">
              Total subscriber count
            </h1>
          </div>
        </div>
        <div className="p-[16px]  min-h-[161px]  rounded-[10px] opacity_background">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h1 className="text-[#3A3A3A] text-[48px] font-[700]">{data?.activeSubscribers}</h1>
            <h1 className="text-[#6D6D6D] text-[18px] font-[400]">
            Active subscriber count
            </h1>
          </div>
        </div>
        <div className="p-[16px]  min-h-[161px]  rounded-[10px] opacity_background">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h1 className="text-[#3A3A3A] text-[48px] font-[700]">{data?.newSubscribers}</h1>
            <h1 className="text-[#6D6D6D] text-[18px] font-[400]">
            New count
            </h1>
          </div>
        </div>
        <div className="p-[16px]  min-h-[161px]  rounded-[10px] opacity_background">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h1 className="text-[#3A3A3A] text-[48px] font-[700]">{data?.expiredAndForcedCount}</h1>
            <h1 className="text-[#6D6D6D] text-[18px] font-[400]">
            Expired count
            </h1>
          </div>
        </div>
        <div className="p-[16px]  min-h-[161px]  rounded-[10px] opacity_background">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h1 className="text-[#3A3A3A] text-[48px] font-[700]">{data?.last7DaysExpiredCount}</h1>
            <h1 className="text-[#6D6D6D] text-[18px] font-[400]">
             10 days to go for expiry 
            </h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[28px] mt-[29px]">
        <div className="sdw_box">
            <p className="text-[#343434] text-[16px] font-[700]">Subscriber Analytics</p>
            <p className="text-[#838383] text-[12px] ">19 Jly 2024- 20 Aug 2024</p>
            <SubscriberAnalyticsBarChart />
        </div>
        <div className="sdw_box">
          <p className="text-[16px] font-[700] text-[#000000]">Expired Soon</p>
           <div className="min-h-[400px]">
           <table className="es_table">
            <thead>
              <tr>
                <th>SL</th>
                <th align="left">Subscriber Name</th>
                <th>Remaining Days</th>
              </tr>
            </thead>
            <tbody>
              {expiredSoonData?.data?.map((item:any,i:any) => (
                <tr key={item}>
                  <td style={{textAlign:"center"}}>{i+1}</td>
                  <td>{item?.name}</td>
                  <td align="center">{item?.expiryDateStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
           </div>
          <div className="flex items-center justify-end bg-gray-200 mt-[2px] to-orange-200 p-[13px] rounded-b-lg">
      <button onClick={()=>{
        route.push('/subscription/customer_list?expired_soon=true')
      }} className="flex items-center text-sm font-medium text-black hover:text-orange-600">
        View all
        <span className="ml-2 text-xl">»</span>
      </button>
    </div>
        </div>
      </div>
     </div>
    </>
  );
};

export default CosDashboard;
