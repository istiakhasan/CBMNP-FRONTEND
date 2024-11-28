import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
export const divisionsApi=baseApi.injectEndpoints({
    endpoints:(build)=>({
        getAllDivision:build.query({
            query:(arg)=>({
                url:"/divisions",
                method:"GET"
            }),
            providesTags:[tagTypes.division]
        }),
        getDistrictById:build.query({
            query:(arg)=>({
                url:`/divisions/${arg?.id}`,
                method:"GET",
            }),
            providesTags:[tagTypes.division],
            transformResponse:(res:any)=>{
                return res?.district_info
            }
        }),
        getThanaById:build.query({
            query:(arg)=>({
                url:`/districts/${arg?.id}`,
                method:"GET",
            }),
            providesTags:[tagTypes.division],
            transformResponse:(res:any)=>{
                return res?.thana_info
            }
        }),
    })
})
export const {useGetAllDivisionQuery,useGetDistrictByIdQuery,useGetThanaByIdQuery}=divisionsApi
