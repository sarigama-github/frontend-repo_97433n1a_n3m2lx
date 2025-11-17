import { useEffect, useMemo, useState } from 'react'

// Lightweight SVG charts for dark UI: no external deps
export default function Analytics(){
  const [currency, setCurrency] = useState('EUR')
  const [series, setSeries] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async (cur = currency) => {
    setLoading(true)
    try {
      const [tsRes, sumRes] = await Promise.all([
        fetch(`${baseUrl}/trends/timeseries?currency=${encodeURIComponent(cur)}&days=60`),
        fetch(`${baseUrl}/portfolio/summary?currency=${encodeURIComponent(cur)}`)
      ])
      const ts = await tsRes.json()
      const sm = await sumRes.json()
      setSeries(ts.series || [])
      setSummary(sm)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  const pnlSeries = useMemo(()=>{
    if (!series || !summary) return []
    const cost = Number(summary.total_cost || 0)
    return series.map(p => ({ date: p.date, value: Number(p.value || 0) - cost }))
  }, [series, summary])

  const currencies = ['EUR','USD','GBP','JPY','BTC','ETH']

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-header">Grafici</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Valuta</span>
          <select className="select" value={currency} onChange={(e)=>{setCurrency(e.target.value); load(e.target.value)}}>
            {currencies.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Caricamento grafici…</p>}

      {!loading && (
        <div className="grid grid-cols-1 gap-6">
          <ChartCard title={`Valore Portafoglio (${currency})`} subtitle="Ultimi 60 giorni">
            <AreaLineChart data={series} stroke="#34d399" fill="rgba(52,211,153,0.15)" />
          </ChartCard>

          <ChartCard title={`P&L Non Realizzato (${currency})`} subtitle="Valore - Costo totale">
            <AreaLineChart data={pnlSeries} stroke="#60a5fa" fill="rgba(96,165,250,0.15)" zeroLine />
          </ChartCard>
        </div>
      )}
    </div>
  )
}

function ChartCard({ title, subtitle, children }){
  return (
    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
      <div className="mb-3">
        <p className="text-slate-200 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function AreaLineChart({ data, width = 800, height = 220, padding = 28, stroke = '#34d399', fill = 'rgba(52,211,153,0.2)', zeroLine = false }){
  const w = width
  const h = height
  const pad = padding

  const points = (data || []).map((d, i) => ({
    x: i,
    y: Number(d.value || 0),
    label: d.date
  }))

  if (!points.length) return <div className="h-[220px] flex items-center justify-center text-slate-500">Nessun dato</div>

  const xMax = points.length - 1
  const yVals = points.map(p=>p.y)
  const yMin = Math.min(...yVals, zeroLine ? 0 : Infinity)
  const yMax = Math.max(...yVals, zeroLine ? 0 : -Infinity)
  const yRange = yMax - yMin || 1

  const sx = (i) => pad + (i / (xMax || 1)) * (w - pad * 2)
  const sy = (v) => h - pad - ((v - yMin) / yRange) * (h - pad * 2)

  const path = points.map((p, idx) => `${idx===0 ? 'M' : 'L'} ${sx(p.x)},${sy(p.y)}`).join(' ')
  const area = `M ${sx(points[0].x)},${sy(points[0].y)} ${points.slice(1).map(p=>`L ${sx(p.x)},${sy(p.y)}`).join(' ')} L ${sx(points[points.length-1].x)},${sy(yMin)} L ${sx(points[0].x)},${sy(yMin)} Z`

  // grid and ticks
  const yTicks = 4
  const grid = Array.from({length: yTicks+1}).map((_,i)=>{
    const t = yMin + (i / yTicks) * yRange
    return { y: sy(t), v: t }
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px]">
      {/* background */}
      <rect x="0" y="0" width={w} height={h} fill="transparent" />

      {/* grid */}
      {grid.map((g, idx)=> (
        <g key={idx}>
          <line x1={pad} x2={w-pad} y1={g.y} y2={g.y} stroke="#0f172a" strokeWidth="1" />
          <text x={w-pad+4} y={g.y+4} fontSize="10" fill="#64748b">
            {formatNumber(g.v)}
          </text>
        </g>
      ))}

      {/* zero line */}
      {zeroLine && sy(0) >= pad && sy(0) <= h-pad && (
        <line x1={pad} x2={w-pad} y1={sy(0)} y2={sy(0)} stroke="#334155" strokeDasharray="4 4" />
      )}

      {/* area fill */}
      <path d={area} fill={fill} stroke="none" />

      {/* line */}
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" />

      {/* end dot */}
      {points.length>0 && (
        <circle cx={sx(points[points.length-1].x)} cy={sy(points[points.length-1].y)} r="3" fill={stroke} />
      )}
    </svg>
  )
}

function formatNumber(n){
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n/1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${(n/1_000).toFixed(2)}k`
  return new Intl.NumberFormat('en', {maximumFractionDigits: 2}).format(n)
}
