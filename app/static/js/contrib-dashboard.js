// Get the navigation links and content div
const navLinks = document.querySelectorAll('.nav-link');
const contentDiv = document.getElementById('content');

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
  
    newContent.innerHTML = template;
    contentDiv.appendChild(newContent);
  
}
