import React from 'react'
import Hero from '../Components/Layout/Hero';
import GenderCollectionSection from '../Components/Products/GenderCollectionSection';
import NewArrivals from '../Components/Products/NewArrivals';
import ProductDetails from '../Components/Products/ProductDetails';

function Home() {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best seller */}

      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      <ProductDetails />
    </div>
  )
}

export default Home
 