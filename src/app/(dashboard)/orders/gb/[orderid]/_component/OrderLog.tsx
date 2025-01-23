import { Divider } from "antd";
import moment from "moment";
import React from "react";

const OrderLog = ({ data }: any) => {
  const logs = data?.comment?.filter((item: any) => item?.isAction === true)?.reverse();
  return (
    <div className="px-[16px]">
      {logs.map((item: any, i: any) => (
        <div key={i}>
          <div className="flex items-center gap-[50px]">
            <div>
              <p className="color_primary text-[14px]">25 Nov, 2024</p>
              <p>{moment(item?.created_at).format("h:mm A")} [{item?.agent.name}] </p>
            </div>
            <div>

            <h1>{item?.comments}</h1>
            <h1 className="text-black font-bold">{item?.cancelWithReason}</h1>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default OrderLog;
