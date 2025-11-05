import { Button, Card, Table, Tag, Input, Space, Typography, Row, Col, Divider, Tabs } from "antd"
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
} from "@remixicon/react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import './style.css'
import ActivityLogContent from "./ActivityLogContent"
import OrderInformationContent from "./OrderInformationContent"
const { TextArea } = Input
const { Title, Text, Paragraph } = Typography
const PaymentHistoryMobileCard = ({ payment }: { payment: any }) => (
  <Card className="mb-3 rounded-lg border border-gray-200" bodyStyle={{ padding: 16 }}>
    <Space direction="vertical" size="small" className="w-full">
      <div className="flex justify-between items-center">
        <Text strong className="text-base">
          ${payment.amount.toFixed(2)}
        </Text>
        <Tag color="success">{payment.status}</Tag>
      </div>

      <Divider className="my-2" />

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Date
          </Text>
          <div>
            <Text className="text-sm">{payment.date}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Method
          </Text>
          <div>
            <Text className="text-sm">{payment.method}</Text>
          </div>
        </Col>
        <Col span={24}>
          <Text type="secondary" className="text-xs">
            Transaction ID
          </Text>
          <div>
            <Text code className="text-xs">
              {payment.trxId}
            </Text>
          </div>
        </Col>
      </Row>
    </Space>
  </Card>
)


export default PaymentHistoryMobileCard