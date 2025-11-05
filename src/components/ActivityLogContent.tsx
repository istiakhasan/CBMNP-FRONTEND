import { useIsMobile } from "@/hook/useIsMobile";
import { useState } from "react";
import {
  Button,
  Card,
  Table,
  Tag,
  Input,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Tabs,
  Segmented,
  message,
} from "antd";
import {
  RiFileTextLine,
  RiTruckLine,
  RiDownloadLine,
  RiEditLine,
  RiShoppingCartLine,
  RiMapPinLine,
  RiCalendarLine,
  RiPulseLine,
  RiSendPlaneLine,
  RiStickyNoteLine,
  RiMoneyDollarCircleLine,
  RiSettings4Line,
} from "@remixicon/react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { useSubmitCommentMutation } from "@/redux/api/commentApi";
import { getUserInfo } from "@/service/authService";
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
type NoteFormData = {
  note: string;
};
const activityLog = [
  {
    date: "2024-01-15 10:30 AM",
    action: "Order Created",
    user: "System",
    description: "Order was created from website",
  },
  {
    date: "2024-01-15 10:35 AM",
    action: "Payment Received",
    user: "John Doe",
    description: "Advance payment of $150.00 received",
  },
  {
    date: "2024-01-15 11:00 AM",
    action: "Order Confirmed",
    user: "Admin",
    description: "Order confirmed and sent to warehouse",
  },
  {
    date: "2024-01-15 02:30 PM",
    action: "Order Packed",
    user: "Warehouse",
    description: "Items packed and ready for shipment",
  },
  {
    date: "2024-01-16 09:00 AM",
    action: "Order Shipped",
    user: "Logistics",
    description: "Order shipped via FedEx - Tracking: FDX123456",
  },
];

const ActivityLogContent = ({ logs, rowData }: any) => {
  const isMobile = useIsMobile();
  const userInfo: any = getUserInfo();
  const [submitComment] = useSubmitCommentMutation();
  const [activeTab, setActiveTab] = useState("Comment");
  const { control, handleSubmit, reset } = useForm<NoteFormData>({
    defaultValues: {
      note: "",
    },
  });

  const onSubmitNote = async (data: NoteFormData) => {
    if (!data.note.trim())
      return message.error("Please write something before submit");
    const res = await submitComment({
      comment: data.note.trim(),
      userId: userInfo?.userId,
      orderId: rowData?.id,
    }).unwrap();
    if (res) {
      message.success("Comment submitted");
      reset();
    }
  };
  return (
    <Card
      title={
        <Space>
          <RiPulseLine size={20} className="text-blue-600" />
          <span>Order Activity Log</span>
        </Space>
      }
      bordered={false}
      className="rounded-xl shadow-sm h-full sticky"
    >
      <Segmented<string>
        style={{ marginBottom: "10px" }}
        options={["Comment", "Logs"]}
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value);
        }}
      />
      {activeTab === "Comment" ? (
        <>
          {" "}
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 mb-6">
            <Space className="mb-3">
              <RiStickyNoteLine size={16} className="text-blue-600" />
              <Text strong className="text-sm">
                Add Internal Note
              </Text>
            </Space>
            <form onSubmit={handleSubmit(onSubmitNote)}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Write a note about this order..."
                    rows={4}
                    className="mb-3 text-sm"
                  />
                )}
              />
              <Button
                type="primary"
                htmlType="submit"
                icon={<RiSendPlaneLine size={16} />}
                block
              >
                Add Note
              </Button>
            </form>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1 top-2 w-0.5 h-[calc(100%-32px)] bg-gray-200" />

            <Space direction="vertical" size="large" className="w-full h-[400px] overflow-y-auto custom_scroll">
              {rowData?.comments?.map((activity: any, index: any) => (
                <div key={index} className="relative flex gap-2">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 mt-1 w-4 h-4 flex-shrink-0 rounded-full border-2 bg-white flex items-center justify-center ${
                      activity?.comment ? "border-amber-400" : "border-blue-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity?.comment ? "bg-amber-400" : "bg-blue-600"
                      }`}
                    />
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 ">
                    <div
                      className={`p-3 rounded-lg border ${
                        activity?.comment
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Text strong className="text-sm block mb-1">
                        {activity?.comment}
                      </Text>
                      {/* <Paragraph className="text-xs text-gray-600 mb-2 line-clamp-2">{activity?.description || 'N/A'}</Paragraph> */}
                      <Space size={1} className="text-xs text-gray-500">
                        <RiCalendarLine size={12} />
                        <Text type="secondary" className="text-xs">
                          {moment(activity?.createdAt).format(
                            "YYYY-MM-DD hh:mm A"
                          )}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          •
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {activity?.user?.name}
                        </Text>
                      </Space>
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </div>
        </>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1 top-2 w-0.5 h-[calc(100%-32px)] bg-gray-200" />

          <Space direction="vertical" size="large" className="w-full">
            {logs?.data?.map((activity: any, index: any) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 mt-1 w-4 h-4 flex-shrink-0 rounded-full border-2 bg-white flex items-center justify-center ${
                    activity?.isNote ? "border-amber-400" : "border-blue-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity?.isNote ? "bg-amber-400" : "bg-blue-600"
                    }`}
                  />
                </div>

                {/* Activity content */}
                <div className="flex-1 pb-6">
                  <div
                    className={`p-3 rounded-lg border ${
                      activity?.isNote
                        ? "border-amber-200 bg-amber-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Text strong className="text-sm block mb-1">
                      {activity?.action} by [{activity?.updatedBy?.name}]
                    </Text>
                    {/* <Paragraph className="text-xs text-gray-600 mb-2 line-clamp-2">{activity?.description || 'N/A'}</Paragraph> */}
                    <Space size={1} className="text-xs text-gray-500">
                      <RiCalendarLine size={12} />
                      <Text type="secondary" className="text-xs">
                        {moment(activity?.createdAt).format(
                          "YYYY-MM-DD hh:mm A"
                        )}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        •
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {activity?.updatedBy?.name}
                      </Text>
                    </Space>
                  </div>
                </div>
              </div>
            ))}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default ActivityLogContent;
