import './App.css'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/NavBar'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {

  const queryClient = new QueryClient();

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <div className='App'>
       <Navbar />
       <Outlet />
       </div> 
    </QueryClientProvider>
    </>
  )
}

export default App
