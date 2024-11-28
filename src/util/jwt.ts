import { authKey } from "@/constants/storageKey";
import { removeUserInfo } from "@/service/authService";
import {jwtDecode} from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
      removeUserInfo(authKey);
      window.location.href = "/login";
  }
};
