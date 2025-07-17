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
import EditWarehouse from "./_component/EditWarehouse";
const Page = () => {
  const search = useSearchParams();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [rowData,setRowData]=useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState(false);
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
      title: "Action",
      key: 7,
      align: "end",
      render: (_:any,record:any) => {
        return <i onClick={()=>{
          setEditWarehouse(true)
          setRowData(record)
        }} className="ri-edit-2-fill text-[18px] color_primary cursor-pointer"></i>;
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
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
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
