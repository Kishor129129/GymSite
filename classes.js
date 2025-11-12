// Classes Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeScheduleFilters();
    initializeBookingSystem();
    loadUserBookings();
});

// Schedule Filter Functionality
function initializeScheduleFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dayColumns = document.querySelectorAll('.day-column');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedDay = this.getAttribute('data-day');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide day columns
            dayColumns.forEach(column => {
                if (selectedDay === 'all' || column.getAttribute('data-day') === selectedDay) {
                    column.style.display = 'block';
                } else {
                    column.style.display = 'none';
                }
            });
        });
    });
}

// Booking System Functionality
function initializeBookingSystem() {
    const bookButtons = document.querySelectorAll('.book-schedule');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classId = this.getAttribute('data-class');
            const classSlot = this.closest('.class-slot');
            const className = classSlot.querySelector('h4').textContent;
            const classTime = classSlot.querySelector('.class-time').textContent;
            const trainer = classSlot.querySelector('p').textContent;
            const dayColumn = classSlot.closest('.day-column');
            const day = dayColumn.querySelector('h3').textContent;
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                showToast.confirm(
                    'Login Required',
                    'You need to be logged in to book classes. Would you like to register first?',
                    'Register Now',
                    'Cancel'
                ).then(confirmed => {
                    if (confirmed) {
                        window.location.href = 'index.html#register1';
                    }
                });
                return;
            }
            
            // Check if already booked
            const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            const isAlreadyBooked = existingBookings.some(booking => booking.classId === classId);
            
            if (isAlreadyBooked) {
                showToast.warning('Already Booked', 'You have already booked this class!');
                return;
            }
            
            // Confirm booking with modern dialog
            showToast.confirm(
                'Book Class',
                `Book "${className}" class?\n\nDay: ${day}\nTime: ${classTime}\nTrainer: ${trainer}\n\nThis will reserve your spot for this session.`,
                'Book Now',
                'Cancel'
            ).then(confirmed => {
                if (confirmed) {
                    // Show button spinner
                    const hideSpinner = window.loadingSpinner ? window.loadingSpinner.showButton(button, 'Booking...') : null;
                    
                    // Simulate async booking process
                    setTimeout(() => {
                        // Create booking object
                        const booking = {
                            id: Date.now(),
                            classId: classId,
                            className: className,
                            day: day,
                            time: classTime,
                            trainer: trainer,
                            bookingDate: new Date().toISOString()
                        };
                        
                        // Save booking to localStorage
                        existingBookings.push(booking);
                        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
                        
                        // Update button state
                        if (hideSpinner) hideSpinner();
                        button.textContent = 'Booked!';
                        button.style.backgroundColor = '#28a745';
                        button.style.borderColor = '#28a745';
                        button.disabled = true;
                        
                        // Show success notification
                        showToast.success('Class Booked!', `Successfully booked "${className}" class!`);
                        
                        // Update available spots
                        updateAvailableSpots(classSlot);
                        
                        // Refresh bookings list
                        loadUserBookings();
                    }, 600);
                }
            });
        });
    });
}

// Load and display user bookings
function loadUserBookings() {
    const bookingsList = document.getElementById('bookingsList');
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>No classes booked yet. Book your first class above!</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item" data-booking-id="${booking.id}">
            <div class="booking-info">
                <h4>${booking.className}</h4>
                <p><i class="fas fa-calendar"></i> ${booking.day}</p>
                <p><i class="fas fa-clock"></i> ${booking.time}</p>
                <p><i class="fas fa-user"></i> ${booking.trainer}</p>
                <p><i class="fas fa-calendar-plus"></i> Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
            <button class="btn cancel-btn" onclick="cancelBooking(${booking.id})">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `).join('');
}

// Cancel booking function
function cancelBooking(bookingId) {
    const confirmCancel = confirm('Are you sure you want to cancel this booking?');
    
    if (confirmCancel) {
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
        
        // Refresh bookings list
        loadUserBookings();
        
        // Reset booking button on schedule
        resetBookingButton(bookingId);
        
        // Show cancellation notification
        showCancellationSuccess();
    }
}

// Reset booking button after cancellation
function resetBookingButton(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const cancelledBooking = bookings.find(booking => booking.id === bookingId);
    
    if (cancelledBooking) {
        const button = document.querySelector(`[data-class="${cancelledBooking.classId}"]`);
        if (button) {
            button.textContent = 'Book';
            button.style.backgroundColor = 'transparent';
            button.style.borderColor = 'yellowgreen';
            button.disabled = false;
        }
    }
}

// Show booking success notification
function showBookingSuccess(className) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 1.2rem;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        Successfully booked "${className}"!
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Show cancellation success notification
function showCancellationSuccess() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 1.2rem;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-times-circle"></i> 
        Booking cancelled successfully!
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update available spots after booking
function updateAvailableSpots(classSlot) {
    const spotsText = classSlot.querySelector('p:nth-child(3)');
    if (spotsText && spotsText.textContent.includes('spots')) {
        const currentText = spotsText.textContent;
        const match = currentText.match(/(\d+)\/(\d+) spots/);
        if (match) {
            const current = parseInt(match[1]) - 1;
            const total = parseInt(match[2]);
            spotsText.textContent = `${current}/${total} spots`;
            
            if (current === 0) {
                spotsText.style.color = '#dc3545';
                spotsText.innerHTML = '<i class="fas fa-users"></i> Class Full - Join Waitlist';
            }
        }
    }
}

// Simulate user login for demo purposes
function simulateLogin() {
    localStorage.setItem('userLoggedIn', 'true');
    alert('Demo: You are now logged in! You can book classes.');
    loadUserBookings();
}

// Add demo login button for testing
document.addEventListener('DOMContentLoaded', function() {
    // Add demo login button if user is not logged in
    if (localStorage.getItem('userLoggedIn') !== 'true') {
        const demoButton = document.createElement('button');
        demoButton.textContent = 'Demo: Login to Book Classes';
        demoButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: yellowgreen;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        demoButton.onclick = simulateLogin;
        document.body.appendChild(demoButton);
    }
});
