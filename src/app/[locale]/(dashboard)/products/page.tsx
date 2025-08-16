/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment, useState } from "react";
import GbTable from "@/components/GbTable";
import {
  Checkbox,
  CheckboxOptionType,
  Image,
  MenuProps,
  message,
  Pagination,
  Popover,
  Switch,
} from "antd";
import { useRouter } from "next/navigation";
import {
  useDeleteProductByIdMutation,
  useGetAllProductQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import GbDrawer from "@/components/ui/GbDrawer";
import AddSimpleProuct from "./_component/AddSimpleProuct";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { customError } from "@/constants/variableConstant";
import StatsContainer from "./_component/StatusContainer";
import { useLocale } from "next-intl";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { getUserInfo } from "@/service/authService";
const Page = () => {
  const local=useLocale()
  const [updateProduct] = useUpdateProductMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowData, setRowData] = useState<any[]>([]);
  query["page"] = page;
  query["limit"] = size;
  query["searchProducts"] = searchTerm;
  query["sortBy"] = "id";
  const { data, isLoading } = useGetAllProductQuery(query,{
    refetchOnMountOrArgChange:true
  });
  const [deleteBrandHandle] = useDeleteProductByIdMutation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const userInfo: any = getUserInfo();
  const { data: userData, isLoading: getUserLoading } = useGetUserByIdQuery({
    id: userInfo?.userId,
  });
  const permission = userData?.permission?.map((item: any) => item?.label);
  // table column
  const tableColumn = [
    {
      title: "SKU",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span onClick={()=>router.push(`/${local}/product/${record?.id}`)} className="color_primary cursor-pointer">{record?.sku || "N/A"}</span>;
      },
    },
    {
      title: "Images",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <Image
            height={44}
            width={44}
            src={record?.images?.length>0 &&record?.images[0]?.url}
            alt=""
          />
        );
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span onClick={()=>router.push(`/${local}/product/${record?.id}`)} className="block mb-2 color_primary cursor-pointer">{record?.name}</span>
            <button className="bg-[#e8f0f2] px-[8px] py-[4px] text-[#000] font-semibold">
              {record?.productType}
            </button>
          </>
        );
      },
    },
    {
      title: "Category",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <h1 className="">{record?.category?.label || "N/A"}</h1>
          </>
        );
      },
    },
    {
      title: "Specifications",
      key: 5,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <h1 className="border-[1px] border-[#ebebeb] w-fit px-5 py-1">Weight :{record?.weight+record?.unit}</h1>;
      },
    },
    {
      title: "Attributes",
      key: 6,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
           {
            record?.attributes?.map((item:{attributeName:string,label:string},i:number)=>(
              <Fragment key={i}> 
              <span className="border-[1px] border-[#ebebeb] w-fit px-5 py-1 mr-2">{item?.attributeName} :{item?.label}</span>
              </Fragment>
            ))
           }
          </>
        );
      },
    },
    {
      title: "MRP",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <del className="mb-[5px] block">
              BDT {record?.regularPrice || "0.00"}
            </del>
            <h1>BDT {record?.salePrice || "0.00"}</h1>
          </>
        );
      },
    },
    {
      title: "Distributor Price",
      key: 8,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <h1>BDT {record?.distributionPrice || "0.00"}</h1>
          </>
        );
      },
    },
    {
      title: "Retailer Price",
      key: 9,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <h1>BDT {record?.retailPrice || "0.00"}</h1>
          </>
        );
      },
    },
    {
      title: "Purchase Price",
      key: 10,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <h1>BDT {record?.purchasePrice || "0.00"}</h1>
          </>
        );
      },
    },

    {
      title: "Status",
      align: "end",
      key: 11,
      render: (_: any, record: any) => (
        <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
          <Switch
            size="small"
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={async (a) => {
              try {
                const res = await updateProduct({
                  id: record?.id,
                  data: {
                    active: a,
                  },
                }).unwrap();
                if(res?.success){
                  message.success(`Product ${record?.name} ${a?'active':'inactive'} successfully`)
                }
              } catch (error) {
                message.error(customError)
              }
            }}
            defaultChecked={record?.active}
          />
        </div>
      ),
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
  const defaultCheckedList = tableColumn.map((item: any) => item.key as string);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const newColumns = tableColumn.map((item: any) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string),
  }));
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const options = tableColumn.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const items: MenuProps["items"] = [
    {
      label: (
        <button onClick={() => setDrawerOpen(true)}>Add Simple Product</button>
      ),
      key: "0",
    },
    {
      label: <button onClick={()=>router.push(`/${local}/product/add-product`)}>Add Variant Product</button>,
      key: "1",
    },
  ];

  return (
    <>
    <GbHeader title="Products & Pricing" />
    <div className="p-[16px]">
      <div className="flex justify-end items-center py-4 px-2">
        <GbDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          {" "}
          <AddSimpleProuct setDrawerOpen={setDrawerOpen} />{" "}
        </GbDrawer>
        <div className="flex items-center gap-3 flex-wrap">
          {/* <button className="border-[#4F8A6D] border text-[#4F8A6D]  font-bold text-[12px]  px-[20px] py-[5px]">
            Action
          </button> */}
           {permission?.includes("Add Products") &&    <GbDropdown items={items}>
            <button className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]">
              Add Product
            </button>
          </GbDropdown>}
        </div>
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
            <Popover
              placement="bottom"
              content={
                <div className=" min-w-[200px]">
                  <Checkbox.Group
                    className="flex flex-col gap-3"
                    value={checkedList}
                    options={options as CheckboxOptionType[]}
                    onChange={(value) => {
                      setCheckedList(value as string[]);
                    }}
                  />
                </div>
              }
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <div className="border p-2 h-[35px] flex items-center gap-2 cursor-pointer">
                <i
                  style={{ fontSize: "24px" }}
                  className="ri-equalizer-line text-gray-600"
                ></i>{" "}
                Filter Column
              </div>
            </Popover>
            <StatsContainer />
          </div>
          <Pagination
            pageSize={size}
            total={data?.meta?.total}
            onChange={(v, d) => {
              setPage(v);
              setSize(d);
            }}
            showSizeChanger={false}
            // onShowSizeChange={false}
          />
        </div>
        <div className="max-h-[600px] overflow-scroll">
          <GbTable
            loading={isLoading}
            columns={newColumns}
            dataSource={data?.data}
            pageSize={size}
            // totalPages={data?.meta?.total}
            onPaginationChange={onPaginationChange}
            // showPagination={true}
            // rowSelection={rowSelection}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Page;
