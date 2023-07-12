document.addEventListener('DOMContentLoaded', () => {

const firstModal = document.querySelector('.modal-delete');
const firstInstance = M.Modal.init(firstModal);

const secondModal = document.querySelector('.modal-edit');
const secondInstance = M.Modal.init(secondModal);

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

const app = {
  content: document.querySelector('#content'),
  pagination: document.querySelector('#pagination-bloc'),
  grid: document.querySelector('.image-grid')
}

// const home = document.querySelector('.nav-link');
// home.click();

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
    const titleInput = document.getElementById('title');
    const auteurInput = document.getElementById('auteur');
    const file = fileInput.files[0];
    const description = descriptionInput.value;
    const title = titleInput.value;
    const auteur = auteurInput.value;
    const is_payment_required = paymentRequiredInput.checked;
    const formData = new FormData()
    formData.append('image', file);
    formData.append('description', description);
    formData.append('title', title);
    formData.append('auteur', auteur);
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
      M.toast({html: `${error}`, classes: 'red-toast'});
    })

  })
}

// Modal edition form
const modalEditForm = document.querySelector('.file-edit');

{/* <div class="card">
<input class="image-id" type="hidden" data-id="${item.id}">
<div class="image-card">
  <img class="responsive-img" src="/contributor/images/${item.name}/${item.format.toLowerCase()}">
  <span class="card-title">${item.name}</span>
</div>
<div class="card-content">
  <label>Description: </label>
  <p>${item.description}</p>
</div>
</div> */}

function getPaginationBloc(data) {
  const previousEnabled = data.has_prev ? "enabled" : "disabled";
  const nextEnabled = data.has_next ? "enabled" : "disabled";

  const lis = [];
  
  for(let i=0; i < data.total_pages; i++){ 
    lis.push(`<li class="page-item ${i + 1 === data.current_page ? "active" : "inactive"}"><a class="page-link" href="#">${i + 1}</a></li>`);
  }
  
  return `
        <nav aria-label="...">
        <ul class="pagination pagination-circle">
          <li class="page-item">
            <a class="page-link ${previousEnabled}">Précédent</a>
          </li>
          ${lis.join('')}
          <li class="page-item">
            <a class="page-link ${nextEnabled}" href="#">Suivant</a>
          </li>
        </ul>
      </nav>
    `;
}


function getCardList(data) {
  return data.images.map((item) => `
      <div class="col-md-4">
        <div class="card">
          <input class="image-id" type="hidden" data-id="${item.id}">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light" style="width: 288px; height: 288px;">
            <img src="/contributor/images/${item.name}/${item.format.toLowerCase()}" class="img-fluid"/>
            <a href="#!">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </a>
          </div>
          <div class="card-body container">
            <div class="row">
              <div class="col">
                <a href="#!" class="btn btn-primary"><i class="fas fa-eye"></i></a>
              </div>
              <div class="col">
                <a href="#!" class="btn btn-primary"><i class="fas fa-circle-info"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
}

function setPagination() {
  const pageLinks = document.querySelectorAll('a.page-link');
  pageLinks.forEach((link) => {
    link.addEventListener('click', paginateImage);
  });
}

function paginateImage(event) {
  event.preventDefault();
  const pageNumber = parseInt(event.target.textContent);
  const paginationDataObject = {
    page: pageNumber,
    per_page: 2
  }
  const pageData = Object.keys(paginationDataObject).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paginationDataObject[key])}`).join('&');
  fetch(`/contributor/images?${pageData}`, {
    method: 'GET'
  }).then(response => response.json())
  .then(data => {
    app.grid.innerHTML = getCardList(data);
    app.pagination.innerHTML = getPaginationBloc(data);
    setPagination();
  })
}

const imageGrid = document.querySelector('.image-grid');
if(imageGrid){
  fetch('/contributor/images', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    app.grid = document.querySelector('.image-grid');
    app.grid.innerHTML = getCardList(data);
    app.pagination = document.querySelector('#pagination-bloc');
    app.pagination.innerHTML = getPaginationBloc(data);
    setPagination();
  })
  .catch(error => {
    M.toast({html: `${error}`, classes: "red-toast"});
  })
}

}


});
