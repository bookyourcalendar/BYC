"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MeetingsChart = () => {
  const monthData = [
    { month: "January", MeetingsBooked: 186, MeetingsCancelled: 80, MeetingsAttended: 20 },
    { month: "February", MeetingsBooked: 305, MeetingsCancelled: 200, MeetingsAttended: 60 },
    { month: "March", MeetingsBooked: 237, MeetingsCancelled: 120, MeetingsAttended: 80 },
    { month: "April", MeetingsBooked: 73, MeetingsCancelled: 190, MeetingsAttended: 70 },
    { month: "May", MeetingsBooked: 209, MeetingsCancelled: 130, MeetingsAttended: 120 },
    { month: "June", MeetingsBooked: 214, MeetingsCancelled: 140, MeetingsAttended: 110 },
  ];

  const weekData = [
    { day: "Mon", MeetingsBooked: 30, MeetingsCancelled: 10, MeetingsAttended: 5 },
    { day: "Tue", MeetingsBooked: 40, MeetingsCancelled: 15, MeetingsAttended: 10 },
    { day: "Wed", MeetingsBooked: 35, MeetingsCancelled: 12, MeetingsAttended: 8 },
    { day: "Thu", MeetingsBooked: 45, MeetingsCancelled: 18, MeetingsAttended: 12 },
    { day: "Fri", MeetingsBooked: 50, MeetingsCancelled: 20, MeetingsAttended: 15 },
    { day: "Sat", MeetingsBooked: 55, MeetingsCancelled: 22, MeetingsAttended: 18 },
    { day: "Sun", MeetingsBooked: 60, MeetingsCancelled: 25, MeetingsAttended: 20 },
  ];

  const yearData = [
    {
      period: "Year",
      MeetingsBooked: monthData.reduce((sum, item) => sum + item.MeetingsBooked, 0),
      MeetingsCancelled: monthData.reduce((sum, item) => sum + item.MeetingsCancelled, 0),
      MeetingsAttended: monthData.reduce((sum, item) => sum + item.MeetingsAttended, 0),
    },
  ];

  const chartConfig = {
    MeetingsBooked: { label: "Meetings Booked", color: "#2563eb" },
    MeetingsCancelled: { label: "Meetings Cancelled", color: "hsl(var(--chart-1))" },
    MeetingsAttended: { label: "Meetings Attended", color: "hsl(var(--chart-2))" },
  };

  const [filter, setFilter] = useState("month");
  const getFilteredData = () => {
    switch (filter) {
      case "7days": return weekData;
      case "month": return monthData;
      case "year": return yearData;
      default: return monthData;
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Card className="w-full max-w-[800px] p-6">
        <Tabs defaultValue="month" className="w-full">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="7days" onClick={() => setFilter("7days")}>Last 7 Days</TabsTrigger>
            <TabsTrigger value="month" onClick={() => setFilter("month")}>Month-wise</TabsTrigger>
            <TabsTrigger value="year" onClick={() => setFilter("year")}>Year-wise</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <ChartContainer config={chartConfig} className="h-[400px] w-full max-w-full">
              <BarChart accessibilityLayer data={getFilteredData()}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={filter === "7days" ? "day" : filter === "month" ? "month" : "period"}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="MeetingsBooked" fill="var(--color-MeetingsBooked)" radius={4} />
                <Bar dataKey="MeetingsCancelled" fill="var(--color-MeetingsCancelled)" radius={4} />
                <Bar dataKey="MeetingsAttended" fill="var(--color-MeetingsAttended)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default MeetingsChart;
