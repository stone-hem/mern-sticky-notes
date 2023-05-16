import React from 'react'
import { Outlet,Link } from 'react-router-dom'


function Authorized() {
    const onLogout=()=>{

    }
  return (
    <div id='defaultLayout'>
    <aside>
      <Link to="/home">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/notes">Notes</Link>
    </aside>
    <div className="content">
      <header>
        <div>
          Tech Notes
        </div>
        <div>
          Hem  Stone
          <a href='#' onClick={onLogout} className='btn-logout'>Logout</a>
        </div>
      </header>
      <main>
      <Outlet/>
      </main>
      
    </div>
      
  </div>
  )
}

export default Authorized