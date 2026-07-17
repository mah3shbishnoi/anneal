import { useMemo } from 'react'

interface DayActivity {
  date: string
  minutes: number
  sessions: number
}

export function ActivityGraph({ activity = [] }: { activity?: DayActivity[] }) {
  const currentYear = 2026

  const { weeks, monthLabels, totalSessions } = useMemo(() => {
    const activityMap = new Map(activity.map((a) => [a.date, a]))
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)

    const dayCells: ({ date: string; minutes: number; sessions: number; isCurrentYear: boolean } | null)[] = []

    const startDayOfWeek = (startDate.getDay() + 6) % 7
    for (let i = 0; i < startDayOfWeek; i++) {
      dayCells.push(null)
    }

    const cur = new Date(startDate)
    let sumSessions = 0

    while (cur <= endDate) {
      const dateStr = cur.toISOString().split('T')[0]
      const rec = activityMap.get(dateStr)
      const sessions = rec?.sessions || 0
      sumSessions += sessions
      dayCells.push({
        date: dateStr,
        minutes: rec?.minutes || 0,
        sessions,
        isCurrentYear: true,
      })
      cur.setDate(cur.getDate() + 1)
    }

    while (dayCells.length % 7 !== 0) {
      dayCells.push(null)
    }

    const weekCols: (typeof dayCells)[] = []
    for (let i = 0; i < dayCells.length; i += 7) {
      weekCols.push(dayCells.slice(i, i + 7))
    }

    const months: { label: string; col: number }[] = []
    let lastM = -1

    weekCols.forEach((week, colIdx) => {
      const validDay = week.find((d) => d !== null)
      if (validDay) {
        const m = new Date(validDay.date).getMonth()
        if (m !== lastM) {
          months.push({
            label: new Date(validDay.date).toLocaleString('en-US', { month: 'short' }),
            col: colIdx,
          })
          lastM = m
        }
      }
    })

    return { weeks: weekCols, monthLabels: months, totalSessions: sumSessions }
  }, [activity, currentYear])

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return 'bg-neutral-900 border border-neutral-800/60'
    if (minutes < 15) return 'bg-emerald-950 border border-emerald-900 text-emerald-300'
    if (minutes < 30) return 'bg-emerald-800 border border-emerald-700 text-emerald-200'
    if (minutes < 60) return 'bg-emerald-600 border border-emerald-500 text-emerald-100'
    return 'bg-emerald-400 border border-emerald-300 text-neutral-950'
  }

  return (
    <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-5 space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-neutral-200">Practice Activity</h2>
            <span className="text-xs text-neutral-500">&bull;</span>
            <span className="text-xs text-neutral-400 font-mono">{totalSessions} sessions in {currentYear}</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">Jan &ndash; Dec {currentYear} interview frequency and intensity distribution</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded border border-neutral-800 bg-neutral-950 text-[10px] font-medium text-neutral-300">
            {currentYear}
          </span>

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
        <div className="min-w-[760px] space-y-1.5">
          <div
            className="grid text-[10px] text-neutral-500 font-mono pl-6"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)`, columnGap: '3px' }}
          >
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.col}`}
                style={{ gridColumnStart: m.col + 1 }}
                className="whitespace-nowrap"
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[9px] text-neutral-500 font-mono h-[95px] py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div
              className="grid grid-rows-7 grid-flow-col gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }}
            >
              {weeks.flatMap((week, wIdx) =>
                week.map((day, dIdx) =>
                  day ? (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.minutes} min practice (${day.sessions} sessions)`}
                      className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-colors ${getIntensityClass(day.minutes)}`}
                    />
                  ) : (
                    <div
                      key={`empty-${wIdx}-${dIdx}`}
                      className="w-[11px] h-[11px] rounded-[2px] opacity-0"
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}