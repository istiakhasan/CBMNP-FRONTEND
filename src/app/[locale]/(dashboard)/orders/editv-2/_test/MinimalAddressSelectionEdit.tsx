"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Select,
  Input,
  Modal,
  Tag,
  Form,
  message,
  Checkbox,
} from "antd";
import {
  HomeOutlined,
  BankOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/api/customerApi";
import axios from "axios";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { EditOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MinimalAddressSelectionProps {
  customer: any;
  addresses: any[];
  onAddressUpdate: (addresses: any[]) => void;
  selectedDeliveryAddress?: any;
  onDeliveryAddressSelect: (address: any) => void;
  /** Optional controlled free-delivery state. If omitted, component manages it internally. */
  isFreeDelivery?: boolean;
  /** Called whenever admin toggles the "Free Delivery" checkbox. Use this to zero-out shipping in the order total. */
  onFreeDeliveryChange?: (isFree: boolean) => void;
  /** Real shipping charge from order state (orderDetails.shippingCharge). Used to detect manual overrides. */
  shippingCharge?: number;
  /** Order's shippingType (e.g. "Free" | "Regular"). When "Free", shipping always shows ৳0. */
  shippingType?: string;
}

export default function MinimalAddressSelectionEdit({
  customer,
  addresses,
  onAddressUpdate,
  selectedDeliveryAddress,
  onDeliveryAddressSelect,
  isFreeDelivery: isFreeDeliveryProp,
  onFreeDeliveryChange,
  shippingCharge,
  shippingType,
}: MinimalAddressSelectionProps) {
  const [divisionData, setDivisionData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [thanaData, setThanaData] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = Form.useForm();
  const [createAddress] = useAddAddressMutation();

  // Local fallback so this still works if parent doesn't control free delivery
  const [isFreeDeliveryLocal, setIsFreeDeliveryLocal] = useState(false);
  const isFreeDelivery = isFreeDeliveryProp ?? isFreeDeliveryLocal;

  const handleFreeDeliveryToggle = (checked: boolean) => {
    setIsFreeDeliveryLocal(checked);
    onFreeDeliveryChange?.(checked);
    message.success(
      checked
        ? "ফ্রি ডেলিভারি চালু করা হয়েছে"
        : "ফ্রি ডেলিভারি বন্ধ করা হয়েছে",
    );
  };

  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/divisions`)
      .then((res) => setDivisionData(res?.data))
      .catch((error) => console.log(error));
  }, []);
  const getAddressIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <HomeOutlined />;
      case "Office":
        return <BankOutlined />;
      default:
        return <EnvironmentOutlined />;
    }
  };

  // NOTE: this checks DIVISION, not district. Make sure you call it with addr.division.
  const getShippingCost = (division?: string) => {
    const normalized = division?.trim().toLowerCase();
    if (normalized === "dhaka") return 70;
    return 130;
  };

  // Resolves the shipping cost to DISPLAY on the address card, taking into
  // account the real order state instead of always recalculating.
  // 1) shippingType === "Free" -> always ৳0 (not treated as manual).
  // 2) if shippingCharge matches the standard division formula -> show standard.
  // 3) if shippingCharge differs from standard (and not Free) -> it's a
  //    manual override, so show the actual shippingCharge.
  const resolveShippingCost = (division?: string) => {
    if (shippingType === "Free") return 0;

    const standard = getShippingCost(division);

    if (
      shippingCharge !== undefined &&
      shippingCharge !== null &&
      shippingCharge !== standard
    ) {
      return shippingCharge; // manual charge
    }

    return standard;
  };

  const [updateAddress] = useUpdateAddressMutation();
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    form.setFieldsValue({
      label: addr.label,
      receiverName: addr.receiverName,
      receiverPhoneNumber: addr.receiverPhoneNumber,
      address: addr.address,
      divisionName: addr.division,
      districtName: addr.district,
      thanaName: addr.thana,
      relationship: addr.relationship,
      isDefault: addr.isDefault,
    });
    setShowAddModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        label: values.label,
        receiverName: values.receiverName || customer.customerName,
        receiverPhoneNumber:
          values.receiverPhoneNumber || customer.customerPhoneNumber,
        division: values.divisionName,
        district: values.districtName,
        thana: values.thanaName,
        address: values.address,
        relationship: values.relationship || null,
        isDefault: values.isDefault ?? addresses.length === 0,
        customerId: customer.id,
      };

      if (editingAddressId) {
        const updated = await updateAddress({
          id: editingAddressId,
          ...payload,
        }).unwrap();

        const updatedAddresses = addresses.map((a) =>
          a.id === editingAddressId ? updated?.data : a,
        );
        onAddressUpdate(updatedAddresses);
        if (selectedDeliveryAddress?.id === editingAddressId) {
          onDeliveryAddressSelect(updated?.data);
        }
        message.success("Address updated successfully!");
      } else {
        const newAddress = await createAddress(payload).unwrap();
        const updatedAddresses = [...addresses, newAddress?.data];
        onAddressUpdate(updatedAddresses);
        onDeliveryAddressSelect(newAddress?.data);
        message.success("Address added successfully!");
      }

      form.resetFields();
      setEditingAddressId(null);
      setShowAddModal(false);
    } catch (error) {
      console.log(error);
      message.error("Please fill in required fields");
    }
  };
  const handleDivisionChange = (divisionId: any) => {
    const divisionObj = divisionData.find((d) => d.id === divisionId);
    form.setFieldsValue({
      divisionId,
      divisionName: divisionObj?.name_en,
      district: null,
      districtId: null,
      districtName: null,
      thana: null,
      thanaId: null,
      thanaName: null,
    });
    setDistrictData([]);
    setThanaData([]);

    axios
      .get(`${getBaseUrl()}/divisions/${divisionId}`)
      .then((res) => setDistrictData(res?.data?.district_info))
      .catch((error) => console.log(error));
  };

  const handleDistrictChange = (districtId: any) => {
    const districtObj = districtData.find((d) => d.id === districtId);
    form.setFieldsValue({
      districtId,
      districtName: districtObj?.name_en,
      thana: null,
      thanaId: null,
      thanaName: null,
    });
    setThanaData([]);

    axios
      .get(`${getBaseUrl()}/districts/${districtId}`)
      .then((res) => setThanaData(res?.data?.thana_info))
      .catch((error) => console.log(error));
  };

  const handleThanaChange = (thanaId: any) => {
    const thanaObj = thanaData.find((t) => t.id === thanaId);
    form.setFieldsValue({
      thanaId,
      thanaName: thanaObj?.name_en,
    });
  };

  const generateDefaultAddress = async () => {
    if (!customer?.address) {
      message.warning("Customer এর address তথ্য পাওয়া যায়নি");
      return;
    }

    try {
      const payload = {
        label:
          customer?.customerType === "PROBASHI"
            ? "Receiver Address"
            : "Main Address",
        receiverName: customer?.customerName,
        receiverPhoneNumber: customer?.customerPhoneNumber,
        division: customer?.division,
        district: customer?.district,
        thana: customer?.thana,
        address: customer?.address,
        relationship: null,
        isDefault: addresses.length === 0,
        customerId: customer.id,
      };

      const newAddress = await createAddress(payload).unwrap();

      const updatedAddresses = [...addresses, newAddress?.data];
      onAddressUpdate(updatedAddresses);
      onDeliveryAddressSelect(newAddress?.data);

      message.success("Default address created");
    } catch (error) {
      console.log(error);
      message.error("Address create করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);
    onAddressUpdate(updatedAddresses);

    if (
      selectedDeliveryAddress?.id === addressId &&
      updatedAddresses.length > 0
    ) {
      onDeliveryAddressSelect(updatedAddresses[0]);
    }

    message.info("Address removed");
  };
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>
            <EnvironmentOutlined style={{ color: "#fa541c", marginRight: 8 }} />
            Delivery Address
          </span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
          >
            Add
          </Button>
        </div>
      }
    >
      {addresses?.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <EnvironmentOutlined style={{ fontSize: 40, color: "#d9d9d9" }} />
          <p>No delivery addresses found</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Button onClick={generateDefaultAddress}>Use Customer Info</Button>
            <Button type="primary" onClick={() => setShowAddModal(true)}>
              Add New
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Form.Item label="Select Delivery Address">
            <Select
              value={selectedDeliveryAddress?.id}
              placeholder="Choose delivery address"
              onChange={(id) => {
                const address = addresses?.find((a: any) => a.id === id);
                if (address) onDeliveryAddressSelect(address);
              }}
            >
              {addresses?.map((addr: any) => (
                <Select.Option key={addr.id} value={addr.id}>
                  {getAddressIcon(addr.type)} {addr.label} - {addr.address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Available Addresses ({addresses?.length})
            </Text>
            <div style={{ marginTop: 8 }}>
              {addresses?.map((addr: any) => {
                if (selectedDeliveryAddress?.id === addr.id) {
                  const shippingCost = resolveShippingCost(addr.division);
                  return (
                    <Card
                      size="small"
                      key={addr.id}
                      style={{
                        marginBottom: 12,
                        border:
                          selectedDeliveryAddress?.id === addr.id
                            ? "1px solid #52c41a"
                            : "1px solid #f0f0f0",
                        background:
                          selectedDeliveryAddress?.id === addr.id
                            ? "#f6ffed"
                            : "white",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Title level={5} style={{ margin: 0 }}>
                            {getAddressIcon(addr.type)} {addr.label}{" "}
                            <Tag>{addr.type}</Tag>
                            {selectedDeliveryAddress?.id === addr.id && (
                              <Tag color="green">Selected</Tag>
                            )}
                            {addr.isDefault && <Tag color="blue">Default</Tag>}
                          </Title>
                          <Text type="secondary">{addr.address}</Text>
                          <br />
                          {(addr.district || addr.division) && (
                            <Text type="success">
                              📍 {addr.district}
                              {" - "}
                              {isFreeDelivery ? (
                                <>
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "#999",
                                      marginRight: 6,
                                    }}
                                  >
                                    ৳{shippingCost}
                                  </span>
                                  <Tag color="gold">ফ্রি ডেলিভারি</Tag>
                                </>
                              ) : (
                                <>৳{shippingCost} shipping</>
                              )}
                            </Text>
                          )}
                          {/* <div style={{ marginTop: 8 }}>
                            <Checkbox
                              checked={isFreeDelivery}
                              onChange={(e) =>
                                handleFreeDeliveryToggle(e.target.checked)
                              }
                            >
                              ফ্রি ডেলিভারি
                            </Checkbox>
                          </div> */}
                        </div>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => handleEditAddress(addr)}
                        />
                        <Button
                          danger
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteAddress(addr.id)}
                        />
                      </div>
                    </Card>
                  );
                }
              })}
            </div>
          </div>
        </>
      )}

      {/* Add Address Modal */}
      <Modal
        title={
          editingAddressId
            ? "Edit Delivery Address"
            : "Add New Delivery Address"
        }
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          setEditingAddressId(null);
          form.resetFields();
        }}
        onOk={handleSaveAddress}
        okText={editingAddressId ? "Update Address" : "Add Address"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="divisionName" hidden />
          <Form.Item name="districtName" hidden />
          <Form.Item name="thanaName" hidden />
          <Form.Item
            label="Address Label"
            name="label"
            rules={[
              { required: true, message: "Please enter an address label" },
            ]}
          >
            <Input placeholder="e.g., Home, Office, Warehouse" />
          </Form.Item>

          <Form.Item
            label="Receiver Name"
            name="receiverName"
            rules={[
              { required: true, message: "Please enter receiver's name" },
            ]}
          >
            <Input placeholder={customer?.customerName} />
          </Form.Item>

          <Form.Item
            label="Receiver Phone Number"
            name="receiverPhoneNumber"
            rules={[
              { required: true, message: "Please enter receiver's phone" },
            ]}
          >
            <Input placeholder={customer?.customerPhoneNumber} />
          </Form.Item>
          <Form.Item
            name="division"
            label="Division"
            rules={[{ required: true, message: "Please select division" }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select division"
              onChange={handleDivisionChange}
            >
              {divisionData?.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="district"
            label="District"
            rules={[{ required: true, message: "Please select district" }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select district"
              onChange={handleDistrictChange}
            >
              {districtData?.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="thana"
            label="Thana"
            rules={[{ required: true, message: "Please select thana" }]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select thana"
              onChange={handleThanaChange}
            >
              {thanaData?.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Full Address"
            name="address"
            rules={[{ required: true, message: "Please enter full address" }]}
          >
            <TextArea
              defaultValue={customer?.address}
              rows={3}
              placeholder="Enter complete address"
            />
          </Form.Item>

          {customer?.customerType === "PROBASHI" && (
            <Form.Item label="Relationship" name="relationship">
              <Input placeholder="e.g., Brother, Father, Friend" />
            </Form.Item>
          )}

          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Set as Default Address</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
