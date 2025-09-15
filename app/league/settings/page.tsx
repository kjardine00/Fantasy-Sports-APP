'use client'

import React, { useState } from 'react'

type ViewType = 'basic' | 'draft' | 'rosters' | 'scoring'

const SettingsPage = () => {
  const [activeView, setActiveView] = useState<ViewType>('basic')

  const views = [
    { id: 'basic' as ViewType, label: 'Basic Settings' },
    { id: 'draft' as ViewType, label: 'Draft' },
    { id: 'rosters' as ViewType, label: 'Rosters' },
    { id: 'scoring' as ViewType, label: 'Scoring' },
  ]

  const renderViewContent = () => {
    switch (activeView) {
      case 'basic':
        return (
          <div className="view-content">
            <h2>Basic Settings</h2>
            <p>Configure your league's basic settings here.</p>
            {/* Add your basic settings form/inputs here */}
          </div>
        )
      case 'draft':
        return (
          <div className="view-content">
            <h2>Draft Settings</h2>
            <p>Configure your league's draft settings here.</p>
            {/* Add your draft settings form/inputs here */}
          </div>
        )
      case 'rosters':
        return (
          <div className="view-content">
            <h2>Roster Settings</h2>
            <p>Configure your league's roster settings here.</p>
            {/* Add your roster settings form/inputs here */}
          </div>
        )
      case 'scoring':
        return (
          <div className="view-content">
            <h2>Scoring Settings</h2>
            <p>Configure your league's scoring settings here.</p>
            {/* Add your scoring settings form/inputs here */}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="settings-page">
      <h1>League Settings</h1>
      <h4>Your League Name</h4>
      
      <div className="view-selector">
        <h3>View:</h3>
        {views.map((view) => (
          <button
            key={view.id}
            className={`view-button ${activeView === view.id ? 'active' : ''}`}
            onClick={() => setActiveView(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>

      {renderViewContent()}
    </div>
  )
}

export default SettingsPage