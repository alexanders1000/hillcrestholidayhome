document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reservationForm');
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  checkInInput.min = today;

  // Update checkout minimum date based on checkin and enforce 4-night minimum stay
  checkInInput.addEventListener('change', function() {
    const checkInDate = new Date(checkInInput.value);
    const minCheckOutDate = new Date(checkInDate);
    minCheckOutDate.setDate(checkInDate.getDate() + 4); // Minimum 4-night stay
    
    checkOutInput.min = minCheckOutDate.toISOString().split('T')[0];
    if (checkOutInput.value && new Date(checkOutInput.value) < minCheckOutDate) {
      checkOutInput.value = minCheckOutDate.toISOString().split('T')[0];
    }
  });

  // Calculate number of nights and price based on season
  function calculatePrice(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.round(Math.abs((endDate - startDate) / oneDay));
    
    // Check if dates are within Oct-Feb (months 9-1)
    const month = startDate.getMonth();
    const isLowSeason = month >= 9 || month <= 1;
    const pricePerNight = isLowSeason ? 100 : 160;
    
    return pricePerNight * nights;
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

    const estimatedPrice = calculatePrice(formData.checkIn, formData.checkOut);

    // Send email using EmailJS or similar service
    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'arranhilltopholidaycottage@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        check_in: new Date(formData.checkIn).toLocaleDateString(),
        check_out: new Date(formData.checkOut).toLocaleDateString(),
        guests: formData.guests,
        total_price: estimatedPrice,
        message: `New booking request from ${formData.name}
                 Check-in: ${new Date(formData.checkIn).toLocaleDateString()}
                 Check-out: ${new Date(formData.checkOut).toLocaleDateString()}
                 Guests: ${formData.guests}
                 Total Price: £${estimatedPrice}`
      });
      showBookingSummary(formData, estimatedPrice, true);
    } catch (error) {
      console.error('Failed to send email:', error);
      showBookingSummary(formData, estimatedPrice, false);
    }
  });

  function showBookingSummary(formData, price, emailSent) {
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

    const emailStatus = emailSent 
      ? '<p style="color: green;">Your booking request has been sent successfully!</p>'
      : '<p style="color: red;">There was an error sending your request. Please try again later.</p>';

    modal.innerHTML = `
      <h3 style="margin-top: 0;">Booking Summary</h3>
      <p><strong>Guest:</strong> ${formData.name}</p>
      <p><strong>Check-in:</strong> ${new Date(formData.checkIn).toLocaleDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(formData.checkOut).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> ${formData.guests}</p>
      <p><strong>Total Price:</strong> £${price}</p>
      ${emailStatus}
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
