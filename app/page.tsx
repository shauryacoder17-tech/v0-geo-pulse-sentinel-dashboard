'use client'

import { useState, lazy, Suspense } from 'react'
import DashboardHeader from '@/components/dashboard/header'
import LeftSidebar from '@/components/dashboard/left-sidebar'
import CountryPanel from '@/components/dashboard/country-panel'
import EventTimeline from '@/components/dashboard/event-timeline'
import { type Country, type FilterState } from '@/lib/dashboard-data'

const WorldMap = lazy(() => import('@/components/dashboard/world-map'))

function MapFallback() {
  return (
    <div className="flex-1 relative bg-sentinel-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-sentinel-cyan/30 border-t-sentinel-cyan rounded-full animate-spin" />
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest">
          INITIALIZING MAP SYSTEM...
        </span>
      </div>
    </div>
  )
}

export default function GeoPulseSentinel() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    earthquakes: true,
    wildfires: true,
    storms: true,
    conflicts: true,
    markets: true,
    flights: true,
    satellites: true,
  })

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar filters={filters} onFiltersChange={setFilters} />

        {/* Center: Map + Bottom Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map Area */}
          <Suspense fallback={<MapFallback />}>
            <WorldMap
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              filters={filters}
            />
          </Suspense>

          {/* Bottom Timeline */}
          <EventTimeline />
        </div>

        {/* Right: Country Intelligence Panel */}
        <CountryPanel
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      </div>
    </div>
  )
}
