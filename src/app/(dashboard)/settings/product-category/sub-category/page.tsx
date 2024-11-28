"use client"
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import CategoryImage from "../../../../../assets/images/category.png";
import Image from "next/image";
import GbModal from "@/components/ui/GbModal";
import { useState } from "react";
import { useGetAllMainCategoryQuery } from "@/redux/api/categoryApi";
import GbTable from "@/components/GbTable";
import dayjs from "dayjs";
import AddSubCategory from "../_component/AddSubCategory";
const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const {data,isLoading}=useGetAllMainCategoryQuery(undefined)
  // table column
const tableColumn = [
  {
    title: "sl",
    //@ts-ignore
    render: (text, record, index) => index + 1,
  },
  {
    title: "Image",
    key: 1,
    render: function (blogDto: any) {
      return (
        <Image src={CategoryImage} alt="" width={40} height={40} />
      );
    },
  },
  {
    title: "Category Name",
    dataIndex: "name_en",
    key: 2,
  },
  {
    title: "Sub Category Name",
    dataIndex: "name_en",
    key: 2,
  },
  {
    title: "Creation Date",
    render: function (data: any) {
      return data && dayjs(data?.created_at).format("D MMM YYYY");
    },
    key: 12,
  },
  {
    title: "Action",
    align:"end",
    dataIndex: "title",
    key: 3,
    render:function(){
      return (
        <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
        <EditOutlined
          style={{ fontSize: "18px", cursor: "pointer" }}
        />
        <i className="ri-delete-bin-line text-[18px] cursor-pointer"></i>
      </div>
      )
    }
  },
];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  return (
    <div>
      <GbHeader title={"Sub Category"} />
      <div className="flex justify-between items-center">
        <h1 className="box_title mb-[20px]">Sub Category</h1>
        <button onClick={()=>setOpenModal(true)} className="cm_button text-[12px]  p-[10px]">
          {" "}
          <PlusOutlined className="me-[5px]" />
          Add Sub Category
        </button>
        {/* Add sub category modal */}
        <GbModal
          isModalOpen={openModal}
          openModal={() => setOpenModal(true)}
          closeModal={() => setOpenModal(false)}
          width="400px"
        >
         <AddSubCategory setOpenModal={setOpenModal} />
        </GbModal>
      </div>

      <div className="max-w-[494px] flex gap-2 items-center">
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
        <button className="cm_button w-[86px] p-[10px] text-[12px] ">
          Search
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
