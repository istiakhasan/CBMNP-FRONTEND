/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import {
    Button,

  Pagination
} from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteProductByIdMutation,
  useGetAllProductQuery,
} from "@/redux/api/productApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";
const Page = () => {
    const search=useSearchParams()
    console.log(search.get('tab'),"params");
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  query["page"] = page;
  query["limit"] = size;
  query["searchProducts"] = searchTerm;
  const { data, isLoading } = useGetAllProductQuery(query);
  const [deleteBrandHandle] = useDeleteProductByIdMutation();
  const router = useRouter();
  // table column
  const tableColumn = [
    {
      title: "Warehouse",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span  className="text-[#278ea5] cursor-pointer">Pending</span>;
      },
    },
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span  className="text-[#278ea5] cursor-pointer">Pending</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Total Warehouses",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Total Available Quantity",
      key: 5,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
       return <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
      },
    },
    {
      title: <span>Total Stock Value <br /> (Currency)</span>,
      key: 6,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return  <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>;
      },
    },
    {
      title: <span>Total Purchase Cost <br /> (Currency)</span>,
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return  <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
      },
    },
    {
      title: "Total Shortage Quantity",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return  <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
      },
    },
    {
      title: "Total Wastage",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return  <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
      },
    },
    {
      title: "Total Expired",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return  <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
      },
    },
   
  ];
  const logsTableColumn = [
    {
      title: "Warehouse",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span  className="text-[#278ea5] cursor-pointer">Pending</span>;
      },
    },
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span  className="text-[#278ea5] cursor-pointer">Pending</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Quantity",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Updated By",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Updated At",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    {
      title: "Remarks",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span  className="block mb-2 text-[#278ea5] cursor-pointer">Pending</span>
          </>
        );
      },
    },
    
 
   
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };


  return (
    <>
    <GbHeader />
    <div className="p-[16px]">
      <div className="flex justify-between items-center py-4 px-2">
        <p className="text-[20px]">Inventory</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="border-[#47a2b3] border text-[#47a2b3]  font-bold text-[12px]  px-[20px] py-[5px]">
            Action
          </button>
        </div>
      </div>
      <div className="mb-3">
      <Button style={{background:"#f2f8fa",color:"#288ea5",boxShadow:"none"}}  onClick={()=>router.push('/inventory')} type="primary" size="small" className="mr-2">Stock</Button>
      <Button style={{background:"#f2f8fa",color:"#288ea5",boxShadow:"none"}}  onClick={()=>router.push('/inventory?tab=logs')} type="primary" size="small" className="mr-2">Logs</Button>
      </div>
      <div className="gb_border">
        <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
          <div className="flex gap-2">
            <div className="border p-2 h-[35px] w-[35px] flex gap-3 items-center cursor-pointer justify-center">
              <i
                style={{ fontSize: "24px" }}
                className="ri-restart-line text-gray-600"
              ></i>
            </div>
          </div>
          <Pagination
            pageSize={size}
            total={data?.total}
            onChange={(v, d) => {
              setPage(v);
              setSize(d);
            }}
            showSizeChanger={false}
            // onShowSizeChange={false}
          />
        </div>
        <div className="max-h-[500px] overflow-scroll">
          <GbTable
            loading={isLoading}
            columns={search.get('tab')==='logs'?logsTableColumn:tableColumn}
            dataSource={data?.data}
            pageSize={size}
            totalPages={data?.total}
            onPaginationChange={onPaginationChange}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Page;
