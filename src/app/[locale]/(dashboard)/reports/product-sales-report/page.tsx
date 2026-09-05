"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  DatePicker,
  message,
  Modal,
  Button,
  Checkbox,
  Spin,
  Input,
  Select,
  Space,
} from "antd";
import * as XLSX from "xlsx";
import {
  FilterOutlined,
  PrinterOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLazyGetProductWiseSalesReportQuery } from "@/redux/api/orderApi";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import ProductSalesReportTable from "./_component/ProductSalesReportTable";

const { RangePicker } = DatePicker;

const DATE_FIELD_OPTIONS = [
  { label: "Order Date", value: "createdAt" },
  { label: "In-transit Date", value: "intransitTime" },
  { label: "Store Date", value: "storeTime" },
  { label: "Packing Date", value: "packingTime" },
  { label: "Approved Date", value: "approvedTime" },
];

const Page = () => {
  const handleDownloadExcel = () => {
  if (!data?.data?.length) {
    message.warning("No report data to export");
    return;
  }

  const rows = data.data.map((r: any) => ({
    "Product Name": r.productName,
    SKU: r.sku,
    "Order Source": r.orderSource,
    "Quantity Sold": Number(r.totalOrderQuantity || 0),
    "Avg Unit Price": Number(r.price || 0),
    "Total Revenue (Tk)": Number(r.totalSaleAmount || 0),
    "Orders Count": Number(r.orderCount || 0),
  }));

  const workbook = XLSX.utils.book_new();

  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, "Product Sales");

  const summaryRows = [
    { Metric: "Products Sold", Value: Number(data?.summary?.totalProductQuantity || 0) },
    { Metric: "Total Orders", Value: Number(data?.summary?.totalOrders || 0) },
    { Metric: "Gross Sales (Tk)", Value: Number(data?.summary?.salesAmount || 0) },
    { Metric: "Paid Amount (Tk)", Value: Number(data?.summary?.paidAmount || 0) },
    { Metric: "Courier Orders", Value: Number(data?.summary?.courierOrderCount || 0) },
    { Metric: "Distinct Products", Value: Number(data?.summary?.totalProducts || rows.length) },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  const from = (startDate || today).format("YYYY-MM-DD");
  const to = (endDate || today).format("YYYY-MM-DD");
  XLSX.writeFile(workbook, `Product-Sales-Report_${from}_to_${to}.xlsx`);
};
  const today = dayjs();
  const [startDate, setStartDate] = useState<Dayjs | null>(today);
  const [endDate, setEndDate] = useState<Dayjs | null>(today);
  const [dateField, setDateField] = useState<string>("createdAt");
  const [status, setStatus] = useState<any>([]);
  const [orderSources, setOrderSources] = useState<any>([]);
  const [agentIds, setAgentId] = useState<any>([]);
  const [warehosueIds, setWarehouseId] = useState<any>([]);
  const [courierIds, setCourierId] = useState<any>([]);
  const [paymentMethodIds, setPaymentMethodIds] = useState<any>([]);
  const [productIds, setProductIds] = useState<any>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: productsData, isLoading: productsLoading } =
    useGetAllProductQuery({ limit: 200 });
  const { data: deliveryPartner, isLoading: partnerLoading } =
    useGetDeliveryPartnerOptionsQuery(undefined);
  const { data: warehouseOptions, isLoading: warehouseLoading } =
    useLoadAllWarehouseOptionsQuery(undefined);
  const [loadProcurement, { isLoading: reportLoading }] =
    useLazyGetProductWiseSalesReportQuery();
  const [data, setData] = useState<any>(null);
  const { data: statusOptions, isLoading: statusLoading } =
    useGetAllStatusQuery({ label: "all" });

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.filter((p: any) =>
      (p.name || "").toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productsData, productSearch]);

  const statusSelectOptions = useMemo(
    () => [{ label: "All Statuses", value: "all" }, ...(statusOptions?.data || [])],
    [statusOptions?.data]
  );

  const handleStartChange = (date: Dayjs | null) => {
    if (endDate && date && endDate.diff(date, "month", true) > 3) {
      message.error("Date range cannot be more than 3 months");
      return;
    }
    setStartDate(date);
  };

  const handleEndChange = (date: Dayjs | null) => {
    if (startDate && date && date.diff(startDate, "month", true) > 3) {
      message.error("Date range cannot be more than 3 months");
      return;
    }
    setEndDate(date);
  };

  const handleApplyFilter = async (filters?: {
    startDate?: Dayjs | null;
    endDate?: Dayjs | null;
    status?: any[];
    dateField?: string;
  }) => {
    const selectedStartDate = filters?.startDate ?? startDate;
    const selectedEndDate = filters?.endDate ?? endDate;
    const selectedStatus = filters?.status ?? status;
    const selectedDateField = filters?.dateField ?? dateField;
    setLoading(true);
    try {
      const result = await loadProcurement({
        startDate: selectedStartDate ? selectedStartDate.format("YYYY-MM-DD") : today.format("YYYY-MM-DD"),
        endDate: selectedEndDate ? selectedEndDate.format("YYYY-MM-DD") : today.format("YYYY-MM-DD"),
        statusId: selectedStatus && selectedStatus.length && selectedStatus[0] !== "all" ? selectedStatus : undefined,
        agentIds: agentIds?.length ? agentIds : undefined,
        locationId: warehosueIds?.length ? warehosueIds : undefined,
        currier: courierIds?.length ? courierIds : undefined,
        paymentMethodIds: paymentMethodIds?.length ? paymentMethodIds : undefined,
        orderSources: orderSources?.length ? orderSources : undefined,
        productId: productIds?.length ? productIds : undefined,
        dateField: selectedDateField,
      }).unwrap();
      setData(result);
      setIsFilterOpen(false);
    } catch (error) {
      console.log(error);
      message.error("Failed to load product sales report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApplyFilter({
      startDate: today,
      endDate: today,
      status: [],
      dateField: "createdAt",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetFilters = () => {
    setStartDate(today);
    setEndDate(today);
    setDateField("createdAt");
    setStatus([]);
    setOrderSources([]);
    setAgentId([]);
    setWarehouseId([]);
    setCourierId([]);
    setProductIds([]);
    setProductSearch("");
    handleApplyFilter({
      startDate: today,
      endDate: today,
      status: [],
      dateField: "createdAt",
    });
  };

  const handleRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
    const from = dates?.[0] || null;
    const to = dates?.[1] || null;

    if (from && to && to.diff(from, "month", true) > 3) {
      message.error("Date range cannot be more than 3 months");
      return;
    }

    setStartDate(from);
    setEndDate(to);

    if (from && to) {
      handleApplyFilter({ startDate: from, endDate: to });
    }
  };

  const handleStatusChange = (value: any) => {
    const selectedStatus = value && value !== "all" ? [value] : [];
    setStatus(selectedStatus);
    handleApplyFilter({ status: selectedStatus });
  };

  const handleDateFieldChange = (value: string) => {
    setDateField(value);
    handleApplyFilter({ dateField: value });
  };

  return (
    <div className="custom_scroll h-screen overflow-auto">
      <GbHeader title="Product Sales Analytics Report" />
      <div className="p-4 md:p-6 space-y-4  mx-auto">
        {/* Action Toolbar */}
        <div className="flex justify-between items-center flex-wrap gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex gap-2 flex-wrap items-center">
            <Select
              className="w-44"
              placeholder="Date type"
              value={dateField}
              onChange={handleDateFieldChange}
              options={DATE_FIELD_OPTIONS}
            />
            <RangePicker
              value={startDate && endDate ? [startDate, endDate] : null}
              onChange={handleRangeChange}
              className="min-w-[260px]"
            />
            <Select
              className="w-52"
              placeholder="Filter status"
              value={status?.[0] || "all"}
              onChange={handleStatusChange}
              options={statusSelectOptions}
              loading={statusLoading}
            />
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => handleApplyFilter()}
              loading={loading || reportLoading}
            >
              Refresh
            </Button>
            <Button
  icon={<FilterOutlined />}
  onClick={() => setIsFilterOpen(true)}
  type="primary"
>
  Advanced Filters
</Button>
<Button
  icon={<DownloadOutlined />}
  onClick={handleDownloadExcel}
  disabled={!data?.data?.length}
>
  Download Excel
</Button>
<Button
  icon={<PrinterOutlined />}
  onClick={() => window.print()}
>
  Print Report
</Button>
          </Space>
        </div>

        {/* Filter Modal */}
        <Modal
          title="Advanced Product Sales Filters"
          open={isFilterOpen}
          onCancel={() => setIsFilterOpen(false)}
          width={650}
          footer={[
            <Button key="reset" onClick={handleResetFilters}>
              Reset
            </Button>,
            <Button key="cancel" onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="apply"
              type="primary"
              onClick={() => handleApplyFilter()}
              loading={loading}
            >
              Apply Filters
            </Button>,
          ]}
        >
          <Spin
            spinning={
              productsLoading ||
              partnerLoading ||
              warehouseLoading ||
              statusLoading
            }
          >
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {/* Dates */}
              <div>
                <h4 className="mb-2 font-medium text-sm text-gray-700">Date Range</h4>
                <div className="flex gap-2">
                  <DatePicker
                    placeholder="From Date"
                    value={startDate}
                    onChange={handleStartChange}
                    className="w-full"
                  />
                  <DatePicker
                    placeholder="To Date"
                    value={endDate}
                    onChange={handleEndChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Order Sources */}
              <div>
                <h4 className="mb-2 font-medium text-sm text-gray-700">Order Sources</h4>
                <Checkbox.Group
                  options={[
                    { label: "Facebook", value: "Facebook" },
                    { label: "WhatsApp", value: "WhatsApp" },
                    { label: "Incoming Call", value: "Incoming Call" },
                    { label: "Telesales", value: "Telesales" },
                    { label: "Website", value: "Website" },
                    { label: "POS Counter", value: "POS" },
                  ]}
                  value={orderSources}
                  onChange={setOrderSources}
                />
              </div>

              {/* Delivery Partners */}
              <div>
                <h4 className="mb-2 font-medium text-sm text-gray-700">Delivery Partners</h4>
                <Checkbox.Group
                  options={deliveryPartner?.data?.map((item: any) => ({
                    label: item.label || item.partnerName || item.name,
                    value: item.value || item.id,
                  }))}
                  value={courierIds}
                  onChange={setCourierId}
                />
              </div>

              {/* Warehouses */}
              <div>
                <h4 className="mb-2 font-medium text-sm text-gray-700">Warehouse Outlets</h4>
                <Checkbox.Group
                  options={warehouseOptions?.data?.map((item: any) => ({
                    label: item.label || item.name,
                    value: item.value || item.id,
                  }))}
                  value={warehosueIds}
                  onChange={setWarehouseId}
                />
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="mb-2 font-medium text-sm text-gray-700">Payment Methods</h4>
                <Checkbox.Group
                  options={[
                    { label: "COD", value: "COD" },
                    { label: "bKash", value: "bKash" },
                    { label: "Nagad", value: "Nagad" },
                    { label: "Rocket", value: "Rocket" },
                    { label: "Bank Payment", value: "Bank Payment" },
                    { label: "POS Cash", value: "Cash" },
                  ]}
                  value={paymentMethodIds}
                  onChange={setPaymentMethodIds}
                />
              </div>

              {/* Products with search */}
              <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                <h4 className="mb-2 font-medium text-sm text-gray-700">Specific Products</h4>
                <Input
                  placeholder="Search by product name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="mb-2"
                  allowClear
                />
                <div className="max-h-[160px] overflow-y-auto">
                  <Checkbox.Group
                    options={filteredProducts.map((item: any) => ({
                      label: `${item.name} (${item.sku || "N/A"})`,
                      value: item.id,
                    }))}
                    value={productIds}
                    onChange={setProductIds}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </Modal>

        {/* Table & Analytics */}
        <ProductSalesReportTable
          reports={data}
          loading={loading || reportLoading}
        />
      </div>
    </div>
  );
};

export default Page;
