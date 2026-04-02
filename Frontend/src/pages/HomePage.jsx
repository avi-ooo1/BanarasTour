import React from 'react';
import Navbar from '../components/NavBar';
import Banner from '../components/Banner';

const HomePage = () => {
  return (
    <div className='bg-white min-h-screen'>
      <Navbar />
      <Banner />
    </div>
  );
};

export default HomePage;