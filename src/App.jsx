import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import "./App.css"
import Dashboard from "./components/Dashboard"
import ResumeView from "./components/ResumeView"

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              Resume Parser
            </Link>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resume/:id" element={<ResumeView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
