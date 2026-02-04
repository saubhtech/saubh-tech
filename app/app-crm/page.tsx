import { DashboardHeader } from "@/app/components/dashboard/dashboard-header"
import { FilterSidebar } from "@/app/components/dashboard/filter-sidebar"
import { LeadsTable } from "@/app/components/dashboard/leads-table"
import { AnalyticsPanel } from "@/app/components/dashboard/analytics-panel"
import { CommunicationHub } from "../components/dashboard/integrated-communication-hub"
import { AlertSection } from "@/app/components/dashboard/alert-section"

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
              <CommunicationHub />
              <AlertSection />
              <CalendarReminders />
              
              
            </div>
            
            <AnalyticsPanel />
          </div>
        </main>
      </div>
    </div>
  )
}