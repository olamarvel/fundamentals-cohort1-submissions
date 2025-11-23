import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useForm } from 'react-hook-form'
import type { Meal } from '../utils/interfaces/response'
import dayjs from 'dayjs'


export default function Meals(){
const [meals, setMeals] = useState<Meal[]>([])
const { register, handleSubmit, reset } = useForm<Meal>()


const load = async ()=>{
try{
const res = await api.get('/meals')
setMeals(res.data)
}catch(e){ console.error(e) }
}


useEffect(()=>{ load() }, [])


const onSubmit = async (data: Meal) =>{
try{
const payload = { ...data, time: data.time || new Date().toISOString() }
const res = await api.post('/meals', payload)
setMeals(prev => [res.data, ...prev])
reset()
}catch(e:any){ alert(e?.response?.data?.message || 'Failed') }
}


const remove = async (id?: string) =>{
if (!id) return
try{
await api.delete(`/meals/${id}`)
setMeals(prev => prev.filter(m => m._id !== id))
}catch(e){ console.error(e) }
}


return (
<Layout>
<div className="flex justify-between items-center">
<h1 className="text-2xl font-bold">Meals</h1>
</div>


<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2 max-w-xl">
<input {...register('name')} placeholder="Meal name" className="w-full p-2 border rounded" />
<input {...register('calories')} type="number" placeholder="Calories" className="w-full p-2 border rounded" />
<input {...register('time')} type="datetime-local" className="w-full p-2 border rounded" />
<button className="p-2 bg-blue-600 text-white rounded">Add Meal</button>
</form>


<div className="mt-6 space-y-3">
{meals.map(m=> (
<div key={m._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
<div>
<div className="font-semibold">{m.name}</div>
<div className="text-sm text-gray-600">{m.calories} kcal • {dayjs(m.time).format('MMM D, HH:mm')}</div>
</div>
<div>
<button onClick={()=>remove(m._id)} className="text-sm text-red-600">Delete</button>
</div>
</div>
))}
</div>
</Layout>
)
}