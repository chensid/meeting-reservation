import {
  getUserBookingCount,
  getMeetingRoomBookingCount,
  statisticParams,
} from "@/api/endpoints/statisticApi";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { Spin } from "antd";
import { useEcharts } from "@/hooks/useEcharts";
import type { EChartsOption } from "echarts";

const StatisticPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<statisticParams>({});
  console.log(setQueryParams);

  const statisticQueries = useQueries({
    queries: [
      {
        queryKey: ["userBookingCount", queryParams],
        queryFn: () => getUserBookingCount(queryParams),
      },
      {
        queryKey: ["meetingRoomBookingCount", queryParams],
        queryFn: () => getMeetingRoomBookingCount(queryParams),
      },
    ],
  });
  const isLoading = statisticQueries.some((query) => query.isPending);

  const [userBookingStats, roomBookingStats] = statisticQueries;

  const userChartOptions: EChartsOption = {
    title: {
      text: "用户预定情况",
    },
    tooltip: {},
    xAxis: {
      data: userBookingStats.data?.userBookingStats.map(
        (item) => item.username
      ),
    },
    yAxis: {},
    series: [
      {
        name: "预定数量",
        type: "bar",
        data: userBookingStats.data?.userBookingStats.map(
          (item) => item.bookingCount
        ),
      },
    ],
  };

  const { chartRef: userChartRef } = useEcharts({
    options: userChartOptions,
  });

  const roomChartOptions: EChartsOption = {
    title: {
      text: "会议室使用情况",
    },
    xAxis: {
      data: roomBookingStats.data?.meetingRoomBookingStats?.map(
        (item) => item.name
      ),
    },
    yAxis: {},
    series: [
      {
        name: "使用次数",
        type: "pie",
        data: roomBookingStats.data?.meetingRoomBookingStats?.map((item) => {
          return {
            name: item.name,
            value: item.bookingCount,
          };
        }),
      },
    ],
  };
  const { chartRef: roomChartRef } = useEcharts({
    options: roomChartOptions,
  });

  return (
    <div>
      <Spin spinning={isLoading}>
        <div ref={userChartRef} style={{ width: "100%", height: "400px" }} />
        <div ref={roomChartRef} style={{ width: "100%", height: "500px" }} />
      </Spin>
    </div>
  );
};

export default StatisticPage;
