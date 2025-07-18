import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Homepage from './pages/Homepage'
import Listings from './pages/Listings'
import PostAd from './pages/PostAd'
import DealPage from './pages/DealPage'
import HowItWorks from './pages/HowItWorks'

// API Configuration
const API_BASE_URL = 'https://3dhkilcjlvx3.manus.space';
function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/listings`)
      const data = await response.json()
      if (data.success) {
        setListings(data.data)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route 
              path="/listings" 
              element={
                <Listings 
                  listings={listings} 
                  loading={loading} 
                  onRefresh={fetchListings} 
                />
              } 
            />
            <Route 
              path="/post-ad" 
              element={<PostAd onAdPosted={fetchListings} />} 
            />
            <Route path="/deal/:tradeCode" element={<DealPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

