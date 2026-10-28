
import { authKey, refreshTokenKey } from "@/constants/storageKey";
import { instance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { decodeToken } from "@/util/jwt";
import {getFormLocalStorage, setToLocalStorage } from "@/util/local-storage";



export const storeUserInfo = ({ accessToken, refreshToken }: { accessToken: string; refreshToken?: string }) => {
  setToLocalStorage(authKey, accessToken);
  if (refreshToken) setToLocalStorage(refreshTokenKey, refreshToken);
};

export const getUserInfo = () => {
  const authToken = getFormLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodeToken(authToken);
    return decodedData;
  } else {
    return "";
  }
};

export const isLoggedIn = () => {
  const authToken = getFormLocalStorage(authKey);
  return !!authToken;
};

export const removeUserInfo = (key: string) => {
  return localStorage.removeItem(key);
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(authKey);
  localStorage.removeItem(refreshTokenKey);
};

export const getNewAccessToken=async()=>{
  const refreshToken = getFormLocalStorage(refreshTokenKey);
  if (!refreshToken) throw new Error("No refresh token");
  return await instance({
    url:`${getBaseUrl()}/auth/refresh-token`,
    method:"POST",
    headers:{'Content-Type':"application/json"},
    data: { refreshToken },
    withCredentials:true
  })
}
