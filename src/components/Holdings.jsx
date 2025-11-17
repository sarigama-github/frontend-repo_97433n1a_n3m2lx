import { useEffect, useState } from 'react'

export default function Holdings(){
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({quantity:1, purchase_price:0, currency:'EUR', grade:''})
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/collection`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      quantity: item.quantity || 1,
      purchase_price: item.purchase_price || 0,
      currency: item.currency || 'EUR',
      grade: item.grade || '',
      purchase_date: item.purchase_date || ''
    })
  }

  const save = async () => {
    if (!editing) return
    const payload = { ...form }
    const res = await fetch(`${baseUrl}/collection/${editing._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    await res.json()
    setEditing(null)
    await load()
  }

  const fmtPrice = (h) => `${h.currency||'EUR'} ${Number(h.purchase_price||0).toFixed(2)}`

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-header">Collezione</h3>
        <button onClick={load} className="btn btn-secondary">Aggiorna</button>
      </div>
      <div className="divide-y divide-slate-800">
        {items.map(h => (
          <div key={h._id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {h.image_url ? (
                <img src={h.image_url} alt={h.name} className="w-12 h-16 object-cover rounded-md border border-slate-800" />
              ) : (
                <div className="w-12 h-16 rounded-md border border-slate-800 bg-slate-950/50 flex items-center justify-center text-slate-600 text-xs">no img</div>
              )}
              <div>
                <p className="font-medium text-slate-100">{h.name}</p>
                <p className="text-xs text-slate-400">{h.set_name} • {h.number} • {h.category} • Qty {h.quantity} {h.grade ? `• ${h.grade}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">{fmtPrice(h)}</span>
              <button className="btn btn-secondary" onClick={()=>openEdit(h)}>Modifica</button>
            </div>
          </div>
        ))}
        {items.length===0 && <p className="text-sm text-slate-500">Nessun elemento in collezione.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 animate-in">
          <div className="card w-full max-w-md p-4">
            <h4 className="card-header mb-3">Modifica</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Quantità</label>
                <input type="number" className="input w-full" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity: Number(e.target.value)}))} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400">Prezzo d'acquisto</label>
                  <input type="number" className="input w-full" value={form.purchase_price} onChange={e=>setForm(f=>({...f, purchase_price: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Valuta</label>
                  <select className="select w-full" value={form.currency} onChange={e=>setForm(f=>({...f, currency: e.target.value}))}>
                    {['EUR','USD','GBP','JPY','BTC','ETH'].map(c=> <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Grado (es. PSA 10, BGS 9.5)</label>
                <input className="input w-full" value={form.grade} onChange={e=>setForm(f=>({...f, grade: e.target.value}))} placeholder="PSA 10 / BGS 9.5 / Raw NM" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Data acquisto</label>
                <input type="date" className="input w-full" value={form.purchase_date||''} onChange={e=>setForm(f=>({...f, purchase_date: e.target.value}))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={()=>setEditing(null)}>Annulla</button>
              <button className="btn btn-primary" onClick={save}>Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
