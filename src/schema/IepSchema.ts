import * as yup from "yup";
export const createSimpleProductSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  category: yup.array().required(),
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
  category: yup.array().required(),
  weight: yup.string().required(),
  unit: yup.object().required(),
  regularPrice: yup.string().required(),
  retailPrice: yup.string().required(),
  salePrice: yup.string().required(),
  distributionPrice: yup.string().required(),
  purchasePrice: yup.string().required(),
  product_image: yup.mixed().required("Image is required"),
});
