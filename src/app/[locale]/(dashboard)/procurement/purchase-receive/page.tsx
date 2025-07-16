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
} from "antd";
import moment from "moment";
import React, { useState } from "react";
import StatusBadge from "@/util/StatusBadge";
import PurchaseOrderReceive from "./_component/PurchaseOrderReceive";
import GbForm from "@/components/forms/GbForm";

const Page = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [receiveModal,setReceiveModal]=useState(false)
  const [rowData,setRowData]=useState(false)
  const { data, isLoading } = useGetProcurementQuery({
    page,
    size,
    searchTerm,
    status:"Approved"
  });

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
      title: "Invoice Number",
      key: "12",
      render: (a: any, record: any, i: any) => {
        return <span className="text-primary">{record?.invoiceNumber}</span>;
      },
    },
    {
      title: "Supplier",
      key: "3",
      render: (a: any, record: any, i: any) => {
        return <span>{record?.supplier?.contactPerson}</span>;
      },
    },
    {
      title: "Amount",
      key: "5",
      render: (a: any, b: any, i: any) => {
        return <span>{b?.billAmount}</span>;
      },
    },
    {
      title: "Status",
      key: "15",
      render: (a: any, b: any, i: any) => {
        console.log(b.status);
        return <StatusBadge status={{ label: b?.status }} />;
      },
    },
    {
        title: "Action",
        key: "action",
        width: "80px",
        render: (text: string, record: any) => {
          return (
            <button onClick={()=>{
              setReceiveModal(true)
              setRowData(record)
              }} className="bg-[#8A6D4F]  text-white text-xs font-medium py-1 px-4 rounded-md shadow-md transition duration-200">
              Receive
            </button>
          );
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
      <GbHeader title="Purchase Approved" />

      <div className="p-[16px]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <OrderSearch
            setSearchTerm={setSearchTerm}
            placeholder={"Search by invoice number"}
            searchTerm={searchTerm}
          />
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
          <GbModal
            width="1300px"
            // clseTab={false}
            isModalOpen={receiveModal}
            openModal={() => setReceiveModal(true)}
            closeModal={() => setReceiveModal(false)}
          >
            <GbForm submitHandler={(data:any)=>console.log(data)}>

           <PurchaseOrderReceive rowData={rowData} setReceiveModal={setReceiveModal} setRowData={setRowData} />
            </GbForm>
          </GbModal>
        </div>
      </div>
    </div>
  );
};

export default Page;
