import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'


type Form = { firstName: string; lastName: string; email: string; password: string }


export default function Register(){
const { register, handleSubmit } = useForm<Form>()
const navigate = useNavigate()


const onSubmit = async (d: Form) => {
try {
await api.post('/auth/register', d)
alert('Registration successful. Please login.')
navigate('/login')
} catch (e:any) {
alert(e?.response?.data?.message || 'Registration failed')
}
}


return (
<div className="max-w-md mx-auto mt-20">
<h2 className="text-2xl mb-4">Register</h2>
<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
<input {...register('firstName')} placeholder="firstName" className="p-2 border rounded" />
<input {...register('lastName')} placeholder="lastName" className="p-2 border rounded" />
<input {...register('email')} placeholder="Email" className="p-2 border rounded" />
<input {...register('password')} type="password" placeholder="Password" className="p-2 border rounded" />
<button type="submit" className="p-2 bg-green-600 text-white rounded">Register</button>
</form>
</div>
)
}