import copyToClipboard from "@/components/ui/GbCopyToClipBoard";
import GbModal from "@/components/ui/GbModal";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { Image, message, Tooltip } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import ChangeStatusModal from "./ChangeStatusModal";
import GbForm from "@/components/forms/GbForm";
import { useApprovedOrderMutation } from "@/redux/api/orderApi";
import { getUserInfo } from "@/service/authService";
import AddPaymentModal from "./AddPaymentModal";
import { yupResolver } from "@hookform/resolvers/yup";

import PaymentHistory from "./PaymentHistory";


const OrderDetails = ({ data }: any) => {
  const [addNote, setAddNote] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [openPaymentModal, setPaymentModalOpen] = useState(false);
  const [approvedOrderHandler] = useApprovedOrderMutation();
  const inputRef:any=useRef()

  const userInfo:any=getUserInfo() 
  const comments = data?.comment?.filter((item: any) => !item?.isAction)?.reverse() || [];

  const displayComments =
    comments.length > 3 && !seeMore ? comments.slice(0, 3) : comments;
  
  return (
    <div>
   <div className="flex justify-between items-start">
   <div>
      <p className=" py-[4px] w-fit color_primary">
        {data?.orderNumber}{" "}
        <i
          onClick={() => copyToClipboard(data?.orderNumber)}
          className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px] text-[20px] color_primary"
        ></i>
      </p>
      <p className="mt-[3px]">
        <strong>Source:</strong>
        {data?.orderSource}
      </p>
      <p className="">
        <strong>Date:</strong>
        {moment(data?.createdAt).format("MMM DD,YYYY")}
      </p>
   
        
        

        <div className="gb_border p-[10px]  w-[400px]">
          <div className="flex justify-between mb-3">
            <p className="">
              <strong>Internal Notes</strong>
            </p>
            {addNote ? (
              <div className="flex gap-3">
                <span
                  onClick={() => setAddNote(false)}
                  className="font-semibold text-[#FF6984] cursor-pointer"
                >
                  Cancel
                </span>
                <button 
                 type="button"  
                 onClick={async () => {
                    try {
                         if(!inputRef.current.value.trim()){
                        return  message.error('Please write something before submit')
                         }
                        const res = await approvedOrderHandler({
                          id: data?.id,
                          data: {
                            comments: inputRef.current.value,
                            isAction: false,
                            agentId: userInfo?.employeeId,
                          },
                        }).unwrap();
                        if (res) {
                          message.success("Comment submitted");
                          inputRef.current.value=" "
                        }
                      
                    } catch (error) {
                      message.error("Something went wrong");
                    }
                  }}
                
                className="font-semibold color_primary cursor-pointer">Save</button>
              </div>
            ) : (
              <p
                onClick={() => setAddNote(true)}
                className="color_primary font-semibold cursor-pointer"
              >
                Add Comment
              </p>
            )}
          </div>
          {addNote && (
            <div
              style={{ border: "1px solid #278ea5" }}
              className="floating-label-input "
            >
              <label
                htmlFor="customerSearch"
                style={{ color: "#999" }}
                className="text-[#999] block text-[12px]"
              >
                Add internal notes
              </label>
              <input 
                ref={inputRef}
                id="customerSearch"
                className="p-[14px] text-[12px] outline-none  bg-none w-full rounded-[4px]"
              />
            </div>
          )}
          <div>
            {displayComments?.map(
              (item: any, i: any) => (
                <p key={i} className="text-[rgba(0,0,0,.65)] text-[14px]">
                  {i + 1}.{item?.comments} [At{" "}
                  {moment(item?.created_at).format("hh:mm A [On] D MMM YYYY")}{" "}
                  By {item?.agent?.name}]
                </p>
              )
            )}
             <div className="flex justify-end mt-3">
                {(!seeMore && comments?.length >3) &&   <span onClick={()=>setSeeMore(true)} className="color_primary font-semibold cursor-pointer">See more</span>}
                {seeMore  && comments?.length >3 &&   <span onClick={()=>setSeeMore(false)} className="color_primary font-semibold cursor-pointer">See Less</span>}
             </div>
          </div>
        </div>
      </div>
        <div className="">
            <div className="text-end">
              <p className="text-[#00171d] text-[24px] font-[700]">{data?.receiverName}</p>
              <p className="text-[#4b5766] text-[14px]">
                {data?.receiverPhoneNumber}
                <i
                  onClick={() => copyToClipboard(data?.receiverPhoneNumber)}
                  className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px] text-[16px] color_primary"
                ></i>
              </p>
              <p className="text-[#4b5766] text-[14px] max-w-[400px]">
                {data?.receiverAddress}
              </p>
              <Tooltip>
              <button 
                onClick={() => setModalOpen(true)}
                className={`bg-[#00171D] ${
                  data?.status?.label === "Cancel" && "bg-[#FF5959]"
                }  ${
                  data?.status?.label === "Approved" && "bg-[#28a745]"
                } text-white  font-bold py-[6px] flex items-center justify-center gap-3 w-[200px] mb-2`}
              >
                {data?.status?.label || "Pending"}{" "}
                <i className="ri-arrow-down-s-line text-[18px]"></i>
              </button>
            </Tooltip>
            </div>
      
          </div>
   </div>


      <div className="responsive_order_details_view_table mt-3 ">
      
        <table>
          <thead>
            <tr>
              <td style={{border:"0px"}} colSpan={6}></td>
              <td ><span style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}>Order Type</span></td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>{data?.orderType}</td>
            </tr>
            <tr>
              <td style={{border:"0px"}} colSpan={6}></td>
              <td style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}>Payment Status</td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>{data?.paymentStatus}</td>
            </tr>
            <tr>
              <td style={{border:"0px"}} colSpan={6}></td>
              <td style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}>Payment Method</td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>{data?.paymentMethod}</td>
            </tr>
            <tr>
              <td style={{border:"0px"}} colSpan={6}></td>
              <td style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}>Warehouse</td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>N/A</td>
            </tr>
            <tr>
              <th>Product Code</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Pack Size</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Request Qty</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((item: any, i: any) => (
              <tr key={i}>
                <td>{item?.productId}</td>
                <td>
                  <Image
                    height={44}
                    width={44}
                    className="border"
                    src={item?.product?.images[0]?.url}
                    alt=""
                  />
                </td>
                <td>{item?.product?.name}</td>
                <td>{item?.product?.weight} {item?.product?.unit}</td>
                <td>
                  <p>BDT {item?.product?.salePrice}</p>
                  <p><del>BDT {item?.product?.regularPrice}</del></p>
                </td>
                <td>
                  BDT {item?.product?.discount_amount ? item?.product?.discount_amount * item?.productQuantity : "0.00"}
                </td>
                <td style={{ fontWeight: "bold" }}>{item?.productQuantity}</td>
                <td>BDT {item?.subtotal}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={6}></td>
              <td
                style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}
              >
                Sub-Total
              </td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>
               <p> BDT{" "}
                {
                  data?.productValue
                }
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan={6}></td>
              <td
                 style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}
              >
                Discount
              </td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>BDT {data?.discount}</td>
            </tr>
            <tr>
              <td colSpan={6}></td>
              <td
                 style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}
              >
                Delivery Fee
              </td>
              <td style={{color:'#4b6766',fontSize:"12px"}}>
               <p> BDT{" "}
                {
                  data?.shippingCharge
                }
                </p>
              </td>
            </tr>

            <tr>
              <td colSpan={6}></td>
              <td
                 style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}
              >
                Advance Payment
              </td>
              <td style={{color:'#4b5766',fontSize:"12px"}}>
                BDT {data?.totalPaidAmount || 0}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6}></th>
              <th
                 style={{color:'#0f3e49',fontWeight:"bold",fontSize:"13px"}}
              >
                Total Receivable
              </th>
              <th style={{color:'#4b5766',fontSize:"12px"}}>
                BDT {data?.totalReceiveAbleAmount}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-6">
         <div className="flex justify-between items-center">
         <h1 className="font-semibold  text-[18px] ">Payment History</h1> 
         <button
                onClick={() => setPaymentModalOpen(true)}
                className={`bg-[#278ea5] text-white px-[43px] font-bold py-[6px] flex items-center gap-3`}
              >
                Add Payment
          </button>
         </div>
      <PaymentHistory data={data} />

         
      </div>
       {/* status change modal */}
      <GbModal
        width="450px"
        isModalOpen={openModal}
        openModal={() => setModalOpen(true)}
        closeModal={() => setModalOpen(false)}
        clseTab={false}
        cls="custom_ant_modal"
      >
        <GbForm submitHandler={(data: any) => {}}>
          <ChangeStatusModal setModalOpen={setModalOpen} rowData={data} />
        </GbForm>
      </GbModal>
       {/*Add payment modal */}
      <GbModal
        width="450px"
        isModalOpen={openPaymentModal}
        openModal={() => setPaymentModalOpen(true)}
        closeModal={() => setPaymentModalOpen(false)}
        clseTab={false}
        cls="custom_ant_modal"
      >
        <GbForm  submitHandler={(data: any) => {}}>
          <AddPaymentModal setModalOpen={setPaymentModalOpen} rowData={data} />
        </GbForm>
      </GbModal>
    </div>
  );
};

export default OrderDetails;
