"use client"
import GbForm from "@/components/forms/GbForm";
import GbFormInput from "@/components/forms/GbFormInput";
import GbFormSelect from "@/components/forms/GbFormSelect";

const FilterForm = () => {
  return (
    <GbForm submitHandler={(data:any)=>console.log(data)}>
      <div className="sdw_box grid grid-cols-4 gap-[12px] mb-[12px]">
      <GbFormSelect
        placeholder="Order Status"
        name="order_status"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <GbFormSelect
        placeholder="Order from"
        name="order_from"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <GbFormSelect
        placeholder="Order Type"
        name="order_type"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <GbFormSelect
        placeholder="Courier Company"
        name="courier_company"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <GbFormSelect
        placeholder="Payment Status"
        name="payment__status"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <GbFormSelect
        placeholder="Payment Gateway"
        name="payment__getWay"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
      <div>
      <GbFormInput placeholder="TrxID" name="trxID" />
      </div>
      <GbFormSelect
        placeholder="Delivery Type"
        name="delivery_type"
        options={[
          {
            label: "Order status",
            value: "order_status",
          },
        ]}
      />
    </div>
    </GbForm>
  );
};

export default FilterForm;
