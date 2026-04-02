import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import ContactUsPage from './pages/ContactUsPage';
import TourPage from './pages/TourPage';
import AboutPage from './pages/AboutPage';
import BookingPage from './pages/BookingPage';
import MyBookingPage from './pages/MyBookingPage';
import ScrollToTop from './components/ScrollToTop';
import MyProfilePage from './pages/MyProfilePage';


const App = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/tour' element={<TourPage />} />
        <Route path='/tour/:speciality' element={<TourPage />} />
        <Route path='/contact' element={<ContactUsPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/booking' element={<BookingPage />} />
        <Route path='/my-bookings' element={<MyBookingPage />} />
        <Route path='/my-profile' element={<MyProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
