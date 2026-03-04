'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap, Tooltip } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { countries, globalEvents, riskLevelConfig, eventTypeConfig, type Country, type FilterState } from '@/lib/dashboard-data'
import 'leaflet/dist/leaflet.css'

function RadarOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[500] overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 map-grid-overlay" />
      {/* Scan Line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-sentinel-cyan/30 to-transparent animate-scan-line" />
      {/* Corner Markers */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sentinel-cyan/40" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sentinel-cyan/40" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sentinel-cyan/40" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sentinel-cyan/40" />
      {/* Coordinate Labels */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-sentinel-cyan/40 tracking-widest">
        LAT 0.0000 / LNG 0.0000
      </div>
      <div className="absolute bottom-3 right-14 text-[9px] font-mono text-sentinel-cyan/40 tracking-widest">
        ZOOM: 2.5x
      </div>
    </div>
  )
}

function MapEventHandler({ onCountryClick }: { onCountryClick: (c: Country) => void }) {
  const map = useMap()

  useEffect(() => {
    map.on('click', () => {
      // clicking empty space deselects
    })
  }, [map])

  return null
}

function PulsingMarker({
  country,
  isSelected,
  onClick,
}: {
  country: Country
  isSelected: boolean
  onClick: () => void
}) {
  const config = riskLevelConfig[country.riskLevel]

  return (
    <>
      {/* Outer pulse ring */}
      {(country.riskLevel === 'critical' || country.riskLevel === 'high') && (
        <CircleMarker
          center={[country.lat, country.lng]}
          radius={isSelected ? 18 : 14}
          pathOptions={{
            color: config.color,
            fillColor: config.color,
            fillOpacity: 0,
            weight: 1,
            opacity: 0.3,
            className: 'animate-pulse-ring',
          }}
        />
      )}
      {/* Main marker */}
      <CircleMarker
        center={[country.lat, country.lng]}
        radius={isSelected ? 8 : 6}
        pathOptions={{
          color: config.color,
          fillColor: config.color,
          fillOpacity: isSelected ? 0.9 : 0.6,
          weight: isSelected ? 2 : 1,
        }}
        eventHandlers={{ click: onClick }}
      >
        <Tooltip
          direction="top"
          offset={[0, -10]}
          className="!bg-sentinel-surface !border-border !text-foreground !rounded-sm !px-2 !py-1 !shadow-lg"
        >
          <div className="flex items-center gap-2 font-sans">
            <span className="text-base">{country.flag}</span>
            <div>
              <div className="text-xs font-semibold text-foreground">{country.name}</div>
              <div className="text-[10px] font-mono" style={{ color: config.color }}>
                RISK: {config.label} ({country.riskScore})
              </div>
            </div>
          </div>
        </Tooltip>
      </CircleMarker>
    </>
  )
}

function EventMarker({ event }: { event: typeof globalEvents[number] }) {
  const config = eventTypeConfig[event.type]

  return (
    <CircleMarker
      center={[event.lat, event.lng]}
      radius={4}
      pathOptions={{
        color: config.color,
        fillColor: config.color,
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '3,3',
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -8]}
        className="!bg-sentinel-surface !border-border !text-foreground !rounded-sm !px-2 !py-1 !shadow-lg"
      >
        <div className="font-sans">
          <div className="text-[10px] font-mono tracking-wider" style={{ color: config.color }}>
            {config.label}
          </div>
          <div className="text-xs font-semibold text-foreground">{event.title}</div>
        </div>
      </Tooltip>
    </CircleMarker>
  )
}

export default function WorldMap({
  selectedCountry,
  onSelectCountry,
  filters,
}: {
  selectedCountry: Country | null
  onSelectCountry: (c: Country) => void
  filters: FilterState
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredEvents = useMemo(() => {
    return globalEvents.filter((e) => {
      if (e.type === 'earthquake' && !filters.earthquakes) return false
      if (e.type === 'wildfire' && !filters.wildfires) return false
      if (e.type === 'storm' && !filters.storms) return false
      if (e.type === 'conflict' && !filters.conflicts) return false
      if (e.type === 'market' && !filters.markets) return false
      return true
    })
  }, [filters])

  if (!mounted) {
    return (
      <div className="flex-1 relative bg-sentinel-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sentinel-cyan/30 border-t-sentinel-cyan rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest">INITIALIZING MAP SYSTEM...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={[20, 15]}
        zoom={2.5}
        zoomSnap={0.5}
        minZoom={2}
        maxZoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        <MapEventHandler onCountryClick={onSelectCountry} />

        {/* Country markers */}
        {countries.map((country) => (
          <PulsingMarker
            key={country.code}
            country={country}
            isSelected={selectedCountry?.code === country.code}
            onClick={() => onSelectCountry(country)}
          />
        ))}

        {/* Event markers */}
        {filteredEvents.map((event) => (
          <EventMarker key={event.id} event={event} />
        ))}
      </MapContainer>

      {/* Radar Overlay */}
      <RadarOverlay />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[600] bg-sentinel-surface/90 backdrop-blur-sm border border-border rounded-sm px-3 py-2">
        <div className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1.5">THREAT LEVEL</div>
        <div className="flex flex-col gap-1">
          {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: riskLevelConfig[level].color, boxShadow: riskLevelConfig[level].glow }}
              />
              <span className="text-[10px] font-mono text-muted-foreground">{riskLevelConfig[level].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
