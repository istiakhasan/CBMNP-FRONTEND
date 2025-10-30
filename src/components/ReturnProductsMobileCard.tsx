
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
const ReturnProductsMobileCard = ({ product }: { product: any }) => (
  <Card className="mb-3 rounded-lg border border-gray-200" bodyStyle={{ padding: 16 }}>
    <Space direction="vertical" size="small" className="w-full">
      <div>
        <Text strong className="text-base block">
          {product.name}
        </Text>
        <Text type="secondary" className="text-sm">
          {product.code}
        </Text>
      </div>

      <Divider className="my-2" />

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Price
          </Text>
          <div>
            <Text className="text-sm">${product.price.toFixed(2)}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Return Qty
          </Text>
          <div>
            <Text className="text-sm">{product.returnQty}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Damage Qty
          </Text>
          <div>
            <Text className="text-sm">{product.damageQty}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Total
          </Text>
          <div>
            <Text strong className="text-sm text-blue-600">
              ${product.total.toFixed(2)}
            </Text>
          </div>
        </Col>
      </Row>
    </Space>
  </Card>
)


export default ReturnProductsMobileCard
