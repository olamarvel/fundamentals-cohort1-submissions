import React from 'react'
import { NavLink } from 'react-router-dom'


export default function Sidebar(){
return (
<aside className="w-56 p-4 border-r bg-white h-[calc(100vh-56px)]">
<nav className="flex flex-col gap-3">
<NavLink to="/dashboard" className={({isActive})=>isActive? 'font-semibold':'hover:underline'}>Dashboard</NavLink>
<NavLink to="/meals" className={({isActive})=>isActive? 'font-semibold':'hover:underline'}>Meals</NavLink>
<NavLink to="/activities" className={({isActive})=>isActive? 'font-semibold':'hover:underline'}>Activities</NavLink>
<NavLink to="/appointments" className={({isActive})=>isActive? 'font-semibold':'hover:underline'}>Appointments</NavLink>
</nav>
</aside>
)
}