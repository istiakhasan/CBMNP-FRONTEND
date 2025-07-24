import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const statusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStatus: build.query({
      query: (params) => ({
        url: "/status",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.status,tagTypes.order],
    }),
    getOrdersCount: build.query({
      query: (params) => ({
        url: "/status/orders-count",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.status,tagTypes.order],
    }),
    getOrdersCountById: build.query({
      query: (data) => ({
        url: `/customers/orders-count/${data?.id}`,
        method: "GET"
      }),
      providesTags: [tagTypes.status,tagTypes.order],
    }),
  }),
});
export const {
 useGetOrdersCountQuery,
 useGetOrdersCountByIdQuery,
 useGetAllStatusQuery
} = statusApi;
