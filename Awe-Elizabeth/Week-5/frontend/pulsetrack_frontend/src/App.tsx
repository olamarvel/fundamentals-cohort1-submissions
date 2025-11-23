import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Meals from './pages/Meal'
import Activities from './pages/Activities'
import Appointments from './pages/Appointments'
import ProtectedRoute from './components/ProtectedRoute'


export default function App(){
return (
<Routes>
<Route path='/' element={<Home/>} />
<Route path='/login' element={<Login/>} />
<Route path='/register' element={<Register/>} />


<Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
<Route path='/meals' element={<ProtectedRoute><Meals/></ProtectedRoute>} />
<Route path='/activities' element={<ProtectedRoute><Activities/></ProtectedRoute>} />
<Route path='/appointments' element={<ProtectedRoute><Appointments/></ProtectedRoute>} />


<Route path='*' element={<Navigate to='/' replace />} />
</Routes>
)
}