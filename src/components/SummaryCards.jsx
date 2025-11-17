import { useEffect, useState } from 'react'

export default function SummaryCards() {
  const [summary, setSummary] = useState(null)
  const [currency, setCurrency] = useState('EUR')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async (cur = currency) => {
    try {
      const res = await fetch(`${baseUrl}/portfolio/summary?currency=${encodeURIComponent(cur)}`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const currencies = ['EUR','USD','GBP','JPY','BTC','ETH']

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={currency}
          onChange={(e)=>{setCurrency(e.target.value); load(e.target.value)}}
        >
          {currencies.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title={`Total Value (${currency})`} value={summary ? fmt(summary.total_value, currency) : '...'} trend={summary ? summary.unrealized_pnl : null} />
        <Card title={`Total Cost (${currency})`} value={summary ? fmt(summary.total_cost, currency) : '...'} />
        <Card title={`Unrealized P&L (${currency})`} value={summary ? fmt(summary.unrealized_pnl, currency) : '...'} highlight />
      </div>
    </div>
  )
}

function Card({ title, value, highlight }){
  return (
    <div className={`p-4 rounded-lg border bg-white ${highlight ? 'border-emerald-300' : 'border-gray-200'}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${highlight ? 'text-emerald-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  )
}

function fmt(n, currency){
  if (n == null) return '—'
  const isCrypto = ['BTC','ETH'].includes(currency)
  const digits = isCrypto ? 6 : 2
  return new Intl.NumberFormat('en', {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(n)
}
