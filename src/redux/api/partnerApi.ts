import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPartner: build.mutation({
      query: (data) => ({
        url: "/delivery-partner/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.deliveryPartner],
    }),

    getDeliveryPartners: build.query({
      query: (params) => ({
        url: "/delivery-partner",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.deliveryPartner],
    }),
    getDeliveryPartnerOptions: build.query({
      query: () => ({
        url: "/delivery-partner/options",
        method: "GET"
      }),
      providesTags: [tagTypes.deliveryPartner],
    }),
    updatePartner: build.mutation({
      query: (data) => ({
        url: `/delivery-partner/${data?.id}`,
        method: "PATCH",
        data:data?.data,
      }),
      invalidatesTags: [tagTypes.deliveryPartner],
    }),
  }),
});

export const {
 useGetDeliveryPartnersQuery,
 useCreatePartnerMutation,
 useUpdatePartnerMutation,
 useGetDeliveryPartnerOptionsQuery
} = partnerApi;
