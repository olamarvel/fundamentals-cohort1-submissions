import React from 'react'
import { Link } from 'react-router-dom'


export default function Home(){
return (
<div className="max-w-3xl mx-auto mt-16 text-center">
<h1 className="text-3xl font-bold">Welcome to PulseTrack</h1>
<p className="mt-4">Track your meals, activities and appointments with ease.</p>
<div className="mt-6 space-x-4">
<Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
<Link to="/register" className="px-4 py-2 border rounded">Register</Link>
</div>
</div>
)
}