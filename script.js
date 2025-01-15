document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
  });

// Add this at the bottom of the file
document.addEventListener('DOMContentLoaded', function() {
    const img = new Image();
    img.src = 'images/outside_view1.jpg';
    img.onload = function() {
        console.log('Image loaded successfully');
    };
    img.onerror = function() {
        console.log('Error loading image');
    };
});
