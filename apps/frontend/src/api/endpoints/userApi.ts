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
    data
  });
};
