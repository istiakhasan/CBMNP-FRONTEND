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
import { paymentSchema } from "@/schema/schema";
import PaymentHistory from "./PaymentHistory";
import { handleCopy } from "@/util/copyOrderInfo";

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
      <p className=" py-[4px] w-fit color_primary">
        {data?.orderNumber}{" "}
        <i
          onClick={() => copyToClipboard(data?.orderNumber)}
          className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px] text-[20px] color_primary"
        ></i>
      </p>
 
      <p className="mt-[5px]">
        <strong>Date:</strong>
        {moment(data?.created_at).format("MMM DD,YYYY")}
      </p>

      <div className="flex justify-between items-start gap-3">
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
        <div>
          <div className="flex justify-end">
            <Tooltip title={`${(data?.orderStatus?.value==="7" || data?.orderStatus?.value==="9")? "Your can't change this status":"Change order status"} `}>
              <button 
                disabled={(data?.orderStatus?.value==="7" || data?.orderStatus?.value==="9")}
                onClick={() => setModalOpen(true)}
                className={`bg-[#00171D] ${
                  data?.orderStatus?.name === "Canceled" && "bg-[#FF5959]"
                }  ${
                  data?.orderStatus?.name === "Approved" && "bg-[#28a745]"
                } text-white px-[43px] font-bold py-[6px] flex items-center gap-3`}
              >
                {data?.orderStatus?.name}{" "}
                <i className="ri-arrow-down-s-line text-[18px]"></i>
              </button>
            </Tooltip>
          </div>
          <div className="flex gap-[70px] ">
            <div>
              <p className="">
                <strong>Billing</strong>
              </p>
              <p className="text-[#4b5766] text-[14px]">{data?.customerName}</p>
              <p className="text-[#4b5766] text-[14px]">
                {data?.customerPhoneNumber}
              </p>
              <p className="text-[#4b5766] text-[14px]">
                {(data?.billingAddressDivision || "N/A") +
                  "," +
                 ( data?.billingAddressDistrict || "N/A") +
                  "," +
                  (data?.billingAddressThana || "N/A")}
              </p>
              <p className="text-[#4b5766] text-[14px]">
                {data?.billingAddressTextArea}
              </p>
            </div>
            <div>
              <p className="">
                <strong>Shipping</strong>
              </p>
              <p className="text-[#4b5766] text-[14px]">{data?.receiverName}</p>
              <p className="text-[#4b5766] text-[14px]">
                {data?.receiverPhoneNumber}
                <i
                  onClick={() => copyToClipboard(data?.receiverPhoneNumber)}
                  className="ri-file-copy-line text-[#B1B1B1] cursor-pointer ml-[4px] text-[16px] color_primary"
                ></i>
              </p>
              <p className="text-[#4b5766] text-[14px]">
                {data?.shippingAddressDivision +
                  "," +
                  data?.shippingAddressDistrict +
                  "," +
                  data?.shippingAddressThana}
              </p>
              <p className="text-[#4b5766] text-[14px] max-w-[400px]">
                {data?.shippingAddressTextArea}
              </p>
            </div>
            <div>
              <p className="text-[#4b5766] text-[14px]">
                <strong className="mr-3">Source:</strong>
                {data?.orderFrom}
              </p>
              <p className="text-[#4b5766] text-[14px]">
                <strong className="mr-3">Type:</strong>
                {data?.orderType}
              </p>
              <p className="text-[#4b5766] text-[14px]">
                <strong className="mr-3">Payment Status:</strong>
                {data?.paymentStatus}
              </p>
              <p className="text-[#4b5766] text-[14px]">
                <strong className="mr-3">Warehouse:</strong>
                {"N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive_order_details_view_table mt-3 ">
        <table>
          <thead>
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
            {data?.order_info?.map((item: any, i: any) => (
              <tr key={i}>
                <td>{item?.product?.product_code}</td>
                <td>
                  <Image
                    height={44}
                    width={44}
                    className="border"
                    src={getBaseUrl() + "/" + item?.product?.product_image}
                    alt=""
                  />
                </td>
                <td>{item?.productNameEn}</td>
                <td>{item?.product?.pack_size}</td>
                <td>
                  <p>BDT {item?.singleProductPrices?.toFixed(2)}</p>
                  <p><del>BDT {item?.product?.regular_prices?.toFixed(2)}</del></p>
                </td>
                <td>
                  BDT {item?.product?.discount_amount ? item?.product?.discount_amount * item?.productQuantity : "0.00"}
                </td>
                <td style={{ fontWeight: "bold" }}>{item?.productQuantity}</td>
                <td>BDT {item?.subTotal?.toFixed(2)}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={5}></td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Sub-Total-Without-Discount
              </td>
              <td></td>
              <td style={{ fontWeight: "600", fontSize: "16px" }}>
               <p> BDT{" "}
                {
                  data?.order_info?.reduce((a:any,b:any)=>a+Number(b?.subTotal),0)
                }
                </p>
              
                {/* {(
                  Number(data?.last_transaction?.totalPurchaseAmount) -
                  Number(data?.deliveryCharge)
                ).toFixed(2)} */}
              </td>
            </tr>
            <tr>
              <td colSpan={5}></td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Discount
              </td>
              <td></td>
              <td style={{ fontWeight: "600", fontSize: "16px" }}>BDT {data?.order_info?.reduce((a:any,b:any)=>a+Number(b?.product?.discount_amount * b?.productQuantity),0)}</td>
            </tr>
            <tr>
              <td colSpan={5}></td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Sub-Total
              </td>
              <td></td>
              <td style={{ fontWeight: "600", fontSize: "16px" }}>
               <p> BDT{" "}
                {
                  data?.order_info?.reduce((a:any,b:any)=>a+Number(b?.singleProductPrices * b?.productQuantity),0)
                }
                </p>
              
                {/* {(
                  Number(data?.last_transaction?.totalPurchaseAmount) -
                  Number(data?.deliveryCharge)
                ).toFixed(2)} */}
              </td>
            </tr>
          
            <tr>
              <td colSpan={5}></td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Delivery Fee
              </td>
              <td></td>
              <td style={{ fontWeight: "600", fontSize: "16px" }}>
                BDT {data?.deliveryCharge}
              </td>
            </tr>
            <tr>
              <td colSpan={5}></td>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Advance Payment
              </td>
              <td></td>
              <td style={{ fontWeight: "600", fontSize: "16px" }}>
                BDT {data?.last_transaction?.totalPaidAmount}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={5}></th>
              <th
                style={{
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Total Receivable
              </th>
              <th></th>
              <th style={{ fontWeight: "600", fontSize: "16px" }}>
                BDT {(data?.order_info?.reduce((a:any,b:any)=>a+Number(b?.singleProductPrices * b?.productQuantity),0)+data?.deliveryCharge)-Number(data?.last_transaction?.totalPaidAmount || 0)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-6">
         <div className="flex justify-end">
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
        <GbForm resolver={yupResolver(paymentSchema)} submitHandler={(data: any) => {}}>
          <AddPaymentModal setModalOpen={setPaymentModalOpen} rowData={data} />
        </GbForm>
      </GbModal>
    </div>
  );
};

export default OrderDetails;
