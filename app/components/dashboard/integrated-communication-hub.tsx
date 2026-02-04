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
  Bell,
  Sparkles,
  X,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  Mic,
  PhoneOff,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Settings,
  Search,
  ArrowLeft,
  Image as ImageIcon,
  File,
  Pause,
  Play,
  Volume2
} from "lucide-react"
import { Button } from "../ui/button"

const communicationChannels = [
  { icon: Phone, label: "Call", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", solidColor: "bg-blue-500", textColor: "text-blue-600" },
  { icon: MessageCircle, label: "WhatsApp", color: "from-green-500 to-green-600", bgColor: "bg-green-50", solidColor: "bg-green-500", textColor: "text-green-600" },
  { icon: Mail, label: "Email", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", solidColor: "bg-purple-500", textColor: "text-purple-600" },
  { icon: Send, label: "RCS", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50", solidColor: "bg-orange-500", textColor: "text-orange-600" },
  { icon: Bell, label: "Notification", color: "from-yellow-500 to-yellow-600", bgColor: "bg-yellow-50", solidColor: "bg-yellow-500", textColor: "text-yellow-600" },
  { icon: Video, label: "V-Meeting", color: "from-red-500 to-red-600", bgColor: "bg-red-50", solidColor: "bg-red-500", textColor: "text-red-600" },
  { icon: MapPin, label: "Visit", color: "from-indigo-500 to-indigo-600", bgColor: "bg-indigo-50", solidColor: "bg-indigo-500", textColor: "text-indigo-600" },
  { icon: Share2, label: "Messenger", color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50", solidColor: "bg-pink-500", textColor: "text-pink-600" },
]

export function CommunicationHub() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState("00:00")
  const [isMuted, setIsMuted] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  const renderInterface = () => {
    if (!selectedChannel) return null

    const channelConfig = communicationChannels.find(c => c.label === selectedChannel)

    switch (selectedChannel) {
      case "Call":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 animate-slide-in">
            {/* Call Header */}
            <div className="p-6 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChannel(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">John Doe</h3>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Call Interface */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {isCallActive ? (
                <>
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-2xl">
                      <Phone className="w-20 h-20" />
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <p className="text-2xl font-bold text-gray-900 mb-2">Call in Progress</p>
                    <p className="text-3xl text-blue-600 font-mono font-bold">{callDuration}</p>
                    <p className="text-sm text-gray-500 mt-2">🎙️ Whisper mode active • Recording</p>
                  </div>
                  
                  <div className="flex gap-6 mb-8">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isMuted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                    <button className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-lg text-gray-700">
                      <Volume2 className="w-7 h-7" />
                    </button>
                    <button className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-lg text-gray-700">
                      <Users className="w-7 h-7" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsCallActive(false)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all shadow-2xl hover:shadow-red-500/50 hover:scale-110"
                  >
                    <PhoneOff className="w-10 h-10 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-2xl">
                      <Phone className="w-20 h-20" />
                    </div>
                  </div>
                  
                  <p className="text-2xl font-bold text-gray-900 mb-8">Ready to Call</p>
                  
                  <button 
                    onClick={() => setIsCallActive(true)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-110 mb-8"
                  >
                    <Phone className="w-10 h-10 text-white" />
                  </button>
                  
                  <div className="max-w-md p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">AI Features Enabled</p>
                        <p className="text-sm text-gray-600">
                          • English/Hindi transcription<br/>
                          • Call recording & summary<br/>
                          • Sentiment analysis
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case "WhatsApp":
        return (
          <div className="h-full flex flex-col bg-[#0a1014] animate-slide-in">
            {/* WhatsApp Header */}
            <div className="p-4 bg-[#202c33] border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChannel(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold shadow-lg">
                      JD
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">John Doe</h3>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="260" height="260" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23374045" fill-opacity="0.05"%3E%3Cpath d="M24.37 16c.2.65.39 1.32.54 2H21.7l1.67-2zm-7.62-2c.64.49 1.21 1.05 1.69 1.66L17 18.5 14.5 16zm-6 6c.4.3.8.57 1.22.8L10 24.3l1.97-2.3c.26.15.52.29.8.42L12 24.5l1.57-1.83c.23.1.48.17.73.25L13.5 25l.77-2.08c.3.08.6.14.9.18l-.27 2.1.9-.18c.1 0 .2.04.28.1l-.07 2.1c.32 0 .64-.04.95-.1l-.27-2.1c.3-.04.6-.1.9-.18L18.5 25l-.77-2.08c.25-.08.5-.15.73-.25L20.03 24.5 19.27 22.4c.28-.13.54-.27.8-.42L22.04 24.3 20.4 21.77c.42-.23.82-.5 1.22-.8L23.3 23H26c-.15.68-.34 1.35-.54 2H22.7l1.67 2H20.62c-.2.65-.44 1.29-.71 1.9l1.98 1.67-2.75.27L19.37 33c-.38.54-.8 1.04-1.27 1.5L17 31.7l-1.1 2.8c-.47-.46-.88-.96-1.27-1.5l.23-2.16-2.75-.27 1.98-1.67c-.27-.61-.51-1.25-.71-1.9H9.62l1.67-2H8c-.2-.65-.39-1.32-.54-2h3.3l-1.67-2h3.75c-.21-.66-.37-1.34-.47-2.03L10.3 18.5l2.47-2.34c-.1-.69-.16-1.4-.16-2.12 0-.72.06-1.43.16-2.12L10.3 9.5l2.07-2.57c.1-.69.26-1.37.47-2.03H8.96l-1.67-2h3.3c.15-.68.34-1.35.54-2z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}>
              <div className="flex justify-start animate-slide-in-up">
                <div className="max-w-[75%] bg-[#202c33] rounded-lg p-3 shadow-lg">
                  <p className="text-white text-sm leading-relaxed">Hi! I'm interested in your product. Can you share more details about pricing and features?</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center justify-end gap-1">10:30 AM</p>
                </div>
              </div>
              
              <div className="flex justify-end animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                <div className="max-w-[75%] bg-[#005c4b] rounded-lg p-3 shadow-lg">
                  <p className="text-white text-sm leading-relaxed">Hello! Sure, I'd be happy to help. What specific information are you looking for?</p>
                  <p className="text-xs text-gray-300 mt-2 flex items-center justify-end gap-1">
                    10:32 AM 
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </p>
                </div>
              </div>

              <div className="flex justify-start animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                <div className="max-w-[75%] bg-[#202c33] rounded-lg p-3 shadow-lg">
                  <p className="text-white text-sm leading-relaxed">I need details about the enterprise plan and implementation timeline.</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center justify-end gap-1">10:33 AM</p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#202c33] border-t border-gray-700">
              <div className="flex items-center gap-2 bg-[#2a3942] rounded-xl px-4 py-3 shadow-lg">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message" 
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
                <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full p-2.5 transition-all shadow-lg hover:shadow-green-500/50">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">🔒 End-to-end encrypted • Template messages available</p>
            </div>
          </div>
        )

      case "Email":
        return (
          <div className="h-full flex flex-col bg-white animate-slide-in">
            {/* Email Header */}
            <div className="p-5 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedChannel(null)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <Mail className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Compose Email</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                  <label className="text-sm font-semibold text-gray-600 w-20">To:</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@example.com"
                    className="flex-1 outline-none text-sm text-gray-900"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                  <label className="text-sm font-semibold text-gray-600 w-20">Subject:</label>
                  <input 
                    type="text" 
                    placeholder="Enter subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-6 bg-gray-50">
              <textarea 
                placeholder="Compose your email... 

Pro tip: Use our AI-powered templates for better engagement!"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-full p-5 bg-white border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm leading-relaxed shadow-sm"
              />
            </div>

            {/* Email Footer */}
            <div className="p-4 border-t bg-white flex items-center justify-between shadow-lg">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attach Files
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Enhance
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Save Draft
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        )

      case "RCS":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50 animate-slide-in">
            <div className="p-6 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChannel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">RCS Messaging</h3>
                  <p className="text-sm text-gray-500">Rich Communication Services</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-200 max-w-md">
                    <p className="text-sm text-gray-800 mb-3">Check out our latest offers! 🎉</p>
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-4 mb-3">
                      <p className="font-bold text-orange-900">Limited Time Deal</p>
                      <p className="text-sm text-orange-700">Get 50% off on annual plans</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                        View Offers
                      </button>
                      <button className="flex-1 border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
                        Learn More
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">✓ Read • 11:20 AM</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-orange-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">RCS Features</p>
                      <p className="text-sm text-gray-600 mt-1">
                        • Read receipts & typing indicators<br/>
                        • Rich media support (images, videos, files)<br/>
                        • Interactive buttons & carousels<br/>
                        • Delivery tracking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-sm border border-orange-200">
                  <input 
                    type="text" 
                    placeholder="Type your RCS message..."
                    className="flex-1 outline-none text-sm"
                  />
                  <button className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case "V-Meeting":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-red-50 to-orange-50 animate-slide-in">
            <div className="p-6 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChannel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Schedule Virtual Meeting</h3>
                  <p className="text-sm text-gray-500">Video conference with auto calendar invite</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border border-red-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Product Demo with John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-red-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date" 
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-red-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="time" 
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-lg border border-red-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Participants</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="john.doe@example.com, jane@example.com"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-lg border border-red-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Agenda</label>
                  <textarea 
                    placeholder="Add meeting agenda, topics to discuss, or any notes..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Auto Features Enabled</p>
                      <p className="text-sm text-red-700 mt-1">
                        ✓ Calendar invite sent automatically<br/>
                        ✓ Meeting room link generated<br/>
                        ✓ Email reminders before meeting
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-6 text-base font-semibold shadow-lg hover:shadow-red-500/50">
                    <Video className="w-5 h-5 mr-2" />
                    Create Meeting
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case "Visit":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 animate-slide-in">
            <div className="p-6 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChannel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Schedule In-Person Visit</h3>
                  <p className="text-sm text-gray-500">Plan a face-to-face meeting</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="John Doe"
                  />
                </div>

                <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Enter full address"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose of Visit</label>
                  <textarea 
                    placeholder="Meeting purpose, what to discuss, materials needed..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-indigo-900">Smart Location Features</p>
                      <p className="text-sm text-indigo-700 mt-1">
                        ✓ GPS directions shared via SMS & Email<br/>
                        ✓ Travel time calculation<br/>
                        ✓ Calendar event created automatically
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-6 text-base font-semibold shadow-lg hover:shadow-indigo-500/50">
                  <MapPin className="w-5 h-5 mr-2" />
                  Schedule Visit
                </Button>
              </div>
            </div>
          </div>
        )

      case "Messenger":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 animate-slide-in">
            <div className="p-5 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChannel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">John Doe</h3>
                    <p className="text-xs text-pink-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      Active on Messenger
                    </p>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl px-4 py-2 max-w-xs">
                  <p className="text-sm text-gray-800">Hey! Saw your message on our website. Interested in the product!</p>
                  <p className="text-xs text-gray-500 mt-1">2:15 PM</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl px-4 py-2 max-w-xs">
                  <p className="text-sm text-white">Great to hear! I'll send you all the details right away. 🎉</p>
                  <p className="text-xs text-pink-100 mt-1 flex items-center justify-end gap-1">
                    2:16 PM <CheckCircle2 className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
                <Smile className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full shadow-lg hover:shadow-pink-500/50 transition-all">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )

      case "Notification":
        return (
          <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-amber-50 animate-slide-in">
            <div className="p-6 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChannel(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Push Notification</h3>
                  <p className="text-sm text-gray-500">Send instant notifications to leads</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="bg-white rounded-xl p-5 shadow-lg border border-yellow-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Special Offer Just for You!"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div className="bg-white rounded-xl p-5 shadow-lg border border-yellow-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea 
                    placeholder="Notification message content..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <p className="font-semibold text-yellow-900 mb-3">Preview</p>
                  <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-yellow-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Your App Name</p>
                        <p className="text-sm text-gray-600 mt-1">Notification will appear here</p>
                      </div>
                      <span className="text-xs text-gray-400">Now</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-6 text-base font-semibold shadow-lg">
                  <Bell className="w-5 h-5 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const Icon = channelConfig?.icon || Phone
                  return <Icon className="w-10 h-10 text-gray-400" />
                })()}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedChannel}</h3>
              <p className="text-sm text-gray-500">Interface coming soon</p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out;
        }
      `}</style>

      <div className="flex flex-col gap-5 h-[700px]">
        {/* Horizontal Channel Bar - Now on Top */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Channel Header */}
          <div className="p-4 border-b bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Communication Channels</h2>
                  <p className="text-xs text-gray-500">Select to engage with leads</p>
                </div>
              </div>
              {/* Quick Stats - Inline */}
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-900">156</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1.5">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-900">89</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-1.5">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold text-purple-900">234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Channel List */}
          <div className="p-4 overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {communicationChannels.map((channel) => {
                const Icon = channel.icon
                const isSelected = selectedChannel === channel.label
                
                return (
                  <button
                    key={channel.label}
                    onClick={() => setSelectedChannel(channel.label)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                      isSelected
                        ? `bg-gradient-to-r ${channel.color} text-white shadow-lg scale-[1.02]`
                        : `bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-[1.01]`
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : channel.bgColor
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : channel.textColor}`} />
                    </div>
                    <span className="text-sm font-semibold">{channel.label}</span>
                    {isSelected && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Interface Area - Now Takes Remaining Space */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {selectedChannel ? (
            renderInterface()
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50">
              <div className="text-center px-8 max-w-md">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-purple-200 rounded-2xl blur-2xl opacity-50"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                    <Sparkles className="w-14 h-14 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Select a Channel</h3>
                <p className="text-gray-600 mb-6">
                  Choose a communication channel from above to start engaging with your leads
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {['Call', 'WhatsApp', 'Email', 'Meeting'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}