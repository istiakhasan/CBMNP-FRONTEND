"use client";
import GbForm from "@/components/forms/GbForm";
import GbTable from "@/components/GbTable";
import GbModal from "@/components/ui/GbModal";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import StatusBadge from "@/util/StatusBadge";

import {
  Checkbox,
  CheckboxOptionType,
  MenuProps,
  Pagination,
  Popover,
  TableProps,
} from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BulkChangeOrders from "./BulkChangeOrders";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import { useLocale } from "next-intl";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";

const HoldOrders = ({
  warehosueIds,
  currierIds,
  productIds,
  searchTerm,
  rangeValue,
  orderStatus,
  creationRangeValue,
}: any) => {
  // all states
  const [statuschangedModal, setStatusChangeModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [selectedOrders, setSelectedOrders] = useState<any>([]);
  const { data, isLoading } = useGetAllOrdersQuery({
    page: searchTerm ? 1 : page,
    limit: size,
    searchTerm,
    locationId: warehosueIds,
    productId: productIds,
    currier: currierIds,
    ...rangeValue,
    ...creationRangeValue,
    statusId:
      orderStatus?.length > 0 ? (orderStatus?.includes(3) ? 3 : "112") : "3",
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

    {
      title: "Order",
      key: "orderId",
      width: 115,
      render: (_text: string, record: any) => (
        <div className="leading-[16px]">
          <div
            className="font-[500] truncate max-w-[105px]"
            title={record?.invoiceNumber}
          >
            {record?.invoiceNumber || "-"}
          </div>

          <div
            className="text-[11px] text-[#999] truncate max-w-[105px]"
            title={record?.customer?.customerName}
          >
            {record?.customer?.customerName || "-"}
          </div>
        </div>
      ),
    },

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

    {
      title: "Status",
      key: "orderStatus",
      width: 95,
      align: "start",
      render: (_: any, record: any) => <StatusBadge status={record?.status} />,
    },

    // Product + Shipping + Total একসাথে
    {
      title: "Amount",
      key: "amount",
      width: 115,
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

    // Source + Courier + Hold Reason
    {
      title: "Info",
      key: "info",
      width: 135,
      align: "left",
      render: (_: any, record: any) => (
        <div className="text-[11px] leading-[15px] max-w-[125px]">
          {/* Source */}
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

          {/* Hold Reason */}
          {record?.onHoldReason && (
            <div className="flex gap-[4px]">
              <span className="text-orange-500 shrink-0">Hold:</span>
              <span
                className="text-orange-500 truncate cursor-pointer"
                title={record?.onHoldReason}
              >
                {record?.onHoldReason}
              </span>
            </div>
          )}
        </div>
      ),
    },

    {
      title: "Date",
      key: "orderDate",
      width: 110,
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
        </div>
      ),
    },

    {
      title: "Age",
      key: "orderAge",
      width: 70,
      render: (_text: string, record: any) => (
        <span className="text-[#7D7D7D] color_primary font-[500] text-[11px] whitespace-nowrap">
          {record?.createdAt ? moment(record.createdAt).fromNow() : "-"}
        </span>
      ),
    },

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
  return (
    <div className="gb_border">
      <div className="flex justify-end gap-2 flex-wrap mt-2 p-3">
        <div className="flex gap-3">
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
      <div className="custom_scroll overflow-scroll h-[400px]">
        <GbTable
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
          rowSelection={rowSelection}
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
      <GbModal
        width="600px"
        clseTab={false}
        isModalOpen={statuschangedModal}
        openModal={() => setStatusChangeModal(true)}
        closeModal={() => setStatusChangeModal(false)}
      >
        <GbForm submitHandler={(data: any) => console.log(data)}>
          <BulkChangeOrders
            status="Hold"
            setModalOpen={setStatusChangeModal}
            selectedOrders={selectedOrders}
          />
        </GbForm>
      </GbModal>
    </div>
  );
};

export default HoldOrders;
