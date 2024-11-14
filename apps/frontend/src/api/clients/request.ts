import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";

interface ApiError {
  code: number;
  message: string;
  status: number;
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  headers: {
    Accept: "application/json text/plain */*",
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        message.error("登录过期，请重新登录");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }

      const { message: msg } = error.response.data;
      message.error(msg || "系统异常");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default request;
