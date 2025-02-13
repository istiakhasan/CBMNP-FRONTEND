import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const requisitionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createRequisition: build.mutation({
      query: (data) => ({
        url: "/requisition",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.requisition],
    }),
    getAllRequisition: build.query({
      query: (data) => ({
        url: "/requisition",
        method: "GET",
      }),
      providesTags: [tagTypes.requisition],
    }),
    getSinglerequistion: build.query({
      query: (data) => ({
        url: `/requisition/${data?.id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.requisition],
    }),
  }),
});

export const {
useCreateRequisitionMutation,
useGetAllRequisitionQuery,
useGetSinglerequistionQuery
} = requisitionApi;
