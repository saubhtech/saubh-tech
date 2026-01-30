"use client"

import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "../ui/button" 

const filterCategories = [
  {
    title: "Country",
    options: ["India", "USA", "UK", "Australia"],
  },
  {
    title: "State",
    options: ["Maharashtra", "Delhi", "Karnataka", "Gujarat"],
  },
  {
    title: "District",
    options: ["Mumbai", "Pune", "Bangalore", "Ahmedabad"],
  },
  {
    title: "Pin-code",
    options: ["400001", "411001", "560001", "380001"],
  },
  {
    title: "Place",
    options: ["Andheri", "Koregaon Park", "Indiranagar", "Satellite"],
  },
]

const filterTypes = ["List", "Task", "Funnel", "Status", "Score"]

export function FilterSidebar() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  return (
    <aside className="w-64 border-r bg-white h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>

        {/* Location Filters */}
        <div className="space-y-2 mb-6">
          {filterCategories.map((category) => (
            <div key={category.title} className="border rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === category.title ? null : category.title
                  )
                }
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {category.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSection === category.title ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === category.title && (
                <div className="p-3 space-y-2 bg-white">
                  {category.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Filter Types */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter By</h3>
          {filterTypes.map((type) => (
            <Button
              key={type}
              variant="outline"
              className="w-full justify-start text-sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}