import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import LoginPage from './pages/LoginPage';
import AdminPanelPage from './pages/AdminPanelPage';

const App = () => {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/tour' element={<TourPage />} />
        <Route path='/tour/:speciality' element={<TourPage />} />
        <Route path='/place/:id' element={<PlaceDetailsPage />} />
        <Route path='/contact' element={<ContactUsPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/booking' element={<BookingPage />} />
        <Route path='/my-bookings' element={<MyBookingPage />} />
        <Route path='/my-profile' element={<MyProfilePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPanelPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
