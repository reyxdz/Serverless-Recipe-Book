import React from 'react'
import { useFavorites } from '../stores/favorites.jsx'

export default function FavoriteButton({ recipe }) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(recipe.id)
  return (
    <button
      className="favorite-btn"
      aria-pressed={fav}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => toggle(recipe)}
    >
      {fav ? '★' : '☆'}
    </button>
  )
}
