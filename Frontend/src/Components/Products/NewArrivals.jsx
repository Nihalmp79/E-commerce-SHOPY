import React, { useEffect, useRef , useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {


    const scrollRef = useRef(null);
    const[isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const NewArrivals = [
        {
            _id: '1',
            name: 'Stylish Jacket',
            price: 79.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=1",
                    altText: "Stylish Jacket"
                },
            ],
        },
        {
            _id: '2',
            name: 'Stylish Pants',
            price: 59.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=2",
                    altText: "Stylish Pants"
                },
            ],
        },
        {
            _id: '3',
            name: 'Stylish Shirt',
            price: 39.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=3",
                    altText: "Stylish Shirt"
                },
            ],
        },
        {
            _id: '4',
            name: 'Stylish jeans',
            price: 49.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=4",
                    altText: "Stylish jeans"
                },
            ],
        },
        {
            _id: '5',
            name: 'casual shirt',
            price: 29.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=5",
                    altText: "casual shirt"
                },
            ],
        },
        {
            _id: '6',
            name: 'casual pants',
            price: 49.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=6",
                    altText: "casual pants"
                },
            ],
        },
        {
            _id: '7',
            name: 'Stylish Jacket',
            price: 79.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=7",
                    altText: "Stylish Jacket"
                },
            ],
        },
        {
            _id: '8',
            name: 'Stylish Jacket',
            price: 79.99,
            image: [
                {
                    url: "https://picsum.photos/500/500?random=8",
                    altText: "Stylish Jacket"
                },
            ],
        },
    ];



    const handleMouseDown = (e) => {
        e.prevenetDefault();
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

        console.log({
            scrollLeft: container.scrollLeft,
            clientWidth: container.clientWidth,
            containerScrollWidth: container.scrollWidth,
            offsetLeft: scrollRef.current.offsetLeft
        });
    }


    useEffect(() => {
        const container = scrollRef.current;
        if(container){
            container.addEventListener("scroll",updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll",updateScrollButtons);
        }
    }, []);

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
        <div ref={scrollRef} className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} onScroll={updateScrollButtons}>
            {
              NewArrivals.map((product) => (
                <div key={product._id} className='min-w-[80%] sm:min-w-[40%] lg:min-w-[20%] relative'>
                    <img src={product.image[0]?.url} alt={product.image[0]?.altText || product.name} className='w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg' draggable={false}/>
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
