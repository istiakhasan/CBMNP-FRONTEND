
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { instance as axiosInstance } from "./axiosInstance";

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      meta?: any;
      contentType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, contentType }) => {
    try {
      // Axios must create the multipart boundary itself. Setting JSON here
      // caused Multer to receive no `document` field for file uploads.
      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: isFormData ? undefined : { "Content-Type": contentType || "application/json" },
        withCredentials: true,
      });
      return {data:result?.data};
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
