"use client"
import { useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import GbTable from "@/components/GbTable";
import AddBrand from "./_component/AddBrand";
import EditBrand from "./_component/EditBrand";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  useDeleteBrandMutation,
  useGetAllBrandQuery,
} from "@/redux/api/brandApi";
import GBconfirmModal from "@/components/ui/GbConfirmModal";
import { toast } from "react-toastify";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rowData, setRowData] = useState<any | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const { data, isLoading } = useGetAllBrandQuery(undefined);
  const [deleteBrandHandle] = useDeleteBrandMutation();

  const tableColumn = [
    {
      key: "sl",
      title: "sl",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Brand Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Creation Date",
      render: (data: any) => dayjs(data?.created_at).format("D MMM YYYY"),
      key: "created_at",
    },
    {
      title: "Action",
      align: "end",
      render: (_: any, record: any) => (
        <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
          <EditOutlined
            onClick={() => {
              setOpenEditModal(true);
              setRowData(record);
            }}
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
          <i
            onClick={()=>GBconfirmModal(deleteBrandHandle,record?.id,()=>{
              toast.success("Brand deleted successfully.");
            })}
            className="ri-delete-bin-line text-[18px] cursor-pointer"
          ></i>
        </div>
      ),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  return (
    <div>
      <GbHeader title={"Brand List"} />
      <div className="flex justify-between items-center mb-[12px]">
        <div className="w-[494px] flex gap-2 items-center ">
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
        <button
          onClick={() => setOpenModal(true)}
          className="cm_button text-[12px]  p-[10px]"
        >
          {" "}
          <PlusOutlined className="me-[5px]" />
          Add Brand
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data}
        pageSize={size}
        id="asdfasd"
      />
      <GbModal
        isModalOpen={openModal}
        openModal={() => setOpenModal(true)}
        closeModal={() => setOpenModal(false)}
        width="400px"
      >
        <AddBrand setOpenModal={setOpenModal} />
      </GbModal>
      <GbModal
        isModalOpen={openEditModal}
        openModal={() => setOpenEditModal(true)}
        closeModal={() => setOpenEditModal(false)}
        width="400px"
      >
        <EditBrand rowData={rowData} setOpenModal={setOpenEditModal} />
      </GbModal>
    </div>
  );
};

export default Page;
