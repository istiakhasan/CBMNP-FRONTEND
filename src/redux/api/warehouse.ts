import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const warehouseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createWarehouse: build.mutation({
      query: (data) => ({
        url: "/warehouse",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.warehouse],
    }),
    loadAllWarehouse: build.query({
      query: (arg) => ({
        url: "/warehouse",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.warehouse],
    }),
  }),
});

export const {
    useLoadAllWarehouseQuery,
    useCreateWarehouseMutation
} = warehouseApi;
