import Invoice from "@/app/[locale]/(dashboard)/orders/_component/Invoice";
const BulkInvoice = ({ orders }: { orders: any[] }) => {
  return (
    <div>
      {orders.map((order, index) => (
        <div key={order?.id} style={{ pageBreakAfter: "always" }}>
          <Invoice rowData={order} />
        </div>
      ))}
    </div>
  );
};
export default BulkInvoice;
