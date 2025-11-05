import { useChangeOrderStatusMutation, useLazyGetOrderByIdQuery, useLazyGetScanOrderByIdQuery } from "@/redux/api/orderApi";
import { getUserInfo } from "@/service/authService";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";

const ScanOrderToIntransit = () => {
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const [scannedOrder, setScannedOrder] = useState<any>(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const userInfo: any = getUserInfo();
  const [scanOrderNumber, setScanOrderNumber] = useState("");
  const [getOrderbyId]=useLazyGetScanOrderByIdQuery()
  const [handleUpdateOrder] = useChangeOrderStatusMutation();
  const handleScanOrder = async () => {
    if (!scanOrderNumber) return;
    setLoadingScan(true);
    try {
      const data = await getOrderbyId({id:scanOrderNumber}).unwrap()
      if(!!data){
       const update= await handleUpdateOrder({
          orderIds: [data?.id],
          statusId: 7,
          agentId: userInfo.userId,
          currentStatus: data?.statusId,
        }).unwrap();

        if(!!update){
            message.success('Order move to in transit')
            
        }
      }
    } catch (error:any) {
      message.error(error?.data?.message)
      setScannedOrder(null);
    } finally {
      setLoadingScan(false);
      setScanOrderNumber('')
    }
  };
useEffect(()=>{
   handleScanOrder() 
},[scanOrderNumber])
  return (
    <>
      <button
        onClick={() => setIsScanModalVisible(true)}
        type="button"
        className=" border-[#4F8A6D] duration-200 px-3 font-bold flex gap-2 text-[#4F8A6D] items-center hover:bg-[#4F8A6D] hover:text-white border-[2px] focus:ring-[#4F8A6D]"
      >
        <i className="ri-scan-line text-xl z-10 transition-colors duration-300 "></i>
        <span className="z-10 transition-colors duration-300  ">
          Scan To InTransit
        </span>
      </button>
      <Modal
        width={700}
        title="Scan Order to In-Transit"
        open={isScanModalVisible}
        onCancel={() => setIsScanModalVisible(false)}
        footer={null}
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Scan or enter order number"
            className="border p-2 rounded"
            value={scanOrderNumber}
            onChange={(e) => setScanOrderNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleScanOrder();
            }}
            autoFocus
          />



          {scannedOrder && (
            <div className="border p-2 mt-2">
              <p>
                <b>Order Number:</b> {scannedOrder?.orderNumber}
              </p>
              <p>
                <b>Product:</b> {scannedOrder?.productName}
              </p>
              <p>
                <b>Status:</b> {scannedOrder?.status?.label}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ScanOrderToIntransit;
