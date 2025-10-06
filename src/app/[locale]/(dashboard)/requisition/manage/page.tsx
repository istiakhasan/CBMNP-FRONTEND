"use client";
import GbTable from "@/components/GbTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllRequisitionQuery } from "@/redux/api/requisitionApi";
import StatusBadge from "@/util/StatusBadge";

import {
  Checkbox,
  CheckboxOptionType,
  Pagination,
  Popover,
  TableProps,
} from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewRequisition from "../_component/ViewRequisition";
const rowSelection: TableProps<any>["rowSelection"] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {},
  getCheckboxProps: (record: any) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

const Page = ({}: any) => {
  // all states
  const [viewRequsition,setViewRequisition]=useState(false)
  const [rowData,setRowData]=useState<any>(null)
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAllRequisitionQuery({
    page,
    limit: size,
    searchTerm,
  });

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      key: "sl",
      render: (text: string, record: any, i: any) => {
        const slNumber = page * size + (i + 1) - size;
        // 1*10+(0+1)-10
        return (
          <span className="font-[500]">
            {String(slNumber).padStart(2, "0")}
          </span>
        );
      },
    },
    {
      title: "Req Number",
      key: "orderId",
      render: (text: string, record: any) => (
        <>
          <span className="color_primary font-[500] cursor-pointer">
            {record?.requisitionNumber}
          </span>
          <i
            // onClick={() => copyToClipboard(record?.orderNumber)}
            className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px]"
          ></i>
        </>
      ),
    },

    {
      title: "Creation date",
      key: "Order date",
      align: "start",
      render: (text: string, record: any, i: any) => {
        return (
          <span className="font-[500]">
            {moment(record?.createdAt).format("DD MMM YY, h:mma")}
          </span>
        );
      },
    },
    {
      title: "Created By",
      key: "2",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {record?.user?.name || "N/A"}
        </span>
      ),
    },
    {
      title: "Total Orders",
      key: "3",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {record?.totalOrders}
        </span>
      ),
    },
    {
      title: "Action",
      key: "1",
      width: "60px",
      render: (text: string, record: any) => {
        return (
          <>
            {
              <span
                onClick={() => {
                  setViewRequisition(true)
                  setRowData(record)
                }}
                className=" text-white text-[10px] py-[2px] px-[10px] cursor-pointer"
              >
                <i
                  style={{ fontSize: "18px" }}
                  className="ri-eye-fill color_primary"
                ></i>
              </span>
            }
          </>
        );
      },
    },
  ];

  const defaultCheckedList = tableColumn.map((item: any) => item.key as string);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const newColumns = tableColumn.map((item: any) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string),
  }));
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const options = tableColumn.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  console.log(data, "data");
  return (
    <div>
      <GbHeader title="Requisition" />
      <div className="p-[16px]">
        <div className="gb_border">
          <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
            <div className="flex gap-2">
              <div className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center">
                <i
                  style={{ fontSize: "24px" }}
                  className="ri-restart-line text-gray-600"
                ></i>
              </div>
              <Popover
                placement="bottom"
                content={
                  <div className=" min-w-[200px]">
                    <Checkbox.Group
                      className="flex flex-col gap-3"
                      value={checkedList}
                      options={options as CheckboxOptionType[]}
                      onChange={(value) => {
                        setCheckedList(value as string[]);
                      }}
                    />
                  </div>
                }
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <div className="border p-2 h-[35px] flex items-center gap-2 cursor-pointer">
                  <i
                    style={{ fontSize: "24px" }}
                    className="ri-equalizer-line text-gray-600"
                  ></i>{" "}
                  Filter Column
                </div>
              </Popover>
            </div>
            <Pagination
              pageSize={size}
              total={data?.meta?.total}
              onChange={(v, d) => {
                setPage(v);
                setSize(d);
              }}
              showSizeChanger={false}
            />
          </div>
          <div className="max-h-[600px] overflow-scroll">
            <GbTable
              // rowSelection={rowSelection}
              loading={isLoading}
              columns={newColumns}
              dataSource={data?.data}
            />
          </div>
          <GbModal openModal={()=>setViewRequisition(true)} closeModal={()=>setViewRequisition(false)} isModalOpen={viewRequsition}>
            <ViewRequisition rowData={rowData} />
          </GbModal>
        </div>
      </div>
    </div>
  );
};

export default Page;
