import { useEffect, useState } from 'react'
import SummaryCards from './components/SummaryCards'
import CatalogSearch from './components/CatalogSearch'
import Holdings from './components/Holdings'
import AddMockData from './components/AddMockData'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(k=>k+1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      <header className="px-6 py-4 border-b bg-white/70 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">GetCollectr • One Piece TCG Portfolio</h1>
          <a href="/test" className="text-sm text-blue-700 underline">Test backend</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <SummaryCards key={`sum-${refreshKey}`} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CatalogSearch onAdd={refresh} />
            <Holdings key={`hold-${refreshKey}`} />
          </div>
          <div className="space-y-6">
            <AddMockData onDone={refresh} />
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Trend & Analytics</h3>
              <p className="text-sm text-gray-600">La versione demo mostra KPI principali. Possiamo estendere con grafici P&L, Biggest Movers e serie storiche in tempo reale.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
