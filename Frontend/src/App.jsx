import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components that should load immediately
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const TourPage = lazy(() => import('./pages/TourPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyBookingPage = lazy(() => import('./pages/MyBookingPage'));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'));
const PlaceDetailsPage = lazy(() => import('./pages/PlaceDetailsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'));

// Simple loading fallback
const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const App = () => {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader />}>
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
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;

