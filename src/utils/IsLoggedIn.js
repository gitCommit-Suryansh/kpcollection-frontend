import React from 'react' 
import Cookies from 'js-cookie'
const IsLoggedIn=()=>{
    let token = Cookies.get('token')
    return !!token
}

export default IsLoggedIn