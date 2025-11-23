import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'


type FormValues = { email: string; password: string }


export default function Login(){
const { register, handleSubmit } = useForm<FormValues>()
const auth = useAuth()
const navigate = useNavigate()


const onSubmit = async (data: FormValues) => {
try {
const res = await api.post('/auth/login', data, { withCredentials: true })
const { accessToken, user } = res.data
auth.setAccessToken(accessToken)
auth.setUser(user)
navigate('/dashboard')
} catch (e:any) {
alert(e?.response?.data?.message || 'Login failed')
}
}


return (
<div className="max-w-md mx-auto mt-20">
<h2 className="text-2xl mb-4">Login</h2>
<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
<input {...register('email')} placeholder="Email" className="p-2 border rounded" />
<input {...register('password')} type="password" placeholder="Password" className="p-2 border rounded" />
<button type="submit" className="p-2 bg-blue-600 text-white rounded">Log in</button>
</form>
</div>
)
}