import { Tooltip } from "antd";

// 1. Master Inventory Columns (Compact, Full-Width Responsive - No Scroll Needed)
export const inventoryColumns = [
  {
    title: "Product Details",
    key: "product",
    width: "25%",
    //@ts-ignore
    render: (text, record) => {
      return (
        <div>
          <span className="font-bold text-gray-900 text-sm block leading-tight mb-1">
            {record?.product?.name || "Product"}
          </span>
          <span className="font-mono text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
            SKU: {record?.product?.sku || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    title: "Total Warehouses",
    key: "warehouses",
    width: "14%",
    align: "start",
    //@ts-ignore
    render: (text, record) => {
      return (
        <div
          className="inline-flex items-center cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip
            overlayInnerStyle={{ background: "#ffffff", width: "850px", padding: 0 }}
            autoAdjustOverflow={false}
            trigger={["click"]}
            color="white"
            placement="bottom"
            title={
              <div
                className="bg-white shadow-xl rounded-lg p-5 border border-gray-200 text-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-base font-bold mb-3 text-gray-900 border-b pb-2 flex items-center justify-between">
                  <span>Warehouse Stock Breakdown: {record?.product?.name}</span>
                  <span className="text-sm text-gray-500 font-mono">SKU: {record?.product?.sku || "N/A"}</span>
                </h2>
                <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700 w-12">SL</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Warehouse Location</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-bold text-emerald-700">Available Stock</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Order Pipeline (Queue / Proc / Hold)</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Loss / Shrinkage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record?.inventoryItems?.map((item: any, index: number) => {
                      const q = item?.orderQue || 0;
                      const p = item?.processing || 0;
                      const h = item?.hoildQue || 0;
                      const w = item?.wastageQuantity || 0;
                      const e = item?.expiredQuantity || 0;

                      return (
                        <tr key={index} className="hover:bg-gray-50 text-sm">
                          <td className="border border-gray-200 px-3 py-2.5 text-center font-medium text-gray-600">{index + 1}</td>
                          <td className="border border-gray-200 px-3 py-2.5">
                            <span className="font-bold text-blue-700 text-sm block">
                              {item?.location?.name || "Warehouse"}
                            </span>
                            {item?.location?.location && (
                              <span className="text-xs text-gray-500 font-medium">
                                {item.location.location}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-2.5 text-center">
                            <span className="font-extrabold text-emerald-700 text-base">
                              {item?.quantity || 0} <span className="text-xs font-semibold text-emerald-600">pcs</span>
                            </span>
                          </td>
                          <td className="border border-gray-200 px-3 py-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
                                <span className="text-[10px] text-blue-500 font-medium">Queue:</span> {q}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
                                <span className="text-[10px] text-amber-500 font-medium">Proc:</span> {p}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-semibold">
                                <span className="text-[10px] text-purple-500 font-medium">Hold:</span> {h}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                                Wastage: <span className="font-bold">{w}</span>
                              </span>
                              <span className="text-xs text-gray-600 font-medium bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                                Expired: <span className="font-bold">{e}</span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
          >
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md transition border border-blue-200 shadow-sm">
              <span className="font-bold text-sm">{record?.inventoryItems?.length || 0}</span>
              <span className="text-xs text-blue-600 font-semibold">Warehouses</span>
              <i className="ri-information-2-line text-[16px]"></i>
            </div>
          </Tooltip>
        </div>
      );
    },
  },
  {
    title: "Available Stock",
    key: "available_stock",
    width: "15%",
    //@ts-ignore
    render: (text, record) => {
      return (
        <span className="font-extrabold text-emerald-700 text-base block">
          {record?.stock || 0} <span className="text-xs font-semibold text-emerald-600">pcs</span>
        </span>
      );
    },
  },
  {
    title: "Order Pipeline Stages",
    key: "pipeline",
    width: "22%",
    //@ts-ignore
    render: (text, record) => {
      const q = record?.orderQue || 0;
      const p = record?.processing || 0;
      const h = record?.hoildQue || 0;
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold" title="Order Queue">
            <span className="text-[10px] text-blue-500">Queue:</span> {q}
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold" title="Processing Quantity">
            <span className="text-[10px] text-amber-500">Proc:</span> {p}
          </span>
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-semibold" title="Hold Quantity">
            <span className="text-[10px] text-purple-500">Hold:</span> {h}
          </span>
        </div>
      );
    },
  },
  {
    title: "Valuation & Cost",
    key: "valuation",
    width: "18%",
    //@ts-ignore
    render: (text, record) => {
      const saleVal = Number(record?.stock || 0) * Number(record?.product?.regularPrice || record?.product?.salePrice || 0);
      const buyVal = Number(record?.stock || 0) * Number(record?.product?.purchasePrice || 0);
      return (
        <div>
          <span className="font-bold text-gray-900 text-sm block">
            ৳ {saleVal.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 font-medium block">
            Cost: ৳ {buyVal.toLocaleString()}
          </span>
        </div>
      );
    },
  },
  {
    title: "Loss / Shrinkage",
    key: "shrinkage",
    width: "13%",
    //@ts-ignore
    render: (text, record) => {
      const w = record?.wastageQuantity || 0;
      const e = record?.expiredQuantity || 0;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-rose-700 font-semibold">
            Wastage: <span className="font-bold">{w}</span>
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Expired: <span className="font-bold text-gray-600">{e}</span>
          </span>
        </div>
      );
    },
  },
];

// 2. Meaningful Inventory Movement Logs Columns (No Horizontal Scroll Needed)
export const logsTableColumns = [
  {
    title: "Date & Time",
    key: "transactionDate",
    width: "16%",
    //@ts-ignore
    render: (text, record) => {
      const d = record?.transactionDate || record?.createdAt;
      return (
        <span className="text-xs font-mono text-gray-700 font-medium leading-tight block">
          {d ? new Date(d).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) : "N/A"}
        </span>
      );
    },
  },
  {
    title: "Warehouse & Product",
    key: "warehouse_product",
    width: "30%",
    //@ts-ignore
    render: (text, record) => {
      return (
        <div>
          <div className="mb-0.5">
            {record?.location?.name ? (
              <span className="font-bold text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {record.location.name}
              </span>
            ) : (
              <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-xs border border-purple-100">
                Master Inventory
              </span>
            )}
          </div>
          <span className="font-bold text-gray-900 block text-sm leading-tight mt-1">
            {record?.product?.name || "Product"}
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            SKU: {record?.product?.sku || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    title: "Movement",
    key: "movement",
    width: "14%",
    align: "center",
    //@ts-ignore
    render: (text, record) => {
      const isEntry = record?.type === "IN";
      return (
        <span
          className={`inline-block font-extrabold text-sm px-3 py-1 rounded-full ${
            isEntry
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-rose-100 text-rose-800 border border-rose-300"
          }`}
        >
          {isEntry ? `+ ${record?.quantity} IN` : `- ${record?.quantity} OUT`}
        </span>
      );
    },
  },
  {
    title: "Action & Reference",
    key: "event",
    width: "20%",
    //@ts-ignore
    render: (text, record) => {
      const refType = record?.referenceType;
      let color = "bg-gray-100 text-gray-800 border-gray-300";
      let label = refType || "Stock Movement";

      if (refType === "STOCK_ADJUSTMENT") {
        color = "bg-amber-100 text-amber-900 border-amber-300";
        label = "Physical Count Audit";
      } else if (refType === "STOCK_TRANSFER_IN") {
        color = "bg-cyan-100 text-cyan-900 border-cyan-300";
        label = "Transfer Received";
      } else if (refType === "STOCK_TRANSFER_OUT") {
        color = "bg-orange-100 text-orange-900 border-orange-300";
        label = "Transfer Dispatched";
      } else if (refType === "GOODS_RECEIPT" || refType === "PURCHASE_RECEIPT") {
        color = "bg-purple-100 text-purple-900 border-purple-300";
        label = "Supplier Receipt (GRN)";
      } else if (refType === "PURCHASE_RETURN") {
        color = "bg-rose-100 text-rose-900 border-rose-300";
        label = "Purchase Return";
      } else if (refType === "ORDER_DISPATCH") {
        color = "bg-blue-100 text-blue-900 border-blue-300";
        label = "Order Dispatch";
      } else if (refType === "ORDER_RETURN") {
        color = "bg-emerald-100 text-emerald-900 border-emerald-300";
        label = "Customer Return";
      } else if (refType === "MANUAL_STOCK_IN") {
        color = "bg-teal-100 text-teal-900 border-teal-300";
        label = "Manual Stock In";
      } else if (refType === "MANUAL_STOCK_OUT") {
        color = "bg-red-100 text-red-900 border-red-300";
        label = "Manual Stock Out";
      }

      return (
        <div>
          <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded border ${color}`}>
            {label}
          </span>
          {record?.referenceNumber && (
            <span className="block text-xs text-gray-600 font-mono font-medium mt-1">
              Ref: {record.referenceNumber}
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: "Remarks & Operator",
    key: "remarks_operator",
    width: "20%",
    //@ts-ignore
    render: (text, record) => {
      return (
        <div>
          <span className="text-xs text-gray-800 font-medium block leading-snug">
            {record?.remarks || "Inventory level adjusted"}
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            By: <span className="text-gray-700 font-semibold">{record?.performedByName || "Admin"}</span>
          </span>
        </div>
      );
    },
  },
];

// 3. Warehouse-Wise Stock Columns (No Horizontal Scroll Needed)
export const warehouseWiseStockColumns = [
  {
    title: "Warehouse",
    key: 1,
    width: "22%",
    //@ts-ignore
    render: (text, record) => {
      return <span className="font-bold text-blue-700 text-sm">{record?.warehousename || "N/A"}</span>;
    },
  },
  {
    title: "Product Name",
    key: 2,
    width: "35%",
    //@ts-ignore
    render: (text, record) => {
      return <span className="font-bold text-gray-900 text-sm">{record?.productname || "N/A"}</span>;
    },
  },
  {
    title: "Available Quantity",
    key: 3,
    align: "center",
    width: "18%",
    //@ts-ignore
    render: (text, record) => {
      return (
        <span className="font-extrabold text-emerald-700 text-base">
          {record?.totalquantity || 0} <span className="text-xs font-semibold text-emerald-600">pcs</span>
        </span>
      );
    },
  },
  {
    title: "Order Pipeline (Queue / Proc / Hold)",
    key: 4,
    width: "25%",
    //@ts-ignore
    render: (text, record) => {
      const q = record?.totalorderqueue || 0;
      const p = record?.totalprocessing || 0;
      const h = record?.totalholdqueue || 0;
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
            <span className="text-[10px] text-blue-500">Queue:</span> {q}
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
            <span className="text-[10px] text-amber-500">Proc:</span> {p}
          </span>
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-xs font-semibold">
            <span className="text-[10px] text-purple-500">Hold:</span> {h}
          </span>
        </div>
      );
    },
  },
];
