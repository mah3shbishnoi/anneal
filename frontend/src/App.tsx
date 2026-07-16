import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './features/dashboard/Dashboard'
import { InterviewSetup, type InterviewConfig } from './features/interview/InterviewSetup'
import { ActiveInterview } from './features/interview/ActiveInterview'

interface ActiveSession {
  id: string
  topic: string
  difficulty: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [session, setSession] = useState<ActiveSession | null>(null)

  const handleStartInterview = async (config: InterviewConfig) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: config.topic,
          difficulty: config.difficulty,
          question_count: config.questionCount,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSession(data)
      }
    } catch {
      setSession({
        id: 'local-session',
        topic: config.topic,
        difficulty: config.difficulty,
      })
    }
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans antialiased overflow-hidden selection:bg-neutral-800">
      <Sidebar activeTab={activeTab} onSelectTab={(tab) => { setSession(null); setActiveTab(tab) }} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={session ? 'Interview in progress' : activeTab} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <Dashboard onStartInterview={() => setActiveTab('practice')} />
          ) : activeTab === 'practice' ? (
            !session ? (
              <InterviewSetup onStart={handleStartInterview} />
            ) : (
              <ActiveInterview
                sessionId={session.id}
                topic={session.topic}
                difficulty={session.difficulty}
                onComplete={() => setSession(null)}
                onExit={() => setSession(null)}
              />
            )
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