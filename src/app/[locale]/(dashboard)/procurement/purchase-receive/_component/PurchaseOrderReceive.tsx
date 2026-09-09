import GbFormSelect from "@/components/forms/GbFormSelect";
import { useReceivePurchaseOrderMutation } from "@/redux/api/procurementApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { message } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const PurchaseOrderReceive = ({
  rowData,
  setReceiveModal,
  setRowData,
}: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useLoadAllWarehouseOptionsQuery(undefined);
  const [receivePurchaseOrder] = useReceivePurchaseOrderMutation();
  const { watch } = useFormContext();
  return (
    <div className="bg-white rounded-lg w-full">
      <h2 className="text-lg font-semibold mb-4">
        Receive from Purchase Order
      </h2>
      <div className="mb-4">
        <GbFormSelect options={data?.data} name="warehouse" label="Warehouse" />
      </div>
      <div className="flex gap-3">
        {/* Left Table Section */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Sl</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border w-[100px]">Receive Qty</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rcv Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Discount</th>
                <th className="p-2 border">Net Price</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.items?.map((item: any, i: any) => (
                <tr
                  className={`${
                    item?.orderedQuantity === item?.receivedQuantity
                      ? "bg-[#4F8A6D80]"
                      : ""
                  }`}
                  key={i}
                >
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{item?.product?.name}</td>
                  <td className="p-2 border">
                    {moment(item?.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      placeholder="Enter qty"
                      disabled={
                        item?.orderedQuantity === item?.receivedQuantity
                      }
                      value={item?.quantityToReceive || ""}
                      onChange={(e) => {
                        if ((+e.target.value + item?.receivedQuantity) > +item?.orderedQuantity) {
                          return message.error(
                            "Receive quantity is not greater then order quantity"
                          );
                        }
                        const _data = [...rowData.items];
                        _data[i] = {
                          ..._data[i],
                          quantityToReceive: e.target.value,
                        };
                        setRowData({ ...rowData, items: _data });
                      }}
                    />
                  </td>
                  <td className="p-2 border">{item?.orderedQuantity}</td>
                  <td className="p-2 border">{item?.receivedQuantity}</td>
                  <td className="p-2 border">{item?.unitPrice}</td>
                  <td className="p-2 border">{"N/A"}</td>
                  <td className="p-2 border">{item?.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Checkout Section */}
        <div className="w-[300px] border-l border-gray-200 pl-3">
          <h3 className="text-md font-semibold mb-3">Purchase Checkout</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium">Date</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          <div className="text-sm space-y-1">
            <p className="flex justify-between">
              <span>Net Total:</span>{" "}
              <span>
                {rowData?.items?.reduce(
                  (a: any, b: any) =>
                    a + b.unitPrice * (b.quantityToReceive || 0),
                  0
                )}{" "}
                (tk)
              </span>
            </p>
            <p className="flex justify-between">
              <span>Item Price:</span> <span> 0 (tk)</span>
            </p>
            <p className="flex justify-between">
              <span>Total Discount:</span> <span>0 (tk)</span>
            </p>
            <p className="flex justify-between">
              <span>Others Charge:</span> <span>00 (tk)</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Purchase Total:</span>{" "}
              <span>
                {rowData?.items?.reduce(
                  (a: any, b: any) =>
                    a + b.unitPrice * (b.quantityToReceive || 0),
                  0
                )}{" "}
                (tk)
              </span>
            </p>
            <p className="flex justify-between">
              <span>Advance Cash:</span> <span>00 (tk)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isSubmitting) return;

            try {
              const warehouseVal = watch("warehouse") || watch()?.warehouse;
              const warehouseId =
                typeof warehouseVal === "object" && warehouseVal !== null
                  ? warehouseVal.value
                  : warehouseVal;

              if (!warehouseId) {
                message.error("Please select a receiving warehouse");
                return;
              }

              const itemsToReceive = (rowData?.items || []).filter(
                (item: any) => Number(item?.quantityToReceive || 0) > 0
              );

              if (itemsToReceive.length === 0) {
                message.warning("Please enter receive quantity for at least one item");
                return;
              }

              setIsSubmitting(true);

              const stock = itemsToReceive.map((item: any) => {
                const qty = Number(item.quantityToReceive || 0);
                return {
                  productId: item.productId,
                  quantity: qty,
                  expiredQuantity: 0,
                  wastageQuantity: 0,
                  type: true,
                  inventoryItems: [
                    {
                      locationId: warehouseId,
                      quantity: qty,
                      expiredQuantity: 0,
                      wastageQuantity: 0,
                      productId: item.productId,
                    },
                  ],
                };
              });

              const poIds = itemsToReceive.map((item: any) => ({
                productId: item.productId,
                id: item.id,
                receivedQuantity:
                  Number(item.receivedQuantity || 0) + Number(item.quantityToReceive || 0),
              }));

              const result: any = await receivePurchaseOrder({
                stock,
                poIds,
                procurementId: rowData?.id,
              });

              if (result?.data?.success || result?.success || !result?.error) {
                message.success(
                  result?.data?.message ||
                  result?.message ||
                  "Product received successfully into warehouse!"
                );
                setReceiveModal(false);
                if (typeof setRowData === "function") {
                  setRowData(null);
                }
              } else {
                const errorMsg =
                  result?.error?.data?.message ||
                  result?.error?.message ||
                  "Failed to receive purchase order items";
                message.error(errorMsg);
              }
            } catch (error: any) {
              message.error(error?.data?.message || error?.message || "Failed to receive order");
            } finally {
              setIsSubmitting(false);
            }
          }}
          className={`bg-primary text-white px-5 py-2 rounded font-medium transition ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "RECEIVING..." : "RECEIVE"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setReceiveModal(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrderReceive;
