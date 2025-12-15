import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSIdebar = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filter,setFilter] = useState({
        category:"",
        gender:"",
        color:"",
        size:[],
        materials:[],
        brands:[],
        minPrice:0,
        maxPrice:1500,

    })

    const [priceRange,setPriceRange] = useState([0,1500]);

    const categories = ["Top Wear" , "Bottom Wear"];

    const colors = [
      "Red",
      "Blue",
      "Black",
      "Green",
      "Yellow",
      "Gray",
      "White",
      "Pink",
      "Beige",
      "Navy",
    ];

    const size = ["XS" ,"S",'M','L','XL','XXL'];

    const materials = [
      "Cotton",
      "Wool",
      'Denim',
      'Polyester',
      'Silk',
      'Linen',
      'Viscose',
      'Fleece',
    ];

    const brands = [
      "Urben Threads",
      'Modern Fit',
      "Street Style",
      "Beach Breeze",
      "Fashionista",
      "ChicStyle",
    ];

    const gender = ["Men" , "Women"]

    useEffect(() =>{
      const params = Object.fromEntries([...searchParams]);
      
      setFilter({
        category: params.category || "",
        gender: params.gender || "",
        color: params.color || "",
        size: params.size? params.size.split(",") : [],
        materials: params.materials? params.materials.split(",") : [],
        brands: params.brands? params.brands.split(",") : [],
        minPrice: params.minPrice || 0,
        maxPrice: params.maxPrice ||  1500,

      });
      setPriceRange([0, params.maxPrice || 1500]);
    },[searchParams]);

    const handleFilterChange = (e) => {
      const {name, value, checked, type} = e.target;
      let newFilter = { ...filter };

      if(type === "checkbox"){
        if(checked){
          newFilter[name] = [...(newFilter[name] || []), value];
        }else{
          newFilter[name] = newFilter[name].filter((item) => item !== value);
        }
      }else {
        newFilter[name] = value;
      }
      setFilter(newFilter);
     updateURLParams(newFilter);
    }

    const updateURLParams = (newFilter) => {
      const params = new URLSearchParams();
      //{category: "Top Wear" , Size: ["xs", "s"]}
      Object.keys(newFilter).forEach((key) => {
        if(Array.isArray(newFilter[key]) && newFilter[key].length > 0){
          params.append(key, newFilter[key].join(","));
        } else if(newFilter[key]) {
          params.append(key, newFilter[key]);
        }
      });
      setSearchParams(params);
      navigate(`?${params.toString()}`);//?category=bottom+wear&size=xs%2cs
    }


    const handlePriceRange = (e) => {
      const newPrice = e.target.value;
      setPriceRange([0, newPrice]);
      const newFilter = {...filter, minPrice: 0, maxPrice: newPrice};
      setFilter(filter);
      updateURLParams(newFilter);
    }

  return (
    <div className='p-4 '>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Category Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) => (
          <div key={category} className='flex items-center mb-1'>
            <input type="radio" checked={filter.category === category} value={category} onChange={handleFilterChange} name='category' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
            <span className='text-gray-700'>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {gender.map((gender) => (
          <div key={gender} className='flex items-center mb-1'>
            <input type="radio" checked={filter.gender === gender} value={gender} onChange={handleFilterChange} name='gender' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
            <span className='text-gray-700'>{gender}</span>
          </div>
        ))}
      </div>

      {/* color filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Color</label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button key={color}  name="color" value={color} onClick={handleFilterChange} className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filter.color === color ? "ring-2 ring-blue-500" : ""}`} style={{backgroundColor: color.toLowerCase()}}></button>
          ))}
        </div>
      </div>

      {/* Material filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Material</label>
          {materials.map((materials) => (
            <div key={materials} className='flex items-center mb-1'>
              <input type="checkbox" checked={filter.materials.includes(materials)} value={materials} onChange={handleFilterChange} name='materials' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
              <span className='text-gray-700'>{materials}</span>
            </div>
          ))}
      </div>

          {/* size filter */}
          <div className='mb-6'>
            <label className='block text-gray-600 font-medium mb-2'>Size</label>
            {size.map((size) => (
              <div key={size} className='flex items-center mb-1'>
                <input type="checkbox" value={size} checked={filter.size.includes(size)} onChange={handleFilterChange} name='size' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
                <span className='text-gray-700'>{size}</span>
              </div>
            ))}
          </div>

          {/* brands filter */}
          <div className='mb-6'>
            <label className='block text-gray-600 font-medium mb-2'>Brands</label>
            {brands.map((brands) => (
              <div key={brands} className='flex items-center mb-1'>
                <input type="checkbox" value={brands} checked={filter.brands.includes(brands)} onChange={handleFilterChange} name='brands' className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300' />
                <span className='text-gray-700'>{brands}</span>
              </div>
            ))}
          </div>

          {/* Price Range filter */}
          <div className='mb-8'>
            <label className='block text-gray-600 font-medium'>Price Range</label>
            <input type="range" name='pricerange' min={0} max={1500} value={priceRange[1]} onChange={handlePriceRange} className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer' />
            <div className='flex justify-between text-gray-600 mt-2'>
              <span>₹0</span>
              <span>₹{priceRange[1]}</span>
            </div>
            
          </div>

    </div>
  )
}

export default FilterSIdebar
