"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { DatePicker, message, Select, Spin, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLazyGetOrdersReportsQuery } from "@/redux/api/orderApi";
import OrderReportTable from "../_component/OrderReportTable";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useGetAllUsersOptionsQuery } from "@/redux/api/usersApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
// import DownloadOrders from "./_component/DownloadButton";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
import { useLazyGetCustomerRetentionReportsQuery } from "@/redux/api/customerApi";
import RetentionreportTable from "./_component/RetentionreportTable";

const Page = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [status, setStatus] = useState<any>([]);
  const [agentIds, setAgentId] = useState<any>([]);
  const [warehosueIds, setWarehouseId] = useState<any>([]);
  const [courierIds, setCourierId] = useState<any>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersOptionsQuery(undefined);
  const { data: deliveryPartner, isLoading: courierLoading } = useGetDeliveryPartnerOptionsQuery(undefined);
  const { data: warehouseOptions, isLoading: warehouseLoading } = useLoadAllWarehouseOptionsQuery(undefined);
  const [loadCustomerRetentionReports] = useLazyGetCustomerRetentionReportsQuery();
  const { data: statusOptions, isLoading: statusLoading } = useGetAllStatusQuery({ label: "all" });

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

  const handleViewClick = async () => {
    setLoading(true);
    try {
      const result = await loadCustomerRetentionReports({
        startDate: startDate || dayjs(),
        endDate: endDate || dayjs(),
        statusId: status,
        agentIds: agentIds,
        locationId: warehosueIds,
        currier: courierIds,
      }).unwrap();
      setData(result);
    } catch (error) {
      console.error(error);
      message.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    handleViewClick()
  },[])

  return (
    <div>
      <GbHeader title="Sales report" />
      <div className="p-[16px] overflow-scroll max-h-[90vh] custom_scroll">
        <div className="mb-3">
          <div className="flex flex-wrap gap-4">
            <DatePicker
              className="w-[250px] rounded-none"
              placeholder="From Date"
              value={startDate}
              onChange={handleStartChange}
            />
            <DatePicker
              className="w-[250px] rounded-none"
              placeholder="To Date"
              value={endDate}
              onChange={handleEndChange}
            />
            {/* <Select
              className="border_less_select"
              placeholder="Select status"
              onChange={(e) => setStatus([e])}
              style={{ width: 250, borderRadius: 0 }}
              options={statusOptions?.data}
              loading={statusLoading}
              allowClear
            /> */}
            {/* <Select
              className="border_less_select"
              placeholder="Select agent"
              onChange={(e) => setAgentId([e])}
              style={{ width: 250, borderRadius: 0 }}
              options={usersData?.data}
              loading={usersLoading}
              allowClear
            /> */}
            {/* <Select
              className="border_less_select"
              placeholder="Select warehouse"
              onChange={(e) => setWarehouseId([e])}
              style={{ width: 250, borderRadius: 0 }}
              options={warehouseOptions?.data}
              loading={warehouseLoading}
              allowClear
            /> */}
            <Select
              className="border_less_select"
              placeholder="Select courier"
              onChange={(e) => setCourierId([e])}
              style={{ width: 250, borderRadius: 0 }}
              options={deliveryPartner?.data}
              loading={courierLoading}
              allowClear
            />
            <div className="flex justify-end gap-2 ">
              <button
              onClick={handleViewClick}
              disabled={loading}
              className="bg-primary text-white font-bold text-[12px] px-[40px]  disabled:opacity-50"
            >
              {loading ? "Loading..." : "View"}
            </button>
             {/* <DownloadOrders
              filters={{
                startDate: startDate || dayjs(),
                endDate: endDate || dayjs(),
                statusId: status,
                agentIds: agentIds,
                locationId: warehosueIds,
                currier: courierIds,
              }}
            /> */}
            <button className="bg-primary text-white font-bold text-[12px] px-[20px] ">
              Print
            </button>
          </div>
          </div>

          
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <RetentionreportTable
            reports={data}
            startDate={startDate}
            endDate={endDate}
            setData={setData}
            status={status}
            agentIds={agentIds}
            warehosueIds={warehosueIds}
            courierIds={courierIds}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
