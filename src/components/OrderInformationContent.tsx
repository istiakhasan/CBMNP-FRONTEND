/* eslint-disable @next/next/no-img-element */

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
import { useIsMobile } from "@/hook/useIsMobile"
import { OrderedProductsMobileCard } from "./OrderedProductsMobileCard"
import ReturnProductsMobileCard from "./ReturnProductsMobileCard"
import PaymentHistoryMobileCard from "./PaymentHistoryMobileCard"
import moment from "moment"
import GbModal from "./ui/GbModal"
import GbForm from "./forms/GbForm"
import AddPaymentModal from "@/app/[locale]/(dashboard)/orders/[orderid]/_component/AddPaymentModal"
const { TextArea } = Input
const { Title, Text, Paragraph } = Typography


const orderedProducts = [
  {
    image: "/diverse-products-still-life.png",
    code: "PRD-001",
    name: "Premium Widget",
    packSize: "12 pcs",
    price: 45.0,
    discount: 5.0,
    qty: 2,
    total: 85.0,
  },
  {
    image: "/diverse-products-still-life.png",
    code: "PRD-002",
    name: "Deluxe Gadget",
    packSize: "6 pcs",
    price: 120.0,
    discount: 10.0,
    qty: 1,
    total: 110.0,
  },
  {
    image: "/diverse-products-still-life.png",
    code: "PRD-003",
    name: "Standard Tool",
    packSize: "24 pcs",
    price: 30.0,
    discount: 0,
    qty: 3,
    total: 90.0,
  },
]



const returnProducts = [
  {
    code: "PRD-001",
    name: "Premium Widget",
    price: 45.0,
    returnQty: 1,
    damageQty: 0,
    total: 45.0,
  },
]

const paymentHistory = [
  {
    date: "2024-01-15",
    status: "Completed",
    method: "Credit Card",
    trxId: "TRX-123456789",
    amount: 150.0,
  },
]

const OrderInformationContent = ({rowData}:any) => {
 const [openPaymentModal, setPaymentModalOpen] = useState(false);
  const orderedProductsColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => {
        console.log(record,"record");
        return (
        <Space>
          <img
            src={record?.product?.images[0]?.url || "/placeholder.svg"}
            alt={text}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              objectFit: "cover",
            }}
          />
          <Text strong>{text}</Text>
        </Space>
      )
      },
    },
    {
      title: "Code",
      render: (text:any, record:any) => record.product?.internalId || "-",
      key: "code",
    },
    {
      title: "Pack Size",
      render: (text:any, record:any) => record.product?.weight+ " " + record.product?.unit  || "-",
      key: "packSize",
    },
    {
      title: "Price",
      key: "price",
      align: "right" as const,
      render: (text:any, record:any) => record.product?.salePrice  || "-",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "right" as const,
      render: (discount: number) => `N/A`,
    },
    {
      title: "Qty",
      dataIndex: "productQuantity",
      key: "productQuantity",
      align: "center" as const,
    },
    {
      title: "Total",
      dataIndex: "subtotal",
      key: "total",
      align: "right" as const,
    },
  ]

  const returnProductsColumns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Return Qty",
      dataIndex: "returnQty",
      key: "returnQty",
      align: "center" as const,
    },
    {
      title: "Damage Qty",
      dataIndex: "damageQty",
      key: "damageQty",
      align: "center" as const,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right" as const,
      render: (total: number) => <Text strong>${total.toFixed(2)}</Text>,
    },
  ]

  const paymentHistoryColumns = [
    {
      title: "Date",
      render: (transactionId: string,record:any) => <Text>{moment(record?.createdAt).format('YYYY-MM-DD')}</Text>,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "status",
      render: (status: string) => <Tag color="success">{status}</Tag>,
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "method",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "trxId",
      render: (transactionId: string) => <Text code>{transactionId}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "paidAmount",
      key: "amount",
      align: "right" as const,
      render: (paidAmount: number) => <Text strong>${paidAmount}</Text>,
    },
  ]

  const isMobile = useIsMobile()
  return (
    <Space direction="vertical" size="large" className="w-full">
      {/* Order Info */}
      <Card
        title={
          <Space>
            <RiFileTextLine size={20} className="text-blue-600" />
            <span>Order Information</span>
          </Space>
        }
        bordered={false}
        className="rounded-xl shadow-sm"
      >
        <Row gutter={[32, 16]}>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Order ID
            </Text>
            <div>
              <Text strong className="text-sm">
                {rowData?.orderNumber}
              </Text>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Source
            </Text>
            <div>
              <Text className="text-sm">{rowData?.orderSource}</Text>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Date
            </Text>
            <div>
              <Text className="text-sm">{moment(rowData?.createdAt).format('YYYY-MM-DD')}</Text>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Type
            </Text>
            <div>
              <Text className="text-sm">{rowData?.orderType}</Text>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Payment Status
            </Text>
            <div>
              <Tag color="warning">{rowData?.paymentStatus}</Tag>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Payment Method
            </Text>
            <div>
              <Text className="text-sm">{rowData?.paymentMethod}</Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <Space className="mb-3">
                <RiMapPinLine size={16} className="text-blue-600" />
                <Text strong className="text-sm">
                  Billing Information
                </Text>
              </Space>
              <div className="text-sm leading-relaxed">
                <div>
                  <Text strong>{rowData?.customer?.customerName}</Text>
                </div>
                <div>
                  <Text type="secondary">{rowData?.customer?.address}</Text>
                </div>
                <div>
                  <Text type="secondary">{rowData?.customer?.customerPhoneNumber}</Text>
                </div>
                <div>
                  <Text type="secondary">{rowData?.customer?.email || 'N/A'}</Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 h-full">
              <Space className="mb-3">
                <RiTruckLine size={16} className="text-blue-600" />
                <Text strong className="text-sm">
                  Shipping Information
                </Text>
              </Space>
              <div className="text-sm leading-relaxed">
                <div>
                  <Text strong>{rowData?.receiverName}</Text>
                </div>
                <div>
                  <Text type="secondary">{rowData?.receiverAddress}</Text>
                </div>
                <div>
                  <Text type="secondary">{rowData?.receiverPhoneNumber}</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Ordered Products */}
      <Card
        title={
          <Space>
            <RiShoppingCartLine size={20} className="text-blue-600" />
            <span>Ordered Products</span>
          </Space>
        }
        bordered={false}
        className="rounded-xl shadow-sm"
        bodyStyle={{ padding: isMobile ? 16 : 0 }}
      >
        {isMobile ? (
          <div>
            {orderedProducts.map((product) => (
              <OrderedProductsMobileCard key={product.code} product={product} />
            ))}
          </div>
        ) : (
          <Table columns={orderedProductsColumns} dataSource={rowData?.products} pagination={false} rowKey="code" />
        )}
      </Card>

      {/* Action Buttons */}
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Button onClick={() => setPaymentModalOpen(true)} type="primary" icon={<RiMoneyDollarCircleLine size={16} />} block size="large">
            Add Payment
          </Button>
        </Col>
        {/* <Col xs={24} sm={12}>
          <Button icon={<RiSettings4Line size={16} />} block size="large">
            Make Financial Adjustment
          </Button>
        </Col> */}
      </Row>

      {/* Financial Info */}
      <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex justify-between">
            <Text className="text-sm">Sub Total</Text>
            <Text strong className="text-sm">
              {rowData?.productValue}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Discount</Text>
            <Text strong className="text-sm text-red-600">
              -{rowData?.discount}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Delivery Fee</Text>
            <Text strong className="text-sm">
              {rowData?.shippingCharge}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Advance</Text>
            <Text strong className="text-sm text-green-600">
              ${rowData?.totalPaidAmount}
            </Text>
          </div>
          {/* <div className="flex justify-between">
            <Text className="text-sm">Adjustment</Text>
            <Text strong className="text-sm text-red-600">
              ${financialInfo.adjustment.toFixed(2)}
            </Text>
          </div> */}
          <div className="flex justify-between">
            <Text className="text-sm">Due</Text>
            <Text strong className="text-sm">
              ${rowData?.totalPrice - rowData?.totalPaidAmount}
            </Text>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-blue-50 mt-2">
            <Text strong className="text-base text-blue-900">
              Total Receivable
            </Text>
            <Text strong className="text-base text-blue-600">
              ${rowData?.totalReceiveAbleAmount}
            </Text>
          </div>
        </Space>
      </div>

      {/* Return Products */}
      <Card
        title={
          <Space>
            <RiShoppingCartLine size={20} className="text-blue-600" />
            <span>Return Products</span>
          </Space>
        }
        bordered={false}
        className="rounded-xl shadow-sm"
        bodyStyle={{ padding: isMobile ? 16 : 0 }}
      >
        {isMobile ? (
          <div>
            {returnProducts.map((product) => (
              <ReturnProductsMobileCard key={product.code} product={product} />
            ))}
          </div>
        ) : (
          <Table columns={returnProductsColumns} dataSource={returnProducts} pagination={false} rowKey="code" />
        )}
      </Card>

      {/* Payment History */}
      <Card
        title={
          <Space>
            <RiMoneyDollarCircleLine size={20} className="text-blue-600" />
            <span>Payment History</span>
          </Space>
        }
        bordered={false}
        className="rounded-xl shadow-sm"
        bodyStyle={{ padding: isMobile ? 16 : 0 }}
      >
        {isMobile ? (
          <div>
            {paymentHistory.map((payment, index) => (
              <PaymentHistoryMobileCard key={index} payment={payment} />
            ))}
          </div>
        ) : (
          <Table columns={paymentHistoryColumns} dataSource={rowData?.paymentHistory} pagination={false} rowKey="trxId" />
        )}
      </Card>
           <GbModal
        width="450px"
        isModalOpen={openPaymentModal}
        openModal={() => setPaymentModalOpen(true)}
        closeModal={() => setPaymentModalOpen(false)}
        clseTab={false}
        cls="custom_ant_modal"
      >
        <GbForm submitHandler={(data: any) => {}}>
          <AddPaymentModal setModalOpen={setPaymentModalOpen} rowData={rowData} />
        </GbForm>
      </GbModal>
    </Space>
  )
}


export default OrderInformationContent