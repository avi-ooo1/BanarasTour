import React from 'react'
import { lowerBannerData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const LowerBanner = () => {
  const navigate = useNavigate();
  return (    
    <div className='flex bg-gray-400 rounded-lg mx-4 px-6 sm:px-10 md:px-14 lg:px-12 my-20 sm:mx-10 md:mx-20 lg:mx-30'>
        {/* --------{Left Side} ---------- */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                <p>Book Your Trip</p>
                <p className='mt-4'>With 100+ Trusted Local Guides </p>
            </div>
            <button onClick={() => {navigate('/login'); scrollTo(0,0)}} className='bg-white text-sm sm:text-base text:gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all cursor-pointer'>Book Now</button>
            
        </div>
        {/* --------{Right Side} ---------- */}
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className='w-full absolute bottom-[-16px] right-0 max-w-md' src={lowerBannerData.TouristGuide} alt="Tourist Guide" />
        </div>
    </div>
  )
}

export default LowerBanner;