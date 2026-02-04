"use client"

import { AlertCircle, Mail, MessageCircle, Phone, TrendingUp, Bell, X, Eye, ChevronRight } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "engagement",
    icon: Mail,
    message: "Suresh just opened your email 5 times",
    time: "2 mins ago",
    priority: "high",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: 2,
    type: "communication",
    icon: MessageCircle,
    message: "3 WhatsApp messages awaiting response",
    time: "15 mins ago",
    priority: "medium",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    id: 3,
    type: "call",
    icon: Phone,
    message: "Missed call from Priya Sharma",
    time: "1 hour ago",
    priority: "medium",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
]

export function AlertSection() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-gradient-to-r from-red-50 to-pink-50"
      case "medium":
        return "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50"
      default:
        return "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50"
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50"
      case "medium":
        return "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/50"
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50"
    }
  }

  const getIconBg = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-br from-red-500 to-pink-500"
      case "medium":
        return "bg-gradient-to-br from-orange-500 to-amber-500"
      default:
        return "bg-gradient-to-br from-blue-500 to-cyan-500"
    }
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

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
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

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
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

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }

        .alert-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .alert-card::before {
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
          transition: left 0.6s;
        }

        .alert-card:hover::before {
          left: 100%;
        }

        .alert-card:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="space-y-4">
        {/* Alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 animate-slide-in-up relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur-lg opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-orange-600 to-red-600 p-2.5 rounded-xl shadow-lg">
                    <AlertCircle className="h-5 w-5 text-white animate-bounce-gentle" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    Live Alerts
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="relative">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse-ring" />
                      <div className="h-2 w-2 bg-red-500 rounded-full absolute top-0 left-0" />
                    </div>
                    <p className="text-sm text-gray-500">Real-time updates</p>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 group">
                View All
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon
                return (
                  <div
                    key={alert.id}
                    className="alert-card group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 ${getPriorityColor(
                        alert.priority
                      )} shadow-lg`}
                    >
                      {/* Icon container */}
                      <div className="relative flex-shrink-0">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${alert.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                        
                        {/* Icon */}
                        <div className={`relative p-3 ${getIconBg(alert.priority)} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        
                        {/* Pulse ring */}
                        {alert.priority === 'high' && (
                          <div className="absolute -inset-1">
                            <div className={`${getPriorityDot(alert.priority)} w-full h-full rounded-xl animate-pulse-ring opacity-75`} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Eye className="h-3 w-3" />
                            <span>{alert.time}</span>
                          </div>
                          {alert.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow animate-scale-in">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Priority indicator */}
                      <div className="flex flex-col items-end gap-2">
                        <div className={`h-3 w-3 rounded-full ${getPriorityDot(alert.priority)} animate-pulse`} />
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 hover:bg-white/50 rounded-lg">
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 animate-shimmer rounded-xl pointer-events-none" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary Bar */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-600 font-medium">Total alerts today</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      {alerts.filter(a => a.priority === 'high').length}
                    </span>
                    <p className="text-xs text-gray-500 font-medium">High</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300" />
                  <div className="text-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      {alerts.filter(a => a.priority === 'medium').length}
                    </span>
                    <p className="text-xs text-gray-500 font-medium">Medium</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300" />
                  <div className="text-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {alerts.length}
                    </span>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {/* <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative">Mark All as Read</span>
              </button>
              <button className="px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                Settings
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}