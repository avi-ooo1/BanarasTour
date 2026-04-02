import React from 'react';
import { Link } from 'react-router-dom';
import  {specialityData} from '../assets/assets';

function SpecialityMenu() {
    // const navigate = useNavigate();

    return (
        <div  className='flex flex-col items-center gap-4 py-16 text-gray-800'>
            <h1 className='text-3xl font-mediam'>Find By Speciality</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted items, tour your beautiful banaras hassle-free.</p>

            <div className='flex sm:justify-center gap-4 md:gap-10 lg:gap-16  pt-5 w-full overflow-scroll'>
                {specialityData.map((item, index) => (
                    <Link onClick={()=>scrollTo(0,0)} className='text-center flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 ' key={index} to={`/tour/${item.speciality}`}>
                        <img className='w-24 h-24 ' src={item.image} alt={item.speciality} />
                        <p>{item.speciality}</p>
                    </Link>

                ))}
            </div>
        </div>
    );
}

export default SpecialityMenu;