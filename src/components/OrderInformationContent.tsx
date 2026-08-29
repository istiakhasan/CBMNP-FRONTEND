/* eslint-disable @next/next/no-img-element */

import { Button, Card, Table, Tag, Input, Space, Typography, Row, Col, Divider, Tabs, Tooltip, Image } from "antd"
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
  RiArrowLeftRightLine,
} from "@remixicon/react"
import { useState } from "react"
import { useIsMobile } from "@/hook/useIsMobile"
import { OrderedProductsMobileCard } from "./OrderedProductsMobileCard"
import ReturnProductsMobileCard from "./ReturnProductsMobileCard"
import PaymentHistoryMobileCard from "./PaymentHistoryMobileCard"
import moment from "moment"
import GbModal from "./ui/GbModal"
import GbForm from "./forms/GbForm"
import AddPaymentModal from "@/app/[locale]/(dashboard)/orders/[orderid]/_component/AddPaymentModal"
import StatusBadge from "@/util/StatusBadge"
import Link from "next/link"
const { Text } = Typography

const OrderInformationContent = ({ rowData, local }: any) => {
  const [openPaymentModal, setPaymentModalOpen] = useState(false);

  const orderedProductsColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "image",
      render: (text: string, record: any) => (
        <Space>
          <Image
            src={record?.product?.images?.[0]?.url || "/placeholder.svg"}
            alt={record?.product?.name || "product"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              objectFit: "cover",
            }}
          />
        </Space>
      ),
    },
    {
      title: "Name",
      key: "name",
      width: 250,
      ellipsis: { showTitle: false },
      render: (_text: any, record: any) => (
        <Tooltip title={record.product?.name || "N/A"}>
          <span>{record.product?.name || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Code",
      key: "code",
      render: (text: any, record: any) => record.product?.internalId || record.product?.sku || "-",
    },
    {
      title: "Pack Size",
      key: "packSize",
      render: (text: any, record: any) =>
        record.product?.weight ? `${record.product.weight} ${record.product?.unit || ""}` : "-",
    },
    {
      title: "Price",
      key: "price",
      align: "right" as const,
      render: (text: any, record: any) => record.product?.salePrice || "-",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "right" as const,
      render: () => `N/A`,
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
      key: "code",
      render: (text: any, record: any) => record.product?.internalId || record.product?.sku || "-",
    },
    {
      title: "Name",
      key: "name",
      render: (text: any, record: any) => <Text strong>{record.product?.name || "N/A"}</Text>,
    },
    {
      title: "Return Qty",
      dataIndex: "returnQuantity",
      key: "returnQuantity",
      align: "center" as const,
    },
    {
      title: "Damage Qty",
      dataIndex: "damageQuantity",
      key: "damageQuantity",
      align: "center" as const,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => reason || "-",
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date: string) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
    },
  ]

  const paymentHistoryColumns = [
    {
      title: "Date",
      render: (transactionId: string, record: any) => <Text>{moment(record?.createdAt).format("YYYY-MM-DD")}</Text>,
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
      render: (paidAmount: number) => <Text strong>{paidAmount}</Text>,
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
            <span>Order Information</span>{" "}
            <span>
              <StatusBadge status={rowData?.status} />
            </span>
          </Space>
        }
        bordered={false}
        className="rounded-xl shadow-sm"
      >
        <Row gutter={[32, 16]}>
          <Col xs={12} md={8}>
            <Text type="secondary" className="text-xs font-medium">
              Order ID(INV)
            </Text>
            <div>
              <Text strong className="text-sm">
                {rowData?.invoiceNumber}
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
              <Text className="text-sm">{moment(rowData?.createdAt).format("YYYY-MM-DD")}</Text>
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
                  <Text type="secondary">{rowData?.customer?.email || "N/A"}</Text>
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

      {/* Exchange Info — এই order অন্য কোনো order-এর সাথে exchange-linked কিনা */}
      {(rowData?.exchangedFromOrder || rowData?.exchangedIntoOrders?.length > 0) && (
        <Card
          title={
            <Space>
              <RiArrowLeftRightLine size={20} className="text-blue-600" />
              <span>Exchange Information</span>
            </Space>
          }
          bordered={false}
          className="rounded-xl shadow-sm"
        >
          {/* কেস ১: এই order একটা exchange-এর ফলে তৈরি (এটা "New Order") */}
          {rowData?.exchangedFromOrder && (
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 mb-3">
              <Text strong className="text-sm block mb-1">
                This order was created as an exchange
              </Text>
              <Text className="text-sm">
                Replaces product from order{" "}
                <Link
                  href={`/${local}/orders/${rowData.exchangedFromOrder.originalOrder?.id}`}
                  className="text-blue-600 underline"
                >
                  {rowData.exchangedFromOrder.originalOrder?.orderNumber}
                </Link>
              </Text>
              <div className="flex justify-between mt-2">
                <Text type="secondary" className="text-xs">
                  Old Qty
                </Text>
                <Text className="text-xs">{rowData.exchangedFromOrder.oldQuantity}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary" className="text-xs">
                  New Qty
                </Text>
                <Text className="text-xs">{rowData.exchangedFromOrder.newQuantity}</Text>
              </div>
              <div className="flex justify-between mt-1">
                <Text strong className="text-xs">
                  Price Difference
                </Text>
                <Text
                  strong
                  className="text-xs"
                  style={{
                    color:
                      Number(rowData.exchangedFromOrder.priceDifference) > 0
                        ? "#cf1322"
                        : Number(rowData.exchangedFromOrder.priceDifference) < 0
                          ? "#389e0d"
                          : undefined,
                  }}
                >
                  BDT: {rowData.exchangedFromOrder.priceDifference}
                </Text>
              </div>
            </div>
          )}

          {/* কেস ২: এই order থেকে নতুন exchange-order তৈরি হয়েছে (এটা "Original Order") */}
          {rowData?.exchangedIntoOrders?.length > 0 && (
            <div>
              <Text strong className="text-sm block mb-2">
                Product(s) from this order were exchanged
              </Text>
              {rowData.exchangedIntoOrders.map((ex: any) => (
                <div key={ex.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-2">
                  <Text className="text-sm">
                    {ex.oldQuantity} unit(s) exchanged →{" "}
                    <Link href={`/${local}/orders/${ex.newOrder?.id}`} className="text-blue-600 underline">
                      {ex.newOrder?.orderNumber}
                    </Link>
                  </Text>
                  <div className="flex justify-between mt-1">
                    <Text type="secondary" className="text-xs">
                      Price Difference
                    </Text>
                    <Text strong className="text-xs">
                      BDT: {ex.priceDifference}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

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
            {rowData?.products?.map((product: any) => (
              <OrderedProductsMobileCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Table columns={orderedProductsColumns} dataSource={rowData?.products} pagination={false} rowKey="id" />
        )}
      </Card>

      {/* Action Buttons */}
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Button
            onClick={() => setPaymentModalOpen(true)}
            type="primary"
            icon={<RiMoneyDollarCircleLine size={16} />}
            block
            size="large"
          >
            Add Payment
          </Button>
        </Col>
      </Row>

      {/* Financial Info */}
      <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex justify-between">
            <Text className="text-sm">Sub Total</Text>
            <Text strong className="text-sm">
              BDT: {rowData?.productValue}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Discount</Text>
            <Text strong className="text-sm text-red-600">
              BDT: -{rowData?.discount}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Delivery Fee</Text>
            <Text strong className="text-sm">
              BDT: {rowData?.shippingCharge}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Advance</Text>
            <Text strong className="text-sm text-green-600">
              BDT: {rowData?.totalPaidAmount}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-sm">Due</Text>
            <Text strong className="text-sm">
              BDT: {rowData?.totalPrice - rowData?.totalPaidAmount}
            </Text>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-blue-50 mt-2">
            <Text strong className="text-base text-blue-900">
              Total Receivable
            </Text>
            <Text strong className="text-base text-blue-600">
              BDT: {rowData?.totalReceiveAbleAmount}
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
            {rowData?.productReturns?.map((product: any) => (
              <ReturnProductsMobileCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Table columns={returnProductsColumns} dataSource={rowData?.productReturns} pagination={false} rowKey="id" />
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
            {rowData?.paymentHistory?.map((payment: any) => (
              <PaymentHistoryMobileCard key={payment.id} payment={payment} />
            ))}
          </div>
        ) : (
          <Table columns={paymentHistoryColumns} dataSource={rowData?.paymentHistory} pagination={false} rowKey="id" />
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