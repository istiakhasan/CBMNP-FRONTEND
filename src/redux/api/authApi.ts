import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (data) => ({
        url: "/auth/log-in",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
    getProfileInfo: build.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET"
      }),
      providesTags: [tagTypes.auth,tagTypes.users],
    }),
   
  }),
});

export const {
 useSignInMutation,
 useGetProfileInfoQuery
} = authApi;
