import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const nameRef=useRef();
  const passwordRef=useRef();
  const onSubmit=(ev)=>{
    ev.preventDefault()
  }
  return (
    <form onSubmit={onSubmit}>
    <h1 className='title'>
          Register for Free 
        </h1>
      <input ref={nameRef} type="text"  placeholder='full name'/>
      <input ref={passwordRef} type="password"  placeholder='password'/>
      <button className='btn btn-block'>Register</button>
      <p className='message'>
        Already Registered?<Link to="/login"> Login</Link>
      </p>
    </form>
  )
}

export default Register