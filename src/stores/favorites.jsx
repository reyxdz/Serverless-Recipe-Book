import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'serverless:favorites:v1'
const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      // ignore
    }
  }, [favorites])

  // cross-tab sync
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          setFavorites(e.newValue ? JSON.parse(e.newValue) : [])
        } catch (err) {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function isFavorite(id) {
    return favorites.some((r) => r.id === id)
  }

  function toggle(recipe) {
    setFavorites((prev) => {
      const exists = prev.find((r) => r.id === recipe.id)
      if (exists) return prev.filter((r) => r.id !== recipe.id)
      const snapshot = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        sourceUrl: recipe.sourceUrl || '',
        savedAt: Date.now(),
      }
      return [snapshot, ...prev]
    })
  }

  function exportJSON() {
    return JSON.stringify(favorites, null, 2)
  }

  function importJSON(json) {
    try {
      const arr = JSON.parse(json)
      if (Array.isArray(arr)) {
        setFavorites(arr)
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle, exportJSON, importJSON }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
