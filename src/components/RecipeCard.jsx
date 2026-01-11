import React from 'react'
import FavoriteButton from './FavoriteButton'

export default function RecipeCard({ recipe, onOpen }) {
  return (
    <article
      className={`card ${onOpen ? 'card-clickable' : ''}`}
      aria-labelledby={`title-${recipe.id}`}
      onClick={() => onOpen && onOpen(recipe.id)}
    >
      <img src={recipe.image} alt={recipe.title} />
      <h3 id={`title-${recipe.id}`}>{recipe.title}</h3>
      <div className="card-meta">
        <div className="card-time">{recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : ''}</div>
        <FavoriteButton recipe={recipe} />
      </div>
    </article>
  )
}
