import GbFormSelect from "@/components/forms/GbFormSelect";
import { useReceivePurchaseOrderMutation } from "@/redux/api/procurementApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { message } from "antd";
import moment from "moment";
import React from "react";
import { useFormContext } from "react-hook-form";

const PurchaseOrderReceive = ({
  rowData,
  setReceiveModal,
  setRowData,
}: any) => {
  console.log(rowData, "asdfas");
  const { data } = useLoadAllWarehouseOptionsQuery(undefined);
  const [receivePurchaseOrder] = useReceivePurchaseOrderMutation();
  const { watch } = useFormContext();
  return (
    <div className="bg-white  rounded-lg  w-full ">
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
                        console.log(+e.target.value, +item?.orderedQuantity);
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
          onClick={async () => {
            try {
              if (!watch()?.warehouse && !watch()?.warehouse?.value) {
                return message.error("Please select warehouse");
              }
              const modifiedData = rowData?.items
                ?.map((item: any) => {
                  return {
                    productId: item?.productId,
                    quantity: +item?.quantityToReceive,
                    expiredQuantity: 0,
                    wastageQuantity: 0,
                    type: true,
                    inventoryItems: [
                      {
                        locationId: watch()?.warehouse?.value,
                        quantity: item?.quantityToReceive,
                        expiredQuantity: 0,
                        wastageQuantity: 0,
                        productId: item?.productId,
                      },
                    ],
                  };
                })
                .filter((item: any) => +item?.quantity > 0);
              const poIds = rowData?.items
                ?.filter((item: any) => +item?.quantityToReceive > 0)
                .map((item: any) => {
                  return {
                    productId: item?.productId,
                    id: item?.id,
                    receivedQuantity:
                      +item?.receivedQuantity + +item?.quantityToReceive,
                  };
                });

              const result = await receivePurchaseOrder({
                stock: modifiedData,
                poIds,
              }).unwrap();
              if (result) {
                message.success("Product receive successfully...");
                setReceiveModal(false);
              }
            } catch (error) {
              message.error("Ha ha ha aitai bastob...");
            }
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
        >
          RECEIVE
        </button>
        <button
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
