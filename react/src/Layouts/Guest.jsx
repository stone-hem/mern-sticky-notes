import React from 'react'
import { Outlet } from 'react-router-dom'

function Guest() {
  return (
    <div className='login-signup-form animated fadeInDown'>
    <div className='form'>
      <Outlet/>
    </div>
    </div>
  )
}

export default Guest