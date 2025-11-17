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
    <div className="bg-white rounded-lg border p-4">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca carta o prodotto" className="flex-1 border rounded px-3 py-2" />
        <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? '...' : 'Cerca'}</button>
      </div>
      <div className="mt-3 space-y-2 max-h-64 overflow-auto">
        {items.map(it=> (
          <div key={it._id} className="flex items-center justify-between border rounded p-2">
            <div>
              <p className="font-medium">{it.name}</p>
              <p className="text-xs text-gray-500">{it.set_name} • {it.number} • {it.category}</p>
            </div>
            <button onClick={()=>addQuick(it)} className="px-3 py-1 text-sm bg-emerald-600 text-white rounded">Aggiungi</button>
          </div>
        ))}
        {(!items || items.length===0) && (
          <p className="text-sm text-gray-500">Nessun risultato. Prova a creare un elemento nel catalogo.</p>
        )}
      </div>
    </div>
  )
}
