
import {  Card, Space, Typography, Row, Col, Divider } from "antd"

const {  Text } = Typography
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
            <Text className="text-sm">${product?.price}</Text>
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
              ${product?.total}
            </Text>
          </div>
        </Col>
      </Row>
    </Space>
  </Card>
)


export default ReturnProductsMobileCard
