"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  FileText,
  Table,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table as UITable, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import Chart.js directly for more control
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [meetingStats, setMeetingStats] = useState({
    booked: 0,
    scheduled: 0,
    cancelled: 0,
  })

  const [userCount, setUserCount] = useState({
    totalUsers: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
  })

  // State for API data for charts
  const [meetingsChartData, setMeetingsChartData] = useState(null)
  const [usersChartData, setUsersChartData] = useState(null)

  // Raw data for export
  const [rawData, setRawData] = useState({
    meetings: null,
    users: null,
  })

  const [loadingMeetings, setLoadingMeetings] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [meetingsError, setMeetingsError] = useState("")
  const [usersError, setUsersError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Ensure we're on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch meeting stats
  const fetchMeetingStats = async () => {
    setLoadingMeetings(true)
    setMeetingsError("")

    try {
      // For demo purposes, if the API call fails, use mock data
      let data
      try {
        const response = await fetch("http://localhost:3000/api/admin/meetingsCount")
        if (!response.ok) throw new Error("Failed to fetch meeting stats")
        data = await response.json()
      } catch (error) {
        console.warn("Using mock meeting data due to API error:", error)
        // Mock data for demonstration
        data = {
          totalBooked: 0,
          totalScheduled: 0,
          totalCanceled: 0,
        }
      }

      // Store raw data for export
      setRawData((prev) => ({ ...prev, meetings: data }))

      // Set meeting stats using correct field names from the API
      setMeetingStats({
        booked: data.totalBooked || 0,
        scheduled: data.totalScheduled || 0,
        cancelled: data.totalCanceled || 0, // API uses 'totalCanceled'
      })

      // Process data for charts if available
      if (data.meetingsOverTime) {
        setMeetingsChartData({
          labels: data.meetingsOverTime.map((item) => item.period),
          datasets: [
            {
              label: "Booked",
              data: data.meetingsOverTime.map((item) => item.booked),
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Cancelled",
              data: data.meetingsOverTime.map((item) => item.canceled || item.cancelled),
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Scheduled",
              data: data.meetingsOverTime.map((item) => item.scheduled),
              borderColor: "rgb(147, 51, 234)",
              backgroundColor: "rgba(147, 51, 234, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        })
      }
    } catch (err) {
      console.error("Error fetching meeting stats:", err)
      setMeetingsError(err.message || "Failed to fetch meeting data")
    } finally {
      setLoadingMeetings(false)
    }
  }

  // Fetch user stats
  const fetchUserStats = async () => {
    setLoadingUsers(true)
    setUsersError("")

    try {
      // For demo purposes, if the API call fails, use mock data
      let data
      try {
        const response = await fetch("http://localhost:3000/api/admin/analytics")
        if (!response.ok) throw new Error("Failed to fetch user data")
        data = await response.json()
      } catch (error) {
        console.warn("Using mock user data due to API error:", error)
        data = {
          totalUsers: 0,
          DAU: 0,
          WAU: 0,
          MAU: 0,
          userGrowth: [],
        }
      }

      // Store raw data for export
      setRawData((prev) => ({ ...prev, users: data }))

      // Set user stats using correct field names from the API
      setUserCount({
        totalUsers: data.totalUsers || 0,
        dailyActiveUsers: data.DAU || 0,
        weeklyActiveUsers: data.WAU || 0,
        monthlyActiveUsers: data.MAU || 0,
      })

      // Process data for charts if available
      if (data.userGrowth) {
        setUsersChartData({
          labels: data.userGrowth.map((item) => item.period),
          datasets: [
            {
              label: "New Users",
              data: data.userGrowth.map((item) => item.count),
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        })
      }
    } catch (err) {
      console.error("Error fetching user stats:", err)
      setUsersError(err.message || "Failed to fetch user data")
    } finally {
      setLoadingUsers(false)
    }
  }

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchMeetingStats(), fetchUserStats()])
    setRefreshing(false)
  }

  // Initial data fetch
  useEffect(() => {
    if (!mounted) return
    fetchMeetingStats()
    fetchUserStats()
  }, [mounted])

  // Don't render anything during SSR
  if (!mounted) {
    return null
  }

  // StatCard Component
  const StatCard = ({ title, value, icon, color, loading, trend = null, description = null }) => (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className={`p-2 rounded-full bg-${color}-100 flex-shrink-0`}>{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={`text-xs flex items-center ${trend.positive ? "text-green-500" : "text-red-500"}`}>
                {trend.positive ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Function to download data as CSV or JSON
  const downloadData = (dataType = "all") => {
    let csvContent = ""
    let filename = ""

    if (dataType === "meetings" || dataType === "all") {
      const meetingsCSV = [
        "Meetings Data",
        "Metric,Value",
        `Meetings Booked,${meetingStats.booked}`,
        `Meetings Scheduled,${meetingStats.scheduled}`,
        `Meetings Cancelled,${meetingStats.cancelled}`,
      ].join("\n")

      csvContent += meetingsCSV
      filename = "meetings-data"
    }

    if (dataType === "users" || dataType === "all") {
      if (csvContent) csvContent += "\n\n"

      const usersCSV = [
        "User Data",
        "Metric,Value",
        `Daily Active Users,${userCount.dailyActiveUsers}`,
        `Weekly Active Users,${userCount.weeklyActiveUsers}`,
        `Monthly Active Users,${userCount.monthlyActiveUsers}`,
      ].join("\n")

      csvContent += usersCSV
      filename = dataType === "all" ? "dashboard-data" : "users-data"
    }

    if (dataType === "raw" && (rawData.meetings || rawData.users)) {
      // Export raw JSON data
      const jsonData = JSON.stringify(rawData, null, 2)
      const blob = new Blob([jsonData], { type: "application/json;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `dashboard-raw-data-${new Date().toISOString().split("T")[0]}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Create CSV blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Create DAU, WAU, MAU pie chart data
  const createUserActivityPieData = (activeUsers, totalUsers, label, color) => {
    const active = activeUsers || 0
    const total = totalUsers || 1 // Prevent division by zero
    const inactive = Math.max(0, total - active)

    return {
      labels: [`${label}`, "Inactive Users"],
      datasets: [
        {
          data: [active, inactive],
          backgroundColor: [color, "rgb(229, 231, 235)"],
          borderColor: ["white", "white"],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    }
  }

  // Common options for pie charts
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
    cutout: 0, // This makes it a pie chart (0%) instead of donut
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-6 w-full">
      <div className={`w-full transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Error Alerts */}
        {meetingsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error fetching meeting data</AlertTitle>
            <AlertDescription>{meetingsError}</AlertDescription>
          </Alert>
        )}
        {usersError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error fetching user data</AlertTitle>
            <AlertDescription>{usersError}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 transition-all duration-300">
          <StatCard
            title="Meetings Booked"
            value={meetingStats.booked}
            icon={<Calendar className="h-4 w-4 text-green-500" />}
            color="green"
            loading={loadingMeetings}
            description="Total number of meetings that have been booked"
          />
          <StatCard
            title="Meetings Scheduled"
            value={meetingStats.scheduled}
            icon={<CheckCircle className="h-4 w-4 text-purple-500" />}
            color="purple"
            loading={loadingMeetings}
            description="Total number of meetings that have been scheduled"
          />
          <StatCard
            title="Meetings Cancelled"
            value={meetingStats.cancelled}
            icon={<XCircle className="h-4 w-4 text-red-500" />}
            color="red"
            loading={loadingMeetings}
            description="Total number of meetings that have been cancelled"
          />
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 transition-all duration-300">
          <StatCard
            title="Daily Active Users"
            value={userCount.dailyActiveUsers}
            icon={<Users className="h-4 w-4 text-blue-500" />}
            color="blue"
            loading={loadingUsers}
            description="Number of unique users active in the last 24 hours"
            trend={{ positive: true, value: 12 }}
          />
          <StatCard
            title="Weekly Active Users"
            value={userCount.weeklyActiveUsers}
            icon={<Users className="h-4 w-4 text-green-500" />}
            color="green"
            loading={loadingUsers}
            description="Number of unique users active in the last 7 days"
            trend={{ positive: true, value: 8 }}
          />
          <StatCard
            title="Monthly Active Users"
            value={userCount.monthlyActiveUsers}
            icon={<Users className="h-4 w-4 text-purple-500" />}
            color="purple"
            loading={loadingUsers}
            description="Number of unique users active in the last 30 days"
            trend={{ positive: true, value: 5 }}
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="meetings" className="mb-8 w-full">
          <TabsList className="mb-4 flex flex-wrap w-full justify-start">
            <TabsTrigger value="meetings">Meetings Analytics</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="distribution">User Activity</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Trends</CardTitle>
                <CardDescription>Overview of meeting statistics over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loadingMeetings ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : meetingsError ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    Failed to load meeting trend data
                  </div>
                ) : meetingsChartData ? (
                  <Line
                    data={meetingsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            usePointStyle: true,
                            padding: 15,
                          },
                        },
                        tooltip: {
                          mode: "index",
                          intersect: false,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          titleColor: "#000",
                          bodyColor: "#000",
                          borderColor: "rgba(0, 0, 0, 0.1)",
                          borderWidth: 1,
                          padding: 10,
                          boxPadding: 5,
                          usePointStyle: true,
                        },
                      },
                      elements: {
                        line: {
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 6,
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No meeting trend data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Data shown represents meeting activity over the last 6 months
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loadingUsers ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : usersError ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    Failed to load user growth data
                  </div>
                ) : usersChartData ? (
                  <Bar
                    data={usersChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            usePointStyle: true,
                            padding: 15,
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          titleColor: "#000",
                          bodyColor: "#000",
                          borderColor: "rgba(0, 0, 0, 0.1)",
                          borderWidth: 1,
                          padding: 10,
                          boxPadding: 5,
                          callbacks: {
                            label: (context) => `New Users: ${context.raw}`,
                          },
                        },
                      },
                      animation: {
                        duration: 2000,
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No user growth data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Data shown represents new user registrations over the last 6 months
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>Users active in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {loadingUsers ? (
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                ) : usersError ? (
                  <div className="text-red-500">Failed to load user data</div>
                ) : (
                  <div className="w-full h-full max-w-[250px] max-h-[250px] mx-auto">
                    <Pie
                      data={createUserActivityPieData(
                        userCount.dailyActiveUsers,
                        userCount.totalUsers,
                        "Daily Active Users",
                        "rgb(59, 130, 246)",
                      )}
                      options={pieChartOptions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Active Users</CardTitle>
                <CardDescription>Users active in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {loadingUsers ? (
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                ) : usersError ? (
                  <div className="text-red-500">Failed to load user data</div>
                ) : (
                  <div className="w-full h-full max-w-[250px] max-h-[250px] mx-auto">
                    <Pie
                      data={createUserActivityPieData(
                        userCount.weeklyActiveUsers,
                        userCount.totalUsers,
                        "Weekly Active Users",
                        "rgb(34, 197, 94)",
                      )}
                      options={pieChartOptions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Active Users</CardTitle>
                <CardDescription>Users active in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {loadingUsers ? (
                  <Skeleton className="h-[200px] w-[200px] rounded-full" />
                ) : usersError ? (
                  <div className="text-red-500">Failed to load user data</div>
                ) : (
                  <div className="w-full h-full max-w-[250px] max-h-[250px] mx-auto">
                    <Pie
                      data={createUserActivityPieData(
                        userCount.monthlyActiveUsers,
                        userCount.totalUsers,
                        "Monthly Active Users",
                        "rgb(147, 51, 234)",
                      )}
                      options={pieChartOptions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Dashboard Data</CardTitle>
                <CardDescription>Download dashboard data in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Meeting Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UITable>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Booked</TableCell>
                            <TableCell className="text-right">{meetingStats.booked}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Scheduled</TableCell>
                            <TableCell className="text-right">{meetingStats.scheduled}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Cancelled</TableCell>
                            <TableCell className="text-right">{meetingStats.cancelled}</TableCell>
                          </TableRow>
                        </TableBody>
                      </UITable>
                      <Button
                        onClick={() => downloadData("meetings")}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        Download Meetings CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">User Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UITable>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Daily Active</TableCell>
                            <TableCell className="text-right">{userCount.dailyActiveUsers}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Weekly Active</TableCell>
                            <TableCell className="text-right">{userCount.weeklyActiveUsers}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Monthly Active</TableCell>
                            <TableCell className="text-right">{userCount.monthlyActiveUsers}</TableCell>
                          </TableRow>
                        </TableBody>
                      </UITable>
                      <Button
                        onClick={() => downloadData("users")}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        Download Users CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Complete Export</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <Button
                        onClick={() => downloadData("all")}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
                        variant="default"
                      >
                        <FileText className="h-4 w-4" />
                        Download All Data (CSV)
                      </Button>
                      <Button
                        onClick={() => downloadData("raw")}
                        className="w-full flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Table className="h-4 w-4" />
                        Download Raw Data (JSON)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

