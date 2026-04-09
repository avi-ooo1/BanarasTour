import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopFamousThings = () => {
  const navigate = useNavigate();
  const { tours } = useContext(AppContext);

  const getSpeciality = (item) => {
    return item.category || 'Temple';
  };

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 lg:ml-30 lg:mr-30'>
      <h1 className='text-3xl font-medium'>Top Famous Things</h1>
      <p className='sm:w-1/3 text-center text-sm'>Discover the most popular and must-visit attractions in Banaras.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 px-4 sm:px-0">
        {tours.slice(0, 10).map((item, index) => (
          <div 
            key={item._id || item.id || index} 
            onClick={() => navigate(`/place/${item._id || item.id}`)}
            className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img loading="lazy" className="h-[200px] w-full object-cover" src={item.image} alt={item.name} />
            <div className="p-4">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">{item.name}</h5>
              <p className="text-sm text-gray-600 leading-relaxed text-center line-clamp-2">{item.description || item.about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopFamousThings;