import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Foundational Placeholders (UI to be built in next steps)
const Login = () => <div className="p-10 text-2xl font-bold">Login Page (Public)</div>;
const Dashboard = () => <div className="p-10 text-2xl font-bold">Dashboard (Protected)</div>;
const Leads = () => <div className="p-10 text-2xl font-bold">Leads List (Protected)</div>;
const LeadDetails = () => <div className="p-10 text-2xl font-bold">Lead Details (Protected)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes Group */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;