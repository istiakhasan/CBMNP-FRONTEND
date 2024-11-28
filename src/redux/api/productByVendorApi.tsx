
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const productByVendorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProductByVendor: build.query({
      query: (arg) => ({
        url: `/vendor/${arg?.id}/products`,
        method: "GET",
        params: arg?.params,
      }),
      providesTags: [tagTypes.productByVendor],
    }),
  
  }),
});

export const {
useGetAllProductByVendorQuery
} = productByVendorApi;
