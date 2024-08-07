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

// Función principal de inicialización
function initializeApp() {
    loadDarkModeToggle();
    handlePageTransition();
    loadGalleryData();
    addEventListeners();
}

// Cargar el toggle de modo oscuro
function loadDarkModeToggle() {
    fetch('darkmode.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const toggleContainer = doc.getElementById('theme-toggle-button');
            document.getElementById('dark-mode-toggle-container').appendChild(toggleContainer);
            initDarkMode();
        })
        .catch(error => console.error('Error loading dark mode toggle:', error));
}

// Inicializar la funcionalidad de modo oscuro
function initDarkMode() {
    const toggle = document.getElementById('toggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }
    toggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', null);
        }
    });
}

// Manejar la transición entre la página principal y la galería
function handlePageTransition() {
    const homeSection = document.getElementById('home');
    const gallerySection = document.getElementById('gallery');
    const galleryLink = document.getElementById('gallery-link');
    const homeLink = document.querySelector('.u-logo');
    const heroGalleryLink = document.querySelector('.u-hero .u-cta-container .u-cta-button#gallery-link');

    galleryLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.classList.add('fade-out');
        setTimeout(() => {
            homeSection.style.display = 'none';
            homeSection.classList.remove('fade-out');
            gallerySection.style.display = 'block';
            gallerySection.classList.add('fade-in');
            setTimeout(() => {
                gallerySection.classList.remove('fade-in');
            }, 500);
        }, 500);
    });

    heroGalleryLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.classList.add('fade-out');
        setTimeout(() => {
            homeSection.style.display = 'none';
            homeSection.classList.remove('fade-out');
            gallerySection.style.display = 'block';
            gallerySection.classList.add('fade-in');
            setTimeout(() => {
                gallerySection.classList.remove('fade-in');
            }, 500);
        }, 500);
    });

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        gallerySection.classList.add('fade-out');
        setTimeout(() => {
            gallerySection.style.display = 'none';
            gallerySection.classList.remove('fade-out');
            homeSection.style.display = 'flex';
            homeSection.classList.add('fade-in');
            setTimeout(() => {
                homeSection.classList.remove('fade-in');
            }, 500);
        }, 500);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    handlePageTransition();
});






// Cargar datos de la galería
function loadGalleryData() {
    fetch('gallery-data.json')
        .then(response => response.json())
        .then(data => {
            galleryData = data.images;
            populateProjectSelect();
            renderGallery(galleryData);
        })
        .catch(error => console.error('Error loading gallery data:', error));
}

// Poblar el select de proyectos
function populateProjectSelect() {
    const projects = [...new Set(galleryData.map(img => img.project))].sort();
    projectSelect.innerHTML = '<option value="all">Todos los proyectos</option>';
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project;
        option.textContent = project;
        projectSelect.appendChild(option);
    });
}

// Renderizar la galería
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

// Agregar event listeners a las imágenes
function addImageClickListeners() {
    document.querySelectorAll('.image-container img').forEach(img => {
        img.onclick = function() {
            const image = galleryData.find(item => item.fullImage === this.getAttribute('data-full-img'));
            openModal(image);
        }
    });
}

// Ordenar y filtrar imágenes
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

// Abrir modal
function openModal(image) {
    modal.style.display = "block";
    modalImg.src = image.fullImage;
    modalImg.onload = resizeImage;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
    modalLongDescription.innerHTML = image.longDescription.replace(/\n/g, '<br>');
    modalDate.textContent = `${image.date} - ${image.project}`;
}

// Redimensionar imagen en el modal
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

// Agregar event listeners
function addEventListeners() {
    // Efecto de scroll en la barra de navegación
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.u-header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Cerrar modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Redimensionar imagen al cambiar el tamaño de la ventana
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
}

// Inicializar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', initializeApp);