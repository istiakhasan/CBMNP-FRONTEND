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
import { useAddAddressMutation } from "@/redux/api/customerApi";
import axios from "axios";
import { getBaseUrl } from "@/helpers/config/envConfig";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MinimalAddressSelectionProps {
  customer: any;
  addresses: any[];
  onAddressUpdate: (addresses: any[]) => void;
  selectedDeliveryAddress?: any;
  onDeliveryAddressSelect: (address: any) => void;
}

export default function MinimalAddressSelectionEdit({
  customer,
  addresses,
  onAddressUpdate,
  selectedDeliveryAddress,
  onDeliveryAddressSelect,
}: MinimalAddressSelectionProps) {
  const [divisionData, setDivisionData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [thanaData, setThanaData] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = Form.useForm();
  const [createAddress] = useAddAddressMutation();
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

  const getShippingCost = (district?: string) => {
    if (district === "Dhaka") return 70;
    if (
      [
        "Rajshahi",
        "Barishal",
        "Khulna",
        "Sylhet",
        "Chittagong",
        "Rangpur",
        "Mymensingh",
      ].includes(district || "")
    )
      return 120;
    return 70;
  };

  const generateAddressId = () => {
    return "ADDR-" + Math.floor(Math.random() * 900000 + 100000);
  };

  const handleAddAddress = async () => {
    try {
      const values = await form.validateFields();

      // Build payload according to AddressBook entity
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

      const newAddress = await createAddress(payload).unwrap();
      const updatedAddresses = [...addresses, newAddress?.data];
      onAddressUpdate(updatedAddresses);
      onDeliveryAddressSelect(newAddress?.data);
      message.success("Address added successfully!");
      form.resetFields();
      setShowAddModal(false);
    } catch (error) {
      message.error("Please fill in required fields");
    }
  };
  const handleDivisionChange = (divisionId: any) => {
    const divisionObj = divisionData.find((d) => d.id === divisionId);
    console.log(divisionObj, "asdfasdf");
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

  const generateDefaultAddress = () => {
    if (customer?.address) {
      const defaultAddress: any = {
        id: generateAddressId(),
        label:
          customer.type === "Probashi" ? "Receiver Address" : "Main Address",
        district: customer?.district,
        division: customer?.division,
        thana: customer?.thana,
        address: customer?.address,
        receiverName: customer?.location?.receiverName || customer.name,
        receiverPhone: customer?.location?.receiverPhone || customer.phone,
        mapLocation: customer?.location?.mapLocation,
        type: "Home",
      };
      onAddressUpdate([defaultAddress]);
      onDeliveryAddressSelect(defaultAddress);
      message.success("Default address created");
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
                          {addr.district && (
                            <Text type="success">
                              📍 {addr.district} - ৳
                              {getShippingCost(addr.district)} shipping
                            </Text>
                          )}
                        </div>
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
        title="Add New Delivery Address"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddAddress}
        okText="Add Address"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="divisionName" hidden />
          <Form.Item name="districtName" hidden />
          <Form.Item name="thanaName" hidden />
          {/* Address Label */}
          <Form.Item
            label="Address Label"
            name="label"
            rules={[
              { required: true, message: "Please enter an address label" },
            ]}
          >
            <Input placeholder="e.g., Home, Office, Warehouse" />
          </Form.Item>

          {/* Receiver Name */}
          <Form.Item
            label="Receiver Name"
            name="receiverName"
            rules={[
              { required: true, message: "Please enter receiver's name" },
            ]}
          >
            <Input placeholder={customer?.customerName} />
          </Form.Item>

          {/* Receiver Phone Number */}
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
          {/* District */}
          <Form.Item
            name="district"
            label="District"
            rules={[{ required: true, message: "Please select district" }]}
          >
            <Select
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

          {/* Thana */}
          <Form.Item
            name="thana"
            label="Thana"
            rules={[{ required: true, message: "Please select thana" }]}
          >
            <Select placeholder="Select thana" onChange={handleThanaChange}>
              {thanaData?.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Full Address */}
          <Form.Item
            label="Full Address"
            name="address"
            rules={[{ required: true, message: "Please enter full address" }]}
          >
            <TextArea rows={3} placeholder="Enter complete address" />
          </Form.Item>

          {/* Relationship (only if probashi) */}
          {customer?.customerType === "PROBASHI" && (
            <Form.Item label="Relationship" name="relationship">
              <Input placeholder="e.g., Brother, Father, Friend" />
            </Form.Item>
          )}

          {/* Default Address Toggle */}
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Set as Default Address</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
