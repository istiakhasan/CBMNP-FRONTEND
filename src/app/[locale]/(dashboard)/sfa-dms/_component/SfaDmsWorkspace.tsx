"use client";

import {
  useCheckInAttendanceMutation,
  useCheckInFieldVisitMutation,
  useCheckOutAttendanceMutation,
  useCheckOutFieldVisitMutation,
  useCreateDeliveryTripMutation,
  useCreatePrimaryOrderWithItemsMutation,
  useCreateReturnWithItemsMutation,
  useCreateSalesOrderWithItemsMutation,
  useCreateSfaDmsResourceMutation,
  useGetDistributorStockReportQuery,
  useGetOrderItemsQuery,
  useGetPrimaryOrderItemsQuery,
  useGetSfaDmsResourceQuery,
  useGetTargetsAchievementReportQuery,
  useUpdateDistributorOnboardingMutation,
  useUpdatePrimaryOrderStatusMutation,
  useUpdateSalesOrderStatusMutation,
  useUpdateSfaDmsResourceMutation,
  useUpdateTripStatusMutation,
  useVerifyCollectionMutation,
} from "@/redux/api/sfaDmsApi";
import { useGetAllUsersOptionsQuery } from "@/redux/api/usersApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  ShopOutlined,
  StopOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const rows = (response: any) => response?.data?.data || response?.data || [];
const options = (items: any[]) =>
  (items || [])
    .map((item: any) => ({
      value: item.id ?? item.value,
      label: item.label ?? `${item.code ? `${item.code} — ` : ""}${item.name || item.fullName || item.title || item.email || item.value}`,
    }))
    .filter((item: any) => item.value);

export default function SfaDmsWorkspace() {
  const [activeTab, setActiveTab] = useState("orders");
  const [masterSubTab, setMasterSubTab] = useState("distributors");
  const [sfaSubTab, setSfaSubTab] = useState("visits");

  // Modals / Drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [primaryOrderModalOpen, setPrimaryOrderModalOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [visitOutcomeOpen, setVisitOutcomeOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [verifyCollectionOpen, setVerifyCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [currentResource, setCurrentResource] = useState<string>("distributors");

  const [form] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [primaryOrderForm] = Form.useForm();
  const [visitForm] = Form.useForm();
  const [collectionVerifyForm] = Form.useForm();

  // Queries
  const regionsQuery = useGetSfaDmsResourceQuery({ resource: "regions", page: 1, limit: 200 });
  const areasQuery = useGetSfaDmsResourceQuery({ resource: "areas", page: 1, limit: 200 });
  const territoriesQuery = useGetSfaDmsResourceQuery({ resource: "territories", page: 1, limit: 200 });
  const distributorsQuery = useGetSfaDmsResourceQuery({ resource: "distributors", page: 1, limit: 200 });
  const retailersQuery = useGetSfaDmsResourceQuery({ resource: "retailers", page: 1, limit: 200 });
  const routesQuery = useGetSfaDmsResourceQuery({ resource: "routes", page: 1, limit: 200 });
  const attendanceQuery = useGetSfaDmsResourceQuery({ resource: "attendance", page: 1, limit: 200 });
  const visitsQuery = useGetSfaDmsResourceQuery({ resource: "visits", page: 1, limit: 200 });
  const ordersQuery = useGetSfaDmsResourceQuery({ resource: "orders", page: 1, limit: 200 });
  const primaryOrdersQuery = useGetSfaDmsResourceQuery({ resource: "primaryOrders", page: 1, limit: 200 });
  const collectionsQuery = useGetSfaDmsResourceQuery({ resource: "collections", page: 1, limit: 200 });
  const schemesQuery = useGetSfaDmsResourceQuery({ resource: "schemes", page: 1, limit: 200 });
  const tripsQuery = useGetSfaDmsResourceQuery({ resource: "trips", page: 1, limit: 200 });
  const returnsQuery = useGetSfaDmsResourceQuery({ resource: "returns", page: 1, limit: 200 });
  const targetsQuery = useGetTargetsAchievementReportQuery({});
  const stockQuery = useGetDistributorStockReportQuery({});

  const { data: userData } = useGetAllUsersOptionsQuery({ limit: 200 });
  const { data: warehouseData } = useLoadAllWarehouseOptionsQuery(undefined);
  const { data: productsData } = useGetAllProductQuery({ limit: 200 });

  // Mutations
  const [createGeneric, { isLoading: creatingGeneric }] = useCreateSfaDmsResourceMutation();
  const [updateGeneric, { isLoading: updatingGeneric }] = useUpdateSfaDmsResourceMutation();
  const [createSalesOrder, { isLoading: creatingSalesOrder }] = useCreateSalesOrderWithItemsMutation();
  const [updateOrderStatus, { isLoading: updatingOrderStatus }] = useUpdateSalesOrderStatusMutation();
  const [createPrimaryOrder, { isLoading: creatingPrimaryOrder }] = useCreatePrimaryOrderWithItemsMutation();
  const [updatePrimaryStatus, { isLoading: updatingPrimaryStatus }] = useUpdatePrimaryOrderStatusMutation();
  const [updateOnboarding, { isLoading: updatingOnboarding }] = useUpdateDistributorOnboardingMutation();
  const [checkInAttendance] = useCheckInAttendanceMutation();
  const [checkOutAttendance] = useCheckOutAttendanceMutation();
  const [checkInVisit] = useCheckInFieldVisitMutation();
  const [checkOutVisit, { isLoading: checkingOutVisit }] = useCheckOutFieldVisitMutation();
  const [verifyCollection, { isLoading: verifyingCollection }] = useVerifyCollectionMutation();

  const { data: orderItemsData, isFetching: fetchingOrderItems } = useGetOrderItemsQuery(selectedOrder?.id, {
    skip: !selectedOrder?.id,
  });

  // Dynamic order calculation states
  const [orderItems, setOrderItems] = useState<any[]>([
    { productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, taxRate: 0, lineTotal: 0 },
  ]);

  const [primaryOrderItems, setPrimaryOrderItems] = useState<any[]>([
    { productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, lineTotal: 0 },
  ]);

  // Lookups
  const regionOptions = useMemo(() => options(rows(regionsQuery.data)), [regionsQuery.data]);
  const territoryOptions = useMemo(() => options(rows(territoriesQuery.data)), [territoriesQuery.data]);
  const distributorOptions = useMemo(() => options(rows(distributorsQuery.data)), [distributorsQuery.data]);
  const retailerOptions = useMemo(() => options(rows(retailersQuery.data)), [retailersQuery.data]);
  const routeOptions = useMemo(() => options(rows(routesQuery.data)), [routesQuery.data]);
  const userOptions = useMemo(() => options(rows(userData)), [userData]);
  const warehouseOptions = useMemo(() => options(rows(warehouseData)), [warehouseData]);
  const productOptions = useMemo(
    () =>
      (rows(productsData) || []).map((p: any) => ({
        value: p.id,
        label: `${p.name} ${p.sku ? `(${p.sku})` : ""}`,
        price: Number(p.salePrice || p.price || 0),
        uom: p.uom || "PCS",
      })),
    [productsData],
  );

  // Status tag renderers
  const renderStatus = (status: string) => {
    const map: Record<string, string> = {
      Draft: "default",
      Submitted: "processing",
      Approved: "success",
      Dispatched: "warning",
      Delivered: "cyan",
      Received: "green",
      Cancelled: "error",
      Pending: "warning",
      Completed: "success",
      Missed: "error",
      Verified: "success",
      Deposited: "blue",
      Blocked: "error",
      Active: "success",
    };
    return <Tag color={map[status] || "default"}>{status}</Tag>;
  };

  const renderActive = (active: any) => (
    <Tag color={active === false ? "default" : "success"}>{active === false ? "Inactive" : "Active"}</Tag>
  );

  // Refresh active view
  const refreshActive = () => {
    ordersQuery.refetch();
    primaryOrdersQuery.refetch();
    visitsQuery.refetch();
    attendanceQuery.refetch();
    collectionsQuery.refetch();
    distributorsQuery.refetch();
    retailersQuery.refetch();
    stockQuery.refetch();
    targetsQuery.refetch();
    message.success("Refreshed data");
  };

  // Generic Drawer handlers
  const openCreateDrawer = (resource: string) => {
    setCurrentResource(resource);
    setEditingRecord(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEditDrawer = (resource: string, record: any) => {
    setCurrentResource(resource);
    setEditingRecord(record);
    form.resetFields();
    form.setFieldsValue({
      ...record,
      active: record.active ?? true,
      orderDate: record.orderDate ? dayjs(record.orderDate) : undefined,
      visitDate: record.visitDate ? dayjs(record.visitDate) : undefined,
      collectionDate: record.collectionDate ? dayjs(record.collectionDate) : undefined,
    });
    setDrawerOpen(true);
  };

  const saveGenericRecord = async () => {
    try {
      const values = await form.validateFields();
      const payload = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, dayjs.isDayjs(v) ? v.format("YYYY-MM-DD") : v]),
      );
      if (editingRecord) {
        await updateGeneric({ resource: currentResource, id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createGeneric({ resource: currentResource, data: payload }).unwrap();
      }
      message.success("Saved successfully");
      setDrawerOpen(false);
      refreshActive();
    } catch (err: any) {
      message.error(err?.data?.message || "Error saving record");
    }
  };

  // Distributor Onboarding status update
  const handleOnboardingChange = async (distributorId: string, status: string, reason?: string) => {
    try {
      await updateOnboarding({ id: distributorId, onboardingStatus: status, blockedReason: reason }).unwrap();
      message.success(`Distributor marked as ${status}`);
      distributorsQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update onboarding status");
    }
  };

  // Sales Order line calculations
  const calculateOrderTotals = (items: any[]) => {
    let gross = 0;
    let disc = 0;
    let tax = 0;
    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const d = Number(item.discountAmount) || 0;
      const tRate = Number(item.taxRate) || 0;
      const base = qty * price;
      const taxable = Math.max(base - d, 0);
      const t = (taxable * tRate) / 100;
      gross += base;
      disc += d;
      tax += t;
    });
    return { gross, disc, tax, net: Math.max(gross - disc + tax, 0) };
  };

  const updateOrderItemField = (index: number, field: string, value: any) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    if (field === "productId") {
      const p = productOptions.find((x:any) => x.value === value);
      if (p) {
        updated[index].productName = p.label;
        updated[index].unitPrice = p.price;
        updated[index].uom = p.uom;
      }
    }
    const qty = Number(updated[index].quantity) || 0;
    const price = Number(updated[index].unitPrice) || 0;
    const d = Number(updated[index].discountAmount) || 0;
    const tRate = Number(updated[index].taxRate) || 0;
    const base = qty * price;
    const taxable = Math.max(base - d, 0);
    const tax = (taxable * tRate) / 100;
    updated[index].lineTotal = taxable + tax;
    setOrderItems(updated);
  };

  const addOrderItemRow = () => {
    setOrderItems([
      ...orderItems,
      { productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, taxRate: 0, lineTotal: 0 },
    ]);
  };

  const removeOrderItemRow = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleCreateSalesOrder = async () => {
    try {
      const values = await orderForm.validateFields();
      const validItems = orderItems.filter((i) => i.productId && i.quantity > 0);
      if (validItems.length === 0) {
        message.error("Please add at least one valid product item");
        return;
      }
      const payload = {
        retailerId: values.retailerId,
        distributorId: values.distributorId,
        salesRepId: values.salesRepId,
        orderDate: values.orderDate ? values.orderDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        deliveryDate: values.deliveryDate ? values.deliveryDate.format("YYYY-MM-DD") : undefined,
        deliveryAddress: values.deliveryAddress,
        note: values.note,
        items: validItems,
      };
      await createSalesOrder(payload).unwrap();
      message.success("Secondary sales order booked successfully");
      setOrderModalOpen(false);
      orderForm.resetFields();
      setOrderItems([{ productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, taxRate: 0, lineTotal: 0 }]);
      ordersQuery.refetch();
      retailersQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create sales order");
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      message.success(`Order moved to ${newStatus}`);
      ordersQuery.refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to change order status");
    }
  };

  // Primary Order Handlers
  const handleCreatePrimaryOrder = async () => {
    try {
      const values = await primaryOrderForm.validateFields();
      const validItems = primaryOrderItems.filter((i) => i.productId && i.quantity > 0);
      if (validItems.length === 0) {
        message.error("Please add at least one valid product item");
        return;
      }
      const payload = {
        distributorId: values.distributorId,
        warehouseId: values.warehouseId,
        orderDate: values.orderDate ? values.orderDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        expectedDeliveryDate: values.expectedDeliveryDate ? values.expectedDeliveryDate.format("YYYY-MM-DD") : undefined,
        notes: values.notes,
        items: validItems,
      };
      await createPrimaryOrder(payload).unwrap();
      message.success("Primary order indent submitted successfully");
      setPrimaryOrderModalOpen(false);
      primaryOrderForm.resetFields();
      setPrimaryOrderItems([{ productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, lineTotal: 0 }]);
      primaryOrdersQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create primary order");
    }
  };

  const handlePrimaryStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updatePrimaryStatus({ id: orderId, status: newStatus }).unwrap();
      message.success(`Primary order status updated to ${newStatus}`);
      primaryOrdersQuery.refetch();
      stockQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update primary order status");
    }
  };

  // Attendance Check-in / Check-out
  const handleRepAttendance = async (type: "in" | "out") => {
    try {
      if (type === "in") {
        await checkInAttendance({ date: dayjs().format("YYYY-MM-DD") }).unwrap();
        message.success("Attendance checked in successfully");
      } else {
        await checkOutAttendance({ date: dayjs().format("YYYY-MM-DD"), remarks: "Shift completed" }).unwrap();
        message.success("Attendance checked out successfully");
      }
      attendanceQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Attendance action failed");
    }
  };

  // Field Visit Check-in / Check-out
  const handleVisitCheckIn = async (visitId: string) => {
    try {
      await checkInVisit({ id: visitId }).unwrap();
      message.success("Checked in to retailer visit");
      visitsQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Visit check-in failed");
    }
  };

  const openVisitOutcomeModal = (visit: any) => {
    setSelectedVisit(visit);
    visitForm.resetFields();
    setVisitOutcomeOpen(true);
  };

  const handleVisitOutcomeSubmit = async () => {
    try {
      const values = await visitForm.validateFields();
      await checkOutVisit({
        id: selectedVisit.id,
        outcome: values.outcome,
        orderAmount: values.orderAmount || 0,
        collectionAmount: values.collectionAmount || 0,
        note: values.note,
      }).unwrap();
      message.success("Visit outcome recorded and marked Completed");
      setVisitOutcomeOpen(false);
      visitsQuery.refetch();
      attendanceQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record visit outcome");
    }
  };

  // Collection Verification
  const openCollectionVerifyModal = (col: any) => {
    setSelectedCollection(col);
    collectionVerifyForm.resetFields();
    collectionVerifyForm.setFieldsValue({ status: "Verified", depositDate: dayjs() });
    setVerifyCollectionOpen(true);
  };

  const handleCollectionVerifySubmit = async () => {
    try {
      const values = await collectionVerifyForm.validateFields();
      await verifyCollection({
        id: selectedCollection.id,
        status: values.status,
        depositDate: values.depositDate ? values.depositDate.format("YYYY-MM-DD") : undefined,
        note: values.note,
      }).unwrap();
      message.success(`Collection marked as ${values.status}`);
      setVerifyCollectionOpen(false);
      collectionsQuery.refetch();
      retailersQuery.refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Collection verification failed");
    }
  };

  const totals = calculateOrderTotals(orderItems);

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
            <i className="ri-dashboard-3-line" />
          </span>
          <div>
            <h2 className="m-0 text-lg font-bold text-slate-800">SFA & DMS Operations Hub</h2>
            <p className="m-0 text-xs text-slate-500">Field sales, primary/secondary orders, inventory, collections & targets</p>
          </div>
        </div>

        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={refreshActive}>
            Refresh
          </Button>
          <Button
            type="primary"
            className="!bg-emerald-600 hover:!bg-emerald-700"
            icon={<PlusOutlined />}
            onClick={() => {
              orderForm.resetFields();
              setOrderItems([
                { productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, taxRate: 0, lineTotal: 0 },
              ]);
              setOrderModalOpen(true);
            }}
          >
            New Secondary Order
          </Button>
          <Button
            type="primary"
            icon={<TruckOutlined />}
            onClick={() => {
              primaryOrderForm.resetFields();
              setPrimaryOrderItems([{ productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, lineTotal: 0 }]);
              setPrimaryOrderModalOpen(true);
            }}
          >
            New Primary Indent
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => openCreateDrawer(activeTab === "master" ? masterSubTab : "territories")}
          >
            Add Record
          </Button>
        </Space>
      </div>

      {/* Main Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="bg-transparent"
        items={[
          // TAB 1: SECONDARY SALES ORDERS
          {
            key: "orders",
            label: (
              <span>
                <i className="ri-file-list-3-line mr-1 text-blue-600" />
                Secondary Orders
              </span>
            ),
            children: (
              <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="m-0 text-base font-semibold text-slate-800">Distributor → Retailer Secondary Orders</h3>
                    <p className="m-0 text-xs text-slate-500">Orders captured by field sales reps from retail outlets</p>
                  </div>
                  <Tag color="blue">{rows(ordersQuery.data).length} Total Orders</Tag>
                </div>
                <Table
                  rowKey="id"
                  loading={ordersQuery.isFetching}
                  dataSource={rows(ordersQuery.data)}
                  scroll={{ x: 900 }}
                  columns={[
                    { title: "Order #", dataIndex: "orderNumber", render: (val) => <span className="font-semibold text-blue-600">{val}</span> },
                    { title: "Date", dataIndex: "orderDate" },
                    {
                      title: "Retailer",
                      dataIndex: "retailerId",
                      render: (id) => retailerOptions.find((r) => r.value === id)?.label || id,
                    },
                    {
                      title: "Distributor",
                      dataIndex: "distributorId",
                      render: (id) => distributorOptions.find((d) => d.value === id)?.label || id || "—",
                    },
                    { title: "Net Total (BDT)", dataIndex: "netAmount", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                    { title: "Status", dataIndex: "status", render: renderStatus },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record:any) => (
                        <Space>
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => {
                              setSelectedOrder(record);
                              setOrderDetailsOpen(true);
                            }}
                          >
                            Details
                          </Button>
                          {record.status === "Submitted" && (
                            <Popconfirm title="Approve order?" onConfirm={() => handleOrderStatusChange(record.id, "Approved")}>
                              <Button size="small" type="primary">
                                Approve
                              </Button>
                            </Popconfirm>
                          )}
                          {record.status === "Approved" && (
                            <Popconfirm title="Dispatch order?" onConfirm={() => handleOrderStatusChange(record.id, "Dispatched")}>
                              <Button size="small" className="!bg-amber-600 !text-white">
                                Dispatch
                              </Button>
                            </Popconfirm>
                          )}
                          {record.status === "Dispatched" && (
                            <Popconfirm title="Mark as Delivered?" onConfirm={() => handleOrderStatusChange(record.id, "Delivered")}>
                              <Button size="small" className="!bg-emerald-600 !text-white">
                                Mark Delivered
                              </Button>
                            </Popconfirm>
                          )}
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            ),
          },

          // TAB 2: PRIMARY SALES (INDENTS)
          {
            key: "primaryOrders",
            label: (
              <span>
                <i className="ri-truck-line mr-1 text-indigo-600" />
                Primary Indents
              </span>
            ),
            children: (
              <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="m-0 text-base font-semibold text-slate-800">Company → Distributor Primary Orders</h3>
                    <p className="m-0 text-xs text-slate-500">Replenishment indents fulfilled from central factory/warehouses</p>
                  </div>
                  <Tag color="indigo">{rows(primaryOrdersQuery.data).length} Indents</Tag>
                </div>
                <Table
                  rowKey="id"
                  loading={primaryOrdersQuery.isFetching}
                  dataSource={rows(primaryOrdersQuery.data)}
                  scroll={{ x: 900 }}
                  columns={[
                    { title: "Indent #", dataIndex: "orderNumber", render: (val) => <span className="font-semibold text-indigo-600">{val}</span> },
                    { title: "Date", dataIndex: "orderDate" },
                    {
                      title: "Distributor",
                      dataIndex: "distributorId",
                      render: (id) => distributorOptions.find((d) => d.value === id)?.label || id,
                    },
                    {
                      title: "Warehouse",
                      dataIndex: "warehouseId",
                      render: (id) => warehouseOptions.find((w) => w.value === id)?.label || id || "Central Hub",
                    },
                    { title: "Net Amount (BDT)", dataIndex: "netAmount", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                    { title: "Status", dataIndex: "status", render: renderStatus },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record:any) => (
                        <Space>
                          {record.status === "Submitted" && (
                            <Popconfirm title="Approve primary indent?" onConfirm={() => handlePrimaryStatusChange(record.id, "Approved")}>
                              <Button size="small" type="primary">
                                Approve
                              </Button>
                            </Popconfirm>
                          )}
                          {record.status === "Approved" && (
                            <Popconfirm title="Dispatch primary indent?" onConfirm={() => handlePrimaryStatusChange(record.id, "Dispatched")}>
                              <Button size="small" className="!bg-amber-600 !text-white">
                                Dispatch
                              </Button>
                            </Popconfirm>
                          )}
                          {record.status === "Dispatched" && (
                            <Popconfirm
                              title="Confirm receipt at distributor warehouse? This will update distributor stock."
                              onConfirm={() => handlePrimaryStatusChange(record.id, "Received")}
                            >
                              <Button size="small" className="!bg-emerald-600 !text-white">
                                Receive Stock
                              </Button>
                            </Popconfirm>
                          )}
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            ),
          },

          // TAB 3: FIELD FORCE & SFA
          {
            key: "sfa",
            label: (
              <span>
                <i className="ri-map-pin-user-line mr-1 text-sky-600" />
                SFA & Field Execution
              </span>
            ),
            children: (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100 p-3">
                  <Radio.Group value={sfaSubTab} onChange={(e) => setSfaSubTab(e.target.value)} buttonStyle="solid">
                    <Radio.Button value="visits">Field Visits</Radio.Button>
                    <Radio.Button value="attendance">Daily Attendance</Radio.Button>
                    <Radio.Button value="collections">Field Collections</Radio.Button>
                  </Radio.Group>
                  <Space>
                    <Button size="small" type="primary" onClick={() => handleRepAttendance("in")}>
                      Check In Shift
                    </Button>
                    <Button size="small" onClick={() => handleRepAttendance("out")}>
                      Check Out Shift
                    </Button>
                  </Space>
                </div>

                {sfaSubTab === "visits" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="m-0 text-base font-semibold text-slate-800">Outlet Visits & Geo Check-Ins</h3>
                      <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateDrawer("visits")}>
                        Plan Visit
                      </Button>
                    </div>
                    <Table
                      rowKey="id"
                      loading={visitsQuery.isFetching}
                      dataSource={rows(visitsQuery.data)}
                      scroll={{ x: 850 }}
                      columns={[
                        { title: "Date", dataIndex: "visitDate" },
                        {
                          title: "Retailer Outlet",
                          dataIndex: "retailerId",
                          render: (id) => retailerOptions.find((r) => r.value === id)?.label || id,
                        },
                        {
                          title: "Sales Rep",
                          dataIndex: "salesRepId",
                          render: (id) => userOptions.find((u) => u.value === id)?.label || id,
                        },
                        { title: "Status", dataIndex: "status", render: renderStatus },
                        {
                          title: "Outcome",
                          dataIndex: "outcome",
                          render: (val) => <Tag color={val === "Order Placed" ? "success" : val === "No Order" ? "warning" : "default"}>{val}</Tag>,
                        },
                        { title: "Order Booked", dataIndex: "orderAmount", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record:any) => (
                            <Space>
                              {record.status === "Planned" && (
                                <Button size="small" type="primary" onClick={() => handleVisitCheckIn(record.id)}>
                                  Check In
                                </Button>
                              )}
                              {record.status === "In Progress" && (
                                <Button size="small" className="!bg-emerald-600 !text-white" onClick={() => openVisitOutcomeModal(record)}>
                                  Record Outcome
                                </Button>
                              )}
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {sfaSubTab === "attendance" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="m-0 text-base font-semibold text-slate-800">Sales Rep Daily Field Attendance</h3>
                    </div>
                    <Table
                      rowKey="id"
                      loading={attendanceQuery.isFetching}
                      dataSource={rows(attendanceQuery.data)}
                      columns={[
                        { title: "Date", dataIndex: "date" },
                        {
                          title: "Sales Rep",
                          dataIndex: "salesRepId",
                          render: (id) => userOptions.find((u) => u.value === id)?.label || id,
                        },
                        {
                          title: "Check In Time",
                          dataIndex: "checkInTime",
                          render: (t) => (t ? dayjs(t).format("hh:mm A") : "—"),
                        },
                        {
                          title: "Check Out Time",
                          dataIndex: "checkOutTime",
                          render: (t) => (t ? dayjs(t).format("hh:mm A") : "—"),
                        },
                        { title: "Total Visits", dataIndex: "totalVisits" },
                        { title: "Status", dataIndex: "status", render: renderStatus },
                      ]}
                    />
                  </Card>
                )}

                {sfaSubTab === "collections" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="m-0 text-base font-semibold text-slate-800">Field Collections & Payment Receipts</h3>
                      <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateDrawer("collections")}>
                        Record Collection
                      </Button>
                    </div>
                    <Table
                      rowKey="id"
                      loading={collectionsQuery.isFetching}
                      dataSource={rows(collectionsQuery.data)}
                      scroll={{ x: 800 }}
                      columns={[
                        { title: "Date", dataIndex: "collectionDate" },
                        {
                          title: "Retailer",
                          dataIndex: "retailerId",
                          render: (id) => retailerOptions.find((r) => r.value === id)?.label || id,
                        },
                        { title: "Method", dataIndex: "paymentMethod" },
                        { title: "Reference #", dataIndex: "referenceNumber" },
                        { title: "Amount (BDT)", dataIndex: "amount", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                        { title: "Status", dataIndex: "status", render: renderStatus },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record:any) => (
                            <Space>
                              {record.status === "Submitted" && (
                                <Button size="small" type="primary" onClick={() => openCollectionVerifyModal(record)}>
                                  Verify / Deposit
                                </Button>
                              )}
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}
              </div>
            ),
          },

          // TAB 4: DISTRIBUTOR STOCK & INVENTORY
          {
            key: "inventory",
            label: (
              <span>
                <i className="ri-archive-line mr-1 text-teal-600" />
                Distributor Stock
              </span>
            ),
            children: (
              <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="m-0 text-base font-semibold text-slate-800">Distributor Warehouse Inventory</h3>
                    <p className="m-0 text-xs text-slate-500">Auto-updated on primary order delivery and secondary dispatch</p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  loading={stockQuery.isFetching}
                  dataSource={rows(stockQuery.data)}
                  columns={[
                    {
                      title: "Distributor",
                      dataIndex: "distributorId",
                      render: (id) => distributorOptions.find((d) => d.value === id)?.label || id,
                    },
                    { title: "Product Name", dataIndex: "productName" },
                    { title: "SKU", dataIndex: "productSku" },
                    { title: "UoM", dataIndex: "uom" },
                    {
                      title: "Available Stock",
                      dataIndex: "availableQuantity",
                      render: (qty) => (
                        <span className={`font-bold ${Number(qty) <= 10 ? "text-red-500" : "text-slate-800"}`}>
                          {qty} {Number(qty) <= 10 && <Tag color="error">Low Stock</Tag>}
                        </span>
                      ),
                    },
                    {
                      title: "Last Restocked",
                      dataIndex: "lastRestockedAt",
                      render: (d) => (d ? dayjs(d).format("YYYY-MM-DD hh:mm A") : "—"),
                    },
                  ]}
                />
              </Card>
            ),
          },

          // TAB 5: DISTRIBUTION MASTER DATA
          {
            key: "master",
            label: (
              <span>
                <i className="ri-store-2-line mr-1 text-indigo-600" />
                Distribution Network
              </span>
            ),
            children: (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100 p-3">
                  <Radio.Group value={masterSubTab} onChange={(e) => setMasterSubTab(e.target.value)} buttonStyle="solid">
                    <Radio.Button value="distributors">Distributors</Radio.Button>
                    <Radio.Button value="retailers">Retailer Outlets</Radio.Button>
                    <Radio.Button value="territories">Territories</Radio.Button>
                    <Radio.Button value="routes">Routes / Beats</Radio.Button>
                    <Radio.Button value="regions">Regions & Areas</Radio.Button>
                  </Radio.Group>
                  <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateDrawer(masterSubTab)}>
                    Add {masterSubTab.slice(0, -1)}
                  </Button>
                </div>

                {masterSubTab === "distributors" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <Table
                      rowKey="id"
                      loading={distributorsQuery.isFetching}
                      dataSource={rows(distributorsQuery.data)}
                      scroll={{ x: 950 }}
                      columns={[
                        { title: "Code", dataIndex: "code", render: (val) => <span className="font-semibold">{val}</span> },
                        { title: "Distributor Name", dataIndex: "name" },
                        { title: "Contact Person", dataIndex: "contactName" },
                        { title: "Phone", dataIndex: "phone" },
                        { title: "Credit Limit", dataIndex: "creditLimit", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                        { title: "Security Deposit", dataIndex: "securityDeposit", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                        {
                          title: "Onboarding Status",
                          dataIndex: "onboardingStatus",
                          render: (val) => (
                            <Tag color={val === "Approved" ? "success" : val === "Blocked" ? "error" : "warning"}>{val}</Tag>
                          ),
                        },
                        { title: "Active", dataIndex: "active", render: renderActive },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record:any) => (
                            <Space>
                              <Button size="small" icon={<EditOutlined />} onClick={() => openEditDrawer("distributors", record)}>
                                Edit
                              </Button>
                              {record.onboardingStatus !== "Approved" && (
                                <Button
                                  size="small"
                                  type="primary"
                                  icon={<CheckCircleOutlined />}
                                  onClick={() => handleOnboardingChange(record.id, "Approved")}
                                >
                                  Approve
                                </Button>
                              )}
                              {record.onboardingStatus !== "Blocked" && (
                                <Button
                                  size="small"
                                  danger
                                  icon={<StopOutlined />}
                                  onClick={() => handleOnboardingChange(record.id, "Blocked", "Administrative Hold")}
                                >
                                  Block
                                </Button>
                              )}
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {masterSubTab === "retailers" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <Table
                      rowKey="id"
                      loading={retailersQuery.isFetching}
                      dataSource={rows(retailersQuery.data)}
                      scroll={{ x: 900 }}
                      columns={[
                        { title: "Code", dataIndex: "code", render: (val) => <span className="font-semibold">{val}</span> },
                        { title: "Outlet Name", dataIndex: "name" },
                        { title: "Channel", dataIndex: "channel", render: (val) => <Tag color="blue">{val || "Grocery"}</Tag> },
                        {
                          title: "Distributor",
                          dataIndex: "distributorId",
                          render: (id) => distributorOptions.find((d) => d.value === id)?.label || id || "—",
                        },
                        { title: "Owner", dataIndex: "ownerName" },
                        { title: "Phone", dataIndex: "phone" },
                        { title: "Credit Limit", dataIndex: "creditLimit", render: (val) => `৳ ${Number(val || 0).toLocaleString()}` },
                        {
                          title: "Outstanding",
                          dataIndex: "outstandingBalance",
                          render: (val) => (
                            <span className={`font-semibold ${Number(val) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                              ৳ {Number(val || 0).toLocaleString()}
                            </span>
                          ),
                        },
                        { title: "Active", dataIndex: "active", render: renderActive },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record) => (
                            <Button size="small" icon={<EditOutlined />} onClick={() => openEditDrawer("retailers", record)}>
                              Edit
                            </Button>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {masterSubTab === "territories" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <Table
                      rowKey="id"
                      loading={territoriesQuery.isFetching}
                      dataSource={rows(territoriesQuery.data)}
                      columns={[
                        { title: "Code", dataIndex: "code" },
                        { title: "Territory Name", dataIndex: "name" },
                        { title: "Division", dataIndex: "division" },
                        { title: "District", dataIndex: "district" },
                        { title: "Active", dataIndex: "active", render: renderActive },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record) => (
                            <Button size="small" icon={<EditOutlined />} onClick={() => openEditDrawer("territories", record)}>
                              Edit
                            </Button>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {masterSubTab === "routes" && (
                  <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                    <Table
                      rowKey="id"
                      loading={routesQuery.isFetching}
                      dataSource={rows(routesQuery.data)}
                      columns={[
                        { title: "Code", dataIndex: "code" },
                        { title: "Route / Beat", dataIndex: "name" },
                        {
                          title: "Territory",
                          dataIndex: "territoryId",
                          render: (id) => territoryOptions.find((t) => t.value === id)?.label || id,
                        },
                        {
                          title: "Assigned Rep",
                          dataIndex: "assignedUserId",
                          render: (id) => userOptions.find((u) => u.value === id)?.label || id || "Unassigned",
                        },
                        { title: "Visit Day", dataIndex: "visitDay" },
                        { title: "Active", dataIndex: "active", render: renderActive },
                        {
                          title: "Actions",
                          key: "actions",
                          render: (_, record) => (
                            <Button size="small" icon={<EditOutlined />} onClick={() => openEditDrawer("routes", record)}>
                              Edit
                            </Button>
                          ),
                        },
                      ]}
                    />
                  </Card>
                )}

                {masterSubTab === "regions" && (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card title="Sales Regions" className="!border-slate-200 shadow-sm">
                      <Table
                        rowKey="id"
                        dataSource={rows(regionsQuery.data)}
                        columns={[
                          { title: "Code", dataIndex: "code" },
                          { title: "Region", dataIndex: "name" },
                          { title: "Status", dataIndex: "active", render: renderActive },
                        ]}
                      />
                    </Card>
                    <Card title="Sales Areas" className="!border-slate-200 shadow-sm">
                      <Table
                        rowKey="id"
                        dataSource={rows(areasQuery.data)}
                        columns={[
                          { title: "Code", dataIndex: "code" },
                          { title: "Area", dataIndex: "name" },
                          {
                            title: "Region",
                            dataIndex: "regionId",
                            render: (id) => regionOptions.find((r) => r.value === id)?.label || id,
                          },
                          { title: "Status", dataIndex: "active", render: renderActive },
                        ]}
                      />
                    </Card>
                  </div>
                )}
              </div>
            ),
          },

          // TAB 6: TARGETS & PERFORMANCE
          {
            key: "targets",
            label: (
              <span>
                <i className="ri-focus-3-line mr-1 text-rose-600" />
                Targets & KPIs
              </span>
            ),
            children: (
              <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="m-0 text-base font-semibold text-slate-800">Sales Rep Targets & Performance Achievements</h3>
                    <p className="m-0 text-xs text-slate-500">Calculated in real-time from active secondary orders, collections and visits</p>
                  </div>
                  <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateDrawer("targets")}>
                    Set Target
                  </Button>
                </div>
                <Table
                  rowKey="id"
                  loading={targetsQuery.isFetching}
                  dataSource={rows(targetsQuery.data)}
                  scroll={{ x: 800 }}
                  columns={[
                    {
                      title: "Sales Rep",
                      dataIndex: "salesRepId",
                      render: (id) => userOptions.find((u) => u.value === id)?.label || id,
                    },
                    { title: "Period", dataIndex: "period" },
                    {
                      title: "Sales Target",
                      dataIndex: "salesTarget",
                      render: (val) => `৳ ${Number(val || 0).toLocaleString()}`,
                    },
                    {
                      title: "Actual Sales",
                      dataIndex: "actualSales",
                      render: (val) => `৳ ${Number(val || 0).toLocaleString()}`,
                    },
                    {
                      title: "Sales Achievement",
                      dataIndex: "salesAchievedPct",
                      render: (pct) => (
                        <div className="w-32">
                          <Progress
                            percent={Math.min(pct || 0, 100)}
                            format={() => `${pct}%`}
                            status={pct >= 100 ? "success" : "active"}
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Collection Target",
                      dataIndex: "collectionTarget",
                      render: (val) => `৳ ${Number(val || 0).toLocaleString()}`,
                    },
                    {
                      title: "Actual Collection",
                      dataIndex: "actualCollection",
                      render: (val) => `৳ ${Number(val || 0).toLocaleString()}`,
                    },
                    {
                      title: "Visits Done / Target",
                      key: "visits",
                      render: (_, r:any) => `${r.actualVisits || 0} / ${r.visitTarget || 0}`,
                    },
                  ]}
                />
              </Card>
            ),
          },

          // TAB 7: SCHEMES & PROMOTIONS
          {
            key: "schemes",
            label: (
              <span>
                <i className="ri-percent-line mr-1 text-emerald-600" />
                Trade Schemes
              </span>
            ),
            children: (
              <Card className="!border-slate-200 shadow-sm" bodyStyle={{ padding: 16 }}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="m-0 text-base font-semibold text-slate-800">Trade Promotions & Volume Discounts</h3>
                  <Button size="small" icon={<PlusOutlined />} onClick={() => openCreateDrawer("schemes")}>
                    New Scheme
                  </Button>
                </div>
                <Table
                  rowKey="id"
                  dataSource={rows(schemesQuery.data)}
                  columns={[
                    { title: "Code", dataIndex: "code" },
                    { title: "Scheme Name", dataIndex: "name" },
                    { title: "Type", dataIndex: "schemeType" },
                    { title: "Min Qty", dataIndex: "minQuantity" },
                    { title: "Discount %", dataIndex: "discountPercentage", render: (val) => `${val || 0}%` },
                    { title: "Flat Discount", dataIndex: "flatDiscount", render: (val) => `৳ ${val || 0}` },
                    { title: "Active", dataIndex: "active", render: renderActive },
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* MODAL: CREATE SECONDARY SALES ORDER WITH LINE ITEMS */}
      <Modal
        title="Book Secondary Sales Order"
        open={orderModalOpen}
        onCancel={() => setOrderModalOpen(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setOrderModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={creatingSalesOrder} onClick={handleCreateSalesOrder}>
            Book Order (৳ {totals.net.toLocaleString()})
          </Button>,
        ]}
      >
        <Form form={orderForm} layout="vertical">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Form.Item name="retailerId" label="Retailer Outlet" rules={[{ required: true, message: "Retailer is required" }]}>
              <Select
                showSearch
                placeholder="Select Retailer"
                options={retailerOptions}
                onChange={(retailerId) => {
                  const ret = rows(retailersQuery.data).find((r: any) => r.id === retailerId);
                  if (ret) {
                    orderForm.setFieldsValue({
                      distributorId: ret.distributorId,
                      deliveryAddress: ret.address,
                    });
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="distributorId" label="Fulfilling Distributor">
              <Select showSearch allowClear placeholder="Select Distributor" options={distributorOptions} />
            </Form.Item>
            <Form.Item name="salesRepId" label="Sales Rep">
              <Select showSearch allowClear placeholder="Select Rep" options={userOptions} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Form.Item name="orderDate" label="Order Date" initialValue={dayjs()}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="deliveryDate" label="Expected Delivery">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="deliveryAddress" label="Delivery Address">
              <Input placeholder="Outlet address" />
            </Form.Item>
          </div>

          <Divider className="my-3">Order Line Items</Divider>

          <div className="space-y-2">
            {orderItems.map((item, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="min-w-[200px] flex-1">
                  <span className="text-xs text-slate-500">Product SKU</span>
                  <Select
                    className="w-full"
                    showSearch
                    placeholder="Select Product"
                    value={item.productId || undefined}
                    options={productOptions}
                    onChange={(val) => updateOrderItemField(idx, "productId", val)}
                  />
                </div>
                <div className="w-20">
                  <span className="text-xs text-slate-500">Qty</span>
                  <InputNumber
                    className="w-full"
                    min={1}
                    value={item.quantity}
                    onChange={(val) => updateOrderItemField(idx, "quantity", val)}
                  />
                </div>
                <div className="w-24">
                  <span className="text-xs text-slate-500">Unit Price</span>
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={item.unitPrice}
                    onChange={(val) => updateOrderItemField(idx, "unitPrice", val)}
                  />
                </div>
                <div className="w-20">
                  <span className="text-xs text-slate-500">Disc (৳)</span>
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={item.discountAmount}
                    onChange={(val) => updateOrderItemField(idx, "discountAmount", val)}
                  />
                </div>
                <div className="w-20">
                  <span className="text-xs text-slate-500">Tax (%)</span>
                  <InputNumber
                    className="w-full"
                    min={0}
                    max={100}
                    value={item.taxRate}
                    onChange={(val) => updateOrderItemField(idx, "taxRate", val)}
                  />
                </div>
                <div className="w-28 text-right">
                  <span className="text-xs text-slate-500">Line Total</span>
                  <div className="font-semibold text-slate-800">৳ {Number(item.lineTotal || 0).toLocaleString()}</div>
                </div>
                <div>
                  <span className="invisible block text-xs">Del</span>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={orderItems.length === 1}
                    onClick={() => removeOrderItemRow(idx)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Button size="small" icon={<PlusOutlined />} onClick={addOrderItemRow}>
              Add Product Line
            </Button>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-right">
              <div className="text-xs text-slate-500">
                Gross: ৳ {totals.gross.toLocaleString()} | Disc: ৳ {totals.disc.toLocaleString()} | Tax: ৳{" "}
                {totals.tax.toLocaleString()}
              </div>
              <div className="mt-1 text-base font-bold text-emerald-700">Net Payable: ৳ {totals.net.toLocaleString()}</div>
            </div>
          </div>
        </Form>
      </Modal>

      {/* MODAL: CREATE PRIMARY INDENT */}
      <Modal
        title="Create Primary Order Indent"
        open={primaryOrderModalOpen}
        onCancel={() => setPrimaryOrderModalOpen(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setPrimaryOrderModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={creatingPrimaryOrder} onClick={handleCreatePrimaryOrder}>
            Submit Indent
          </Button>,
        ]}
      >
        <Form form={primaryOrderForm} layout="vertical">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Form.Item name="distributorId" label="Distributor" rules={[{ required: true, message: "Distributor is required" }]}>
              <Select showSearch placeholder="Select Distributor" options={distributorOptions} />
            </Form.Item>
            <Form.Item name="warehouseId" label="Fulfilling Central Warehouse">
              <Select showSearch allowClear placeholder="Select Warehouse" options={warehouseOptions} />
            </Form.Item>
            <Form.Item name="orderDate" label="Order Date" initialValue={dayjs()}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <Divider className="my-3">Products</Divider>

          {primaryOrderItems.map((item, idx) => (
            <div key={idx} className="mb-2 flex items-center gap-2">
              <Select
                className="flex-1"
                showSearch
                placeholder="Product"
                value={item.productId || undefined}
                options={productOptions}
                onChange={(val) => {
                  const updated = [...primaryOrderItems];
                  updated[idx].productId = val;
                  const p = productOptions.find((x:any) => x.value === val);
                  if (p) {
                    updated[idx].productName = p.label;
                    updated[idx].unitPrice = p.price;
                  }
                  updated[idx].lineTotal = (Number(updated[idx].quantity) || 1) * Number(updated[idx].unitPrice || 0);
                  setPrimaryOrderItems(updated);
                }}
              />
              <InputNumber
                className="w-24"
                min={1}
                placeholder="Qty"
                value={item.quantity}
                onChange={(val) => {
                  const updated = [...primaryOrderItems];
                  updated[idx].quantity = val;
                  updated[idx].lineTotal = Number(val || 1) * Number(updated[idx].unitPrice || 0);
                  setPrimaryOrderItems(updated);
                }}
              />
              <InputNumber
                className="w-28"
                min={0}
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(val) => {
                  const updated = [...primaryOrderItems];
                  updated[idx].unitPrice = val;
                  updated[idx].lineTotal = (Number(updated[idx].quantity) || 1) * Number(val || 0);
                  setPrimaryOrderItems(updated);
                }}
              />
              <span className="w-28 text-right font-semibold">৳ {Number(item.lineTotal || 0).toLocaleString()}</span>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={primaryOrderItems.length === 1}
                onClick={() => {
                  if (primaryOrderItems.length > 1) {
                    setPrimaryOrderItems(primaryOrderItems.filter((_, i) => i !== idx));
                  }
                }}
              />
            </div>
          ))}

          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              setPrimaryOrderItems([
                ...primaryOrderItems,
                { productId: "", productName: "", quantity: 1, unitPrice: 0, discountAmount: 0, lineTotal: 0 },
              ])
            }
          >
            Add SKU
          </Button>
        </Form>
      </Modal>

      {/* DRAWER: ORDER DETAILS WITH ITEMS BREAKDOWN */}
      <Drawer
        title={`Order Details: ${selectedOrder?.orderNumber || ""}`}
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        width={600}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
              <div>
                <span className="text-slate-500">Retailer Outlet:</span>
                <p className="m-0 font-medium">{retailerOptions.find((r) => r.value === selectedOrder.retailerId)?.label || selectedOrder.retailerId}</p>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <p className="m-0">{renderStatus(selectedOrder.status)}</p>
              </div>
              <div>
                <span className="text-slate-500">Order Date:</span>
                <p className="m-0 font-medium">{selectedOrder.orderDate}</p>
              </div>
              <div>
                <span className="text-slate-500">Net Amount:</span>
                <p className="m-0 text-base font-bold text-emerald-600">৳ {Number(selectedOrder.netAmount || 0).toLocaleString()}</p>
              </div>
            </div>

            <Divider className="my-2">Line Items</Divider>

            <Table
              rowKey="id"
              size="small"
              loading={fetchingOrderItems}
              dataSource={rows(orderItemsData)}
              pagination={false}
              columns={[
                { title: "Product", dataIndex: "productName" },
                { title: "Qty", dataIndex: "quantity" },
                { title: "Unit Price", dataIndex: "unitPrice", render: (val) => `৳ ${val}` },
                { title: "Tax", dataIndex: "taxAmount", render: (val) => `৳ ${val}` },
                { title: "Line Total", dataIndex: "lineTotal", render: (val) => `৳ ${Number(val).toLocaleString()}` },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* MODAL: VISIT OUTCOME */}
      <Modal
        title="Record Field Visit Outcome"
        open={visitOutcomeOpen}
        onCancel={() => setVisitOutcomeOpen(false)}
        onOk={handleVisitOutcomeSubmit}
        confirmLoading={checkingOutVisit}
      >
        <Form form={visitForm} layout="vertical">
          <Form.Item name="outcome" label="Visit Result" rules={[{ required: true, message: "Outcome is required" }]}>
            <Select
              options={[
                { value: "Order Placed", label: "Order Placed" },
                { value: "No Order", label: "No Order (Stock available)" },
                { value: "Collection Only", label: "Collection Only" },
                { value: "Shop Closed", label: "Shop Closed / Owner Unavailable" },
              ]}
            />
          </Form.Item>
          <Form.Item name="orderAmount" label="Order Value Booked (BDT)">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="collectionAmount" label="Payment Amount Collected (BDT)">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="note" label="Visit Remarks">
            <Input.TextArea rows={3} placeholder="Customer feedback, market observations..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL: VERIFY COLLECTION */}
      <Modal
        title="Verify & Deposit Collection"
        open={verifyCollectionOpen}
        onCancel={() => setVerifyCollectionOpen(false)}
        onOk={handleCollectionVerifySubmit}
        confirmLoading={verifyingCollection}
      >
        <Form form={collectionVerifyForm} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "Verified", label: "Verified (Awaiting Bank Deposit)" },
                { value: "Deposited", label: "Deposited into Account" },
                { value: "Rejected", label: "Rejected / Dishonored" },
              ]}
            />
          </Form.Item>
          <Form.Item name="depositDate" label="Deposit Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="note" label="Accounting Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* GENERIC CRUD DRAWER */}
      <Drawer
        title={`${editingRecord ? "Edit" : "Add"} ${currentResource.slice(0, -1)}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        extra={
          <Button type="primary" loading={creatingGeneric || updatingGeneric} onClick={saveGenericRecord}>
            Save
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Code" rules={[{ required: true, message: "Code is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
            <Input />
          </Form.Item>

          {currentResource === "areas" && (
            <Form.Item name="regionId" label="Parent Region" rules={[{ required: true }]}>
              <Select showSearch placeholder="Select Region" options={regionOptions} />
            </Form.Item>
          )}

          {currentResource === "territories" && (
            <>
              <Form.Item name="division" label="Division">
                <Input />
              </Form.Item>
              <Form.Item name="district" label="District">
                <Input />
              </Form.Item>
              <Form.Item name="areaId" label="Area">
                <Select showSearch allowClear options={options(rows(areasQuery.data))} />
              </Form.Item>
            </>
          )}

          {currentResource === "distributors" && (
            <>
              <Form.Item name="territoryId" label="Territory">
                <Select showSearch allowClear options={territoryOptions} />
              </Form.Item>
              <Form.Item name="warehouseId" label="Warehouse">
                <Select showSearch allowClear options={warehouseOptions} />
              </Form.Item>
              <Form.Item name="contactName" label="Contact Person">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
              <Form.Item name="tradeLicenseNumber" label="Trade License No">
                <Input />
              </Form.Item>
              <Form.Item name="creditLimit" label="Credit Limit (BDT)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
              <Form.Item name="securityDeposit" label="Security Deposit (BDT)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </>
          )}

          {currentResource === "retailers" && (
            <>
              <Form.Item name="distributorId" label="Assigned Distributor">
                <Select showSearch allowClear options={distributorOptions} />
              </Form.Item>
              <Form.Item name="territoryId" label="Territory">
                <Select showSearch allowClear options={territoryOptions} />
              </Form.Item>
              <Form.Item name="channel" label="Outlet Channel">
                <Select
                  options={[
                    { value: "Grocery", label: "Grocery / General Store" },
                    { value: "Pharmacy", label: "Pharmacy" },
                    { value: "Supermarket", label: "Supermarket / Hypermarket" },
                    { value: "Wholesale", label: "Wholesale Trader" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="ownerName" label="Owner Name">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="creditLimit" label="Credit Limit (BDT)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </>
          )}

          {currentResource === "routes" && (
            <>
              <Form.Item name="territoryId" label="Territory">
                <Select showSearch allowClear options={territoryOptions} />
              </Form.Item>
              <Form.Item name="assignedUserId" label="Assigned Sales Rep">
                <Select showSearch allowClear options={userOptions} />
              </Form.Item>
              <Form.Item name="visitDay" label="Visit Day">
                <Select
                  options={["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => ({
                    value: d,
                    label: d,
                  }))}
                />
              </Form.Item>
            </>
          )}

          {currentResource === "schemes" && (
            <>
              <Form.Item name="schemeType" label="Scheme Type">
                <Select
                  options={[
                    { value: "Percentage", label: "Percentage Discount" },
                    { value: "Flat", label: "Flat BDT Discount" },
                    { value: "BuyXGetYFree", label: "Buy X Get Y Free" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="minQuantity" label="Min Order Qty">
                <InputNumber className="w-full" min={1} />
              </Form.Item>
              <Form.Item name="discountPercentage" label="Discount %">
                <InputNumber className="w-full" min={0} max={100} />
              </Form.Item>
              <Form.Item name="flatDiscount" label="Flat Discount (BDT)">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </>
          )}

          <Form.Item name="active" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

