import Invoice from "@/app/[locale]/(dashboard)/orders/_component/Invoice";
const BulkInvoice = ({ orders }: { orders: any[] }) => {
  console.log(orders,"orders");
  return (
    <div>
      {orders.map((order, index) => (
        // Force a new sheet between invoices, never after the final one.
        <div
          key={order?.id}
          style={index < orders.length - 1 ? { breakAfter: "page", pageBreakAfter: "always" } : undefined}
        >
          <Invoice rowData={order} />
        </div>
      ))}
    </div>
  );
};
export default BulkInvoice;
