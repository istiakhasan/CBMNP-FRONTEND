/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import { Card, Input, message, Pagination, Popconfirm, Skeleton, Tag } from "antd";
import { useSearchParams } from "next/navigation";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useLoadAllWarehouseQuery,
  useGetWarehouseOverviewQuery,
  useSetDefaultWarehouseMutation,
} from "@/redux/api/warehouse";
import GbModal from "@/components/ui/GbModal";
import CreateWarehouse from "./_component/CreateWarehouse";
import EditWarehouse from "./_component/EditWarehouse";
const Page = () => {
  const search = useSearchParams();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [rowData, setRowData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [setDefaultWarehouse, { isLoading: settingDefault }] =
    useSetDefaultWarehouseMutation();
  const [editWarehouse, setEditWarehouse] = useState(false);
  query["page"] = page;
  query["limit"] = size;
  query["searchTerm"] = searchTerm;
  const { data, isLoading, refetch } = useLoadAllWarehouseQuery(query);
  const { data: overviewResponse, isLoading: overviewLoading } = useGetWarehouseOverviewQuery(undefined);
  const overview = overviewResponse?.data;
  const warehouseStock = new Map<string, any>((overview?.warehouses || []).map((item: any) => [item.warehouseId, item]));
  const [loading, setLoading] = useState(false);
  // table column
  const tableColumn = [
    {
      title: "SL",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        const currentRow = page * size + (index + 1) - size;
        return <span className="cursor-pointer">{currentRow}</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      dataIndex: "name",
    },
    {
      title: "Location",
      key: 4,
      dataIndex: "location",
    },
    {
      title: "Contact person",
      key: 5,
      dataIndex: "contactPerson",
    },
    {
      title: "Phone",
      key: 6,
      dataIndex: "phone",
    },
    {
      title: "Default",
      key: 8,
      align: "center",
      //@ts-ignore
      render: (_, record) => {
        if (record.isDefault) {
          return (
            <i
              className="ri-star-fill text-[18px]"
              style={{ color: "#FBBF24" }}
              title="Default warehouse"
            ></i>
          );
        }
        return (
          <Popconfirm
            title="Set as default warehouse?"
            description={`"${record.name}" will become the default warehouse for this organization.`}
            okText="Yes"
            cancelText="No"
            disabled={settingDefault}
            onConfirm={() => handleSetDefault(record.id)}
          >
            <i
              className="ri-star-line text-[18px] text-gray-400 cursor-pointer hover:text-[#FBBF24]"
              title="Set as default"
            ></i>
          </Popconfirm>
        );
      },
    },
    {
      title: "Stock overview",
      key: "stockOverview",
      render: (_: any, record: any) => {
        const stock = warehouseStock.get(record.id);
        return <div className="min-w-[130px] text-xs"><div className="font-semibold text-slate-700">{Number(stock?.availableQuantity || 0).toLocaleString()} available</div><div className="mt-0.5 text-slate-500">{Number(stock?.skuCount || 0).toLocaleString()} SKUs · {Number(stock?.allocatedQuantity || 0).toLocaleString()} allocated</div></div>;
      },
    },
    {
      title: "Stock health",
      key: "stockHealth",
      render: (_: any, record: any) => {
        const stock = warehouseStock.get(record.id);
        const expired = Number(stock?.expiredQuantity || 0);
        const held = Number(stock?.holdQuantity || 0);
        return expired > 0 ? <Tag color="error">{expired} expired</Tag> : held > 0 ? <Tag color="warning">{held} on hold</Tag> : <Tag color="success">Healthy</Tag>;
      },
    },
    {
      title: "Action",
      key: 7,
      align: "end",
      render: (_: any, record: any) => {
        return (
          <i
            onClick={() => {
              setEditWarehouse(true);
              setRowData(record);
            }}
            className="ri-edit-2-fill text-[18px] color_primary cursor-pointer"
          ></i>
        );
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const handleRefetch = async () => {
    setLoading(true);
    setTimeout(async () => {
      await refetch();
      setLoading(false);
    }, 1000);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultWarehouse(id).unwrap();
      message.success("Default warehouse updated");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <GbHeader title="Warehouse" />
      <div className="p-[16px]">
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {overviewLoading ? <Skeleton active className="xl:col-span-5" /> : [
            ["Warehouses", overview?.totalWarehouses, "ri-building-2-line", "bg-blue-50 text-blue-600"],
            ["Active SKUs", overview?.totalSkus, "ri-stack-line", "bg-violet-50 text-violet-600"],
            ["Available stock", overview?.availableQuantity, "ri-inbox-archive-line", "bg-emerald-50 text-emerald-600"],
            ["Allocated stock", overview?.allocatedQuantity, "ri-route-line", "bg-amber-50 text-amber-600"],
            ["Expired stock", overview?.expiredQuantity, "ri-error-warning-line", "bg-rose-50 text-rose-600"],
          ].map(([label, value, icon, tone]: any) => <Card key={label} className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}><div className="flex items-center justify-between"><div><p className="m-0 text-xs font-medium text-slate-500">{label}</p><p className="mb-0 mt-1 text-xl font-bold text-slate-800">{Number(value || 0).toLocaleString()}</p></div><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${tone}`}><i className={icon} /></span></div></Card>)}
        </section>
        <div className="mb-4 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div><h1 className="m-0 text-base font-semibold text-slate-800">Warehouse directory</h1><p className="mb-0 mt-1 text-xs text-slate-500">Monitor stock health, default fulfillment location, and warehouse contacts.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }} allowClear placeholder="Search warehouse" prefix={<i className="ri-search-line text-slate-400" />} className="sm:w-56" />
          <button
            onClick={() => setOpen(true)}
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
          >
            <i className="ri-add-line mr-1" /> Create warehouse
          </button>
          </div>
        </div>
        <div className="gb_border">
          <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
            <div className="flex gap-2">
              <div
                onClick={handleRefetch}
                className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center"
              >
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
              loading={loading || isLoading}
              columns={tableColumn}
              dataSource={data?.data}
              pageSize={size}
              totalPages={data?.total}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>

      {/*Create Warehouse modals */}
      <GbModal
        isModalOpen={open}
        openModal={() => setOpen(true)}
        closeModal={() => setOpen(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <CreateWarehouse setOpen={setOpen} />
      </GbModal>

      {/*Edit Warehouse modals */}
      <GbModal
        isModalOpen={editWarehouse}
        openModal={() => setEditWarehouse(true)}
        closeModal={() => setEditWarehouse(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <EditWarehouse setOpen={setEditWarehouse} rowData={rowData} />
      </GbModal>
    </>
  );
};

export default Page;
