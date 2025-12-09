import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'; 
import UserLayout from './Components/Layout/UserLayout';
import Home from './Pages/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
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
