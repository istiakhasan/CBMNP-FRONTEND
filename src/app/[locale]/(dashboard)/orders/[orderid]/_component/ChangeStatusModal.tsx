import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";

import {
  useChangeHoldOrderStatusMutation,
  useChangeOrderStatusMutation,
  useReturnOrdersMutation,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import { useGetAllStatusQuery } from "@/redux/api/statusApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { getUserInfo } from "@/service/authService";
import { Image, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const ChangeStatusModal = ({ setModalOpen, rowData }: any) => {
  const { data: warehosueOptions } = useLoadAllWarehouseOptionsQuery(undefined);
  const [handleUpdateOrder] = useChangeOrderStatusMutation();
  const userInfo: any = getUserInfo();
  const router = useRouter();
  const [returnableProducts, setReturnableProducts] = useState<any>([]);
  const [handleHoldUpdateOrderStatus] = useChangeHoldOrderStatusMutation();
  const [returnBulkOrders] = useReturnOrdersMutation();
  const { data: orderStatus } = useGetAllStatusQuery({
    label: rowData?.status?.label,
  });
  const { watch, handleSubmit } = useFormContext();
  const onsubmit = async (data: any) => {
    try {
      let res: any = null;
      if (rowData?.status?.label === "Hold") {
        res = await handleHoldUpdateOrderStatus({
          orderIds: [rowData?.id],
          statusId: data?.orderStatus?.value,
          agentId: userInfo.userId,
          ...(data?.orderStatus?.label === "Hold" && {
            onHoldReason: data?.reason?.value,
          }),
          currentStatus: rowData?.statusId,
        });
      } else if (
        rowData?.status?.label === "In-transit" ||
        rowData?.status?.label === "Pending-Return"
      ) {
        res = await returnBulkOrders({
          orderIds: [rowData?.id],
          agentId: userInfo.userId,
          statusId: data?.orderStatus?.value,
          warehouse: data?.warehouse?.value,
          returnableProducts
        });
      } else {
        res = await handleUpdateOrder({
          orderIds: [rowData?.id],
          statusId: data?.orderStatus?.value,
          agentId: userInfo.userId,
          ...(data?.orderStatus?.label === "Cancel" && {
            onCancelReason: data?.reason?.value,
          }),
          currentStatus: rowData?.statusId,
        });
      }
      if (res) {
        message.success("Order update successfully...");
        setModalOpen(false);
      }
    } catch (error) {
      message.error("Something went wrong");
      setModalOpen(false);
    }
  };
  console.log(returnableProducts, "abcd");
  return (
    <div className="p-[15px] bg-[#FFFFFF]">
      <div className="flex justify-between mb-6">
        <h1 className="font-[600] text-[#242529] text-[16px]">Change Status</h1>
        <svg
          onClick={() => setModalOpen(false)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className="mb-4">
        <GbFormSelect
          name="orderStatus"
          options={orderStatus?.data}
          label="Select Status"
        />
      </div>
      {watch()?.orderStatus?.label !== "Approved" &&
        watch()?.orderStatus?.label !== "Delivered" &&
        watch()?.orderStatus?.label !== "Returned" &&
        watch()?.orderStatus?.label !== "Partial-Return" &&
        !!watch()?.orderStatus?.label && (
          <div className="mt-3">
            <GbFormSelect
              name="reason"
              options={[
                {
                  label: "Customer Not interested",
                  value: "Customer Not interested",
                },
                { label: "Multiple order", value: "Multiple order" },
                { label: "Product Stock-out", value: "Product Stock-out" },
                {
                  label: "Customer Unreachable",
                  value: "Customer Unreachable",
                },
                { label: "Delay Delivery", value: "Delay Delivery" },
                {
                  label: "Urgent delivery (Out-side Dhaka)",
                  value: "Urgent delivery (Out-side Dhaka)",
                },
                {
                  label: "Urgent delivery (In Dhaka)",
                  value: "Urgent delivery (In Dhaka)",
                },
                { label: "Fake Order", value: "Fake Order" },
                { label: "Financial Crisis", value: "Financial Crisis" },
                {
                  label: "Mistakenly placed order by customer",
                  value: "Mistakenly placed order by customer",
                },
                {
                  label: "Not interested to pay in advance",
                  value: "Not interested to pay in advance",
                },
                { label: "Out of Coverage", value: "Out of Coverage" },
                { label: "Price Issue", value: "Price Issue" },
                {
                  label: "Customer Wants to cancel",
                  value: "Customer Wants to cancel",
                },
                {
                  label: "Will not available on delivery time",
                  value: "Will not available on delivery time",
                },
                { label: "Will order later", value: "Will order later" },
                { label: "Test Order", value: "Test Order" },
              ]}
              label="Select Reason"
            />
          </div>
        )}

      {watch()?.orderStatus?.label === "Returned" && (
        <>
          <div className="mb-4">
            <GbFormSelect
              options={warehosueOptions?.data}
              name="warehouse"
              label="Warehouse"
            />
          </div>
        </>
      )}
      {watch()?.orderStatus?.label === "Partial-Return" && (
        <>
          <div className="mb-4">
            <GbFormSelect
              options={warehosueOptions?.data}
              name="warehouse"
              label="Warehouse"
            />
          </div>

          <div className="mb-4 responsive_order_details_view_table min-w-[700px] text-[10px]">
            <table>
              <thead className="text-[10px]">
                <tr>
                  <th style={{ fontSize: "10px" }}>Product Name</th>
                  <th style={{ fontSize: "10px" }}>Price</th>
                  <th style={{ fontSize: "10px" }}>Req Qty</th>
                  <th style={{ fontSize: "10px" }}>Return Qty</th>
                  <th style={{ fontSize: "10px" }}>Damage Qty</th>
                  <th style={{ fontSize: "10px" }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.products?.map((item: any, i: any) => (
                  <tr key={i}>
                    <td>
                      {item?.product?.name} ( {item?.product?.weight}{" "}
                      {item?.product?.unit} )
                    </td>

                    <td>
                      <p> {item?.product?.salePrice}</p>
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {item?.productQuantity}
                    </td>
                    <td>
                      <input
                        type="number"
                        className="border-[1px] w-[60px] border-gray-300 outline-none px-3 py-1"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const existing =
                            returnableProducts?.find(
                              (ab: any) => ab?.productId === item?.id
                            ) || {};
                          const damage = existing?.damageQuantity || 0;

                          if (value < 0) {
                            message.error(
                              "Return quantity should not be smaller than zero"
                            );
                            e.target.value = existing?.returnQuantity || "";
                            return;
                          }

                          if (value + damage > item?.productQuantity) {
                            message.error(
                              "Sum of return and damage quantity should not exceed requested quantity"
                            );
                            e.target.value = existing?.returnQuantity || "";
                            return;
                          }

                          const updatedProducts = returnableProducts?.map(
                            (product: any) =>
                              product.productId === item?.productId
                                ? { ...product, returnQuantity: value }
                                : product
                          );

                          const isExist = returnableProducts?.some(
                            (product: any) => product.productId === item?.productId
                          );

                          if (isExist) {
                            setReturnableProducts(updatedProducts);
                          } else {
                            setReturnableProducts([
                              ...returnableProducts,
                              {
                                productId: item?.productId,
                                returnQuantity: value,
                                damageQuantity: 0,
                              },
                            ]);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="border-[1px] w-[60px] border-gray-300 outline-none px-3 py-1"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const existing =
                            returnableProducts?.find(
                              (ab: any) => ab?.productId === item?.productId
                            ) || {};
                          const retQty = existing?.returnQuantity || 0;

                          if (value < 0) {
                            message.error(
                              "Damage quantity should not be smaller than zero"
                            );
                            e.target.value = existing?.damageQuantity || "";
                            return;
                          }

                          if (value + retQty > item?.productQuantity) {
                            message.error(
                              "Sum of return and damage quantity should not exceed requested quantity"
                            );
                            e.target.value = existing?.damageQuantity || "";
                            return;
                          }

                          const updatedProducts = returnableProducts?.map(
                            (product: any) =>
                              product.productId === item?.productId
                                ? { ...product, damageQuantity: value }
                                : product
                          );

                          const isExist = returnableProducts?.some(
                            (product: any) => product.productId === item?.productId
                          );

                          if (isExist) {
                            setReturnableProducts(updatedProducts);
                          } else {
                            setReturnableProducts([
                              ...returnableProducts,
                              {
                                productId: item?.productId,
                                damageQuantity: value,
                                returnQuantity: 0,
                              },
                            ]);
                          }
                        }}
                      />
                    </td>
                    <td>{item?.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setModalOpen(false)}
          className={` ${
            true ? "border-[#4F8A6D] text-[#4F8A6D]" : "bg-[#CACACA]"
          }  border-[rgba(0,0,0,.2)] border  font-bold px-[30px] py-[5px]`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit(onsubmit)}
          className={` ${
            true ? "bg-[#4F8A6D]" : "bg-[#CACACA]"
          } text-white border-[rgba(0,0,0,.2)]  font-bold px-[30px] py-[5px]`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
