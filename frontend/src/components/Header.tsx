import { ShieldCheck, User } from 'lucide-react'

export function Header({ title }: { title: string }) {
  return (
    <header className="h-12 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">workspace</span>
        <span className="text-neutral-600 text-xs">/</span>
        <span className="text-xs font-medium text-neutral-200 capitalize">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-7 h-7 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center text-neutral-300 hover:border-neutral-700 transition-colors">
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}