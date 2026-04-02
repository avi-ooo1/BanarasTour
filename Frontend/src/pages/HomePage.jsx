import React from 'react';
import Banner from '../components/Banner';
import SpecialityMenu from '../components/SpecialityMenu';
import TopFamousThings from '../components/TopFamousThings';
import LowerBanner from '../components/LowerBanner';

const HomePage = () => {
  return (
    <div className='bg-white min-h-screen'>
     
      <Banner />
      <SpecialityMenu />
      <TopFamousThings />
      <LowerBanner />
    </div>
  );
};

export default HomePage;