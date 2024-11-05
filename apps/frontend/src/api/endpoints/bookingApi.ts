import request from "@/api/clients/request";

export type BookingQuery = {
  username?: string;
  roomName?: string;
  startTime?: number;
  endTime?: number;
  status?: string;
  page: number;
  limit: number;
};

export const getBookingList = async (params: BookingQuery) => {
  const response = await request({
    method: "GET",
    url: "/booking/list",
    params,
  });
  return response.data;
};

export type CreateBookingParams = {
  roomId: string;
  startTime: number;
  endTime: number;
  note?: string;
};

export const createBooking = async (data: CreateBookingParams) => {
  const response = await request({
    method: "POST",
    url: "/booking/create",
    data,
  });
  return response.data;
};

export const approveBooking = async (id: string) => {
  const response = await request({
    method: "PATCH",
    url: `/booking/approve/${id}`,
  });
  return response.data;
};

export const rejectBooking = async (id: string) => {
  const response = await request({
    method: "PATCH",
    url: `/booking/reject/${id}`,
  });
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await request({
    method: "PATCH",
    url: `/booking/cancel/${id}`,
  });
  return response.data;
};

export const getBookingHistory = async (params: BookingQuery) => {
  const response = await request({
    method: "GET",
    url: "/booking/history",
    params,
  });
  return response.data;
};

export const urgeBooking = async (id: string) => {
  const response = await request({
    method: "GET",
    url: `/booking/urge/${id}`,
  });
  return response.data;
};
