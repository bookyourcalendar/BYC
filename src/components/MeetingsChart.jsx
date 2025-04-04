"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  totalBooked: { label: "Meetings Booked", color: "hsl(210, 100%, 70%)" },
  totalScheduled: { label: "Meetings Scheduled", color: "hsl(210, 100%, 55%)" },
  totalCanceled: { label: "Meetings Cancelled", color: "hsl(210, 100%, 40%)" },
};

const MeetingsChart = () => {
  const [dataType, setDataType] = useState("totalBooked");
  const [timeRange, setTimeRange] = useState("7d");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://bookyourcalendar.com/api/admin/meetingsGraph?filter=${timeRange}`
        );
        const result = await response.json();

        setChartData([
          { label: chartConfig[dataType].label, value: result[dataType] || 0 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setChartData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [dataType, timeRange]);

  return (
    <div className="flex flex-col gap-6 items-center w-full px-4 md:px-0">
      <Card className="w-full max-w-[800px] p-6 relative">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-end gap-4 mb-4 w-full">
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalBooked">Meetings Booked</SelectItem>
              <SelectItem value="totalScheduled">Meetings Scheduled</SelectItem>
              <SelectItem value="totalCanceled">Meetings Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="365d">Last 365 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[400px] w-full max-w-full"
          >
            <BarChart accessibilityLayer data={chartData} barSize={250}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis axisLine={true} tickLine={true} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="value"
                fill={chartConfig[dataType].color}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </Card>
    </div>
  );
};

export default MeetingsChart;
