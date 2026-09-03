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
    replaceUserPermission: build.mutation({
      query: ({ userId, permissionIds }) => ({
        url: `/userpermission/${userId}`,
        method: "PUT",
        data: { permissionIds },
      }),
      invalidatesTags: [tagTypes.userPermission, tagTypes.users],
    }),
  }),
});

export const {
 useCreateUserPermissionMutation,
 useReplaceUserPermissionMutation,
} = userPermissionApi;
