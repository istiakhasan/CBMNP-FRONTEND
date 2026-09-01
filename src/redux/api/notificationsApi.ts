import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSmsTemplates: build.query({
      query: () => ({ url: "/notifications/sms-templates", method: "GET" }),
      providesTags: [tagTypes.notifications],
    }),
    createSmsTemplate: build.mutation({
      query: (data) => ({ url: "/notifications/sms-templates", method: "POST", data }),
      invalidatesTags: [tagTypes.notifications],
    }),
    getSmsLogs: build.query({
      query: () => ({ url: "/notifications/sms-logs", method: "GET" }),
      providesTags: [tagTypes.notifications],
    }),
    getWebhookEndpoints: build.query({
      query: () => ({ url: "/notifications/webhooks/endpoints", method: "GET" }),
      providesTags: [tagTypes.notifications],
    }),
    createWebhookEndpoint: build.mutation({
      query: (data) => ({ url: "/notifications/webhooks/endpoints", method: "POST", data }),
      invalidatesTags: [tagTypes.notifications],
    }),
    getWebhookLogs: build.query({
      query: () => ({ url: "/notifications/webhooks/logs", method: "GET" }),
      providesTags: [tagTypes.notifications],
    }),
  }),
});

export const {
  useGetSmsTemplatesQuery,
  useCreateSmsTemplateMutation,
  useGetSmsLogsQuery,
  useGetWebhookEndpointsQuery,
  useCreateWebhookEndpointMutation,
  useGetWebhookLogsQuery,
} = notificationsApi;
