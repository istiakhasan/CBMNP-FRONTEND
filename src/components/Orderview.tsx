"use client";
import { Button, Space, Typography, Row, Col, Tabs, Tooltip } from "antd";
import {
  RiFileTextLine,
  RiDownloadLine,
  RiEditLine,
  RiPulseLine,
} from "@remixicon/react";
import { useState, useEffect } from "react";
import "./style.css";
import ActivityLogContent from "./ActivityLogContent";
import OrderInformationContent from "./OrderInformationContent";
import GbHeader from "./ui/dashboard/GbHeader";
import { useGetOrdersLogsQuery } from "@/redux/api/orderApi";
import GbModal from "./ui/GbModal";
import GbForm from "./forms/GbForm";
import ChangeStatusModal from "@/app/[locale]/(dashboard)/orders/[orderid]/_component/ChangeStatusModal";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
const { Title, Text } = Typography;
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

export function OrderPageView({ orderData , permission}: any) {
  const [openModal, setModalOpen] = useState(false);
  const router=useRouter()
  const local=useLocale()
  const isMobile = useIsMobile();
  const { data: logs } = useGetOrdersLogsQuery({
    id: orderData?.id,
  });
  const tabItems = [
    {
      key: "order-info",
      label: (
        <Space>
          <RiFileTextLine size={16} />
          <span>Order Information</span>
        </Space>
      ),
      children: <OrderInformationContent />,
    },
    {
      key: "activity-log",
      label: (
        <Space>
          <RiPulseLine size={16} />
          <span>Order Activity Log</span>
        </Space>
      ),
      children: <ActivityLogContent />,
    },
  ];

  return (
    <div>
      <GbHeader title="Order Details" />
      <div className="px-[16px]">
        <div className="h-[85vh] bg-white overflow-y-scroll custom_scroll">
          <div className="border-b border-gray-200 bg-white">
            <div className=" mx-auto px-6 py-4">
              <div className="flex items-center justify-end flex-wrap gap-4">
                <Space wrap>
                  <Button   onClick={() =>
                      router.push(
                        `/${local}/orders/edit?orderId=${orderData?.id}&customerId=${orderData?.customerId}`
                      )
                    } icon={<RiEditLine size={16} />}>Edit</Button>
                  {/* <Button type="primary" icon={<RiDownloadLine size={16} />}>
                    Export PDF
                  </Button> */}
                  <Tooltip>
                    <Button 
                      type="primary"
                      disabled={
                        !permission?.includes("UPDATE_ORDERS") ||
                        orderData?.status?.label === "Cancel"
                      }
                      onClick={() => setModalOpen(true)}
                      className={`bg-[#00171D] ${
                        orderData?.status?.label === "Cancel" && "bg-[#FF5959]"
                      }  ${
                        orderData?.status?.label === "Approved" && "bg-[#28a745]"
                      } text-white  font-bold py-[6px] flex items-center justify-center gap-3 px-[30px] mb-2`}
                    >
                      {orderData?.status?.label || "Pending"}{" "}
                      <i className="ri-arrow-down-s-line text-[18px]"></i>
                    </Button>
                  </Tooltip>
                </Space>
              </div>
            </div>
          </div>

          <div className="mx-auto  py-6">
            {isMobile ? (
              <Tabs
                defaultActiveKey="order-info"
                items={tabItems}
                size="large"
              />
            ) : (
              <Row gutter={24}>
                <Col span={16}>
                  <OrderInformationContent rowData={orderData} />
                </Col>
                <Col className="h-fit sticky top-[80px]" span={8}>
                  <ActivityLogContent logs={logs} rowData={orderData} />
                </Col>
              </Row>
            )}
          </div>

          <GbModal
            // width="450px"
            isModalOpen={openModal}
            openModal={() => setModalOpen(true)}
            closeModal={() => setModalOpen(false)}
            clseTab={false}
            cls="custom_ant_modal"
          >
            <GbForm submitHandler={(data: any) => {}}>
              <ChangeStatusModal
                setModalOpen={setModalOpen}
                rowData={orderData}
              />
            </GbForm>
          </GbModal>
        </div>
      </div>
    </div>
  );
}
