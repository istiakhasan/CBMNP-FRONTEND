import * as yup from "yup";
export const createSimpleProductSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  category: yup.object().required(),
  weight: yup.string().required(),
  unit: yup.object().required(),
  regularPrice: yup.string().required(),
  retailPrice: yup.string().required(),
  salePrice: yup.string().required(),
  distributionPrice: yup.string().required(),
  purchasePrice: yup.string().required(),
  images: yup.mixed().required("Image is required"),
});
export const createVariantProductSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  category: yup.object().required(),
  weight: yup.string().required(),
  unit: yup.object().required(),
  regularPrice: yup.string().required(),
  retailPrice: yup.string().required(),
  salePrice: yup.string().required(),
  distributionPrice: yup.string().required(),
  purchasePrice: yup.string().required(),
  product_image: yup.mixed().required("Image is required"),
});


export const createOrderSchema = yup.object().shape({
  Warehouse: yup.object().required("Product Status is required"),
  orderFrom: yup.object().required("Product Status is required"),
  orderType: yup.object().required("Product Status is required"),
  deliveryType: yup.object().required("Product Status is required"),
  deliveryCharge: yup.object().required("Product Status is required"),
  deliveryDate: yup.string().required("Product Status is required"),
  currier: yup.object().required("Product Status is required"),
  paymentStatus: yup.object().required("Product Status is required"),
  paymentMethods: yup.object().required("Product Status is required"),
});
