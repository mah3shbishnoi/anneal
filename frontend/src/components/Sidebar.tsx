import { LayoutDashboard, PlayCircle, BarChart3, History, Settings } from 'lucide-react'

// navigation sidebar component
export function Sidebar({ activeTab, onSelectTab }: { activeTab: string; onSelectTab: (tab: string) => void }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'practice', label: 'Practice', icon: PlayCircle },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-56 border-r border-neutral-800 bg-neutral-950 flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="font-semibold text-sm tracking-tight text-neutral-100">Anneal</span>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${active
                    ? 'bg-neutral-900 text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}