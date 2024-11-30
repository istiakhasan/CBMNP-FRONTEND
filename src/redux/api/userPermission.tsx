import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi"; 

export const userPermissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
     createUserPermission: build.mutation({
      query: (data) => ({
        url: "/userpermission",
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.userPermission],
    }),
  }),
});

export const {
 useCreateUserPermissionMutation
} = userPermissionApi;
