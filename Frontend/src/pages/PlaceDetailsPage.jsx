import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tours } = useContext(AppContext);
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tours || tours.length === 0) return;

    setIsLoading(true);
    const foundPlace = tours.find(item => String(item._id || item.id) === String(id));
    
    setTimeout(() => {
      setPlace(foundPlace);
      setIsLoading(false);
    }, 400); 
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, tours]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f3f4f6]">
         <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="text-center text-3xl text-gray-800 font-bold mb-4">404</div>
        <div className="text-center text-xl text-gray-600 font-medium mb-8">Place not found!</div>
        <button 
          onClick={() => navigate('/tour')} 
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all font-semibold"
        >
          Back to Tours
        </button>
      </div>
    );
  }

  // Smart map query logic
  let searchName = place.mapQuery || place.name;
  
  const mapQuery = encodeURIComponent(searchName + ' Varanasi');
  const freeMapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-[#fafafb] pt-24 md:pt-32 pb-20 relative overflow-hidden">
      {/* Background aesthetic shapes */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-50/50 -skew-y-3 transform origin-top-left -z-10"></div>
      <div className="absolute -top-32 right-[-10%] w-96 h-96 bg-pink-100/40 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow group-hover:border-indigo-200 transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
          </div>
          Back to list
        </button>

        {/* Magazine Editorial Layout - Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Right Side in HTML order for mobile, but structurally it's Left content on desktop */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide w-fit mb-6 shadow-sm shadow-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Explore Varanasi
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
              {place.name}
            </h1>
            
            {/* Enlarged About Section */}
            <div className="relative">
              {/* Decorative quotation mark */}
              <div className="absolute -top-8 -left-6 text-8xl text-gray-200/60 font-serif opacity-50 z-0 select-none">"</div>
              <p className="relative z-10 text-xl sm:text-2xl text-gray-700 font-light leading-relaxed border-l-4 border-indigo-500 pl-6 py-2 bg-gradient-to-r from-gray-50 to-transparent">
                {place.description || place.about}
              </p>
            </div>

            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-gray-200/60">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                <span className="text-sm font-medium text-gray-800">Uttar Pradesh, India</span>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</span>
                <span className="text-sm font-medium text-gray-800">Tourist Attraction</span>
              </div>
            </div>
          </div>

          {/* Image Side - Order 1 on mobile, Order 2 on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center">
            {/* The Unique Framed Image Style */}
            <div className="relative w-full max-w-sm mx-auto">
              {/* Back rotated shadow block */}
              <div className="absolute inset-0 bg-indigo-600 rounded-[2rem] rotate-6 scale-105 opacity-10 transition-transform duration-700 hover:rotate-12"></div>
              <div className="absolute inset-0 bg-amber-400 rounded-[2rem] -rotate-3 scale-105 opacity-20 transition-transform duration-700 hover:-rotate-6"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-white p-3 rounded-[2rem] shadow-xl z-10 border border-gray-100">
                <div className="rounded-[1.5rem] overflow-hidden bg-gray-100 h-[350px] sm:h-[400px]">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </div>
              {/* Floating label */}
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 z-20 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Popular</div>
                  <div className="text-sm font-semibold text-gray-900">Destination</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Map Section - Floating Card Style */}
        <div className="mt-24 lg:mt-32">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              
              <div className="p-8 md:p-10 bg-indigo-900 text-white flex flex-col justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Find This Place</h3>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  Navigate seamlessly to {place.name}. Use the interactive map to explore the surroundings and plan your visit directly.
                </p>
                <div className="mt-auto">
                    <div className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Nearest City</div>
                    <div className="font-semibold">Varanasi, UP</div>
                </div>
              </div>
              
              <div className="md:col-span-2 h-[350px] md:h-[400px]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  title="Google Maps Location"
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  loading="lazy"
                  className="w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-500"
                  src={freeMapSrc}
                ></iframe>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceDetailsPage;
