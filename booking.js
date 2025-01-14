document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    if (name && email && checkin && checkout) {
        alert(`Thank you for your booking, ${name}! We will contact you shortly at ${email}.`);
        // Here you can add code to send the form data to your server
    } else {
        alert('Please fill in all fields.');
    }
});