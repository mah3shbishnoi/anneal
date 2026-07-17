import { useMemo, useState } from 'react'

interface DayActivity {
  date: string
  minutes: number
  sessions: number
}

interface ActivityGraphProps {
  activity?: DayActivity[]
  joinYear?: number
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CELL = 11  // px
const GAP = 3    // px between cells

// Safe local-timezone date string: avoids toISOString() UTC shift bug
function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getIntensityClass(minutes: number) {
  if (minutes === 0) return 'bg-neutral-900 border border-neutral-800/60'
  if (minutes < 15) return 'bg-emerald-950 border border-emerald-900'
  if (minutes < 30) return 'bg-emerald-800 border border-emerald-700'
  if (minutes < 60) return 'bg-emerald-600 border border-emerald-500'
  return 'bg-emerald-400 border border-emerald-300'
}

type Cell = { date: string; minutes: number; sessions: number } | null
type WeekCol = Cell[]

// Build columns (7-row each) for a single calendar month
function buildMonthCols(
  year: number,
  month: number, // 0-indexed
  activityMap: Map<string, DayActivity>
): WeekCol[] {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow = (firstDay.getDay() + 6) % 7 // Mon=0 … Sun=6

  const cells: Cell[] = []

  // Leading empty slots so the first day lands on the right weekday row
  for (let i = 0; i < startDow; i++) cells.push(null)

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = localDateStr(new Date(year, month, d))
    const rec = activityMap.get(dateStr)
    cells.push({
      date: dateStr,
      minutes: rec?.minutes ?? 0,
      sessions: rec?.sessions ?? 0,
    })
  }

  // Trailing empty slots to complete the last week column
  while (cells.length % 7 !== 0) cells.push(null)

  // Split into columns of 7
  const cols: WeekCol[] = []
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7))

  return cols
}

// ── Sub-component: one month's mini grid ─────────────────────────────────────

function MonthBlock({ label, cols }: { label: string; cols: WeekCol[] }) {
  const blockW = cols.length * (CELL + GAP) - GAP

  return (
    <div className="flex flex-col gap-1.5" style={{ width: blockW }}>
      {/* Month name */}
      <span className="text-[10px] text-neutral-500 font-mono">{label}</span>

      {/* Cell grid: 7 rows, N columns */}
      <div
        className="grid grid-rows-7 grid-flow-col"
        style={{
          gridTemplateColumns: `repeat(${cols.length}, ${CELL}px)`,
          gap: `${GAP}px`,
        }}
      >
        {cols.flatMap((col, ci) =>
          col.map((day, di) =>
            day ? (
              <div
                key={day.date}
                title={`${day.date}: ${day.minutes} min · ${day.sessions} sessions`}
                className={`rounded-[2px] cursor-pointer transition-colors ${getIntensityClass(day.minutes)}`}
                style={{ width: CELL, height: CELL }}
              />
            ) : (
              <div
                key={`e-${ci}-${di}`}
                style={{ width: CELL, height: CELL }}
                className="rounded-[2px] opacity-0"
              />
            )
          )
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ActivityGraph({ activity = [], joinYear = 2026 }: ActivityGraphProps) {
  const thisYear = new Date().getFullYear()
  const startYear = Math.min(joinYear, thisYear)

  const [selectedYear, setSelectedYear] = useState(thisYear)

  const years: number[] = []
  for (let y = startYear; y <= thisYear; y++) years.push(y)

  const { monthBlocks, totalSessions, totalMinutes } = useMemo(() => {
    const activityMap = new Map(activity.map((a) => [a.date, a]))

    let sumSessions = 0
    let sumMinutes = 0

    const monthBlocks = MONTH_NAMES.map((label, m) => {
      const cols = buildMonthCols(selectedYear, m, activityMap)

      // Accumulate totals
      cols.flat().forEach((cell) => {
        if (cell) {
          sumSessions += cell.sessions
          sumMinutes += cell.minutes
        }
      })

      return { label, cols }
    })

    return { monthBlocks, totalSessions: sumSessions, totalMinutes: sumMinutes }
  }, [activity, selectedYear])

  const gridHeight = 7 * (CELL + GAP) - GAP // exact height of cell grid

  return (
    <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-5 space-y-4 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-neutral-200">Practice Activity</h2>
            <span className="text-xs text-neutral-500">&bull;</span>
            <span className="text-xs text-neutral-400 font-mono">
              {totalSessions} sessions · {Math.round(totalMinutes / 60)}h in {selectedYear}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Jan – Dec {selectedYear} · interview frequency and intensity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year tabs */}
          <div className="flex items-center gap-1">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                  y === selectedYear
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Graph */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 items-start">
          {/* Day-of-week labels */}
          <div
            className="flex flex-col justify-between text-[9px] text-neutral-500 font-mono shrink-0 pr-1.5"
            style={{ height: `${gridHeight + 18}px`, paddingTop: '18px' }}
          >
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 12 month blocks with gap between each */}
          <div className="flex gap-2.5 items-start">
            {monthBlocks.map(({ label, cols }) => (
              <MonthBlock key={label} label={label} cols={cols} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}