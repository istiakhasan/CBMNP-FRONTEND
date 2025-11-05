import { Card, Divider, Row, Col, Space, Typography } from "antd"
const { Text } = Typography

export const OrderedProductsMobileCard = ({ product }: { product: any }) => (
  <Card className="mb-3 rounded-lg border border-gray-200" bodyStyle={{ padding: 16 }}>
    <Space direction="vertical" size="small" className="w-full">
      <Space align="start">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-15 h-15 rounded-lg border border-gray-200 object-cover"
        />
        <div className="flex-1">
          <Text strong className="text-base block">
            {product.name}
          </Text>
          <Text type="secondary" className="text-sm">
            {product.code}
          </Text>
        </div>
      </Space>

      <Divider className="my-2" />

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Pack Size
          </Text>
          <div>
            <Text className="text-sm">{product.packSize}</Text>
          </div>
        </Col>
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
            Discount
          </Text>
          <div>
            <Text className="text-sm text-red-600">-${product.discount.toFixed(2)}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" className="text-xs">
            Quantity
          </Text>
          <div>
            <Text className="text-sm">{product.qty}</Text>
          </div>
        </Col>
      </Row>

      <Divider className="my-2" />

      <div className="flex justify-between items-center">
        <Text strong className="text-sm">
          Total
        </Text>
        <Text strong className="text-base text-blue-600">
          ${product.total.toFixed(2)}
        </Text>
      </div>
    </Space>
  </Card>
)