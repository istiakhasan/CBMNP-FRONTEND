import AddProductModal from "@/app/(dashboard)/subscription/customer_list/customer_details/AddProductModal";
import GbModal from "@/components/ui/GbModal";
import ProductInfoTable from "../../order-submission/_subComponent/ProductInfoTable";
import { useState } from "react";
import BillerReceiverInfo from "../../pending-orders/[id]/_component/BillerReceiverInfo";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";
import { useGetAllOrderStatusQuery } from "@/redux/api/orderApi";
import OrderSummary from "../../pending-orders/[id]/_component/OrderSummary";
const ExpandOrder = ({ item,setProductData,productData }: any) => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const { data: orderStatus } = useGetAllOrderStatusQuery(undefined);
    return (
        <div className="flex gap-[40px] mb-[12px]">
            <div className="flex-1">
                <div className="sdw_box mb-[12px]">
                    <h1 className="font-[700] text-[20px] text-[#343434] mb-[20px]">
                        {item?.orderNumber}
                    </h1>
                    <div className="grid grid-cols-3 gap-[20px]">
                        <div className="">
                            {" "}
                            <GbFormInput
                                name="order_date"
                                label="Order date"
                                placeholder="Feb 2, 2023 "
                            />
                        </div>
                        <div className="">
                            {" "}
                            <GbFormSelect
                                name="orderStatus"
                                label="Order Status"
                                options={orderStatus?.map((item: any) => { return { label: item?.name, value: item?.value } })}
                            />
                        </div>
                        <div className="">
                            {" "}
                            <GbFormInput disabled={true} name="orderFrom" label="Order from" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-[12px]">
                  <div className="col-span-8">
                  <div className="sdw_box  h-fit">
                        <div className=" flex justify-between">
                            <h1 className="box_title">Product info</h1>
                         {item?.orderStatus?.name==="pending" && <button
                                type="button"
                                onClick={() => setIsProductModalOpen(true)}
                                className="cm_button text-[12px]  py-[6px] font-bold mb-2"
                            >
                                {" "}
                                + Add more item
                            </button>}
                            <GbModal
                                isModalOpen={isProductModalOpen}
                                openModal={() => setIsProductModalOpen(true)}
                                closeModal={() => setIsProductModalOpen(false)}
                            >
                                <AddProductModal
                                    setProductData={setProductData}
                                    productData={productData}
                                    setIsModalOpen={setIsProductModalOpen}
                                />
                            </GbModal>
                        </div>
                        <ProductInfoTable
                            isShow={false}
                            productData={productData}
                            setProductData={setProductData}
                        />
                    </div>
                  </div>
                    {/* order summary */}
                    <div className="col-span-4">
                        <OrderSummary data={item} productData={productData} />
                        {item?.orderStatus?.name==="pending" && <div className="flex gap-[12px] justify-end">
                            <button className="text-[#FFFFFF] font-[500] text-[14px] px-[24px] py-[8px] bg-[#4ACC58] rounded-[5px]">
                                Save Order
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="w-[342px]">
                <BillerReceiverInfo data={item} />
            </div>
        </div>
    );
};

export default ExpandOrder;