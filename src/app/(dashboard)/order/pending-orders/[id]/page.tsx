"use client";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Avatar, Input, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TagImage from "../../../../../assets/images/icons/tags.png";
import Image from "next/image";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import ProductInfoTable from "../../order-submission/_subComponent/ProductInfoTable";
import AvatarImage from "../../../../../assets/images/icons/avatar.png";
import OrderSummary from "./_component/OrderSummary";
import BillerReceiverInfo from "./_component/BillerReceiverInfo";
import FilterImage from '../../../../../assets/images/icons/filter_icon.png'
import { useEffect, useMemo, useState } from "react";
import FilterForm from "./_component/FilterForm";
import GbModal from "@/components/ui/GbModal";
import AddIssue from "./_component/AddIssue";
import SendSms from "./_component/SendSms";
import AddRequest from "./_component/AddRequest";
import { useApprovedOrderMutation, useGetAllOrderStatusQuery, useGetOrderByIdQuery } from "@/redux/api/orderApi";
import AddProduct from "../../order-submission/_subComponent/AddProduct";
import { toast } from "react-toastify";
import { getUserInfo } from "@/service/authService";
const Page = (props: any) => {
  const userInfo:any=getUserInfo()
  const [productData,setProductData]=useState([])
  const {data,isLoading}=useGetOrderByIdQuery({id:props?.params?.id})
  const {data:orderStatus}=useGetAllOrderStatusQuery({id:props?.params?.id})
  const [approvedOrderHandler]=useApprovedOrderMutation()
  const [activeFilterForm,setActiveFilterForm]=useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const formSubmit = async (formData: any) => {
   try {
   const payload={...data}
   payload['orderStatus']=Number(formData['orderStatus']?.value)
   payload['shippingAddressDivision']=formData['shippingAddressDivision']?.label
   payload['shippingAddressDistrict']=formData['shippingAddressDistrict']?.label
   payload['shippingAddressThana']=formData['shippingAddressThana']?.label
   payload['paymentMethods']=formData['payment_method']?.value
   payload['employeeId']="10193"
  //  payload['employeeId']=userInfo?.employeeId
   payload['orderStatus']={
    name:formData['orderStatus']?.label,
    value:formData['orderStatus']?.value,
   }
   if(formData?.newDeliveryCharge){
    payload["deliveryCharge"]=formData?.newDeliveryCharge
   }
   payload['orderStatusValue']=formData['orderStatus']?.value
   payload['isApprove']=true
   const modifyProductData = productData.map((item:any) => ({
    ...item,
    orderId: data?.id
  }));
   payload['totalPurchaseAmount']=productData.reduce((acc:any, order:any) => acc + order.subTotal, 0);

   payload['orderDetails']=modifyProductData
    const res=await approvedOrderHandler({id:payload.id,data:payload})
     if(res){
      toast.success('Order update successfully...',{
        position:"top-center"
      })
     }
   } catch (error) {
     message.error("Something went wrong")
   }
  };
  useMemo(()=>{setProductData(data?.order_info)},[data])
  return (
    <div>
      <GbHeader title="Order Details" />
      <GbForm submitHandler={formSubmit} defaultValues={{
        orderStatus:{
          label:data?.orderStatus?.name,
          value:data?.orderStatus?.value
        },
        orderFrom:data?.orderFrom,
        shippingAddressDistrict:{
          label:data?.shippingAddressDistrict,
          value:data?.shippingAddressDistrict
        },
        shippingAddressDivision:{
          label:data?.shippingAddressDivision,
          value:data?.shippingAddressDivision
        },
        shippingAddressThana:{
          label:data?.shippingAddressThana,
          value:data?.shippingAddressThana
        },
        payment_method:{
          label:data?.last_transaction?.paymentMethods,
          value:data?.last_transaction?.paymentMethods
        },
      }}>
        <section className="grid grid-cols-4 gap-[16px]">
          <div className="col-span-3">
           {/* <div className="flex items-center gap-[12px] mb-[16px]">
           <div className="sdw_box p-[8px]  flex-1 px-[20px]  flex items-center">
              <SearchOutlined style={{ fontSize: "20px", color: "#BCBCBC" }} />
              <Input
                style={{
                  borderRadius: "4px",
                  outline: "none",
                  fontSize: "16px",
                  fontWeight: "400",
                  border: "none",
                }}
                placeholder={
                  "Search by Order Number/ Delivery, Shipping Phone Number or Email Address"
                }
              />
              <div className="flex items-center gap-2">
                <Image width={24} alt="" src={TagImage} />
                <p className="text-[#7D7D7D] text-[14px] font-[400]">Tags</p>
              </div>
            </div>
            <div onClick={()=>setActiveFilterForm(!activeFilterForm)} className="sdw_box w-fit cursor-pointer">
              <Image width={16} alt="" src={FilterImage} />
            </div>
           </div> */}
            {/* <div className={`${activeFilterForm?"h-fit":"h-[0px] overflow-hidden"} duration-300 mb-[12px]`}>
            <FilterForm />
            </div> */}
             <div className="sdw_box mb-[12px]">
              <h1 className="font-[700] text-[20px] text-[#343434] mb-[20px]">
                {data?.orderNumber}
              </h1>

              <div className="grid grid-cols-3 gap-[20px]">
                {/* <div className="">
                  <GbFormInput
                    name="request"
                    label="Request"
                    placeholder="None"
                  />
                </div>
                <div className="">
                  <GbFormInput
                    name="issue_status"
                    label="Issue Status"
                    placeholder="None"
                  />
                </div> */}
                <div className="">
                  {" "}
                  <GbFormInput
                    name="order_date"
                    label="Order date"
                    placeholder="Feb 2, 2023 "
                  />
                </div>
                <div className="">
                  {" "}
                  <GbFormSelect 
                  // defaultValue={{label:data?.orderStatus,value:data?.orderStatus}}
                    name="orderStatus"
                    label="Order Status"
                    options={orderStatus?.map((item:any)=>{return{label:item?.name,value:item?.value}})}
                  />
                </div>
                {/* <div className="">
                  {" "}
                  <GbFormInput
                    name="expected_delivery_date"
                    label="Expected delivery date"
                    type="date"
                  />
                </div> */}
                {/* <div className="">
                  {" "}
                  <GbFormSelect
                    name="order_type"
                    label="Order type"
                    options={[
                      {
                        label: "Regular",
                        value: "Regular",
                      },
                      {
                        label: "Call Order",
                        value: "Call Order",
                      },
                      {
                        label: "Pre-Order",
                        value: "Pre-Order",
                      },
                    ]}
                  />
                </div> */}
                <div className="">
                  {" "}
                  <GbFormInput disabled={true} name="orderFrom" label="Order from" />
                </div>
                {/* <div className="">
                  {" "}
                  <GbFormInput name="manage_order" label="Manage Order" />
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-[12px]">
              <div className="col-span-8">
                {/* product info */}
                <div className="sdw_box mb-[16px]">
                  <div className=" flex justify-between">
                    <h1 className="box_title">Product info</h1>
                    <button type="button" onClick={()=>setIsProductModalOpen(true)} className="cm_button text-[12px]  py-[6px] font-bold mb-2">
                      {" "}
                      <PlusOutlined className="me-[5px]" />
                      Add more item
                    </button>
                    <GbModal isModalOpen={isProductModalOpen} openModal={()=>setIsProductModalOpen(true)} closeModal={()=>setIsProductModalOpen(false)}> 
                              <AddProduct orderId={props?.params?.id} setProductData={setProductData} productData={productData} setIsModalOpen={setIsProductModalOpen} />
                     </GbModal>
                  </div>

                  {/* product info table  */}
                  <ProductInfoTable isShow={false} productData={productData} setProductData={setProductData} />
                </div>
{/* 
                <div className="sdw_box mb-[16px]">
                  <p className="mb-[8px] items-center flex gap-[12px]">
                    <span className="text-[#343434] text-[12px] font-[600]">
                      {" "}
                      Comment
                    </span>
                    <span onClick={()=>setIsSmsModalOpen(true)} className="text-[#7D7D7D] text-[12px] font-[600] cursor-pointer">
                      Send SMS
                    </span>
                     <GbModal width="350px" isModalOpen={isSmsModalOpen} openModal={()=>setIsSmsModalOpen(true)} closeModal={()=>setIsSmsModalOpen(false)}> 
                           <SendSms />
                      </GbModal>

                    <span onClick={()=>setIsModalOpen(true)} className="text-[#7D7D7D] text-[12px] font-[600] cursor-pointer flex items-center gap-1">
                      <i className="ri-add-circle-line text-[18px] text-[#7D7D7D]"></i>
                      Add Issue
                    </span>
                        <GbModal width="350px" isModalOpen={isModalOpen} openModal={()=>setIsModalOpen(true)} closeModal={()=>setIsModalOpen(false)}> 
                           <AddIssue />
                            </GbModal>
                    <span onClick={()=>setIsRequestModalOpen(true)} className="text-[#7D7D7D] text-[12px] font-[600] cursor-pointer flex items-center gap-1">
                      <i className="ri-add-circle-line text-[18px] text-[#7D7D7D]"></i>
                      Add Request
                    </span>
                      <GbModal width="350px" isModalOpen={isRequestModalOpen} openModal={()=>setIsRequestModalOpen(true)} closeModal={()=>setIsRequestModalOpen(false)}> 
                           <AddRequest />
                            </GbModal>
                  </p>
                  <div className="flex gap-2">
                    <Avatar
                      src
                      size={39}
                      icon={<Image src={AvatarImage} alt="" width={39} />}
                    />
                    <GbFormInput
                      placeholder="Write a comment..."
                      name="comment"
                    />
                  </div>
                </div> */}
                {/* <div className="sdw_box mb-[16px]">
                  <div className="flex items-center gap-2">
                    <Image src={AvatarImage} alt="" width={48} height={48} />
                    <div>
                      <h1 className="text-[#343434] font-[500] text-[12px] mb-[4px]">
                        Tareq Mahmud{" "}
                        <span className="text-[#7D7D7D] ml-[12px]">23h</span>
                      </h1>
                      <h1 className="text-[#343434] font-[400] text-[12px]">
                        Customer k bar bar call kora hoiche uni call receive
                        kore na
                      </h1>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="col-span-4">
                <OrderSummary data={data} productData={productData} />
                <div className="flex gap-[12px] justify-end">
                  {/* <button className="text-[#FFFFFF] font-[500] text-[14px] px-[24px] py-[8px] bg-[#EB2B2B] rounded-[5px]">
                    Cancel
                  </button>
                  <button className="text-[#FFFFFF] font-[500] text-[14px] px-[24px] py-[8px] bg-[#4E9EFC] rounded-[5px]">
                    Edit
                  </button> */}
                  <button className="text-[#FFFFFF] font-[500] text-[14px] px-[24px] py-[8px] bg-[#4ACC58] rounded-[5px]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 ">
            <BillerReceiverInfo data={data} />
          </div>
        </section>
      </GbForm>
    </div>
  );
};

export default Page;
