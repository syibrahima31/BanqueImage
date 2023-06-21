// Get the navigation links and content div
const navLinks = document.querySelectorAll('.nav-link');
const contentDiv = document.getElementById('content');


console.log()

// Add click event listeners to the navigation links
navLinks.forEach(link => {
  link.addEventListener('click', navigate);
});

// Function to handle navigation
function navigate(event) {
  event.preventDefault();

  // Get the target of the clicked link
  const target = event.target.dataset.target;

  // Load the corresponding content based on the target
  loadContent(target);
}

// Function to load content based on the target
async function loadContent(target) {
  // Perform any necessary logic based on the target
  // For example, fetch data from an API or manipulate the DOM
  // Clear the existing content
  contentDiv.innerHTML = '';

  // Create and append the new content

  const response = await fetch(target);
  const template = await response.text();
  const newContent = document.createElement('div');
  newContent.style.cssText = `
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
 
    display: flex;
    flex-direction: column;
  `
  newContent.innerHTML = template;
  contentDiv.appendChild(newContent);
  const form = document.querySelector('.upload-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('image');
    const descriptionInput = document.getElementById('description');
    const file = fileInput.files[0];
    const description = descriptionInput.value;
    const formData = new FormData()
    formData.append('image', file);
    formData.append('description', description);

    fetch('/upload', {
      method: 'POST',
      body: formData
    }).then(response => response.text())
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.log(error);
    })

  })
  
}
