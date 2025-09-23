/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import GbTable from "@/components/GbTable";
import {
  Checkbox,
  CheckboxOptionType,
  Image,
  MenuProps,
  message,
  Pagination,
  Popover,
  Switch,
  Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import axios from "axios";
import {
  useGetAllUsersQuery,
  useUpdateUserByIdMutation,
} from "@/redux/api/usersApi";
// import AddUsers from "./AddUsers";
import moment from "moment";
import { useLocale } from "next-intl";
import {
  useCreateCustomerMutation,
  useEditCustomerMutation,
  useGetAllCustomersQuery,
} from "@/redux/api/customerApi";
import CreateCustomerDrawar from "../../orders/create-order/_component/CreateCustomerDrawar";
import GbForm from "@/components/forms/GbForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCustomerSchema } from "@/schema/schema";
import CreateCustomerEdit from "../../orders/edit/_component/CreateCustomerEdit";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./Editcustomer";
import OrderSearch from "@/components/OrderSearch";
// import EditUser from "./_component/EditUser";
const Customers = () => {
  //Add user modal
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  query["page"] = page;
  query["limit"] = size;
  query["searchTerm"] = searchTerm;
  const { data, isLoading } = useGetAllCustomersQuery(query);
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const local = useLocale();
  const tableColumn = [
    {
      title: "Created At",
      key: 6,
      align: "",
      //@ts-ignore
      render: (text, record, index) => {
        const formattedDate = moment(record?.createdAt).format("MMM D, YYYY");

        return <span className="color_primary">{formattedDate}</span>;
      },
    },
    {
      title: "Name",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="color_primary cursor-pointer">
            {record?.customerName}
          </span>
        );
      },
    },
    {
      title: "Phone",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className=" cursor-pointer">{record?.customerPhoneNumber}</span>
        );
      },
    },
    {
      title: "Customer Id",
      key: 22,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className=" cursor-pointer whitespace-nowrap">
            {record?.customer_Id}
          </span>
        );
      },
    },
    {
      title: "Type",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className=" cursor-pointer border border-gray-300 px-2 text-[12px]">
            {record?.customerType}
          </span>
        );
      },
    },
    {
      title: "Country",
      key: 4,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="">{record?.country || "N/A"}</span>;
      },
    },
    {
      title: "Address",
      key: 4,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="">{record?.address}</span>;
      },
    },

    {
      title: "Action",
      key: 17,
      align: "end",
      render: (_: any, record: any) => {
        return (
          <i
            onClick={() => {
              setOpenEditCustomerModal(true);
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

  const [handleCreateCustomer] = useCreateCustomerMutation();
  const [handleEditCustomer] = useEditCustomerMutation();
  const formSubmit = async (data: any, reset: any) => {
    try {
      const payload = { ...data };
      payload["customerType"] = data?.customerType?.value;
      payload["district"] = data?.district?.label;
      payload["division"] = data?.division?.label;
      payload["thana"] = data?.thana?.label;
      payload["addressBook"] = false;
      if (!!data?.country) {
        payload["country"] = data?.country?.value;
      }

      const res = await handleCreateCustomer({data:payload,addressBook:false}).unwrap();
      if (res?.success === true) {
        message.success("Customer create successfully");
        setOpenAddCustomerModal(false);
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      }
      message.error("Something went wrong");
      reset();
    }
  };
  const editFormSubmit = async (data: any, reset: any) => {
    try {
      const payload = { ...data };
      payload["customerType"] = data?.customerType?.value;
      payload["district"] = data?.district?.label;
      payload["division"] = data?.division?.label;
      payload["thana"] = data?.thana?.label;
      
      if (!!data?.country) {
        payload["country"] = data?.country?.value;
      }
      const res = await handleEditCustomer({
        id: rowData?.id,
        data: payload,
      }).unwrap();
      if (res?.success === true) {
        message.success("Customer create successfully");
        setOpenEditCustomerModal(false);
        setRowData(null);
        reset();
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      }
      message.error("Something went wrong");
      reset();
    }
  };
  return (
    <>
      <GbHeader title="Customers" />
      <div className="p-[16px]">
        <div className="flex justify-between items-center py-4 px-2">
          <OrderSearch
            placeholder="Search by name"
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setOpenAddCustomerModal(true)}
              className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]"
            >
              Add Customer
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
      {/*Add user modals  */}
      <GbModal
        isModalOpen={openAddCustomerModal}
        openModal={() => setOpenAddCustomerModal(true)}
        closeModal={() => setOpenAddCustomerModal(false)}
        width="550px"
        cls="custom_ant_modal"
      >
        <div className="p-[20px]">
          <GbForm
            resolver={yupResolver(createCustomerSchema)}
            submitHandler={formSubmit}
          >
            <h1 className="text-[20px]">Create Customer</h1>
            <AddCustomer height="h-auto" />
          </GbForm>
        </div>
      </GbModal>
      {/*Edit user modals  */}
      <GbModal
        isModalOpen={openEditCustomerModal}
        openModal={() => setOpenEditCustomerModal(true)}
        closeModal={() => setOpenEditCustomerModal(false)}
        width="500px"
        cls="custom_ant_modal"
      >
        <div className="p-[20px]">
          <GbForm
            resolver={yupResolver(createCustomerSchema)}
            submitHandler={editFormSubmit}
            defaultValues={{
              customerName: rowData?.customerName,
              customerPhoneNumber: rowData?.customerPhoneNumber,
              customerAdditionalPhoneNumber:
                rowData?.customerAdditionalPhoneNumber,
              address: rowData?.address,
              country: {
                label: rowData?.country,
                value: rowData?.country,
              },
              customerType: {
                label: rowData?.customerType,
                value: rowData?.customerType,
              },
            }}
          >
            <h1 className="text-[20px]">Edit Customer</h1>

            <EditCustomer height="h-auto" />
          </GbForm>
        </div>
      </GbModal>
    </>
  );
};

export default Customers;
