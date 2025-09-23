import { useState } from "react";
import { Modal, Form, Input, Select, Button, Card, Row, Col, message } from "antd";
import { UserOutlined, GlobalOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useCreateCustomerMutation } from "@/redux/api/customerApi";

const { TextArea } = Input;
const { Option } = Select;

const districts = [ "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh" ];
const divisions = [ "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh" ];
const countries = [ "Saudi Arabia", "UAE", "Qatar", "Kuwait", "Oman", "Bahrain", "Malaysia", "Singapore", "Italy", "Spain", "UK", "USA", "Canada", "Australia" ];

interface CustomerRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: any;
  selectedCustomer?: any;
  setCustomerAddresses: any;
}

export default function CustomerRegistrationForm({
  isOpen,
  onClose,
  onRegister,
  setCustomerAddresses,
  selectedCustomer
}: CustomerRegistrationFormProps) {
  const [form] = Form.useForm();
  const [customerType, setCustomerType] = useState<"NON_PROBASHI" | "PROBASHI">("NON_PROBASHI");

  const [handleCreateCustomer] = useCreateCustomerMutation();

  const formSubmit = async (data: any) => {
    try {
      const payload: any = { ...data };
      payload["customerType"] = customerType;

    if(customerType==='NON_PROBASHI'){
      if (data?.district) payload["district"] = data?.district;
      if (data?.division) payload["division"] = data?.division;
      if (data?.thana) payload["thana"] = data?.thana;
    }

    if(customerType==='PROBASHI'){
      if (data?.country) payload["country"] = data?.country;
    }
      
    
      const res = await handleCreateCustomer(payload).unwrap();
      if (res?.success === true) {
        onRegister(res?.data);
        message.success("Customer created successfully");
        // form.resetFields();
        // onClose()
      }
    } catch (error: any) {
      if (error?.data?.errorMessages?.length > 0) {
        error?.data?.errorMessages?.forEach((item: any) => {
          message.error(item?.message);
        });
      } else {
        message.error("Something went wrong");
      }
      // form.resetFields();
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
                <Input prefix={<PhoneOutlined />} placeholder="+8801XXXXXXXXX" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          
            {customerType === "PROBASHI" && (
              <Col span={12}>
                <Form.Item
                  name="country"
                  label="Current Country"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select placeholder="Select country">
                    {countries.map((c) => (
                      <Option key={c} value={c}>
                        {c}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
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
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="division" label="Division">
                    <Select placeholder="Select division">
                      {divisions.map((d) => (
                        <Option key={d} value={d}>
                          {d}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="district"
                    label="District"
                    rules={[{ required: true, message: "Please select district" }]}
                  >
                    <Select placeholder="Select district">
                      {districts.map((d) => (
                        <Option key={d} value={d}>
                          {d}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
           
                <Form.Item
                    name="thana"
                    label="Thana"
                    rules={[{ required: true, message: "Please select district" }]}
                  >
                    <Select placeholder="Select district">
                      {districts.map((d) => (
                        <Option key={d} value={d}>
                          {d}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
              
              <Form.Item
                name="address"
                label="Full Address"
                rules={[{ required: true, message: "Please enter full address" }]}
              >
                <TextArea rows={3} placeholder="Enter complete address" />
              </Form.Item>
            </>
          ) : (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="receiverName"
                    label="Receiver Name"
                    rules={[{ required: true, message: "Please enter receiver name" }]}
                  >
                    <Input placeholder="Receiver name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="relationship"
                    label="Relationship"
                    rules={[{ required: true, message: "Please enter relationship" }]}
                  >
                    <Input placeholder="e.g. Brother, Friend" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item rules={[{ required: true, message: "Please enter receiver phone" }]} name="receiverPhone" label="Receiver Phone">
                <Input placeholder="+8801XXXXXXXXX" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="receiverDivision" label="Division">
                    <Select placeholder="Select division">
                      {divisions.map((d) => (
                        <Option key={d} value={d}>
                          {d}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="receiverDistrict" label="District">
                    <Select placeholder="Select district">
                      {districts.map((d) => (
                        <Option key={d} value={d}>
                          {d}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="receiverThana" label="Thana/Upazila">
                <Input placeholder="Enter thana/upazila" />
              </Form.Item>
              <Form.Item
                name="receiverAddress"
                label="Receiver Address"
                rules={[{ required: true, message: "Please enter receiver address" }]}
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
