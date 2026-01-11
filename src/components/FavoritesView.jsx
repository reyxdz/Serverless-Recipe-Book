import React, { useRef, useState } from 'react'
import { useFavorites } from '../stores/favorites.jsx'

export default function FavoritesView() {
  const { favorites, exportJSON, importJSON } = useFavorites()
  const fileRef = useRef(null)
  const [message, setMessage] = useState('')

  function handleExport() {
    const data = exportJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'serverless-favorites.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importJSON(reader.result)
        setMessage('Imported favorites')
      } catch (err) {
        setMessage('Import failed')
      }
    }
    reader.readAsText(f)
  }

  return (
    <section className="favorites-section">
      <div className="favorites-header">
        <h2>Favorites</h2>
        <div className="favorites-actions">
          <button className="btn" onClick={handleExport}>Export JSON</button>
          <button className="btn" onClick={() => fileRef.current && fileRef.current.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden-input" onChange={handleImportFile} />
        </div>
      </div>

      {message && <div className="fav-message">{message}</div>}

      {favorites.length === 0 && <div className="fav-empty">No favorites yet — add some recipes!</div>}

      <div className="favorites-grid">
        {favorites.map((r) => (
          <article key={r.id} className="favorite-item">
            <img src={r.image} alt={r.title} className="favorite-img" />
            <h3 className="favorite-title">{r.title}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
