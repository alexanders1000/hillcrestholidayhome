// Booking form functionality
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reservationForm');
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');
  const bookingSummary = document.querySelector('.booking-summary');
  const nightlyPriceDisplay = document.querySelector('.price-amount');
  const seasonIndicator = document.querySelector('.season-indicator');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  checkInInput.min = today;

  // Update initial price display based on current date
  updateNightlyPriceDisplay(new Date());

  function updateNightlyPriceDisplay(date) {
    const month = date.getMonth();
    const isLowSeason = month >= 9 || month <= 1;
    const pricePerNight = isLowSeason ? 100 : 160;
    const seasonText = isLowSeason ? 'Low season pricing' : 'High season pricing';
    
    nightlyPriceDisplay.textContent = `£${pricePerNight}`;
    seasonIndicator.textContent = seasonText;
  }

  // Update checkout minimum date and price display
  checkInInput.addEventListener('change', function() {
    const checkInDate = new Date(checkInInput.value);
    const minCheckOutDate = new Date(checkInDate);
    minCheckOutDate.setDate(checkInDate.getDate() + 4); // Minimum 4-night stay
    
    checkOutInput.min = minCheckOutDate.toISOString().split('T')[0];
    if (checkOutInput.value && new Date(checkOutInput.value) < minCheckOutDate) {
      checkOutInput.value = minCheckOutDate.toISOString().split('T')[0];
    }

    updateNightlyPriceDisplay(checkInDate);
    updatePriceBreakdown();
  });

  checkOutInput.addEventListener('change', updatePriceBreakdown);

  function calculatePrice(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.round(Math.abs((endDate - startDate) / oneDay));
    
    const month = startDate.getMonth();
    const isLowSeason = month >= 9 || month <= 1;
    const pricePerNight = isLowSeason ? 100 : 160;
    
    return {
      nights,
      pricePerNight,
      total: pricePerNight * nights
    };
  }

  function updatePriceBreakdown() {
    if (checkInInput.value && checkOutInput.value) {
      const priceDetails = calculatePrice(checkInInput.value, checkOutInput.value);
      
      bookingSummary.innerHTML = `
        <p>Nights: ${priceDetails.nights}</p>
        <p>Price per night: £${priceDetails.pricePerNight}</p>
        <p>Total price: £${priceDetails.total}</p>
      `;
    } else {
      bookingSummary.innerHTML = '<p>Please select both check-in and check-out dates.</p>';
    }
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for now
    
    if (!checkInInput.value || !checkOutInput.value) {
      alert('Please select both check-in and check-out dates.');
      return;
    }

    const priceDetails = calculatePrice(checkInInput.value, checkOutInput.value);

    alert(`Booking confirmed!\n\nDetails:\nNights: ${priceDetails.nights}\nPrice per night: £${priceDetails.pricePerNight}\nTotal price: £${priceDetails.total}`);
    form.reset();
    bookingSummary.innerHTML = '<p>Fill out the form to see booking details.</p>';
    checkOutInput.min = ''; // Reset the checkout minimum date
    updateNightlyPriceDisplay(new Date()); // Reset price display
  });
});
