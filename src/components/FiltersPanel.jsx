import React from 'react'

export default function FiltersPanel({ filters, onChange }) {
  const diets = ['Vegan', 'Vegetarian', 'Pescatarian']
  const intolerances = ['Gluten-free', 'Dairy-free']

  function toggleArray(field, value) {
    const set = new Set(filters[field])
    if (set.has(value)) set.delete(value)
    else set.add(value)
    onChange({ ...filters, [field]: Array.from(set) })
  }

  return (
    <aside className="filters-aside" aria-label="Filters">
      <div className="filter-group">
        <strong>Diet</strong>
        <div>
          {diets.map((d) => (
            <label key={d} className="filter-label">
              <input
                type="checkbox"
                checked={filters.diets.includes(d)}
                onChange={() => toggleArray('diets', d)}
              />
              <span className="filter-label-text">{d}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <strong>Intolerances</strong>
        <div>
          {intolerances.map((t) => (
            <label key={t} className="filter-label">
              <input
                type="checkbox"
                checked={filters.intolerances.includes(t)}
                onChange={() => toggleArray('intolerances', t)}
              />
              <span className="filter-label-text">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <strong>Max time</strong>
        <div>
          <select
            value={filters.maxTime || ''}
            onChange={(e) => onChange({ ...filters, maxTime: e.target.value ? Number(e.target.value) : null })}
            className="filter-select"
          >
            <option value="">Any</option>
            <option value="15">Under 15 minutes</option>
            <option value="30">Under 30 minutes</option>
            <option value="45">Under 45 minutes</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
