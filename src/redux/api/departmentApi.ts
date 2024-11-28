import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDepartment: build.query({
      query: (arg) => ({
        url: "/department/get-all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.department],
    }),
    getDepartmentByOffice: build.query({
      query: (arg) => ({
        url: `/department/getbyofficeid/${arg?.id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.department],
    }),
    createDepartment: build.mutation({
      query: (data) => ({
        url: "/department/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.department],
    }),
    deleteDepartment: build.mutation({
      query: (data) => ({
        url: `/department/delete/${data?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.department],
    }),
    updateDepartment: build.mutation({
      query: (data) => ({
        url: `/department/update/${data?.id}`,
        method: "PATCH",
        data: data?.data,
      }),
      invalidatesTags: [tagTypes.department],
    }),
  }),
});

export const {
  useGetAllDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByOfficeQuery
} = departmentApi;
