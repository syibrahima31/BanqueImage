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
  const checkboxInput = document.querySelector('#paiement');

  if(checkboxInput){
    checkboxInput.addEventListener('change', (e) => {
    if(checkboxInput.checked) {
      console.log("Checked");
      const priceBloc = document.querySelector('.price-bloc');
      console.log(priceBloc);
      priceBloc.setAttribute("style", "display: block;");
  } else {
      const priceBloc = document.querySelector('.price-bloc');
      priceBloc.setAttribute("style", "display: none;");
    }
  })
  }

  if(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('image');
    const descriptionInput = document.getElementById('description');
    const paymentRequiredInput = document.getElementById('paiement');
    const priceInput = document.getElementById('price');
    const file = fileInput.files[0];
    const description = descriptionInput.value;
    const is_payment_required = paymentRequiredInput.checked;
    const formData = new FormData()
    formData.append('image', file);
    formData.append('description', description);
    if(priceInput){
      formData.append('price', priceInput.value);
    }
    formData.append('paiement', JSON.stringify(is_payment_required));


    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if(data.code_message === "200") {
        M.toast({html: `${data.message}`, classes: 'green-toast'});
      } else {
        M.toast({html: `${data.message}`, classes: 'orange-toast'});
      }
    })
    .catch(error => {
      console.log(error);
      M.toast({html: `${data.message}`, classes: 'red-toast'});
    })

  })
}

const imageGrid = document.querySelector('.image-grid');
if(imageGrid){
  fetch('/contributor/images', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    const cardList = data.map((item) => {
     return `
          <div class="card">
            <div class="image-card">
              <img src="/contributor/images/${item.name}/${item.format.toLowerCase()}">
              <span class="card-title">${item.name}</span>
            </div>
            <div class="card-content">
              <label>Description: </label>
              <p>${item.description}</p>
            </div>
            <div class="card-buttons">
              <button id="edit" class="btn">Modifier</button>
              <button id="delete" class="btn">Supprimer</button>
            </div>
          </div>
      `
    });
    imageGrid.innerHTML = cardList.join('');
    const editButton = imageGrid.querySelector('#edit');
    editButton.addEventListener('click', () => {
      console.log("edit clicked!");
    });

    const deleteButton = imageGrid.querySelector('#delete');
    deleteButton.addEventListener('click', () => {
      console.log("delete clicked!");
    })
  })
  .catch(error => {

  })
}
}
