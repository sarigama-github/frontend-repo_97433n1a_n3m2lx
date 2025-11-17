import { useEffect, useState } from 'react'

export default function CatalogSearch({ onAdd }){
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const search = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/catalog/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const addQuick = async (it) => {
    const payload = {
      catalog_id: it._id,
      category: it.category,
      name: it.name,
      set_name: it.set_name,
      number: it.number,
      variant: it.variant,
      quantity: 1,
      purchase_price: 0,
      currency: 'EUR'
    }
    const res = await fetch(`${baseUrl}/collection`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    const _ = await res.json()
    if (onAdd) onAdd()
  }

  return (
    <div className="card p-4">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca carta o prodotto" className="input flex-1" />
        <button onClick={search} className="btn btn-primary">{loading? '...' : 'Cerca'}</button>
      </div>
      <div className="mt-3 space-y-2 max-h-64 overflow-auto">
        {items.map(it=> (
          <div key={it._id} className="flex items-center justify-between p-2 rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3">
              {it.image_url ? (
                <img src={it.image_url} alt={it.name} className="w-12 h-16 object-cover rounded-md border border-slate-800" />
              ) : (
                <div className="w-12 h-16 rounded-md border border-slate-800 bg-slate-950/50 flex items-center justify-center text-slate-600 text-xs">no img</div>
              )}
              <div>
                <p className="font-medium text-slate-100">{it.name}</p>
                <p className="text-xs text-slate-400">{it.set_name} • {it.number} • {it.category}</p>
              </div>
            </div>
            <button onClick={()=>addQuick(it)} className="btn btn-secondary">Aggiungi</button>
          </div>
        ))}
        {(!items || items.length===0) && (
          <p className="text-sm text-slate-500">Nessun risultato. Prova a creare un elemento nel catalogo.</p>
        )}
      </div>
    </div>
  )
}
