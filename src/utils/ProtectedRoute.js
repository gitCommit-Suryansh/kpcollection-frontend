import React from 'react' 
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const ProtectedRoute=({element})=>{
    const token=Cookies.get('token')
    return token ? element : <Navigate to="/login" />
}

export default ProtectedRoute