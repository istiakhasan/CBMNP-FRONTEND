import React, { useState } from "react";
import moment from "moment/moment";
import GbForm from "@/components/forms/GbForm";
import GbFormSelect from "@/components/forms/GbFormSelect";
import GbFormInput from "@/components/forms/GbFormInput";
import { useGetAllProductQuery } from "@/redux/api/productApi";
import Select from "react-select";
import { Input, message } from "antd";
import { customStyles } from "@/util/commonUtil";
import { useGetAllSupplierQuery } from "@/redux/api/supplierApi";
import { useCreateProcurementMutation } from "@/redux/api/procurementApi";
import GbModal from "@/components/ui/GbModal";
import SupplierForm from "./SupplierForm";

const CreatePurchaseOrder = () => {
  const [submitLoading,setSubmitLoading]=useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [handleCreateProcurement] = useCreateProcurementMutation();
  const [rowDto, setRowDto] = useState<any>([]);
  const [supplierModal, setSupplierModal] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState<any>({});
  const { data, isLoading } = useGetAllProductQuery({
    searchProducts: searchTerm,
    limit: "200",
  });
  const { data: supplier, isLoading: supplierLoading } =
    useGetAllSupplierQuery(undefined);
  const supplierList = supplier?.data?.map((item: any) => {
    return {
      label: item?.company,
      value: item?.id,
      ...item,
    };
  });

  const productOptions = data?.data?.map((item: any) => ({
    label: item?.name,
    value: item?.id,
    ...item,
  }));

  const total = rowDto?.reduce((pre: any, next: any) => {
    const itemTotal =
      (next?.quantity || 0) * (next?.product?.purchasePrice || 0);
    const discount = next?.discount || 0;
    return pre + itemTotal - discount;
  }, 0);
  return (
    <div className="flex gap-5 border-[#e5e7eb] border-[.5px] p-[20px] rounded-[5px]">
      <div className="flex-1">
        <div className="grid grid-cols-2 w-full gap-3">
          <div>
            <div className="flex items-end justify-end mb-1">
              <button
                onClick={() => setSupplierModal(true)}
                className="flex items-center gap-2 bg-primary text-white font-bold py-[2px] px-4"
              >
                <span className="text-md">+</span> Add
              </button>
            </div>

            <Select
              styles={customStyles}
              options={supplierList}
              onChange={(valueOption) => {
                setSelectSupplier(valueOption);
              }}
              placeholder="Select Supplier"
              name="supplier"
            />
          </div>
          <div>
            <div className="flex items-end justify-end mb-1">
              <button className="flex items-center gap-2 bg-primary text-white font-bold py-[2px] px-4">
                <span className="text-md">+</span> Add Products
              </button>
            </div>
            <Select
              styles={customStyles}
              options={productOptions}
              placeholder="Select Product"
              name="product"
              onChange={(valueOption: any) => {
                if (
                  rowDto.some(
                    (item: any) => item?.product?.value === valueOption?.value
                  )
                ) {
                  return message.error("Product already added");
                }
                // if(Object.keys(selectSupplier).length>0 && rowDto?.some((item:any)=>item?.supplier?.id !==selectSupplier.value) ){
                //     return message.error('Supplier already added')
                // }
                if (Object.keys(selectSupplier).length > 0) {
                  setRowDto([
                    ...rowDto,
                    { supplier: selectSupplier, product: valueOption },
                  ]);
                }
              }}
            />
          </div>
        </div>

        {rowDto.length > 0 && (
          <div className="w-full mt-4">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2">SL</th>
                  <th className="p-2">Item Info</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item: any, i: any) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{item?.product?.label}</td>
                    <td className="p-2 w-24">
                      <div className="floating-label-input">
                        <Input
                          style={{
                            boxShadow: "none",
                            border: "none",
                          }}
                          value={Number(item?.product?.purchasePrice)}
                          onChange={(e) => {
                            const _data = [...rowDto];
                            _data[i].product.purchasePrice = e.target.value;
                            setRowDto(_data);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2 w-24">
                      <div className="floating-label-input">
                        <Input
                          style={{
                            boxShadow: "none",
                            border: "none",
                          }}
                          value={item?.quantity}
                          onChange={(e) => {
                            const _data = [...rowDto];
                            _data[i].quantity = e.target.value;
                            setRowDto(_data);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2 w-24">
                      <div className="floating-label-input">
                        <Input
                          style={{
                            boxShadow: "none",
                            border: "none",
                          }}
                          value={item?.discount || ""}
                          onChange={(e) => {
                            const _data = [...rowDto];
                            _data[i].discount = e.target.value;
                            setRowDto(_data);
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {(item?.quantity || 0) *
                        (item?.product?.purchasePrice || 0) -
                        (item?.discount || 0)}
                    </td>
                    <td className="p-2 text-right">
                      <i
                        onClick={() => {
                          const _data = [...rowDto];
                          _data.splice(i, 1);
                          setRowDto(_data);
                        }}
                        className="ri-delete-bin-7-fill cursor-pointer"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div
        style={{ borderLeft: ".1px solid #C0C0C0 ", borderLeftWidth: ".2px" }}
        className="w-[500px]  px-4"
      >
        <span className="font-semibold">Purchase Checkout</span>
        <input
          className="w-full bg-gray-200 p-2 outline-none"
          type="date"
          readOnly
          value={moment().format("YYYY-MM-DD")}
          name="Date"
        />
        <div className="mt-2 space-y-2">
          <p className="flex justify-between ">
            <span>Item Total</span>
            <span>
              {rowDto?.reduce(
                (pre: any, next: any) =>
                  pre +
                  (next?.quantity || 0) * (next?.product?.purchasePrice || 0),
                0
              )}
            </span>
          </p>
          <p className="flex justify-between ">
            <span>Total Discount</span>
            <span>
              {rowDto?.reduce(
                (pre: any, next: any) => (+pre || 0) + (+next?.discount || 0),
                0
              )}
            </span>
          </p>
          <p className="flex justify-between ">
            <span>Advance Cash</span>
            <span>0</span>
          </p>
          <p className="flex justify-between ">
            <span>Purchase Total</span>
            <span>{total}</span>
          </p>
        </div>
        <button
          disabled={rowDto?.length < 1}
          className={`mt-4 ${
            rowDto?.length < 1 ? "bg-gray-400" : "bg-primary"
          }  w-full uppercase text-white py-2 px-4 rounded-md`}
          type="button"
          onClick={async () => {
            try {
               setSubmitLoading(true)
              if (rowDto?.length < 1) {
                return message.error("Please select at least one product");
              }
              const transformedData = {
                supplierId: rowDto[0]?.supplier.id,
                items: rowDto.map((item: any) => ({
                  productId: item.product.id,
                  orderedQuantity: item?.quantity,
                  receivedQuantity: 0,
                  damageQuantity: 0,
                  unitPrice: item?.product?.purchasePrice,
                })),
                billGenerated: true,
                billAmount: total,
              };

              const hasZeroQuantity = await transformedData.items.some(
                (item: any) => {
                  if (item.orderedQuantity < 1 || !item.orderedQuantity) {
                    message.error("Quantity should not be zero");
                    return true;
                  }
                  return false;
                }
              );

              if (hasZeroQuantity) return;

              const result = await handleCreateProcurement(
                transformedData
              ).unwrap();
              if (result?.success) {
                message.success(result.message);
                setRowDto([]);
              }
            } catch (error) {
              if (error) {
                console.log(error);
                message.error("Something went wrong");
              }
            }finally{
              setSubmitLoading(false)
            }
          }}
        >
          {submitLoading?"Loading...":"Checkout"}
          
        </button>
      </div>
      <GbModal
        width="500px"
        openModal={() => setSupplierModal(true)}
        closeModal={() => setSupplierModal(false)}
        isModalOpen={supplierModal}
      >
        <SupplierForm setSupplierModal={setSupplierModal} />
      </GbModal>
    </div>
  );
};

export default CreatePurchaseOrder;
