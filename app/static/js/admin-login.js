
const loginForm = document.getElementById('login-form');

// Add submit event listener to the form
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get the form inputs
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  // Validate the form inputs
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const data = {
    username: username,
    password: password
  }

  const urlEncodedData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join("&");
  fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: urlEncodedData
  }).then(response => response.json())
  .then(data => {
    if(data.code_message === "200") {
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000)
    } else {
      M.toast({html: `${data.message}`, classes: 'orange-toast'});
    }
  })
  .catch(error => {
    M.toast({html: `${error}`, classes: 'red-toast'});
  })

})