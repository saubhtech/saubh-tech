"use client"

import { useState } from "react"
import { Bell, Search, User, Menu, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navItems = ["Dashboard", "Sales", "Analytics", "Settings"]

export function DashboardHeader() {
  const [activeTab, setActiveTab] = useState("Dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <TrendingUp className="h-6 w-6" />
          <span>CRM</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 ml-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-64 h-9 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}