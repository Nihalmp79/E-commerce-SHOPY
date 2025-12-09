import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'; 
import UserLayout from './Components/Layout/UserLayout';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserLayout />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
