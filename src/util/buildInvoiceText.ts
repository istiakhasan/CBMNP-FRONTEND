export function buildInvoiceText({
  customer,
  cartItems,
  orderDetails,
  itemsSubtotal,
  totalAmount,
  orderId,
}: {
  customer: any;
  cartItems: any[];
  orderDetails: any;
  itemsSubtotal: number;
  totalAmount: number;
  orderId?: string | number;
}) {
  const address = orderDetails?.deliveryAddress;
  const lines: string[] = [];

  lines.push("🧾 অর্ডার ইনভয়েস");
  if (orderId) lines.push(`অর্ডার আইডি: ${orderId}`);
  lines.push("------------------------------");
  lines.push(`কাস্টমার: ${customer?.customerName || address?.receiverName || "-"}`);
  lines.push(`ফোন: ${address?.receiverPhoneNumber || customer?.customerPhoneNumber || "-"}`);
  if (address) {
    lines.push(
      `ঠিকানা: ${[address.address, address.thana, address.district, address.division]
        .filter(Boolean)
        .join(", ")}`
    );
  }
  lines.push("");
  lines.push("পণ্যসমূহ:");
  cartItems?.forEach((item, i) => {
    const lineTotal = (item.product.salePrice || 0) * item.quantity;
    lines.push(`${i + 1}. ${item.product.name} x${item.quantity} = ৳${lineTotal}`);
  });
  lines.push("");
  lines.push(`সাবটোটাল: ৳${itemsSubtotal}`);
  lines.push(`শিপিং চার্জ: ৳${orderDetails?.shippingCharge || 0}`);
  if (orderDetails?.discountAmount > 0) {
    lines.push(`ডিসকাউন্ট: -৳${orderDetails.discountAmount}`);
  }
  lines.push(`মোট: ৳${totalAmount}`);
  lines.push("");
  lines.push(`পেমেন্ট পদ্ধতি: ${orderDetails?.paymentMethod || "-"}`);
  lines.push(`পেমেন্ট স্ট্যাটাস: ${orderDetails?.paymentStatus || "-"}`);
  lines.push(`অর্ডার সোর্স: ${orderDetails?.orderSource || "-"}`);
  if (orderDetails?.currier?.label) lines.push(`কুরিয়ার: ${orderDetails.currier.label}`);
//   if (orderDetails?.warehouse?.label) lines.push(`ওয়্যারহাউস: ${orderDetails.warehouse.label}`);
  if (orderDetails?.deliveryNote) lines.push(`ডেলিভারি নোট: ${orderDetails.deliveryNote}`);

  return lines.join("\n");
}