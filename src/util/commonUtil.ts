const PaymentMethod = ({ paymentMethod }: { paymentMethod: string }) => {
  switch (paymentMethod) {
    case "1":
      return "Cash On Delivery";
    case "2":
      return "Mobile Banking";
    case "3":
      return "Banking System";
    case "4":
      return "SSL-Commerce";

    default:
      return "-";
  }
};

export default PaymentMethod;
export const PaymentStatus = ({ paymentStatus }: { paymentStatus: string }) => {
  switch (paymentStatus) {
    case "1":
      return "Pending";
    case "2":
      return "Approve";
    case "3":
      return "Banking System";
    case "4":
      return "SSL-Commerce";

    default:
      return "-";
  }
};


