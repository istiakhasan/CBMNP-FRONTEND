/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo } from "react";
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
import { useLocale } from "next-intl";
import EditUser from "./_component/EditUser";
import ChangeUserPassword from "./_component/ChangeUserPassword";
import OrderSearch from "@/components/OrderSearch";
import { debounce } from "lodash";
import AssignUserPermission from "./_component/AssignUserPermission";

const Users = () => {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
        setPage(1);
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  query["page"] = page;
  query["limit"] = size;
  query["searchTerm"] = debouncedSearchTerm;
  const { data, isLoading } = useGetAllUsersQuery(query);
  const [updateUser] = useUpdateUserByIdMutation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [editUser, setEditUser] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const local = useLocale();

  // ---- Bulk permission assignment state ----
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [openAssignPermissionModal, setOpenAssignPermissionModal] = useState(false);

  const tableColumn = [
    {
      title: "Name",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span
            onClick={() => router.push(`/${local}/access/users/${record?.userId}`)}
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
      title: "User Id",
      key: 22,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer whitespace-nowrap">{record?.userId}</span>;
      },
    },
    {
      title: "Internal Id",
      key: 22,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className=" cursor-pointer whitespace-nowrap">{record?.internalId}</span>;
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
      title: "Locations",
      key: 6,
      width: "220px",
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
                id: record?.id,
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
        const formattedDate = moment(record?.createdAt).format("MMM D, YYYY");

        return <span className="color_primary">{formattedDate}</span>;
      },
    },
    {
      title: "Action",
      key: 17,
      align: "end",
      render: (_: any, record: any) => {
        return (
          <div className="flex justify-end gap-3">
            <Tooltip title="Edit user">
              <i
                onClick={() => {
                  setEditUser(true);
                  setRowData(record);
                }}
                className="ri-edit-2-fill text-[18px] color_primary cursor-pointer"
              ></i>
            </Tooltip>
            <Tooltip title="Change password">
              <i
                onClick={() => {
                  setOpenPasswordModal(true);
                  setRowData(record);
                }}
                className="ri-lock-password-fill text-[18px] color_primary cursor-pointer"
              ></i>
            </Tooltip>
          </div>
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

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (keys: React.Key[]) => setSelectedUserIds(keys as string[]),
  };

  return (
    <>
      <GbHeader />
      <div className="p-[16px]">
        <div className="flex justify-between items-center py-4 px-2">
          <p className="text-[20px]">Users</p>
          <div className="flex items-center gap-3 flex-wrap">
            {selectedUserIds.length > 0 && (
              <button
                onClick={() => setOpenAssignPermissionModal(true)}
                className="bg-[#2E6F95] text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
              >
                Assign Permission ({selectedUserIds.length})
              </button>
            )}
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
              <OrderSearch
                placeholder={"Search User"}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
              />
              <div className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center">
                <i style={{ fontSize: "24px" }} className="ri-restart-line text-gray-600"></i>
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
                  <i style={{ fontSize: "24px" }} className="ri-equalizer-line text-gray-600"></i>{" "}
                  Filter Column
                </div>
              </Popover>
            </div>
            <Pagination
              pageSize={size}
              total={data?.meta?.total}
              current={page}
              onChange={(v, d) => {
                setPage(v);
                setSize(d);
              }}
              showSizeChanger={false}
            />
          </div>
          <div className="max-h-[500px] overflow-scroll">
            <GbTable
              loading={isLoading}
              columns={newColumns}
              dataSource={data?.data}
              id="userId"
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </div>
      {/*Add user modals  */}
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
      {/*Edit user modals  */}
      <GbModal
        isModalOpen={editUser}
        openModal={() => setEditUser(true)}
        closeModal={() => setEditUser(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <EditUser rowData={rowData} setOpenAddUserModal={setEditUser} />
      </GbModal>
      {/*Change password modal  */}
      <GbModal
        isModalOpen={openPasswordModal}
        openModal={() => setOpenPasswordModal(true)}
        closeModal={() => setOpenPasswordModal(false)}
        clseTab={false}
        width="500px"
        cls="custom_ant_modal"
      >
        <ChangeUserPassword rowData={rowData} setOpenPasswordModal={setOpenPasswordModal} />
      </GbModal>
      {/*Bulk assign permission modal  */}
      <GbModal
        isModalOpen={openAssignPermissionModal}
        openModal={() => setOpenAssignPermissionModal(true)}
        closeModal={() => setOpenAssignPermissionModal(false)}
        clseTab={false}
        width="760px"
        cls="custom_ant_modal"
      >
        <AssignUserPermission
          selectedUsers={data?.data?.filter((u: any) => selectedUserIds.includes(u.userId)) || []}
          onClose={() => setOpenAssignPermissionModal(false)}
        />
      </GbModal>
    </>
  );
};

export default Users;