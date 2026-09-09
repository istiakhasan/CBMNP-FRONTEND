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
  const [movementType, setMovementType] = useState<string>("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: size,
      searchProducts: searchTerm,
      searchTerm,
      warehouseId,
      type: movementType || undefined,
    }),
    [page, size, searchTerm, warehouseId, movementType],
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
    setMovementType("");
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
      <GbHeader title="Inventory Management & Stock Ledger" />
      <div className="p-[16px]">
        {/* Tabs */}
        <div className="mb-3 flex items-center gap-2">
          {[
            { label: "Master Stock Overview", key: "stock" },
            { label: "Warehouse Stock Distribution", key: "wws" },
            { label: "Movement & Audit Logs", key: "logs" },
          ].map(({ label, key }) => (
            <Button
              key={key}
              style={{
                background: tab === key ? "#4F8A6D" : "#f2f8fa",
                color: tab === key ? "#ffffff" : "#4F8A6D",
                borderColor: tab === key ? "#4F8A6D" : "#d9e8e2",
                boxShadow: "none",
                fontWeight: tab === key ? "600" : "normal",
              }}
              type={tab === key ? "primary" : "default"}
              size="middle"
              onClick={() => {
                setPage(1);
                router.push(`/${local}/inventory?tab=${key}`);
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Filters and Table Container */}
        <div className="gb_border bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center gap-3 flex-wrap p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="border border-gray-300 rounded p-2 h-[36px] w-[36px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                onClick={handleReset}
                title="Reset Filters"
              >
                <i
                  style={{ fontSize: "20px" }}
                  className="ri-restart-line text-gray-600"
                ></i>
              </div>

              <div>
                <Select
                  style={{ width: "210px" }}
                  placeholder="Filter by Warehouse"
                  value={warehouseId || undefined}
                  options={[
                    { label: "All Warehouses", value: "" },
                    ...(warehouseOptions?.data || []),
                  ]}
                  onChange={(e) => {
                    setPage(1);
                    setwarehouseId(e);
                  }}
                />
              </div>

              {tab === "logs" && (
                <div>
                  <Select
                    style={{ width: "160px" }}
                    placeholder="Movement Type"
                    value={movementType || undefined}
                    options={[
                      { label: "All Movements", value: "" },
                      { label: "🟢 Stock IN (+)", value: "IN" },
                      { label: "🔴 Stock OUT (-)", value: "OUT" },
                    ]}
                    onChange={(e) => {
                      setPage(1);
                      setMovementType(e);
                    }}
                  />
                </div>
              )}

              <Input
                placeholder={
                  tab === "logs"
                    ? "Search product, SKU, reference or remarks..."
                    : "Search by product name or code..."
                }
                allowClear
                style={{ width: "300px" }}
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>

            <Pagination
              pageSize={size}
              total={
                tab === "stock"
                  ? inventoryData?.total
                  : tab === "wws"
                    ? warehouseData?.total
                    : transactionData?.data?.total || transactionData?.total || 0
              }
              current={page}
              onChange={(p, s) => {
                setPage(p);
                setSize(s);
              }}
              showSizeChanger={false}
            />
          </div>

          <div>
            <GbTable
              loading={loading}
              columns={columns}
              dataSource={data}
              pageSize={size}
              stickey={true}
              scrollX={undefined}
              totalPages={
                tab === "stock"
                  ? inventoryData?.total
                  : tab === "wws"
                    ? warehouseData?.total
                    : transactionData?.data?.total || transactionData?.total || 0
              }
              onPaginationChange={(p, s) => {
                setPage(p);
                setSize(s);
              }}
              onRow={
                tab === "stock"
                  ? (record: any) => ({
                      onClick: () => openProductLog(record),
                      className: "cursor-pointer hover:bg-emerald-50/40 transition",
                    })
                  : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Single Product Log Drawer */}
      <Drawer
        title={
          <div>
            <div className="font-bold text-gray-900 text-base">
              {selectedProduct?.product?.name || "Product"} — Stock Movement History
            </div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
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
              title: "Date & Time",
              dataIndex: "transactionDate",
              key: "transactionDate",
              width: "170px",
              render: (value: string) => (
                <span className="text-sm font-mono text-gray-700 font-medium">
                  {value
                    ? new Date(value).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </span>
              ),
            },
            {
              title: "Warehouse",
              key: "warehouse",
              width: "170px",
              render: (_: any, record: any) =>
                record?.location?.name ? (
                  <span className="font-bold text-blue-800 text-sm">
                    {record.location.name}
                  </span>
                ) : (
                  <span className="text-purple-800 bg-purple-100 font-semibold px-2.5 py-1 rounded text-xs">
                    Master Inventory
                  </span>
                ),
            },
            {
              title: "Movement",
              key: "movement",
              align: "center" as const,
              width: "130px",
              render: (_: any, record: any) => {
                const isEntry = record?.type === "IN";
                return (
                  <span
                    className={`inline-block font-extrabold text-sm px-3 py-1 rounded-full ${
                      isEntry
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {isEntry ? `+ ${record?.quantity} IN` : `- ${record?.quantity} OUT`}
                  </span>
                );
              },
            },
            {
              title: "Event / Reason",
              dataIndex: "referenceType",
              key: "referenceType",
              width: "170px",
              render: (value: string, record: any) => (
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">
                    {value || "Stock Adjustment"}
                  </span>
                  {record?.referenceNumber && (
                    <span className="text-xs font-mono text-gray-600 font-medium">
                      Ref: {record.referenceNumber}
                    </span>
                  )}
                </div>
              ),
            },
            {
              title: "Remarks & Context",
              dataIndex: "remarks",
              key: "remarks",
              render: (value: string) => (
                <span className="text-sm text-gray-800 font-medium">{value || "Inventory adjusted"}</span>
              ),
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
