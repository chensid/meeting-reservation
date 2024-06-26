import request from "@/api/clients/request";

export const login = (data: { username: string; password: string }) => {
  return request({
    method: "POST",
    url: "/auth/login",
    data,
  });
};

export const getCaptcha = (params: { address: string }) => {
  return request({
    method: "GET",
    url: "/auth/captcha",
    params,
  });
};

export const forgotPassword = (data: {
  email: string;
  captcha: string;
  password: string;
}) => {
  return request({
    method: "POST",
    url: "/auth/forgot-password",
    data,
  });
};
