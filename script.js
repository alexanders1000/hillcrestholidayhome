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
      const pricing = calculatePrice(checkInInput.value, checkOutInput.value);
      
      document.querySelector('.nightly-rate').textContent = pricing.pricePerNight;
      document.querySelector('.num-nights').textContent = pricing.nights;
      document.querySelector('.total-nights-price').textContent = `£${pricing.total}`;
      document.querySelector('.total-price').textContent = `£${pricing.total}`;
      
      bookingSummary.classList.remove('hidden');
    } else {
      bookingSummary.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      guests: document.getElementById('guests').value 
    };

    const pricing = calculatePrice(formData.checkIn, formData.checkOut);

    // Create email content
    const emailBody = `
      New Booking Request

      Name: ${formData.name}
      Email: ${formData.email}
      Check-in: ${new Date(formData.checkIn).toLocaleDateString()}
      Check-out: ${new Date(formData.checkOut).toLocaleDateString()}
      Nights: ${pricing.nights}
      Guests: ${formData.guests}
      Price per night: £${pricing.pricePerNight}
      Total Price: £${pricing.total}
    `;

    // Send email using mailto link
    const mailtoLink = `mailto:arranhilltopholidaycottage@gmail.com?subject=New Booking Request&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;

    // Show booking summary
    showBookingSummary(formData, pricing.total);
  });

  function showBookingSummary(formData, price) {
    // Create modal element
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2em;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      z-index: 1000;
      max-width: 500px;
      width: 90%;
    `;

    modal.innerHTML = `
      <h3 style="margin-top: 0;">Booking Summary</h3>
      <p><strong>Guest:</strong> ${formData.name}</p>
      <p><strong>Check-in:</strong> ${new Date(formData.checkIn).toLocaleDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(formData.checkOut).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> ${formData.guests}</p> 
      <p><strong>Total Price:</strong> £${price}</p>
      <p style="font-size: 0.9em; color: #666;">Your booking request has been sent. We will contact you shortly to confirm availability.</p>
      <button onclick="this.parentElement.remove()" style="
        background: #34495e;
        color: white;
        border: none;
        padding: 0.5em 1em;
        margin-top: 1em;
        cursor: pointer;
      ">Close</button>
    `;

    document.body.appendChild(modal);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    document.body.appendChild(overlay);

    // Remove overlay when clicked
    overlay.onclick = function() {
      modal.remove();
      overlay.remove();
    };
  }
});
