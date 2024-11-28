/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import CategoryImage from "../../../../assets/images/category.png";
import CheckImage from "../../../../assets/images/check.png";
import Image from "next/image";
import GbModal from "@/components/ui/GbModal";
import { useRef, useState } from "react";
// import AddCategory from "./_component/AddCategory";
import GbTable from "@/components/GbTable";
import dayjs from "dayjs";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { useDeleteProductByIdMutation, useGetAllProductQuery } from "@/redux/api/productApi";
import { getBaseUrl } from "@/helpers/config/envConfig";
const Page = () => {
  const searchRef=useRef<HTMLInputElement>(null);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [searchTerm,setSearchTerm]=useState('')
  query['page']=page
  query['limit']=size
  query['searchProducts']=searchTerm
  const { data, isLoading } = useGetAllProductQuery(query);
  const [deleteBrandHandle]=useDeleteProductByIdMutation()
  const router=useRouter()
  // table column
  const tableColumn = [
    {
      title: "Product code",
      dataIndex: "name1",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="font-[500] text-[#7D7D7D]">{record?.product_code}</span>
        );
      },
    },
    {
      title: "Product name",
      key: 12,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="font-[500] text-[#7D7D7D]">{record?.product_title_bn}</span>
        );
      },
    },
    {
      title: "Product size",
      key: 152,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {
        return <h1 className="font-[500] text-[#A2A2A2]">{record?.pack_size}</h1>;
      },
    },
    {
      title: "Thumbnail",
      key: 12,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {
        return <img className="block mx-auto object-cover" src={`${getBaseUrl()}/${record?.product_image}`} alt="thumbnail image" height={66} width={66} />;
      },
    },
    {
      title: "Description ",
      key: 132,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {;
        return  <>
        {
              record?.product_dec_bn?.length > 0 
              ? <Image className="block mx-auto" src={CheckImage} alt="asdf" width={66} /> 
              : <span style={{display:"block",textAlign:"center"}}>--</span>
            }
        </>
      },
    },
    {
      title: "Health benefits",
      key: 122,
      align:"center",
      //@ts-ignore
      render: (text, record, index) => {
        let item;
    
        if (typeof record?.health_benefits === 'string' && record.health_benefits !== "undefined") {
          try {
            item = JSON.parse(record?.health_benefits);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            item = null;
          }
        } else {
          item = null;
        }
    
        return (
          <>
            {
              item?.length > 0 
              ? <Image className="block mx-auto" src={CheckImage} alt="asdf" width={66} /> 
              : <span style={{display:"block",textAlign:"center"}}>--</span>
            }
          </>
        );
      },
    },
    
    {
      title: "Created date",
      key: 121,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="text-[#7D7D7D] font-[500]">{dayjs(record?.created_at).format("D MMM YYYY")}</span>
        );
      },
    },
    {
      title: "Updated date",
      key: 121,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <span className="text-[#7D7D7D] font-[500]">{dayjs(record?.updated_at).format("D MMM YYYY")}</span>
        );
      },
    },
    {
      title: "Action",
      align: "end",
      render: (_: any, record: any) => (
        <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
            <i onClick={() => {
              router.push(`/content-management/product/${record?.id}`)
            //   router.push(`/product/${record?.id}`)
              }}
              style={{ fontSize: "20px", cursor: "pointer",color:"#F48C13" }} className="ri-eye-fill"></i>
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
      <GbHeader title={"Product content"} />

      <div className="flex justify-between mb-4">
        <div className="max-w-[494px] flex-1 flex gap-2 items-center">
          <div className="flex flex-1  items-center gap-[6px] bg-[#FFFFFF] px-[12px] py-[9px] rounded-[5px]">
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
                padding:"2px "
              }}

              ref={searchRef} 
              // onChange={(e)=>setSearchTerm(e.target.value)}
              placeholder={"Search by product code or produt name "}
            />
          </div>
          <button type="button" onClick={()=>{
            //@ts-ignore
            setSearchTerm(searchRef.current?.value)
 
          }} className="cm_button text-[14px] px-[30px] py-[9px]">
            Search
          </button>
        </div>

      </div>
      <GbTable
        loading={isLoading}
        columns={tableColumn}
        dataSource={data?.data}
        pageSize={size}
        totalPages={data?.totalCount}
        onPaginationChange={onPaginationChange}
        showPagination={true}
      />
    </div>
  );
};

export default Page;
