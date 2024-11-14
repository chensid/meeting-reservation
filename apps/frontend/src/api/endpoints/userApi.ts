import request from "@/api/clients/request";

type User = {
  username: string;
  nickname: string;
  password: string;
  email: string;
  captcha: string;
};
export const register = async (data: User) => {
  const response = await request({
    method: "POST",
    url: "/user/register",
    data,
  });
  return response.data;
};

type UserQuery = {
  username?: string;
  nickname?: string;
  email?: string;
  page: number;
  limit: number;
};
export const getUserList = async (params: UserQuery) => {
  const response = await request({ method: "GET", url: "/user/list", params });
  return response.data;
};

export const getLoginUser = async () => {
  const response = await request({ method: "GET", url: "/user/current" });
  return response.data;
};

export const freezeUser = async (id: number) => {
  const response = await request({
    method: "PATCH",
    url: `/user/${id}/freeze`,
  });
  return response.data;
};
