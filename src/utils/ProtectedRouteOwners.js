import React from 'react' 
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const ProtectedRouteOwners=({element})=>{
    const token=Cookies.get('token')
    return token ? element : <Navigate to="/admin-login" />
}

export default ProtectedRouteOwners