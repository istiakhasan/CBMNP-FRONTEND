import GbTable from '@/components/GbTable';
import { useGetProcurementQuery } from '@/redux/api/procurementApi';
import { Checkbox, CheckboxOptionType, Pagination, Popover, TableProps } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const OrderList = () => {
      const [page, setPage] = useState<number>(1);
      const [size, setSize] = useState<number>(10);
      const [searchTerm, setSearchTerm] = useState("");
      const [open, setOpen] = useState(false);
      const [selectedOrders, setSelectedOrders] = useState<any>([]);
    const {data,isLoading}=useGetProcurementQuery({
        page,
        size,
        searchTerm
    });
 
    const tableColumns=[
        {
            title:"Sl",
            key:"1",
            render:(a:any,b:any,i:any)=>{
                const sl=(page*size-size)+(i+1)
                return <span>{sl}</span>
            }
        },
        {
            title:"Date",
            key:"2",
            render:(a:any,record:any,i:any)=>{
                return <span>{moment(record?.createdAt).format('YYYY-MMMM-DD')}</span>
            }
        },
        {
            title:"Invoice Number",
            key:"12",
            render:(a:any,record:any,i:any)=>{
                return <span className='text-primary'>{record?.invoiceNumber}</span>
            }
        },
        {
            title:"Supplier",
            key:"3",
            render:(a:any,record:any,i:any)=>{
                return <span>{record?.supplier?.contactPerson}</span>
            }
        },
        // {
        //     title:"Order By",
        //     key:"4",
        //     render:(a:any,b:any,i:any)=>{
        //         return <span>{i+1}</span>
        //     }
        // },
        {
            title:"Amount",
            key:"5",
            render:(a:any,b:any,i:any)=>{
                return <span>{b?.billAmount}</span>
            }
        },
        {
            title: "Action",
            key: "action",
            width: "60px",
            render: (text: string, record: any) => {
              return (
                <>
                  {
                    <span
                      className=" text-white text-[10px] py-[2px] px-[10px] cursor-pointer"
                    >
                      <i
                        style={{ fontSize: "18px" }}
                        className="ri-eye-fill color_primary"
                      ></i>
                    </span>
                  }
                </>
              );
            },
          },
       ]

         const defaultCheckedList = tableColumns.map((item: any) => item.key as string);
         const [checkedList, setCheckedList] = useState(defaultCheckedList);
         const newColumns = tableColumns.map((item: any) => ({
           ...item,
           hidden: !checkedList.includes(item.key as string),
         }));
         const handleOpenChange = (newOpen: boolean) => {
           setOpen(newOpen);
         };
         const options = tableColumns.map(({ key, title }) => ({
           label: title,
           value: key,
         }));
             const rowSelection: TableProps<any>["rowSelection"] = {
               onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                 setSelectedOrders(selectedRows);
               },
               getCheckboxProps: (record: any) => ({
                 disabled: record.name === "Disabled User",
                 name: record.name,
               }),
             };
    return (
        <div>
           {/* <GbTable dataSource={data?.data} columns={[
            {
                title:"Sl",
                key:"1",
                render:(a:any,b:any,i:any)=>{
                    return <span>{i+1}</span>
                }
            },
            {
                title:"Date",
                key:"2",
                render:(a:any,record:any,i:any)=>{
                    return <span>{moment(record?.createdAt).format('YYYY-MMMM-DD')}</span>
                }
            },
            {
                title:"Invoice Number",
                key:"12",
                render:(a:any,record:any,i:any)=>{
                    return <span className='text-primary'>{record?.invoiceNumber}</span>
                }
            },
            {
                title:"Supplier",
                key:"3",
                render:(a:any,record:any,i:any)=>{
                    return <span>{record?.supplier?.contactPerson}</span>
                }
            },
            // {
            //     title:"Order By",
            //     key:"4",
            //     render:(a:any,b:any,i:any)=>{
            //         return <span>{i+1}</span>
            //     }
            // },
            {
                title:"Amount",
                key:"5",
                render:(a:any,b:any,i:any)=>{
                    return <span>{b?.billAmount}</span>
                }
            },
            {
                title: "Action",
                key: "action",
                width: "60px",
                render: (text: string, record: any) => {
                  return (
                    <>
                      {
                        <span
                          className=" text-white text-[10px] py-[2px] px-[10px] cursor-pointer"
                        >
                          <i
                            style={{ fontSize: "18px" }}
                            className="ri-eye-fill color_primary"
                          ></i>
                        </span>
                      }
                    </>
                  );
                },
              },
           ]} />  */}


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
                   <div className="flex gap-3">
                     <Pagination
                       pageSize={size}
                       total={data?.meta?.total}
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
                     columns={newColumns}
                     dataSource={data?.data}
                     rowSelection={rowSelection}
                   />
                 </div>
                 {/* <GbModal width="600px" clseTab={false} isModalOpen={statuschangedModal} openModal={()=>setStatusChangeModal(true)} closeModal={()=>setStatusChangeModal(false)}>
                   <GbForm submitHandler={(data:any)=>console.log(data)}>
                   <BulkChangeOrders status="Hold" setModalOpen={setStatusChangeModal} selectedOrders={selectedOrders}/>
                   </GbForm>
                 </GbModal> */}
               </div>
        </div>
    );
};

export default OrderList;