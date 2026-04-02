import React from 'react';
import banner from '../assets/BannerAssets/banner.png';

const Banner = () => {
  return (
    <div className="mx-6 mt-5 mb-0 mr-25 ml-25">
      <img
        src={banner}
        alt="Banaras Scenic View"
        className="w-full h-150 object-cover rounded-lg shadow-md"
      />
    </div>
  );
};

export default Banner;