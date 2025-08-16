/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { Button, Pagination, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbTable from "@/components/GbTable";
import {
  useLoadAllInventoryQuery,
  useLoadAllTransactionQuery,
  useWarehouseWiseProductStockQuery,
} from "@/redux/api/inventoryApi";
import {
  inventoryColumns,
  logsTableColumns,
  warehouseWiseStockColumns,
} from "./_tableColumns/tableColumns";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";

const Page = () => {
  const search = useSearchParams();
  const tab = search.get("tab") || "stock";
  const [warehouseId, setwarehouseId] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const query = useMemo(
    () => ({ page, limit: size, searchProducts: searchTerm }),
    [page, size, searchTerm]
  );
  const { data: warehouseOptions,isLoading } = useLoadAllWarehouseOptionsQuery(undefined);


  const { data: inventoryData, isLoading: inventoryLoading } =
    useLoadAllInventoryQuery(query, { skip: tab !== "stock" });

  const { data: warehouseData, isLoading: warehouseLoading } =
    useWarehouseWiseProductStockQuery(
      { ...query, warehouseId: warehouseId },
      { skip: tab !== "wws" }
    );

  const { data: transactionData, isLoading: transactionLoading } =
    useLoadAllTransactionQuery(query, { skip: tab !== "logs" });

  const router = useRouter();
  const local = useLocale();

  const { columns, data, loading } = useMemo(() => {
    switch (tab) {
      case "logs":
        return {
          columns: logsTableColumns,
          data: transactionData?.data || [],
          loading: transactionLoading,
        };
      case "wws":
        return {
          columns: warehouseWiseStockColumns,
          data: warehouseData?.data || [],
          loading: warehouseLoading,
        };
      default:
        return {
          columns: inventoryColumns,
          data: inventoryData?.data || [],
          loading: inventoryLoading,
        };
    }
  }, [
    tab,
    inventoryData,
    warehouseData,
    transactionData,
    inventoryLoading,
    warehouseLoading,
    transactionLoading,
  ]);

  if(warehouseLoading || isLoading){
    return
  }

  return (
    <>
      <GbHeader title="Inventory" />
      <div className="p-[16px]">
        {/* Tabs */}
        <div className="mb-3 space-x-2">
          {[
            { label: "Stock", key: "stock" },
            { label: "Warehouse Wise Stock", key: "wws" },
            { label: "Logs", key: "logs" },
          ].map(({ label, key }) => (
            <Button
              key={key}
              style={{
                background: "#f2f8fa",
                color: "#4F8A6D",
                boxShadow: "none",
              }}
              type="primary"
              size="small"
              onClick={() => router.push(`/${local}/inventory?tab=${key}`)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="gb_border">
          <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
            <div className="flex gap-2 ">
              <div
                className="border p-2 h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setPage(1);
                  setSearchTerm("");
                }}
              >
                <i
                  style={{ fontSize: "24px" }}
                  className="ri-restart-line text-gray-600"
                ></i>
              </div>

              <div>
                <Select
                  style={{ width: "200px" }}
                  placeholder="Filter by Warehouse"
                  options={[
                    { label: "All", value: "" },
                    ...warehouseOptions?.data,
                  ]}
                  onChange={(e) => {
                    setwarehouseId(e);
                  }}
                />
              </div>
            </div>

            <Pagination
              pageSize={size}
              total={
                tab === "stock"
                  ? inventoryData?.total
                  : tab === "wws"
                  ? warehouseData?.total
                  : transactionData?.total
              }
              current={page}
              onChange={(p, s) => {
                setPage(p);
                setSize(s);
              }}
              showSizeChanger={false}
            />
          </div>

          <div className="max-h-[500px] overflow-auto">
            <GbTable
              loading={loading}
              columns={columns}
              dataSource={data}
              pageSize={size}
              totalPages={
                tab === "stock"
                  ? inventoryData?.total
                  : tab === "wws"
                  ? warehouseData?.total
                  : transactionData?.total
              }
              onPaginationChange={(p, s) => {
                setPage(p);
                setSize(s);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
