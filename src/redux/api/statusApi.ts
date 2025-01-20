import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const statusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrdersCount: build.query({
      query: () => ({
        url: "/status/orders-count",
        method: "GET"
      }),
      providesTags: [tagTypes.status,tagTypes.order],
    }),
 
  }),
});

export const {
 useGetOrdersCountQuery
} = statusApi;
