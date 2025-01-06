import GbBTDInput from "@/components/forms/GbBTDInput";
import GbCascaderPicker from "@/components/forms/GbCascaderPicker";
import GbFileUpload from "@/components/forms/GbFileUpload";
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormTextArea from "@/components/forms/GbFormTextArea";
import { useCreateSimpleProductMutation } from "@/redux/api/productApi";
import CubicMeters from "./CubicMeters";
import { useForm, useFormContext } from "react-hook-form";
import { ConfigProvider, message, notification, Spin } from "antd";
import { useState } from "react";
import { uploadImageToImagebb } from "@/util/commonUtil";
import { LoadingOutlined } from "@ant-design/icons";
import GbNotification from "@/components/ui/GbNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSimpleProductSchema } from "@/schema/IepSchema";
const AddSimpleProuct = ({ setDrawerOpen }: any) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [createProduct] = useCreateSimpleProductMutation();
  const [notificationApi, contextHolder] = notification.useNotification();

  const showNotification = (productName:string) => {
    notificationApi.success({
      message: "Success",
      description: `${productName} created successfully.`,
      placement: "bottomLeft",
    });
  };
  console.log(selectedValue,"check");
  const handleSubmit = async (data: any, reset: any) => {
    try {
      setSubmitLoading(true);
      const mapImages = async (images: any) => {
        const imagePromises = images.map(async (item: any) => {
          const formData = new FormData();
          formData.append("image", item.originFileObj);
          const uploadedImage = await uploadImageToImagebb(formData);
          return uploadedImage;
        });
        const uploadedImages = await Promise.all(imagePromises);
        return uploadedImages;
      };

      const { category, unit, images, ...rest } = data;
      const payload = { ...rest };
      payload["categoryId"] = category?.id;
      payload["unit"] = unit?.label;
      payload["images"] = await mapImages(data.images || []);
      payload["productType"] = "Simple product";
      payload["isBaseProduct"] = false;

      const res = await createProduct(payload).unwrap();
      if (!!res?.success) {
        showNotification(res?.data?.name);
        // message.success(res?.message);
        setDrawerOpen(false);
        setSelectedValue([]);
        reset();
      }
    } catch (error) {
      message.error("Something went wrong ,please debug the error");
      console.log(error, "error");
    }finally{
      setSubmitLoading(false)
    }
  };
  
  return (
    <GbForm resolver={yupResolver(createSimpleProductSchema)} submitHandler={handleSubmit}>
       {contextHolder}
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4">
        Product Images
      </p>
      <GbFileUpload name="images" />
      <p className="text-[#999] text-[12px]">
        Please upload maximum 6 images. (.jpeg, .jpg or .png. Max size
        1MB/file.)
      </p>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Product Details
      </p>

      <div className="mb-4">
        <GbFormInput name="name" size="small" label="Product Name" />
      </div>
      <div className="mb-4">
        <GbFormTextArea
          rows={1}
          name="description"
          size="small"
          label="Product Summary"
        />
      </div>
      <div className="mb-4">
        <GbCascaderPicker
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          name="category"
        />
      </div>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Product Specifications
      </p>
      <CubicMeters />
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">Prices</p>

      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="regularPrice"
          size="small"
          label="Regular"
        />
      </div>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="salePrice"
          size="small"
          label="Sale"
        />
      </div>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="retailPrice"
          size="small"
          label="Retail Price"
        />
      </div>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="distributionPrice"
          size="small"
          label="Distributor Price"
        />
      </div>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="purchasePrice"
          size="small"
          label="Purchase Price"
        />
      </div>
      <p className="text-[rgba(0,0,0,.85)] text-[15px]   mb-4 mt-4">
        Additional Information
      </p>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="sku"
          size="small"
          label="SKU"
        />
      </div>
      <div className="mb-4">
        <GbBTDInput
          addon={"BTD"}
          placeholder="0.00"
          name="internalId"
          size="small"
          label="Internal ID"
        />
      </div>

      <div className="bg-white py-[30px] sticky bottom-0 flex items-center gap-2 justify-end">
        {/* <button className="text-[#278ea5] border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px] w-[100px]">
          Clear
        </button> */}
        <button 
          disabled={submitLoading}
          type="submit"
          className="bg-[#278ea5] w-[100px] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]"
        >
          {submitLoading ? (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "white", // Default primary color (used in Spin)
                },
              }}
            >
              <Spin />
            </ConfigProvider>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </GbForm>
  );
};

export default AddSimpleProuct;
