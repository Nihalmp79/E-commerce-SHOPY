import React from 'react'
import {TbBrandMeta} from 'react-icons/tb';
import {IoLogoInstagram} from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className='bg-blue-800 text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className='hidden md:flex item-center space-x-4 '>
                <a href="" className='hover:text-gray-300'>
                    <TbBrandMeta className='h-5 w-5'/>
                </a>
                <a href="" className='hover:text-gray-300'>
                    <IoLogoInstagram className='h-5 w-5'/>
                </a>
                <a href="" className='hover:text-gray-300'>
                    <FaWhatsapp className='h-5 w-5'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>We ship worldwide - Fast and reliabl shipping!</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel:+1234567890" className='hover:text-gray-300' >
                    Call us: +91 234 567 890
                </a>
            </div>
        </div>
      
    </div>
  )
}

export default Topbar
