import { useState, useEffect } from 'react'
import { Mic, MicOff, Camera, CameraOff, Clock, Square, Send, Loader2, CheckCircle2 } from 'lucide-react'

interface ActiveInterviewProps {
  sessionId: string
  topic: string
  difficulty: string
  durationMinutes?: number
  onComplete: (score: number, questionsAnswered: number) => void
  onExit: () => void
}

export function ActiveInterview({
  sessionId,
  topic,
  difficulty,
  durationMinutes = 20,
  onComplete,
  onExit,
}: ActiveInterviewProps) {
  const [elapsed, setElapsed] = useState(0)
  const [micActive, setMicActive] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [answer, setAnswer] = useState('')
  const [questionIndex, setQuestionIndex] = useState(1)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)

  const totalSeconds = durationMinutes * 60
  const remainingSeconds = Math.max(0, totalSeconds - elapsed)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleNextQuestion = () => {
    if (!answer.trim()) return
    setAnsweredCount((prev) => prev + 1)
    setQuestionIndex((prev) => prev + 1)
    setAnswer('')
  }

  const handleFinishSession = async () => {
    setIsFinishing(true)
    const finalAnswered = answer.trim() ? answeredCount + 1 : answeredCount
    const calculatedScore = Math.min(95, Math.max(65, 70 + finalAnswered * 5))
    try {
      await fetch(`http://127.0.0.1:8000/api/interviews/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: calculatedScore }),
      })
    } catch {
      // offline fallback
    } finally {
      setIsFinishing(false)
      onComplete(calculatedScore, finalAnswered)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded border border-neutral-800 bg-neutral-900/60 text-xs font-medium text-neutral-300 capitalize">
            {topic}
          </span>
          <span className="text-xs text-neutral-500 capitalize">{difficulty}</span>
          <span className="text-xs text-neutral-600">&bull;</span>
          <span className="text-xs text-neutral-400 font-mono">{answeredCount} answered</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className={remainingSeconds < 120 ? 'text-amber-400' : ''}>
              {formatTime(remainingSeconds)} remaining
            </span>
          </div>

          <button
            onClick={handleFinishSession}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-300 hover:text-neutral-100 text-xs font-medium transition-colors"
          >
            {isFinishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            <span>Finish Interview</span>
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-800 hover:border-red-900/50 text-neutral-500 hover:text-red-400 text-xs transition-colors"
          >
            <Square className="w-3 h-3" />
            <span>Abandon</span>
          </button>
        </div>
      </div>

      <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-6 space-y-3">
        <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Question #{questionIndex}
        </div>
        <h2 className="text-base font-semibold text-neutral-100 leading-snug">
          Explain how memory management and garbage collection function in this runtime, and describe how circular references are resolved.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-neutral-300">AV Hardware State</div>
            <p className="text-[11px] text-neutral-400">Toggle media devices during responses.</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`w-full flex items-center justify-between p-2.5 rounded border text-xs font-medium transition-colors ${
                micActive
                  ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
                  : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>Microphone</span>
              </div>
              <span className="text-[10px]">{micActive ? 'Active' : 'Muted'}</span>
            </button>

            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`w-full flex items-center justify-between p-2.5 rounded border text-xs font-medium transition-colors ${
                cameraActive
                  ? 'border-neutral-500 bg-neutral-800 text-neutral-200'
                  : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                <span>Video Preview</span>
              </div>
              <span className="text-[10px]">{cameraActive ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 border border-neutral-800/80 bg-neutral-900/40 backdrop-blur rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">Candidate Response</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Synthesize your response here or speak using the microphone..."
              rows={6}
              className="w-full bg-neutral-950/80 border border-neutral-800/80 rounded-md p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 resize-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleNextQuestion}
              disabled={!answer.trim() || isFinishing}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Submit & Next Question</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}