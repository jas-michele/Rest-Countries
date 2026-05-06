import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CountryDetailPage from "./pages/CountryDetailPage";

import './App.css'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:name" element={<CountryDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
