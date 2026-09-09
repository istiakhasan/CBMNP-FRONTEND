"use client";
import GbForm from "@/components/forms/GbForm";
import ReportTable from "@/components/ReportTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {  useLazyGetProcurementReportsQuery } from "@/redux/api/procurementApi";
import {  DatePicker } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
const Page = () => {
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [loadProcurement] = useLazyGetProcurementReportsQuery();
  const [data, setData] = useState([]);

  return (
    <div>
      <GbHeader title="Purchase report" />
      <div className="p-[16px]">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <DatePicker
              className="w-[300px] rounded-none me-3"
              placeholder="From Date"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
            />
            <DatePicker
              className="w-[300px] rounded-none"
              placeholder="To Date"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const result = await loadProcurement({
                    startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
                    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
                  }).unwrap();
                  setData(result?.data || []);
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
        <ReportTable reports={data} />
      </div>
    </div>
  );
};

export default Page;
