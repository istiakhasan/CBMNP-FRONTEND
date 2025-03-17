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
import moment from "moment";

const Page = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
//   const { data, isLoading } = useGetAllVendorsQuery(undefined);

  const tableColumn = [
    {
      title: "Order number",
      //@ts-ignore
      render: (text, record, index) => {
        return (<span className="text-[#4E9EFC] text-[14px] font-[500]">{record?.orderNumber}</span>)
      },
      key: "sl",
    },
    {
      title: "Customer name",
      dataIndex: "CustomerName",
      key: "Customer name",
    },
    {
      title: "Order source",
      dataIndex: "Ordersource",
      key: "Ordersource",
    },
    {
      title: "Order time",
      dataIndex: "Order_time",
      key: "shippingNumber",
      //@ts-ignore
      render: (text, record, index) => {
        return (<span>{moment(record?.Order_time).format('DDD/MM/YYYY')}</span>)
      },

    },
    {
        width:150,
      title: "Delivery type",
      dataIndex: "Deliverytype",
    }
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };






  const dataSource = [
    { id: 1, orderNumber: "15487965425148", CustomerName: "John Doe", Ordersource: "Online", Order_time: "2024-05-19T14:00:00Z", orderFrom: "Store A", Deliverytype: "Standard" },
    { id: 2, orderNumber: "15487965425149", CustomerName: "Jane Smith", Ordersource: "In-Store", Order_time: "2024-05-18T10:00:00Z", orderFrom: "Store B", Deliverytype: "Express" },
    { id: 3, orderNumber: "15487965425150", CustomerName: "Alice Johnson", Ordersource: "Online", Order_time: "2024-05-17T09:30:00Z", orderFrom: "Store C", Deliverytype: "Standard" },
    { id: 4, orderNumber: "15487965425151", CustomerName: "Bob Brown", Ordersource: "In-Store", Order_time: "2024-05-16T16:45:00Z", orderFrom: "Store D", Deliverytype: "Express" },
    { id: 5, orderNumber: "15487965425152", CustomerName: "Charlie Davis", Ordersource: "Online", Order_time: "2024-05-15T11:20:00Z", orderFrom: "Store E", Deliverytype: "Standard" },
    { id: 6, orderNumber: "15487965425153", CustomerName: "Diana Evans", Ordersource: "In-Store", Order_time: "2024-05-14T14:10:00Z", orderFrom: "Store F", Deliverytype: "Express" },
    { id: 7, orderNumber: "15487965425154", CustomerName: "Frank Green", Ordersource: "Online", Order_time: "2024-05-13T08:50:00Z", orderFrom: "Store G", Deliverytype: "Standard" },
    { id: 8, orderNumber: "15487965425155", CustomerName: "Grace Harris", Ordersource: "In-Store", Order_time: "2024-05-12T15:30:00Z", orderFrom: "Store H", Deliverytype: "Express" },
    { id: 9, orderNumber: "15487965425156", CustomerName: "Hank Ivory", Ordersource: "Online", Order_time: "2024-05-11T12:40:00Z", orderFrom: "Store I", Deliverytype: "Standard" },
    { id: 10, orderNumber: "15487965425157", CustomerName: "Irene James", Ordersource: "In-Store", Order_time: "2024-05-10T13:20:00Z", orderFrom: "Store J", Deliverytype: "Express" },
    { id: 11, orderNumber: "15487965425158", CustomerName: "Jack King", Ordersource: "Online", Order_time: "2024-05-09T17:00:00Z", orderFrom: "Store K", Deliverytype: "Standard" },
    { id: 12, orderNumber: "15487965425159", CustomerName: "Karen Lewis", Ordersource: "In-Store", Order_time: "2024-05-08T10:00:00Z", orderFrom: "Store L", Deliverytype: "Express" },
  ];

  return (
    <div>
      <GbHeader title={"Packing Order List"} />
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
              placeholder="Select requisition number"
              options={[
                { label: "Facebook", value: "facebook" },
                { label: "website", value: "website" },
              ]}
              name="requisition_number"
            />
          </div>
          <button className="cm_button text-[14px] px-[30px] py-[9px] flex items-center gap-2">
          <i className="ri-truck-line"></i>
          Select currier
        </button>
        </div>
      </GbForm>
      <GbTable
        // loading={isLoading}
        columns={tableColumn}
        dataSource={dataSource}
        pageSize={size}
        // totalPages={data?.meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        showPagination={true}
      />
    </div>
  );
};

export default Page;
