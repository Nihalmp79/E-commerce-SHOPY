import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const FilterSIdebar = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const [filter,stfilter] = useState({
        category:"",
        gender:"",
        color:"",
        size:[],
        meterial:[],
        brand:[],
        minPrice:0,
        maxPrice:1500,

    })
  return (
    <div>
      
    </div>
  )
}

export default FilterSIdebar
