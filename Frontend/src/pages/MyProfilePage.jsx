import React, { useState } from 'react';

const MyProfilePage = () => {
    const [userData, setUserData] = useState({
        name: "Richard James",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
        email: "richardjames@gmail.com",
        phone: "+91 98765 43210",
        address: {
            line1: "57th Cross, Richmond block",
            line2: "Varanasi, Uttar Pradesh, India - 221005",
        },
        gender: "Male",
        dob: "1995-05-15",
    });

    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className="bg-gray-50 min-h-[90vh] py-12 px-4 sm:px-10 lg:px-20">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center md:text-left border-b border-gray-200 pb-5">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                        My{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 relative">
                            Profile
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-3 font-medium text-lg">Manage your personal information, details, and presence.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Panel: Profile Quick View */}
                    <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 relative">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,100 C30,60 70,60 100,100 L100,0 L0,0 Z" fill="white"/>
                                </svg>
                            </div>
                        </div>
                        
                        <div className="px-6 pb-6 relative text-center">
                            <div className="relative inline-block -mt-16 mb-4">
                                <img 
                                    src={userData.image} 
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg mx-auto" 
                                    alt="User Profile"
                                />
                                {isEdit && (
                                    <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer border border-gray-100 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {isEdit ? (
                                <input 
                                    type="text" 
                                    value={userData.name}
                                    onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}
                                    className="text-2xl font-bold text-gray-800 text-center w-full border-b border-orange-200 focus:outline-none focus:border-orange-500 bg-orange-50/30 rounded px-2 py-1 mx-auto max-w-[200px]" 
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                            )}
                            <p className="text-gray-500 mt-1 mb-6 text-sm">{userData.email}</p>
                            
                            {!isEdit ? (
                                <button 
                                    onClick={() => setIsEdit(true)}
                                    className="w-full py-2.5 rounded-full border border-orange-500 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white transition-all shadow-sm flex justify-center items-center gap-2 text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsEdit(false)}
                                        className="w-1/2 py-2.5 rounded-full border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsEdit(false);
                                            alert("Saved Successfully!");
                                        }}
                                        className="w-1/2 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-all text-sm"
                                    >
                                        Save Update
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between text-sm mb-4">
                                    <span className="text-gray-500">Account Status</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold flex items-center gap-1.5 border border-green-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="font-semibold text-gray-800">January 2023</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Detailed Info */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {/* Contact Info Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                Contact Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="text-gray-800 font-medium">{userData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                                    {isEdit ? (
                                        <input 
                                            type="text" 
                                            value={userData.phone}
                                            onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    ) : (
                                        <p className="text-gray-800 font-medium">{userData.phone}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Address</p>
                                    {isEdit ? (
                                        <div className="space-y-3">
                                            <input 
                                                type="text" 
                                                value={userData.address.line1}
                                                onChange={e => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            />
                                            <input 
                                                type="text" 
                                                value={userData.address.line2}
                                                onChange={e => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-800 font-medium leading-relaxed">
                                            {userData.address.line1} <br/> {userData.address.line2}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Info Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                <span className="bg-red-100 text-red-500 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                Basic Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                                    {isEdit ? (
                                        <select 
                                            value={userData.gender}
                                            onChange={e => setUserData(prev => ({...prev, gender: e.target.value}))}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-800 font-medium">{userData.gender}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                                    {isEdit ? (
                                        <input 
                                            type="date" 
                                            value={userData.dob}
                                            onChange={e => setUserData(prev => ({...prev, dob: e.target.value}))}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        />
                                    ) : (
                                        <p className="text-gray-800 font-medium">
                                            {new Date(userData.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;