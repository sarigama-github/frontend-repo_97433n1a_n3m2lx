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
        <h2 className="text-xl font-semibold text-slate-100">Portfolio</h2>
        <select
          className="select"
          value={currency}
          onChange={(e)=>{setCurrency(e.target.value); load(e.target.value)}}
        >
          {currencies.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title={`Total Value (${currency})`} value={summary ? fmt(summary.total_value, currency) : '...'} highlight />
        <Card title={`Total Cost (${currency})`} value={summary ? fmt(summary.total_cost, currency) : '...'} />
        <Card title={`Unrealized P&L (${currency})`} value={summary ? fmt(summary.unrealized_pnl, currency) : '...'} accent={summary && summary.unrealized_pnl >= 0 ? 'up' : 'down'} />
      </div>
    </div>
  )
}

function Card({ title, value, highlight, accent }){
  const accentCls = accent === 'up' ? 'text-emerald-400' : accent === 'down' ? 'text-rose-400' : 'text-slate-200'
  return (
    <div className={`card p-4 ${highlight ? 'border-emerald-700/50' : ''}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${accentCls}`}>{value}</p>
    </div>
  )
}

function fmt(n, currency){
  if (n == null) return '—'
  const isCrypto = ['BTC','ETH'].includes(currency)
  const digits = isCrypto ? 6 : 2
  return new Intl.NumberFormat('en', {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(n)
}
