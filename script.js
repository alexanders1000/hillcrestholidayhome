// Booking form functionality
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reservationForm');
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  checkInInput.min = today;

  // Update checkout minimum date based on checkin
  checkInInput.addEventListener('change', function() {
    checkOutInput.min = checkInInput.value;
    if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
      checkOutInput.value = checkInInput.value;
    }
  });

  // Calculate number of nights and estimated price
  function calculatePrice(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.round(Math.abs((startDate - endDate) / oneDay));
    
    // Base price per night (in GBP)
    const basePrice = 250;
    
    // Peak season adjustment (June to September)
    const month = startDate.getMonth();
    const peakSeasonMultiplier = (month >= 5 && month <= 8) ? 1.25 : 1;
    
    // Weekend adjustment
    const isWeekend = startDate.getDay() === 5 || startDate.getDay() === 6;
    const weekendMultiplier = isWeekend ? 1.2 : 1;
    
    return Math.round(basePrice * nights * peakSeasonMultiplier * weekendMultiplier);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      guests: document.getElementById('guests').value
    };

    const estimatedPrice = calculatePrice(formData.checkIn, formData.checkOut);

    // Show booking summary in a modal
    showBookingSummary(formData, estimatedPrice);
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
      <p><strong>Estimated Total:</strong> £${price}</p>
      <p style="font-size: 0.9em; color: #666;">A member of our team will contact you shortly to confirm availability and process your booking.</p>
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
