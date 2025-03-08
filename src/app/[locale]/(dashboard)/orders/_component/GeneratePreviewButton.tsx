"use client";
import { useState } from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetOrganizationByIdQuery } from "@/redux/api/organizationApi";

const GeneratePreviewButton = ({
  selectedOrders,
  loadOrdersById,
  loadStockByWarehouseProduct,
  locationId,
  setReqPreviewData,
}: any) => {
  const [loading, setLoading] = useState(false);
  const { data } = useGetOrganizationByIdQuery(undefined);
  const organization = data?.data;
  const handleGeneratePreview = async () => {
    setLoading(true);
    try {
      const array = [];
      for (let i = 0; i < selectedOrders.length; i++) {
        const element = selectedOrders[i];
        const res = await loadOrdersById({ id: element.id }).unwrap();
        array.push(res);
      }

      let updatedProductData: any = [];
      array?.forEach((mitem: any) => {
        mitem?.products?.forEach((dt: any) => {
          updatedProductData.push({
            productId: dt?.productId,
            orderId: mitem?.orderNumber,
            orderQuantity: dt?.productQuantity,
            name: dt?.product?.name,
            packSize: dt?.product?.weight + " " + dt?.product?.unit,
          });
        });
      });

      const groupedData: any = {};
      updatedProductData.forEach(
        ({ productId, orderId, orderQuantity, name, packSize }: any) => {
          if (!groupedData[productId]) {
            groupedData[productId] = {
              productId,
              name,
              packSize,
              orders: [],
            };
          }
          groupedData[productId].orders.push({ orderId, orderQuantity });
        }
      );

      const result = Object.values(groupedData);

      const finalData = await Promise.all(
        result.map(async (abc: any) => {
          let res;
          try {
            res = await loadStockByWarehouseProduct({
              productId: abc?.productId,
              locationId: locationId,
            }).unwrap();
          } catch (error) {
            console.log(error);
          }
          return {
            ...abc,
            stock: res?.data?.quantity || 0,
          };
        })
      );

      setReqPreviewData(finalData);
    } catch (error) {
      console.error("Error generating preview:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        loading={loading}
        onClick={handleGeneratePreview}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        {loading ? "Generating..." : "Generate Preview"}
      </Button>

      <h1 className="text-3xl font-semibold mb-0 text-[#000] text-center">
        {organization?.name}
      </h1>
      <h1 className="text-lg mb-0 text-[#000] text-center">
        {organization?.address}
      </h1>
      <h1 className="text-lg mb-0 text-[#000] text-center">
        +88{organization?.phone}
      </h1>
    </>
  );
};

export default GeneratePreviewButton;
