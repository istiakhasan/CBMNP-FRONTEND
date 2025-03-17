"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import { useRouter } from "next/navigation";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { toast } from "react-toastify";
import RequisitionPdf from "./_component/RequisitionPdf";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import dayjs from "dayjs";
import { useCreateRequisitionMutation } from "@/redux/api/requisitionApi";
const Page = () => {
  const router = useRouter();
  const [handleCreateRequisition]= useCreateRequisitionMutation()
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: size,
    searchTerm,
    orderStatus: "2",
  });

  const tableColumn = [
    {
      title: "sl",
      dataIndex: "sl",
      //@ts-ignore
      render: (text, record, index) => index + 1,
      key: "sl",
    },
    {
      title: "Order number",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="text-[#7D7D7D] font-[500]">
            {dayjs(record?.created_at).format("D MMM YYYY")}
          </span>
        );
      },
    },
    {
      title: "Shipping number",
      align:"center",
       //@ts-ignore
       render: (text, record, index) => {
        return (
          <span  className="text-[#7D7D7D] font-[500]">--</span>
        );
      },
      key: "shippingNumber",
    },
    {
      title: "Order from",
         //@ts-ignore
         render: (text, record, index) => {
          return (
            <span className="text-[#7D7D7D] font-[500]">{record?.orderFrom}</span>
          );
        },
      key: "orderFrom",
    },
    {
      title: "Payment method",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="text-[#7D7D7D] font-[500]">
            {record?.last_transaction?.paymentMethods}
          </span>
        );
      },
      key: "paymentMethod",
    },
    {
      title: "TrxID",
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="text-[#7D7D7D] font-[500]">--</span>;
      },
      key: "trxID",
    },
    {
      title: "Price",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="text-[#7D7D7D] font-[500]">
            {record?.last_transaction?.totalPurchesAmount}
          </span>
        );
      },
      key: "price",
    },
    {
      title: "Store",
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="text-[#7D7D7D] font-[500]">--</span>;
      },
      key: "store",
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const onSelectChange = (newSelectedRowKeys: any) => {
    const selectedRows = data?.data?.filter((item: any) =>
      newSelectedRowKeys.includes(item.id)
    );
    setRowData([...selectedRows]);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <div>
      <GbHeader title={"Warehouse operation"} />
      <GbForm submitHandler={(data:any) => console.log(data)}>
        <div className="flex gap-[12px] mb-[20px] items-center">
          <div className="flex flex-[341px] items-center gap-[6px] bg-[#FFFFFF] p-[10px] rounded-[5px]">
            <SearchOutlined style={{ fontSize: "20px", color: "#BCBCBC" }} />
            <input
              style={{
                borderRadius: "4px",
                outline: "none",
                fontSize: "12px",
                fontWeight: "400",
                border: "none",
                background: "#FFFFFF",
                width: "100%",
              }}
              placeholder={"Search by name"}
            />
          </div>

          <div className="flex-1">
            <GbFormSelect
              placeholder="Order source"
              options={[
                { label: "Facebook", value: "facebook" },
                { label: "website", value: "website" },
              ]}
              name="order_source"
            />
          </div>
          <div className="flex-1">
            <GbFormSelect
              placeholder="Delivery type"
              options={[
                { label: "Facebook", value: "facebook" },
                { label: "website", value: "website" },
              ]}
              name="order_source"
            />
          </div>
          <div className="flex-1">
            <GbFormSelect
              placeholder="Payment type"
              options={[
                { label: "Facebook", value: "facebook" },
                { label: "website", value: "website" },
              ]}
              name="order_source"
            />
          </div>
          <div className="flex-1">
            <GbFormSelect
              placeholder="Transfer"
              options={[
                { label: "Facebook", value: "facebook" },
                { label: "website", value: "website" },
              ]}
              name="order_source"
            />
          </div>
          <div className="flex-1">
            <GbFormInput placeholder="Product filter" name="order_source" />
          </div>
        </div>
      </GbForm>
      <div className="flex items-center justify-end mb-[9px] gap-3">
        <button className="cm_button text-[14px] px-[30px] py-[5px] flex items-center gap-2">
          <i className="ri-price-tag-3-line "></i>
          Add Issue
        </button>
        <button
          disabled={rowData?.length <= 0 ? true : false}
          onClick={async() => {
            const genarateId=rowData.map(item=>{
              return item?.id
            })
            const res=await handleCreateRequisition({ordersId:genarateId}).unwrap()
            if(res?.success){
              router.push(`/store/order-requisition/${res?.data?.id}`)
            }
            toast.success(
              <div>
                <h1 className="text-[#00A438] text-[14px] font-[500]">
                  Success
                </h1>
                <p className="text-[#7D7D7D] font-[500] text-[12px] text-nowrap">
                  Your selected orders has been successfully proceed for paking
                </p>
              </div>,
              { position: "top-center", style: { width: "445px" } }
            );
          }}
          className={`cm_button text-[14px] px-[30px] py-[5px] flex items-center gap-2 ${
            rowData?.length <= 0 && "bg-gray-200"
          }`}
        >
          Proceed
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data?.data}
        pageSize={size}
        // totalPages={data?.meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        rowSelection={rowSelection}
        showPagination={true}
      />
    </div>
  );
};

export default Page;
