/* eslint-disable @next/next/no-img-element */
"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { EditOutlined } from "@ant-design/icons";
import GbTable from "@/components/GbTable";
import dayjs from "dayjs";
import { Avatar, message } from "antd";
import EmployeeGrp from "../../../../../assets/images/employeegrp.png";
import NumberOfOffice from "../../../../../assets/images/number_of_office.png";
import NumberOfdepartment from "../../../../../assets/images/number_of_department.png";
import NewJoining from "../../../../../assets/images/new_joining.png";
import Probhition from "../../../../../assets/images/probhition.png";
import { useRouter } from "next/navigation";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/api/usersApi";
import HrmEmployeeCard from "../../_component/HrmEmployeeCard";
import { toast } from "react-toastify";
import GBconfirmModal from "@/components/ui/GbConfirmModal";
import { useRef, useState } from "react";
import { useGetAllDepartmentQuery } from "@/redux/api/departmentApi";
import { useGetAllOfficeQuery } from "@/redux/api/officeApi";

const HrmProfile = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchTerm,setSearchTerm]=useState('')
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  query['page']=page
  query['limit']=size
  query['searchTerm']=searchTerm
  const {data}=useGetAllUsersQuery(query)
  const {data:probhitionData}=useGetAllUsersQuery({employmentStatus:"probation"})
  const {data:departmentData}=useGetAllDepartmentQuery(undefined)
  const {data:officeData}=useGetAllOfficeQuery(undefined)

  
  const [deleteHandler]=useDeleteUserMutation()
  const userData=data?.data
  const meta=data?.meta
    const router=useRouter()
    const tableColumn = [
        {
          key:52345,
          title: "sl",
          //@ts-ignore
          render: (text, record, index) => index + 1,
        },
        {
          title: "Name",
          key: 122334,
          render: function (text: any,record:any) {
            return (
              <h1 className="text-[#343434] text-[14px] font-[500]">{record?.name}</h1>
            );
          },
        },
        {
          title: "User Id",
          key: 1234,
          render: function (text: any,record:any) {
            return (
              <h1 className="text-[#343434] text-[14px] font-[500]">{record?.employeeId}</h1>
            );
          },
        },
        // {
        //   title: "Role",
        //   key: 12233234,
        //   render: function (text: any,record:any) {
        //     return (
        //       <h1 className="text-[#343434] text-[14px] font-[500]">{record?.user?.role}</h1>
        //     );
        //   },
        // },
        {
          title: "Department",
          render: function (text: any,record:any) {
            return (
              <h1 className="text-[#A2A2A2] text-[14px] font-[500]">{record?.department?.name}</h1>
            );
          },
          key: 2234,
        },
        {
          title: "Designation",
          render: function (text: any,record:any) {
            return (
              <h1 className="text-[#343434] text-[14px] font-[500]">{record?.designation}</h1>
            );
          },
          key: 22324,
        },
        {
          title: "Employment status",
          key: 22324,
          render: function (text: any,record:any) {
            return (
              <h1 className={`${record?.employmentStatus?.toLowerCase()==="permanent"?" text-[#00A438]":"text-[#EB2B2B]"} text-[10px] font-[500] px-[10px] py-[4px] ${record?.employmentStatus?.toLowerCase()==="permanent"?"bg-[#CCEDD7]":"bg-[#FBD5D5]"} rounded-[30px] w-fit`}>{record?.employmentStatus}</h1>
            );
          },
        },
        {
          title: "Date of joining",
          render: function (_:any,record: any) {
            return <h1 className="text-[#A2A2A2] text-[14px] font-[500]">{dayjs(record?.employee?.joiningDate).format("D MMM YYYY")}</h1>
          },
          key: 12,
        },
        {
          title: "Action",
          align:"end",
          dataIndex: "title",
          key: 323243,
          // @ts-ignore
          render:function(text,record){
            return (
              <div className="flex justify-end gap-[10px] text-[14px] font-[500]">
              {/* <EditOutlined 

                style={{ fontSize: "18px", cursor: "pointer" }}
              /> */}
              <i
              
              onClick={()=>GBconfirmModal(deleteHandler,record?.employeeId,()=>{
                message.success("User deleted successfully");
              })}             
              className="ri-delete-bin-line text-[18px] cursor-pointer"></i>
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
      <GbHeader title="HRM Dashboard" />
      <div className="flex justify-between items-center">
     <h1 className="box_title mb-[20px]">Overview </h1>
      <button
          className="cm_button text-[12px]  px-[30px]"
          onClick={()=>router.push('/employee/hrm-dashboard/add-employee')}
        >
          {" "}
          <i className="ri-upload-2-line mr-2"></i>
          Add Employee
        </button>
     </div>
     <section className="employee_card_section grid grid-cols-4 gap-[20px] my-[30px]">
       <HrmEmployeeCard img={EmployeeGrp} title="Total employee" total={`${meta?.total} people`} bg_color="rgba(206, 202, 252, 1)"> 
       <Avatar.Group
          maxCount={5}
          size={"small"}
          maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf",marginBottom:"20px" }}
        >
          {
           [...Array(meta?.total).keys()].map(item=>(
            <Avatar key={item} src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" />
           ))
          }

         
      
        </Avatar.Group>
       </HrmEmployeeCard>
       <HrmEmployeeCard img={NumberOfOffice} title="Number of office " total={`${officeData?.data?.length} offices`} bg_color="rgba(214, 237, 253, 1)"/>
       <HrmEmployeeCard img={NumberOfdepartment} total={`${departmentData?.data?.length} department`} title="Number of department" bg_color="rgba(206, 249, 236, 1)"/>
       {/* <HrmEmployeeCard img={NewJoining} title="New joined" bg_color="rgba(233, 254, 207, 1)" /> */}
       <HrmEmployeeCard img={Probhition} total={`${probhitionData?.meta?.total} people`} title="Probation period employee " bg_color="rgba(252, 227, 248, 1)"/>
     </section>
     <h1 className="box_title">Employee Information</h1>
     <div className="flex justify-between items-center">
      <div className="my-[12px]">
      <input ref={searchRef} placeholder="Search user" type="text" className="min-w-[400px] outline-none py-[8px] px-[20px] rounded-[4px] me-2"  />
      <button 
         onClick={()=>{
          if(searchRef?.current?.value){
            setSearchTerm(searchRef?.current?.value)
            setPage(1)
          }else{
            setSearchTerm('')
          }
         }}
          className="cm_button text-[12px]  px-[30px]"
        >
          Search
        </button>
        </div>
      {/* <button
          className="cm_button text-[12px]  px-[30px]"
        >
          {" "}
          <i className="ri-filter-2-line mr-2"></i>
          Filter
        </button> */}
     </div>
      <div className="">
      <GbTable showPagination={true} onPaginationChange={onPaginationChange}   totalPages={meta?.total} pageSize={10} columns={tableColumn} dataSource={userData} />
      </div>
    </div>
  );
};

export default HrmProfile;
