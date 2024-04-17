import ReactDOM from 'react-dom/client'
import {router} from './router'
import {RouterProvider} from 'react-router-dom'
import './index.css'
import UserProvider from './context/UseContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools  } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient} >    
        <UserProvider>    
            <RouterProvider router={router}/> 
            <ReactQueryDevtools />
        </UserProvider>
    </QueryClientProvider>
);
