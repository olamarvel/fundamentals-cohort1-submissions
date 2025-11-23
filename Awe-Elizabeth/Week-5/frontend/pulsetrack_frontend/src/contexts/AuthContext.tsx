import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import { setAccessToken as saveAccessToken } from '../utils/authHelpers'
import type { User } from '../utils/interfaces/response'


type AuthContextValue = {
user: User | null
accessToken: string | null
setAccessToken: (t: string | null) => void
setUser: (u: User | null) => void
logout: () => Promise<void>
}


export const AuthContext = createContext<AuthContextValue | undefined>(undefined)


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
const [accessToken, setAccessToken] = useState<string | null>(null)
const [user, setUser] = useState<User | null>(null)


useEffect(() => {
// try refresh on mount
const tryRefresh = async () => {
try {
const res = await api.post('/auth/refresh', {}, { withCredentials: true })
const t = res.data.accessToken
setAccessToken(t)
saveAccessToken(t)
setUser(res.data.user || null)
} catch (e) {
setAccessToken(null)
setUser(null)
}
}
tryRefresh()
}, [])


const logout = async () => {
try {
await api.post('/auth/logout', {}, { withCredentials: true })
} catch (e) {
// ignore
}
setAccessToken(null)
saveAccessToken(null)
setUser(null)
}


return (
<AuthContext.Provider value={{ user, accessToken, setAccessToken, setUser, logout }}>
{children}
</AuthContext.Provider>
)
}