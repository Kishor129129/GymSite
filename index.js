var mainMenu = document.querySelector('.links')
var openMenu = document.querySelector('.open')
var closeMenu = document.querySelector('.close')

openMenu.addEventListener('click', show)
closeMenu.addEventListener('click', close)

function show() {
    mainMenu.style.display = 'flex'
    mainMenu.style.right = '0'
}

function close() {
    mainMenu.style.right = '-60%'
}

// Auto-close mobile menu when navigation links are clicked
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Check if we're on mobile (menu is visible)
            if (window.innerWidth <= 850 && mainMenu.style.display === 'flex') {
                // Small delay to allow navigation to start, then close menu
                setTimeout(() => {
                    close();
                }, 150);
            }
        });
    });
    
    // Also close menu when clicking outside of it on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 850 && 
            mainMenu.style.display === 'flex' && 
            !mainMenu.contains(event.target) && 
            !openMenu.contains(event.target)) {
            close();
        }
    });
    
    // Close menu on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mainMenu.style.display === 'flex') {
            close();
        }
    });
});

    document.addEventListener('DOMContentLoaded', function() {
        var getStartedButton = document.querySelector('.btn');
        var aboutSection = document.getElementById('about1');
  
        getStartedButton.addEventListener('click', function() {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        var c = document.getElementById('scroll');
        var d = document.getElementById('services1');
  
        c.addEventListener('click', function() {
            d.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    var buttons = document.querySelectorAll('#cards');

    var linkUrl = 'payment.html';

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            window.location.href = linkUrl;
        });
    });

// Get the form and success message elements
var registrationForm = document.getElementById('lays');
var successMessage = document.getElementById('successMessage');

// Add submit event listener to the form
registrationForm.addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Display the success message
    successMessage.style.display = 'block';

    // Simulate user login after registration
    const firstName = registrationForm.querySelector('input[placeholder="First Name"]').value || 'Member';
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userBookings', '[]');
    localStorage.setItem('memberName', firstName);
    localStorage.setItem('userWorkouts', '[]');
    localStorage.setItem('userPhotos', '[]');
    localStorage.setItem('userGoals', '[]');

    // Hide the success message after 5 seconds
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 5000);

    // Clear the form fields after submission
    registrationForm.reset();
});

// Class Booking Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookButtons = document.querySelectorAll('.book-class');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const className = this.getAttribute('data-class');
            const classCard = this.closest('.class-card');
            const classTitle = classCard.querySelector('h3').textContent;
            
            // Check if user is logged in (simplified check)
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                // Show login prompt with modern toast
                showToast.confirm(
                    'Login Required',
                    'You need to be logged in to book classes. Would you like to register first?',
                    'Register Now',
                    'Cancel'
                ).then(confirmed => {
                    if (confirmed) {
                        document.getElementById('register1').scrollIntoView({ behavior: 'smooth' });
                    }
                });
                return;
            }
            
            // Simulate booking process with modern confirmation
            showToast.confirm(
                'Book Class',
                `Book "${classTitle}" class?\n\nThis will reserve your spot for the next available session.`,
                'Book Now',
                'Cancel'
            ).then(confirmed => {
                if (confirmed) {
                    // Update button state
                    button.textContent = 'Booked!';
                    button.style.backgroundColor = '#28a745';
                    button.style.borderColor = '#28a745';
                    button.disabled = true;
                    
                    // Show success message
                    showBookingSuccess(classTitle);
                    
                    // Update available spots (simulate)
                    updateAvailableSpots(classCard);
                }
            });
        });
    });
});

function showBookingSuccess(className) {
    // Use modern toast notification
    showToast.success(
        'Class Booked!',
        `Successfully booked "${className}" class!`,
        4000
    );
}

function updateAvailableSpots(classCard) {
    const spotsText = classCard.querySelector('.class-info p:nth-child(4)');
    if (spotsText && spotsText.textContent.includes('spots available')) {
        const currentText = spotsText.textContent;
        const match = currentText.match(/(\d+)\/(\d+) spots available/);
        if (match) {
            const current = parseInt(match[1]) - 1;
            const total = parseInt(match[2]);
            spotsText.textContent = `${current}/${total} spots available`;
            
            // Change color if class is full
            if (current === 0) {
                spotsText.style.color = '#dc3545';
                spotsText.innerHTML = '<i class="fas fa-users"></i> Class Full - Join Waitlist';
            }
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);