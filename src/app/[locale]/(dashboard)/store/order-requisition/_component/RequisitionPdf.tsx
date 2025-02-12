"use client"
import GbPrintPdfButton from '@/components/ui/GbPrintPdfButton';
import { useGetSinglerequistionQuery } from '@/redux/api/requisitionApi';
import { useParams } from 'next/navigation';
import React, { useRef } from 'react';

const RequisitionPdf = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const params=useParams()
    const {data,isLoading}=useGetSinglerequistionQuery({id:params?.id})
    const requisitionData=data?.data 
    let allProductData:any=[]
     requisitionData?.orders?.forEach((item:any)=>{
        item?.order_info?.forEach((dt:any)=>{
           const isProductExist=allProductData?.find((ap:any)=>ap.productId===dt.productId)
          if(isProductExist){
            isProductExist.quantity=isProductExist?.quantity+dt?.productQuantity
            const remaining=allProductData.filter((af:any)=>af.productId !==dt?.productId)
            allProductData=[...remaining,isProductExist]
          }else{

              allProductData.push({
                  productId:dt?.productId,
                  quantity:dt?.productQuantity,
                  name:dt?.productNameEn,
                })
            }
        })
    })

    return (
        <>
            <div className='w-fit mx-auto'>
               <GbPrintPdfButton componentRef={componentRef} />
                <div ref={componentRef} className='w-[890px] mx-auto p-[70px]'>
                    <div>
                        <h1 className='text-[#000000] font-[500] text-[22px] text-center mb-[50px]'>Product Packing Requisition</h1>
                        <div className='flex items-start justify-between'>
                            <div>
                                <p className='text-[#000000] text-[16px] font-[500] mb-[6px]'>Total Number Of Order: {requisitionData?.orders?.length}</p>
                                {/* <div className='flex items-start gap-[40px]'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span className='rq_table_cm_data'>Paid</span></td>
                                                <td><span className='rq_table_cm_data px-3'>:</span></td>
                                                <td><span className='rq_table_cm_data'>18</span></td>
                                            </tr>
                                            <tr>
                                                <td><span className='rq_table_cm_data'>Partial</span></td>
                                                <td><span className='rq_table_cm_data px-3'>:</span></td>
                                                <td><span className='rq_table_cm_data'>18</span></td>
                                            </tr>
                                            <tr>
                                                <td><span className='rq_table_cm_data'>Pending</span></td>
                                                <td><span className='rq_table_cm_data px-3'>:</span></td>
                                                <td><span className='rq_table_cm_data'>18</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span className='rq_table_cm_data'>Regular</span></td>
                                                <td><span className='rq_table_cm_data px-3'>:</span></td>
                                                <td><span className='rq_table_cm_data'>18</span></td>
                                            </tr>
                                            <tr>
                                                <td><span className='rq_table_cm_data'>Express</span></td>
                                                <td><span className='rq_table_cm_data px-3'>:</span></td>
                                                <td><span className='rq_table_cm_data'>18</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> */}
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><span className='rq_table_cm_data'>Req No</span></td>
                                        <td><span className='rq_table_cm_data px-3'>:</span></td>
                                        <td><span className='rq_table_cm_data'>{requisitionData?.id}</span></td>
                                    </tr>
                                    {/* <tr>
                                        <td><span className='rq_table_cm_data'>Delivery Point</span></td>
                                        <td><span className='rq_table_cm_data px-3'>:</span></td>
                                        <td><span className='rq_table_cm_data'>Warehouse 01</span></td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        {/* requisition table */}
                        <div className='requisition_table mt-[10px]'>
                            <table>
                                <thead>
                                    <tr>
                                        {/* <th><span>Product Name with Pack size</span></th> */}
                                        <th><span>Product Name</span></th>
                                        <th className='w-[300px]'>Shelf No.</th>
                                        <th className='text-start'>Barcode</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProductData?.map((item:{quantity:number,name:string},i:number) => (
                                        <tr key={i}>
                                            <td className='text-nowrap'>{i + 1}. {item?.name}</td>
                                            <td className='text-center'>15</td>
                                            <td>GB123654</td>
                                            <td className='text-center'>{item?.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RequisitionPdf;
