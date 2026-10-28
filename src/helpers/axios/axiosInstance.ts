// import { authKey } from "@/constants/storageKey";
// import { getNewAccessToken } from "@/service/authService";
// import { getFormLocalStorage, setToLocalStorage } from "@/util/local-storage";

// import axios from "axios";

// const instance = axios.create();
// instance.defaults.headers.post["Content-Type"] = "application/json";
// instance.defaults.headers["Accept"] = "application/json";
// instance.defaults.timeout = 60000;
// instance.interceptors.request.use(
//   function (config) {
//     const accessToken = getFormLocalStorage(authKey);
//     if (accessToken) {
//       config.headers.Authorization = accessToken;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );
// instance.interceptors.response.use(
//   //@ts-ignore
//   function (response) {
//     return response;
//   },
//   async function (error) {

//     const config=error?.config;

//     if (error?.response?.status === 403 && !config?.sent) {
//       config.sent=true
//       const response=await getNewAccessToken();
//       const accessToken=response?.data?.data?.token 
//       config.headers['Authorization']=accessToken
//       setToLocalStorage(authKey,accessToken)
//       return instance(config)
//     } else {
//       const responseObject = {
//         statusCode: error?.response?.data?.statusCode || 500,
//         message: error?.response?.data?.message || "Something went wrong",
//         errorMessages: error?.response?.data?.errorMessages
//         ,
//       };
//       return responseObject;
//     }

//     // return Promise.reject(error);
//   }
// );

// export { instance };
import { authKey } from "@/constants/storageKey";
import { clearAuth, getNewAccessToken, getUserInfo } from "@/service/authService";
import { getFormLocalStorage, setToLocalStorage } from "@/util/local-storage";
import axios from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      // Let the browser add multipart/form-data including its required boundary.
      config.headers?.delete?.("Content-Type");
    }
    const accessToken = getFormLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization =accessToken;
    }

    const userInfo:any=  getUserInfo()

    if (userInfo?.organizationId) {
      config.headers['x-organization-id'] = userInfo?.organizationId;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const config = error?.config;

    const status = error?.response?.status;
    const isRefreshRequest = String(config?.url || "").includes("/auth/refresh-token");
    if ([401, 403, 419].includes(status) && !config?.sent && !isRefreshRequest) {
      config.sent = true;
      try {
        const response = await getNewAccessToken();
        const accessToken = response?.data?.data?.token;
        if (accessToken) {
          config.headers['Authorization'] = accessToken;
          setToLocalStorage(authKey, accessToken);
          return instance(config);
        } else {
          handleLogout();
        }
      } catch (tokenError) {
        handleLogout();
      }
    } else {
    
      const responseObject = {
        statusCode: error?.response?.data?.statusCode || 500,
        message: error?.response?.data?.message || "Something went wrong",
        errorMessages: error?.response?.data?.errorMessages,
      };
      return Promise.reject(error);
    }
  }
);

function handleLogout() {
  clearAuth();
  if (typeof window !== "undefined") {
    const locale = window.location.pathname.split("/").filter(Boolean)[0] || "en";
    window.location.replace(`/${locale}/login`);
  }
}

export { instance };
