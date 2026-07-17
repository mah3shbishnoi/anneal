import { useState } from 'react'
import { ArrowRight, Code2, Database, Network, Cpu, Clock } from 'lucide-react'

export interface InterviewConfig {
  topic: string
  difficulty: string
  durationMinutes: number
}

export function InterviewSetup({ onStart }: { onStart: (config: InterviewConfig) => void }) {
  const [topic, setTopic] = useState('Python')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [durationMinutes, setDurationMinutes] = useState(20)
  const [isCustomDuration, setIsCustomDuration] = useState(false)
  const [customValue, setCustomValue] = useState('20')

  const topics = [
    { id: 'Python', label: 'Python & Core Concepts', icon: Code2 },
    { id: 'Algorithms', label: 'Algorithms & Data Structures', icon: Cpu },
    { id: 'Databases', label: 'Databases & SQL', icon: Database },
    { id: 'System Design', label: 'System Design & Architecture', icon: Network },
  ]

  const difficulties = ['Junior', 'Intermediate', 'Senior']
  const presets = [10, 20, 30, 45, 60]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalDuration = isCustomDuration ? Math.max(1, parseInt(customValue) || 15) : durationMinutes
    onStart({ topic, difficulty, durationMinutes: finalDuration })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-100">Setup Practice Session</h1>
        <p className="text-xs text-neutral-400 mt-1">Configure your interview parameters to initialize the session.</p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-neutral-300">Technical Topic</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topics.map((t) => {
            const Icon = t.icon
            const selected = topic === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs transition-colors ${
                  selected
                    ? 'border-neutral-400 bg-neutral-900 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
                }`}
              >
                <Icon className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-neutral-300">Difficulty Target</label>
        <div className="grid grid-cols-3 gap-2.5">
          {difficulties.map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-2 px-3 rounded-lg border text-center text-xs font-medium transition-colors ${
                difficulty === d
                  ? 'border-neutral-400 bg-neutral-900 text-neutral-100'
                  : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-neutral-300">Target Duration</label>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Time-allocated evaluation</span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presets.map((mins) => (
            <button
              type="button"
              key={mins}
              onClick={() => {
                setDurationMinutes(mins)
                setIsCustomDuration(false)
              }}
              className={`py-2 px-3 rounded-lg border text-center text-xs font-medium transition-colors ${
                !isCustomDuration && durationMinutes === mins
                  ? 'border-neutral-400 bg-neutral-900 text-neutral-100'
                  : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
              }`}
            >
              {mins === 60 ? '1 hr' : `${mins} min`}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsCustomDuration(true)}
            className={`py-2 px-3 rounded-lg border text-center text-xs font-medium transition-colors ${
              isCustomDuration
                ? 'border-neutral-400 bg-neutral-900 text-neutral-100'
                : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300'
            }`}
          >
            Custom
          </button>
        </div>

        {isCustomDuration && (
          <div className="flex items-center gap-3 pt-2">
            <input
              type="number"
              min="1"
              max="180"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="e.g. 25"
              className="w-32 bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-neutral-600 font-mono"
            />
            <span className="text-xs text-neutral-400">minutes</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-800 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-xs font-medium hover:bg-neutral-200 transition-colors"
        >
          <span>Launch Interview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  )
}