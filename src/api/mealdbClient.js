export async function searchMeals(query) {
  if (!query) return []
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
    query
  )}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('MealDB fetch failed')
  const data = await res.json()
  const meals = data.meals || []
  // Add a small deterministic demo `readyInMinutes` value so time-based filters can be demonstrated.
  // We derive a number from the meal id so values are stable across runs.
  return meals.map((m) => {
    const idNum = parseInt(m.idMeal, 10) || 0
    const readyInMinutes = 10 + (idNum % 50) // range 10-59
    return {
      id: m.idMeal,
      title: m.strMeal,
      image: m.strMealThumb,
      sourceUrl: m.strSource || '',
      readyInMinutes,
      tags: m.strTags ? m.strTags.split(',') : [],
    }
  })
}

export async function getMealById(id) {
  if (!id) return null
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('MealDB fetch failed')
  const data = await res.json()
  const m = (data.meals && data.meals[0]) || null
  if (!m) return null
  // normalize structure
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = m[`strIngredient${i}`]
    const measure = m[`strMeasure${i}`]
    if (ing && ing.trim()) ingredients.push({ ingredient: ing.trim(), measure: (measure || '').trim() })
  }
  return {
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    sourceUrl: m.strSource || '',
    readyInMinutes: 10 + ((parseInt(m.idMeal, 10) || 0) % 50),
    tags: m.strTags ? m.strTags.split(',') : [],
    category: m.strCategory || null,
    area: m.strArea || null,
    instructions: m.strInstructions || '',
    ingredients,
  }
}
