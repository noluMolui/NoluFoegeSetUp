import { useState } from 'react'
import LandingPage from './components/LandingPage'
import OnboardingForm from './components/OnboardingForm'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage onGetStarted={() => setCurrentPage('form')} />
      ) : (
        <OnboardingForm onBack={() => setCurrentPage('landing')} />
      )}
    </>
  )
}

export default App
