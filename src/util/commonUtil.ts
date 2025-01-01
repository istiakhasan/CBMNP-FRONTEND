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

export const uploadImageToImagebb = async (formData:any) => {
  try {
    const apiKey = 'ee3fd83f55e650edf800161db386836a';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if(data?.status_code===400){
      throw new Error('Image is empty');
    }
    return data?.data?.url
  } catch (error:any) {

    throw error?.message
  }
};


