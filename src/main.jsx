import ReactDOM from 'react-dom/client'
import {router} from './router'
import {RouterProvider} from 'react-router-dom'
import './index.css'
import UserProvider from './context/UseContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>    
        <RouterProvider router={router}/> 
    </UserProvider>

);
