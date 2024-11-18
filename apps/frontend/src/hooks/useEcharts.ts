import { useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";

interface UseEchartsProps {
  options: EChartsOption;
  theme?: string;
  autoResize?: boolean;
}

export const useEcharts = ({
  options,
  theme,
  autoResize = true,
}: UseEchartsProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts>();

  const handleResize = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  const getInstance = useCallback(() => chartInstance.current, []);

  const setOption = useCallback(
    (option: EChartsOption, opts?: SetOptionOpts) => {
      chartInstance.current?.setOption(option, opts);
    },
    []
  );

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chart, theme);
      chartInstance.current.setOption(options, { notMerge: true });
    } else {
      chartInstance.current.setOption(options);
    }

    if (autoResize) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (autoResize) {
        window.removeEventListener("resize", handleResize);
      }
      chartInstance.current?.dispose();
      chartInstance.current = undefined;
    };
  }, [theme, options, autoResize, handleResize]);

  return {
    chartRef,
    getInstance,
    setOption,
  };
};
