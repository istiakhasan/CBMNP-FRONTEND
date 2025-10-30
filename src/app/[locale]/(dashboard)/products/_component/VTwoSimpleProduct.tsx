"use client";

import GbCascaderPicker from "@/components/forms/GbCascaderPicker";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import GbBDTInput from "@/components/forms/GbBTDInput";
import { useCreateSimpleProductMutation } from "@/redux/api/productApi";
import CubicMeters from "./CubicMeters";
import { useState } from "react";
import { uploadImageToImagebb } from "@/util/commonUtil";
import {
  message,
  notification,
  Spin,
  Card,
  Row,
  Col,
  Collapse,
} from "antd";
import {
  LoadingOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  SettingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSimpleProductSchema } from "@/schema/IepSchema";

const { Panel } = Collapse;

const VTwoAddSimpleProuct = ({  }: any) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [createProduct] = useCreateSimpleProductMutation();
  const [notificationApi, contextHolder] = notification.useNotification();

  const showNotification = (productName: string) => {
    notificationApi.success({
      message: "Success",
      description: `${productName} created successfully.`,
      placement: "bottomLeft",
      duration: 3,
    });
  };

  const handleSubmit = async (data: any, reset: any) => {
    try {
      setSubmitLoading(true);

      const mapImages = async (images: any) => {
        const uploaded = await Promise.all(
          (images || []).map(async (item: any) => {
            const formData = new FormData();
            formData.append("image", item.originFileObj);
            return await uploadImageToImagebb(formData);
          })
        );
        return uploaded;
      };

      const { category, unit, images, ...rest } = data;
      const payload = {
        ...rest,
        categoryId: category?.id,
        unit: unit?.label,
        images: await mapImages(images),
        productType: "Simple product",
        isBaseProduct: false,
      };

      const res = await createProduct(payload).unwrap();
      if (res?.success) {
        showNotification(res?.data?.name);
        setSelectedValue([]);
        reset();
      }
    } catch (error: any) {
        console.log(error,"error");
      if (error?.data?.errorMessages) {
        error?.data?.errorMessages?.forEach((item: any) =>
          message.error(item?.message)
        );
      } else {
        message.error("Something went wrong, please debug the error");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 ">
      {contextHolder}
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto h-[500px] rounded-lg shadow-inner  bg-white/70 backdrop-blur-sm">
        <GbForm
          resolver={yupResolver(createSimpleProductSchema)}
          submitHandler={handleSubmit}
        >
            <div className="h-[500px]">
          <Collapse
            bordered={false}
            defaultActiveKey={["1", "2"]}
            expandIconPosition="end"
            className="bg-transparent"
          >
            {/* Product Images */}
            <Panel
              key="1"
              header={
                <div className="flex items-center">
                  <PictureOutlined className="mr-2 text-blue-500" />
                  <span className="font-semibold">Product Images</span>
                </div>
              }
            >
              <Card bordered={false}>
                <GbFileUpload name="images" />
                <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  <InfoCircleOutlined className="mr-1" />
                  Max 6 images (.jpeg, .jpg, .png, 3MB each)
                </div>
              </Card>
            </Panel>

            {/* Product Details */}
            <Panel
              key="2"
              header={
                <div className="flex items-center">
                  <InfoCircleOutlined className="mr-2 text-green-500" />
                  <span className="font-semibold">Product Details</span>
                </div>
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <GbFormInput name="name" label="Product Name" placeholder="Enter name" />
                </Col>
                <Col span={8}>
                  <GbCascaderPicker
                    selectedValue={selectedValue}
                    setSelectedValue={setSelectedValue}
                    name="category"
                  />
                </Col>
                <Col span={8}>
                  <GbFormTextArea
                    name="description"
                    label="Summary"
                    rows={3}
                    placeholder="Brief description"
                  />
                </Col>
              </Row>
            </Panel>

            {/* Specifications */}
            <Panel
              key="3"
              header={
                <div className="flex items-center">
                  <SettingOutlined className="mr-2 text-purple-500" />
                  <span className="font-semibold">Product Specifications</span>
                </div>
              }
            >
              <CubicMeters />
            </Panel>

            {/* Pricing */}
            <Panel
              key="4"
              header={
                <div className="flex items-center">
                  <DollarOutlined className="mr-2 text-yellow-500" />
                  <span className="font-semibold">Pricing Information</span>
                </div>
              }
            >
              <Row gutter={[12, 12]}>
                {[
                  { name: "regularPrice", label: "Regular Price" },
                  { name: "salePrice", label: "Sale Price" },
                  { name: "retailPrice", label: "Retail Price" },
                  { name: "distributionPrice", label: "Distributor Price" },
                  { name: "purchasePrice", label: "Purchase Price" },
                ].map((field) => (
                  <Col span={8} key={field.name}>
                    <GbBDTInput
                      name={field.name}
                      label={field.label}
                      addon="BDT"
                      placeholder="0.00"
                    />
                  </Col>
                ))}
              </Row>
            </Panel>

            {/* Additional Info */}
            <Panel
              key="5"
              header={
                <div className="flex items-center">
                  <TagOutlined className="mr-2 text-red-500" />
                  <span className="font-semibold">Additional Information</span>
                </div>
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <GbFormInput name="sku" label="SKU" placeholder="Stock Keeping Unit" />
                </Col>
                <Col span={12}>
                  <GbFormInput
                    name="internalId"
                    label="Internal ID"
                    placeholder="Internal reference ID"
                  />
                </Col>
              </Row>
            </Panel>
          </Collapse>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end sticky bottom-0 bg-white">
            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {submitLoading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: "white" }} spin />} />
              ) : (
                <span>Create Product</span>
              )}
            </button>
          </div>
          </div>
        </GbForm>
      </div>
    </div>
  );
};

export default VTwoAddSimpleProuct;
