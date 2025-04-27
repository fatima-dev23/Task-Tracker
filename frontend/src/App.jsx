import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard"/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App