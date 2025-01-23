import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; // assuming fetchBaseQuery is exported from baseApi

export const commentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitComment: build.mutation({
      query: (data) => ({
        url: "/comment",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.comment,tagTypes.order],
    })
  }),
});

export const {
    useSubmitCommentMutation,
} = commentApi;
