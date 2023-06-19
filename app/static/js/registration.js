// user-registration.js

// Get the registration form
const registrationForm = document.getElementById('registration-form');

// Add submit event listener to the form
registrationForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get the form inputs
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Validate the form inputs
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  let isValid = true;

  if (username === '') {
    displayError(usernameInput, 'Username is required');
    isValid = false;
  } else {
    removeError(usernameInput);
  }

  if (email === '') {
    displayError(emailInput, 'Email is required');
    isValid = false;
  } else {
    removeError(emailInput);
  }

  if (password === '') {
    displayError(passwordInput, 'Password is required');
    isValid = false;
  } else {
    removeError(passwordInput);
  }

  if (confirmPassword === '') {
    displayError(confirmPasswordInput, 'Please confirm your password');
    isValid = false;
  } else if (confirmPassword !== password) {
    displayError(confirmPasswordInput, 'Passwords do not match');
    isValid = false;
  } else {
    removeError(confirmPasswordInput);
  }

  if (isValid) {
    // Submit the form or perform further actions
    // registrationForm.submit();
    const data = {
      username: username,
      email: email,
      password: password
    }
    const urlEncodedData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    fetch("/submit-registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlEncodedData
    }).then(response => response.json())
      .then(data => {
        if(data.code_message === "200"){
          M.toast({html: `${data.message}`, classes: "green-toast"});
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          M.toast({html: `${data.message}`, classes: "orange-toast"});
          
        }
        
      })
      .catch(error => {
        M.toast({html: `${error}`, classes: "red-toast"});
      })
  }
});

// Function to display an error message
function displayError(inputElement, message) {
  const errorElement = document.createElement('div');
  errorElement.classList.add('error');
  errorElement.textContent = message;
  inputElement.classList.add('error');
  inputElement.parentNode.appendChild(errorElement);
}

// Function to remove an error message
function removeError(inputElement) {
  const errorElement = inputElement.parentNode.querySelector('.error');
  if (errorElement) {
    errorElement.remove();
  }
  inputElement.classList.remove('error');
}
