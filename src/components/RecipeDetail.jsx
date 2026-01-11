import React, { useEffect, useState, useRef } from 'react'
import { getMealById } from '../api/mealdbClient'
import FavoriteButton from './FavoriteButton'

export default function RecipeDetail({ id, onClose }) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    let mounted = true
    if (!id) return
    setLoading(true)
    getMealById(id)
      .then((r) => mounted && setRecipe(r))
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [id])

  if (!id) return null

  function handleClose() {
    // add exit animation, then call parent's onClose
    setClosing(true)
    // match animation duration (200ms) + small buffer
    setTimeout(() => onClose && onClose(), 240)
  }

  // focus management and keyboard handling (Escape to close, Tab trap)
  useEffect(() => {
    const prevActive = document.activeElement
    // focus close button when modal opens
    if (closeBtnRef.current) closeBtnRef.current.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }
      if (e.key === 'Tab') {
        // basic focus trap: keep focus within panelRef
        const panel = panelRef.current
        if (!panel) return
        const focusable = panel.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // restore previous focus
      try { prevActive && prevActive.focus() } catch (err) {}
    }
  }, [])

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true">
      <div ref={panelRef} className={`detail-panel ${closing ? 'exit' : 'enter'}`}>
        <div className="detail-header">
          <h2 className="detail-title">{recipe ? recipe.title : 'Loading…'}</h2>
          <div className="detail-actions">
            {recipe && <FavoriteButton recipe={recipe} />}
            <button ref={closeBtnRef} className="detail-close" onClick={handleClose} aria-label="Close">Close</button>
          </div>
        </div>

        {loading && <div className="detail-loading">Loading…</div>}

        {recipe && (
          <div className="detail-body">
            <img className="detail-image" src={recipe.image} alt={recipe.title} />
            <div className="detail-meta">
              {recipe.category && <span className="badge">{recipe.category}</span>}
              {recipe.area && <span className="badge">{recipe.area}</span>}
              <span className="detail-time">{recipe.readyInMinutes} min</span>
            </div>

            <section className="detail-section">
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients.map((it, i) => (
                  <li key={i}>{it.measure} {it.ingredient}</li>
                ))}
              </ul>
            </section>

            <section className="detail-section">
              <h3>Instructions</h3>
              <p className="detail-instructions">{recipe.instructions}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
