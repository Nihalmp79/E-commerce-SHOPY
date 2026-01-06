import React, { useEffect, useRef , useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrivals = () => {


    const scrollRef = useRef(null);
    const[isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [newArrivals, setNewArrivals] = useState([]);
    
    useEffect(() => {
        const fetchNewArrivals = async () =>{
            try {
                const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                console.log("NEW ARRIVALS DATA:", data);
                console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

                setNewArrivals(
                    Array.isArray(data) ? data : data.products || []
            );

            } catch (error) {
                console.error(error);
            }
        }
        fetchNewArrivals();
    },[]);



    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(scrollRef.current.scrollLeft);
    };


    const handleMouseMove = (e) => {
        if(!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; //scroll-fast
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    }


    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    //udate scroll buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        
        if(container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft( leftScroll > 0 );
            setCanScrollRight( rightScrollable );

        }

       
    }


    useEffect(() => {
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll",updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll",updateScrollButtons);
        }
    }, [newArrivals]);

  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto text-center mb-10 relative'>
            <h2 className='text-3xl font-bold mb-4'>
                Explore New Arrivals
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
                Discover the latest styles and straight off the runway, freshly added to
                Keep your wardrobe on the cutting edge of fashion.
            </p>
            {/* Scroll Button */}
            <div className='absolute right-10 bottom-[-30px] flex space-x-2'>
                <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`p-2 rounded border ${canScrollLeft ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed' }`}>
                    <FiChevronLeft className='text-2xl'/>
                </button>
                <button onClick={() => scroll('right')} className={`p-2 rounded border ${canScrollRight ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed' }`}>
                    <FiChevronRight className='text-2xl'/>
                </button>
            </div>
        </div>
        {/* Scrollable Contet */}
        <div ref={scrollRef} className={`w-full overflow-x-auto flex gap-4 px-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} onScroll={updateScrollButtons}>
            {
              newArrivals.map((product) => (
                <div key={product._id} className='flex-shrink-0 w-56 sm:w-64 lg:w-72 relative'>
                    <img
                    src={product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.images?.[0]?.altText || product.name}
                    className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                    draggable={false}
                    />

                    <div className='absolute bottom-0 left-0 right-0  backdrop-blur-md text-white p-4 rounded-b-lg'>
                        <Link to={`/product/${product._id}`} className='block' >
                            <h4 className='font-medium'>
                                {product.name}    
                            </h4>
                            <p className='mt-1'>
                                ₹{product.price}
                            </p>
                        </Link>
                    </div>
                </div>
              ))  
            }
        </div>
    </section>
  )
}

export default NewArrivals
