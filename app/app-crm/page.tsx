import { DashboardHeader } from "@/app/components/dashboard/dashboard-header"
import { FilterSidebar } from "@/app/components/dashboard/filter-sidebar"
import { LeadsTable } from "@/app/components/dashboard/leads-table"
import { AnalyticsPanel } from "@/app/components/dashboard/analytics-panel"
import { CommunicationBar } from "@/app/components/dashboard/communication-bar"
import { AlertSection } from "@/app/components/dashboard/alert-section"
import { CommunicationMetrics } from "@/app/components/dashboard/communication-metrics"
import { CalendarReminders } from "@/app/components/dashboard/calendar-reminders"

export default function AppCrmPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <FilterSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
              <LeadsTable />
              <CommunicationBar />
              <AlertSection />
              <CommunicationMetrics />
              <CalendarReminders />
              
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <p className="text-sm text-gray-600">
                  Standard Colour Codes for Lead Status
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Hot Lead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-gray-600">Warm Lead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Cold Lead</span>
                  </div>
                </div>
              </div>
            </div>
            
            <AnalyticsPanel />
          </div>
        </main>
      </div>
    </div>
  )
}