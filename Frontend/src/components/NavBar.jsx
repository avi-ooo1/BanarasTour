import React, { useState, useContext } from 'react';
import logo from '../assets/NavbarAssets/logo.png';
import dropdownIcon from '../assets/Dropdown-icon.png';
import { useNavigate, NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { isAuth, setIsAuth, setUserData, backendUrl } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success || data.message === "Not Authorized") {
        setIsAuth(false);
        setUserData(null);
        toast.success("Logged Out Successfully");
        navigate('/');
      } else {
        toast.error("Logout failed: " + data.message);
      }
    } catch (error) {
      console.error('Logout error', error);
      // Force logout on frontend anyway if network fails
      setIsAuth(false);
      setUserData(null);
      toast.success("Logged Out Successfully");
    }
  };

  return (
    <div className='flex justify-between items-center text-sm border-b py-4 mb-5 mx-4 md:mx-10 lg:mx-20 border-b-gray-400 lg:ml-30 lg:mr-30 relative'>
      {/* Logo and Title */}
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
        <img
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
          src={logo}
          alt="Logo"
        />
        <h1 className="sm:block text-xl md:text-2xl font-bold text-gray-700">BANARAS TOUR</h1>
      </div>

      {/* Mobile Search Bar & Profile (Compact, Visible on Front) */}
      <div className='flex md:hidden flex-1 justify-center items-center gap-3 px-2'>
        <div className="flex items-center border pl-3 gap-1  bg-white border-gray-500/30 h-9 rounded-full overflow-hidden w-full max-w-[180px] sm:max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="#6B7280">
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>
          <input type="text" placeholder="Search..." className="w-full h-full outline-none text-xs text-gray-500 bg-transparent" />
        </div>
        <div>
          
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className='hidden md:flex flex-1 justify-center px-4 lg:px-20'>
        <div className="flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden w-full max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="#6B7280">
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>
          <input type="text" placeholder="Search..." className="w-full h-full outline-none text-sm text-gray-500 bg-transparent" />
          <button type="button" className="bg-gray-500 h-9 px-6 rounded-full text-sm text-white mr-[5px] hover:bg-gray-600 transition-colors">Search</button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        <NavLink to='/' className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to='/tour' className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
          <p>TOUR</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to='/about' className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to='/contact' className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to='/booking' className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
          <p>BOOKING</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
       
        <div className='flex items-center gap-4'>
           {
          isAuth 
          ? <div className="flex items-center gap-1 cursor-pointer group relative">
            <img className="w-8 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="" />
            <img className="w-6 mt-2" src={dropdownIcon} alt="Dropdown" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={()=>navigate('/my-bookings')} className='hover:text-black cursor-pointer'>My Bookings</p>
                <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div> 
          </div>
          : <button onClick={()=>navigate('/login')} className="cursor-pointer px-8 py-3 bg-gray-500 hover:bg-gray-600 transition text-white  rounded-full text-sm">Create account</button>
        }
        
        </div>
        
      </div>

      {/* Hamburger Menu Icon (Mobile) */}
      <button
        className="md:hidden p-2 text-gray-600 focus:outline-none"
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Click Outside Overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-transparent cursor-default" 
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[100px] transition-all duration-300 ease-in-out md:hidden ${showMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <div className="flex flex-col p-4 gap-3 text-sm font-medium text-gray-700">
          <NavLink to='/' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
            HOME
          </NavLink>
          {
            isAuth && (
              <>
                <NavLink to='/my-profile' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
                  MY PROFILE
                </NavLink>
                <NavLink to='/my-bookings' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
                  MY BOOKINGS
                </NavLink>
              </>
            )
          }
          <NavLink to='/tour' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
            TOUR
          </NavLink>
          <NavLink to='/about' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
            ABOUT
          </NavLink>
          <NavLink to='/contact' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
            CONTACT
          </NavLink>
          <NavLink to='/booking' onClick={() => setShowMenu(false)} className="hover:text-blue-500 py-1 transition">
            BOOKING
          </NavLink>
          <div className="mt-2 pt-3 border-t border-gray-100">
            {
              isAuth
              ? <button onClick={()=>{handleLogout(); setShowMenu(false);}} className="cursor-pointer text-center hover:bg-gray-600 bg-gray-500 text-white rounded-full py-1 w-full transition font-medium">Logout</button>
              :<button onClick={()=>{navigate('/login'); setShowMenu(false);}} className="w-full bg-gray-500 hover:bg-gray-600 transition text-white rounded text-xs py-2 px-4 shadow-sm">Create account</button>
            }
          </div>
        </div>
      </div>

    </div>
  );
}

export default Navbar;