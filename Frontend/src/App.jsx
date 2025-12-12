import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'; 
import UserLayout from './Components/Layout/UserLayout';
import Home from './Pages/Home';
import { Toaster } from 'sonner';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Toaster position='top-right'/>
      <Routes>
        <Route path='/' element={<UserLayout />} >
        <Route index element={<Home/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
