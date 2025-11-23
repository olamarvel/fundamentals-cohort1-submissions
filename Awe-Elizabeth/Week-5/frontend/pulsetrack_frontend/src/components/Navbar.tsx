import React from 'react'
import useAuth from '../hooks/useAuth'


export default function Navbar(){
const { user, logout } = useAuth()
return (
<div className="w-full h-14 flex items-center justify-between px-6 bg-white shadow">
<div className="flex items-center gap-4">
<div className="font-bold text-lg">PulseTrack</div>
</div>
<div className="flex items-center gap-4">
{user ? <div className="text-sm">{user.name}</div> : null}
{user ? <button onClick={logout} className="text-sm underline">Logout</button> : null}
</div>
</div>
)
}