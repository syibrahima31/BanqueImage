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
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
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

// function addCardButtons(cards){
//   for (let card of cards) {
//     // Create a div to contain the buttons
//     const buttonsDiv = document.createElement('div');
//     buttonsDiv.classList.add('buttons');
//     // Create two buttons
//     const button1 = document.createElement('button');
//     button1.textContent = 'Modifier';
//     button1.setAttribute('class', 'waves-effect waves-light btn');
//     button1.addEventListener('click', (e) => {
//       secondInstance.open();
//       modalEditForm.onsubmit = (evt) => {
//         evt.preventDefault();
//         const newDescriptionInput = document.querySelector('#new-description');
//         const newDescriptionValue = newDescriptionInput.value.trim();
//         const id = e.target.parentNode.parentNode.querySelector('.image-id').dataset.id;
//         const modalFormData = {
//           description: newDescriptionValue
//         }
//         const editImageModalForm = Object.keys(modalFormData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(modalFormData[key])}`).join('&');
//         fetch(`/contributor/images/${id}/edit`, {
//           method: 'PUT',
//           body: editImageModalForm
//         })
//         .then(response => response.json())
//         .then(data => {
//           if(data.code_message === "200"){
//             M.toast({html: `${data.message}`, classes: 'green-toast'});
//           } else {
//             M.toast({html: `${data.message}`, classes: 'orange-toast'});
//           }
//         })
//         .catch(error => {
//           M.toast({html: `${error}`, classes: 'red-toast'});
//         });
//       }
//     })
  
//     const button2 = document.createElement('button');
//     button2.textContent = 'Supprimer';
//     button2.setAttribute('class', 'waves-effect waves-light btn modal-trigger');
//     button2.addEventListener('click', (e) => {
//         firstInstance.open();
//         const imageDeletionTrigger = document.querySelector('.delete-confirm');
//         imageDeletionTrigger.onclick = () => {
//         const id = e.target.parentNode.parentNode.querySelector('.image-id').dataset.id;
//         fetch(`/contributor/images/${id}/delete`, {
//           method: 'DELETE'
//         })
//         .then(response => response.json())
//         .then(data => {
//           M.toast({html: `${data.message}`, classes: "green-toast"});
//           e.target.parentNode.parentNode.remove();
//           const imagesLink = Array.from(document.querySelectorAll('.nav-link'))[2];
//           imagesLink.click();
//         })
//         .catch(error => {
//           M.toast({html: `${error}`, classes: "red-toast"});
//         })
//       }
//     })
//     button2.setAttribute('data-target', 'modal2')
  
//     // Add the buttons to the div
//     buttonsDiv.appendChild(button1);
//     buttonsDiv.appendChild(button2);
  
//     // Append the div to the card
//     card.appendChild(buttonsDiv);
//   }
// }

async function getPaginatedData(page, per_page, endpoint){
  const pageDataObject = {
    page: page,
    per_page: per_page
  }
  const pageData = Object.keys(pageDataObject).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(pageDataObject[key])}`).join('&');
  const fetchedData = await fetch(`${endpoint}?${pageData}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    return data;
  });
  return fetchedData
}

const imageGrid = document.querySelector('.image-grid');
if(imageGrid){
  fetch('/contributor/images', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    // let updatedData;
    // const ul = document.createElement('ul');
    // const previous = document.createElement('li');
    // const anchor = document.createElement('a');
    // anchor.setAttribute('href', '#!');
    // const icon = document.createElement('i');
    // icon.setAttribute('class', 'material-icons');
    // icon.textContent = 'chevron_left';
    // anchor.appendChild(icon);
    // previous.appendChild(anchor);
    // if(!data.has_prev){
    //   previous.setAttribute('class', 'disabled');
    // }
    // ul.setAttribute('class', 'pagination');
    // ul.appendChild(previous);
    // for(let i=0; i < data.total_pages; i++) {
    //   const li = document.createElement('li');
    //   li.setAttribute('class', 'waves-effect');
    //   const a = document.createElement('a');
    //   a.setAttribute('href', '#!')
    //   a.textContent = i + 1;
    //   a.addEventListener('click', (e) => {
    //     const currentNode = e.target.parentNode;
    //     currentNode.setAttribute('class', 'active');
    //     const siblings = Array.from(e.target.parentNode.parentNode.childNodes);
    //     siblings.forEach(node => {
    //       if(node !== currentNode){
    //         node.setAttribute('class', 'inactive');
    //         node.setAttribute('style', 'background-color:none;');
    //       }
    //     })
    //     e.target.parentNode.setAttribute('style', 'background-color: #26a69a;');
    //     const pageNumber = parseInt(e.target.innerText);
    //     updatedData = getPaginatedData(pageNumber, 2, '/contributor/images');
    //     updatedData.then(result => {
    //       imageGrid.innerHTML = getCardList(result);
    //       const cards = document.querySelectorAll('.card');
    //       // addCardButtons(cards);
    //     });
    //   });
    //   li.appendChild(a);
    //   ul.appendChild(li);
    //   const firstAnchor = Array.from(ul.querySelectorAll('a'))[1];
    //   if(parseInt(firstAnchor.textContent) === data.current_page){
    //     firstAnchor.parentNode.setAttribute('class', 'active');
    //     firstAnchor.parentNode.setAttribute('style', 'background-color: #26a69a;');
    //   }
    // }
    // const next = document.createElement('li');
    // const next_anchor = document.createElement('a');
    // next_anchor.setAttribute('href', '#!');
    // const next_icon = document.createElement('i');
    // next_icon.setAttribute('class', 'material-icons');
    // next_icon.textContent = 'chevron_right';
    // next_anchor.appendChild(next_icon);
    // next.appendChild(next_anchor);
    // if(!data.has_next){
    //   next.setAttribute('class', 'disabled');
    // }
    // ul.appendChild(next);
    // console.log('Nombre total de pages', data.total_pages)
    // console.log('Page actuelle', data.current_page)
    // console.log('contient_avant', data.has_prev)
    // console.log('contient_après', data.has_next)
    // const cardList = getCardList(data);
    // imageGrid.innerHTML = cardList;
    // const cards = document.querySelectorAll('.card');
    // addCardButtons(cards);
    
    // imageGrid.innerHTML = cardList.join('');
    // const paginationBloc = document.querySelector('#pagination-bloc');
    // paginationBloc.appendChild(ul);
    app.grid = document.querySelector('.image-grid');
    app.grid.innerHTML = getCardList(data);
    app.pagination = document.querySelector('#pagination-bloc');
    app.pagination.innerHTML = getPaginationBloc(data);
    console.log(document.querySelectorAll('a.page-link'));
    
  })
  .catch(error => {
    M.toast({html: `${error}`, classes: "red-toast"});
  })
}

}


});
