"use client"

import { useState } from "react"
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  Video, 
  MapPin, 
  Send, 
  Share2,
  Bell
} from "lucide-react"
import { Button } from "../ui/button"  // ✅ Changed from @/app/components/ui/button

const communicationChannels = [
  { icon: Phone, label: "Call", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { icon: MessageCircle, label: "WhatsApp", color: "bg-green-50 text-green-600 hover:bg-green-100" },
  { icon: Mail, label: "Email", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { icon: Send, label: "RCS", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
  { icon: Bell, label: "Notification", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
  { icon: Video, label: "V-Meeting", color: "bg-red-50 text-red-600 hover:bg-red-100" },
  { icon: MapPin, label: "Visit", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
  { icon: Share2, label: "Messenger", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
  { icon: Share2, label: "Social", color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100" },
  { icon: Bell, label: "Reminder", color: "bg-teal-50 text-teal-600 hover:bg-teal-100" },
]

export function CommunicationBar() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Communication Channels</h3>
        <span className="text-xs text-gray-500">
          Select a channel to communicate with leads
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {communicationChannels.map((channel, index) => {
          const Icon = channel.icon
          return (
            <button
              key={index}
              onClick={() => setSelectedChannel(channel.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                selectedChannel === channel.label
                  ? `${channel.color} border-current shadow-sm scale-105`
                  : `${channel.color} border-transparent hover:shadow-sm`
              }`}
            >
              <Icon className="h-4 w-4" />
              {channel.label}
            </button>
          )
        })}
      </div>

      {selectedChannel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{selectedChannel}</span> channel selected.
            {selectedChannel === "Call" && " Whisper mode: English/Hindi transcription available."}
            {selectedChannel === "WhatsApp" && " Chat window will appear for messaging."}
            {selectedChannel === "Email" && " Email interface will open for composition."}
          </p>
        </div>
      )}
    </div>
  )
}