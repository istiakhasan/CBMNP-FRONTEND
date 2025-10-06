import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useCreateCustomerMutation } from "@/redux/api/customerApi";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { countryData } from "../create-order/_component/countryCode";


const { TextArea } = Input;
const { Option } = Select;

interface CustomerRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: any;
  selectedCustomer?: any;
  setCustomerAddresses?: any;
}

export default function CustomerRegistrationForm({
  isOpen,
  onClose,
  onRegister,
}: CustomerRegistrationFormProps) {
  const [form] = Form.useForm();
  const [customerType, setCustomerType] = useState<"NON_PROBASHI" | "PROBASHI">(
    "NON_PROBASHI"
  );

  const [divisionData, setDivisionData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [thanaData, setThanaData] = useState<any[]>([]);

  const [handleCreateCustomer] = useCreateCustomerMutation();

  // Fetch divisions
  useEffect(() => {
    axios
      .get(`${getBaseUrl()}/divisions`)
      .then((res) => setDivisionData(res?.data))
      .catch((error) => console.log(error));
  }, []);

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

  const formSubmit = async (data: any) => {
    try {
      const payload: any = { ...data };
      payload["customerType"] = customerType;

      // For local customer
      if (customerType === "NON_PROBASHI") {
       payload.division =data?.divisionName;
       payload.district=data?.districtName;
       payload.thana=data?.thanaName;
       delete payload['divisionName']
       delete payload['districtName']
       delete payload['thanaName']
       
      }
  
      // For probashi customer
      if (customerType === "PROBASHI") {
        payload.country = data.country;
      }
       
      const res = await handleCreateCustomer({
        data: payload,
        params: { addressBook: true },
      }).unwrap();

      if (res?.success === true) {
        onRegister(res?.data);
        message.success("Customer created successfully");
      }
    } catch (error: any) {
      console.error(error);
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      } else {
        message.error("Something went wrong");
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <span className="flex items-center gap-2">
          <UserOutlined /> Register New Customer
        </span>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Register Customer
        </Button>,
      ]}
      width={600}
    >
      {/* Customer Type */}
      <div className="flex gap-3 mb-4">
        <Button
          type={customerType === "NON_PROBASHI" ? "primary" : "default"}
          onClick={() => setCustomerType("NON_PROBASHI")}
        >
          <UserOutlined /> Non-Probashi (Local)
        </Button>
        <Button
          type={customerType === "PROBASHI" ? "primary" : "default"}
          onClick={() => setCustomerType("PROBASHI")}
        >
          <GlobalOutlined /> Probashi (International)
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={formSubmit}>
        {/* Basic Info */}
        <Card title="Basic Information" size="small" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Customer name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerPhoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter phone" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="+8801XXXXXXXXX"
                />
              </Form.Item>
            </Col>
          </Row>

          {customerType === "PROBASHI" && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="country"
                  label="Current Country"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select placeholder="Select country">
                    {countryData.map((c) => (
                      <Option key={c.value} value={c.value}>
                        {c.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        {/* Address Info */}
        <Card
          title={
            customerType === "NON_PROBASHI"
              ? "Address Information"
              : "Receiver Information in Bangladesh"
          }
          size="small"
        >
          {customerType === "NON_PROBASHI" ? (
            <>
              {/* Hidden name fields */}
              <Form.Item name="divisionName" hidden />
              <Form.Item name="districtName" hidden />
              <Form.Item name="thanaName" hidden />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="division"
                    label="Division"
                    rules={[
                      { required: true, message: "Please select division" },
                    ]}
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
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="district"
                    label="District"
                    rules={[
                      { required: true, message: "Please select district" },
                    ]}
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
                </Col>
              </Row>

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

              <Form.Item
                name="address"
                label="Full Address"
                rules={[
                  { required: true, message: "Please enter full address" },
                ]}
              >
                <TextArea rows={3} placeholder="Enter complete address" />
              </Form.Item>
            </>
          ) : (
            <>
              {/* Existing Probashi fields */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="receiverName"
                    label="Receiver Name"
                    rules={[
                      { required: true, message: "Please enter receiver name" },
                    ]}
                  >
                    <Input placeholder="Receiver name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="relationship"
                    label="Relationship"
                    rules={[
                      { required: true, message: "Please enter relationship" },
                    ]}
                  >
                    <Input placeholder="e.g. Brother, Friend" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="receiverPhone"
                label="Receiver Phone"
                rules={[
                  { required: true, message: "Please enter receiver phone" },
                ]}
              >
                <Input placeholder="+8801XXXXXXXXX" />
              </Form.Item>

              <Form.Item
                name="receiverAddress"
                label="Receiver Address"
                rules={[
                  { required: true, message: "Please enter receiver address" },
                ]}
              >
                <TextArea rows={3} placeholder="Complete receiver address" />
              </Form.Item>
            </>
          )}
        </Card>
      </Form>
    </Modal>
  );
}
