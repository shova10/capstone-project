import { useState } from 'react'
import { motion } from 'framer-motion'
import { StatefulButton, type ButtonState } from './StatefulButton'

export default function App() {
  const [overrideState, setOverrideState] = useState<ButtonState | undefined>(
    undefined
  )

  // Simulated fake async API call (80% success, 20% error)
  const handleFakeAsyncCall = () => {
    return new Promise<void>((resolve, reject) => {
      const delay = Math.floor(Math.random() * 1000) + 1200
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2
        if (isSuccess) resolve()
        else reject(new Error('Network Error'))
      }, delay)
    })
  }

  const states: { label: string; value: ButtonState | undefined }[] = [
    { label: 'Auto (Interactive)', value: undefined },
    { label: 'Idle', value: 'idle' },
    { label: 'Loading', value: 'loading' },
    { label: 'Success', value: 'success' },
    { label: 'Error', value: 'error' },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Header */}
        <header className="space-y-1.5 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Interactive State Button
          </h1>
          <p className="text-slate-400 text-xs">
            Smooth layout-preserving state morphing with Framer Motion.
          </p>
        </header>

        {/* Live Interactive Canvas */}
        <div className="flex items-center justify-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/60 shadow-inner">
          <StatefulButton
            onAction={handleFakeAsyncCall}
            forceState={overrideState}
          />
        </div>

        {/* Segmented Control Panel */}
        <div className="space-y-3">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 text-center">
            State Preview Controller
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
            {states.map((st) => {
              const isActive = overrideState === st.value
              return (
                <button
                  key={st.label}
                  onClick={() => setOverrideState(st.value)}
                  className={`relative px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-sm"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{st.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Technical Specs Footer */}
        <footer className="border-t border-slate-800/60 pt-5 text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between items-center">
            <span>
              Easing:{' '}
              <code className="text-slate-300">easeOut (cubic-bezier)</code>
            </span>
            <span>
              Reduced Motion: <code className="text-slate-300">Supported</code>
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
