"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type UserData = {
  type: string
  count: number
  fill: string
}

const chartColors = {
  DAU: "hsl(var(--chart-1))",
  MAU: "hsl(var(--chart-2))",
  TotalUsers: "hsl(var(--chart-3))",
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  DAU: {
    label: "Daily Active Users",
    color: "hsl(var(--chart-1))",
  },
  MAU: {
    label: "Monthly Active Users",
    color: "hsl(var(--chart-2))",
  },
  TotalUsers: {
    label: "Total Users",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function UsersChart() {
  const [chartData, setChartData] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendPercentage, setTrendPercentage] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("http://localhost:3000/api/admin/analytics")

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()

        const transformedData = [
          {
            type: "DAU",
            count: data.DAU || 0,
            fill: chartColors.DAU,
          },
          {
            type: "MAU",
            count: data.MAU || 0,
            fill: chartColors.MAU,
          },
          {
            type: "TotalUsers",
            count: data.totalUsers || 0,
            fill: chartColors.TotalUsers,
          },
        ]

        setChartData(transformedData)

        if (data.MAU) {
          const trend = ((data.DAU - data.MAU / 30) / (data.MAU / 30)) * 100
          setTrendPercentage(trend)
        }
      } catch (err) {
        console.error("Error fetching chart data:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Users</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-full"></div>
            <div className="mt-4 h-4 w-24 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Users</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="text-destructive text-center">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Users</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending {trendPercentage >= 0 ? "up" : "down"} by {Math.abs(trendPercentage).toFixed(1)}% this month
          <TrendingUp className={`h-4 w-4 ${trendPercentage < 0 ? "rotate-180 text-destructive" : "text-primary"}`} />
        </div>
        <div className="leading-none text-muted-foreground">Showing total users for the last month</div>
      </CardFooter>
    </Card>
  )
}
