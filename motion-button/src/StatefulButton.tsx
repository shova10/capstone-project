import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Send,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react'

// Types
export type ButtonState = 'idle' | 'loading' | 'success' | 'error'

interface StatefulButtonProps {
  onAction?: () => Promise<void>
  forceState?: ButtonState
}

// StatefulButton Component
export const StatefulButton: React.FC<StatefulButtonProps> = ({
  onAction,
  forceState,
}) => {
  const [internalStatus, setInternalStatus] = useState<ButtonState>('idle')
  const prefersReducedMotion = useReducedMotion()

  // Derived state: external forceState takes precedence if provided
  const status = forceState !== undefined ? forceState : internalStatus

  const handleClick = async () => {
    if (
      status === 'loading' ||
      status === 'success' ||
      forceState !== undefined
    )
      return

    if (onAction) {
      setInternalStatus('loading')
      try {
        await onAction()
        setInternalStatus('success')
      } catch {
        setInternalStatus('error')
      }
    }
  }

  // Auto-reset timers for success and error states
  useEffect(() => {
    if (forceState !== undefined) return

    if (status === 'success') {
      const timer = setTimeout(() => setInternalStatus('idle'), 2200)
      return () => clearTimeout(timer)
    }
    if (status === 'error') {
      const timer = setTimeout(() => setInternalStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [status, forceState])

  const transitionConfig = {
    duration: prefersReducedMotion ? 0.05 : 0.22,
    ease: [0.16, 1, 0.3, 1] as const,
  }

  const shakeAnimation =
    status === 'error' && !prefersReducedMotion
      ? { x: [0, -8, 8, -5, 5, -2, 2, 0] }
      : { x: 0 }

  // Theme configuration based on state
  const buttonStyles = {
    idle: 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border-indigo-500/30 cursor-pointer',
    loading:
      'bg-indigo-700/80 cursor-wait shadow-md shadow-indigo-700/10 border-indigo-600/30',
    success:
      'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 border-emerald-500/30 cursor-default',
    error:
      'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/25 border-rose-500/30 cursor-pointer',
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={status === 'loading' || forceState !== undefined}
      aria-label="Send message action button"
      aria-live="polite"
      className={`relative inline-flex items-center justify-center w-52 h-13 px-6 rounded-2xl font-medium text-white text-sm tracking-wide border transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 select-none overflow-hidden ${buttonStyles[status]}`}
      whileHover={
        status === 'idle' && !prefersReducedMotion && forceState === undefined
          ? { scale: 1.025, y: -1 }
          : {}
      }
      whileTap={
        status === 'idle' && !prefersReducedMotion && forceState === undefined
          ? { scale: 0.975, y: 0 }
          : {}
      }
      animate={shakeAnimation}
      transition={{
        x: { duration: 0.45, ease: 'easeInOut' },
        scale: {
          duration: prefersReducedMotion ? 0.05 : 0.2,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
    >
      {/* Background glow pulse effect on success */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.4, 0], scale: 1.4 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute inset-0 bg-emerald-400 rounded-2xl pointer-events-none"
        />
      )}

      {/* Button Content Morph */}
      <AnimatePresence mode="wait" initial={false}>
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={transitionConfig}
            className="flex items-center justify-center gap-2.5 font-semibold"
          >
            Send Message
            <Send className="w-4 h-4 transition-transform duration-300" />
          </motion.span>
        )}

        {status === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            transition={transitionConfig}
            className="flex items-center justify-center gap-2.5 font-medium text-indigo-100"
          >
            <Loader2 className="w-4.5 h-4.5 animate-spin text-indigo-200" />
            <span>Sending...</span>
          </motion.span>
        )}

        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
            transition={{
              type: prefersReducedMotion ? 'tween' : 'spring',
              stiffness: 450,
              damping: 22,
            }}
            className="flex items-center justify-center gap-2 font-semibold text-emerald-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.05,
                type: 'spring',
                stiffness: 500,
                damping: 20,
              }}
            >
              <Check className="w-4.5 h-4.5 stroke-3" />
            </motion.div>
            Message Sent!
          </motion.span>
        )}

        {status === 'error' && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={transitionConfig}
            className="flex items-center justify-center gap-2 font-semibold text-rose-50"
          >
            <AlertCircle className="w-4.5 h-4.5" />
            Failed (Retry)
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Main Interactive App Component
export default function App() {
  const [overrideState, setOverrideState] = useState<ButtonState | undefined>(
    undefined
  )
  const [lastActionOutcome, setLastActionOutcome] = useState<string | null>(
    null
  )

  // Simulated fake async API call (75% success, 25% error)
  const handleFakeAsyncCall = () => {
    return new Promise<void>((resolve, reject) => {
      setLastActionOutcome(null)
      const delay = Math.floor(Math.random() * 800) + 1200
      setTimeout(() => {
        const isSuccess = Math.random() > 0.25
        if (isSuccess) {
          setLastActionOutcome('Success (200 OK)')
          resolve()
        } else {
          setLastActionOutcome('Failed (500 Server Error)')
          reject(new Error('Network Error'))
        }
      }, delay)
    })
  }

  // Unified control states including Auto (undefined)
  const controlOptions: { label: string; value: ButtonState | undefined }[] = [
    { label: 'Auto', value: undefined },
    { label: 'Idle', value: 'idle' },
    { label: 'Loading', value: 'loading' },
    { label: 'Success', value: 'success' },
    { label: 'Error', value: 'error' },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Radial Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-125 h-125 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative z-10">
        {/* Header */}
        <header className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Stateful Motion Demo
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Interactive Action Button
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Smooth state morphing button crafted with Framer Motion, spring
            dynamics, and layout stability.
          </p>
        </header>

        {/* Live Interactive Canvas Showcase */}
        <div className="relative group flex flex-col items-center justify-center py-12 px-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {overrideState !== undefined
              ? `Forced: ${overrideState}`
              : 'Live Component'}
          </div>

          <StatefulButton
            onAction={handleFakeAsyncCall}
            forceState={overrideState}
          />

          {/* Action Outcome Indicator */}
          <div className="h-6 mt-4 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            {overrideState !== undefined ? (
              <span className="text-amber-400">
                ⚠️ Manual override active. Clear or select "Auto" to test live
                async clicks.
              </span>
            ) : lastActionOutcome ? (
              <span
                className={
                  lastActionOutcome.includes('Success')
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }
              >
                Result: {lastActionOutcome}
              </span>
            ) : (
              <span className="text-slate-600">
                Click button to test simulated async request
              </span>
            )}
          </div>
        </div>

        {/* Manual Segmented Override Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" /> State Override
              Controls
            </label>
          </div>

          <div className="grid grid-cols-5 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800/80 gap-1">
            {controlOptions.map((opt) => {
              const isActive = overrideState === opt.value
              return (
                <button
                  key={opt.label}
                  onClick={() => setOverrideState(opt.value)}
                  className={`relative py-2 text-xs font-medium rounded-lg transition-colors z-10 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="segmented-bg"
                      className="absolute inset-0 bg-indigo-600/90 rounded-lg -z-10 shadow-md"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Motion Rationale Grid */}
        <section className="border-t border-slate-800/80 pt-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Architectural & UX
            Highlights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Zero
                Layout Shift
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Fixed element dimensions and Framer Motion{' '}
                <code className="text-slate-300">AnimatePresence</code> ensure
                zero layout reflow across transitions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{' '}
                Tactile Feedback
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Spring curve on checkmark (
                <code className="text-slate-300">stiffness: 450</code>) and
                error shake keyframes offer instant visual acknowledgment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Accessible
                Motion
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Strictly respects{' '}
                <code className="text-slate-300">prefers-reduced-motion</code>{' '}
                by dropping intensive transitions to instant status swaps.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{' '}
                Hardware Accelerated
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Animations target composite-only properties (
                <code className="text-slate-300">transform</code>,{' '}
                <code className="text-slate-300">opacity</code>,{' '}
                <code className="text-slate-300">filter</code>) for smooth 60fps
                performance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
