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
    return {
      url:data?.data?.display_url,
      delete_url:data?.data?.delete_url,
    }
  } catch (error:any) {

    throw error?.message
  }
};

export const deleteImageFromImagebb = async (deleteUrl: string) => {
  try {
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      mode:'no-cors'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || 'Failed to delete the image');
    }
    return data;
  } catch (error: any) {
    throw error?.message || 'An error occurred while deleting the image';
  }
};

export const mapImagesForUpload = async (images: any) => {
  const imagePromises = images.map(async (item: any) => {
    const formData = new FormData();
    formData.append("image", item.originFileObj);
    const uploadedImage = await uploadImageToImagebb(formData);
    return uploadedImage;
  });
  const uploadedImages = await Promise.all(imagePromises);
  return uploadedImages;
};


export const customStyles:any = {
  control: (provided:any, state:any) => ({
    ...provided,
    minHeight: "30px",
    height: "auto",
    borderRadius: "4px",
  }),

  valueContainer: (provided:any, state:any) => ({
    ...provided,
    height: "auto",
    padding: "0 6px",
  }),

  input: (provided:any, state:any) => ({
    ...provided,
    margin: "0px",
    fontSize: "14px",
  }),
  indicatorSeparator: (state:any) => ({
    display: "none",
  }),
  indicatorsContainer: (provided:any, state:any) => ({
    ...provided,
    height: "28px",
  }),
  option: (provided:any, state:any) => ({
    ...provided,
    padding: 1,
    fontSize: 14,
    paddingLeft: 7,
    zIndex: 99999999
  }),
  menuPortal: (base:any) => ({ ...base, zIndex: 99999999 }),
  placeholder: (provided:any, state:any) => ({
    ...provided,
    fontSize: 14,
  }),
  // Add: 23/03/22
  menu: (provided:any) => ({ ...provided, zIndex: 9999999, marginTop: "0" }),
};







