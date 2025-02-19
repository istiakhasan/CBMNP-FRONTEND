import { message } from "antd";
import moment from "moment";

export const handleCopy = (orderSuccessResponse:any,setter:any,cb:any) => {
    setter(true);
  
    try {
      const formattedText = `
  Order ID: ${orderSuccessResponse?.orderNumber || "--"}
  Name: ${orderSuccessResponse?.receiverName || "--"}
  Products:
  ${orderSuccessResponse?.order_info
    ?.map(
      (item: any) =>
       `${item?.productNameEn} ${item?.product?.pack_size} - ${item?.singleProductPrices} tk (${item?.productQuantity})`
    )
    .join("\n") || "--"}
  Delivery Charge: ${orderSuccessResponse?.deliveryCharge || "--"} tk
  Product Total: ${
        orderSuccessResponse?.order_info?.reduce(
          (a: any, b: any) => a + b?.subTotal,
          0
        ) || 0
      } tk
  Grand Total: ${orderSuccessResponse?.last_transaction?.totalPurchaseAmount || "--"} tk
  Payment Status: ${orderSuccessResponse?.paymentStatus || "--"}
  Address: ${orderSuccessResponse?.shippingAddressTextArea || "--"}
  Phone: ${orderSuccessResponse?.receiverPhoneNumber || "--"}
  Date: ${moment(orderSuccessResponse?.created_at).format("DD-MMM-YYYY")}
  Confirm by: ${orderSuccessResponse?.agent?.name || 'N/A'}
      `.trim();
  
      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          cb()
        })
        .catch((error) => console.error("Failed to copy text:", error));
    } catch (error) {
      
      message.error("Failed to copy order information.");
    } finally {
      setter(false);
    }
  };
export const handleCopyv2 = (orderSuccessResponse:any,setter:any,cb:any) => {
    setter(true);
  
    try {
      const formattedText = `
  Order ID: ${orderSuccessResponse?.orderNumber || "--"}
  Name: ${orderSuccessResponse?.receiverName || "--"}
  Products:
  ${orderSuccessResponse?.order_details
    ?.map(
      (item: any) =>
        `  - ${item?.productNameEn} ${item?.product?.pack_size} (${item?.productQuantity})`
    )
    .join("\n") || "--"}
  Delivery Charge: ${orderSuccessResponse?.deliveryCharge || "--"} tk
  Product Total: ${
        orderSuccessResponse?.order_details?.reduce(
          (a: any, b: any) => a + b?.subTotal,
          0
        ) || 0
      } tk
  Grand Total: ${Number(orderSuccessResponse?.deliveryCharge)+Number( orderSuccessResponse?.order_info?.reduce(
    (a: any, b: any) => a + b?.subTotal,
    0
  ) || 0) || "--"} tk
  Payment Status: ${orderSuccessResponse?.paymentStatus || "--"}
  Address: ${orderSuccessResponse?.shippingAddressTextArea || "--"}
  Phone: ${orderSuccessResponse?.receiverPhoneNumber || "--"}
  Date: ${moment(orderSuccessResponse?.created_at).format("DD-MMM-YYYY")}
  Confirm by: Pending
      `.trim();
  
      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          cb()
        })
        .catch((error) => console.error("Failed to copy text:", error));
    } catch (error) {
      
      message.error("Failed to copy order information.");
    } finally {
      setter(false);
    }
  };