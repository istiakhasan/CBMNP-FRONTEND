"use client";
import GbTable from "@/components/GbTable";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import { useGetAllMainCategoryQuery } from "@/redux/api/categoryApi";
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
import EditCategory from "./EditCategory";
import AddCategory from "./AddCategory";

const CategoryPage = ({}: any) => {
  // all states
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAllMainCategoryQuery({
    page,
    limit: size,
    searchTerm,
  });

  const [rowData, setRowData] = useState<any>(null);
  const [editCategory, setEditCategory] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      dataIndex: "sl",
      key:'14',
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
      title: "Label",
      dataIndex: "label",
      key:"15",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {record?.label}
        </span>
      ),
    },
    {
      title: "Creation date",
      dataIndex: "Order date",
      align: "start",
      key:"18",
      render: (text: string, record: any, i: any) => {
        return (
          <span className="font-[500]">
            {moment(record?.createdAt).format("DD MMM YY, h:mma")}
          </span>
        );
      },
    },

    {
      title: "Edit",
      key: 17,
      align: "end",
      render: (_: any, record: any) => {
        return (
          <i
            onClick={() => {
              setEditCategory(true);
              setRowData(record);
            }}
            className="ri-edit-2-fill text-[18px] color_primary cursor-pointer"
          ></i>
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

  return (
    <div>
      <GbHeader title="Category" />
      <div className="p-[16px]">
        <div className="flex justify-end items-center py-4 px-2">
          {/* <p className="text-[20px]">Users</p> */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
                onClick={() => setAddCategory(true)}
              className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
            >
              Add Category
            </button>
          </div>
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
              loading={isLoading}
              columns={newColumns}
              dataSource={data?.data}
            />
          </div>

          {/*Create category modals  */}
          <GbModal
            isModalOpen={addCategory}
            openModal={() => setAddCategory(true)}
            closeModal={() => setAddCategory(false)}
            clseTab={false}
            width="500px"
            cls="custom_ant_modal"
          >
            <AddCategory setAddCategory={setAddCategory} />
          </GbModal>
          {/*Edit category modals  */}
          <GbModal
            isModalOpen={editCategory}
            openModal={() => setEditCategory(true)}
            closeModal={() => setEditCategory(false)}
            clseTab={false}
            width="500px"
            cls="custom_ant_modal"
          >
            <EditCategory rowData={rowData} setEditCategory={setEditCategory} />
          </GbModal>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
