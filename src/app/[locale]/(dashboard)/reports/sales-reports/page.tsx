"use client";
import ReportTable from "@/components/ReportTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { DatePicker, message, Select } from "antd";
import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  useLazyGetOrdersReportsQuery,
} from "@/redux/api/orderApi";
import OrderReportTable from "../_component/OrderReportTable";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useGetAllUsersOptionsQuery } from "@/redux/api/usersApi";
const Page = () => {
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [status,setStatus]=useState<any>([])
  const [agentIds,setAgentId]=useState<any>([])
  const {data:usersData}=useGetAllUsersOptionsQuery(undefined)
  const [loadProcurement] = useLazyGetOrdersReportsQuery();
  const [data, setData] = useState([]);
    const { data: statusOptions, isLoading } = useGetAllStatusQuery({
      label: "all",
    });
  const handleStartChange = (date: Dayjs | null) => {
    if (endDate && date && endDate.diff(date, "month", true) > 1) {
      message.error("Date range cannot be more than 1 month");
      return;
    }
    setStartDate(date);
  };

  const handleEndChange = (date: Dayjs | null) => {
    if (startDate && date && date.diff(startDate, "month", true) > 1) {
      message.error("Date range cannot be more than 1 month");
      return;
    }
    setEndDate(date);
  };
  return (
    <div>
      <GbHeader title="Sales report" />
      <div className="p-[16px]">
        <div className="mb-3 flex  justify-between items-center">
          <div>
            <DatePicker
              className="w-[250px] rounded-none me-3"
              placeholder="From Date"
              value={startDate}
              onChange={handleStartChange}
            />
            <DatePicker
              className="w-[250px] rounded-none me-3"
              placeholder="To Date"
              value={endDate}
              onChange={handleEndChange}
            />
            <Select className="border_less_select me-3" placeholder="Select status" onChange={(e)=>{
                setStatus([e])
            }} style={{width:"250px",borderRadius:"0"}} options={statusOptions?.data} />
            <Select className="border_less_select" placeholder="Select agent" onChange={(e)=>{
                setAgentId([e])
            }} style={{width:"250px",borderRadius:"0"}} options={usersData?.data} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const result = await loadProcurement({
                    startDate: startDate || dayjs(),
                    endDate: endDate || dayjs(),
                    statusId: status,
                    agentIds: agentIds,
                  }).unwrap();
                  setData(result);
                } catch (error) {
                  console.log(error);
                }
              }}
              className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[3px]"
            >
              View
            </button>
            <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[3px]">
              Excel
            </button>
            <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[3px]">
              Print
            </button>
          </div>
        </div>
          <OrderReportTable
          reports={data}
          startDate={startDate}
          endDate={endDate}
          setData={setData}
          status={status}
          agentIds={agentIds}
        />
      </div>
    </div>
  );
};

export default Page;
