import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './features/dashboard/Dashboard'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans antialiased overflow-hidden selection:bg-neutral-800">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={activeTab} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <Dashboard onStartInterview={() => setActiveTab('practice')} />
          ) : (
            <div className="max-w-5xl mx-auto border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-6">
              <h2 className="text-base font-medium text-neutral-100 capitalize">{activeTab}</h2>
              <p className="text-xs text-neutral-400 mt-1">Section ready for configuration.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}