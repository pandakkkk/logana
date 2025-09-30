import React from 'react'
import LogStream from './components/LogStream'
import AnalyticsChart from './components/AnalyticsChart'

function App() {
  // Example chart data
  const data = [
    { timestamp: "2025-09-30", count: 5 },
    { timestamp: "2025-10-01", count: 8 },
  ]
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="font-bold text-3xl mb-8">Logana Dashboard</h1>
      <LogStream />
      <div className="mt-8">
        <AnalyticsChart data={data} />
      </div>
    </div>
  )
}

export default App
