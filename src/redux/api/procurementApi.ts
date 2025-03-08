import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProcurement: build.mutation({
      query: (data) => ({
        url: "/procurements",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.procurements],
    }),
    getProcurement: build.query({
      query: (params) => ({
        url: "/procurements",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.procurements],
    }),
  }),
});

export const {
 useCreateProcurementMutation,
 useGetProcurementQuery
} = procurementApi;
