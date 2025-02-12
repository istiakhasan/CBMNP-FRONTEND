import { useGetOrdersLogsQuery } from "@/redux/api/orderApi";
import { Divider } from "antd";
import moment from "moment";
import React from "react";

const OrderLog = ({ data }: any) => {
  const {data:logs}=useGetOrdersLogsQuery({
    id:data?.id
  })
  return (
    <div className="px-[16px]">
      {logs?.data?.map((item: any, i: any) => (
        <div key={i}>
          <div className="flex items-center gap-[50px]">
            <div className="w-[200px] ">
              <p className="color_primary text-[14px]">{moment(item?.createdAt).format('DD MMM YYYY')}</p>
              <p>{moment(item?.createdAt).format("h:mm A")} [{item?.updatedBy?.name}] </p>
            </div>
            <div className="flex-1">{item?.action} by [{item?.updatedBy?.name}] </div>
          </div>
          <Divider style={{padding:0,margin:0}}/>
        </div>
      ))}
    </div>
  );
};

export default OrderLog;
