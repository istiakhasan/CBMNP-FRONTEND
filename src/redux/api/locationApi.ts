import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const locationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // deleteCategory: build.mutation({
    //   query: (data) => ({
    //     url: `/main-category/${data?.id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [tagTypes.mainCategory],
    // }),
    getAllDistrict: build.query({
      query: (arg) => ({
        url: "/main-category",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.mainCategory],
    }),
  }),
});

export const {
    useGetAllDistrictQuery,

} = locationApi;
