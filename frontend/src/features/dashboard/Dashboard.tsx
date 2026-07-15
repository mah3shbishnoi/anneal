import { useState, useEffect } from 'react'
import { Flame, Clock, CheckCircle2, Play, Terminal } from 'lucide-react'
import { ActivityGraph } from './ActivityGraph'

interface StatsData {
  streak_days: number
  total_interviews: number
  practice_hours: number
  recent_interviews: Array<{
    id: string
    topic: string
    difficulty: string
    status: string
    overall_score: number | null
    started_at: string
  }>
}

export function Dashboard({ onStartInterview }: { onStartInterview: () => void }) {
  const [stats, setStats] = useState<StatsData>({
    streak_days: 0,
    total_interviews: 0,
    practice_hours: 0,
    recent_interviews: [],
  })

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data)
      })
      .catch(() => {})
  }, [])

  const cards = [
    { label: 'Current Streak', value: `${stats.streak_days} days`, icon: Flame },
    { label: 'Interviews Completed', value: `${stats.total_interviews}`, icon: CheckCircle2 },
    { label: 'Practice Time', value: `${stats.practice_hours} hrs`, icon: Clock },
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
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur space-y-2"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-medium">{card.label}</span>
                <Icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-100 tracking-tight">{card.value}</div>
            </div>
          )
        })}
      </div>

      <ActivityGraph />

      <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-medium text-neutral-200">Recent Sessions</h2>
        {stats.recent_interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
            <Terminal className="w-6 h-6 text-neutral-600" />
            <p className="text-xs text-neutral-400">No recorded interview sessions yet.</p>
            <p className="text-[11px] text-neutral-600">Start an interview session to begin tracking performance and metrics.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recent_interviews.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded border border-neutral-800/60 bg-neutral-950/40 text-xs"
              >
                <div>
                  <span className="font-medium text-neutral-200 capitalize">{item.topic}</span>
                  <span className="text-neutral-500 ml-2">({item.difficulty})</span>
                </div>
                <div className="text-neutral-400">
                  {item.overall_score ? `${item.overall_score}%` : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}