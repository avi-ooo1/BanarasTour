import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TourPage = () => {

    const { speciality } = useParams();
    const navigate = useNavigate();
    const { tours, searchTerm } = useContext(AppContext);
    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        if (!tours || tours.length === 0) return;

        let filtered = tours;

        // Apply category filter
        if (speciality) {
            filtered = filtered.filter(item => item.category === speciality);
        }

        // Apply search filter
        if (searchTerm) {
            const query = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(item => 
                (item.name && item.name.toLowerCase().includes(query)) || 
                (item.category && item.category.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.about && item.about.toLowerCase().includes(query))
            );
        }

        setDisplayData(filtered);
    }, [speciality, tours, searchTerm]);

  return (
    <div>
      <p className="text-gray-600 px-4 md:px-0 md:ml-30 text-center sm:text-left">Browse through the top famous list of places</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5 md:ml-30 md:mr-30 px-4 md:px-0">
        <div className="flex flex-row sm:flex-col gap-4 text-sm text-gray-600 sticky top-0 sm:top-20 py-2 sm:py-0 bg-white z-10 sm:z-auto flex-nowrap overflow-x-auto sm:overflow-visible w-full sm:w-auto pb-2 sm:pb-0">
          <p onClick={() => navigate(speciality === 'Temple' ? '/tour' : '/tour/Temple')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Temple' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Temple</p>
          <p onClick={() => navigate(speciality === 'Ghat' ? '/tour' : '/tour/Ghat')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Ghat' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Ghat</p>
          <p onClick={() => navigate(speciality === 'Fast Food' ? '/tour' : '/tour/Fast Food')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Fast Food' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Fast Food</p>
          <p onClick={() => navigate(speciality === 'Entertainment' ? '/tour' : '/tour/Entertainment')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Entertainment' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Entertainment</p>
          <p onClick={() => navigate(speciality === 'Shopping' ? '/tour' : '/tour/Shopping')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Shopping' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Shopping</p>
          <p onClick={() => navigate(speciality === 'Sweet' ? '/tour' : '/tour/Sweet')} className={`w-auto sm:w-auto px-4 py-1.5 sm:pl-3 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer shrink-0 ${speciality === 'Sweet' ? 'bg-indigo-100 text-black font-semibold' : ''}`}>Sweet</p>
        </div>
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0">
        {displayData.map((item, index) => (
          <div key={item._id || item.id || index} onClick={() => navigate(`/place/${item._id || item.id}`)} className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
            <img loading="lazy" className="h-[200px] w-full object-cover" src={Array.isArray(item.image) ? item.image[0] : item.image || 'https://via.placeholder.com/400x200'} alt={item.name} />
            <div className="p-4">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">{item.name}</h5>
              <p className="text-sm text-gray-600 leading-relaxed text-center line-clamp-2">{item.description || item.about}</p>
            </div>
          </div>
        ))}
      </div>
        </div>
      </div>
    </div>
  )
}

export default TourPage