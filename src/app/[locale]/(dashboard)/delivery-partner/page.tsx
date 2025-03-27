"use client";
import GbTable from "@/components/GbTable";
import OrderSearch from "@/components/OrderSearch";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import { useGetProcurementQuery } from "@/redux/api/procurementApi";
import {
  Checkbox,
  CheckboxOptionType,
  Pagination,
  Popover,
  Switch,
} from "antd";
import moment from "moment";
import React, { useState } from "react";
import StatusBadge from "@/util/StatusBadge";
import GbForm from "@/components/forms/GbForm";
import { useGetDeliveryPartnersQuery, useUpdatePartnerMutation } from "@/redux/api/partnerApi";

const Page = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [receiveModal,setReceiveModal]=useState(false)
  const [rowData,setRowData]=useState(false)
  const { data, isLoading } = useGetDeliveryPartnersQuery({
    page,
    size,
    searchTerm
  });

  const [updateDeliveryPartner]=useUpdatePartnerMutation()

  const tableColumns = [
    {
      title: "Sl",
      key: "1",
      render: (a: any, b: any, i: any) => {
        const sl = page * size - size + (i + 1);
        return <span>{sl}</span>;
      },
    },
    {
        title: "Date",
        key: "2",
        render: (a: any, record: any, i: any) => {
          return <span>{moment(record?.createdAt).format("YYYY-MMMM-DD")}</span>;
        },
      },
    {
      title: "Name",
      key: "11",
      render: (a: any, b: any, i: any) => {
        return <span>{b?.partnerName}</span>;
      },
    },
   
    {
      title: "Contact Person",
      key: "12",
      render: (a: any, record: any, i: any) => {
        return <span className="text-primary">{record?.contactPerson}</span>;
      },
    },
    {
      title: "Phone",
      key: "3",
      render: (a: any, record: any, i: any) => {
        return <span>{record?.phone}</span>;
      },
    },
    {
      title: "Status",
      key: "15",
      align:"end",
      render: (a: any, b: any, i: any) => {
        console.log(b.status);
        return    <div className="flex justify-start gap-[10px] text-[14px] font-[500]">
        <Switch
          size="small"
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={async (a) => {
              const res = await updateDeliveryPartner({
                id: b?.id,
                data: {
                  active: a,
                },
              });
          }}
          defaultChecked={b?.active}
        />
      </div>;
      },
    }
  ];

  const defaultCheckedList = tableColumns.map(
    (item: any) => item.key as string
  );
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const newColumns = tableColumns.map((item: any) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string),
  }));
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const options = tableColumns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  return (
    <div>
      <GbHeader title="Delivery Partner" />

      <div className="p-[16px]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <OrderSearch
            setSearchTerm={setSearchTerm}
            placeholder={"Search by invoice number"}
            searchTerm={searchTerm}
          />
          <button
            //   onClick={() => router.push(`/${local}/orders/create-order`)}
            className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
          >
            Create Purchase
          </button>
        </div>
        <div className="gb_border my-2">
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
            <div className="flex gap-3">
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
          </div>
          <div className="h-[500px] overflow-scroll">
            <GbTable
              loading={isLoading}
              columns={newColumns}
              dataSource={data?.data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
