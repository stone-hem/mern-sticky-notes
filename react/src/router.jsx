import {Navigate, createBrowserRouter} from 'react-router-dom'
import Guest from './Layouts/Guest'
import Login from './views/Login'
import Register from './views/Register'
import Authorized from './Layouts/Authorized'
import Dashboard from './views/Dashboard'
import Users from './views/Users'
import Notes from './views/Notes'
import NotFound from './views/NotFound'


const router=createBrowserRouter([
    {
        path:'/',
        element:<Guest/>,
        children:[
            {
                path:'/',
                element:<Navigate to='/login'/>
            },
            {
                path:"/login",
                element:<Login/>
            },
            {
                path:"/register",
                element:<Register/>
            }
        ]
    },
    {
        path:'/',
        element:<Authorized/>,
        children:[
            {
                path:"/home",
                element:<Dashboard/>
            },
            {
                path:"/users",
                element:<Users/>
            },
            {
                path:"/notes",
                element:<Notes/>
            },
        ]
    },
    {
        path:'*',
        element:<NotFound/>
    }
])

export default router;