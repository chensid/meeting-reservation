import request from "@/api/clients/request";

export const login = (data: { username: string; password: string }) => {
  return request({
    method: "POST",
    url: "/auth/login",
    data,
  });
};
