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
} from "antd";
import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLazyGetOrdersReportsQuery, useLazyGetProductWiseSalesReportQuery } from "@/redux/api/orderApi";
import OrderReportTable from "../_component/OrderReportTable";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useGetAllUsersOptionsQuery } from "@/redux/api/usersApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
import DownloadOrders from "../sales-reports/_component/DownloadButton";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import ProductSalesReportTable from "./_component/ProductSalesReportTable";

const Page = () => {
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
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
  const [data, setData] = useState([]);
  const { data: statusOptions, isLoading: statusLoading } =
    useGetAllStatusQuery({ label: "all" });

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.filter((p: any) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productsData, productSearch]);

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

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const result = await loadProcurement({
        startDate: startDate ? dayjs(startDate).toISOString() : dayjs(new Date()).toISOString(),
        endDate: endDate ? dayjs(endDate).toISOString() : dayjs(new Date()).toISOString(),
        statusId: status,
        agentIds,
        locationId: warehosueIds,
        currier: courierIds,
        paymentMethodIds: paymentMethodIds,
        orderSources,
        productId: productIds,
      }).unwrap();
      setData(result);
      setIsFilterOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus([]);
    setOrderSources([]);
    setAgentId([]);
    setWarehouseId([]);
    setCourierId([]);
    setProductIds([]);
    setProductSearch("");
  };

  return (
    <div>
      <GbHeader title="Product Sales report" />
      <div className="p-[16px]">
        {/* Action Buttons */}
        <div className="flex gap-2 justify-end my-4">
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="bg-primary text-white"
          >
            Filter
          </Button>
          <Button loading={reportLoading} className="bg-primary text-white">
            Print
          </Button>
        </div>

        {/* Filter Modal */}
        <Modal
          title="Filter Reports"
          open={isFilterOpen}
          onCancel={() => setIsFilterOpen(false)}
          width={600}
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
              onClick={handleApplyFilter}
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
            <div className="flex flex-col gap-4">
              {/* Dates */}
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

              {/* Order Sources */}
              <div>
                <h4 className="mb-2 font-medium">Order Sources</h4>
                <Checkbox.Group
                  options={[
                    { label: "Facebook", value: "Facebook" },
                    { label: "Whats App", value: "Whats App" },
                    { label: "In coming call", value: "In coming call" },
                    { label: "Telesales", value: "Telesales" },
                  ]}
                  value={orderSources}
                  onChange={setOrderSources}
                />
              </div>

              {/* Delivery Partners */}
              <div>
                <h4 className="mb-2 font-medium">Delivery Partners</h4>
                <Checkbox.Group
                  options={deliveryPartner?.data?.map((item: any) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  value={courierIds}
                  onChange={setCourierId}
                />
              </div>
              {/* Payment Methods */}
              <div>
                <h4 className="mb-2 font-medium">Payment Methods</h4>
                <Checkbox.Group
                  options={[
                    {
                      label: "COD",
                      value: "COD",
                    },
                    {
                      label: "Bkash Personal",
                      value: "Bkash Personal",
                    },
                    {
                      label: "Bkash Agent",
                      value: "Bkash Agent",
                    },
                    {
                      label: "Bkash Merchant",
                      value: "Bkash Merchant",
                    },
                    {
                      label: "Bkash GB-Agent",
                      value: "Bkash GB-Agent",
                    },
                    {
                      label: "Nagad(nur)",
                      value: "Nagad(nur)",
                    },
                    {
                      label: "Bank Payment",
                      value: "Bank Payment",
                    },
                  ]}
                  value={paymentMethodIds}
                  onChange={setPaymentMethodIds}
                />
              </div>

              {/* Products with search */}
              <div className="max-h-[250px] overflow-y-auto border p-2 rounded">
                <h4 className="mb-2 font-medium">Products</h4>
                <Input
                  placeholder="Search product..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="mb-2"
                />
                <Checkbox.Group
                  options={filteredProducts.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={productIds}
                  onChange={setProductIds}
                />
              </div>
            </div>
          </Spin>
        </Modal>

        {/* Table */}
        <ProductSalesReportTable
          reports={data}
          startDate={startDate}
          endDate={endDate}
          setData={setData}
          status={status}
          orderSources={orderSources}
          agentIds={agentIds}
          warehosueIds={warehosueIds}
          courierIds={courierIds}
          paymentMethodIds={paymentMethodIds}
          productIds={productIds}
        />
      </div>
    </div>
  );
};

export default Page;
