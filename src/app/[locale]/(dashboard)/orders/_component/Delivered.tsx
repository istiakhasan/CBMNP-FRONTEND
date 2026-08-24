"use client";
import GbTable from "@/components/GbTable";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import StatusBadge from "@/util/StatusBadge";
import dayjs from "dayjs";
import {
  Checkbox,
  CheckboxOptionType,
  ConfigProvider,
  Divider,
  Pagination,
  Popover,
  Segmented,
  Tooltip
} from "antd";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, {  useState } from "react";

const Delivered = ({warehosueIds,productIds,searchTerm,currierIds,rangeValue,orderStatus,countData,creationRangeValue}: any) => {
  // all states
  const [paymentStatus, setPaymentStatus] = useState<any>('Pending');
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { data, isLoading } = useGetAllOrdersQuery({
     page:searchTerm?1:page,
    limit: size,
    searchTerm,
    statusId:orderStatus?.length>0  ?( orderStatus?.includes(8) ? 8 : "112") : '8',
    locationId:warehosueIds,
    productId:productIds,
    currier:currierIds,
    paymentStatus:paymentStatus,
    ...rangeValue,
    ...creationRangeValue,
  });
  const local=useLocale()
  const router = useRouter();
  const [open, setOpen] = useState(false);
    const tableColumn = [
    {
      title: "SL",
      key: "sl",
      width: 60,
      render: (text: string, record: any, i: any) => {
        const slNumber = page * size + (i + 1) - size;
        return (
          <span className="font-[500]">
            {String(slNumber).padStart(2, "0")}
          </span>
        );
      },
    },
    {
      title: "Order ID(INV-N0)",
      key: "orderId",
      width: 130,
      render: (text: string, record: any) => (
        <span className="mt-[2px] block ">{record?.invoiceNumber}</span>
      ),
    },
    {
      title: "Customer",
      key: "customerName",
      width: 150,
      render: (text: string, record: any) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-[500]  cursor-pointer truncate max-w-[140px]">
            {record?.customer?.customerName}
          </span>
          <span className="flex items-center gap-1  color_primary font-[500]">
            {record?.receiverPhoneNumber}
            <i
              onClick={() => copyToClipboard(record?.receiverPhoneNumber)}
              className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[2px]"
            ></i>
          </span>
        </div>
      ),
    },
    {
      title: "Order Status",
      key: "orderStatus",
      align: "start",
      width: 110,
      render: (_: any, record: any) => <StatusBadge status={record?.status} />,
    },
    {
      title: "Amount",
      key: "amount",
      align: "center",
      width: 110,
      render: (_: any, record: any) => (
        <Popover
          content={
            <div className=" flex flex-col gap-1 min-w-[160px]">
              <div className="flex justify-between gap-4">
                <span className="text-[#7D7D7D]">Product Value</span>
                <span className="font-medium">৳{record?.productValue}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#7D7D7D]">Shipping</span>
                <span className="font-medium">৳{record?.shippingCharge}</span>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between gap-4">
                <span className="text-[#7D7D7D]">Total</span>
                <span className="font-semibold">৳{record?.totalPrice}</span>
              </div>
            </div>
          }
          trigger="hover"
        >
          <span className="font-semibold cursor-pointer border-b border-dashed border-gray-400">
            ৳{record?.totalPrice}
          </span>
        </Popover>
      ),
    },
    {
      title: "Order Source",
      key: "orderSource",
      align: "start",
      width: 100,
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D] font-[500] ">
          {record?.orderSource || "N/A"}
        </span>
      ),
    },
    {
      title: "Courier",
      key: "Courier",
      align: "start",
      width: 200,
      render: (_text: string, record: any) => {
        const courierName = record?.partner?.partnerName || "-";
        const courierStatus = record?.courierStatus || "-";
        const trackingCode = record?.trackingCode || "-";
        const consignmentId = record?.consignmentId || "-";
        const deliveryCharge = record?.deliveryCharge ?? "-";
        const codAmount = record?.codAmount ?? "-";
        const trackingMessage = record?.trackingMessage || "-";
        const courierUpdatedAt = record?.courierUpdatedAt
          ? dayjs(record.courierUpdatedAt).format("DD MMM YYYY, hh:mm A")
          : "-";

        return (
          <Popover
            trigger="click"
            placement="left"
            content={
              <div className=" flex flex-col gap-1.5 min-w-[220px]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#7D7D7D]">Consignment</span>
                  <span className="font-medium">{consignmentId}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#7D7D7D]">COD</span>
                  <span className="font-semibold">৳{codAmount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#7D7D7D]">Delivery Charge</span>
                  <span className="font-medium">৳{deliveryCharge}</span>
                </div>
                <Divider className="my-1" />
                <div>
                  <span className="text-[#7D7D7D]">Message: </span>
                  <span>{trackingMessage}</span>
                </div>
                <div>
                  <span className="text-[#7D7D7D]">Updated: </span>
                  <span>{courierUpdatedAt}</span>
                </div>
              </div>
            }
          >
            <div className="flex flex-col gap-0.5  cursor-pointer">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#333]">{courierName}</span>
                {courierStatus !== "-" && (
                  <StatusBadge status={{ label: courierStatus }} />
                )}
              </div>
              <span
                className="text-[#7D7D7D] truncate max-w-[180px]"
                title={trackingCode}
              >
                {trackingCode}
              </span>
            </div>
          </Popover>
        );
      },
    },
    {
      title: "Order Info",
      key: "orderInfo",
      align: "start",
      width: 150,
      render: (text: string, record: any) => (
        <Tooltip
          title={
            <div className=" flex flex-col gap-1">
              <span>
                Created: {moment(record?.createdAt).format("DD MMM YY, h:mma")}
              </span>
              <span>
                In-transit:{" "}
                {record?.intransitTime
                  ? moment(record?.intransitTime).format("hh:mm A DD-MM-YYYY")
                  : "-"}
              </span>
            </div>
          }
        >
          <span className="text-[#7D7D7D] font-[500]  cursor-pointer border-b border-dashed border-gray-400">
            {moment(record?.createdAt).fromNow()}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <i
            onClick={() => router.push(`/${local}/orders/${record?.id}`)}
            style={{ fontSize: "16px" }}
            className="ri-eye-fill color_primary cursor-pointer"
          ></i>
        </div>
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
    <>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              itemSelectedBg: "#4F8A6D",   
              itemSelectedColor: "#fff", 
              fontSize:10
            },
          },
        }}
      >
        <Segmented 
          options={[
            { label: `Pay Due`, value: 'Pending' },
            { label: `Partial Delivered `, value: 'Partial' },
            { label: `Pay Collected `, value: 'Paid' },
            { label: `All`, value: '' },
            // { label: `Pay Due (${countData?.data?.find((ab:any)=>ab?.id===11)?.count || 0})`, value: 'Pending' },
            // { label: `Partial Delivered  (${countData?.data?.find((ab:any)=>ab?.id===12)?.count || 0})`, value: 'Partial' },
            // { label: `Pay Collected  (${countData?.data?.find((ab:any)=>ab?.id===10)?.count || 0})`, value: 'Paid' },
            // { label: `All  (${countData?.data?.find((ab:any)=>ab?.id===10)?.count || 0})`, value: '' },
          ]}
          onChange={(val) => {
            setPaymentStatus(val)
          }}
        />
      </ConfigProvider>
    <div className="gb_border mt-1">
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
      <div className="custom_scroll overflow-scroll">
        <GbTable
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
        />
      </div>
    </div>
    </>
  );
};

export default Delivered;
