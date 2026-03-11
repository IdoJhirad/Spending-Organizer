import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App
