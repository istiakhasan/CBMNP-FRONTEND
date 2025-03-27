"use client";
import GbForm from "@/components/forms/GbForm";
import ReportTable from "@/components/ReportTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {  useLazyGetProcurementReportsQuery } from "@/redux/api/procurementApi";
import {  DatePicker } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadProcurement]=useLazyGetProcurementReportsQuery()
  const [data,setData]=useState([])
  // const { data } = useGetProcurementReportsQuery({
  //   startDate: startDate,
  //   endDate: endDate,
  // });


  return (
    <div>
      <GbHeader title="Purchase report" />
      <div className="p-[16px]">
        <div className="mb-3 flex  justify-between items-center">
          <div>
            <DatePicker
              className="w-[400px] rounded-none me-3"
              placeholder="From Date"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
            />
            <DatePicker
              className="w-[400px] rounded-none"
              placeholder="To Date"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={async()=>{
               try {
                const result=await loadProcurement({
                  startDate:startDate || dayjs(),endDate:endDate || dayjs()
                }).unwrap()
                setData(result?.data)
                console.log(result);
               } catch (error) {
                console.log(error);
               }
            }} className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[3px]">
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
        <ReportTable reports={data} />
      </div>
    </div>
  );
};

export default Page;
