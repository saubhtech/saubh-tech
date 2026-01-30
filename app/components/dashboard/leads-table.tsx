"use client"

import { useState } from "react"
import { Search, Plus, MoreVertical, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"  // ✅ Changed
import { Input } from "../ui/input"    // ✅ Changed
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from  "../ui/dropdown-menu"

const leadsData = [
  {
    id: 1,
    name: "Rohan Mehta",
    company: "AB Enterprises",
    deal: "Website Redesign",
    amount: "₹16,500",
    source: "Email",
    stage: "Proposal",
    funnel: "Negotiation",
    followUp: "29.01.2025",
    time: "10:30 AM",
    delay: "2 Hours",
    timeline: 8,
    status: "hot",
  },
  {
    id: 2,
    name: "Priya Sharma",
    company: "Tech Solutions",
    deal: "Mobile App Dev",
    amount: "₹45,000",
    source: "Website",
    stage: "Quotation",
    funnel: "Prospect",
    followUp: "30.01.2025",
    time: "2:00 PM",
    delay: "1 Day",
    timeline: 5,
    status: "warm",
  },
  {
    id: 3,
    name: "Amit Patel",
    company: "Digital Hub",
    deal: "SEO Services",
    amount: "₹8,500",
    source: "Referral",
    stage: "Discussion",
    funnel: "Prospect",
    followUp: "31.01.2025",
    time: "11:00 AM",
    delay: "3 Days",
    timeline: 3,
    status: "cold",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    company: "Smart Retail",
    deal: "E-commerce Platform",
    amount: "₹65,000",
    source: "LinkedIn",
    stage: "Contract",
    funnel: "Negotiation",
    followUp: "29.01.2025",
    time: "4:30 PM",
    delay: "Today",
    timeline: 12,
    status: "hot",
  },
  {
    id: 5,
    name: "Rahul Verma",
    company: "Cloud Systems",
    deal: "Cloud Migration",
    amount: "₹95,000",
    source: "Email",
    stage: "Proposal",
    funnel: "Negotiation",
    followUp: "01.02.2025",
    time: "9:00 AM",
    delay: "4 Days",
    timeline: 15,
    status: "hot",
  },
]

export function LeadsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-700 border-red-200"
      case "warm":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "cold":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Proposal":
        return "bg-purple-50 text-purple-700"
      case "Quotation":
        return "bg-blue-50 text-blue-700"
      case "Discussion":
        return "bg-yellow-50 text-yellow-700"
      case "Contract":
        return "bg-green-50 text-green-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-600">
                New Leads: <span className="font-semibold text-green-600">45</span>
              </span>
              <span className="text-xs text-green-600">↑ 15%</span>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px]">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Deal</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Stage</TableHead>
              <TableHead className="font-semibold">Funnel</TableHead>
              <TableHead className="font-semibold">Follow Up</TableHead>
              <TableHead className="font-semibold">Delay</TableHead>
              <TableHead className="font-semibold">Timeline</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsData.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-gray-50">
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.company}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">{lead.deal}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">{lead.amount}</span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                    {lead.source}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">{lead.funnel}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-gray-900">{lead.followUp}</div>
                    <div className="text-gray-500">{lead.time}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-600 font-medium">{lead.delay}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    ({lead.timeline})
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Add Remark</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1-10</span> of <span className="font-medium">45</span> results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}