'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function playMilitaryIntroSound() {
  try {
    const ctx = new AudioContext()
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.55, ctx.currentTime)
    masterGain.connect(ctx.destination)

    // 1) Deep cinematic sub-boom
    const boomOsc = ctx.createOscillator()
    const boomGain = ctx.createGain()
    boomOsc.type = 'sine'
    boomOsc.frequency.setValueAtTime(55, ctx.currentTime)
    boomOsc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 1.5)
    boomGain.gain.setValueAtTime(0.7, ctx.currentTime)
    boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5)
    boomOsc.connect(boomGain)
    boomGain.connect(masterGain)
    boomOsc.start(ctx.currentTime)
    boomOsc.stop(ctx.currentTime + 2.5)

    // 2) Secondary deep hit
    const hitOsc = ctx.createOscillator()
    const hitGain = ctx.createGain()
    hitOsc.type = 'triangle'
    hitOsc.frequency.setValueAtTime(80, ctx.currentTime + 0.05)
    hitOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.0)
    hitGain.gain.setValueAtTime(0.5, ctx.currentTime + 0.05)
    hitGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    hitOsc.connect(hitGain)
    hitGain.connect(masterGain)
    hitOsc.start(ctx.currentTime + 0.05)
    hitOsc.stop(ctx.currentTime + 1.2)

    // 3) Rising tension drone
    const droneOsc = ctx.createOscillator()
    const droneGain = ctx.createGain()
    const droneFilter = ctx.createBiquadFilter()
    droneOsc.type = 'sawtooth'
    droneOsc.frequency.setValueAtTime(60, ctx.currentTime + 0.3)
    droneOsc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 4.0)
    droneFilter.type = 'lowpass'
    droneFilter.frequency.setValueAtTime(200, ctx.currentTime + 0.3)
    droneFilter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 4.0)
    droneFilter.Q.setValueAtTime(2, ctx.currentTime)
    droneGain.gain.setValueAtTime(0, ctx.currentTime)
    droneGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5)
    droneGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3.5)
    droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.5)
    droneOsc.connect(droneFilter)
    droneFilter.connect(droneGain)
    droneGain.connect(masterGain)
    droneOsc.start(ctx.currentTime + 0.3)
    droneOsc.stop(ctx.currentTime + 5.5)

    // 4) Radio static / crackle noise burst
    const noiseLen = ctx.sampleRate * 3
    const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5
    }
    const noiseNode = ctx.createBufferSource()
    noiseNode.buffer = noiseBuffer
    const noiseGain = ctx.createGain()
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(3000, ctx.currentTime)
    noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime)
    noiseGain.gain.setValueAtTime(0, ctx.currentTime)
    noiseGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1)
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.4)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0)
    noiseGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.8)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0)
    noiseNode.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    noiseNode.start(ctx.currentTime)
    noiseNode.stop(ctx.currentTime + 3.0)

    // 5) Sonar ping at title reveal
    const pingDelay = 0.6
    const pingOsc = ctx.createOscillator()
    const pingGain = ctx.createGain()
    pingOsc.type = 'sine'
    pingOsc.frequency.setValueAtTime(1320, ctx.currentTime + pingDelay)
    pingGain.gain.setValueAtTime(0.35, ctx.currentTime + pingDelay)
    pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + pingDelay + 1.8)
    pingOsc.connect(pingGain)
    pingGain.connect(masterGain)
    pingOsc.start(ctx.currentTime + pingDelay)
    pingOsc.stop(ctx.currentTime + pingDelay + 1.8)

    // 6) Second sonar ping for subtitle
    const ping2Delay = 2.2
    const ping2Osc = ctx.createOscillator()
    const ping2Gain = ctx.createGain()
    ping2Osc.type = 'sine'
    ping2Osc.frequency.setValueAtTime(1760, ctx.currentTime + ping2Delay)
    ping2Gain.gain.setValueAtTime(0.2, ctx.currentTime + ping2Delay)
    ping2Gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ping2Delay + 1.5)
    ping2Osc.connect(ping2Gain)
    ping2Gain.connect(masterGain)
    ping2Osc.start(ctx.currentTime + ping2Delay)
    ping2Osc.stop(ctx.currentTime + ping2Delay + 1.5)

    // 7) Low rumble / mechanical hum undertone
    const rumbleOsc = ctx.createOscillator()
    const rumbleGain = ctx.createGain()
    rumbleOsc.type = 'sine'
    rumbleOsc.frequency.setValueAtTime(40, ctx.currentTime)
    rumbleGain.gain.setValueAtTime(0, ctx.currentTime)
    rumbleGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5)
    rumbleGain.gain.setValueAtTime(0.15, ctx.currentTime + 4.0)
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.8)
    rumbleOsc.connect(rumbleGain)
    rumbleGain.connect(masterGain)
    rumbleOsc.start(ctx.currentTime)
    rumbleOsc.stop(ctx.currentTime + 5.8)

    // 8) Digital beep sequence (like system boot)
    const beepTimes = [0.6, 1.4, 2.2, 3.4, 4.2]
    const beepFreqs = [880, 660, 880, 1100, 1320]
    beepTimes.forEach((t, i) => {
      const beepOsc = ctx.createOscillator()
      const beepGain = ctx.createGain()
      beepOsc.type = 'square'
      beepOsc.frequency.setValueAtTime(beepFreqs[i], ctx.currentTime + t)
      beepGain.gain.setValueAtTime(0.06, ctx.currentTime + t)
      beepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12)
      beepOsc.connect(beepGain)
      beepGain.connect(masterGain)
      beepOsc.start(ctx.currentTime + t)
      beepOsc.stop(ctx.currentTime + t + 0.15)
    })

    // 9) Final power-up sweep
    const sweepOsc = ctx.createOscillator()
    const sweepGain = ctx.createGain()
    const sweepFilter = ctx.createBiquadFilter()
    sweepOsc.type = 'sawtooth'
    sweepOsc.frequency.setValueAtTime(100, ctx.currentTime + 4.5)
    sweepOsc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 5.5)
    sweepFilter.type = 'lowpass'
    sweepFilter.frequency.setValueAtTime(400, ctx.currentTime + 4.5)
    sweepFilter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 5.5)
    sweepGain.gain.setValueAtTime(0, ctx.currentTime + 4.5)
    sweepGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 5.0)
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.8)
    sweepOsc.connect(sweepFilter)
    sweepFilter.connect(sweepGain)
    sweepGain.connect(masterGain)
    sweepOsc.start(ctx.currentTime + 4.5)
    sweepOsc.stop(ctx.currentTime + 5.8)

    // Fade master out at end
    masterGain.gain.setValueAtTime(0.55, ctx.currentTime + 5.0)
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 6.2)

    // Close context after all sounds finish
    setTimeout(() => ctx.close().catch(() => {}), 7000)

    return ctx
  } catch {
    return null
  }
}

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'title' | 'subtitle' | 'status' | 'exit'>('boot')
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const startSequence = useCallback(() => {
    if (hasInteracted) return
    setHasInteracted(true)

    // Play military suspense sound via Web Audio API
    audioCtxRef.current = playMilitaryIntroSound()

    // Phase timeline
    setTimeout(() => setPhase('title'), 600)
    setTimeout(() => setPhase('subtitle'), 2200)
    setTimeout(() => setPhase('status'), 3400)
    setTimeout(() => setPhase('exit'), 5400)
    setTimeout(() => {
      onComplete()
    }, 6200)
  }, [hasInteracted, onComplete])

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }
  }, [])

  // Scramble text effect
  const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [display, setDisplay] = useState('')
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

    useEffect(() => {
      let timeout: NodeJS.Timeout
      let interval: NodeJS.Timeout
      let iteration = 0

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          setDisplay(
            text
              .split('')
              .map((char, idx) => {
                if (char === ' ') return ' '
                if (idx < iteration) return text[idx]
                return chars[Math.floor(Math.random() * chars.length)]
              })
              .join('')
          )
          iteration += 1 / 2
          if (iteration >= text.length) {
            setDisplay(text)
            clearInterval(interval)
          }
        }, 40)
      }, delay)

      return () => {
        clearTimeout(timeout)
        clearInterval(interval)
      }
    }, [text, delay])

    return <>{display}</>
  }

  // Boot sequence lines
  const bootLines = [
    'INITIALIZING SECURE UPLINK...',
    'CONNECTING TO SATELLITE NETWORK...',
    'DECRYPTING INTELLIGENCE FEEDS...',
    'CALIBRATING THREAT MATRIX...',
    'LOADING GEOSPATIAL MODULES...',
    'SYSTEM ARMED // READY',
  ]

  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-sentinel-navy">
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.1) 2px, rgba(0,229,255,0.1) 4px)',
          }}
        />

        <motion.button
          onClick={startSequence}
          className="relative flex flex-col items-center gap-6 cursor-pointer group bg-transparent border-none outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Outer ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-sentinel-cyan/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-sentinel-cyan/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                borderTopColor: 'rgba(0, 229, 255, 0.6)',
              }}
            />
            <div className="w-16 h-16 rounded-full border-2 border-sentinel-cyan/40 flex items-center justify-center group-hover:border-sentinel-cyan/80 transition-colors duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-sentinel-cyan ml-1">
                <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sentinel-cyan/70 font-mono text-xs tracking-[0.3em] uppercase">
              Click to Initialize
            </span>
            <span className="text-sentinel-cyan/40 font-mono text-[10px] tracking-[0.2em]">
              GEOPULSE SENTINEL v3.7.1
            </span>
          </div>

          {/* Corner brackets */}
          <div className="absolute -inset-8 pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-sentinel-cyan/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-sentinel-cyan/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-sentinel-cyan/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-sentinel-cyan/30" />
          </div>
        </motion.button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-sentinel-navy overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        key="intro-overlay"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Scanline */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sentinel-cyan/20 to-transparent pointer-events-none"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Radar sweep */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[600px] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,229,255,0.06) 40deg, transparent 60deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[200, 320, 440].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-sentinel-cyan/[0.06]"
              style={{ width: size, height: size }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Boot sequence text - top left */}
        <div className="absolute top-8 left-8 font-mono text-[11px] text-sentinel-cyan/50 leading-relaxed">
          {phase !== 'boot' ? (
            bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.15 }}
              >
                <span className="text-sentinel-cyan/30 mr-2">{'>'}</span>
                {line}
              </motion.div>
            ))
          ) : (
            bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.15 }}
              >
                <span className="text-sentinel-cyan/30 mr-2">{'>'}</span>
                {line}
              </motion.div>
            ))
          )}
        </div>

        {/* System metrics - top right */}
        <div className="absolute top-8 right-8 font-mono text-[10px] text-sentinel-cyan/40 text-right leading-relaxed">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            UPLINK: <span className="text-sentinel-green">ACTIVE</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            ENCRYPTION: <span className="text-sentinel-green">AES-256</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            CLEARANCE: <span className="text-sentinel-amber">LEVEL 5</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            FREQ: <span className="text-sentinel-cyan/60">4.7 GHz</span>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Horizontal line top */}
          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent via-sentinel-cyan/60 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 500 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          />

          {/* Emblem / crosshair */}
          <motion.div
            className="relative w-20 h-20 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', damping: 15 }}
          >
            <div className="absolute inset-0 rounded-full border border-sentinel-cyan/30" />
            <div className="absolute inset-3 rounded-full border border-sentinel-cyan/20" />
            {/* Crosshair lines */}
            <div className="absolute top-0 left-1/2 w-[1px] h-3 bg-sentinel-cyan/40 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-[1px] h-3 bg-sentinel-cyan/40 -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 w-3 h-[1px] bg-sentinel-cyan/40 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-3 h-[1px] bg-sentinel-cyan/40 -translate-y-1/2" />
            <motion.div
              className="w-3 h-3 rounded-full bg-sentinel-cyan/80"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3">
            <motion.h1
              className="font-[Orbitron] text-5xl md:text-7xl font-bold tracking-[0.2em] text-sentinel-cyan"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={
                phase === 'title' || phase === 'subtitle' || phase === 'status' || phase === 'exit'
                  ? { opacity: 1, letterSpacing: '0.2em' }
                  : { opacity: 0, letterSpacing: '0.6em' }
              }
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                textShadow: '0 0 40px rgba(0,229,255,0.5), 0 0 80px rgba(0,229,255,0.2), 0 0 120px rgba(0,229,255,0.1)',
              }}
            >
              <ScrambleText text="GEOPULSE" delay={600} />
            </motion.h1>

            <motion.h2
              className="font-[Orbitron] text-2xl md:text-4xl font-semibold tracking-[0.35em] text-sentinel-cyan/70"
              initial={{ opacity: 0, y: 10 }}
              animate={
                phase === 'title' || phase === 'subtitle' || phase === 'status' || phase === 'exit'
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              style={{
                textShadow: '0 0 20px rgba(0,229,255,0.3)',
              }}
            >
              <ScrambleText text="SENTINEL" delay={1000} />
            </motion.h2>
          </div>

          {/* Separator */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={
              phase === 'subtitle' || phase === 'status' || phase === 'exit'
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-[1px] bg-sentinel-cyan/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-sentinel-cyan/50" />
            <div className="w-8 h-[1px] bg-sentinel-cyan/30" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="font-mono text-sm md:text-base tracking-[0.4em] text-sentinel-cyan/50 uppercase text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={
              phase === 'subtitle' || phase === 'status' || phase === 'exit'
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 5 }
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <ScrambleText text="GLOBAL INTELLIGENCE MONITORING SYSTEM" delay={2200} />
          </motion.p>

          {/* Horizontal line bottom */}
          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent via-sentinel-cyan/60 to-transparent"
            initial={{ width: 0 }}
            animate={
              phase === 'subtitle' || phase === 'status' || phase === 'exit'
                ? { width: 500 }
                : { width: 0 }
            }
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Status line */}
          <motion.div
            className="flex items-center gap-4 font-mono text-xs tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={
              phase === 'status' || phase === 'exit'
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <span className="text-sentinel-green/80 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-sentinel-green"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              SYSTEMS ONLINE
            </span>
            <span className="text-sentinel-cyan/30">|</span>
            <span className="text-sentinel-amber/80 flex items-center gap-2">
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full bg-sentinel-amber"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
              THREAT LEVEL ELEVATED
            </span>
            <span className="text-sentinel-cyan/30">|</span>
            <span className="text-sentinel-cyan/60">
              LAUNCHING DASHBOARD...
            </span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="w-72 h-[2px] bg-sentinel-cyan/10 rounded-full overflow-hidden mt-2"
            initial={{ opacity: 0 }}
            animate={
              phase === 'status' || phase === 'exit'
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-sentinel-cyan/80 to-sentinel-cyan"
              initial={{ width: '0%' }}
              animate={
                phase === 'status' || phase === 'exit'
                  ? { width: '100%' }
                  : { width: '0%' }
              }
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{
                boxShadow: '0 0 10px rgba(0,229,255,0.6), 0 0 20px rgba(0,229,255,0.3)',
              }}
            />
          </motion.div>
        </div>

        {/* Bottom classification */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.5em] text-sentinel-red/40 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {'// TOP SECRET // SCI // NOFORN //'}
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-sentinel-cyan/20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-sentinel-cyan/20" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-sentinel-cyan/20" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-sentinel-cyan/20" />

        {/* Fade to white flash on exit */}
        <AnimatePresence>
          {phase === 'exit' && (
            <motion.div
              className="absolute inset-0 bg-sentinel-cyan/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
