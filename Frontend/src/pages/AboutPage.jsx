import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20 px-4 sm:px-10 md:px-20 lg:px-30">
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Images & Trust Badge */}
        <div className="relative w-full lg:w-1/2 flex-1 shrink-0">
          <img 
            className="w-full h-auto object-cover rounded-2xl shadow-xl border-4 border-white"
            src="https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=800&auto=format&fit=crop"
            alt="Evening Ganga Aarti in Varanasi" 
          />
          
          {/* Trust Badge overlay */}
          <div className="flex flex-col items-center justify-center gap-1 absolute -bottom-6 -right-2 sm:bottom-8 sm:-right-8 bg-white p-5 rounded-xl shadow-lg border border-gray-100 transform rotate-2 hover:rotate-0 transition-all duration-300">
             <div className="flex items-center justify-center bg-orange-100 text-orange-600 rounded-full w-12 h-12 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <p className="font-bold text-gray-900 text-lg">3000+ Years</p>
             <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Oldest Living City</p>
          </div>
        </div>

        {/* Right Side: Copy & Call to Action */}
        <div className="w-full lg:w-1/2 flex-1 pt-8 lg:pt-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-6 uppercase tracking-wider">
            City of Light
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The Eternal City of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Banaras</span>
          </h1>
          
          <div className="w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 mb-8"></div>
          
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
            <p>
              Varanasi, also famously known as <strong>Banaras</strong> or <strong>Kashi</strong>, is not merely a city; it is a profound spiritual experience. Situated on the sacred banks of the River Ganges, it stands as one of the world's oldest continually inhabited cities, radiating a culture that has thrived for over 3,000 years.
            </p>
            <p>
              Every dawn, life in Kashi awakens by the ghats with the rhythmic chanting of ancient mantras and the chiming of temple bells. From the mesmerizing evening <em>Ganga Aarti</em> at Dashashwamedh Ghat to the quiet, narrow alleys steeped in philosophy, music, and exquisite silk craftsmanship, Banaras is an awakening of the soul.
            </p>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-gray-800 font-medium">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-4 shrink-0 shadow-sm border border-orange-200">ॐ</span> 
                Spiritual Heart of India
              </li>
              <li className="flex items-center text-gray-800 font-medium">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-4 shrink-0 shadow-sm border border-orange-200">༄</span> 
                84 Historic Ghats along the Ganges
              </li>
              <li className="flex items-center text-gray-800 font-medium">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-4 shrink-0 shadow-sm border border-orange-200">✧</span> 
                World-Renowned Banarasi Silk & Culture
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link 
              to="/tour" 
              className="px-8 py-3.5 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              Explore City Tours
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}

export default AboutPage;