"use client"
import GbForm from '@/components/forms/GbForm';
import GbFormInput from '@/components/forms/GbFormInput';
import GbFormSelect from '@/components/forms/GbFormSelect';
import GbHeader from '@/components/ui/dashboard/GbHeader';
import { Avatar, Col, Input, message, Row } from 'antd';
import AvatarImage from '../../../../assets/images/icons/avatar.png'
import {
    PlusOutlined,
    PlusCircleOutlined,
    SearchOutlined
} from "@ant-design/icons";
import Image from 'next/image';
import CustomerOverview from './_subComponent/CustomerOverview';
import OrderOverview from './_subComponent/OrderOverview';
import { useState } from 'react';
import GbModal from '@/components/ui/GbModal';
import AddProduct from './_subComponent/AddProduct';
import ProductInfoTable from './_subComponent/ProductInfoTable';
import { yupResolver } from '@hookform/resolvers/yup';
import { orderSubmissionValidation } from '@/schema/schema';
import ContactInfo from './_subComponent/ContactInfo';
import AddProductVtwo from './_subComponent/AddProductVtwo';
import { useGetAllDistrictQuery } from '@/redux/api/locationApi';
import { useGetAllDivisionQuery } from '@/redux/api/divisionsApi';
import OrderSubmissionProductInfoTable from './_subComponent/OrderSubmissionProductInfoTable';
import { useCreateOrderMutation } from '@/redux/api/orderApi';

const Page = () => {
    const [handleSubmitOrder]=useCreateOrderMutation()
    const [productData, setProductData] = useState([])
    const [overview, setOverView] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const submitForm = async (data: any) => {
        try {
            if(!data?.isSameAsBillingAddress){
              data.receiverName=data?.customerName
              data.receiverPhoneNumber=data?.customerPhoneNumber
              data.receiverAdditionalPhoneNumber=data?.customerAdditionalPhoneNumber
              data.shippingAddressTextArea=data?.billingAddressTextArea
              data.shippingAddressDivision=data?.billingAddressDivision?.label
              data.shippingAddressDistrict=data?.billingAddressDistrict?.label
              data.shippingAddressThana=data?.billingAddressThana?.label
            }else{
                data.shippingAddressDivision=data?.shippingAddressDivision?.label
                data.shippingAddressDistrict=data?.shippingAddressDistrict?.label
                data.shippingAddressThana=data?.shippingAddressThana?.label
            }

            if(data?.probashi){
                data.customerName=data?.probashi_name
                data.customerPhoneNumber=data?.probashi_number
                data.customerAdditionalPhoneNumber=data?.probashi_additional_number
                data.billingAddressTextArea=data?.probashi_address
            }
            const payload={
                ...data,
                orderDetails:productData,
                billingAddressDivision:data?.billingAddressDivision?.label,
                billingAddressDistrict:data?.billingAddressDistrict?.label,
                billingAddressThana:data?.billingAddressThana?.label,
                delivery_type:data?.delivery_type?.label,
                orderFrom:data?.orderFrom?.label,
            }


           const res=await handleSubmitOrder(payload) 
           if(res){
            message.success('Order placed successfully...')
           }
        } catch (error) {
             console.log(error);
        }
    }

    return (
        <div>
            <GbHeader title={"Order Submission"} />
            <GbForm submitHandler={submitForm} resolver={yupResolver(orderSubmissionValidation)}>
            <Row gutter={{ md: 12, sm: 4, lg: 40 }}>
                <Col md={14} sm={24}>
                    <div className='sdw_box p-[8px] px-[20px] mb-[16px] flex'>
                        <SearchOutlined style={{ fontSize: "20px", color: "#BCBCBC" }} />
                        <Input
                            style={{ borderRadius: "4px", outline: "none", fontSize: "16px", fontWeight: "400", border: "none" }}
                            placeholder={"Search by number or order id"}
                        />
                    </div>
                   
                        {/* customer info */}
                        <ContactInfo />

                        {/* product info */}
                        <div className='sdw_box mb-[16px]'>
                            {/* <div className=' flex justify-between'>
                                <h1 className='box_title'>Product info</h1>
                                <button type='button' onClick={() => setIsModalOpen(true)} className='cm_button'> <PlusOutlined className='me-[5px]' />Add product</button>
                                <GbModal isModalOpen={isModalOpen} openModal={() => setIsModalOpen(true)} closeModal={() => setIsModalOpen(false)}> */}
                                    {/* here order id is static */}
                                    {/* <AddProduct orderId={1} productData={productData} setProductData={setProductData} setIsModalOpen={setIsModalOpen} />
                                </GbModal>
                            </div> */}


                            {/* product info table  */}
                            {/* <ProductInfoTable productData={productData} setProductData={setProductData} /> */}
                            <OrderSubmissionProductInfoTable productData={productData} setProductData={setProductData} />

                        </div>

                        {/* Order info */}
                        <div className='sdw_box mb-[16px]'>
                            <h1 className='box_title mb-[20px]'>Order info</h1>

                            <Row gutter={12}>
                                <Col md={8} className='mb-[12px]'>
                                    <GbFormSelect options={[
                                        {
                                            label:"Facebook",
                                            value:"Facebook"
                                        },
                                        {
                                            label:"Whatsapp",
                                            value:"Whatsapp"
                                        },
                                    ]} name='orderFrom' placeholder='Order Source' />
                                </Col>

                                <Col md={8} className='mb-[12px]'>
                                    <GbFormSelect
                                        options={[
                                            {
                                                label: "Regular",
                                                value: "Regular"
                                            },
                                            {
                                                label: "Phone Call",
                                                value: "Phone Call"
                                            },
                                            {
                                                label: "Pending",
                                                value: "Pending"
                                            },
                                            {
                                                label: "Pending",
                                                value: "Pending"
                                            },
                                        ]}
                                        name='order_type' placeholder='Order type' />
                                </Col>
                                <Col md={8} className='mb-[12px]'>
                                    <GbFormInput name='marge_order' placeholder='Marge Order' />
                                </Col>
                            </Row>
                        </div>
                        {/* Logistic  info */}
                        <div className='sdw_box mb-[16px]'>
                            <h1 className='box_title mb-[20px]'>Logistic info</h1>

                            <Row gutter={12}>

                                <Col md={8} className='mb-[12px]'>
                                    <GbFormSelect
                                        options={[
                                            {
                                                label: "Regular",
                                                value: "Regular"
                                            },
                                            {
                                                label: "Express",
                                                value: "Express"
                                            },
                                        ]}
                                        name='delivery_type' placeholder='Delivery type' />
                                </Col>
                                <Col md={8} className='mb-[12px]'>
                                    <GbFormSelect options={[
                                        {
                                            label:"SteadFast",
                                            value:"SteadFast"
                                        },
                                        {
                                            label:"eCurier",
                                            value:"eCurier"
                                        },
                                        {
                                            label:"Hourse eCurier",
                                            value:"Hourse eCurier"
                                        },
                                        {
                                            label:"Office Delivery",
                                            value:"Office Delivery"
                                        },
                                    ]} name='currier' placeholder='Currier' />
                                </Col>
                                <Col md={8} className='mb-[12px]'>
                                    <GbFormInput name='del_charge' placeholder='Del charge' />
                                </Col>
                            </Row>
                        </div>
                        {/* Payment  info */}
                        <div className='sdw_box mb-[16px]'>
                            <h1 className='box_title mb-[20px]'>Payment info</h1>

                            <Row gutter={12}>

                                <Col md={8} className='mb-[12px]'>
                                    <GbFormSelect
                                        options={[
                                            {
                                                label: "Cash On Delivery",
                                                value: "Cash On Delivery"
                                            }
                                        ]}
                                        name='paymentMethods' placeholder='Payment type' />
                                </Col>
                            </Row>
                        </div>
                        {/* Expected delivery date */}
                        <div className='sdw_box mb-[16px]'>
                            <h1 className='box_title mb-[20px]'>Expected Delivery Date</h1>
                            <span className='cursor-pointer'><PlusCircleOutlined /><span className='text-[#7D7D7D] text-[12px] font-[400]'> Add delivery date</span></span>
                        </div>
                        {/* Comment section  */}
                        <div className='sdw_box mb-[16px]'>
                            <p className='mb-[8px]'><span className='text-[#343434] text-[12px] font-[600]'> Comment</span>
                                <span className='text-[#7D7D7D] text-[12px] font-[600]'> SMS</span></p>
                            <div className='flex gap-2'>
                                <Avatar src size={39} icon={<Image src={AvatarImage} alt='' width={39} />} />
                                <GbFormInput placeholder='Write a comment...' name='comment' />
                            </div>
                        </div>
                        <div className='flex justify-end gap-[12px]'>
                            <button className="cm_button_outlined">Reset Order</button>
                            <button className="cm_button">Save Order</button>
                        </div>
                    

                </Col>


                <Col md={10} sm={24}>
                {/* add product  */}
                <AddProductVtwo  productData={productData} setProductData={setProductData} setIsModalOpen={setIsModalOpen} />
                    <Row gutter={10}>
                        <Col md={12}>
                            <h1 onClick={() => setOverView(1)} className={`box_title   cursor-pointer font-[500] text-[16px] mb-[16px] sdw_box p-[12px] text-center ${overview == 1 && "active_button"}`}>Customer overview</h1>
                        </Col>
                        <Col md={12}>
                            <h1 onClick={() => setOverView(2)} className={`box_title   cursor-pointer font-[500] text-[16px] mb-[16px] sdw_box p-[12px] text-center ${overview == 2 && "active_button"}`}>Order overview</h1>
                        </Col>

                    </Row>
                    {
                        overview === 1 && <CustomerOverview /> || overview === 2 && <OrderOverview />
                    }

                </Col>
            </Row>
            </GbForm>
        </div>
    );
};

export default Page;