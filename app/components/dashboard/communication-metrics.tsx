"use client"

import { Mail, MessageCircle, Phone, TrendingUp, Users } from "lucide-react"

const communicationStats = [
  {
    channel: "Emails",
    icon: Mail,
    sent: 312,
    metric: "68% open rate",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    channel: "WhatsApp",
    icon: MessageCircle,
    sent: 24,
    metric: "active conversations",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    channel: "Calls",
    icon: Phone,
    sent: 48,
    metric: "today • Call summaries",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
]

export function CommunicationMetrics() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        Live Communication Stats
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {communicationStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${stat.borderColor} ${stat.bgColor}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg bg-white ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className={`font-semibold ${stat.color}`}>{stat.channel}</h4>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.sent}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.metric}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}