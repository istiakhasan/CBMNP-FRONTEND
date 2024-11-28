"use client"
import { useState } from "react";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import GbTable from "@/components/GbTable";
import {
  EditOutlined,
} from "@ant-design/icons";
import GBconfirmModal from "@/components/ui/GbConfirmModal";
import { toast } from "react-toastify";
import { useDeleteDepartmentMutation, useGetAllDepartmentQuery } from "@/redux/api/departmentApi";
import AddDepartment from "./_component/AddDepartment";
import EditDepartment from "./_component/EditDepartment";


const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rowData, setRowData] = useState<any | null>(null);
  const { data, isLoading } = useGetAllDepartmentQuery(undefined);
  const [deleteHandle] = useDeleteDepartmentMutation();

  const tableColumn = [
    {
      key: "sl",
      title: "sl",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Office Name",
      key: "officeName",
      render: (record: any) => record?.office?.name,
    },
    {
      title: "Office Location",
      render: (record: any) => record?.office?.location,
      key: "location",
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
              toast.success("Department deleted successfully.");
            })}
            className="ri-delete-bin-line text-[18px] cursor-pointer"
          ></i>
        </div>
      ),
    },
  ];
  


  return (
    <div>
      <GbHeader title={"Department List"} />
      <div className="flex justify-end items-center mb-[12px]">
        <button
          onClick={() => setOpenModal(true)}
          className="cm_button px-[20px] py-[5px] text-[12px]"
        >
          Add Department
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data?.data}
        // pageSize={size}
      />
       <GbModal
        isModalOpen={openModal}
        openModal={() => setOpenModal(true)}
        closeModal={() => setOpenModal(false)}
        width="400px"
      >
        <AddDepartment setOpenModal={setOpenModal} />
      </GbModal>
      <GbModal    
        isModalOpen={openEditModal}
        openModal={() => setOpenEditModal(true)}
        closeModal={() => setOpenEditModal(false)}
        width="400px"
      >
        <EditDepartment rowData={rowData} setOpenModal={setOpenEditModal} />
      </GbModal>
    </div>
  );
};

export default Page;
