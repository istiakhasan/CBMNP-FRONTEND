import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSubscriber: build.mutation({
      query: (data) => ({
        url: "/subscriber",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.subscriber],
    }),
    getSubscribers: build.query({
      query: (data) => ({
        url: "/subscriber",
        method: "GET",
        params:data
      }),
      providesTags: [tagTypes.subscriber],
    }),
    createSubscriberOrder: build.mutation({
      query: (data) => ({
        url: "/subsriber-order-history",
        method: "POST",
        data
      }),
      invalidatesTags: [tagTypes.subscriber],
    }),
    getSubscriberCount: build.query({
      query: () => ({
        url: "/subscriber/count",
        method: "GET",
      }),
      providesTags: [tagTypes.subscriber],
    }),
    updateSubscriberData: build.mutation({
      query: (data) => ({
        url:`/subscriber/${data?.id}`,
        method: "PATCH",
        data:data?.data
      }),
      invalidatesTags: [tagTypes.subscriber],
    }),
    getSingleSubscribers: build.query({
      query: (data) => ({
        url: `/subscriber/${data?.id}`,
        method: "GET"
      }),
      providesTags: [tagTypes.subscriber],
    }),
  }),
});

export const {
 useCreateSubscriberMutation,
 useGetSubscribersQuery,
 useGetSingleSubscribersQuery,
 useCreateSubscriberOrderMutation,
 useUpdateSubscriberDataMutation,
 useGetSubscriberCountQuery
} = subscriberApi;
