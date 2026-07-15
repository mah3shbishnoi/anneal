interface DayActivity {
  date: string
  minutes: number
  sessions: number
}

export function ActivityGraph({ activity = [] }: { activity?: DayActivity[] }) {
  const weeks = 16
  const totalDays = weeks * 7

  const activityMap = new Map(activity.map((a) => [a.date, a]))

  const today = new Date()
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (totalDays - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const record = activityMap.get(dateStr)
    return {
      date: dateStr,
      minutes: record?.minutes || 0,
      sessions: record?.sessions || 0,
    }
  })

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return 'bg-neutral-900 border border-neutral-800/60'
    if (minutes < 15) return 'bg-emerald-950 border border-emerald-900 text-emerald-300'
    if (minutes < 30) return 'bg-emerald-800 border border-emerald-700 text-emerald-200'
    if (minutes < 60) return 'bg-emerald-600 border border-emerald-500 text-emerald-100'
    return 'bg-emerald-400 border border-emerald-300 text-neutral-950'
  }

  return (
    <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-200">Practice Activity</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Session frequency and intensity over the past 16 weeks</p>
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

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
          {days.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.minutes} mins (${day.sessions} sessions)`}
              className={`w-3 h-3 rounded-[2px] cursor-pointer transition-colors ${getIntensityClass(day.minutes)}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}