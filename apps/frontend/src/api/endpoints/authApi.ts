import request from "@/api/clients/request";

export const login = async (data: { username: string; password: string }) => {
  const response = await request({
    method: "POST",
    url: "/auth/login",
    data,
  });
  return response.data;
};

export const getCaptcha = async (params: { address: string }) => {
  const response = await request({
    method: "GET",
    url: "/auth/captcha",
    params,
  });
  return response.data;
};

export const forgotPassword = async (data: {
  email: string;
  captcha: string;
  password: string;
}) => {
  const response = await request({
    method: "POST",
    url: "/auth/forgot-password",
    data,
  });
  return response.data;
};
