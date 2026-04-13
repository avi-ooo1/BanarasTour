import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const { setIsAuth, setUserData, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [state, setState] = useState('Login');
    
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [gender, setGender] = useState('Male');
    const [dob, setDob] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const url = state === 'Sign Up' ? `${backendUrl}/api/user/register` : `${backendUrl}/api/user/login`;
            
            // Backend register expects: {name, email, password}
            const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            
            if (data.success) {
                // Save token in browser storage
                if (data.token) localStorage.setItem('token', data.token);
                setIsAuth(true);
                setUserData(data.user);
                toast.success(state === 'Sign Up' ? "Registered Successfully!" : "Logged In Successfully!");
                navigate('/');
            } else {
                toast.error(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error("Auth error", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const googleLoginHandler = async (credentialResponse) => {
        try {
            const response = await fetch(`${backendUrl}/api/user/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });
            const data = await response.json();
            
            if (data.success) {
                if (data.token) localStorage.setItem('token', data.token);
                setIsAuth(true);
                setUserData(data.user);
                toast.success("Authenticated with Google Successfully!");
                navigate('/');
            } else {
                toast.error(data.message || 'Google Auth failed');
            }
        } catch (error) {
            console.error("Google Auth error", error);
            toast.error("Google Authentication failed");
        }
    };

    return (
        <div className="bg-gray-50 min-h-[80vh] py-12 px-4 sm:px-10 flex items-center justify-center">
            <div className={`w-full bg-white rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden transition-all duration-500 ${state === 'Sign Up' ? 'max-w-4xl' : 'max-w-md'}`}>
                
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 relative">
                    <div className="absolute inset-0 opacity-20">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,100 C30,60 70,60 100,100 L100,0 L0,0 Z" fill="white"/>
                        </svg>
                    </div>
                </div>
                
                <div className="px-6 pb-8 relative -mt-10 bg-white mx-4 rounded-xl shadow-sm border border-gray-50 pt-8 z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 relative">
                                {state === 'Sign Up' ? "Create Account" : "Login"}
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-200/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-3 font-medium text-sm">
                            {state === 'Sign Up' 
                                ? "Complete your profile details to book your Banaras Tour" 
                                : "Please log in to manage your bookings"}
                        </p>
                    </div>

                    <form onSubmit={onSubmitHandler}>
                        {state === 'Sign Up' ? (
                            // --- SIGN UP GRID LAYOUT (Matches Profile Information) ---
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                {/* Left Column: Basic Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">
                                        <span className="bg-red-100 text-red-500 p-1.5 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </span>
                                        Personal Informaion
                                    </h3>
                                    
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                                        <input type="text" onChange={(e) => setName(e.target.value)} value={name} required 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                                            <select value={gender} onChange={e => setGender(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-medium">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                                            <input type="date" onChange={(e) => setDob(e.target.value)} value={dob} required 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm font-medium" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mt-6 mb-3 flex items-center gap-2">
                                        <span className="bg-gray-100 text-gray-600 p-1.5 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </span>
                                        Security Details
                                    </h3>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</p>
                                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all text-sm font-medium" />
                                    </div>
                                </div>

                                {/* Right Column: Contact Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 p-1.5 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </span>
                                        Contact Information
                                    </h3>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                                        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                                        <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} required 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address Line 1</p>
                                        <input type="text" onChange={(e) => setAddressLine1(e.target.value)} value={addressLine1} required 
                                            placeholder="House No., Street, Area"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium" />
                                        
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address Line 2</p>
                                        <input type="text" onChange={(e) => setAddressLine2(e.target.value)} value={addressLine2} required 
                                            placeholder="City, State, Zip Code"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // --- LOGIN SIMPLE LAYOUT ---
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                                    <input 
                                        type="email" onChange={(e) => setEmail(e.target.value)} value={email} required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 font-medium"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</p>
                                    <input 
                                        type="password" onChange={(e) => setPassword(e.target.value)} value={password} required 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-800 font-medium"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className={`mt-8 ${state === 'Sign Up' ? 'max-w-md mx-auto' : ''}`}>
                            <button 
                                type="submit"
                                className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm"
                            >
                                {state === 'Sign Up' ? "Create Account" : "Login"}
                            </button>

                            <div className="flex items-center gap-4 my-6">
                                <hr className="flex-1 border-gray-200" />
                                <span className="text-gray-400 text-xs font-medium uppercase">Or</span>
                                <hr className="flex-1 border-gray-200" />
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin 
                                    onSuccess={googleLoginHandler}
                                    onError={() => toast.error("Google login failed")}
                                    theme="filled_blue"
                                    shape="circle"
                                    width="100%"
                                />
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        {state === 'Sign Up' ? (
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <span onClick={() => setState('Login')} className="text-orange-600 cursor-pointer font-bold hover:underline transition-all">
                                    Login here
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Create a new account?{' '}
                                <span onClick={() => setState('Sign Up')} className="text-orange-600 cursor-pointer font-bold hover:underline transition-all">
                                    Click here
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
