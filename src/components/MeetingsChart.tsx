"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
//MeetingsChart satisfies ChartConfig;
const MeetingsChart = () => {
  //   const chartData = [
  //     {
  //       month: "January",
  //       MeetingsBooked: 186,
  //       MeetingsCancelled: 80,
  //       MeetingsAttended: 20,
  //     },
  //     {
  //       month: "February",
  //       MeetingsBooked: 305,
  //       MeetingsCancelled: 200,
  //       MeetingsAttended: 60,
  //     },
  //     {
  //       month: "March",
  //       MeetingsBooked: 237,
  //       MeetingsCancelled: 120,
  //       MeetingsAttended: 80,
  //     },
  //     {
  //       month: "April",
  //       MeetingsBooked: 73,
  //       MeetingsCancelled: 190,
  //       MeetingsAttended: 70,
  //     },
  //     {
  //       month: "May",
  //       MeetingsBooked: 209,
  //       MeetingsCancelled: 130,
  //       MeetingsAttended: 120,
  //     },
  //     {
  //       month: "June",
  //       MeetingsBooked: 214,
  //       MeetingsCancelled: 140,
  //       MeetingsAttended: 110,
  //     },
  //   ];

  const monthData = [
    {
      month: "January",
      MeetingsBooked: 186,
      MeetingsCancelled: 80,
      MeetingsAttended: 20,
    },
    {
      month: "February",
      MeetingsBooked: 305,
      MeetingsCancelled: 200,
      MeetingsAttended: 60,
    },
    {
      month: "March",
      MeetingsBooked: 237,
      MeetingsCancelled: 120,
      MeetingsAttended: 80,
    },
    {
      month: "April",
      MeetingsBooked: 73,
      MeetingsCancelled: 190,
      MeetingsAttended: 70,
    },
    {
      month: "May",
      MeetingsBooked: 209,
      MeetingsCancelled: 130,
      MeetingsAttended: 120,
    },
    {
      month: "June",
      MeetingsBooked: 214,
      MeetingsCancelled: 140,
      MeetingsAttended: 110,
    },
  ];

  const weekData = [
    {
      day: "Mon",
      MeetingsBooked: 30,
      MeetingsCancelled: 10,
      MeetingsAttended: 5,
    },
    {
      day: "Tue",
      MeetingsBooked: 40,
      MeetingsCancelled: 15,
      MeetingsAttended: 10,
    },
    {
      day: "Wed",
      MeetingsBooked: 35,
      MeetingsCancelled: 12,
      MeetingsAttended: 8,
    },
    {
      day: "Thu",
      MeetingsBooked: 45,
      MeetingsCancelled: 18,
      MeetingsAttended: 12,
    },
    {
      day: "Fri",
      MeetingsBooked: 50,
      MeetingsCancelled: 20,
      MeetingsAttended: 15,
    },
    {
      day: "Sat",
      MeetingsBooked: 55,
      MeetingsCancelled: 22,
      MeetingsAttended: 18,
    },
    {
      day: "Sun",
      MeetingsBooked: 60,
      MeetingsCancelled: 25,
      MeetingsAttended: 20,
    },
  ];

  const yearData = [
    {
      period: "Year",
      MeetingsBooked: monthData.reduce(
        (sum, item) => sum + item.MeetingsBooked,
        0
      ),
      MeetingsCancelled: monthData.reduce(
        (sum, item) => sum + item.MeetingsCancelled,
        0
      ),
      MeetingsAttended: monthData.reduce(
        (sum, item) => sum + item.MeetingsAttended,
        0
      ),
    },
  ];

  const chartConfig = {
    MeetingsBooked: {
      label: "Meetings Booked",
      color: "#2563eb",
    },
    MeetingsCancelled: {
      label: "Meetings Cancelled",
      //   color: "#60a5fa",
      color: "hsl(var(--chart-1))",
    },
    MeetingsAttended: {
      label: "Meetings Attended",
      // color: "#60a5fd"
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [filter, setFilter] = useState<"7days" | "month" | "year">("month");
  const [filteredData, setFilteredData] = useState(monthData);

  const handleFilterChange = (newFilter: "7days" | "month" | "year") => {
    setFilter(newFilter);

    // Apply filtering logic
    if (newFilter === "7days") {
      // Simulate data for the last 7 days
      setFilteredData(weekData); // Example: Use first month data as dummy
    } else if (newFilter === "month") {
      setFilteredData(monthData); // Month-wise: Use full data
    } else if (newFilter === "year") {
      // Simulate yearly aggregated data
      //   setFilteredData([
      //     {
      //       month: "Year",
      //       MeetingsBooked: chartData.reduce(
      //         (sum, item) => sum + item.MeetingsBooked,
      //         0
      //       ),
      //       MeetingsCancelled: chartData.reduce(
      //         (sum, item) => sum + item.MeetingsCancelled,
      //         0
      //       ),
      //       MeetingsAttended: chartData.reduce(
      //         (sum, item) => sum + item.MeetingsAttended,
      //         0
      //       ),
      //     },
      //   ]);
      setFilteredData(yearData);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Card>
        <div className="flex gap-4">
          <Button
            className={`px-4 py-2 border ${
              filter === "7days"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleFilterChange("7days")}
          >
            Last 7 Days
          </Button>
          <Button
            className={`px-4 py-2 border ${
              filter === "month"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleFilterChange("month")}
          >
            Month-wise
          </Button>
          <Button
            className={`px-4 py-2 border ${
              filter === "year"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleFilterChange("year")}
          >
            Year-wise
          </Button>
        </div>

        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-[600px] max-w-full"
        >
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="MeetingsBooked"
              fill="var(--color-MeetingsBooked)"
              radius={4}
            />
            <Bar
              dataKey="MeetingsCancelled"
              fill="var(--color-MeetingsCancelled)"
              radius={4}
            />
            <Bar
              dataKey="MeetingsAttended"
              fill="var(--color-MeetingsAttended)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};

export default MeetingsChart;
