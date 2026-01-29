"use client"

import { useState } from "react"
import { Calendar, Clock, Bell, Volume2, Phone, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const alertTypes = [
  { label: "Beep", icon: Bell },
  { label: "Sound Alert", icon: Volume2 },
  { label: "Call Alert", icon: Phone },
]

const upcomingReminders = [
  {
    id: 1,
    title: "Follow up with Rohan Mehta",
    time: "4:30 PM",
    type: "call",
    priority: "high",
  },
  {
    id: 2,
    title: "Send proposal to Priya Sharma",
    time: "5:00 PM",
    type: "email",
    priority: "medium",
  },
  {
    id: 3,
    title: "Meeting with Amit Patel",
    time: "Tomorrow, 11:00 AM",
    type: "meeting",
    priority: "high",
  },
]

export function CalendarReminders() {
  const [aiReminders, setAiReminders] = useState(true)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(["Beep"])

  const toggleAlert = (label: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-orange-500 bg-orange-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Calendar + Reminders
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* AI Reminders Toggle */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">AI Reminders</p>
            <p className="text-xs text-gray-600">Smart notifications enabled</p>
          </div>
        </div>
        <Switch
          checked={aiReminders}
          onCheckedChange={setAiReminders}
        />
      </div>

      {/* Alert Type Selection */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Alert Types</p>
        <div className="flex gap-2">
          {alertTypes.map((alert, index) => {
            const Icon = alert.icon
            const isSelected = selectedAlerts.includes(alert.label)
            return (
              <button
                key={index}
                onClick={() => toggleAlert(alert.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {alert.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Upcoming</p>
        <div className="space-y-2">
          {upcomingReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                reminder.priority
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {reminder.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="text-xs text-gray-600">{reminder.time}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    reminder.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {reminder.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}