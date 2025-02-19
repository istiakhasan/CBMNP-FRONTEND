
import { authKey } from "@/constants/storageKey";
import { instance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { decodeToken } from "@/util/jwt";
import {getFormLocalStorage, setToLocalStorage } from "@/util/local-storage";



export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  return setToLocalStorage(authKey, accessToken);
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

export const getNewAccessToken=async()=>{
  return await instance({
    url:`${getBaseUrl()}/auth/refresh-token`,
    method:"POST",
    headers:{'Content-Type':"application/json"},
    withCredentials:true
  })
}
