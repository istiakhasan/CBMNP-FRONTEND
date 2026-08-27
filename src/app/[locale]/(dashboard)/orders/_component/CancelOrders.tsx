"use client";
import GbTable from "@/components/GbTable";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import StatusBadge from "@/util/StatusBadge";
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Image,
  Pagination,
  Popover,
  Spin,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CancelOrders = ({
  searchTerm,
  productIds,
  warehosueIds,
  currierIds,
  rangeValue,
  orderStatus,
  creationRangeValue,
}: any) => {
  // all states
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { data, isLoading } = useGetAllOrdersQuery({
    page: searchTerm ? 1 : page,
    limit: size,
    searchTerm,
    statusId:
      orderStatus?.length > 0 ? (orderStatus?.includes(4) ? 4 : "112") : "4",
    locationId: warehosueIds,
    productId: productIds,
    currier: currierIds,
    ...rangeValue,
    ...creationRangeValue,
  });
  const local = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      key: "sl",
      width: 45,
      render: (_text: string, _record: any, i: number) => {
        const slNumber = page * size + (i + 1) - size;

        return (
          <span className="font-[500] text-[12px]">
            {String(slNumber).padStart(2, "0")}
          </span>
        );
      },
    },

    // Order ID + Customer Name
    {
      title: "Order",
      key: "order",
      width: 125,
      render: (_text: string, record: any) => (
        <div className="leading-[16px]">
          <div
            className="font-[500] text-[12px] truncate max-w-[115px]"
            title={record?.invoiceNumber}
          >
            {record?.invoiceNumber || "-"}
          </div>

          <div
            className="text-[11px] text-[#999] truncate max-w-[115px]"
            title={record?.customer?.customerName}
          >
            {record?.customer?.customerName || "-"}
          </div>
        </div>
      ),
    },

    // Phone
    {
      title: "Phone",
      key: "phone_number",
      width: 125,
      render: (_text: string, record: any) => (
        <div className="flex items-center whitespace-nowrap">
          <span className="color_primary font-[500] text-[12px]">
            {record?.receiverPhoneNumber || "-"}
          </span>

          {record?.receiverPhoneNumber && (
            <i
              onClick={() => copyToClipboard(record?.receiverPhoneNumber)}
              className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[3px] text-[13px]"
            />
          )}
        </div>
      ),
    },

    // Status
    {
      title: "Status",
      key: "orderStatus",
      width: 100,
      align: "start",
      render: (_: any, record: any) => <StatusBadge status={record?.status} />,
    },

    // Product + Shipping + Total
    {
      title: "Amount",
      key: "amount",
      width: 120,
      align: "left",
      render: (_: any, record: any) => (
        <div className="text-[11px] leading-[15px]">
          <div className="flex justify-between gap-[8px]">
            <span className="text-[#999]">Product</span>
            <span className="font-[500]">{record?.productValue ?? "-"}</span>
          </div>

          <div className="flex justify-between gap-[8px]">
            <span className="text-[#999]">Shipping</span>
            <span className="font-[500]">{record?.shippingCharge ?? "-"}</span>
          </div>

          <div className="flex justify-between gap-[8px] border-t border-[#eee] mt-[2px] pt-[2px]">
            <span className="font-[600]">Total</span>
            <span className="font-[600] color_primary">
              {record?.totalPrice ?? "-"}
            </span>
          </div>
        </div>
      ),
    },

    // Source + Courier + Cancel Reason
    {
      title: "Info",
      key: "info",
      width: 145,
      align: "left",
      render: (_: any, record: any) => (
        <div className="text-[11px] leading-[15px] max-w-[135px]">
          {/* Order Source */}
          <div className="flex gap-[4px]">
            <span className="text-[#999] shrink-0">Src:</span>

            <span
              className="font-[500] truncate"
              title={record?.orderSource || "N/A"}
            >
              {record?.orderSource || "N/A"}
            </span>
          </div>

          {/* Courier */}
          <div className="flex gap-[4px]">
            <span className="text-[#999] shrink-0">Courier:</span>

            <span
              className="font-[500] text-[#666] truncate"
              title={record?.partner?.partnerName || "-"}
            >
              {record?.partner?.partnerName || "-"}
            </span>
          </div>

          {/* Cancel Reason */}
          {record?.onCancelReason && (
            <div className="flex gap-[4px]">
              <span className="text-red-500 shrink-0">Cancel:</span>

              <span
                className="text-red-500 truncate cursor-pointer"
                title={record?.onCancelReason}
              >
                {record?.onCancelReason}
              </span>
            </div>
          )}
        </div>
      ),
    },

    // Date + Time + Age
    {
      title: "Date",
      key: "orderDate",
      width: 115,
      align: "start",
      render: (_text: string, record: any) => (
        <div className="leading-[15px]">
          <div className="font-[500] text-[11px] whitespace-nowrap">
            {record?.createdAt
              ? moment(record.createdAt).format("DD MMM YY")
              : "-"}
          </div>

          <div className="text-[10px] text-[#999] whitespace-nowrap">
            {record?.createdAt ? moment(record.createdAt).format("h:mma") : "-"}
          </div>

          <div className="text-[10px] color_primary whitespace-nowrap">
            {record?.createdAt ? moment(record.createdAt).fromNow() : "-"}
          </div>
        </div>
      ),
    },

    // Action
    {
      title: "",
      key: "action",
      width: 45,
      fixed: "right",
      align: "center",
      render: (_text: string, record: any) => (
        <span
          onClick={() => router.push(`/${local}/orders/${record?.id}`)}
          className="cursor-pointer"
        >
          <i
            style={{ fontSize: "17px" }}
            className="ri-eye-fill color_primary"
          />
        </span>
      ),
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
      </div>
      <div className="custom_scroll overflow-scroll h-[400px]">
        <GbTable
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
        />
      </div>
      <div className="my-4 flex justify-end">
        <Pagination
          pageSize={size}
          total={data?.meta?.total}
          onChange={(v, d) => {
            setPage(v);
            setSize(d);
          }}
          pageSizeOptions={[10, 20, 50, 100, 500]}
          showSizeChanger={true}
        />
      </div>
    </div>
  );
};

export default CancelOrders;
