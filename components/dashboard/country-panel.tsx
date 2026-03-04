'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Swords,
  Plane,
  Flame,
  TrendingUp,
  Shield,
  Activity,
  Eye,
} from 'lucide-react'
import { type Country, riskLevelConfig } from '@/lib/dashboard-data'

function RiskMeter({ score, level }: { score: number; level: Country['riskLevel'] }) {
  const config = riskLevelConfig[level]
  const angle = (score / 100) * 180 - 90

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <defs>
            <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF88" />
              <stop offset="33%" stopColor="#FFC107" />
              <stop offset="66%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FF3B3B" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
          {/* Filled arc */}
          <path
            d="M 10 55 A 50 50 0 0 1 110 55"
            fill="none"
            stroke="url(#meterGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 157} 157`}
            filter="url(#glow)"
          />
          {/* Needle */}
          <line
            x1="60"
            y1="55"
            x2={60 + 38 * Math.cos((angle * Math.PI) / 180)}
            y2={55 + 38 * Math.sin((angle * Math.PI) / 180)}
            stroke={config.color}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle cx="60" cy="55" r="3" fill={config.color} filter="url(#glow)" />
        </svg>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span
          className="text-xl font-bold font-mono"
          style={{ color: config.color, textShadow: config.glow }}
        >
          {score}
        </span>
        <span
          className="text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-sm border"
          style={{
            color: config.color,
            borderColor: config.color,
            background: `${config.color}15`,
          }}
        >
          {config.label}
        </span>
      </div>
    </div>
  )
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const height = 32
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DataRow({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
  sub?: string
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40">
      <span style={{ color }}>{icon}</span>
      <div className="flex-1">
        <div className="text-[9px] font-mono text-muted-foreground tracking-wider">{label}</div>
        {sub && <div className="text-[8px] font-mono text-muted-foreground/60 truncate">{sub}</div>}
      </div>
      <span className="text-xs font-mono font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

export default function CountryPanel({
  country,
  onClose,
}: {
  country: Country | null
  onClose: () => void
}) {
  return (
    <AnimatePresence mode="wait">
      {country ? (
        <motion.aside
          key={country.code}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-72 shrink-0 bg-sentinel-surface border-l border-border flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <h2 className="text-sm font-bold text-foreground tracking-wide">{country.name}</h2>
                  <span className="text-[9px] font-mono text-muted-foreground tracking-widest">
                    {country.region} / {country.code}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-sentinel-surface-2 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Risk Meter */}
            <RiskMeter score={country.riskScore} level={country.riskLevel} />
          </div>

          {/* Data Section - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {/* Weather */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Thermometer className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-mono text-primary tracking-[0.2em] font-semibold">WEATHER CONDITIONS</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40">
                  <Thermometer className="w-3 h-3 text-sentinel-amber" />
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground">TEMP</div>
                    <div className="text-xs font-mono font-semibold text-foreground">{country.weather.temp}{'C'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40">
                  <Droplets className="w-3 h-3 text-sentinel-cyan" />
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground">HUMID</div>
                    <div className="text-xs font-mono font-semibold text-foreground">{country.weather.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40">
                  <Wind className="w-3 h-3 text-sentinel-cyan" />
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground">WIND</div>
                    <div className="text-xs font-mono font-semibold text-foreground">{country.weather.wind} km/h</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40">
                  <Eye className="w-3 h-3 text-muted-foreground" />
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground">COND</div>
                    <div className="text-[10px] font-mono font-semibold text-foreground truncate">{country.weather.condition}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conflict */}
            {country.conflictActive && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Swords className="w-3 h-3 text-sentinel-red" />
                  <span className="text-[9px] font-mono text-sentinel-red tracking-[0.2em] font-semibold">CONFLICT STATUS</span>
                </div>
                <div
                  className="px-2 py-2 rounded-sm border animate-border-glow"
                  style={{ borderColor: 'rgba(255, 59, 59, 0.3)', background: 'rgba(255, 59, 59, 0.05)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-red opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-red" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sentinel-red tracking-wider">ACTIVE</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                    {country.conflictDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Disasters */}
            {country.disasters.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3 h-3 text-sentinel-amber" />
                  <span className="text-[9px] font-mono text-sentinel-amber tracking-[0.2em] font-semibold">RECENT DISASTERS</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {country.disasters.map((d, i) => (
                    <div key={i} className="px-2 py-1.5 rounded-sm bg-sentinel-surface-2/40 border border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-sentinel-amber">{d.type}</span>
                        <span className="text-[8px] font-mono text-muted-foreground">{d.date}</span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed mt-0.5">{d.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intelligence Data */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-mono text-primary tracking-[0.2em] font-semibold">INTEL DATA</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <DataRow
                  icon={<TrendingUp className="w-3 h-3" />}
                  label="GOLD INDICATOR"
                  value={`$${country.goldIndicator}`}
                  color="#FFD700"
                />
                <DataRow
                  icon={<Plane className="w-3 h-3" />}
                  label="FLIGHT DENSITY"
                  value={`${country.flightDensity}/hr`}
                  color="#00E5FF"
                />
                <DataRow
                  icon={<Flame className="w-3 h-3" />}
                  label="WILDFIRE DETECT"
                  value={country.wildfireDetections}
                  color={country.wildfireDetections > 10 ? '#FF3B3B' : '#FFC107'}
                />
                <DataRow
                  icon={<Shield className="w-3 h-3" />}
                  label="POPULATION"
                  value={country.population}
                  color="#00E5FF"
                />
              </div>
            </div>

            {/* Risk Trend Chart */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-mono text-primary tracking-[0.2em] font-semibold">RISK TREND (12W)</span>
              </div>
              <div className="px-2 py-2 rounded-sm bg-sentinel-surface-2/40 border border-border/30">
                <MiniSparkline
                  data={country.marketData}
                  color={riskLevelConfig[country.riskLevel].color}
                />
              </div>
            </div>
          </div>
        </motion.aside>
      ) : (
        <motion.aside
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-72 shrink-0 bg-sentinel-surface border-l border-border flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="relative">
              <Target className="w-10 h-10 text-sentinel-cyan/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-sentinel-cyan/10 animate-pulse-dot" />
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest leading-relaxed">
              SELECT A TARGET ON THE MAP TO VIEW INTELLIGENCE DATA
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function Target(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
