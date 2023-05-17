import { Route, Routes } from "react-router-dom"
import Layout from './components/Layout'
import Public from './components/Public'
import Login from "./features/Auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/Auth/Welcome"
import Notes from "./features/notes/Notes"
import Users from "./features/users/Users"

function App() {


  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        {/* Start Dashboard */}
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes" >
            <Route index element={<Notes />} />
          </Route>
          <Route path="users" >
            <Route index element={<Users />} />
          </Route>
        </Route>
        {/* End Dashboard */}
      </Route>
    </Routes>

  )
}

export default App
