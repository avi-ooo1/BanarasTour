import React from 'react';
import banner from '../assets/BannerAssets/banner.png';

const Banner = () => {
  return (
    <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-30 mt-4 sm:mt-5 mb-0">
      <img
        src={banner}
        alt="Banaras Scenic View"
        className="w-full h-64 sm:h-150 object-cover rounded-lg shadow-md"
      />
    </div>
  );
};

export default Banner;