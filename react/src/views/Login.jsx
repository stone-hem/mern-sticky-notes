import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const emailRef=useRef()
  const passwordRef=useRef()
  const login=(ev)=>{
    ev.preventDefault()
  }
  return (
    <div>
       <form  onSubmit={login}>
          <h1 className='title'>
            Access your Account
          </h1>
          <input ref={emailRef} type="email"  placeholder='email'/>
          <input ref={passwordRef} type="password"  placeholder='password'/>
          <button className='btn btn-block'>Login</button>
          <p className='message'>
            Not Registered?<Link to="/register"> Create Account</Link>
          </p>
        </form>
    </div>
  )
}

export default Login

