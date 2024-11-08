import request from "@/api/clients/request";

export type UserBookingCountParams = {
  startTime: number;
  endTime: number;
};
export const getUserBookingCount = async (params: UserBookingCountParams) => {
  const response = await request({
    method: "GET",
    url: "/statistic/userBookingCount",
    params,
  });
  return response.data;
};

export type meetingRoomBookingCountParams = {
  startTime: number;
  endTime: number;
};

export const getMeetingRoomBookingCount = async (
  params: meetingRoomBookingCountParams
) => {
  const response = await request({
    method: "GET",
    url: "/statistic/meetingRoomBookingCount",
    params,
  });
  return response.data;
};
