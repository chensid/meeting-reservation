import request from "@/api/clients/request";

type User = {
  username: string;
  nickname: string;
  password: string;
  email: string;
  captcha: string;
};
export const register = (data: User) => {
  return request({
    method: "POST",
    url: "/user/register",
    data,
  });
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

export const freezeUser = (id: number) => {
  return request({
    method: "PATCH",
    url: `/user/${id}/freeze`,
  });
};
