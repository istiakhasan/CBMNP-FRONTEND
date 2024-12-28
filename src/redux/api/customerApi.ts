import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation({
      query: (data) => ({
        url: "/customers",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.customer],
    }),
    getAllCustomers: build.query({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.customer],
    }),
  }),
});

export const {
    useCreateCustomerMutation,
    useGetAllCustomersQuery
} = customerApi;
