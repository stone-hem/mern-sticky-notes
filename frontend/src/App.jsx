import { Route, Routes } from "react-router-dom"
import Layout from './components/Layout'
import Public from './components/Public'
import Login from "./features/Auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/Auth/Welcome"
import NotesList from "./features/notes/NotesList"
import UsersList from "./features/users/UsersList"
import NewUserForm from "./features/users/NewUserForm"
import EditUser from "./features/users/EditUser"
import EditNote from "./features/notes/EditNote"
import NewNote  from "./features/notes/NewNote"
import Prefetch from "./features/Auth/Prefetch"

function App() {


  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="/login" element={<Login />} />
        {/* Start Dashboard */}
        <Route element={<Prefetch/>}>
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes" >
            <Route index element={<NotesList />} />
            <Route path=":id" element={<EditNote/>}/>
            <Route path="new" element={<NewNote/>}/>
          </Route>
          <Route path="users" >
            <Route index element={<UsersList />} />
            <Route path=":id" element={<EditUser/>}/>
            <Route path="new" element={<NewUserForm/>}/>
          </Route>
        </Route>
        </Route>
        {/* End Dashboard */}
      </Route>
    </Routes>

  )
}

export default App
