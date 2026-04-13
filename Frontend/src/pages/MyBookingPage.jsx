import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const MyBookingPage = () => {
  const { backendUrl, getToursData } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  
  // Full Editing states
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ date: '', guests: '', selectedCars: [] });
  const [editAvailableCars, setEditAvailableCars] = useState(10);
  const [editCarSelection, setEditCarSelection] = useState({ type: '', quantity: '' });

  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelData, setCancelData] = useState({ reason: '', comment: '' });

  const getPriceFromType = (carType) => {
    return carType.includes('1200') ? 1200 : carType.includes('2000') ? 2000 : carType.includes('2500') ? 2500 : carType.includes('3000') ? 3000 : carType.includes('3500') ? 3500 : 1500;
  };

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
            cancelReason: b.cancelReason || '',
            cancelComment: b.cancelComment || '',
            cancelledBy: b.cancelledBy || '',
            bookingDate: new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN'),
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

  React.useEffect(() => {
    const fetchEditAvailability = async () => {
      if (editFormData.date && editingBookingId) {
        try {
          const response = await fetch(`${backendUrl}/api/booking/availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: editFormData.date })
          });
          const data = await response.json();
          if (data.success) {
            // Give back the cars that are already in the CURRENT booking to total available pool
            const originalBooking = bookings.find(b => b.id === editingBookingId);
            let currentBookingCarsCount = 0;
            if (originalBooking && originalBooking.date === editFormData.date) {
               currentBookingCarsCount = originalBooking.cars.reduce((sum, car) => sum + Number(car.quantity), 0);
            }
            setEditAvailableCars(data.availableCars + currentBookingCarsCount);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      } else {
        setEditAvailableCars(10);
      }
    };
    fetchEditAvailability();
  }, [editFormData.date, editingBookingId, backendUrl, bookings]);

  const handleEditAddCar = () => {
    const qty = Number(editCarSelection.quantity);
    if (!editCarSelection.type || isNaN(qty) || qty <= 0) return;
    
    const currentTotalCars = editFormData.selectedCars.reduce((sum, car) => sum + Number(car.quantity), 0);
    const maxCarsAllowed = Math.ceil(Number(editFormData.guests) / 4);

    if (currentTotalCars + qty > maxCarsAllowed) {
      toast.error(`For ${editFormData.guests} guest(s), you can only book up to ${maxCarsAllowed} vehicle(s).`);
      return;
    }
    if (currentTotalCars + qty > editAvailableCars) {
      toast.error(`Only ${editAvailableCars} car(s) available on this date.`);
      return;
    }
    
    const existingIndex = editFormData.selectedCars.findIndex(c => c.type === editCarSelection.type);
    let updatedCars = [...editFormData.selectedCars];
    if (existingIndex >= 0) {
      updatedCars[existingIndex].quantity = Number(updatedCars[existingIndex].quantity) + qty;
    } else {
      updatedCars.push({ type: editCarSelection.type, quantity: qty });
    }
    setEditFormData({ ...editFormData, selectedCars: updatedCars });
    setEditCarSelection({ type: '', quantity: '' });
  };

  const handleEditRemoveCar = (index) => {
    const updatedCars = editFormData.selectedCars.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, selectedCars: updatedCars });
  };

  const openEditMode = (booking) => {
    setEditingBookingId(booking.id);
    setEditFormData({ 
      date: booking.date, 
      guests: booking.guests, 
      selectedCars: [...booking.cars] 
    });
    setCancellingBookingId(null);
  };

  const processCancel = async () => {
    if (!cancelData.reason) {
      toast.warning("Please select a reason for cancellation.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/booking/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          id: cancellingBookingId, 
          reason: cancelData.reason, 
          comment: cancelData.comment 
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Booking Cancelled");
        setCancellingBookingId(null);
        setCancelData({ reason: '', comment: '' });
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
       toast.error("Failed to cancel booking");
    }
  };

  const handleCancelBookingClick = (bookingId) => {
    setCancellingBookingId(bookingId);
    setCancelData({ reason: '', comment: '' });
  };

  const handleSaveEdit = async () => {
    if (!editFormData.date || !editFormData.guests || editFormData.selectedCars.length === 0) {
      toast.warning("Please fill all details and select at least one vehicle.");
      return;
    }

    const totalCapacity = editFormData.selectedCars.reduce((sum, car) => sum + (car.type.includes('6 Seater') ? 6 : 4) * car.quantity, 0);
    if (Number(editFormData.guests) > totalCapacity) {
      toast.error(`You selected vehicles for ${totalCapacity} guests, but entered ${editFormData.guests} guests.`);
      return;
    }

    const totalCarPrice = editFormData.selectedCars.reduce((sum, car) => sum + (getPriceFromType(car.type) * car.quantity), 0);
    const tourPrice = 2000;
    const newTotalAmount = totalCarPrice + tourPrice;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/booking/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ 
             id: editingBookingId, 
             newDate: editFormData.date,
             newGuests: editFormData.guests,
             newSelectedCars: editFormData.selectedCars,
             newTotalAmount
          })
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Booking Order Updated! Price matched automatically.");
          setEditingBookingId(null);
          fetchBookings();
        } else {
          toast.error(data.message);
        }
    } catch (error) {
        toast.error("Failed to update order");
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
                        Tour Date: {new Date(booking.date).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-400 mt-1">Booked On: {booking.bookingDate}</p>
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
                    <div className="mt-6 flex flex-col gap-4">
                      
                      {/* Cancellation Form */}
                      {cancellingBookingId === booking.id ? (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                          <h4 className="text-sm font-bold text-red-800 mb-3">Cancel Booking?</h4>
                          <div className="mb-3">
                            <label className="block text-xs font-semibold text-red-700 mb-1">Reason for cancellation <span className="text-red-500">*</span></label>
                            <select 
                              value={cancelData.reason}
                              onChange={(e) => setCancelData({...cancelData, reason: e.target.value})}
                              className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                            >
                              <option value="" disabled>Select a reason...</option>
                              <option value="Change of travel plans">Change of travel plans</option>
                              <option value="Found a better deal somewhere else">Found a better deal somewhere else</option>
                              <option value="Health or Medical issues">Health or Medical issues</option>
                              <option value="Financial constraints">Financial constraints</option>
                              <option value="Other / Prefer not to say">Other / Prefer not to say</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-xs font-semibold text-red-700 mb-1">Additional Comments (Optional)</label>
                            <textarea 
                              rows="2"
                              value={cancelData.comment}
                              onChange={(e) => setCancelData({...cancelData, comment: e.target.value})}
                              placeholder="Tell us more about why you're cancelling..."
                              className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white resize-none"
                            ></textarea>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={processCancel}
                              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                            >
                              Confirm Cancellation
                            </button>
                            <button 
                              onClick={() => setCancellingBookingId(null)}
                              className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition"
                            >
                              Go Back
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 items-center">
                          <button 
                            onClick={() => handleCancelBookingClick(booking.id)}
                            className="px-5 py-2 text-sm font-semibold rounded-lg text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition"
                          >
                            Cancel Booking
                          </button>
                          
                          <button 
                            onClick={() => openEditMode(booking)}
                            className="px-5 py-2 text-sm font-semibold rounded-lg text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition"
                          >
                            Edit Features
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Full Edit Form */}
                  {editingBookingId === booking.id && (
                     <div className="mt-6 p-5 sm:p-6 bg-blue-50/40 border border-blue-100 rounded-xl">
                       <div className="flex items-center justify-between mb-4">
                         <h4 className="text-lg font-bold text-gray-900">Edit Your Booking</h4>
                         <button onClick={() => setEditingBookingId(null)} className="text-gray-400 hover:text-gray-600 font-bold p-1">✕</button>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                         <div>
                           <label className="block text-xs font-semibold text-gray-700 mb-1">New Tour Date</label>
                           <input 
                             type="date" 
                             min={minDate} max={maxDate}
                             value={editFormData.date} 
                             onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                             className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-semibold text-gray-700 mb-1">Guests</label>
                           <input 
                             type="number" min="1"
                             value={editFormData.guests} 
                             onChange={(e) => setEditFormData({...editFormData, guests: e.target.value})}
                             className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                           />
                         </div>
                       </div>

                       {/* Cars List Edit */}
                       <label className="block text-xs font-semibold text-gray-700 mb-2 mt-4">Selected Vehicles</label>
                       {editFormData.selectedCars.map((car, index) => (
                         <div key={index} className="flex justify-between items-center bg-white p-2.5 mb-2 rounded border border-gray-200 text-sm">
                           <div className="font-medium text-gray-800">{car.type.split(' - ')[0]} <span className="text-gray-500 text-xs">(Qty: {car.quantity})</span></div>
                           <button onClick={() => handleEditRemoveCar(index)} className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 rounded transition">X</button>
                         </div>
                       ))}
                       
                       {/* Add Car UI inline */}
                       <div className="flex gap-2 mb-4 mt-3 flex-wrap sm:flex-nowrap items-end">
                         <div className="flex-1 w-full min-w-[200px]">
                           <select
                             value={editCarSelection.type}
                             onChange={(e) => setEditCarSelection({...editCarSelection, type: e.target.value})}
                             className="w-full py-2.5 px-3 block shadow-sm border-gray-300 rounded-lg border bg-white focus:outline-none focus:border-blue-500 text-xs"
                           >
                              <option value="" disabled hidden>Select car to add...</option>
                              <optgroup label="Standard">
                                <option value="Sedan (Dzire/Etios) - Non AC - 4 Seater - 1200">Sedan Non AC - ₹1,200</option>
                                <option value="Sedan (Dzire/Etios) - AC - 4 Seater - 1500">Sedan AC - ₹1,500</option>
                              </optgroup>
                              <optgroup label="SUV">
                                <option value="SUV (Innova/Ertiga) - Non AC - 6 Seater - 2000">SUV Non AC - ₹2,000</option>
                                <option value="SUV (Innova/Ertiga) - AC - 6 Seater - 2500">SUV AC - ₹2,500</option>
                              </optgroup>
                              <optgroup label="Premium / Luxury">
                                <option value="Premium SUV (Innova Crysta) - Non AC - 6 Seater - 3000">Crysta Non AC - ₹3,000</option>
                                <option value="Premium SUV (Innova Crysta) - AC - 6 Seater - 3500">Crysta AC - ₹3,500</option>
                                <option value="Luxury Sedan (Honda City) - Non AC - 4 Seater - 2500">City Non AC - ₹2,500</option>
                                <option value="Luxury Sedan (Honda City) - AC - 4 Seater - 3000">City AC - ₹3,000</option>
                              </optgroup>
                           </select>
                         </div>
                         <div className="w-16 flex-shrink-0">
                           <input type="number" min="1" placeholder="Qty" value={editCarSelection.quantity} onChange={(e) => setEditCarSelection({...editCarSelection, quantity: e.target.value})} className="w-full py-2.5 px-2 border-gray-300 rounded-lg border bg-white text-xs text-center focus:outline-none focus:border-blue-500"/>
                         </div>
                         <button onClick={handleEditAddCar} className="py-2.5 px-4 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors">+ Add</button>
                       </div>
                       
                       <div className="border-t border-gray-200 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                         <p className="text-xs text-gray-500">
                           New Price Approx: <span className="font-bold text-gray-900 text-sm">₹{(editFormData.selectedCars.reduce((s,c) => s + (getPriceFromType(c.type) * c.quantity), 0) + 2000).toLocaleString()}</span>
                         </p>
                         <div className="flex gap-2 w-full sm:w-auto">
                           <button onClick={handleSaveEdit} className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow">Save Changes</button>
                         </div>
                       </div>
                     </div>
                  )}

                  {/* Show Cancel Info if Cancelled */}
                  {booking.status === 'Cancelled' && booking.cancelReason && (
                    <div className="mt-5 p-4 bg-red-50/50 border border-red-100 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">Cancellation Reason</h4>
                        {booking.cancelledBy && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">By {booking.cancelledBy}</span>
                        )}
                      </div>
                      <p className="text-sm text-red-900 font-medium">{booking.cancelReason}</p>
                      {booking.cancelComment && (
                        <p className="text-sm text-red-700 italic mt-1">"{booking.cancelComment}"</p>
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
