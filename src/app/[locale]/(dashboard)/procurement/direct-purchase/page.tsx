"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Popconfirm,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  DeleteOutlined,
  ShopOutlined,
  EyeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetProcurementQuery,
  useCreateDirectPurchaseMutation,
} from "@/redux/api/procurementApi";
import { useGetAllSupplierOptionsQuery } from "@/redux/api/supplierApi";
import { useLoadAllWarehouseQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";

const { Option } = Select;

export default function DirectPurchasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Dynamic products in cart for direct purchase
  const [cartItems, setCartItems] = useState<
    Array<{
      productId: string;
      productName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
    }>
  >([]);

  const [form] = Form.useForm();

  // Queries
  const { data: procurementsData, isLoading, refetch } = useGetProcurementQuery({
    limit: 50,
    page: 1,
  });
  const { data: supplierData } = useGetAllSupplierOptionsQuery(undefined);
  const { data: warehouseData } = useLoadAllWarehouseQuery(undefined);
  const { data: productsData } = useGetAllProductQuery({ limit: "300" });

  // Mutations
  const [createDirectPurchase, { isLoading: isSubmitting }] = useCreateDirectPurchaseMutation();

  const allProcurements = procurementsData?.data || [];
  // Direct Purchases have invoice prefix 'DIR-' or status 'Completed'
  const directPurchases = allProcurements.filter(
    (p: any) => p.invoiceNumber?.startsWith("DIR-") || p.status === "Completed"
  );

  const suppliers = supplierData?.data || [];
  const warehouses = warehouseData?.data || [];
  const products = productsData?.data || [];

  const totalDirectAmount = directPurchases.reduce(
    (sum: number, p: any) => sum + Number(p.billAmount || 0),
    0
  );

  const handleAddProductToCart = (productId?: string | null) => {
    if (!productId) return;
    const prod = products.find((p: any) => p.id === productId);
    if (!prod) return;

    if (cartItems.some((item) => item.productId === productId)) {
      message.warning("Product already added to direct purchase list");
      return;
    }

    setCartItems([
      ...cartItems,
      {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku || "N/A",
        quantity: 1,
        unitPrice: Number(prod.purchasePrice || 0),
      },
    ]);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCartQtyChange = (index: number, quantity: number) => {
    const updated = [...cartItems];
    updated[index].quantity = quantity;
    setCartItems(updated);
  };

  const handleCartPriceChange = (index: number, unitPrice: number) => {
    const updated = [...cartItems];
    updated[index].unitPrice = unitPrice;
    setCartItems(updated);
  };

  const cartTotalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = async (values: any) => {
    if (cartItems.length === 0) {
      message.error("Please add at least one product to purchase");
      return;
    }

    try {
      const payload = {
        supplierId: values.supplierId,
        warehouseId: values.warehouseId,
        billAmount: cartTotalAmount,
        notes: values.notes || "Direct Spot Purchase",
        items: cartItems.map((item) => ({
          productId: item.productId,
          orderedQuantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      const res: any = await createDirectPurchase(payload);
      if (res?.data?.success || res?.success || !res?.error) {
        message.success(
          res?.data?.message || res?.message || "Direct purchase completed! Stock added to warehouse."
        );
        setModalOpen(false);
        form.resetFields();
        setCartItems([]);
        if (typeof refetch === "function") {
          refetch();
        }
      } else {
        const errorMsg =
          res?.error?.data?.message ||
          res?.error?.message ||
          "Failed to complete direct purchase";
        message.error(errorMsg);
      }
    } catch (err: any) {
      message.error(err?.data?.message || err?.message || "Failed to complete direct purchase");
    }
  };

  const columns: any = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (inv: string) => (
        <span className="font-mono font-bold text-emerald-800">{inv || "DIR-INV"}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: ["supplier", "company"],
      key: "supplier",
      render: (comp: string, r: any) => (
        <div>
          <span className="font-semibold text-gray-900 block text-xs">
            {comp || r.supplier?.name || "Spot / Cash Supplier"}
          </span>
          <span className="text-[11px] text-gray-400">{r.supplier?.phone || ""}</span>
        </div>
      ),
    },
    {
      title: "Items Count",
      key: "itemsCount",
      align: "center" as const,
      render: (_: any, r: any) => (
        <span className="font-semibold text-blue-700">{r.items?.length || 0} Products</span>
      ),
    },
    {
      title: "Total Amount (BDT)",
      dataIndex: "billAmount",
      key: "billAmount",
      render: (amt: number) => (
        <span className="font-bold text-emerald-800 text-sm">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Purchase Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dt: string) => (
        <span className="text-xs font-mono text-gray-600">
          {dayjs(dt).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {st || "Completed"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record);
            setDetailsModal(true);
          }}
          className="text-emerald-700"
        >
          View Bill
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Direct Purchase (Spot Inflow & Stock Entry)" />

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Direct Purchases</span>}
              value={totalDirectAmount}
              prefix="৳"
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Direct Spot Inflows</span>}
              value={directPurchases.length}
              prefix={<ThunderboltOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Stock Updated</span>}
              value={directPurchases.length}
              suffix="Batches"
              prefix={<InboxOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Direct Spot Purchase Orders (Instant Stock Inflow)"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 border-none font-medium"
            >
              + New Direct Purchase
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={directPurchases}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* MODAL 1: CREATE DIRECT PURCHASE */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <ThunderboltOutlined className="text-amber-500" />
            Direct Purchase & Instant Warehouse Stock Deposit
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={880}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="supplierId"
              label="Supplier / Vendor"
              rules={[{ required: true, message: "Please select supplier" }]}
            >
              <Select
                placeholder="Select supplier"
                showSearch
                optionFilterProp="label"
                options={suppliers.map((s: any) => ({
                  label: `${s.company || s.name || "Supplier"} (${s.phone || "No phone"})`,
                  value: s.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="warehouseId"
              label="Receiving Warehouse / Location"
              rules={[{ required: true, message: "Please select warehouse to deposit stock" }]}
            >
              <Select
                placeholder="Select warehouse to deposit stock immediately"
                showSearch
                optionFilterProp="label"
                options={warehouses.map((w: any) => ({
                  label: `${w.name || w.warehouseName || "Warehouse"} (${w.city || w.address || "Main"})`,
                  value: w.id,
                }))}
              />
            </Form.Item>
          </div>

          {/* Product Picker */}
          <div className="bg-gray-50 p-3 rounded-lg border mb-4">
            <span className="text-xs font-bold text-gray-700 block mb-2">
              Select Product to Add to Direct Purchase:
            </span>
            <Select
              placeholder="Search product by name or SKU..."
              showSearch
              className="w-full"
              value={null}
              onChange={(val) => handleAddProductToCart(val)}
              optionFilterProp="label"
              options={products.map((p: any) => ({
                label: `${p.name || "Product"} ${p.sku ? `(SKU: ${p.sku})` : ""} - Buy Price: ৳${p.purchasePrice || 0}`,
                value: p.id,
              }))}
            />
          </div>

          {/* Cart Table */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b">
                <tr>
                  <th className="p-2.5">Product</th>
                  <th className="p-2.5 w-28">Quantity</th>
                  <th className="p-2.5 w-32">Unit Price (৳)</th>
                  <th className="p-2.5 w-32 text-right">Subtotal (৳)</th>
                  <th className="p-2.5 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                      No products added yet. Use the dropdown above to add items.
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => (
                    <tr key={item.productId} className="hover:bg-gray-50">
                      <td className="p-2.5">
                        <span className="font-bold text-gray-900 block">{item.productName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</span>
                      </td>
                      <td className="p-2.5">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(val) => handleCartQtyChange(index, Number(val || 1))}
                          className="w-full"
                        />
                      </td>
                      <td className="p-2.5">
                        <InputNumber
                          min={0}
                          value={item.unitPrice}
                          onChange={(val) => handleCartPriceChange(index, Number(val || 0))}
                          className="w-full"
                        />
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-800">
                        ৳{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveCartItem(index)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cart Summary Box */}
          <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4">
            <div>
              <span className="text-xs text-emerald-700 font-medium block">
                Total Products: {cartItems.length}
              </span>
              <span className="text-xs text-emerald-600">
                Stock will be immediately updated in the selected warehouse.
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 uppercase font-bold block">Total Bill Amount</span>
              <span className="text-2xl font-bold text-emerald-900">
                ৳{cartTotalAmount.toLocaleString()} BDT
              </span>
            </div>
          </div>

          <Form.Item name="notes" label="Purchase Notes / Memo">
            <Input placeholder="e.g. Spot market purchase, cash payment voucher #402" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={cartItems.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 border-none font-semibold px-6"
            >
              Confirm Direct Purchase & Add Stock
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: VIEW BILL BREAKDOWN */}
      <Modal
        title="Direct Purchase Details & Item Breakdown"
        open={detailsModal}
        onCancel={() => setDetailsModal(false)}
        footer={null}
        width={680}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 bg-gray-50 p-3 rounded-lg border text-xs">
              <div>
                <span className="text-gray-400">Invoice: </span>
                <span className="font-bold font-mono text-gray-900">{selectedRecord.invoiceNumber}</span>
                <span className="text-gray-400 block mt-1">Supplier: </span>
                <span className="font-semibold text-gray-800">
                  {selectedRecord.supplier?.company || selectedRecord.supplier?.name || "Spot Supplier"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Total Amount: </span>
                <span className="font-bold text-emerald-800 text-sm block">
                  ৳{Number(selectedRecord.billAmount || 0).toLocaleString()}
                </span>
                <span className="text-gray-400">Date: </span>
                <span className="text-gray-600">
                  {dayjs(selectedRecord.createdAt).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
            </div>

            <Table
              dataSource={selectedRecord.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Product",
                  dataIndex: ["product", "name"],
                  key: "prod",
                  render: (name: string, r: any) => (
                    <div>
                      <span className="font-semibold text-gray-900 block">{name || "Product Item"}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        SKU: {r.product?.sku || "-"}
                      </span>
                    </div>
                  ),
                },
                {
                  title: "Quantity",
                  dataIndex: "orderedQuantity",
                  key: "qty",
                  align: "center" as const,
                  render: (q: number) => <span className="font-bold">{q}</span>,
                },
                {
                  title: "Unit Price",
                  dataIndex: "unitPrice",
                  key: "price",
                  render: (p: number) => <span>৳{Number(p || 0).toLocaleString()}</span>,
                },
                {
                  title: "Total Price",
                  dataIndex: "totalPrice",
                  key: "total",
                  render: (t: number) => (
                    <span className="font-bold text-emerald-800">
                      ৳{Number(t || 0).toLocaleString()}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
