import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useForm } from 'react-hook-form'
import type { Appointment } from '../utils/interfaces/response'
import dayjs from 'dayjs'


export default function Appointments(){
const [items, setItems] = useState<Appointment[]>([])
const { register, handleSubmit, reset } = useForm<Appointment>()


const load = async ()=>{
try{ const res = await api.get('/appointments'); setItems(res.data) }catch(e){ }
}


useEffect(()=>{ load() }, [])


const onSubmit = async (d: Appointment) =>{
try{
const payload = { ...d }
const res = await api.post('/appointments', payload)
setItems(prev => [res.data, ...prev])
reset()
}catch(e){ console.error(e) }
}


const remove = async (id?: string) =>{
if (!id) return
try{ await api.delete(`/appointments/${id}`); setItems(prev => prev.filter(x=>x._id!==id)) }catch(e){ }
}


return (
<Layout>
<h1 className="text-2xl font-bold">Appointments</h1>


<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2 max-w-xl">
<input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
<input {...register('notes')} placeholder="Notes" className="w-full p-2 border rounded" />
<input {...register('at')} type="datetime-local" className="w-full p-2 border rounded" />
<button className="p-2 bg-blue-600 text-white rounded">Add Appointment</button>
</form>


<div className="mt-6 space-y-3">
{items.map(a => (
<div key={a._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
<div>
<div className="font-semibold">{a.title}</div>
<div className="text-sm text-gray-600">{a.notes} • {dayjs(a.at).format('MMM D, HH:mm')}</div>
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