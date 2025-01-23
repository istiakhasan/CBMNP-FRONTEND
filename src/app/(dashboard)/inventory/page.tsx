/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import { Button, Divider, Pagination, Tooltip } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteProductByIdMutation,
  useGetAllProductQuery,
} from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useLoadAllInventoryQuery, useLoadAllTransactionQuery } from "@/redux/api/inventoryApi";

const Page = () => {
  const search = useSearchParams();
  console.log(search.get("tab"), "params");
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  query["page"] = page;
  query["limit"] = size;
  query["searchProducts"] = searchTerm;
  const { data, isLoading } = useLoadAllInventoryQuery(query);
  const { data:transactionData, isLoading:isTransactionLoading } = useLoadAllTransactionQuery(query);
  const [deleteBrandHandle] = useDeleteProductByIdMutation();
  const router = useRouter();
  console.log(data, "data");
  // table column
  const tableColumn = [
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.product?.sku || "N/A"}</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>{record?.product?.name}</span>
          </>
        );
      },
    },
    {
      title: "Total Warehouses",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <div className="flex items-center gap-2">
            <span>{record?.inventoryItems?.length || "N/A"}</span>
            <Tooltip
              overlayInnerStyle={{ background: "green", width: "900px" }}
              autoAdjustOverflow={false}
              trigger={["click"]}
              color="white"
              style={{ background: "red", padding: "0" }}
              placement="bottom"
              title={
                <div>
                  <div className=" bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold mb-4">
                      Warehouse Information
                    </h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            SL
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Warehouse Name
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Warehouse Location
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Available Quantity
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Shortage
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Wastage
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Expired
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {record?.inventoryItems?.map(
                          (item: any, index: any) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm color_primary hover:underline cursor-pointer">
                                {item?.location?.name}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.location?.location}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.quantity}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {"pending"}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.wastageQuantity}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.expiredQuantity}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            >
              {" "}
              <i className="ri-information-2-line text-[18px] cursor-pointer"></i>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Total Available Quantity",
      key: 5,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock}</span>;
      },
    },
    {
      title: <span>Total Stock Value</span>,
      key: 6,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock * record?.product?.salePrice}</span>;
      },
    },
    {
      title: <span>Total Purchase Cost</span>,
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock * record?.product?.purchasePrice}</span>;
      },
    },
    {
      title: "Total Shortage Quantity",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{"pending"}</span>;
      },
    },
    {
      title: "Total Wastage",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.wastageQuantity}</span>;
      },
    },
    {
      title: "Total Expired",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.expiredQuantity}</span>;
      },
    },
  ];
  const logsTableColumn = [
    {
      title: "Warehouse",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="color_primary cursor-pointer">{record?.location?.name || "Inventory"}</span>;
      },
    },
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.product?.sku || "N/A"}</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span className="block mb-2 color_primary cursor-pointer">
              {record?.product?.name}
            </span>
          </>
        );
      },
    },
    {
      title: "Quantity",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {`${record?.type==="IN"?"+":"-"}${record?.quantity}`}
            </span>
          </>
        );
      },
    },
    {
      title: "Updated By",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              Pending
            </span>
          </>
        );
      },
    },
    {
      title: "Updated At",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              Pending
            </span>
          </>
        );
      },
    },
    {
      title: "Remarks",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span className="block mb-2 color_primary cursor-pointer">
              Pending
            </span>
          </>
        );
      },
    },
  ];
  console.log(transactionData,"transaction data");
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  return (
    <>
      <GbHeader />
      <div className="p-[16px]">
        <div className="flex justify-between items-center py-4 px-2">
          <p className="text-[20px]">Inventory</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="border-[#4F8A6D] border text-[#4F8A6D]  font-bold text-[12px]  px-[20px] py-[5px]">
              Action
            </button>
          </div>
        </div>
        <div className="mb-3">
          <Button
            style={{
              background: "#f2f8fa",
              color: "#4F8A6D",
              boxShadow: "none",
            }}
            onClick={() => router.push("/inventory")}
            type="primary"
            size="small"
            className="mr-2"
          >
            Stock
          </Button>
          <Button
            style={{
              background: "#f2f8fa",
              color: "#4F8A6D",
              boxShadow: "none",
            }}
            onClick={() => router.push("/inventory?tab=logs")}
            type="primary"
            size="small"
            className="mr-2"
          >
            Logs
          </Button>
        </div>
        <div className="gb_border">
          <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
            <div className="flex gap-2">
              <div className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center">
                <i
                  style={{ fontSize: "24px" }}
                  className="ri-restart-line text-gray-600"
                ></i>
              </div>
            </div>
            <Pagination
              pageSize={size}
              total={data?.total}
              onChange={(v, d) => {
                setPage(v);
                setSize(d);
              }}
              showSizeChanger={false}
              // onShowSizeChange={false}
            />
          </div>
          <div className="max-h-[500px] overflow-scroll">
            <GbTable
              loading={isLoading}
              columns={
                search.get("tab") === "logs" ? logsTableColumn : tableColumn
              }
              dataSource={ search.get("tab") === "logs" ?transactionData?.data :data?.data}
              pageSize={size}
              totalPages={data?.total}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
