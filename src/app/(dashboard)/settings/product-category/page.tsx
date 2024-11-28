"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import GbModal from "@/components/ui/GbModal";
import { useState } from "react";
import AddCategory from "./_component/AddCategory";
import {
  useDeleteCategoryMutation,
  useGetAllMainCategoryQuery,
} from "@/redux/api/categoryApi";
import GbTable from "@/components/GbTable";
import dayjs from "dayjs";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { Image } from "antd";
import EditCategory from "./_component/EditCategory";
import GBconfirmModal from "@/components/ui/GbConfirmModal";
import { toast } from "react-toastify";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { data, isLoading } = useGetAllMainCategoryQuery(undefined);
  const [deleteCategoryHandle] = useDeleteCategoryMutation();

  const tableColumn = [
    {
      key: 'sl',
      title: 'SL',
      render: (text:any, record:any, index:any) => index + 1,
    },
    {
      title: 'Image',
      key: 'image',
      render: (text:any, record:any) => (
        <Image
          src={`${getBaseUrl()}/${record?.image}`}
          alt=""
          width={40}
          height={40}
        />
      ),
    },
    {
      title: 'Category Name',
      dataIndex: 'name_en',
      key: 'name_en',
    },
    {
      title: 'Creation Date',
      key: 'created_at',
      render: (record:any) => dayjs(record.created_at).format('D MMM YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'end',
      render: (text:any, record:any) => (
        <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
          <EditOutlined
            onClick={() => {
              setOpenEditModal(true);
              setRowData(record);
            }}
            style={{ fontSize: '18px', cursor: 'pointer' }}
          />
          <i
            onClick={() => GBconfirmModal(deleteCategoryHandle, record.id, () => {
              toast.success('Category deleted successfully.');
            })}
            className="ri-delete-bin-line text-[18px] cursor-pointer"
          ></i>
        </div>
      ),
    },
  ];

  const onPaginationChange = (page:any, pageSize:any) => {
    setPage(page);
    setSize(pageSize);
  };

  return (
    <div>
      <GbHeader title="Category" />
      <div className="flex justify-between items-center">
        <GbModal
          isModalOpen={openModal}
          openModal={() => setOpenModal(true)}
          closeModal={() => setOpenModal(false)}
          width="400px"
        >
          <AddCategory setOpenModal={setOpenModal} />
        </GbModal>
      </div>
      <div className="flex justify-between items-center mb-[12px]">
        <div className="w-[494px] flex gap-2 items-center">
          <div className="flex flex-1 items-center gap-[6px] bg-[#FFFFFF] p-[11px] rounded-[5px]">
            <SearchOutlined style={{ fontSize: '20px', color: '#BCBCBC' }} />
            <input
              style={{
                borderRadius: '4px',
                outline: 'none',
                fontSize: '12px',
                fontWeight: '400',
                border: 'none',
                background: '#FFFFFF',
                width: '100%',
              }}
              placeholder="Search by name"
            />
          </div>
          <button className="cm_button w-[86px] p-[11px] text-[12px]">Search</button>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="cm_button text-[14px] px-[30px] py-[9px]"
        >
          <PlusOutlined className="me-[5px]" />
          Add New Category
        </button>
      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data}
        pageSize={size}
        onPaginationChange={onPaginationChange}
      />
      <GbModal
        isModalOpen={openEditModal}
        openModal={() => setOpenEditModal(true)}
        closeModal={() => setOpenEditModal(false)}
        width="400px"
      >
        <EditCategory rowData={rowData} setOpenModal={setOpenEditModal} />
      </GbModal>
    </div>
  );
};

export default Page;
