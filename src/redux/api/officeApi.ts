import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const officeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllOffice: build.query({
      query: (arg) => ({
        url: "/office/get-all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.office],
    }),
     createOffice: build.mutation({
       query: (data) => ({
        url: "/office/create",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.office],
    }),
     deleteOffice: build.mutation({
       query: (data) => ({
        url: `/office/delete/${data?.id}`,
        method: "DELETE"
      }),
      invalidatesTags: [tagTypes.office],
    }),
     updateOffice: build.mutation({
       query: (data) => ({
        url: `/office/update/${data?.id}`,
        method: "PATCH",
        data:data?.data
      }),
      invalidatesTags: [tagTypes.office],
    }),
  }),
});

export const { useGetAllOfficeQuery,useCreateOfficeMutation,useDeleteOfficeMutation,useUpdateOfficeMutation } = officeApi;
