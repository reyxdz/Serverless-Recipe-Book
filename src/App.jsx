import React, { useEffect, useState, useRef } from 'react'
import { searchMeals } from './api/mealdbClient'
import RecipeCard from './components/RecipeCard'
import FiltersPanel from './components/FiltersPanel'
import FavoritesView from './components/FavoritesView'
import RecipeDetail from './components/RecipeDetail'
import WelcomeModal from './components/WelcomeModal'
import { FavoritesProvider, useFavorites } from './stores/favorites.jsx'

function AppInner() {
  const initialQuery = new URLSearchParams(window.location.search).get('q') || 'chicken'
  const [query, setQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('serverless:welcome-seen'))
  const { favorites } = useFavorites()

  // filters: diets[], intolerances[], maxTime|null
  const initialFilters = (() => {
    const p = new URLSearchParams(window.location.search)
    return {
      diets: p.get('diets') ? p.get('diets').split(',') : [],
      intolerances: p.get('intolerances') ? p.get('intolerances').split(',') : [],
      maxTime: p.get('maxTime') ? Number(p.get('maxTime')) : null,
    }
  })()

  const [filters, setFilters] = useState(initialFilters)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const debounceRef = useRef(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)

  // sync filter state to URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    p.set('q', query)
    if (filters.diets.length) p.set('diets', filters.diets.join(','))
    else p.delete('diets')
    if (filters.intolerances.length) p.set('intolerances', filters.intolerances.join(','))
    else p.delete('intolerances')
    if (filters.maxTime) p.set('maxTime', String(filters.maxTime))
    else p.delete('maxTime')
    const newUrl = `${window.location.pathname}?${p.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [query, filters])

  // Debounce input -> query to avoid hammering API on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(inputValue.trim() || ''), 450)
    return () => clearTimeout(debounceRef.current)
  }, [inputValue])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    searchMeals(query)
      .then((items) => {
        if (!mounted) return
        // apply client-side filters (MealDB doesn't support complex server filters)
        const filtered = items.filter((r) => {
          // diet filtering: check tags for presence
          if (filters.diets.length) {
            const hasDiet = filters.diets.some((d) => r.tags.map((t) => t.toLowerCase()).includes(d.toLowerCase()))
            if (!hasDiet) return false
          }
          // intolerances - simple tag-based exclusion
          if (filters.intolerances.length) {
            const hasInt = filters.intolerances.some((i) => r.tags.map((t) => t.toLowerCase()).includes(i.toLowerCase()))
            if (hasInt) return false
          }
          // time
          if (filters.maxTime && r.readyInMinutes != null) {
            if (r.readyInMinutes > filters.maxTime) return false
          }
          return true
        })
        setRecipes(filtered)
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [query, filters])

  const handleWelcomeContinue = () => {
    localStorage.setItem('serverless:welcome-seen', 'true')
    setShowWelcome(false)
  }

  return (
    <>
      {showWelcome && <WelcomeModal onContinue={handleWelcomeContinue} />}
      <div className="app-root">
      <header className="header">
        <div className="header-logo">
          <h1>Serverless Recipe Book</h1>
          <span className="byline">by Rey Denzo</span>
        </div>
        <div className="header-controls">
          <div className="search">
            <input
              aria-label="Search recipes"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search recipes (e.g. chicken, pasta)"
            />
          </div>
          <button onClick={() => setShowFavorites((s) => !s)} aria-pressed={showFavorites} title="Toggle favorites">
            {showFavorites ? 'Browse' : `Favorites (${favorites.length})`}
          </button>
          <button className="filters-toggle" onClick={() => setShowFilters((s) => !s)} title="Toggle filters">
            Filters
          </button>
        </div>
      </header>

      <main className={`content ${showFilters ? 'filters-visible' : ''} main-content`}>
        <div className="left-col">
          <FiltersPanel filters={filters} onChange={setFilters} hidden={!showFilters} />
        </div>

        <div className="main-col">
          {showFavorites ? (
            <FavoritesView />
          ) : (
            <>
              {loading && <div className="loading">Loading…</div>}
              {!loading && (
                <div className="grid">
                  {recipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} onOpen={(id)=>setSelectedRecipeId(id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {selectedRecipeId && (
        <RecipeDetail id={selectedRecipeId} onClose={() => setSelectedRecipeId(null)} />
      )}
      </div>
    </>
  )
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppInner />
    </FavoritesProvider>
  )
}
