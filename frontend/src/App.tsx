import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './features/dashboard/Dashboard'
import { InterviewSetup, type InterviewConfig } from './features/interview/InterviewSetup'
import { ActiveInterview } from './features/interview/ActiveInterview'
import { InterviewResults } from './features/interview/InterviewResults'

interface ActiveSession {
  id: string
  topic: string
  difficulty: string
  status: 'in_progress' | 'completed'
  score?: number
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
        setSession({ ...data, status: 'in_progress' })
      }
    } catch {
      setSession({
        id: 'local-session',
        topic: config.topic,
        difficulty: config.difficulty,
        status: 'in_progress',
      })
    }
  }

  const getHeaderTitle = () => {
    if (session?.status === 'in_progress') return 'Interview in progress'
    if (session?.status === 'completed') return 'Evaluation report'
    return activeTab
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans antialiased overflow-hidden selection:bg-neutral-800">
      <Sidebar activeTab={activeTab} onSelectTab={(tab) => { setSession(null); setActiveTab(tab) }} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={getHeaderTitle()} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <Dashboard onStartInterview={() => setActiveTab('practice')} />
          ) : activeTab === 'practice' ? (
            !session ? (
              <InterviewSetup onStart={handleStartInterview} />
            ) : session.status === 'in_progress' ? (
              <ActiveInterview
                sessionId={session.id}
                topic={session.topic}
                difficulty={session.difficulty}
                onComplete={() => setSession({ ...session, status: 'completed', score: 88 })}
                onExit={() => setSession(null)}
              />
            ) : (
              <InterviewResults
                topic={session.topic}
                difficulty={session.difficulty}
                score={session.score}
                onReturnToDashboard={() => { setSession(null); setActiveTab('dashboard') }}
                onRetry={() => setSession(null)}
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