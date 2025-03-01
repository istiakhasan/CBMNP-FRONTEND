"use client";
import GbForm from "@/components/forms/GbForm";
import GbTable from "@/components/GbTable";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import GbModal from "@/components/ui/GbModal";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} from "@/redux/api/orderApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import StatusBadge from "@/util/StatusBadge";
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Image,
  MenuProps,
  Pagination,
  Popover,
  Select,
  Spin,
  Switch,
  TableProps,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import BulkChangeOrders from "./BulkChangeOrders";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useReactToPrint } from "react-to-print";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import { useLocale } from "next-intl";
import Invoice from "./Invoice";

const PackingOrders = ({}: any) => {
  // all states
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationId, setLocationId] = useState("");
  const { data: warehouseOptions } = useLoadAllWarehouseOptionsQuery(undefined);
  const [printModal, setPrintModal] = useState(false);
  const [rowId, setRowId] = useState<any>(null);
  const local=useLocale()
  const { data: rowData, isLoading: rowDataLoading } = useGetOrderByIdQuery({
    id: rowId,
  });
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: size,
    searchTerm,
    statusId: 6,
    locationId: locationId,
  });
  const [selectedOrders, setSelectedOrders] = useState<any>([]);
  const [statuschangedModal, setStatusChangeModal] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      dataIndex: "sl",
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
      title: "Order ID",
      key: "orderId",
      render: (text: string, record: any) => (
        <>
          <div>
            <i className="ri-information-2-line text-[18px]  text-primary cursor-pointer"></i>
            <i
              onClick={() => {
                setPrintModal(true);
                setRowId(record?.id);
              }}
              className="ri-printer-line text-[18px]  text-primary ml-[4px] cursor-pointer"
            ></i>
            <i
              onClick={() => copyToClipboard(record?.orderNumber)}
              className="ri-file-copy-line text-primary cursor-pointer ml-[4px] text-[18px] "
            ></i>
          </div>
          <span className="mt-[2px] block">{record?.orderNumber}</span>
        </>
      ),
    },
    {
      title: "Customer Name",
      key: "customerName",
      render: (text: string, record: any) => (
        <>
          <span className=" font-[500] cursor-pointer">
            {record?.customer?.customerName}
          </span>
        </>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      render: (text: string, record: any) => (
        <>
          <span className="color_primary font-[500]">
            {record?.receiverPhoneNumber}
          </span>
          <i
            //  onClick={() => copyToClipboard(record?.customerPhoneNumber)}
            className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px]"
          ></i>
        </>
      ),
    },
    {
      title: "Order Status",
      key: "orderStatus",
      align: "start",
      render: (_: any, record: any) => (
        <>
          <StatusBadge status={record?.status} />
        </>
      ),
    },
    {
      title: "Product Value",
      key: "productValue",
      align: "center",
      render: (_: any, record: any) => (
        <span className=" px-0">{record?.productValue}</span>
      ),
    },
    {
      title: "Shipping Charge",
      key: "shippingCharge",
      align: "center",
      render: (_: any, record: any) => (
        <span className=" capitalize px-0">{record?.shippingCharge}</span>
      ),
    },
    {
      title: "Total",
      key: "totalCharge",
      align: "center",
      render: (_: any, record: any) => (
        <span className=" capitalize px-0">{record?.totalPrice}</span>
      ),
    },
    {
      title: "Order Source",
      key: "orderSource",
      align: "start",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D] font-[500] px-0">
          {record?.orderSource || "N/A"}
        </span>
      ),
    },
    {
      title: "Courier",
      key: "Courier",
      align: "start",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D] font-[500] px-0">
          {record?.currier ? record?.currier : "-"}
        </span>
      ),
    },
    {
      title: "Order date",
      dataIndex: "Order date",
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
      title: "Order Age",
      dataIndex: "orderAge",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {moment(record?.createdAt).fromNow()}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "60px",
      render: (text: string, record: any) => {
        return (
          <>
            {
              <span
                onClick={() => router.push(`/${local}/orders/${record?.id}`)}
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

  // row selection
  const rowSelection: TableProps<any>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedOrders(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  // dropdown options
  const items: MenuProps["items"] = [
    {
      label: (
        <span
          onClick={() => setStatusChangeModal(true)}
          className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center"
        >
          <span>Change Status</span>
        </span>
      ),
      key: "1",
    },
  ];

  const contentRef = useRef<HTMLDivElement | null>(null);

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });
  return (
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
          <Select
            size={"middle"}
            onChange={(e) => setLocationId(e)}
            style={{ width: 200, height: "36px", borderRadius: "0px" }}
            options={warehouseOptions?.data}
          />
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

          <div>
            <GbDropdown items={items}>
              <button
                // onClick={() => router.push(`/${local}/orders/create-order`)}
                className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
              >
                Action
              </button>
            </GbDropdown>
          </div>
        </div>
      </div>
      <div className="max-h-[600px] overflow-scroll">
        <GbTable
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
          rowSelection={rowSelection}
        />
      </div>

      <GbModal
        width="600px"
        clseTab={false}
        isModalOpen={statuschangedModal}
        openModal={() => setStatusChangeModal(true)}
        closeModal={() => setStatusChangeModal(false)}
      >
        <GbForm submitHandler={(data: any) => console.log(data)}>
          <BulkChangeOrders
            status="Packing"
            setModalOpen={setStatusChangeModal}
            selectedOrders={selectedOrders}
          />
        </GbForm>
      </GbModal>
      <GbModal
        width="900px"
        closeModal={() => setPrintModal(false)}
        openModal={() => setPrintModal(true)}
        isModalOpen={printModal}
        // clseTab={false}
      >
       <Invoice rowData={rowData}/>
      </GbModal>
    </div>
  );
};

export default PackingOrders;
