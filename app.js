/* app.js */

// Function to check if the user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true'; // Assuming you set this flag when the user logs in
}

// Utility function for AJAX requests
function sendRequest(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.status, xhr.responseText);
      } else {
        console.error('Request failed with status:', xhr.status);
        showError('An error occurred during the request. Please try again.'); // Use error box
      }
    }
  };
  xhr.send(data);
}

// Function to display error message in an error box
function showError(message) {
  const errorBox = document.getElementById("error-box");
  const errorMessage = document.getElementById("error-message");
  const errorOkButton = document.getElementById("error-ok-btn");

  errorMessage.textContent = message;  // Set the error message text
  errorBox.style.display = "flex";      // Show the error box
  errorOkButton.style.display = "inline-block"; // Show the "Okay" button

  // Close the error box when "Okay" button is clicked
  errorOkButton.addEventListener('click', () => {
    errorBox.style.display = "none";  // Hide the error box
  });
}

// Handle Registration
document.getElementById('register-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('full-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Validate passwords match
  if (password !== confirmPassword) {
    showError('Passwords do not match. Please try again.');  // Use error box
    return;
  }

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    showError('Please fill all fields.');  // Use error box
    return;
  }

  // Optional password strength validation
  const passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number
  if (!passwordStrength.test(password)) {
    showError('Password must be at least 8 characters long and include both letters and numbers.');  // Use error box
    return;
  }

  // Prepare data to send to PHP
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  try {
    // Send request to register.php
    const response = await fetch('register.php', {
      method: 'POST',
      body: formData,
    });

    // Parse JSON response from PHP
    const result = await response.json();
    showError(result.message);  // Display the result message in the error box

    if (result.success) {
      this.reset(); // Clear form on success
      document.getElementById('register-form-container').style.display = 'none'; // Hide the register form
      document.getElementById('login-form-container').style.display = 'block'; // Show the login form
    }
  } catch (error) {
    console.error("Error in registration:", error);
    showError("An error occurred while processing your registration.");  // Use error box
  }
});

// Handle Login
document.getElementById('login-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  try {
    // Send request to login.php
    const response = await fetch('login.php', {
      method: 'POST',
      body: formData,
    });

    // Parse JSON response from PHP
    const result = await response.json();
    showError(result.message);  // Display the result message in the error box

    if (result.success) {
      // Set the login flag in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'index.html'; // Redirect to dashboard on success
    }
  } catch (error) {
    console.error("Error in login:", error);
    showError("An error occurred during login.");  // Use error box
  }
});

// Toggle between login and register forms
const loginFormContainer = document.getElementById('login-form-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerFormLink = document.getElementById('register-form-link');
const loginFormLink = document.getElementById('login-form-link');
const closeLoginForm = document.getElementById('close-login-form');

// Show login form (when login button is clicked)
loginBtn?.addEventListener('click', function() {
  loginFormContainer.style.display = 'flex'; // Show the login form container
  loginForm.style.display = 'block'; // Show the login form
  registerForm.style.display = 'none'; // Hide the register form
});

// Toggle to register form
registerFormLink?.addEventListener('click', function(e) {
  e.preventDefault(); // Prevent default link behavior
  loginForm.style.display = 'none'; // Hide the login form
  registerForm.style.display = 'block'; // Show the register form
});

// Toggle to login form
loginFormLink?.addEventListener('click', function(e) {
  e.preventDefault(); // Prevent default link behavior
  registerForm.style.display = 'none'; // Hide the register form
  loginForm.style.display = 'block'; // Show the login form
});

// Close the form when clicking the close button
closeLoginForm?.addEventListener('click', function() {
  loginFormContainer.style.display = 'none'; // Hide the form container
});

// Smooth scrolling for navigation links
document.querySelectorAll('.menuList a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Section with ID "${targetId}" not found.`);
    }
  });
});

// Shop Now button functionality
document.querySelectorAll('.shop-now').forEach(button => {
  button.addEventListener('click', () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Shop section not found.');
    }
  });
});

// Add to cart functionality with login check
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function () {
    if (!isLoggedIn()) {
      // If user is not logged in, show the error message box
      showError("You need to be logged in to add items to the cart.");
    } else {
      // If logged in, proceed with adding the product to the cart
      const productName = this.closest('.product-card')?.querySelector('h3')?.innerText || 'Product';
      alert(`${productName} added to cart!`);
    }
  });
});

// Close the error modal when the user clicks the close button or outside the modal
document.querySelector('.close-btn')?.addEventListener('click', function() {
  document.getElementById('login-error-modal').style.display = 'none';
});
