"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Bell, Volume2, Phone, Settings, Sparkles, Plus, CheckCircle, X, AlertCircle, User, Users, Video, Mail, MapPin, ChevronLeft, ChevronRight, MessageCircle, Send, Smartphone, Monitor, Globe } from "lucide-react"
import { Switch } from "../ui/switch"

const alertTypes = [
  { label: "Beep", icon: Bell, gradient: "from-blue-500 to-cyan-500" },
  { label: "Sound Alert", icon: Volume2, gradient: "from-purple-500 to-pink-500" },
  { label: "Call Alert", icon: Phone, gradient: "from-orange-500 to-red-500" },
]

const communicationChannels = [
  { id: "email", label: "Email", icon: Mail, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-500" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-500" },
  { id: "sms", label: "SMS", icon: MessageCircle, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-500" },
  { id: "rcs", label: "RCS", icon: Send, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-500" },
  { id: "call", label: "Call Alert", icon: Phone, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-500" },
]

const pushNotificationPlatforms = [
  { id: "android", label: "Android", icon: Smartphone, color: "text-green-600", bgColor: "bg-green-50" },
  { id: "ios", label: "iOS", icon: Smartphone, color: "text-gray-700", bgColor: "bg-gray-100" },
  { id: "browser", label: "Browser", icon: Globe, color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "windows", label: "Windows", icon: Monitor, color: "text-cyan-600", bgColor: "bg-cyan-50" },
]

const reminderTimings = [
  { value: "0", label: "At time of event" },
  { value: "5", label: "5 minutes before" },
  { value: "10", label: "10 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
]

const meetingTypes = [
  { label: "1-on-1", icon: User, color: "bg-blue-500" },
  { label: "Team Meeting", icon: Users, color: "bg-purple-500" },
  { label: "Video Call", icon: Video, color: "bg-green-500" },
  { label: "Email Followup", icon: Mail, color: "bg-orange-500" },
  { label: "On-site", icon: MapPin, color: "bg-red-500" },
]

// Mock data for booked slots
const initialBookedSlots = [
  { id: 1, date: "2024-01-15", startTime: "09:00", endTime: "10:00", title: "Team Standup", type: "team" },
  { id: 2, date: "2024-01-15", startTime: "14:00", endTime: "15:00", title: "Client Call", type: "client" },
  { id: 3, date: "2024-01-16", startTime: "11:00", endTime: "12:00", title: "Planning", type: "planning" },
]

const initialReminders = [
  {
    id: 1,
    title: "Follow up with Rohan Mehta",
    time: "4:30 PM",
    date: "2024-01-15",
    type: "call",
    priority: "high",
    duration: "30 min",
    channels: ["email", "whatsapp"],
    pushPlatforms: ["android", "browser"],
    reminderBefore: "15"
  },
  {
    id: 2,
    title: "Send proposal to Priya Sharma",
    time: "5:00 PM",
    date: "2024-01-15",
    type: "email",
    priority: "medium",
    duration: "15 min",
    channels: ["email"],
    pushPlatforms: ["browser"],
    reminderBefore: "30"
  },
  {
    id: 3,
    title: "Meeting with Amit Patel",
    time: "11:00 AM",
    date: "2024-01-16",
    type: "meeting",
    priority: "high",
    duration: "1 hour",
    channels: ["email", "whatsapp", "sms"],
    pushPlatforms: ["android", "ios"],
    reminderBefore: "60"
  },
]

type CalendarView = 'month' | 'week' | 'day'
type TimeSlot = {
  id: number;
  time: string;
  booked: boolean;
  type?: string;
  title?: string;
}

type BookedSlot = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  type: string;
  attendees?: string[];
  description?: string;
}

type Reminder = {
  id: number;
  title: string;
  time: string;
  date: string;
  type: string;
  priority: string;
  duration: string;
  completed?: boolean;
  channels: string[];
  pushPlatforms: string[];
  reminderBefore: string;
}

export function CalendarReminders() {
  const [aiReminders, setAiReminders] = useState(true)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(["Beep"])
  const [view, setView] = useState<CalendarView>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(initialBookedSlots)
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [newBooking, setNewBooking] = useState({
    title: "",
    date: selectedDate,
    startTime: "09:00",
    endTime: "10:00",
    type: "1-on-1",
    description: ""
  })
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "09:00",
    date: selectedDate,
    type: "call",
    priority: "medium",
    duration: "30 min",
    channels: [] as string[],
    pushPlatforms: [] as string[],
    reminderBefore: "15"
  })
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  // Generate time slots for selected date
  useEffect(() => {
    const slots: TimeSlot[] = []
    for (let hour = 8; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const bookedSlot = bookedSlots.find(slot => 
        slot.date === selectedDate && 
        slot.startTime <= time && 
        slot.endTime > time
      )
      slots.push({
        id: hour,
        time,
        booked: !!bookedSlot,
        type: bookedSlot?.type,
        title: bookedSlot?.title
      })
    }
    setTimeSlots(slots)
  }, [selectedDate, bookedSlots])

  const toggleAlert = (label: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const toggleChannel = (channelId: string) => {
    setNewReminder((prev) => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter((id) => id !== channelId)
        : [...prev.channels, channelId]
    }))
  }

  const togglePushPlatform = (platformId: string) => {
    setNewReminder((prev) => ({
      ...prev,
      pushPlatforms: prev.pushPlatforms.includes(platformId)
        ? prev.pushPlatforms.filter((id) => id !== platformId)
        : [...prev.pushPlatforms, platformId]
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50"
      case "medium":
        return "border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50"
      default:
        return "border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30"
      case "medium":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
    }
  }

  const getDateRange = () => {
    const start = new Date(currentDate)
    if (view === 'week') {
      start.setDate(start.getDate() - start.getDay())
    }
    
    const days = []
    const dayCount = view === 'week' ? 7 : view === 'day' ? 1 : 30
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const handleBooking = () => {
    const isConflict = bookedSlots.some(slot => 
      slot.date === newBooking.date &&
      (
        (newBooking.startTime >= slot.startTime && newBooking.startTime < slot.endTime) ||
        (newBooking.endTime > slot.startTime && newBooking.endTime <= slot.endTime) ||
        (newBooking.startTime <= slot.startTime && newBooking.endTime >= slot.endTime)
      )
    )

    if (isConflict) {
      alert("Time slot is already booked! Please choose another time.")
      return
    }

    const newSlot: BookedSlot = {
      id: bookedSlots.length + 1,
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      title: newBooking.title,
      type: newBooking.type,
      description: newBooking.description
    }

    setBookedSlots([...bookedSlots, newSlot])
    setShowBookingModal(false)
    setNewBooking({
      title: "",
      date: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      type: "1-on-1",
      description: ""
    })
  }

  const handleAddReminder = () => {
    if (!newReminder.title) {
      alert("Please enter a reminder title")
      return
    }

    const newReminderItem: Reminder = {
      id: reminders.length + 1,
      ...newReminder
    }

    setReminders([...reminders, newReminderItem])
    setShowReminderModal(false)
    setNewReminder({
      title: "",
      time: "09:00",
      date: selectedDate,
      type: "call",
      priority: "medium",
      duration: "30 min",
      channels: [],
      pushPlatforms: [],
      reminderBefore: "15"
    })
  }

  const toggleReminderComplete = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ))
  }

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id))
  }

  const deleteBooking = (id: number) => {
    setBookedSlots(bookedSlots.filter(slot => slot.id !== id))
  }

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookedSlots.filter(slot => slot.date === dateStr)
  }

  return (
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .reminder-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .reminder-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .reminder-card:hover::before {
          left: 100%;
        }

        .reminder-card:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Calendar Component */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 animate-slide-in-up relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Calendar
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">Real-time slot booking</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    view === 'month' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    view === 'week' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    view === 'day' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (view === 'week') newDate.setDate(newDate.getDate() - 7)
                  else if (view === 'day') newDate.setDate(newDate.getDate() - 1)
                  else newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentDate(newDate)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <h4 className="text-lg font-bold text-gray-800">
                {view === 'month' 
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : view === 'week'
                  ? `Week of ${formatDate(getDateRange()[0])}`
                  : formatDate(currentDate)}
              </h4>
              
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (view === 'week') newDate.setDate(newDate.getDate() + 7)
                  else if (view === 'day') newDate.setDate(newDate.getDate() + 1)
                  else newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentDate(newDate)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              {view === 'week' && (
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
              )}
              
              <div className={`grid ${view === 'week' ? 'grid-cols-7' : 'grid-cols-1'} gap-2`}>
                {getDateRange().map((date, index) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const slots = getSlotsForDate(date)
                  const isSelected = dateStr === selectedDate
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } ${isToday(date) ? 'ring-2 ring-blue-300' : ''}`}
                    >
                      <div className="text-center">
                        <div className={`text-sm font-semibold ${
                          isSelected ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        {slots.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {slots.slice(0, 2).map(slot => (
                              <div
                                key={slot.id}
                                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 truncate"
                                title={slot.title}
                              >
                                {slot.title}
                              </div>
                            ))}
                            {slots.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{slots.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots for Selected Date */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800">
                  Time Slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-3 w-3" />
                  Book Slot
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {timeSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      slot.booked
                        ? 'bg-red-50 border-red-200'
                        : 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!slot.booked) {
                        setNewBooking(prev => ({
                          ...prev,
                          date: selectedDate,
                          startTime: slot.time,
                          endTime: `${(parseInt(slot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`
                        }))
                        setShowBookingModal(true)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`h-4 w-4 ${slot.booked ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={`font-medium ${slot.booked ? 'text-red-700' : 'text-green-700'}`}>
                        {slot.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {slot.booked ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600 font-medium">
                            Booked: {slot.title}
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            Available
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Bookings */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Today's Bookings</h4>
              <div className="space-y-3">
                {bookedSlots
                  .filter(slot => slot.date === selectedDate)
                  .map(slot => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 mb-1">{slot.title}</h5>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{slot.startTime} - {slot.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-gray-400" />
                              <span>{slot.type}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteBooking(slot.id)}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Component */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 animate-slide-in-up relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative">
            {/* Reminders Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 rounded-xl blur-lg opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-pink-600 to-orange-600 p-2.5 rounded-xl shadow-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Smart Reminders
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">AI-powered notifications</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>

            {/* AI Reminders Toggle */}
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 opacity-10 animate-shimmer" />
              <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 via-orange-50 to-red-50 border-2 border-pink-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 rounded-lg blur-md opacity-50" />
                    <div className="relative p-2.5 bg-white rounded-lg shadow-md">
                      <Sparkles className="h-5 w-5 text-pink-600 animate-bounce-gentle" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">AI Reminders</p>
                    <p className="text-xs text-gray-600">Smart notifications enabled</p>
                  </div>
                </div>
                <Switch
                  checked={aiReminders}
                  onCheckedChange={setAiReminders}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-600 data-[state=checked]:to-orange-600"
                />
              </div>
            </div>

            {/* Alert Type Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700">Alert Types</p>
                <span className="text-xs text-gray-500">{selectedAlerts.length} selected</span>
              </div>
              <div className="flex gap-2">
                {alertTypes.map((alert, index) => {
                  const Icon = alert.icon
                  const isSelected = selectedAlerts.includes(alert.label)
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleAlert(alert.label)}
                      className={`flex-1 relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 overflow-hidden group ${
                        isSelected
                          ? "bg-gradient-to-r text-white border-transparent shadow-xl scale-105"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-105"
                      }`}
                      style={{
                        backgroundImage: isSelected ? alert.gradient : undefined,
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      )}
                      <Icon className={`h-4 w-4 relative z-10 ${isSelected ? '' : 'text-gray-600'}`} />
                      <span className="relative z-10">{alert.label}</span>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 absolute top-1 right-1 animate-scale-in" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-700">Upcoming Reminders</p>
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-orange-600 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-3 w-3" />
                  Add Reminder
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {reminders
                  .filter(r => !r.completed)
                  .map((reminder, index) => (
                    <div
                      key={reminder.id}
                      className={`reminder-card p-4 rounded-xl border-l-4 ${getPriorityColor(
                        reminder.priority
                      )} shadow-md ${reminder.completed ? 'opacity-60' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              checked={reminder.completed}
                              onChange={() => toggleReminderComplete(reminder.id)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <p className={`font-semibold ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {reminder.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 ml-6">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{reminder.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-gray-400" />
                              <span>{reminder.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              <span>{reminderTimings.find(t => t.value === reminder.reminderBefore)?.label}</span>
                            </div>
                          </div>
                          
                          {/* Notification Channels */}
                          {reminder.channels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 ml-6">
                              {reminder.channels.map(channelId => {
                                const channel = communicationChannels.find(c => c.id === channelId)
                                if (!channel) return null
                                const Icon = channel.icon
                                return (
                                  <div
                                    key={channelId}
                                    className={`flex items-center gap-1 px-2 py-0.5 ${channel.bgColor} ${channel.color} rounded-full text-xs font-medium`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    <span>{channel.label}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          
                          {/* Push Platforms */}
                          {reminder.pushPlatforms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 ml-6">
                              {reminder.pushPlatforms.map(platformId => {
                                const platform = pushNotificationPlatforms.find(p => p.id === platformId)
                                if (!platform) return null
                                const Icon = platform.icon
                                return (
                                  <div
                                    key={platformId}
                                    className={`flex items-center gap-1 px-2 py-0.5 ${platform.bgColor} ${platform.color} rounded-full text-xs font-medium`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    <span>{platform.label}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityBadge(
                              reminder.priority
                            )} uppercase tracking-wide animate-scale-in`}
                          >
                            {reminder.priority}
                          </span>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="p-1 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mt-3 ml-6 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full bg-gradient-to-r ${
                              reminder.priority === 'high' ? 'from-red-500 to-pink-500' :
                              reminder.priority === 'medium' ? 'from-orange-500 to-amber-500' :
                              'from-blue-500 to-cyan-500'
                            } rounded-full transition-all duration-1000`}
                            style={{ width: reminder.priority === 'high' ? '75%' : '45%' }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          {reminder.priority === 'high' ? '2h left' : '5h left'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 font-medium">Today</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {reminders.filter(r => !r.completed && r.date === new Date().toISOString().split('T')[0]).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Pending</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {reminders.filter(r => !r.completed).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Completed</div>
                  <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    {reminders.filter(r => r.completed).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book New Slot</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({...newBooking, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Meeting title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {meetingTypes.map(type => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.label}
                        onClick={() => setNewBooking({...newBooking, type: type.label})}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          newBooking.type === type.label
                            ? `border-blue-500 ${type.color.replace('bg-', 'bg-')} text-white`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({...newBooking, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Meeting details..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Reminder</h3>
              <button
                onClick={() => setShowReminderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Reminder title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder({...newReminder, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={newReminder.duration}
                    onChange={(e) => setNewReminder({...newReminder, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remind me before
                </label>
                <select
                  value={newReminder.reminderBefore}
                  onChange={(e) => setNewReminder({...newReminder, reminderBefore: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {reminderTimings.map(timing => (
                    <option key={timing.value} value={timing.value}>
                      {timing.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Channels
                  <span className="ml-2 text-xs text-gray-500">({newReminder.channels.length} selected)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {communicationChannels.map(channel => {
                    const Icon = channel.icon
                    const isSelected = newReminder.channels.includes(channel.id)
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => toggleChannel(channel.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `${channel.borderColor} ${channel.bgColor} shadow-md scale-105`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : channel.bgColor}`}>
                          <Icon className={`h-4 w-4 ${channel.color}`} />
                        </div>
                        <span className={`text-sm font-semibold ${isSelected ? channel.color : 'text-gray-700'}`}>
                          {channel.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className={`h-4 w-4 ml-auto ${channel.color}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Push Notification Platforms
                  <span className="ml-2 text-xs text-gray-500">({newReminder.pushPlatforms.length} selected)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {pushNotificationPlatforms.map(platform => {
                    const Icon = platform.icon
                    const isSelected = newReminder.pushPlatforms.includes(platform.id)
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePushPlatform(platform.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `border-blue-500 ${platform.bgColor} shadow-md scale-105`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : platform.bgColor}`}>
                          <Icon className={`h-4 w-4 ${platform.color}`} />
                        </div>
                        <span className={`text-sm font-semibold ${isSelected ? platform.color : 'text-gray-700'}`}>
                          {platform.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className={`h-4 w-4 ml-auto ${platform.color}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['call', 'email', 'meeting', 'task', 'followup'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewReminder({...newReminder, type})}
                      className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                        newReminder.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowReminderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}