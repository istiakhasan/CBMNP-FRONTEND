/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import GbTable from "@/components/GbTable";
import {
  Checkbox,
  CheckboxOptionType,
  Image,
  MenuProps,
  Pagination,
  Popover,
  Switch,
  Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import {
  useDeleteProductByIdMutation,
  useGetAllProductQuery,
  useGetProductCountQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import GbDropdown from "@/components/ui/dashboard/GbDropdown";
import GbDrawer from "@/components/ui/GbDrawer";
import AddSimpleProuct from "./_component/AddSimpleProuct";
import { getBaseUrl } from "@/helpers/config/envConfig";
import GbHeader from "@/components/ui/dashboard/GbHeader";
const Page = () => {
  const [updateProduct] = useUpdateProductMutation();
  const {data:skuCount}=useGetProductCountQuery(undefined)
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
  const { data, isLoading } = useGetAllProductQuery(query);
  const [deleteBrandHandle] = useDeleteProductByIdMutation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // table column
  const tableColumn = [
    {
      title: "SKU",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span onClick={()=>router.push(`/product/${record?.id}`)} className="text-[#278ea5] cursor-pointer">{record?.sku}</span>;
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
            src={`${getBaseUrl()}/${record?.product_gallery?.length>0?record?.product_gallery[0]:''}`}
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
            <span onClick={()=>router.push(`/product/${record?.id}`)} className="block mb-2 text-[#278ea5] cursor-pointer">{record?.name}</span>
            <button className="bg-[#e8f0f2] px-[8px] py-[4px] text-[#000] font-semibold">
              {record?.addProductType === "single-product"
                ? "Simple Product"
                : "Variant"}
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
            <h1 className="">{record?.categories?.name || "--"}</h1>
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
        return <h1 className="border-[1px] border-[#ebebeb] w-fit px-5 py-1">{record?.volumeUnit+": "+record?.weight}</h1>;
      },
    },
    {
      title: "Attributes",
      key: 6,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <h1>N/A</h1>;
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
              BTD {record?.regularPrice || "0.00"}
            </del>
            <h1>BTD {record?.salePrice || "0.00"}</h1>
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
            <h1>BTD {record?.distributorPrice || "0.00"}</h1>
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
            <h1>BTD {record?.retailerPrice || "0.00"}</h1>
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
            <h1>BTD {record?.purchasePrice || "0.00"}</h1>
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
              const res = await updateProduct({
                id: record?.id,
                data: {
                  status: a,
                },
              });
              console.log(a, "adsf");
            }}
            defaultChecked={record?.status}
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
      label: <button onClick={()=>router.push('/product/add-product')}>Add Variant Product</button>,
      key: "1",
    },
  ];
  console.log(data,"data");
  return (
    <>
    <GbHeader />
    <div className="p-[16px]">
      <div className="flex justify-between items-center py-4 px-2">
        <GbDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          {" "}
          <AddSimpleProuct />{" "}
        </GbDrawer>
        <p className="text-[20px]">Products & Pricing</p>
        <div className="flex gap-[20px]">
          <div className="px-[18px] py-[8px] min-h-[24px]   border-[1px] border-[#f0f0f0]">
            <h1 className="text-[#656565]  text-[16px]  flex gap-4 items-center">
              Total SKU{" "}
              <Tooltip title="Total number of active and inactive SKUs">
                <i className="ri-information-line cursor-pointer"></i>
              </Tooltip>
            </h1>
            <h1 className="text-[#47a2b3] text-[20px] font-semibold">{skuCount?.totalSKUs || 0}</h1>
          </div>
          <div className="px-[18px] py-[8px] min-h-[24px]   border-[1px] border-[#f0f0f0]">
            <h1 className="text-[#656565]  text-[16px]  flex gap-4 items-center">
              Total Variants{" "}
              <Tooltip title="Total number of active and inactive Product variants">
                <i className="ri-information-line cursor-pointer"></i>
              </Tooltip>
            </h1>
            <h1 className="text-[#47a2b3] text-[20px] font-semibold">0</h1>
          </div>
          <div className="px-[18px] py-[8px] min-h-[24px]   border-[1px] border-[#f0f0f0]">
            <h1 className="text-[#656565]  text-[16px]  flex gap-4 items-center">
               New SKU{" "}
              <Tooltip title="Total number of New SKU">
                <i className="ri-information-line cursor-pointer"></i>
              </Tooltip>
            </h1>
            <h1 className="text-[#f6b44f] text-[20px] font-semibold">{skuCount?.newSKUs || 0}</h1>
          </div>
          <div className="px-[18px] py-[8px] min-h-[24px]   border-[1px] border-[#f0f0f0]">
            <h1 className="text-[#656565]  text-[16px]  flex gap-4 items-center">
               Active SKU{" "}
              <Tooltip title="Total number of active SKU">
                <i className="ri-information-line cursor-pointer"></i>
              </Tooltip>
            </h1>
            <h1 className="text-[#656565] text-[20px] font-semibold">{skuCount?.activeSKUs || 0}</h1>
          </div>
          <div className="px-[18px] py-[8px] min-h-[24px]   border-[1px] border-[#f0f0f0]">
            <h1 className="text-[#656565]  text-[16px]  flex gap-4 items-center">
               Inactive SKU{" "}
              <Tooltip title="Total number of inactive SKU">
                <i className="ri-information-line cursor-pointer"></i>
              </Tooltip>
            </h1>
            <h1 className="text-[#656565] text-[20px] font-semibold">{skuCount?.inactiveSKUs || 0}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="border-[#47a2b3] border text-[#47a2b3]  font-bold text-[12px]  px-[20px] py-[5px]">
            Action
          </button>
          <GbDropdown items={items}>
            <button className="bg-[#47a2b3] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px]">
              Add Product
            </button>
          </GbDropdown>
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
            columns={newColumns}
            dataSource={data?.data}
            pageSize={size}
            totalPages={data?.total}
            onPaginationChange={onPaginationChange}
            // showPagination={true}
            rowSelection={rowSelection}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Page;
