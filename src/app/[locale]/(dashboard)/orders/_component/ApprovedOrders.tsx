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
import BulkInvoice from "@/components/BulkInvoice";

const ApprovedOrders = ({
  refetch: countRefetch,
  searchTerm,
  warehosueIds,
  currierIds,
  rangeValue,
  orderStatus,
  productIds,
  locationId,
  creationRangeValue,
}: any) => {
  const [bulkPrintData, setBulkPrintData] = useState<any[]>([]);
  const [bulkPrintLoading, setBulkPrintLoading] = useState(false);
  // all states
  const [statuschangedModal, setStatusChangeModal] = useState(false);
  const [loadOrdersById] = useLazyGetOrderByIdQuery();
  const [loadStockByWarehouseProduct] =
    useLazyLoadStockByProductIdAndLocationIdQuery();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [printModal, setPrintModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<any>([]);
  // rowSelection-কে controlled রাখার জন্য — preview থেকে remove করলে এখান
  // থেকেও key বাদ দিলে তবেই main table-এর checkbox visually uncheck হবে
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rowId, setRowId] = useState<any>(null);
  const { data: rowData, isLoading: rowDataLoading } = useGetOrderByIdQuery({
    id: rowId,
  });
  const local = useLocale();
  const { data: warehouseOptions } = useLoadAllWarehouseOptionsQuery(undefined);
  // const [locationId, setLocationId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page: searchTerm ? 1 : page,
    limit: size,
    searchTerm,
    locationId: warehosueIds,
    currier: currierIds,
    productId: productIds,
    ...rangeValue,
    ...creationRangeValue,
    statusId:
      orderStatus?.length > 0 ? (orderStatus?.includes(2) ? 2 : "112") : "2",
  });

  const [handleCreateRequisition, { isLoading: creatingRequisition }] =
    useCreateRequisitionMutation();
  const [reqPreviewData, setReqPreviewData] = useState<any>([]);
  // preview generate হয়েছে কিনা — না হলে Create button block থাকবে
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // ---------------------------------------------------------------------
  // Preview data-র field name backend যাই পাঠাক (qty / orderQuantity,
  // id / orderId / orderNumber) সেটা consistently handle করার জন্য
  // helper গুলো এক জায়গায় রাখা — table display আর calculation দুটোই
  // এখান থেকেই value নেবে, যাতে mismatch (Qty column blank হওয়ার মতো
  // bug) আর না হয়।
  // ---------------------------------------------------------------------
  const getOrderQty = (order: any) =>
    order?.qty ?? order?.orderQuantity ?? 0;

  const getOrderIdentifier = (order: any) =>
    order?.id ?? order?.orderId ?? order?.orderNumber;

  // preview API-এর order.orderId আসলে real DB `id` নাও হতে পারে — অনেক সময়
  // এটা display-এর জন্য orderNumber/invoiceNumber পাঠানো হয়। কিন্তু main
  // table-এর checkbox key (selectedRowKeys) সবসময় real record.id ব্যবহার
  // করে। তাই remove করার সময় শুধু preview-এর identifier দিয়ে
  // selectedRowKeys/selectedOrders filter করলে match নাও হতে পারে —
  // checkbox uncheck হয় না।
  //
  // এই helper preview-এর identifier (id বা orderNumber বা invoiceNumber,
  // যেটাই হোক) কে selectedOrders (যেখানে real id + orderNumber +
  // invoiceNumber তিনটাই আছে) এর সাথে মিলিয়ে real record.id বের করে।
  // কোনোভাবেই না মিললে fallback হিসেবে identifier-টাই ফেরত দেয়।
  const resolveRealOrderId = (identifier: any) => {
    const match = (selectedOrders ?? []).find(
      (o: any) =>
        o.id === identifier ||
        o.orderNumber === identifier ||
        o.invoiceNumber === identifier ||
        String(o.id) === String(identifier) ||
        String(o.orderNumber) === String(identifier) ||
        String(o.invoiceNumber) === String(identifier),
    );
    return match?.id ?? identifier;
  };

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
      title: "Order ID(INV-N0)",
      key: "orderId",
      render: (text: string, record: any) => (
        <>
          <span className="mt-[2px] block">{record?.invoiceNumber}</span>
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
      // width: "60px",
      render: (text: string, record: any) => {
        return (
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
              <span
                onClick={() => router.push(`/${local}/orders/${record?.id}`)}
                className=" text-white text-[10px] py-[2px] px-[10px] cursor-pointer"
              >
                <i
                  style={{ fontSize: "18px" }}
                  className="ri-eye-fill color_primary"
                ></i>
              </span>
            </div>
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
    // ✅ controlled — এখন checkbox state সবসময় selectedRowKeys অনুসরণ করবে,
    // তাই preview থেকে remove করার পর key সরিয়ে দিলে main table-এও
    // checkbox আনচেক হয়ে যাবে
    selectedRowKeys,
    onChange: (keys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(keys);
      setSelectedOrders(selectedRows);
      // selection পাল্টালে আগের preview আর valid থাকে না, তাই reset
      setPreviewGenerated(false);
      setReqPreviewData([]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };
  const bulkPrintRef = useRef(null);
  const handlePrintAll = useReactToPrint({
    content: () => bulkPrintRef.current,
  });
  const handleBulkPrintClick = async () => {
    if (!selectedOrders?.length) {
      message.warning("Please select at least one order to print");
      return;
    }
    try {
      setBulkPrintLoading(true);
      const fullOrdersData = await Promise.all(
        selectedOrders.map((order: any) =>
          loadOrdersById({ id: order?.id }).unwrap(),
        ),
      );
      setBulkPrintData(fullOrdersData);
      // state update হয়ে render complete হওয়া পর্যন্ত অপেক্ষা করা,
      // নাহলে পুরনো/ফাঁকা bulkPrintRef content নিয়ে print dialog খুলে যাবে
      setTimeout(() => {
        handlePrintAll();
        setBulkPrintLoading(false);
      }, 300);
    } catch (error) {
      console.log(error, "bulk print fetch error");
      message.error("Failed to load order details for printing");
      setBulkPrintLoading(false);
    }
  };

  // কোনো product-এর requested total quantity, তার available stock-এর
  // চেয়ে বেশি কিনা — থাকলে Create block করতে হবে
  const hasStockShortage = reqPreviewData?.some((product: any) => {
    const totalQuantity = product.orders.reduce(
      (sum: any, order: any) => sum + getOrderQty(order),
      0,
    );
    return totalQuantity > (product?.stock ?? 0);
  });

  // preview generate করা হয়েছে + data আছে + কোনো shortage নেই — তবেই
  // Create করা যাবে
  const canCreateRequisition =
    previewGenerated && reqPreviewData?.length > 0 && !hasStockShortage;

  // preview-এ এখনো টিকে থাকা (remove না-করা) সব order-এর real DB id list —
  // Create-এর সময় এটাই পাঠানো হবে, selectedOrders (আগের পুরো selection)
  // নয়। ফলে কোনো order remove করা হলে সেটা payload থেকেও বাদ পড়বে।
  // resolveRealOrderId দিয়ে নিশ্চিত করা হচ্ছে যে preview-এর identifier যাই
  // হোক (orderNumber/invoiceNumber/id), backend-কে সবসময় real id-ই যাবে।
  const remainingOrderIds: any[] = Array.from(
    new Set(
      (reqPreviewData ?? []).flatMap((product: any) =>
        product.orders.map((o: any) =>
          resolveRealOrderId(getOrderIdentifier(o)),
        ),
      ),
    ),
  );

  // একটা order সম্পূর্ণভাবে preview থেকে বাদ দেওয়া — তার আওতায় থাকা
  // প্রতিটা product entry থেকেই এই orderId বাদ যাবে (order-এর under-এ
  // যত product ছিল, সব বাদ যাবে), এবং কোনো product-এর আর কোনো order না
  // থাকলে সেই product row-ও preview থেকে সরে যাবে।
  const handleRemoveOrderFromPreview = (orderIdentifier: any) => {
    setReqPreviewData((prev: any) =>
      (prev ?? [])
        .map((product: any) => ({
          ...product,
          orders: product.orders.filter(
            (o: any) => getOrderIdentifier(o) !== orderIdentifier,
          ),
        }))
        .filter((product: any) => product.orders.length > 0),
    );

    // preview-এর identifier আর table-এর real id আলাদা হতে পারে — তাই
    // আগে real id বের করে নিয়ে সেটা দিয়েই selectedOrders/selectedRowKeys
    // থেকে বাদ দেওয়া হচ্ছে
    const realId = resolveRealOrderId(orderIdentifier);

    setSelectedOrders((prev: any) =>
      (prev ?? []).filter((o: any) => o.id !== realId),
    );
    // ✅ main table-এর checkbox (rowSelection) থেকেও এই order-এর real key
    // বাদ দেওয়া — নাহলে state থেকে বাদ গেলেও checkbox visually টিক থেকে
    // যাবে, যেহেতু GbTable এখন controlled selectedRowKeys ব্যবহার করছে
    setSelectedRowKeys((prev) =>
      prev.filter((key) => String(key) !== String(realId)),
    );
    message.info("Order টি preview থেকে বাদ দেওয়া হয়েছে");
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <span className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center">
          <span
            onClick={async () => {
              // modal নতুন করে খোলার সময় আগের preview state clear করা,
              // যাতে পুরনো preview দেখিয়ে ভুলবশত Create না হয়ে যায়
              setPreviewGenerated(false);
              setReqPreviewData([]);
              setOpenModal(true);
            }}
          >
            Make Requisition
          </span>
        </span>
      ),
      key: "0",
    },
    // {
    //   label: (
    //     <span
    //       onClick={() => setStatusChangeModal(true)}
    //       className="flex gap-2 text-[14px] text-[#144753] pr-[15px] font-[500] items-center"
    //     >
    //       <span>Change Status</span>
    //     </span>
    //   ),
    //   key: "1",
    // },
    {
      label: (
        <span onClick={handleBulkPrintClick}>
          🖨 {bulkPrintLoading ? "Preparing..." : "Print Selected Orders"}
        </span>
      ),
      key: "2",
    },
  ];

  return (
    <div className="gb_border">
      <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
        <div className="flex gap-2">
          {/* <div className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center">
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
          </Popover> */}
          {/* <Select
            size={"middle"}
            placeholder='Select Warehouse'
            onChange={(e) => setLocationId(e)}
            style={{ width: 200, height: "36px", borderRadius: "0px" }}
            options={warehouseOptions?.data}
          /> */}
        </div>
        <div className="flex gap-3">
          <div>
            {
              <GbDropdown items={items}>
                <button className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px]">
                  Action
                </button>
              </GbDropdown>
            }
          </div>
        </div>
      </div>
      <div className=" overflow-scroll custom_scroll h-[400px]">
        <GbTable
          rowSelection={rowSelection}
          loading={isLoading}
          columns={newColumns}
          dataSource={data?.data}
          showSizeChanger={true}
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
          setPreviewGenerated={setPreviewGenerated}
        />

        <div className="responsive_order_details_view_table mt-[10px]">
          {previewGenerated && reqPreviewData?.length === 0 && (
            <div className="text-gray-500 text-sm font-[500] mb-2">
              কোনো product অবশিষ্ট নেই — সব order remove করা হয়েছে অথবা
              কোনো valid product পাওয়া যায়নি।
            </div>
          )}
          {previewGenerated && hasStockShortage && (
            <div className="text-red-500 text-sm font-[500] mb-2">
              কিছু প্রোডাক্টের stock পর্যাপ্ত নেই (নিচে হাইলাইট করা রো)।
              Requisition create করার আগে ওই order গুলো 🗑 দিয়ে remove করুন
              অথবা stock ঠিক করুন।
            </div>
          )}
          <table>
            <thead>
              <tr>
                {/* <th>
                       Product Id
                      </th> */}
                <th style={{ width: "230px" }} className="">
                  Product Name
                </th>
                <th className="text-center">Qty</th>
                <th className="text-start">Order Number</th>
                <th className="text-center">Total Qty</th>
                <th className="text-center">Available Qty</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reqPreviewData?.map((product: any) => {
                const totalQuantity = product.orders.reduce(
                  (sum: any, order: any) => sum + getOrderQty(order),
                  0,
                );
                const isShortage = totalQuantity > product?.stock;
                return (
                  <React.Fragment key={product.productId}>
                    {product.orders.map((order: any, index: any) => {
                      const orderIdentifier = getOrderIdentifier(order);
                      return (
                        <tr
                          style={isShortage ? { background: "#F7BB81" } : {}}
                          key={`${product.productId}-${orderIdentifier}`}
                        >
                          {index === 0 && (
                            <>
                              {/* <td rowSpan={product.orders.length}>{product.productId}</td> */}
                              <td rowSpan={product.orders.length}>
                                {product.name}
                              </td>
                            </>
                          )}
                          <td align="center">{getOrderQty(order)}</td>
                          <td>{order.orderId ?? order.orderNumber}</td>
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
                          <td align="center">
                            <i
                              onClick={() =>
                                handleRemoveOrderFromPreview(orderIdentifier)
                              }
                              title="এই order-টা requisition থেকে বাদ দিন (এর সব product সহ)"
                              className="ri-delete-bin-line text-red-500 cursor-pointer text-[16px]"
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end  mt-3">
            <button
              disabled={!canCreateRequisition || creatingRequisition}
              className={`text-[#fff] font-bold text-[12px] px-[20px] py-[5px] ${
                canCreateRequisition
                  ? "bg-primary cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={async () => {
                if (!previewGenerated) {
                  message.warning(
                    "Requisition create করার আগে অবশ্যই Preview generate করুন",
                  );
                  return;
                }
                if (hasStockShortage) {
                  message.warning(
                    "কিছু প্রোডাক্টের stock নেই। ওই order গুলো remove করুন অথবা stock ঠিক করুন",
                  );
                  return;
                }
                if (!remainingOrderIds.length) {
                  message.warning("কোনো valid order অবশিষ্ট নেই");
                  return;
                }
                try {
                  const res = await handleCreateRequisition({
                    orderIds: remainingOrderIds,
                    userId: userInfo?.userId,
                  }).unwrap();
                  refetch();
                  countRefetch();
                  message.success("Requisition create successfully..");
                  setOpenModal(false);
                  setPreviewGenerated(false);
                  setReqPreviewData([]);
                  setSelectedOrders([]);
                  setSelectedRowKeys([]);
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

      {/* Hidden Component Only for Printing */}
      {/* Hidden Component Only for Printing */}
      <div style={{ display: "none" }}>
        <div ref={bulkPrintRef}>
          <BulkInvoice orders={bulkPrintData} />
        </div>
      </div>
    </div>
  );
};

export default ApprovedOrders;