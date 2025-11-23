import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'


export default function Dashboard(){
const [summary, setSummary] = useState<any>(null)


useEffect(()=>{
const load = async ()=>{
try{
const res = await api.get('/dashboard')
setSummary(res.data)
}catch(e){
// ignore for now
}
}
load()
},[])


return (
<Layout>
<h1 className="text-2xl font-bold">Dashboard</h1>
<div className="mt-4 grid grid-cols-3 gap-4">
<div className="p-4 bg-white rounded shadow">Meals today: {summary?.mealsToday ?? '-'}</div>
<div className="p-4 bg-white rounded shadow">Activities today: {summary?.activitiesToday ?? '-'}</div>
<div className="p-4 bg-white rounded shadow">Appointments this week: {summary?.appointmentsWeek ?? '-'}</div>
</div>
</Layout>
)
}