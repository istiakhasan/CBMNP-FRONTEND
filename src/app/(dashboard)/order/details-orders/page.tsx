
import GbHeader from "@/components/ui/dashboard/GbHeader";
import OrderItem from "./_component/OrderItem";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order Details",
  description: "Enter price resource planning software for Ghorer Bazar"
};
const Page = () => {
  return (
    <>
        <GbHeader title="Details Orders" />
        <OrderItem />
    </>
  );
};

export default Page;
