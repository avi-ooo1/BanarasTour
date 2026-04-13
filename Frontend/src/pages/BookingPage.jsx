import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AppContext } from '../context/AppContext';
import bookingBanner from '../assets/BookingAssets/BookingBanner.png';

const BookingPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    selectedCars: [],
    paymentMethod: 'Online',
  });

  // Date Constraints: Prevent past dates, limit to 1 month in the future
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const maxDate = nextMonth.toISOString().split('T')[0];

  const getPriceFromType = (carType) => {
    return carType.includes('1200') ? 1200 : carType.includes('2000') ? 2000 : carType.includes('2500') ? 2500 : carType.includes('3000') ? 3000 : carType.includes('3500') ? 3500 : 1500;
  };

  const [currentCarSelection, setCurrentCarSelection] = useState({
    type: '',
    quantity: ''
  });

  const [availableCars, setAvailableCars] = useState(10);

  const [monthlyAvailability, setMonthlyAvailability] = useState({});

  useEffect(() => {
    const today = new Date();
    fetchMonthlyAvailability(today.getFullYear(), today.getMonth() + 1);
  }, [backendUrl]);

  const fetchMonthlyAvailability = async (year, month) => {
    try {
      const res = await fetch(`${backendUrl}/api/booking/monthly-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month })
      });
      const data = await res.json();
      if(data.success) {
         setMonthlyAvailability(prev => ({ ...prev, ...data.availabilityMap }));
      }
    } catch(e) {}
  };

  const handleMonthChange = (date) => {
    fetchMonthlyAvailability(date.getFullYear(), date.getMonth() + 1);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.date) {
        // Automatically rely on pre-fetched monthly availability to speed things up
        if (monthlyAvailability[formData.date] !== undefined) {
           setAvailableCars(monthlyAvailability[formData.date]);
           if (monthlyAvailability[formData.date] === 0) {
             toast.error("No tour available on this date.");
           } else if (monthlyAvailability[formData.date] < 10) {
             toast.info(`Note: Only ${monthlyAvailability[formData.date]} car(s) left for this date.`);
           }
        }
      } else {
        setAvailableCars(10);
      }
    };
    fetchAvailability();
  }, [formData.date, monthlyAvailability]);

  const renderDayContents = (day, date) => {
    const dateStr = [
       date.getFullYear(),
       (date.getMonth() + 1).toString().padStart(2, '0'),
       date.getDate().toString().padStart(2, '0')
    ].join('-');
    const availableCarsOnDate = monthlyAvailability[dateStr];
    
    const isPast = date < new Date(minDate);
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
        <span>{day}</span>
        {!isPast && availableCarsOnDate !== undefined && (
           <span className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${availableCarsOnDate === 0 ? 'bg-red-500 shadow-[0_0_4px_red]' : 'bg-green-500 shadow-[0_0_4px_green]'}`}></span>
        )}
      </div>
    );
  };


  const handleAddCar = () => {
    if (!formData.date) {
      toast.warning('Please select a date first to check availability.');
      return;
    }

    if (!formData.guests || Number(formData.guests) <= 0) {
      toast.warning('Please enter the number of guests first.');
      return;
    }

    const qty = Number(currentCarSelection.quantity);
    if (!currentCarSelection.type || isNaN(qty) || qty <= 0) return; // Prevent adding empty selection or invalid quantity
    
    // Check if adding this quantity exceeds availability
    const currentTotalCars = formData.selectedCars.reduce((sum, car) => sum + car.quantity, 0);
    const maxCarsAllowed = Math.ceil(Number(formData.guests) / 4);

    if (currentTotalCars + qty > maxCarsAllowed) {
      toast.error(`For ${formData.guests} guest(s), you can only book up to ${maxCarsAllowed} vehicle(s). Please choose vehicles accordingly.`);
      return;
    }
    if (currentTotalCars + qty > availableCars) {
      if (availableCars === 0) {
        toast.error("No tour available on this date.");
      } else {
        toast.error(`Only ${availableCars} car(s) available on this date.`);
      }
      return;
    }
    
    const existingIndex = formData.selectedCars.findIndex(c => c.type === currentCarSelection.type);
    
    if (existingIndex >= 0) {
      // Update quantity if already exists
      const updatedCars = [...formData.selectedCars];
      updatedCars[existingIndex].quantity += qty;
      setFormData({ ...formData, selectedCars: updatedCars });
    } else {
      // Add new if doesn't exist
      setFormData({ 
        ...formData, 
        selectedCars: [...formData.selectedCars, { type: currentCarSelection.type, quantity: qty }] 
      });
    }
    // Reset selection to default empty state
    setCurrentCarSelection({ type: '', quantity: '' });
  };

  const handleRemoveCar = (index) => {
    const updatedCars = formData.selectedCars.filter((_, i) => i !== index);
    // Ensure at least one car if possible, or keep empty
    setFormData({ ...formData, selectedCars: updatedCars });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Booking Details:', formData);

    const totalCapacity = formData.selectedCars.reduce((sum, car) => {
      const seats = car.type.includes('6 Seater') ? 6 : (car.type.includes('4 Seater') ? 4 : 4);
      return sum + (seats * car.quantity);
    }, 0);

    const totalCarsCount = formData.selectedCars.reduce((sum, car) => sum + car.quantity, 0);
    const maxCarsAllowed = Math.ceil(Number(formData.guests) / 4);

    if (Number(formData.guests) > totalCapacity) {
      toast.error(`You have selected vehicles for only ${totalCapacity} guests, but entered ${formData.guests} guests. Please add more vehicles or reduce guests.`);
      return;
    }

    if (totalCarsCount > maxCarsAllowed) {
      toast.error(`For ${formData.guests} guest(s), you can only book up to ${maxCarsAllowed} vehicle(s). Please remove excess cars.`);
      return;
    }

    const saveBooking = async (paymentVerified) => {
      try {
        const bookingPayload = {
          ...formData,
          totalAmount,
          payment: paymentVerified,
        };
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/booking/add`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          credentials: 'include',
          body: JSON.stringify(bookingPayload),
        });
        const data = await response.json();
        if (data.success) {
          toast.success('Booking Confirmed Successfully!');
          window.location.href = '/my-bookings';
        } else {
          toast.error('Failed to save booking: ' + (data.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error saving booking:', err);
        toast.error('An error occurred while saving the booking.');
      }
    };

    if (formData.paymentMethod === 'Online') {
      try {
        const orderResponse = await fetch(`${backendUrl}/api/payment/razorpay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const orderData = await orderResponse.json();

        if (orderData.success) {
          const options = {
            key: orderData.key_id,
            amount: orderData.order.amount,
            currency: 'INR',
            name: 'Banaras Tour',
            description: 'Test Card: 5104015555555558 | UPI: success@razorpay',
            order_id: orderData.order.id,
            handler: async function (response) {
              try {
                const verifyResponse = await fetch(`${backendUrl}/api/payment/verify`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                  // Save the booking to backend now that payment is verified
                  await saveBooking(true);
                } else {
                  toast.error('Payment verification failed.');
                }
              } catch (error) {
                console.error("Verification error", error);
                toast.error("Verification process encountered an error.");
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#ea580c', // Tailwind's orange-600
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.error('Failed to initiate payment.');
        }
      } catch (error) {
        console.error('Error during payment processing', error);
        toast.error('An error occurred. Please try again.');
      }
    } else {
      // Offline Payment
      await saveBooking(false);
    }
  };

  const totalCarPrice = formData.selectedCars.reduce((sum, car) => {
    return sum + (getPriceFromType(car.type) * car.quantity);
  }, 0);
  
  const tourPrice = 2000;
  const totalAmount = totalCarPrice + tourPrice;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4 sm:px-10 md:px-20 lg:px-30">
      
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto items-start">
        
        {/* Left Side: Banner (Sticky on large screens) */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
          <img
            src={bookingBanner}
            alt="Booking Banner"
            className="w-full h-auto object-cover rounded-2xl shadow-xl border-4 border-white"
          />
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100 hidden lg:block">
             <h3 className="text-xl font-bold text-gray-800 mb-2">Why Book With Us?</h3>
             <ul className="space-y-3 text-gray-600">
               <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Trusted Local Guides</li>
               <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> 24/7 Customer Support</li>
               <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Best Price Guarantee</li>
               <li className="flex items-center"><span className="text-orange-500 mr-2">✓</span> Authentic Experiences</li>
             </ul>
          </div>
        </div>

        {/* Right Side: Booking Form Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:p-10">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                Book Your Tour
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details Row */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Contact & Date Row */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
                    <style>
                      {`
                         .react-datepicker-wrapper { width: 100%; }
                         .react-datepicker__input-container input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem 1rem; color: #111827; background-color: #f9fafb; outline: none; }
                         .react-datepicker__input-container input:focus { border-color: #f97316; box-shadow: 0 0 0 1px #f97316; }
                      `}
                    </style>
                    <DatePicker
                      selected={formData.date ? new Date(formData.date) : null}
                      onChange={(date) => {
                         if (!date) return;
                         let offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                         handleChange({ target: { name: 'date', value: offsetDate.toISOString().split('T')[0] } });
                      }}
                      onMonthChange={handleMonthChange}
                      minDate={new Date(minDate)}
                      maxDate={new Date(maxDate)}
                      renderDayContents={renderDayContents}
                      placeholderText="Select Tour Date"
                      className={`${!formData.date ? 'text-gray-500' : 'text-gray-900'}`}
                      required
                      popperPlacement="bottom-start"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>

                {/* Package & Guests Row */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      name="guests"
                      id="guests"
                      min="1"
                      required
                      placeholder="1"
                      value={formData.guests}
                      onChange={handleChange}
                      className={`py-3 px-4 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50 ${!formData.guests ? 'text-gray-500' : 'text-gray-900'}`}
                    />
                  </div>
                </div>

                {/* Multiple Car Selection Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Vehicles</h3>
                  
                  {/* Current Vehicles List */}
                  {formData.selectedCars.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {formData.selectedCars.map((car, index) => (
                        <div key={index} className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{car.type.split(' - ')[0]} - {car.type.includes('Non AC') ? 'Non AC' : 'AC'}</p>
                            <p className="text-sm text-gray-500">Qty: {car.quantity} × ₹{getPriceFromType(car.type).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">₹{(getPriceFromType(car.type) * car.quantity).toLocaleString()}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveCar(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Remove vehicle"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Vehicle Form */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                      <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-1">Add a Vehicle</label>
                      <select
                        id="carType"
                        value={currentCarSelection.type}
                        onChange={(e) => setCurrentCarSelection({...currentCarSelection, type: e.target.value})}
                        className="py-2.5 px-3 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50 text-sm truncate"
                        style={{ maxWidth: '100%' }}
                      >
                        <option value="" disabled hidden>Select a car type...</option>
                        <optgroup label="Standard (4 Passengers)">
                          <option value="Sedan (Dzire/Etios) - Non AC - 4 Seater - 1200">Sedan - Non AC - ₹1,200/day</option>
                          <option value="Sedan (Dzire/Etios) - AC - 4 Seater - 1500">Sedan - AC - ₹1,500/day</option>
                        </optgroup>
                        <optgroup label="SUV (6 Passengers)">
                          <option value="SUV (Innova/Ertiga) - Non AC - 6 Seater - 2000">SUV - Non AC - ₹2,000/day</option>
                          <option value="SUV (Innova/Ertiga) - AC - 6 Seater - 2500">SUV - AC - ₹2,500/day</option>
                        </optgroup>
                        <optgroup label="Premium SUV (6 Passengers)">
                          <option value="Premium SUV (Innova Crysta) - Non AC - 6 Seater - 3000">Innova Crysta - Non AC - ₹3,000/day</option>
                          <option value="Premium SUV (Innova Crysta) - AC - 6 Seater - 3500">Innova Crysta - AC - ₹3,500/day</option>
                        </optgroup>
                        <optgroup label="Luxury Sedan (4 Passengers)">
                          <option value="Luxury Sedan (Honda City) - Non AC - 4 Seater - 2500">Honda City - Non AC - ₹2,500/day</option>
                          <option value="Luxury Sedan (Honda City) - AC - 4 Seater - 3000">Honda City - AC - ₹3,000/day</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="w-24 flex-shrink-0">
                      <label htmlFor="carQuantity" className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                      <input
                        type="number"
                        id="carQuantity"
                        min="1"
                        placeholder="0"
                        value={currentCarSelection.quantity}
                        onChange={(e) => setCurrentCarSelection({...currentCarSelection, quantity: e.target.value})}
                        className="py-2.5 px-3 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-lg border bg-gray-50 text-sm"
                      />
                    </div>

                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleAddCar}
                        className="w-full py-2.5 px-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm border border-transparent"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <fieldset>
                    <legend className="text-base font-medium text-gray-900">Payment Method</legend>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div className="flex items-center border border-gray-200 p-4 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                        <input
                          id="payment-online"
                          name="paymentMethod"
                          type="radio"
                          value="Online"
                          checked={formData.paymentMethod === 'Online'}
                          onChange={handleChange}
                          className="focus:ring-orange-500 h-5 w-5 text-orange-600 border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="payment-online" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer w-full">
                          Pay Online (Card/UPI)
                        </label>
                      </div>
                      <div className="flex items-center border border-gray-200 p-4 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                        <input
                          id="payment-offline"
                          name="paymentMethod"
                          type="radio"
                          value="Offline"
                          checked={formData.paymentMethod === 'Offline'}
                          onChange={handleChange}
                          className="focus:ring-orange-500 h-5 w-5 text-orange-600 border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="payment-offline" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer w-full">
                          Pay on Arrival (Cash)
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>

              {/* Summary / Price */}
              <div className="mt-8 bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="text-lg font-bold text-gray-900">Booking Summary</h3>
                <dl className="mt-4 text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <dt>Tour Package</dt>
                    <dd className="font-medium text-gray-900">₹{tourPrice.toLocaleString()}</dd>
                  </div>
                  {formData.selectedCars.map((car, index) => (
                    <div key={index} className="flex justify-between">
                      <dt>
                        {car.type.split(' - ')[0]} - {car.type.includes('Non AC') ? 'Non AC' : 'AC'} (×{car.quantity})
                      </dt>
                      <dd className="font-medium text-gray-900">
                        ₹{(getPriceFromType(car.type) * car.quantity).toLocaleString()}
                      </dd>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-orange-200 mt-4">
                    <dt className="font-bold text-gray-900 text-lg">Total Amount</dt>
                    <dd className="font-bold text-orange-600 text-2xl">
                      ₹{totalAmount.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

                {/* Submit Button */}
                <div className="pt-5 pb-2">
                  {formData.paymentMethod === 'Online' && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <strong>Test Mode Credentials:</strong>
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li><strong>Card:</strong> 5104 0155 5555 5558</li>
                        <li><strong>Expiry:</strong> Any future date (e.g., 12/30)</li>
                        <li><strong>CVV:</strong> Any 3 digits (e.g., 123)</li>
                        <li><strong>UPI (Success):</strong> success@razorpay</li>
                        <li><strong>UPI (Failure):</strong> failure@razorpay</li>
                      </ul>
                      <p className="mt-2 text-xs text-blue-600">Note: Razorpay kisi bhi random number ko accept nahi karta, aapko inhi test details ka use karna hoga.</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={formData.selectedCars.length === 0}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white transition-all duration-300 transform ${formData.selectedCars.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}`}
                  >
                    {formData.paymentMethod === 'Online' ? 'Proceed to Pay Securely' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;