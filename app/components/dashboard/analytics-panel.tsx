"use client"

import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "₹8,700",
    change: "+18%",
    trend: "up",
    subtitle: "this month",
  },
  {
    title: "Deals Closed",
    value: "12",
    change: "+5",
    trend: "up",
    subtitle: "this month",
  },
  {
    title: "Avg Deal Size",
    value: "₹5K",
    change: "+12%",
    trend: "up",
    subtitle: "vs last month",
  },
  {
    title: "Conversion Rate",
    value: "45%",
    change: "+8%",
    trend: "up",
    subtitle: "improved",
  },
]

const funnelData = [
  { stage: "Leads Enter", count: 1000, percentage: 100, color: "bg-blue-500" },
  { stage: "Show Interest", count: 200, percentage: 20, color: "bg-green-500" },
  { stage: "Consider", count: 50, percentage: 5, color: "bg-yellow-500" },
  { stage: "Purchases", count: 10, percentage: 1, color: "bg-red-500" },
]

const pipelineData = [
  { stage: "Prospecting", count: 5, percentage: 25, color: "bg-purple-500" },
  { stage: "Negotiation", count: 10, percentage: 50, color: "bg-blue-500" },
  { stage: "Near Closing", count: 5, percentage: 25, color: "bg-green-500" },
]

export function AnalyticsPanel() {
  return (
    <aside className="w-80 space-y-4">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Sales Overview
        </h3>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Funnel Analysis
        </h3>
        <div className="space-y-3">
          {funnelData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{item.stage}</span>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Pipeline Status
        </h3>
        <div className="space-y-1 mb-4">
          <p className="text-2xl font-bold text-gray-900">20 Deals</p>
          <p className="text-sm text-gray-600">Total in pipeline</p>
        </div>
        
        {/* Pie Chart Representation */}
        <div className="flex gap-2 mb-4">
          {pipelineData.map((item, index) => (
            <div
              key={index}
              className={`${item.color} h-3 rounded-full transition-all`}
              style={{ width: `${item.percentage}%` }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {pipelineData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`${item.color} h-3 w-3 rounded-full`} />
                <span className="text-sm text-gray-700">{item.stage}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{item.count} deals</p>
                <p className="text-xs text-gray-500">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm p-4 text-white">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-blue-100 mb-3">
          Get insights on improving your conversion rate
        </p>
        <button className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors">
          View Recommendations
        </button>
      </div>
    </aside>
  )
}