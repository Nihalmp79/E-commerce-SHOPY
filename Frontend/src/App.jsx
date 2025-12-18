import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'; 
import UserLayout from './Components/Layout/UserLayout';
import Home from './Pages/Home';
import { Toaster } from 'sonner';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import CollectionPage from './Pages/CollectionPage';
import ProductDetails from './Components/Products/ProductDetails';
import Checkout from './Components/Cart/Checkout';
import OrderConfirmationPage from './Pages/OrderConfirmationPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import MyOrderPage from './Pages/MyOrderPage';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminHomePage from './Pages/AdminHomePage';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Toaster position='top-right'/>
      <Routes>
        <Route path='/' element={<UserLayout />} >
          <Route index element={<Home/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='collection/:collection' element={<CollectionPage/>}/>
          <Route path='product/:id' element={<ProductDetails/>} />
          <Route path='checkout' element={<Checkout/>}/>
          <Route path='order-confirmation' element={<OrderConfirmationPage/>}/>
          <Route path='order/:id' element={<OrderDetailsPage/>}/>
          <Route path='my-orders' element={<MyOrderPage/>}/>
        </Route>
        <Route path='/admin' element={<AdminLayout/>}>
        {/* Admin Layout */}
          <Route index element={<AdminHomePage/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
