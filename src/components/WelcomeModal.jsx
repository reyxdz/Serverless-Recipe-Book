import React from 'react'

export default function WelcomeModal({ onContinue }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-panel">
        <h2 className="welcome-title">Welcome to Serverless Recipe Book</h2>
        
        <div className="welcome-content">
          <section className="welcome-section">
            <h3>About This Website</h3>
            <p>
              Serverless Recipe Book is a modern, lightweight recipe discovery application. It helps you find delicious recipes based on your preferences, dietary restrictions, and available cooking time.
            </p>
          </section>

          <section className="welcome-section">
            <h3>Key Features</h3>
            <ul className="welcome-features">
              <li><strong>Search</strong> - Find recipes by ingredient or dish name</li>
              <li><strong>Filter</strong> - Filter by dietary preferences (vegan, vegetarian) and cooking time</li>
              <li><strong>Save Favorites</strong> - Bookmark recipes and access them anytime</li>
              <li><strong>Detailed Instructions</strong> - View complete ingredients and step-by-step cooking instructions</li>
              <li><strong>No Signup Required</strong> - Works instantly without creating an account</li>
            </ul>
          </section>

          <section className="welcome-section">
            <h3>Why I Built This</h3>
            <p>
              I created this application to provide a fast, simple, and ad-free way to discover recipes. Built with modern web technologies and powered by the TheMealDB API, this serverless application loads quickly and works reliably without complex backend infrastructure.
            </p>
          </section>
        </div>

        <button className="welcome-btn" onClick={onContinue}>
          Continue to App
        </button>
      </div>
    </div>
  )
}
