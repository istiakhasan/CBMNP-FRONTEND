/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import { Pagination } from "antd";
import { useSearchParams } from "next/navigation";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import GbModal from "@/components/ui/GbModal";
import CreateWarehouse from "./_component/CreateWarehouse";
const Page = () => {
  const search = useSearchParams();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  query["page"] = page;
  query["limit"] = size;
  query["searchProducts"] = searchTerm;
  const { data, isLoading, refetch } = useLoadAllWarehouseQuery(query);
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
      title: "Phone",
      key: 7,
      align: "end",
      render: () => {
        return <i className="ri-edit-2-fill text-[18px] color_primary"></i>;
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
  return (
    <>
      <GbHeader title="Warehouse" />
      <div className="p-[16px]">
        <div className="flex justify-end items-center py-4 px-2">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#47a2b3] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
          >
            Create
          </button>
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

      {/* modals */}
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
    </>
  );
};

export default Page;
