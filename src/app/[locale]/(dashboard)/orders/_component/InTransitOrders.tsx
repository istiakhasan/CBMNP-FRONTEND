"use client";
import GbTable from "@/components/GbTable";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import GbModal from "@/components/ui/GbModal";
import {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} from "@/redux/api/orderApi";
import StatusBadge from "@/util/StatusBadge";

import {
  Checkbox,
  CheckboxOptionType,
  Divider,
  Pagination,
  Popover,
  Select,
  TableProps,
  Tooltip,
} from "antd";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import ShipmentTable from "./ShipmentTable";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetDeliveryPartnerOptionsQuery } from "@/redux/api/partnerApi";
const { RangePicker } = DatePicker;
const InTransitOrders = ({searchTerm,warehosueIds,currierIds,rangeValue,productIds}: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [location, setLocationId] = useState<any>([]);
  const [selecteddeliveryPartner, setSelectedDeliveryPartner] =
    useState<any>([]);
  const { data: warehouseOptions } = useLoadAllWarehouseOptionsQuery(undefined);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [rowId, setRowId] = useState<any>(null);
  const local = useLocale();
  // const [rangeValue, setRangeValue] = useState<any>(null);
  const { data: deliveryPartnerOptions, isLoading: deliveryPartnerLoading } =
    useGetDeliveryPartnerOptionsQuery(undefined);
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: size,
    searchTerm,
    statusId: "7",
    locationId: warehosueIds,
    currier: currierIds,
    ...rangeValue,
    productId:productIds
  });
  const { data: rowData, isLoading: rowDataLoading } = useGetOrderByIdQuery({
    id: rowId,
  });
  const [printModal, setPrintModal] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      key: "sl",
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
      key: "phone_number",
      render: (text: string, record: any) => (
        <>
          <span className="color_primary font-[500]">
            {record?.receiverPhoneNumber}
          </span>
          <i
             onClick={() => copyToClipboard(record?.receiverPhoneNumber)}
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
          {record?.partner?.partnerName ? record?.partner?.partnerName : "-"}
        </span>
      ),
    },
    {
      title: "Order date",
      key: "Order date",
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
      key: "orderAge",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {moment(record?.createdAt).fromNow()}
        </span>
      ),
    },
    {
      title: "In-transit Time",
      key: "In-transit Time",
      render: (text: string, record: any) => (
        <span className="text-[#7D7D7D]  color_primary font-[500]">
          {moment(record?.intransitTime).format("hh:m A DD-MM-YYYY")}
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

  const contentRef = useRef<HTMLDivElement | null>(null);

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
  });
  const [selectedOrders, setSelectedOrders] = useState<any>([]);
  // table row selection
  const rowSelection: TableProps<any>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedOrders(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };
  console.log(selecteddeliveryPartner, "selected delivery partner  ");
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
              ></i>
              Filter Column
            </div>
          </Popover>
          <Tooltip
            styles={{
              body: {
                background: "white",
                width: "500px",
                padding: "20px",
              },
            }}
            trigger={["click"]}
            placement="rightBottom"
            title={
              <div>
                <h1>Filter by warehouse</h1>
                <div className="flex gap-2 flex-wrap">
                  {warehouseOptions?.data?.map((item: any, i: any) => (
                    <span
                      className="text-black flex items-center gap-2"
                      key={i}
                    >
                      <input type="checkbox" value={item?.value} onChange={(e) => {
                          if (e.target.checked) {
                            // Add item
                            setLocationId((prev: any[]) => [
                              ...prev,
                             item.value 
                            ]);
                          } else {
                            // Remove item
                            setLocationId((prev: any[]) =>
                              prev.filter(
                                (entry) => entry !== item?.value
                              )
                            );
                          }
                        }}
                      name={item.label} />
                      {item?.label}
                    </span>
                  ))}
                </div>
                <Divider />
                <h1>Delivery Partner</h1>
                <div className="flex gap-2 flex-wrap">
                  {deliveryPartnerOptions?.data?.map((item: any) => (
                    <span
                      className="text-black flex items-center gap-2"
                      key={item.value} // use a unique value if possible
                    >
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Add item
                            setSelectedDeliveryPartner((prev: any[]) => [
                              ...prev,
                             item.value 
                            ]);
                          } else {
                            // Remove item
                            setSelectedDeliveryPartner((prev: any[]) =>
                              prev.filter(
                                (entry) => entry !== item?.value
                              )
                            );
                          }
                        }}
                        name={item.label}
                        value={item.value}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>
                <Divider />
                <h1>In-transit Date Range</h1>
                <div className="flex gap-2 flex-wrap">
                  <RangePicker
                    style={{
                      width: "100%",
                      height: "36px",
                      borderRadius: "0px",
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    // onChange={(dates) => {
                    //   if (dates) {
                    //     const [start, end] = dates;
                    //     const formattedStart = dayjs(start).format(
                    //       "YYYY-MM-DD HH:mm:ss"
                    //     );
                    //     const formattedEnd = dayjs(end).format(
                    //       "YYYY-MM-DD HH:mm:ss"
                    //     );
                    //     setRangeValue({
                    //       startDate: formattedStart,
                    //       endDate: formattedEnd,
                    //     });
                    //   } else {
                    //     setRangeValue(null);
                    //   }
                    // }}
                  />
                </div>
{/* 
                <div className="flex justify-end">
                  <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] mt-3">
                    Apply
                  </button>
                </div> */}
              </div>
            }
          >
            <div className="border p-2 h-[35px] flex items-center gap-2 cursor-pointer">
              <i
                style={{ fontSize: "24px" }}
                className="ri-equalizer-line text-gray-600"
              ></i>{" "}
              Filter Orders
            </div>
          </Tooltip>
        </div>

        <div className="flex gap-3">
          <div>
            {
              <GbDropdown
                items={[
                  {
                    label: (
                      <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
                        <span
                          onClick={async () => {
                            setOpenModal(true);
                          }}
                        >
                          Payment Report
                        </span>
                      </span>
                    ),
                    key: "0",
                  },
                  {
                    label: (
                      <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
                        <span
                          onClick={async () => {
                            setOpenModal(true);
                          }}
                        >
                          Report
                        </span>
                      </span>
                    ),
                    key: "1",
                  },
                  {
                    label: (
                      <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
                        <span>Change Status</span>
                      </span>
                    ),
                    key: "1",
                  },
                ]}
              >
                <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]">
                  Action
                </button>
              </GbDropdown>
            }
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
        width="900px"
        closeModal={() => setPrintModal(false)}
        openModal={() => setPrintModal(true)}
        isModalOpen={printModal}
        // clseTab={false}
      >
        <div>
          <button onClick={() => reactToPrintFn()}>Print</button>
          <div ref={contentRef}>
            <div>
              <h1 className="text-3xl font-semibold text-[#000] text-center">
                Mishel Info Tech Ltd
              </h1>
              <div className="flex  justify-between">
                <div className="mb-3">
                  <h2 className="text-[#000] font-[600] mb-0 robin robin">
                    Bill To:{" "}
                  </h2>
                  <h2 className="text-[#000] font-[600] mb-0 robin ">
                    {rowData?.customer?.customerName}
                  </h2>
                  <h2 className="text-[#000] font-[600] mb-0 robin">
                    {rowData?.receiverPhoneNumber}
                  </h2>
                  <h2 className="text-[#000] font-[600] mb-0 robin">
                    {rowData?.receiverAddress}
                  </h2>
                </div>
                <div className="mb-3">
                  <h2 className=" mb-0 robin">
                    Invoice No: <strong>{rowData?.invoiceNumber}</strong>{" "}
                  </h2>
                  <h2 className=" mb-0 robin">
                    Date:{" "}
                    <strong>
                      {moment(rowData?.deliveryDate).format("DD MMMM YYYY")}
                    </strong>{" "}
                  </h2>
                </div>
              </div>
              <table className="warehouse-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product Name</th>
                    <th>Unit Price(Tk)</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.products?.map((item: any, index: any) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item?.product?.name} {item?.product?.weight}{" "}
                        {item?.product?.unit}
                      </td>
                      <td>{item?.productPrice}</td>
                      <td>{item?.productQuantity}</td>
                      <td>{item?.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td rowSpan={3} style={{ padding: 0 }} colSpan={2}>
                      <div className="mt-3">
                        <h1 className="mb-0 text-[#000] flex items-center gap-3">
                          <i className="ri-discuss-line"></i>{" "}
                          info.mishelinfo@gmail.com
                        </h1>
                        <h1 className="mb-0 text-[#000] flex items-center gap-3">
                          <i className="ri-global-line"></i> infomishelinfo.com
                        </h1>
                        <h1 className="mb-0 text-[#000] flex items-center gap-3">
                          <i className="ri-phone-fill"></i> +001835437676
                        </h1>
                        <h1 className="mb-0 text-[#000] flex items-center gap-3">
                          <i className="ri-map-pin-line"></i>
                          House-2,Road-16,Block-B,Nikunjo Dhaka-1230
                        </h1>
                      </div>
                    </td>
                    <td colSpan={2} style={{ background: "#F7F7F7" }}>
                      Sub Total
                    </td>
                    <td style={{ background: "#F7F7F7" }}>
                      {Number(rowData?.productValue)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ background: "#EBEBEB" }}>
                      Grand Total
                    </td>
                    <td style={{ background: "#EBEBEB" }}>
                      {rowData?.totalPrice}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>Due Total</td>
                    <td>{rowData?.totalReceiveAbleAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </GbModal>
      <GbModal
        width="900px"
        closeModal={() => setOpenModal(false)}
        openModal={() => setOpenModal(true)}
        isModalOpen={openModal}
        cls="custom_ant_modal"
      >
        <ShipmentTable selectedOrders={selectedOrders} location={location} />
      </GbModal>
    </div>
  );
};

export default InTransitOrders;
