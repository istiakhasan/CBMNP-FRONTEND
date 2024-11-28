import moment from 'moment';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ExpandOrder from './ExpandOrder';

const FormWraper = ({i,item,productData,setProductData,derivateData,expand,setExpand}:any) => {
    
    return (
        <div>
        <div className={`${expand === i || derivateData === "1" ? "hidden" : ""} flex gap-[40px] mb-[12px]`}>
            <div className='sdw_box flex-[1]'>
                <div className='grid grid-cols-4'>
                    <div>
                        <p className='text-[12px] text-[#A2A2A2] mb-[6px]'><strong className='text-[#343434] font-[500] mr-[8px]'>Order id</strong>{moment(item?.created_at).format('MMM D,YYYY')}</p>
                        <p className='text-[20px] text-[#343434] font-[600] mb-[6px]'>{item?.orderNumber}</p>
                        <p className='text-[12px] text-[#f48c13]'>{item?.orderStatus?.name}</p>
                    </div>
                    <div className='flex items-center justify-center flex-col'>
                        <p className='text-[12px] text-[#A2A2A2] mb-[6px]'>Order from</p>
                        <p className='text-[12px] text-[#343434] font-[600] mb-[6px]'>{item?.orderFrom}</p>
                        <p className='text-[12px] text-[#343434] font-[500] mb-[6px]'>Payment status: {item?.transation_info[0]?.paymentMethods}</p>
                    </div>
                    <div className='flex items-center justify-center flex-col'>
                        <p className='text-[32px] text-[#f48c13] font-bold mb-[6px]'>{item?.order_info?.length}</p>
                        <p className='text-[12px] text-[#A2A2A2] mb-[6px]'>Number of item</p>
                    </div>
                    <div className='flex items-end justify-center flex-col'>
                        <div className='flex'>
                            <span className='text-[#000000] text-[14px] font-[500]  mb-[8px]'>৳</span>
                            <p className='text-[32px] text-[#000000] font-bold mb-[6px]'>{item?.transation_info[0]?.totalPurchesAmount}</p>
                            <span className='text-[#A2A2A2] text-[10px] font-[400] mt-auto ml-[4px] mb-[8px]'>BTD</span></div>
                        <button onClick={() => setExpand(i)} type='button' className='bg-[#f48c13] text-[12px] font-[500] px-[20px] py-[8px] rounded-[5px] text-[#FFFFFF]'>View details</button>
                    </div>
                </div>
            </div>
            <div className='sdw_box w-[342px]'>
                <div className='flex justify-between'>
                    <p className='text-[12px] text-[#A2A2A2] mb-[6px]'><strong className='text-[#343434] font-bold mr-[8px]'>Biller</strong></p>
                    <p className='text-[12px] text-[#A2A2A2] mb-[6px]'>Receiver<strong className='text-[#343434] font-[500] ml-[8px]'>{item?.receiverPhoneNumber || "--"}</strong></p>
                </div>
                <p className='text-[#343434] font-[500] mr-[8px]'>{item?.customerName || "--"}</p>
                {/* <p className='text-[#A2A2A2] text-[12px] font-[400]'>12/1 Ulon Road, Poschim Rampura, Dhaka 1215</p> */}
                <p className='text-[#A2A2A2] text-[12px] font-[400]'>{item?.billingAddressTextArea || "--"}</p>
                <p className='text-[#A2A2A2] text-[12px] font-[400]'>{item?.customerPhoneNumber || "--"}</p>
            </div>
        </div>
        <div className={`${expand === i || derivateData === "1" ? "" : "hidden"}`}>
            <ExpandOrder item={item} productData={productData} setProductData={setProductData} />
        </div>
    </div>
    );
};

export default FormWraper;