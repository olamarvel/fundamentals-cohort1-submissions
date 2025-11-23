export interface IResponse<T>{
   success: boolean,
   message: string,
   result: T
}

export interface LoginResponse{
    accessToken: string,
    refreshToken: string
}

export interface User {
id: string
name: string
email: string
}


export interface Meal {
_id?: string
name: string
calories: number
time: string // ISO
}


export interface Activity {
_id?: string
name: string
durationMinutes: number
caloriesBurned?: number
time: string // ISO
}


export interface Appointment {
_id?: string
title: string
notes?: string
at: string // ISO
}