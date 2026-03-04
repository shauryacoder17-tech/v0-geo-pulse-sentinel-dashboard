'use client'

import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Flame,
  CloudLightning,
  Swords,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { globalEvents, eventTypeConfig, severityConfig, type GlobalEvent } from '@/lib/dashboard-data'

const eventIcons: Record<string, React.ReactNode> = {
  earthquake: <Zap className="w-3.5 h-3.5" />,
  wildfire: <Flame className="w-3.5 h-3.5" />,
  storm: <CloudLightning className="w-3.5 h-3.5" />,
  conflict: <Swords className="w-3.5 h-3.5" />,
  market: <TrendingUp className="w-3.5 h-3.5" />,
}

function formatTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'JUST NOW'
  if (hours < 24) return `${hours}H AGO`
  const days = Math.floor(hours / 24)
  return `${days}D AGO`
}

function TimelineNode({ event, index }: { event: GlobalEvent; index: number }) {
  const typeConfig = eventTypeConfig[event.type]
  const sevConfig = severityConfig[event.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex-shrink-0 w-56 flex flex-col"
    >
      {/* Connector + Node */}
      <div className="flex items-center gap-0 mb-2 relative">
        {/* Glowing node */}
        <div
          className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2"
          style={{
            borderColor: typeConfig.color,
            background: `${typeConfig.color}15`,
            boxShadow: `0 0 12px ${typeConfig.color}40`,
          }}
        >
          <span style={{ color: typeConfig.color }}>{eventIcons[event.type]}</span>
        </div>
        {/* Connector line */}
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, ${typeConfig.color}60, ${typeConfig.color}10)`,
          }}
        />
      </div>

      {/* Card */}
      <div className="ml-1 px-2.5 py-2 rounded-sm bg-sentinel-surface-2/60 border border-border/50 hover:border-border transition-colors">
        {/* Type + Severity Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[8px] font-mono font-bold tracking-[0.2em] px-1.5 py-0.5 rounded-sm"
            style={{ color: typeConfig.color, background: `${typeConfig.color}15` }}
          >
            {typeConfig.label}
          </span>
          <span
            className="text-[8px] font-mono font-bold tracking-wider px-1 py-0.5 rounded-sm"
            style={{ color: sevConfig.color, background: sevConfig.bg }}
          >
            {event.severity.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-[11px] font-semibold text-foreground leading-tight mb-1 line-clamp-2">
          {event.title}
        </h4>

        {/* Location + Time */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted-foreground">{event.location}</span>
          <span className="text-[9px] font-mono text-primary/70">{formatTimeAgo(event.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function EventTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const sortedEvents = useMemo(() => {
    return [...globalEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = direction === 'left' ? -300 : 300
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="h-36 shrink-0 bg-sentinel-surface border-t border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-cyan" />
          </div>
          <span className="text-[10px] font-mono text-primary tracking-[0.2em] font-semibold">
            LIVE EVENT FEED
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">
            {globalEvents.length} EVENTS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-sentinel-surface-2 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-sentinel-surface-2 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-4 px-4 overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {sortedEvents.map((event, i) => (
          <TimelineNode key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  )
}
