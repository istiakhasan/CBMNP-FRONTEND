/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Input, Pagination, Select, Table, Tag } from "antd";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbTable from "@/components/GbTable";
import {
  useLoadAllInventoryQuery,
  useLazyLoadTransactionByIdQuery,
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
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);

  const query = useMemo(
    () => ({ page, limit: size, searchProducts: searchTerm, warehouseId }),
    [page, size, searchTerm, warehouseId],
  );

  const { data: warehouseOptions, isLoading } =
    useLoadAllWarehouseOptionsQuery(undefined);

  const { data: inventoryData, isLoading: inventoryLoading } =
    useLoadAllInventoryQuery(query, { skip: tab !== "stock" });

  const { data: warehouseData, isLoading: warehouseLoading } =
    useWarehouseWiseProductStockQuery(query, { skip: tab !== "wws" });

  const { data: transactionData, isLoading: transactionLoading } =
    useLoadAllTransactionQuery(query, { skip: tab !== "logs" });
  const [
    loadProductTransactions,
    { data: productTransactionData, isFetching: productTransactionLoading },
  ] = useLazyLoadTransactionByIdQuery();

  const router = useRouter();
  const local = useLocale();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        setSearchTerm(value);
      }, 400),
    [],
  );

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const handleReset = () => {
    setPage(1);
    setSearchInput("");
    setSearchTerm("");
    setwarehouseId("");
  };

  const openProductLog = (record: any) => {
    setSelectedProduct(record);
    setLogDrawerOpen(true);
    loadProductTransactions({
      id: record?.productId,
      params: { page: 1, limit: 100, warehouseId: warehouseId || undefined },
    });
  };

  const { columns, data, loading } = useMemo(() => {
    switch (tab) {
      case "logs":
        return {
          columns: logsTableColumns,
          data: transactionData?.data?.data || transactionData?.data || [],
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

  if (warehouseLoading || isLoading) {
    return null;
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
            <div className="flex gap-2">
              <div
                className="border p-2 h-[35px] w-[35px] flex items-center justify-center cursor-pointer"
                onClick={handleReset}
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
                  value={warehouseId || undefined}
                  options={[
                    { label: "All", value: "" },
                    ...warehouseOptions?.data,
                  ]}
                  onChange={(e) => {
                    setPage(1);
                    setwarehouseId(e);
                  }}
                />
              </div>
              {tab === "stock" && (
                <Input
                  placeholder="Search by product name or code"
                  allowClear
                  style={{ width: "240px" }}
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              )}
            </div>

            <Pagination
              pageSize={size}
              total={
              tab === "stock"
                  ? inventoryData?.total
                  : tab === "wws"
                    ? warehouseData?.total
                    : transactionData?.data?.total || transactionData?.total
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
                    : transactionData?.data?.total || transactionData?.total
              }
              onPaginationChange={(p, s) => {
                setPage(p);
                setSize(s);
              }}
              onRow={
                tab === "stock"
                  ? (record: any) => ({
                      onClick: () => openProductLog(record),
                      className: "cursor-pointer",
                    })
                  : undefined
              }
            />
          </div>
        </div>
      </div>
      <Drawer
        title={
          <div>
            <div>{selectedProduct?.product?.name || "Product"} Inventory Log</div>
            <div className="text-xs text-gray-500 font-normal">
              SKU: {selectedProduct?.product?.sku || "N/A"}
            </div>
          </div>
        }
        open={logDrawerOpen}
        onClose={() => setLogDrawerOpen(false)}
        width={980}
      >
        <Table
          columns={[
            {
              title: "Time",
              dataIndex: "transactionDate",
              key: "transactionDate",
              render: (value: string) => value ? new Date(value).toLocaleString() : "N/A",
            },
            {
              title: "Warehouse",
              key: "warehouse",
              render: (_: any, record: any) => record?.location?.name || "Inventory",
            },
            {
              title: "Movement",
              key: "movement",
              align: "right" as const,
              render: (_: any, record: any) => (
                <Tag color={record?.type === "IN" ? "green" : "red"}>
                  {record?.type === "IN" ? "+" : "-"}
                  {record?.quantity}
                </Tag>
              ),
            },
            {
              title: "Reason",
              dataIndex: "referenceType",
              key: "referenceType",
              render: (value: string) => value || "Inventory Update",
            },
            {
              title: "Reference",
              dataIndex: "referenceNumber",
              key: "referenceNumber",
              render: (value: string) => value || "-",
            },
            {
              title: "Remarks",
              dataIndex: "remarks",
              key: "remarks",
              render: (value: string) => value || "-",
            },
          ]}
          dataSource={productTransactionData?.data?.data || productTransactionData?.data || []}
          rowKey="id"
          loading={productTransactionLoading}
          pagination={{ pageSize: 20 }}
          size="middle"
        />
      </Drawer>
    </>
  );
};

export default Page;
