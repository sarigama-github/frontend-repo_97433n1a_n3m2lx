import { useEffect, useState } from 'react'

export default function Holdings(){
  const [items, setItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/collection`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Collezione</h3>
        <button onClick={load} className="text-sm px-3 py-1 rounded border">Aggiorna</button>
      </div>
      <div className="divide-y">
        {items.map(h => (
          <div key={h._id} className="py-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{h.name}</p>
              <p className="text-xs text-gray-500">{h.set_name} • {h.number} • {h.category} • Qty {h.quantity}</p>
            </div>
            <span className="text-xs text-gray-600">{h.currency} {Number(h.purchase_price||0).toFixed(2)}</span>
          </div>
        ))}
        {items.length===0 && <p className="text-sm text-gray-500">Nessun elemento in collezione.</p>}
      </div>
    </div>
  )
}
