// root application component
function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 selection:bg-neutral-800">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900/60 backdrop-blur-md rounded-lg p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-100">Anneal</h1>
          <p className="text-xs text-neutral-400">Train yourself like you train a model.</p>
        </div>
        <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded text-xs text-neutral-400 font-mono">
          system ready &middot; local-first
        </div>
      </div>
    </div>
  )
}
export default App