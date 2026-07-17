import { useState } from 'react'

interface DayActivity {
  date: string
  minutes: number
  sessions: number
}

export function ActivityGraph({ activity = [] }: { activity?: DayActivity[] }) {
  const [selectedYear, setSelectedYear] = useState('2026')
  const weeks = 53
  const totalDays = weeks * 7

  const activityMap = new Map(activity.map((a) => [a.date, a]))

  const today = new Date()
  const days: { date: string; month: string; dayOfWeek: number; minutes: number; sessions: number }[] = []

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (totalDays - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const record = activityMap.get(dateStr)
    days.push({
      date: dateStr,
      month: d.toLocaleString('en-US', { month: 'short' }),
      dayOfWeek: d.getDay(),
      minutes: record?.minutes || 0,
      sessions: record?.sessions || 0,
    })
  }

  const months: { label: string; weekIndex: number }[] = []
  let lastMonth = ''
  for (let w = 0; w < weeks; w++) {
    const firstDayOfWeek = days[w * 7]
    if (firstDayOfWeek && firstDayOfWeek.month !== lastMonth) {
      months.push({ label: firstDayOfWeek.month, weekIndex: w })
      lastMonth = firstDayOfWeek.month
    }
  }

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return 'bg-neutral-900 border border-neutral-800/60'
    if (minutes < 15) return 'bg-emerald-950 border border-emerald-900 text-emerald-300'
    if (minutes < 30) return 'bg-emerald-800 border border-emerald-700 text-emerald-200'
    if (minutes < 60) return 'bg-emerald-600 border border-emerald-500 text-emerald-100'
    return 'bg-emerald-400 border border-emerald-300 text-neutral-950'
  }

  const totalSessions = activity.reduce((sum, a) => sum + (a.sessions || 0), 0)

  return (
    <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-5 space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-neutral-200">Practice Activity</h2>
            <span className="text-xs text-neutral-500">&bull;</span>
            <span className="text-xs text-neutral-400 font-mono">{totalSessions} sessions in {selectedYear}</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">Yearly interview frequency and practice intensity distribution</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded border border-neutral-800 bg-neutral-950/60 p-0.5 text-[11px]">
            {['2026', '2025'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  selectedYear === yr ? 'bg-neutral-800 text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-800/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-900" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800 border border-emerald-700" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] space-y-1">
          <div className="flex text-[10px] text-neutral-500 font-mono pl-7">
            {months.map((m, idx) => (
              <span
                key={`${m.label}-${idx}`}
                style={{ marginLeft: idx === 0 ? `${m.weekIndex * 14}px` : `${(m.weekIndex - months[idx - 1].weekIndex) * 14 - 20}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[9px] text-neutral-500 font-mono h-[86px] py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {days.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.minutes} min practice (${day.sessions} sessions)`}
                  className={`w-2.5 h-2.5 rounded-[2px] cursor-pointer transition-colors ${getIntensityClass(day.minutes)}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}