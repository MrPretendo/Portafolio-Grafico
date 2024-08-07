// Variables globales
let galleryData = [];
const galleryGrid = document.getElementById('gallery-grid');
const sortSelect = document.getElementById('sort-select');
const projectSelect = document.getElementById('project-select');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLongDescription = document.getElementById('modal-long-description');
const modalDate = document.getElementById('modal-date');
const closeBtn = document.getElementsByClassName('close')[0];

// Efecto de scroll en la barra de navegación
window.addEventListener('scroll', function() {
    const header = document.querySelector('.u-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Cargar datos de la galería
fetch('gallery-data.json')
    .then(response => response.json())
    .then(data => {
        galleryData = data.images;
        populateProjectSelect();
        renderGallery(galleryData);
    })
    .catch(error => console.error('Error loading gallery data:', error));

function populateProjectSelect() {
    const projects = [...new Set(galleryData.map(img => img.project))].sort();
    projectSelect.innerHTML = '<option value="all">Todos los proyectos</option>';
    projects.forEach(project => {
        projectSelect.innerHTML += `<option value="${project}">${project}</option>`;
    });
}

function renderGallery(images) {
    galleryGrid.innerHTML = '';
    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'u-gallery-item';
        galleryItem.innerHTML = `
            <div class="image-container">
                <img src="${image.thumbnail}" data-full-img="${image.fullImage}" alt="${image.title}" loading="lazy">
            </div>
            <h3>${image.title}</h3>
            <h4>${image.description}</h4>
        `;
        galleryGrid.appendChild(galleryItem);
    });
    addImageClickListeners();
}

function addImageClickListeners() {
    document.querySelectorAll('.image-container img').forEach(img => {
        img.onclick = function() {
            const image = galleryData.find(item => item.fullImage === this.getAttribute('data-full-img'));
            openModal(image);
        }
    });
}

function sortImages() {
    const sortBy = sortSelect.value;
    const projectFilter = projectSelect.value;
    
    let sortedImages = [...galleryData];
    
    if (projectFilter !== 'all') {
        sortedImages = sortedImages.filter(img => img.project === projectFilter);
    }
    
    switch(sortBy) {
        case 'default':
            sortedImages.sort((a, b) => a.id - b.id);
            break;
        case 'dateAsc':
            sortedImages.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'dateDesc':
            sortedImages.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'project':
            sortedImages.sort((a, b) => a.project.localeCompare(b.project));
            break;
    }
    
    renderGallery(sortedImages);
}

function openModal(image) {
    modal.style.display = "block";
    modalImg.src = image.fullImage;
    modalImg.onload = resizeImage;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
    modalLongDescription.innerHTML = image.longDescription.replace(/\n/g, '<br>');
    modalDate.textContent = `${image.date} - ${image.project}`;
}

function resizeImage() {
    const containerWidth = modalImg.parentElement.offsetWidth;
    const containerHeight = modalImg.parentElement.offsetHeight;
    const imgRatio = modalImg.naturalWidth / modalImg.naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    if (imgRatio > containerRatio) {
        modalImg.style.width = '100%';
        modalImg.style.height = 'auto';
    } else {
        modalImg.style.height = '100%';
        modalImg.style.width = 'auto';
    }
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('resize', resizeImage);

// Event listeners para ordenación y filtrado
sortSelect.addEventListener('change', sortImages);
projectSelect.addEventListener('change', sortImages);

// Desplazamiento suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Inicializar la galería con la ordenación predeterminada
window.addEventListener('DOMContentLoaded', (event) => {
    sortSelect.value = 'default';
    sortImages();
});