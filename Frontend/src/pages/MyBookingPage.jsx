import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const MyBookingPage = () => {
  const { backendUrl, getToursData } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [editingDateId, setEditingDateId] = useState(null);
  const [newDate, setNewDate] = useState('');

  // Date Constraints for change date
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const maxDate = nextMonth.toISOString().split('T')[0];

  const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/booking/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          // Map DB response to UI format
          const formattedBookings = data.bookings.map(b => ({
            id: b._id,
            date: b.date,
            tourTitle: b.tourTitle || 'Banaras Tour Package',
            status: b.status || 'Upcoming',
            totalAmount: b.totalAmount,
            guests: b.guests,
            cars: b.selectedCars || [],
            paymentStatus: b.payment ? 'Paid Online' : (b.paymentMethod === 'Offline' ? 'Pay on Arrival' : 'Pending'),
          }));
          setBookings(formattedBookings.reverse()); // latest first
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        toast.error("Failed to fetch bookings");
      }
    };
  
  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this tour booking?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/booking/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ id: bookingId })
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Booking Cancelled");
          fetchBookings();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to cancel booking");
      }
    }
  };

  const handleDateChange = async (bookingId) => {
    if (!newDate) {
      toast.warning("Please select a new date.");
      return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/booking/change-date`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ id: bookingId, newDate })
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Booking Date Updated!");
          setEditingDateId(null);
          setNewDate('');
          fetchBookings();
        } else {
          toast.error(data.message);
        }
    } catch (error) {
        toast.error("Failed to change date");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4 sm:px-10 md:px-20 lg:px-30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Booking</span>
            </h1>
            <p className="mt-2 text-gray-600">View and manage all your past and upcoming tours.</p>
          </div>
          <Link 
            to="/booking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition"
          >
            + New Booking
          </Link>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative"
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-10">
                  <span 
                    className={`inline-flex items-center px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow-sm bg-gray-50/90 backdrop-blur-sm ${
                      booking.status === 'Upcoming' || booking.status === 'Completed' || booking.status === 'BOOKING PLACED'
                        ? 'text-green-600 border border-green-200' 
                        : booking.status === 'Cancelled'
                          ? 'text-red-600 border border-red-200'
                          : 'text-gray-600 border border-gray-200'
                    }`}
                  >
                    {(booking.status === 'Upcoming' || booking.status === 'Completed' || booking.status === 'BOOKING PLACED') && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>}
                    {booking.status === 'Cancelled' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                    {booking.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col mb-4">
                    <div className="mb-4 pr-24 sm:pr-32">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">{booking.tourTitle}</h2>
                      <p className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {booking.date}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">₹{booking.totalAmount.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">{booking.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Summary Footer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-600">
                    <div className="overflow-hidden">
                      <span className="block text-gray-400 font-medium text-[10px] sm:text-xs uppercase mb-1">Booking ID</span>
                      <span className="block font-semibold text-gray-800 break-all text-xs sm:text-sm">{booking.id}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium text-[10px] sm:text-xs uppercase mb-1">Guests</span>
                      <span className="font-semibold text-gray-800 text-sm">{booking.guests} Person{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <span className="block text-gray-400 font-medium text-[10px] sm:text-xs uppercase mb-1">Vehicles Selected</span>
                      <div className="flex flex-wrap gap-2">
                        {booking.cars.map((car, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] sm:text-xs font-medium text-gray-700">
                            {car.quantity}x {car.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {(booking.status === 'Upcoming' || booking.status === 'Booking Placed' || booking.status === 'BOOKING PLACED' || booking.status === 'Confirmed') && (
                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-5 py-2 text-sm font-semibold rounded-lg text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition"
                      >
                        Cancel Booking
                      </button>
                      
                      {editingDateId === booking.id ? (
                         <div className="flex items-center gap-2">
                           <input 
                             type="date" 
                             min={minDate}
                             max={maxDate}
                             value={newDate} 
                             onChange={(e) => setNewDate(e.target.value)}
                             className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                           />
                           <button 
                             onClick={() => handleDateChange(booking.id)}
                             className="px-3 py-1.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition"
                           >
                             Save
                           </button>
                           <button 
                             onClick={() => { setEditingDateId(null); setNewDate(''); }}
                             className="px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                           >
                             Cancel
                           </button>
                         </div>
                      ) : (
                        <button 
                          onClick={() => {
                             setEditingDateId(booking.id);
                             setNewDate(booking.date);
                          }}
                          className="px-5 py-2 text-sm font-semibold rounded-lg text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition"
                        >
                          Change Date
                        </button>
                      )}
                    </div>
                  )}


                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm border-dashed">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">It looks like you haven't booked any tours with us yet. Start exploring the beauty of Banaras today!</p>
            <Link 
              to="/booking"
              className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold shadow-md bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition"
            >
              Explore Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingPage;
