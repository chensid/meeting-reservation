import request from "@/api/clients/request";

export type statisticParams = {
  startTime?: number;
  endTime?: number;
};

export type UserBookingStatsResponse = {
  userBookingStats: [
    {
      id: string;
      username: string;
      bookingCount: number;
    },
  ];
};

export const getUserBookingCount = async (
  params: statisticParams
): Promise<UserBookingStatsResponse> => {
  const response = await request({
    method: "GET",
    url: "/statistic/userBookingCount",
    params,
  });
  return response.data;
};

export type MeetingRoomBookingStatsResponse = {
  meetingRoomBookingStats: [
    {
      id: string;
      name: string;
      bookingCount: number;
    },
  ];
};
export const getMeetingRoomBookingCount = async (
  params: statisticParams
): Promise<MeetingRoomBookingStatsResponse> => {
  const response = await request({
    method: "GET",
    url: "/statistic/meetingRoomBookingCount",
    params,
  });
  return response.data;
};
