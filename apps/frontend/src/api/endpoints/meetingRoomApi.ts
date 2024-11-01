import request from "@/api/clients/request";

export type MeetingRoom = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment?: string;
  description?: string;
  isBooked: boolean;
  createTime: string;
  updateTime: string;
};

export const getMeetingRoom = async (id: string) => {
  const response = await request({
    method: "GET",
    url: `/meeting-room/${id}`,
  });
  return response.data;
};

type MeetingRoomQuery = {
  name?: string;
  capacity?: number;
  equipment?: string;
  page: number;
  limit: number;
};
export const getMeetingRoomList = async (params: MeetingRoomQuery) => {
  const response = await request({
    method: "GET",
    url: "/meeting-room/list",
    params,
  });
  return response.data;
};

type MeetingRoomParams = {
  name: string;
  capacity: number;
  location: string;
  equipment?: string;
  description?: string;
};
export const createMeetingRoom = (data: MeetingRoomParams) => {
  return request({
    method: "POST",
    url: "/meeting-room/create",
    data,
  });
};
type UpdateMeetingRoomParams = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment?: string;
  description?: string;
};
export const updateMeetingRoom = (data: UpdateMeetingRoomParams) => {
  return request({
    method: "PATCH",
    url: "/meeting-room/update",
    data,
  });
};

export const deleteMeetingRoom = (id: string) => {
  return request({
    method: "DELETE",
    url: `/meeting-room/${id}`,
  });
};
