document.addEventListener('DOMContentLoaded', () => {
  // Empêche l'image d'être téléchargée en utilisant clic-droit
  document.addEventListener('contextmenu', event => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  });

const modal = document.querySelector('.modal-image');
const instance = M.Modal.init(modal);

// const firstModal = document.querySelector('.modal-delete');
// const firstInstance = M.Modal.init(firstModal);

// const secondModal = document.querySelector('.modal-edit');
// const secondInstance = M.Modal.init(secondModal);

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

const home = document.querySelector('.nav-link');
home.click();

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
//   const checkboxInput = document.querySelector('#paiement');

//   if(checkboxInput){
//     checkboxInput.addEventListener('change', (e) => {
//     if(checkboxInput.checked) {
//       console.log("Checked");
//       const priceBloc = document.querySelector('.price-bloc');
//       priceBloc.setAttribute("style", "display: block;");
//   } else {
//       const priceBloc = document.querySelector('.price-bloc');
//       priceBloc.setAttribute("style", "display: none;");
//     }
//   })
//   }

//   if(form) {
//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const fileInput = document.getElementById('image');
//     const descriptionInput = document.getElementById('description');
//     const paymentRequiredInput = document.getElementById('paiement');
//     const priceInput = document.getElementById('price');
//     const file = fileInput.files[0];
//     const description = descriptionInput.value;
//     const is_payment_required = paymentRequiredInput.checked;
//     const formData = new FormData()
//     formData.append('image', file);
//     formData.append('description', description);
//     if(priceInput){
//       formData.append('price', priceInput.value);
//     }
//     formData.append('paiement', JSON.stringify(is_payment_required));

//     fetch('/upload', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       if(data.code_message === "200") {
//         M.toast({html: `${data.message}`, classes: 'green-toast'});
//       } else {
//         M.toast({html: `${data.message}`, classes: 'orange-toast'});
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       M.toast({html: `${error}`, classes: 'red-toast'});
//     })

//   })
// }

// Modal edition form
// const modalEditForm = document.querySelector('.file-edit');

function getCardList(data) {
  return data.images.map((item) => `
         <div class="card">
          <input class="image-id" type="hidden" data-id="${item.id}">
          <div class="image-card">
            <img class="displayed-image responsive-img" src="/contributor/images/${item.name}/${item.format.toLowerCase()}">
            <span class="card-title">${item.name}</span>
          </div>
          <div class="card-content">
            <label>Description: </label>
            <p>${item.description}</p>
          </div>
        </div>
    `).join('');
}

async function getPaginatedData(page, per_page){
  const pageDataObject = {
    page: page,
    per_page: per_page
  }
  const pageData = Object.keys(pageDataObject).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(pageDataObject[key])}`).join('&');
  const fetchedData = await fetch(`/user/images?${pageData}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    return data;
  });
  return fetchedData
}

async function getSearchPaginatedData(page, per_page, endpoint, payload){
  const pageDataObject = {
    page: page,
    per_page: per_page
  }
  const pageData = Object.keys(pageDataObject).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(pageDataObject[key])}`).join('&');
  const fetchedData = await fetch(`${endpoint}?${pageData}`, {
    method: 'POST',
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: payload
  })
  .then(response => response.json())
  .then(data => {
    return data;
  });
  return fetchedData
}

function previewImage(imageSrc) {
  const previewImage = document.getElementById('previewImage');
  // Create a FileReader object
  const reader = new FileReader();
  // Set up the FileReader onload event
  reader.onload = () => {
    // Set the source of the preview image to the FileReader result
    previewImage.src = reader.result;
  };
  // Read the file as a data URL
  fetch(imageSrc)
  .then(response => response.blob())
  .then(blob => {
    // Use the created Blob object
    reader.readAsDataURL(blob);
    previewImage.setAttribute('style', 'display: block');
    previewImage.setAttribute('class', 'materialboxed');
    instance.open();
  })
  .catch(error => {
    console.error('Error fetching file:', error);
  });
  
  // reader.readAsDataURL(imageSrc);
  // previewImage.setAttribute('style', 'display: block');
}

function addModals(listeImages){
  const imageArray = Array.from(listeImages);
  imageArray.forEach((image) => {
  image.addEventListener('click', () => {
    previewImage(image.src);
  });
});
}

const imageGrid = document.querySelector('.image-grid');
if(imageGrid){
  fetch('/user/images', {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    let updatedData;
    const ul = document.createElement('ul');
    const previous = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '#!');
    const icon = document.createElement('i');
    icon.setAttribute('class', 'material-icons');
    icon.textContent = 'chevron_left';
    anchor.appendChild(icon);
    previous.appendChild(anchor);
    if(!data.has_prev){
      previous.setAttribute('class', 'disabled');
    }
    ul.setAttribute('class', 'pagination');
    ul.appendChild(previous);
    for(let i=0; i < data.total_pages; i++) {
      const li = document.createElement('li');
      li.setAttribute('class', 'waves-effect');
      const a = document.createElement('a');
      a.setAttribute('href', '#!')
      a.textContent = i + 1;
      a.addEventListener('click', (e) => {
        const currentNode = e.target.parentNode;
        currentNode.setAttribute('class', 'active');
        const siblings = Array.from(e.target.parentNode.parentNode.childNodes);
        siblings.forEach(node => {
          if(node !== currentNode){
            node.setAttribute('class', 'inactive');
            node.setAttribute('style', 'background-color:none;');
          }
        })
        e.target.parentNode.setAttribute('style', 'background-color: #26a69a;');
        const pageNumber = parseInt(e.target.innerText);
        updatedData = getPaginatedData(pageNumber, 2);
        updatedData.then(result => {
          imageGrid.innerHTML = getCardList(result);
          const imageList = imageGrid.querySelectorAll('.displayed-image');
          addModals(imageList);
        });
      });
      li.appendChild(a);
      ul.appendChild(li);
      const firstAnchor = Array.from(ul.querySelectorAll('a'))[1];
      if(parseInt(firstAnchor.textContent) === data.current_page){
        firstAnchor.parentNode.setAttribute('class', 'active');
        firstAnchor.parentNode.setAttribute('style', 'background-color: #26a69a;');
      }
    }
    const next = document.createElement('li');
    const next_anchor = document.createElement('a');
    next_anchor.setAttribute('href', '#!');
    const next_icon = document.createElement('i');
    next_icon.setAttribute('class', 'material-icons');
    next_icon.textContent = 'chevron_right';
    next_anchor.appendChild(next_icon);
    next.appendChild(next_anchor);
    if(!data.has_next){
      next.setAttribute('class', 'disabled');
    }
    ul.appendChild(next);

    const cardList = getCardList(data);
    imageGrid.innerHTML = cardList;
    const imageList = imageGrid.querySelectorAll('.displayed-image');
    addModals(imageList);
    const paginationBloc = document.querySelector('#pagination-bloc');
    paginationBloc.appendChild(ul);
    // select.addEventListener('change', (e) => {
    //   console.log(select.value);
    // })
    
  })
  .catch(error => {
    M.toast({html: `${error}`, classes: "red-toast"});
  })
}

    const formatSelect = document.querySelector('#format-select');
    const fromatSelectInstance = M.FormSelect.init(formatSelect);
    const modeSelect = document.querySelector('#mode-select');
    const modeSelectInstance = M.FormSelect.init(modeSelect);
    const resolutionSelect = document.querySelector('#resolution-select');
    const resolutionSelectInstance = M.FormSelect.init(resolutionSelect);
    const paymentCheckbox = document.querySelector('#pay-check');

    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener('change', (e) => {
      const formatValue = formatSelect.value;
      const resolutionValue = resolutionSelect.value;
      const modeValue = modeSelect.value;
      const paymentValue = paymentCheckbox.checked;

      const data = {
        format: formatValue,
        resolution: JSON.stringify(resolutionValue),
        mode: modeValue,
        payment: JSON.stringify(paymentValue)
      }
      const urlEncodedData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
      
      fetch('/user/images/search', {
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: urlEncodedData
      })
      .then(response => response.json())
      .then(data => {
        let updatedData;
        const ul = document.createElement('ul');
        const previous = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#!');
        const icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons');
        icon.textContent = 'chevron_left';
        anchor.appendChild(icon);
        previous.appendChild(anchor);
        if(!data.has_prev){
          previous.setAttribute('class', 'disabled');
        }
        ul.setAttribute('class', 'pagination');
        ul.appendChild(previous);
        for(let i=0; i < data.total_pages; i++) {
          const li = document.createElement('li');
          li.setAttribute('class', 'waves-effect');
          const a = document.createElement('a');
          a.setAttribute('href', '#!')
          a.textContent = i + 1;
          a.addEventListener('click', (e) => {
            const currentNode = e.target.parentNode;
            currentNode.setAttribute('class', 'active');
            const siblings = Array.from(e.target.parentNode.parentNode.childNodes);
            siblings.forEach(node => {
              if(node !== currentNode){
                node.setAttribute('class', 'inactive');
                node.setAttribute('style', 'background-color:none;');
              }
            })
            e.target.parentNode.setAttribute('style', 'background-color: #26a69a;');
            const pageNumber = parseInt(e.target.innerText);
            updatedData = getSearchPaginatedData(pageNumber, 2, '/user/images/search', urlEncodedData);
            updatedData.then(result => {
              imageGrid.innerHTML = getCardList(result);
              const imageList = imageGrid.querySelectorAll('.displayed-image');
              addModals(imageList);
            });
          });
          li.appendChild(a);
          ul.appendChild(li);
          const firstAnchor = Array.from(ul.querySelectorAll('a'))[1];
          if(parseInt(firstAnchor.textContent) === data.current_page){
            firstAnchor.parentNode.setAttribute('class', 'active');
            firstAnchor.parentNode.setAttribute('style', 'background-color: #26a69a;');
          }
        }
        const next = document.createElement('li');
        const next_anchor = document.createElement('a');
        next_anchor.setAttribute('href', '#!');
        const next_icon = document.createElement('i');
        next_icon.setAttribute('class', 'material-icons');
        next_icon.textContent = 'chevron_right';
        next_anchor.appendChild(next_icon);
        next.appendChild(next_anchor);
        if(!data.has_next){
          next.setAttribute('class', 'disabled');
        }
        ul.appendChild(next);

        const cardList = getCardList(data);
        imageGrid.innerHTML = cardList;
        const imageList = imageGrid.querySelectorAll('.displayed-image');
        addModals(imageList);
        const paginationBloc = document.querySelector('#pagination-bloc');
        const ulToReplace = paginationBloc.querySelector('ul');
        paginationBloc.replaceChild(ul, ulToReplace);

      })
      .catch(error => {
        M.toast({html: `${error}`, classes: "red-toast"});
      })


    })

// function previewImage(imageSrc) {
//   console.log(imageSrc);
//   const previewImage = document.getElementById('previewImage');
//   // Create a FileReader object
//   const reader = new FileReader();
//   // Set up the FileReader onload event
//   reader.onload = () => {
//     // Set the source of the preview image to the FileReader result
//     previewImage.src = reader.result;
//   };
//   // Read the file as a data URL
//   reader.readAsDataURL(imageSrc);
//   previewImage.setAttribute('style', 'display: block');
// }

}


});
