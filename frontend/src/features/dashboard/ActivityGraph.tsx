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
const CELL = 10
const GAP = 3

function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getIntensityClass(sessions: number, minutes: number) {
  if (sessions === 0 && minutes === 0) return 'bg-neutral-900 border border-neutral-800/60'
  if (sessions === 1 || minutes < 15) return 'bg-emerald-800 border border-emerald-700'
  if (sessions === 2 || minutes < 30) return 'bg-emerald-600 border border-emerald-500'
  if (sessions === 3 || minutes < 60) return 'bg-emerald-500 border border-emerald-400'
  return 'bg-emerald-400 border border-emerald-300'
}

type Cell = { date: string; minutes: number; sessions: number } | null
type WeekCol = Cell[]

// Build columns (7 rows each: Mon..Sun) for a single calendar month
function buildMonthCols(
  year: number,
  month: number, // 0-indexed
  activityMap: Map<string, DayActivity>
): WeekCol[] {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Mon = 0 ... Sun = 6
  const startDow = (firstDay.getDay() + 6) % 7

  const cells: Cell[] = []

  // Leading empty slots so the 1st of the month lands on its exact weekday
  for (let i = 0; i < startDow; i++) cells.push(null)

  // Actual days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = localDateStr(new Date(year, month, d))
    const rec = activityMap.get(dateStr)
    cells.push({
      date: dateStr,
      minutes: rec?.minutes ?? 0,
      sessions: rec?.sessions ?? 0,
    })
  }

  // Trailing empty slots to complete the final column
  while (cells.length % 7 !== 0) cells.push(null)

  // Split into columns of 7
  const cols: WeekCol[] = []
  for (let i = 0; i < cells.length; i += 7) {
    cols.push(cells.slice(i, i + 7))
  }

  return cols
}

// ── Sub-component: LeetCode-style Month Block ──────────────────────────────────

function MonthBlock({ label, cols }: { label: string; cols: WeekCol[] }) {
  const blockW = cols.length * (CELL + GAP) - GAP

  return (
    <div className="flex flex-col gap-1.5 shrink-0" style={{ width: `${blockW}px` }}>
      <span className="text-[10px] text-neutral-400 font-mono font-medium text-center w-full">{label}</span>
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
                className={`rounded-[2px] cursor-pointer transition-colors ${getIntensityClass(day.sessions, day.minutes)}`}
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

// ── Main ActivityGraph Component ──────────────────────────────────────────────

export function ActivityGraph({ activity = [], joinYear = 2026 }: ActivityGraphProps) {
  const thisYear = new Date().getFullYear()
  const startYear = Math.min(joinYear, thisYear)

  const [selectedYear, setSelectedYear] = useState(thisYear)

  // Descending year list (newest first, like GitHub)
  const years: number[] = []
  for (let y = thisYear; y >= startYear; y--) years.push(y)

  const { monthBlocks, totalSessions, totalMinutes } = useMemo(() => {
    const activityMap = new Map(activity.map((a) => [a.date, a]))

    let sumSessions = 0
    let sumMinutes = 0

    const monthBlocks = MONTH_NAMES.map((label, m) => {
      const cols = buildMonthCols(selectedYear, m, activityMap)

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

  const gridHeight = 7 * (CELL + GAP) - GAP

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start select-none">
      {/* Main Chart Card */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-neutral-200">Practice Activity</h2>
          <span className="text-xs text-neutral-500">&bull;</span>
          <span className="text-xs text-neutral-400 font-mono">
            {totalSessions} sessions · {Math.round(totalMinutes / 60)}h in {selectedYear}
          </span>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 items-start w-full">
            {/* Day-of-week labels precisely aligned with Mon (row 0), Wed (row 2), Fri (row 4) */}
            <div
              className="relative text-[9px] text-neutral-500 font-mono shrink-0 select-none"
              style={{ width: '22px', height: `${gridHeight}px`, marginTop: '21px' }}
            >
              <span className="absolute" style={{ top: '0px' }}>Mon</span>
              <span className="absolute" style={{ top: `${2 * (CELL + GAP)}px` }}>Wed</span>
              <span className="absolute" style={{ top: `${4 * (CELL + GAP)}px` }}>Fri</span>
            </div>

            {/* 12 LeetCode-style month blocks evenly distributed across the entire card width */}
            <div className="flex justify-between items-start flex-1 min-w-0">
              {monthBlocks.map(({ label, cols }) => (
                <MonthBlock key={label} label={label} cols={cols} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style vertical year buttons */}
      <div className="flex md:flex-col gap-1 w-full md:w-20 shrink-0 md:pt-7">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-center ${
              y === selectedYear
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}