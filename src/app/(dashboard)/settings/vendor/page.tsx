"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import {
  useDeleteVendorMutation,
  useGetAllVendorsQuery,
} from "@/redux/api/vendorApi";
import { useRouter } from "next/navigation";
import { message } from "antd";
const Page = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { data, isLoading } = useGetAllVendorsQuery(undefined);
  const [deleteVenderHandle] = useDeleteVendorMutation();
  // table column
  const tableColumn = [
    {
      title: "sl",
      //@ts-ignore
      render: (text, record, index) => index + 1,
    },
    {
      title: "Vendor Name",
      dataIndex: "organization_name",
      key: 2,
      width: "200px",
    },
    {
      title: "Mobile Number",
      align: "center",
      dataIndex: "phone_number",
      key: 12,
    },
    {
      title: "Action",
      align: "end",
      dataIndex: "title",
      key: 3,
      render: function (abc: any, record: any) {
        return (
          <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
            <EditOutlined
              onClick={() => {
                router.push(`/settings/vendor/add-vendor/?id=${record?.id}`);
              }}
              style={{ fontSize: "18px", cursor: "pointer" }}
            />
            <i
              onClick={async () => {
                const res = await deleteVenderHandle({ id: record?.id });
                if (res) {
                  message.success("Vendor deleted successfully");
                }
              }}
              className="ri-delete-bin-line text-[18px] cursor-pointer"
            ></i>
          </div>
        );
      },
    },
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  return (
    <div>
      <GbHeader title={"Vendor"} />
      <div className="flex  items-center justify-between mb-[12px]">
        <div className="w-[494px] flex gap-2 items-center">
          <div className="flex flex-1  items-center gap-[6px] bg-[#FFFFFF] p-[12px] rounded-[5px]">
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
          <button className="cm_button w-[86px] p-[12px] text-[12px] ">
            Search
          </button>
        </div>
        <button
          onClick={() => router.push("/settings/vendor/add-vendor")}
          className="cm_button text-[12px]  p-[10px]"
        >
          {" "}
          <PlusOutlined className="me-[5px]" />
          Add New Vendor
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data}
        pageSize={size}
        // totalPages={data?.meta?.total}
        // showSizeChanger={true}
        // onPaginationChange={onPaginationChange}
        //  onTableChange={onTableChange}
        // showPagination={true}
      />
    </div>
  );
};

export default Page;
