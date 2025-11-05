import { Tooltip } from "antd";

  // table column
  export const inventoryColumns = [
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.product?.sku || "N/A"}</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      width:"200px",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>{record?.product?.name}</span>
          </>
        );
      },
    },
    {
      title: "Total Warehouses",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <div className="flex items-center gap-2">
            <span>{record?.inventoryItems?.length || "N/A"}</span>
            <Tooltip
              overlayInnerStyle={{ background: "green", width: "800px" }}
              autoAdjustOverflow={false}
              trigger={["click"]}
              color="white"
              style={{ background: "red", padding: "0" }}
              placement="bottom"
              title={
                <div>
                  <div className=" bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold mb-4">
                      Warehouse Information
                    </h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            SL
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Warehouse Name
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Warehouse Location
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Available Qty
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                          Queue Qty
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                          Processing Qty
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                          Hold Quantity
                          </th>
                          {/* <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Shortage
                          </th> */}
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Wastage
                          </th>
                          <th className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">
                            Expired
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {record?.inventoryItems?.map(
                          (item: any, index: any) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm color_primary hover:underline cursor-pointer">
                                {item?.location?.name}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.location?.location}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.quantity || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.orderQue || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.processing || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.hoildQue || 0}
                              </td>
                              {/* <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {"pending"}
                              </td> */}
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.wastageQuantity || 0}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                {item?.expiredQuantity || 0}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            >
              {" "}
              <i className="ri-information-2-line text-[18px] cursor-pointer"></i>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Total Available Qty",
      key: 5,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock}</span>;
      },
    },
    {
      title: "Queue Qty",
      key: 15,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.orderQue || 0}</span>;
      },
    },
    {
      title: "Processing Qty",
      key: 115,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.processing || 0}</span>;
      },
    },
    {
      title: "Hold Qty",
      key: 115,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.hoildQue || 0}</span>;
      },
    },
    {
      title: <span>Total Stock Value</span>,
      key: 6,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock * record?.product?.salePrice}</span>;
      },
    },
    {
      title: <span>Total Purchase Cost</span>,
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.stock * record?.product?.purchasePrice}</span>;
      },
    },
    // {
    //   title: "Total Shortage Quantity",
    //   key: 7,
    //   align: "start",
    //   //@ts-ignore
    //   render: (text, record, index) => {
    //     return <span>{"pending"}</span>;
    //   },
    // },
    {
      title: "Total Wastage",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.wastageQuantity}</span>;
      },
    },
    {
      title: "Total Expired",
      key: 7,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.expiredQuantity}</span>;
      },
    },
  ];
  export const logsTableColumns = [
    {
      title: "Warehouse",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="color_primary cursor-pointer">{record?.location?.name || "Inventory"}</span>;
      },
    },
    {
      title: "SKU",
      key: 2,
      //@ts-ignore
      render: (text, record, index) => {
        return <span>{record?.product?.sku || "N/A"}</span>;
      },
    },
    {
      title: "Name",
      key: 3,
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span className="block mb-2 color_primary cursor-pointer">
              {record?.product?.name}
            </span>
          </>
        );
      },
    },
    {
      title: "Quantity",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {`${record?.type==="IN"?"+":"-"}${record?.quantity}`}
            </span>
          </>
        );
      },
    },
    {
      title: "Updated By",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              Pending
            </span>
          </>
        );
      },
    },
    {
      title: "Updated At",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              Pending
            </span>
          </>
        );
      },
    },
    {
      title: "Remarks",
      key: 4,
      align: "start",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span className="block mb-2 color_primary cursor-pointer">
              Pending
            </span>
          </>
        );
      },
    },
  ];
  export const warehouseWiseStockColumns = [
    {
      title: "Warehouse",
      key: 1,
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="color_primary cursor-pointer">{record?.warehousename || "N/A"}</span>;
      },
    },
    {
      title: "Product Name",
      key: 1,
      width:'300px',
      //@ts-ignore
      render: (text, record, index) => {
        return <span className="color_primary cursor-pointer">{record?.productname || "N/A"}</span>;
      },
    },

    {
      title: "Order Quantity",
      key: 4,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {record?.totalorderqueue || 0}
            </span>
          </>
        );
      },
    },

    {
      title: "Processing Quantity",
      key: 134,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {record?.totalprocessing || 0}
            </span>
          </>
        );
      },
    },
    {
      title: "Hold Quantity",
      key: 14,
      align: "center",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {record?.totalholdqueue || 0}
            </span>
          </>
        );
      },
    },
    {
      title: "Stock",
      key: 141,
      align: "end",
      //@ts-ignore
      render: (text, record, index) => {
        return (
          <>
            <span>
              {record?.totalquantity || 0}
            </span>
          </>
        );
      },
    }
  ];