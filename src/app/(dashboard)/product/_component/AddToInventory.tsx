import GbFormSelect from "@/components/forms/GbFormSelect";
import { useLoadStockByProductIdAndLocationIdQuery, useUpdateInventoryMutation } from "@/redux/api/inventoryApi";
import { useLoadAllWarehouseOptionsQuery } from "@/redux/api/warehouse";
import { message } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

const AddToInventory = ({product,refetch}:any) => {
  const {watch,setValue,handleSubmit}=useFormContext()
  const { data: warehouseOptions, isLoading: optionsLoading } = useLoadAllWarehouseOptionsQuery(undefined);
  const query={
    productId:product?.id || null,
    locationId:watch()?.warehouse?.value || null
  }
  const { data, isLoading } = useLoadStockByProductIdAndLocationIdQuery(query);
  const [updateStock]=useUpdateInventoryMutation()
  const onSubmit=async(formData:any)=>{
    const payload:any={}
    payload['productId']=product?.id
    payload['quantity']=+formData?.stock
    payload['expiredQuantity']=+formData?.expiredQuantity
    payload['wastageQuantity']=+formData?.wastageQuantity
    payload['type']=true
    payload['inventoryItems']=[
        {
            locationId:formData?.warehouse?.value,
            quantity:+formData?.stock,
            expiredQuantity:+formData?.expiredQuantity,
            wastageQuantity:+formData?.wastageQuantity,
            productId:product?.id,
        }
    ]
    const res=await updateStock(payload).unwrap()
    if(res?.success){
        message.success('Quantity update successfully')
        refetch()
    }
  }
  console.log(product,"product");
  return (
    <div>
      <div className="px-[20px] pt-[20px]">
        <h1 className="text-[18px] mb-3">Add/Update inventory</h1>
         <div className="w-[500px] mb-2">
         <GbFormSelect
            label="Warehouse"
            name="warehouse"
            options={warehouseOptions?.data}
          />
         </div>
          {watch()?.warehouse?.value && <div className="w-[1100px]">
            <table className="table-auto w-full border-collapse border border-gray-300 mt-3">
              <tr className="bg-gray-100">
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Name</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Existing Quantity</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Quantity</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Existing Wastage</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Wastage</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Existing Expired</td>
                <td className="border text-black font-[600] border-gray-300 px-4 py-2 text-left text-sm ">Expired</td>
              </tr>
              <tr className="bg-[#D2E1E2]">
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer">{data?.data?.product?.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer">{Number(data?.data?.quantity || 0) + Number(watch()?.stock || 0)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer"><input onChange={(e)=>setValue('stock',e.target.value)} className="p-[5px] outline-none"  type="text" /></td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer">{Number(data?.data?.wastageQuantity || 0) +Number(watch()?.wastageQuantity || 0)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer"><input onChange={(e)=>setValue('wastageQuantity',e.target.value)} className="p-[5px] outline-none"  type="text" /></td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer">{Number(data?.data?.expiredQuantity || 0) +Number(watch()?.expiredQuantity || 0)}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm  hover:underline cursor-pointer"><input onChange={(e)=>setValue('expiredQuantity',e.target.value)}  className="p-[5px] outline-none" type="text" /></td>
              </tr>
            </table>
           <div className="flex justify-end ">
           <button  
             type="button"
             onClick={handleSubmit(onSubmit)}
                className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px]  px-[20px] py-[5px] mt-4"
              >
                Update
              </button>
           </div>
          </div>}
      
      </div>
    </div>
  );
};

export default AddToInventory;
