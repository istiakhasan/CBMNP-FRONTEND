"use client";
import { useFormContext } from "react-hook-form";

const OrderSummary = ({
  data,
  productData,
}: {
  data: any;
  productData: any;
}) => {
  const {watch}=useFormContext()
  return (
    <>
      <div className="sdw_box mb-[12px]">
        <div>
          <h1 className="text-[20px] font-[600] text-[#343434]">
            Order summary
          </h1>
          <p className="order_summary_row">
            Subtotal
            <strong className="text-[#343434] font-[500]">
              BDT {productData?.reduce((a: any, b: any) => a + b.subTotal, 0)}
            </strong>
          </p>
          <p className="order_summary_row">
            Total
            <strong className="text-[#343434] font-[500]">
              BDT {productData?.reduce((a: any, b: any) => a + b.subTotal, 0)+(watch()?.newDeliveryCharge || data?.deliveryCharge)}
              {/* BDT {data?.transation_info[0]?.totalPurchesAmount} */}
            </strong>
          </p>
        </div>
        <div className="mt-3">
          <h1 className="text-[20px] font-[600] text-[#343434]">
            Logistic Information
          </h1>
          <p className="order_summary_row">
            Delivery Charge
            <strong className="text-[#343434] font-[500]">
              BDT {watch()?.newDeliveryCharge || data?.deliveryCharge}
            </strong>
          </p>
        </div>
      </div>

    </>
  );
};

export default OrderSummary;
