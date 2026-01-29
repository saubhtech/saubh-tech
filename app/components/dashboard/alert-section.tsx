"use client"

import { AlertCircle, Mail, MessageCircle, Phone, TrendingUp } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "engagement",
    icon: Mail,
    message: "Suresh just opened your email 5 times",
    time: "2 mins ago",
    priority: "high",
  },
  {
    id: 2,
    type: "communication",
    icon: MessageCircle,
    message: "3 WhatsApp messages awaiting response",
    time: "15 mins ago",
    priority: "medium",
  },
  {
    id: 3,
    type: "call",
    icon: Phone,
    message: "Missed call from Priya Sharma",
    time: "1 hour ago",
    priority: "medium",
  },
]

const communicationStats = [
  {
    channel: "Emails",
    sent: 312,
    metric: "68% open rate",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    channel: "WhatsApp",
    sent: 24,
    metric: "active conversations",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    channel: "Calls",
    sent: 48,
    metric: "today • Call summaries",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
]

export function AlertSection() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Live Alerts
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getPriorityColor(
                  alert.priority
                )}`}
              >
                <div className={`p-2 rounded-lg ${alert.priority === 'high' ? 'bg-red-100' : alert.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  <Icon className={`h-4 w-4 ${alert.priority === 'high' ? 'text-red-600' : alert.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <div className={`h-2 w-2 rounded-full ${getPriorityDot(alert.priority)} mt-2`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}