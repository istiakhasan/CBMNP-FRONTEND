/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import GbTable from "@/components/GbTable";
import {
  Checkbox,
  CheckboxOptionType,
  Image,
  MenuProps,
  Pagination,
  Popover,
  Switch,
  Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import axios from "axios";
import { useGetAllUsersQuery, useUpdateUserByIdMutation } from "@/redux/api/usersApi";
import AddUsers from "./AddUsers";
import moment from "moment";
const Users = () => {
  //Add user modal
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  query["page"] = page;
  query["limit"] = size;
  query["searchProducts"] = searchTerm;
  const { data, isLoading } = useGetAllUsersQuery(query);
  const [updateUser]=useUpdateUserByIdMutation()
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "Name",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span
            onClick={() => router.push(`/access/users/${record?.userId}`)}
            className="color_primary cursor-pointer"
          >
            {record?.name}
          </span>
        );
      },
    },
    {
      title: "Email",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer">{record?.email}</span>;
      },
    },
    {
      title: "Phone Number",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer">{record?.phone}</span>;
      },
    },
    {
      title: "Role",
      key: 4,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="color_primary uppercase font-semibold cursor-pointer">
            {record?.role}
          </span>
        );
      },
    },
    {
      title: "Permission Group",
      key: 5,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer">N/A</span>;
      },
    },
    {
      title: "Locations",
      key: 6,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer">{record?.address}</span>;
      },
    },
    {
      title: "Status",
      align: "start",
      key: 7,
      render: (_: any, record: any) => (
        <div className="flex justify-start gap-[10px] text-[14px] font-[500]">
          <Switch
            size="small"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={async (a) => {
                const res = await updateUser({
                  id: record?.userId,
                  data: {
                    active: a,
                  },
                });
            }}
            defaultChecked={record?.active}
          />
        </div>
      ),
    },

    {
      title: "Created At",
      key: 6,
      align: "end",
      //@ts-ignore
      render: (text, record, index) => {
        const formattedDate = moment(record?.createdAt).format(
          "MMMM D, YYYY h:mm A"
        );

        return (
          <span
            onClick={() => router.push(`/product/${record?.id}`)}
            className="color_primary cursor-pointer"
          >
            {formattedDate}
          </span>
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
    <>
      <GbHeader />
      <div className="p-[16px]">
        <div className="flex justify-between items-center py-4 px-2">
          <p className="text-[20px]">Users</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setOpenAddUserModal(true)}
              className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
            >
              Add User
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
              // onShowSizeChange={false}
            />
          </div>
          <div className="max-h-[500px] overflow-scroll">
            <GbTable
              loading={isLoading}
              columns={newColumns}
              dataSource={data?.data}
            />
          </div>
        </div>
      </div>
      {/* modals  */}
      <GbModal
        isModalOpen={openAddUserModal}
        openModal={() => setOpenAddUserModal(true)}
        closeModal={() => setOpenAddUserModal(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <AddUsers setOpenAddUserModal={setOpenAddUserModal} />
      </GbModal>
    </>
  );
};

export default Users;
