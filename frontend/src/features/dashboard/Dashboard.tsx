import { Flame, Clock, CheckCircle2, Play } from 'lucide-react'

export function Dashboard({ onStartInterview }: { onStartInterview: () => void }) {
  const stats = [
    { label: 'Current Streak', value: '4 days', icon: Flame },
    { label: 'Interviews Completed', value: '12', icon: CheckCircle2 },
    { label: 'Practice Time', value: '4.8 hrs', icon: Clock },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-100">Performance Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">Review your practice metrics and start a new evaluation session.</p>
        </div>

        <button
          onClick={onStartInterview}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-neutral-100 text-neutral-900 text-xs font-medium hover:bg-neutral-200 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Interview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-medium">{stat.label}</span>
                <Icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-100 tracking-tight">{stat.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}