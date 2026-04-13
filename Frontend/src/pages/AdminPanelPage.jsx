import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const formatIN = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '--';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const AdminPanelPage = () => {
    const { tours, getToursData, backendUrl } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    const [bookings, setBookings] = useState([]);
    
    // Add Tour States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Temple');
    const [image, setImage] = useState(null);

    // Admin Cancellation UI state
    const [adminCancelId, setAdminCancelId] = useState(null);
    const [adminCancelData, setAdminCancelData] = useState({ reason: '', comment: '' });

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (activeTab === 'bookings' || activeTab === 'dashboard') fetchBookings();
    }, [activeTab, isAuthenticated]);

    const checkAuth = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/admin/is-auth`, { 
                headers: {
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                credentials: 'include' 
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                if(data.token) localStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
                toast.success("Admin Logged In");
            } else {
                toast.error(data.message || "Invalid Credentials");
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed");
        }
    };

    const handleLogout = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/admin/logout`, { 
                method: 'POST',
                headers: {
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                credentials: 'include' 
            });
            const data = await res.json();
            if (data.success) {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/booking/all`, {
                headers: { 
                    'Content-Type': 'application/json',
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                const reversed = [...(data.bookings || [])].reverse();
                setBookings(reversed);
            } else if (data.message === "Not Authorized") {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Error fetching bookings");
        }
    };

    const handleAddTour = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const productData = { name, description, category, inStock: true };
        formData.append('productData', JSON.stringify(productData));
        if (image) formData.append('images', image);

        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/product/add`, {
                method: 'POST',
                headers: {
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Tour Added Successfully");
                setName(''); setDescription(''); setImage(null);
                getToursData();
            } else {
                toast.error(data.message || "Failed to add tour");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adding tour");
        }
    };

    const handleDeleteTour = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?")) return;
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/product/remove`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                body: JSON.stringify({ id }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Tour Deleted Successfully");
                getToursData();
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting tour");
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/booking/status`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                body: JSON.stringify({ id, status }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Booking Status Updated");
                fetchBookings();
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    };

    const confirmAdminCancel = async (id) => {
        if (!adminCancelData.reason) {
            toast.warning("Please select a cancellation reason");
            return;
        }
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/booking/status`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                body: JSON.stringify({ id, status: 'Cancelled', reason: adminCancelData.reason, comment: adminCancelData.comment }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Booking Cancelled Successfully");
                setAdminCancelId(null);
                setAdminCancelData({ reason: '', comment: '' });
                fetchBookings();
            } else {
                toast.error(data.message || "Failed to cancel");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error cancelling booking");
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Delete this booking order entirely?")) return;
        try {
            const adminToken = localStorage.getItem('adminToken');
            const res = await fetch(`${backendUrl}/api/booking/remove`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
                },
                body: JSON.stringify({ id }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Booking Deleted Successfully");
                fetchBookings();
            } else {
                toast.error(data.message || "Failed to delete booking");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting booking");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please sign in to access the control panel
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label className="sr-only">Email address</label>
                                <input name="email" type="email" required className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Admin Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="sr-only">Password</label>
                                <input name="password" type="password" required className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white shadow-lg flex-shrink-0 z-10">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                        Admin Panel
                    </h2>
                </div>
                <nav className="p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('addTour')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'addTour' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                        Add New Tour
                    </button>
                    <button 
                        onClick={() => setActiveTab('tours')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'tours' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                        Manage Tours
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'bookings' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                        Booking Orders
                    </button>
                    
                    <div className="pt-8 mt-8 border-t border-gray-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-red-600 hover:bg-red-50"
                        >
                            Logout Session
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                
                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">System Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length > 0 ? bookings.length : '--'}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Tour View */}
                {activeTab === 'addTour' && (
                    <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Add New Tour</h1>
                        <form onSubmit={handleAddTour} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tour Name</label>
                                    <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="E.g., Kashi Vishwanath Temple" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none">
                                        <option value="Temple">Temple</option>
                                        <option value="Ghat">Ghat</option>
                                        <option value="Fast Food">Fast Food</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Sweet">Sweet</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">About / Description</label>
                                <textarea value={description} onChange={e=>setDescription(e.target.value)} required rows="4" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Detailed tour description..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Image</label>
                                <input type="file" onChange={e=>setImage(e.target.files[0])} accept="image/*" className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all"/>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:-translate-y-0.5 transition-all">
                                Publish Tour
                            </button>
                        </form>
                    </div>
                )}

                {/* Manage Tours View */}
                {activeTab === 'tours' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Manage Tours</h1>
                            <button onClick={()=>setActiveTab('addTour')} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition-colors text-sm">
                                + Add Tour
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold rounded-tl-xl border-b border-gray-200">Tour Details</th>
                                        <th className="p-4 font-semibold border-b border-gray-200">Category</th>
                                        <th className="p-4 font-semibold rounded-tr-xl border-b border-gray-200 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tours.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-10 text-gray-500">No tours available. Fetching data or database empty.</td>
                                        </tr>
                                    ) : (
                                        tours.map((tour, idx) => {
                                            return (
                                                <tr key={tour._id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 flex items-center gap-4">
                                                        {tour.image ? (
                                                            <img src={tour.image} alt={tour.name} className="w-12 h-12 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-gray-800">{tour.name}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{tour.description || tour.about}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-600">{tour.category}</td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => handleDeleteTour(tour._id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Booking Orders View */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-800">Booking Orders</h1>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {bookings.length === 0 ? (
                                <p className="text-center py-10 text-gray-500">No booking orders found.</p>
                            ) : (
                                bookings.map((booking, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-xs">Order #{booking._id?.slice(-6) || idx}</span>
                                                <span className="text-sm font-medium text-gray-500">Booked On: {formatIN(booking.createdAt || Date.now())}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">{booking.name} <span className="text-sm font-normal text-gray-500">({booking.email})</span></h3>
                                            <p className="text-gray-600 text-sm">Tour Date: <span className="font-semibold text-gray-900">{booking.date ? `${formatIN(booking.date)} to ${formatIN(new Date(new Date(booking.date).getTime() + 86400000).toISOString().split('T')[0])} (2 Days Tour)` : '--'}</span> | Guests: <span className="font-semibold">{booking.guests}</span></p>
                                            <p className="text-gray-600 text-sm">
                                                Total: <span className="font-bold text-gray-900">₹{booking.totalAmount.toLocaleString()}</span> 
                                                {booking.refundAmount > 0 && <span className="font-bold text-green-600 ml-2">(Refunded: ₹{booking.refundAmount.toLocaleString()})</span>}
                                                | Status: <span className={`font-bold ml-1 ${booking.status === 'Cancelled' ? 'text-red-500' : booking.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>{booking.status}</span>
                                            </p>
                                            {booking.status === 'Cancelled' && booking.cancelReason && (
                                                <div className="mt-2 p-2 bg-red-50 rounded border border-red-100 text-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-red-700">Reason:</span>
                                                        {booking.cancelledBy && <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{booking.cancelledBy}</span>}
                                                    </div>
                                                    <span className="text-red-600 block">{booking.cancelReason}</span>
                                                    {booking.cancelComment && <p className="text-red-500 text-xs italic mt-1 pb-1">"{booking.cancelComment}"</p>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 justify-center min-w-[150px]">
                                            <select 
                                                value={booking.status || 'Booking Placed'}
                                                onChange={(e) => {
                                                    if (e.target.value === 'Cancelled') {
                                                        setAdminCancelId(booking._id);
                                                        setAdminCancelData({ reason: '', comment: '' });
                                                    } else {
                                                        handleUpdateBookingStatus(booking._id, e.target.value);
                                                    }
                                                }}
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                                            >
                                                <option value="Booking Placed">Booking Placed</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <button onClick={() => handleDeleteBooking(booking._id)} className="w-full text-center text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors">
                                                Delete Order
                                            </button>
                                        </div>
                                        
                                        {/* Admin Cancellation Form */}
                                        {adminCancelId === booking._id && (
                                            <div className="w-full bg-red-50 p-4 border border-red-200 rounded-xl mt-4 md:col-span-full">
                                                <h4 className="text-sm font-bold text-red-800 mb-3">Provide Cancellation Reason</h4>
                                                <select 
                                                    value={adminCancelData.reason}
                                                    onChange={(e) => setAdminCancelData({...adminCancelData, reason: e.target.value})}
                                                    className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white mb-3 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                >
                                                    <option value="" disabled>Select a reason...</option>
                                                    <option value="Overbooked / Non-Availability">Overbooked / Non-Availability</option>
                                                    <option value="Customer requested cancellation manually">Customer requested cancellation manually</option>
                                                    <option value="Payment / Verification failure">Payment / Verification failure</option>
                                                    <option value="Weather / Security issues">Weather / Security issues</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <textarea 
                                                    value={adminCancelData.comment}
                                                    onChange={(e) => setAdminCancelData({...adminCancelData, comment: e.target.value})}
                                                    placeholder="Admin comments (Optional)"
                                                    className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                                                    rows="2"
                                                ></textarea>
                                                <div className="flex gap-2">
                                                    <button onClick={() => confirmAdminCancel(booking._id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition">Confirm Cancel</button>
                                                    <button onClick={() => setAdminCancelId(null)} className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg transition">Go Back</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanelPage;
