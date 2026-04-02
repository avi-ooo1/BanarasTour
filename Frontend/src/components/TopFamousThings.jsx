import React from 'react'
import { useNavigate } from 'react-router-dom'
import { topFamousData } from '../assets/assets'

const TopFamousThings = () => {
  const navigate = useNavigate();

  const getSpeciality = (item) => {
    const id = item.id;
    if (!id) return 'Temple'; 
    if (id.startsWith('temple')) return 'Temple';
    if (id.startsWith('shopping')) return 'Shopping';
    if (id.startsWith('entertainment')) return 'Entertainment';
    if (id === 'food1' || item.name.includes('Paan')) return 'Sweet';
    if (id === 'food2' || item.name.includes('Chaat')) return 'Fast Food';
    if (id === 'food3' || item.name.includes('Maliyo')) return 'Sweet';
    if (id === 'event1' || item.name.includes('Aarti')) return 'Ghat';
    return 'Temple';
  };

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 lg:ml-30 lg:mr-30'>
      <h1 className='text-3xl font-medium'>Top Famous Things</h1>
      <p className='sm:w-1/3 text-center text-sm'>Discover the most popular and must-visit attractions in Banaras.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 px-4 sm:px-0">
        {topFamousData.slice(0, 10).map((item, index) => (
          <div 
            key={item.id || index} 
            onClick={() => navigate(`/tour/${getSpeciality(item)}`)}
            className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img className="h-[200px] w-full object-cover" src={item.image} alt={item.name} />
            <div className="p-4">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">{item.name}</h5>
              <p className="text-sm text-gray-600 leading-relaxed text-center line-clamp-2">{item.about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopFamousThings;