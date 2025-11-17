import { useState } from 'react'

export default function AddMockData({ onDone }){
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const seed = async () => {
    setLoading(true)
    try {
      // Create a couple of catalog items
      const cats = [
        {category:'card_raw', name:'Monkey D. Luffy (Alt Art)', set_name:'OP01 Romance Dawn', number:'P-001', variant:'Alt Art', image_url:'https://images.pokemontcg.io/sv2/245_hires.png'},
        {category:'sealed', name:'One Piece TCG Booster Box', set_name:'OP05 Awakening of the New Era', number:'BOX-OP05', image_url:'https://product-images.tcgplayer.com/fit-in/437x437/268517.jpg'},
      ]
      for (const c of cats){
        await fetch(`${baseUrl}/catalog`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(c)})
      }
      // Query back for ids
      const search = await fetch(`${baseUrl}/catalog/search?q=OP`)
      const items = await search.json()
      const luffy = items.find(x=>x.name.includes('Luffy')) || items[0]
      const box = items.find(x=>x.category==='sealed') || items[1]

      // Add holdings
      const holdings = [
        {catalog_id:luffy?._id, category:luffy?.category||'card_raw', name:luffy?.name||'Card', set_name:luffy?.set_name, number:luffy?.number, quantity:2, purchase_price:120, currency:'EUR', image_url:luffy?.image_url},
        {catalog_id:box?._id, category:'sealed', name:box?.name||'Box', set_name:box?.set_name, number:box?.number, quantity:1, purchase_price:180, currency:'EUR', image_url:box?.image_url},
      ]
      for (const h of holdings){
        await fetch(`${baseUrl}/collection`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(h)})
      }
      // Add price snapshots
      const snaps = [
        {catalog_id: luffy?._id, currency:'EUR', price:150, source:'seed'},
        {catalog_id: luffy?._id, currency:'EUR', price:160, source:'seed'},
        {catalog_id: box?._id, currency:'EUR', price:220, source:'seed'},
        {catalog_id: box?._id, currency:'EUR', price:210, source:'seed'},
      ]
      for (const s of snaps){
        await fetch(`${baseUrl}/prices/snapshot`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(s)})
      }
    } finally {
      setLoading(false)
      onDone && onDone()
    }
  }

  return (
    <div className="card p-4">
      <h3 className="card-header mb-2">Dati di esempio</h3>
      <p className="text-sm text-slate-400 mb-3">Crea alcuni elementi demo per vedere grafici e KPI.</p>
      <button onClick={seed} className="btn btn-primary" disabled={loading}>{loading? 'Creazione...' : 'Genera dati'}</button>
    </div>
  )
}
