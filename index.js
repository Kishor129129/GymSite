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

    // Optionally clear the form fields after submission
    registrationForm.reset();
});


