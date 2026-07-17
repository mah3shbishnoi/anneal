import { CheckCircle2, ArrowRight, Award, AlertCircle, RotateCcw } from 'lucide-react'

interface InterviewResultsProps {
  topic: string
  difficulty: string
  score?: number
  onReturnToDashboard: () => void
  onRetry: () => void
}

export function InterviewResults({
  topic,
  difficulty,
  score = 88,
  onReturnToDashboard,
  onRetry,
}: InterviewResultsProps) {
  const dimensions = [
    { label: 'Technical Correctness', score: 90 },
    { label: 'Completeness', score: 85 },
    { label: 'Relevance & Precision', score: 92 },
    { label: 'Communication Clarity', score: 84 },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider">Evaluation Report</span>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-100 mt-0.5">Interview Summary</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded border border-neutral-800 bg-neutral-900/60 text-xs font-medium text-neutral-300 capitalize">
            {topic}
          </span>
          <span className="text-xs text-neutral-500 capitalize">{difficulty}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Overall Performance</span>
            <Award className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-semibold text-neutral-100 tracking-tight">{score}%</div>
          <p className="text-[11px] text-neutral-400">Exceeded baseline expectations for {difficulty} tier.</p>
        </div>

        <div className="md:col-span-2 p-5 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur space-y-3">
          <span className="text-xs font-medium text-neutral-300">Dimension Scores</span>
          <div className="space-y-2.5">
            {dimensions.map((dim) => (
              <div key={dim.label} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">{dim.label}</span>
                  <span className="font-mono text-neutral-200">{dim.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-neutral-200 rounded-full"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demonstrated Strengths</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Clear explanation of runtime primitives, memory lifecycle constraints, and concurrency implications.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>Target Improvement</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Provide more structured edge-case coverage and discuss operational profiling tools earlier in the response.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Again</span>
        </button>

        <button
          onClick={onReturnToDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-xs font-medium hover:bg-neutral-200 transition-colors"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}