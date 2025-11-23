import api from '../services/api'
import useAuth from './useAuth'


export default function useApi(){
const auth = useAuth()
return api
}