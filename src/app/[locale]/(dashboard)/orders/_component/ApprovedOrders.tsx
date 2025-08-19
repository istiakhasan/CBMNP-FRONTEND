"use client";
import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbTable from "@/components/GbTable";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import GbModal from "@/components/ui/GbModal";
import { useLazyLoadStockByProductIdAndLocationIdQuery } from "@/redux/api/inventoryApi";
import {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
} from "@/redux/api/orderApi";
import { useCreateRequisitionMutation } from "@/redux/api/requisitionApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { getUserInfo } from "@/service/authService";
import StatusBadge from "@/util/StatusBadge";

import {
  Checkbox,
  CheckboxOptionType,
  MenuProps,
  message,
  Pagination,
  Popover,
  Select,
  TableProps,
} from "antd";
import moment from "moment";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";
import GeneratePreviewButton from "./GeneratePreviewButton";
import BulkChangeOrders from "./BulkChangeOrders";

const ApprovedOrders = ({
  refetch: countRefetch,
  searchTerm,
  warehosueIds,
  currierIds,
  rangeValue,
  orderStatus
}: any) => {
  // all states
  const [statuschangedModal, setStatusChangeModal] = useState(false);
  const [loadOrdersById] = useLazyGetOrderByIdQuery();
  const [loadStockByWarehouseProduct] =
    useLazyLoadStockByProductIdAndLocationIdQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [printModal, setPrintModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<any>([]);
  const [rowId, setRowId] = useState<any>(null);
  const { data: rowData, isLoading: rowDataLoading } = useGetOrderByIdQuery({
    id: rowId,
  });
  const local = useLocale();
  const { data: warehouseOptions } = useLoadAllWarehouseOptionsQuery(undefined);
  const [locationId, setLocationId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page:searchTerm?1:page,
    limit: size,
    searchTerm,
    locationId:locationId || warehosueIds,
    currier: currierIds,
    ...rangeValue,
    statusId:orderStatus?.length>0  ?( orderStatus?.includes(2) ? 2 : "112") : '2',
  });

  const [handleCreateRequisition] = useCreateRequisitionMutation();
  const [reqPreviewData, setReqPreviewData] = useState<any>([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tableColumn = [
    {
      title: "SL",
      key: "SL",
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
  const userInfo: any = getUserInfo();
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

  const items: MenuProps["items"] = [
    {
      label: (
        <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
          <span
            onClick={async () => {
              setOpenModal(true);
            }}
          >
            Make Requisition
          </span>
        </span>
      ),
      key: "0",
    },
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
            placeholder='Select Warehouse'
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
            {
              <GbDropdown state={locationId} items={items}>
                <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]">
                  Action
                </button>
              </GbDropdown>
            }
          </div>
        </div>
      </div>
      <div className=" overflow-scroll custom_scroll">
        <GbTable
          rowSelection={rowSelection}
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
        />
      </div>

      <GbModal
        width="1000px"
        closeModal={() => setOpenModal(false)}
        openModal={() => setOpenModal(true)}
        isModalOpen={openModal}
      >
        <GeneratePreviewButton
          selectedOrders={selectedOrders}
          loadOrdersById={loadOrdersById}
          loadStockByWarehouseProduct={loadStockByWarehouseProduct}
          locationId={locationId}
          setReqPreviewData={setReqPreviewData}
        />

        <div className="responsive_order_details_view_table mt-[10px]">
          <table>
            <thead>
              <tr>
                {/* <th>
                       Product Id
                      </th> */}
                <th style={{ width: "230px" }} className="">
                  Product Name
                </th>
                <th className="text-start">Pack Size</th>
                <th className="text-center">Qty</th>
                <th className="text-start">Order Number</th>
                <th className="text-center">Total Qty</th>
                <th className="text-center">Available Qty</th>
              </tr>
            </thead>
            <tbody>
              {reqPreviewData?.map((product: any) => {
                const totalQuantity = product.orders.reduce(
                  (sum: any, order: any) => sum + order.orderQuantity,
                  0
                );
                return (
                  <React.Fragment key={product.productId}>
                    {product.orders.map((order: any, index: any) => (
                      <tr
                        style={
                          totalQuantity > product?.stock
                            ? { background: "#F7BB81" }
                            : {}
                        }
                        key={order.orderId}
                      >
                        {index === 0 && (
                          <>
                            {/* <td rowSpan={product.orders.length}>{product.productId}</td> */}
                            <td rowSpan={product.orders.length}>
                              {product.name}
                            </td>
                            <td rowSpan={product.orders.length}>
                              {product.packSize}
                            </td>
                          </>
                        )}
                        <td align="center">{order.orderQuantity}</td>
                        <td>{order.orderId}</td>
                        {index === 0 && (
                          <td
                            className="text-center"
                            rowSpan={product.orders.length}
                          >
                            {totalQuantity}
                          </td>
                        )}
                        {index === 0 && (
                          <td
                            className="text-center"
                            rowSpan={product.orders.length}
                          >
                            {product?.stock}
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end  mt-3">
            <button
              className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]"
              onClick={async () => {
                try {
                  const payload = selectedOrders.map((item: any) => item?.id);

                  const res = await handleCreateRequisition({
                    orderIds: payload,
                    userId: userInfo?.userId,
                  }).unwrap();
                  refetch();
                  countRefetch();
                  message.success("Requisition create successfully..");
                  setOpenModal(false);
                } catch (error) {
                  console.log(error, "selected orders");
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      </GbModal>

      <GbModal
        width="900px"
        closeModal={() => setPrintModal(false)}
        openModal={() => setPrintModal(true)}
        isModalOpen={printModal}
        // clseTab={false}
      >
        <Invoice rowData={rowData} />
      </GbModal>

      <GbModal
        width="600px"
        clseTab={false}
        isModalOpen={statuschangedModal}
        openModal={() => setStatusChangeModal(true)}
        closeModal={() => setStatusChangeModal(false)}
      >
        <GbForm submitHandler={(data: any) => console.log(data)}>
          <BulkChangeOrders
            status="Approved"
            setModalOpen={setStatusChangeModal}
            selectedOrders={selectedOrders}
          />
        </GbForm>
      </GbModal>
    </div>
  );
};

export default ApprovedOrders;
