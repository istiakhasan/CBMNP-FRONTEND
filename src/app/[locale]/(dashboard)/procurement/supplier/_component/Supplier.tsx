"use client";
import GbTable from "@/components/GbTable";
import OrderSearch from "@/components/OrderSearch";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import GbModal from "@/components/ui/GbModal";
import { Pagination } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";
import AddSupplier from "./AddSupplier";
import ViewSupplier from "./ViewSupplier";
import EditSupplier from "./EditSupplier";

const Supplier = () => {
  const [rowDto, setRowDto] = useState<any>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { data: supplier, isLoading } = useGetAllSupplierQuery({
    page,
    limit:size,
    searchTerm
  });

  const tableColumns = [
    {
      title: "Sl",
      key: "1",
      render: (a: any, b: any, i: any) => {
        const sl = page * size - size + (i + 1);
        return <span>{sl}</span>;
      },
    },
    {
      title: "CreatedAt",
      key: "2",
      render: (a: any, record: any, i: any) => {
        return <span>{moment(record?.createdAt).format("YYYY-MMMM-DD")}</span>;
      },
    },
    {
      title: "Company",
      key: "12",
      render: (a: any, record: any, i: any) => {
        return <span className="text-primary">{record?.company}</span>;
      },
    },
    {
      title: "Name",
      key: "3",
      render: (a: any, record: any, i: any) => {
        return <span>{record?.contactPerson}</span>;
      },
    },
    {
      title: "Phone",
      key: "5",
      render: (a: any, b: any, i: any) => {
        return <span>{b?.phone}</span>;
      },
    },
    {
      title: "Email",
      key: "51",
      render: (a: any, b: any, i: any) => {
        return <span>{b?.email}</span>;
      },
    },

    {
      title: "View",
      key: "action",
      width: "60px",
      render: (text: string, record: any) => {
        return (
          <>
            <span
              onClick={() => {
                setOpenViewModal(true);
                setRowDto(record);
              }}
              className=" text-white text-[10px] py-[2px] px-[10px] cursor-pointer"
            >
              <i
                style={{ fontSize: "18px" }}
                className="ri-eye-fill color_primary"
              ></i>
            </span>

            <i
              onClick={() => {
                setEditModal(true);
                setRowDto(record);
              }}
              className="ri-edit-2-fill text-[18px] color_primary cursor-pointer"
            ></i>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <GbHeader title="Supplier" />

      <div className="p-[16px]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <OrderSearch
            setSearchTerm={setSearchTerm}
            placeholder={"Search by invoice number"}
            searchTerm={searchTerm}
          />
          <button
            onClick={() => setOpen(true)}
            className="bg-primary text-[#fff] font-bold text-[12px] px-[20px] py-[5px] uppercase"
          >
            Add
          </button>
        </div>
        <div className="gb_border my-2">
          <div className="flex justify-between gap-2 flex-wrap mt-2 p-3">
            <div className="flex gap-3">
              <Pagination
                pageSize={size}
                total={supplier?.meta?.total}
                onChange={(v, d) => {
                  setPage(v);
                  setSize(d);
                }}
                showSizeChanger={false}
              />
            </div>
          </div>
          <div className="max-h-[600px] overflow-scroll">
            <GbTable
              loading={isLoading}
              columns={tableColumns}
              dataSource={supplier?.data}
            />
          </div>
        </div>
      </div>
      {/* Create supplier */}
      <GbModal
        width="1200px"
        // clseTab={false}
        isModalOpen={open}
        openModal={() => setOpen(true)}
        closeModal={() => setOpen(false)}
      >
        <AddSupplier setSupplierModal={setOpen} />
      </GbModal>
      {/* Edit supplier */}
      <GbModal
        width="1200px"
        // clseTab={false}
        isModalOpen={editModal}
        openModal={() => setEditModal(true)}
        closeModal={() => setEditModal(false)}
      >
        <EditSupplier rowData={rowDto} setSupplierModal={setEditModal} />
      </GbModal>

      {/* View supplier */}
      <GbModal
        clseTab={false}
        isModalOpen={openViewModal}
        openModal={() => setOpenViewModal(true)}
        closeModal={() => setOpenViewModal(false)}
        cls="custom_ant_modal"
        width="1100px"
      >
        <ViewSupplier
          supplier={rowDto}
          onClose={() => setOpenViewModal(false)}
        />
      </GbModal>
    </div>
  );
};

export default Supplier;
