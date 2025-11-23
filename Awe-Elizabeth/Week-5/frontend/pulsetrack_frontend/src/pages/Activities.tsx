import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useForm } from 'react-hook-form'
import type { Activity } from '../utils/interfaces/response'
import dayjs from 'dayjs'


export default function Activities(){
const [items, setItems] = useState<Activity[]>([])
const { register, handleSubmit, reset } = useForm<Activity>()


const load = async ()=>{
try{ const res = await api.get('/activities'); setItems(res.data) }catch(e){ }
}


useEffect(()=>{ load() }, [])


const onSubmit = async (d: Activity) =>{
try{
const payload = { ...d, time: d.time || new Date().toISOString() }
const res = await api.post('/activities', payload)
setItems(prev => [res.data, ...prev])
reset()
}catch(e){ console.error(e) }
}


const remove = async (id?: string) =>{
if (!id) return
try{ await api.delete(`/activities/${id}`); setItems(prev => prev.filter(x=>x._id!==id)) }catch(e){ }
}


return (
<Layout>
<h1 className="text-2xl font-bold">Activities</h1>


<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2 max-w-xl">
<input {...register('name')} placeholder="Activity name" className="w-full p-2 border rounded" />
<input {...register('durationMinutes')} type="number" placeholder="Duration (minutes)" className="w-full p-2 border rounded" />
<input {...register('time')} type="datetime-local" className="w-full p-2 border rounded" />
<button className="p-2 bg-blue-600 text-white rounded">Add Activity</button>
</form>


<div className="mt-6 space-y-3">
{items.map(a => (
<div key={a._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
<div>
<div className="font-semibold">{a.name}</div>
<div className="text-sm text-gray-600">{a.durationMinutes} min • {dayjs(a.time).format('MMM D, HH:mm')}</div>
</div>
<div>
<button onClick={()=>remove(a._id)} className="text-sm text-red-600">Delete</button>
</div>
</div>
))}
</div>
</Layout>
)
}