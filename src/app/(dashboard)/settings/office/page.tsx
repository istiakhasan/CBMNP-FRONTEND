"use client"
import { useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import GbTable from "@/components/GbTable";

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
import { useDeleteOfficeMutation, useGetAllOfficeQuery } from "@/redux/api/officeApi";
import AddOffice from "./_component/AddOffice";
import EditOffice from "./_component/EditOffice";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rowData, setRowData] = useState<any | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const { data, isLoading } = useGetAllOfficeQuery(undefined);
  const [deleteHandle] = useDeleteOfficeMutation();

  const tableColumn = [
    {
      key: "sl",
      title: "sl",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
            onClick={()=>GBconfirmModal(deleteHandle,record?.id,()=>{
              toast.success("Office deleted successfully.");
            })}
            className="ri-delete-bin-line text-[18px] cursor-pointer"
          ></i>
        </div>
      ),
    },
  ];


  return (
    <div>
      <GbHeader title={"Office List"} />
      <div className="flex justify-end items-center mb-[12px]">
        <button
          onClick={() => setOpenModal(true)}
          className="cm_button px-[20px] py-[5px] text-[12px]"
        >
          Add Office
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data?.data}
        pageSize={size}
      />
       <GbModal
        isModalOpen={openModal}
        openModal={() => setOpenModal(true)}
        closeModal={() => setOpenModal(false)}
        width="400px"
      >
        <AddOffice setOpenModal={setOpenModal} />
      </GbModal>
      <GbModal    
        isModalOpen={openEditModal}
        openModal={() => setOpenEditModal(true)}
        closeModal={() => setOpenEditModal(false)}
        width="400px"
      >
        <EditOffice rowData={rowData} setOpenModal={setOpenEditModal} />
      </GbModal>
    </div>
  );
};

export default Page;
