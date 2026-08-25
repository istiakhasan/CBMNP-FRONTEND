"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { DatePicker, message, Select, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLazyGetOrdersReportsQuery } from "@/redux/api/orderApi";
import OrderReportTable from "../_component/OrderReportTable";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useGetAllUsersOptionsQuery } from "@/redux/api/usersApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import DownloadOrders from "./_component/DownloadButton";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";

const DATE_FIELD_OPTIONS = [
  { label: "Order Date", value: "createdAt" },
  { label: "In-transit Date", value: "intransitTime" },
  { label: "Store Date", value: "storeTime" },
  { label: "Packing Date", value: "packingTime" },
];

// Sentinel value for the "All" chip in every multi-select filter
const ALL_VALUE = "__ALL__";

// Prepends an "All" option to any options list
const withAllOption = (options: any[] = []) => [
  { label: "All", value: ALL_VALUE },
  ...options,
];

// What's actually shown in the Select — empty state = "All" chip
const getDisplayValue = (arr: string[]) => (arr.length ? arr : [ALL_VALUE]);

// Shared logic for every multi-select filter.
// - picking "All" clears everything else (empty array => backend applies no filter on that field)
// - picking any real value automatically drops "All" from the selection
// - comparison is against the DISPLAYED value (not raw state), otherwise antd
//   always thinks "All" was just freshly picked and resets the selection
const handleMultiSelectChange = (
  newValues: string[],
  currentArr: string[],
  setter: (v: string[]) => void
) => {
  const prevDisplayed = getDisplayValue(currentArr);
  const allJustPicked =
    newValues.includes(ALL_VALUE) && !prevDisplayed.includes(ALL_VALUE);

  if (allJustPicked || newValues.length === 0) {
    setter([]);
    return;
  }
  setter(newValues.filter((v) => v !== ALL_VALUE));
};

// ✅ NEW: small wrapper so every filter field gets a consistent label above it
const FilterField = ({
  label,
  width = 250,
  children,
}: {
  label: string;
  width?: number;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1" style={{ width }}>
    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
);

const Page = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [status, setStatus] = useState<string[]>([]);
  const [agentIds, setAgentId] = useState<string[]>([]);
  const [warehosueIds, setWarehouseId] = useState<string[]>([]);
  const [courierIds, setCourierId] = useState<string[]>([]);
  const [dateField, setDateField] = useState<string>("createdAt");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersOptionsQuery(undefined);
  const { data: deliveryPartner, isLoading: courierLoading } = useGetDeliveryPartnerOptionsQuery(undefined);
  const { data: warehouseOptions, isLoading: warehouseLoading } = useLoadAllWarehouseOptionsQuery(undefined);
  const [loadProcurement] = useLazyGetOrdersReportsQuery();
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
      const result = await loadProcurement({
        startDate: startDate || dayjs(),
        endDate: endDate || dayjs(),
        statusId: status,
        agentIds: agentIds,
        locationId: warehosueIds,
        currier: courierIds,
        dateField,
      }).unwrap();
      setData(result);
    } catch (error) {
      console.error(error);
      message.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleViewClick();
  }, []);

  return (
    <div>
      <GbHeader title="Sales report" />
      <div className="p-[16px] overflow-scroll max-h-[90vh] custom_scroll">
        <div className="mb-3">
          <div className="flex flex-wrap gap-4 items-end">
            <FilterField label="Date Type" width={200}>
              <Select
                className="border_less_select"
                placeholder="Date type"
                value={dateField}
                onChange={(e) => setDateField(e)}
                style={{ width: "100%", borderRadius: 0 }}
                options={DATE_FIELD_OPTIONS}
              />
            </FilterField>

            <FilterField label="From Date" width={250}>
              <DatePicker
                className="w-full rounded-none"
                placeholder="From Date"
                value={startDate}
                onChange={handleStartChange}
              />
            </FilterField>

            <FilterField label="To Date" width={250}>
              <DatePicker
                className="w-full rounded-none"
                placeholder="To Date"
                value={endDate}
                onChange={handleEndChange}
              />
            </FilterField>

            <FilterField label="Status">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                allowClear
                className="border_less_select"
                placeholder="Select status"
                value={getDisplayValue(status)}
                onChange={(vals) => handleMultiSelectChange(vals, status, setStatus)}
                style={{ width: "100%", borderRadius: 0 }}
                options={withAllOption(statusOptions?.data)}
                loading={statusLoading}
              />
            </FilterField>

            <FilterField label="Agent">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                allowClear
                className="border_less_select"
                placeholder="Select agent"
                value={getDisplayValue(agentIds)}
                onChange={(vals) => handleMultiSelectChange(vals, agentIds, setAgentId)}
                style={{ width: "100%", borderRadius: 0 }}
                options={withAllOption(usersData?.data)}
                loading={usersLoading}
              />
            </FilterField>

            <FilterField label="Warehouse">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                allowClear
                className="border_less_select"
                placeholder="Select warehouse"
                value={getDisplayValue(warehosueIds)}
                onChange={(vals) => handleMultiSelectChange(vals, warehosueIds, setWarehouseId)}
                style={{ width: "100%", borderRadius: 0 }}
                options={withAllOption(warehouseOptions?.data)}
                loading={warehouseLoading}
              />
            </FilterField>

            <FilterField label="Courier">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                allowClear
                className="border_less_select"
                placeholder="Select courier"
                value={getDisplayValue(courierIds)}
                onChange={(vals) => handleMultiSelectChange(vals, courierIds, setCourierId)}
                style={{ width: "100%", borderRadius: 0 }}
                options={withAllOption(deliveryPartner?.data)}
                loading={courierLoading}
              />
            </FilterField>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleViewClick}
              disabled={loading}
              className="bg-primary text-white font-bold text-[12px] px-[40px] py-[3px] disabled:opacity-50"
            >
              {loading ? "Loading..." : "View"}
            </button>
            <DownloadOrders
              filters={{
                startDate: startDate || dayjs(),
                endDate: endDate || dayjs(),
                statusId: status,
                agentIds: agentIds,
                locationId: warehosueIds,
                currier: courierIds,
                dateField,
              }}
            />
            <button className="bg-primary text-white font-bold text-[12px] px-[20px] py-[3px]">
              Print
            </button>
          </div>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <OrderReportTable
            reports={data}
            startDate={startDate}
            endDate={endDate}
            setData={setData}
            status={status}
            agentIds={agentIds}
            warehosueIds={warehosueIds}
            courierIds={courierIds}
            dateField={dateField}
          />
        )}
      </div>
    </div>
  );
};

export default Page;