'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Flame,
  Cloud,
  Swords,
  TrendingUp,
  Plane,
  Satellite,
  Zap,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
} from 'lucide-react'
import { globalStats, type FilterState } from '@/lib/dashboard-data'

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/50 border border-border/50"
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-sm" style={{ background: `${color}15` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-mono text-muted-foreground tracking-wider truncate">{label}</div>
        <div className="text-sm font-semibold text-foreground font-mono">{value}</div>
      </div>
    </motion.div>
  )
}

function FilterToggle({
  icon,
  label,
  active,
  color,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  color: string
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-2 py-1.5 rounded-sm border transition-all duration-200 w-full text-left"
      style={{
        borderColor: active ? color : 'var(--border)',
        background: active ? `${color}10` : 'transparent',
      }}
    >
      <span style={{ color: active ? color : 'var(--muted-foreground)' }}>{icon}</span>
      <span
        className="text-[10px] font-mono tracking-wider flex-1"
        style={{ color: active ? color : 'var(--muted-foreground)' }}
      >
        {label}
      </span>
      <span
        className="w-1.5 h-1.5 rounded-full transition-all duration-200"
        style={{ background: active ? color : 'var(--muted-foreground)', opacity: active ? 1 : 0.3 }}
      />
    </button>
  )
}

export default function LeftSidebar({
  filters,
  onFiltersChange,
}: {
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
}) {
  const toggleFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <aside className="w-56 shrink-0 bg-sentinel-surface border-r border-border flex flex-col overflow-hidden">
      {/* Global Stats Section */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-mono text-primary tracking-[0.2em] font-semibold">GLOBAL STATS</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <StatCard
            icon={<Zap className="w-3.5 h-3.5" />}
            label="TOTAL EVENTS"
            value={globalStats.totalEvents}
            color="#00E5FF"
            delay={0}
          />
          <StatCard
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            label="CRITICAL ALERTS"
            value={globalStats.criticalAlerts}
            color="#FF3B3B"
            delay={0.05}
          />
          <StatCard
            icon={<Swords className="w-3.5 h-3.5" />}
            label="ACTIVE CONFLICTS"
            value={globalStats.activeConflicts}
            color="#FF3B3B"
            delay={0.1}
          />
          <StatCard
            icon={<Target className="w-3.5 h-3.5" />}
            label="HIGH RISK ZONES"
            value={globalStats.highRiskCountries}
            color="#FF8C00"
            delay={0.15}
          />
          <StatCard
            icon={<Satellite className="w-3.5 h-3.5" />}
            label="SAT FEEDS"
            value={globalStats.satelliteFeeds}
            color="#00E5FF"
            delay={0.2}
          />
          <StatCard
            icon={<Plane className="w-3.5 h-3.5" />}
            label="FLIGHTS TRACKED"
            value={globalStats.flightsTracked.toLocaleString()}
            color="#00E5FF"
            delay={0.25}
          />
          <StatCard
            icon={<Flame className="w-3.5 h-3.5" />}
            label="WILDFIRE DETECT"
            value={globalStats.wildfireDetections}
            color="#FF3B3B"
            delay={0.3}
          />
        </div>
      </div>

      {/* Market Data */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-sentinel-gold" />
          <span className="text-[10px] font-mono text-sentinel-gold tracking-[0.2em] font-semibold">MARKETS</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-sm bg-sentinel-surface-2/50 border border-border/50">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground">GOLD (XAU/USD)</div>
              <div className="text-sm font-mono font-semibold text-sentinel-gold">${globalStats.goldPrice.toFixed(2)}</div>
            </div>
            <span className="text-[10px] font-mono text-sentinel-green">+{globalStats.goldChange}%</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-sm bg-sentinel-surface-2/50 border border-border/50">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground">BRENT CRUDE</div>
              <div className="text-sm font-mono font-semibold text-foreground">${globalStats.oilPrice.toFixed(2)}</div>
            </div>
            <span className="text-[10px] font-mono text-sentinel-red">{globalStats.oilChange}%</span>
          </div>
        </div>
      </div>

      {/* Data Filters */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-mono text-primary tracking-[0.2em] font-semibold">DATA LAYERS</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <FilterToggle
            icon={<Globe className="w-3.5 h-3.5" />}
            label="EARTHQUAKES"
            active={filters.earthquakes}
            color="#FFC107"
            onToggle={() => toggleFilter('earthquakes')}
          />
          <FilterToggle
            icon={<Flame className="w-3.5 h-3.5" />}
            label="WILDFIRES"
            active={filters.wildfires}
            color="#FF3B3B"
            onToggle={() => toggleFilter('wildfires')}
          />
          <FilterToggle
            icon={<Cloud className="w-3.5 h-3.5" />}
            label="STORMS"
            active={filters.storms}
            color="#00E5FF"
            onToggle={() => toggleFilter('storms')}
          />
          <FilterToggle
            icon={<Swords className="w-3.5 h-3.5" />}
            label="CONFLICTS"
            active={filters.conflicts}
            color="#FF3B3B"
            onToggle={() => toggleFilter('conflicts')}
          />
          <FilterToggle
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            label="MARKETS"
            active={filters.markets}
            color="#FFD700"
            onToggle={() => toggleFilter('markets')}
          />
          <FilterToggle
            icon={<Plane className="w-3.5 h-3.5" />}
            label="FLIGHTS"
            active={filters.flights}
            color="#00E5FF"
            onToggle={() => toggleFilter('flights')}
          />
          <FilterToggle
            icon={<Satellite className="w-3.5 h-3.5" />}
            label="SATELLITES"
            active={filters.satellites}
            color="#00E5FF"
            onToggle={() => toggleFilter('satellites')}
          />
        </div>
      </div>
    </aside>
  )
}
