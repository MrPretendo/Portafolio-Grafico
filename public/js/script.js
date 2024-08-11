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
const sections = {
    home: document.getElementById('home'),
    gallery: document.getElementById('gallery'),
    about: document.getElementById('about')
};
let aboutContent = '';

// Función principal de inicialización
function initializeApp() {
    handlePageTransition();
    loadGalleryData();
    addEventListeners();
}

// Inicializar la funcionalidad de modo oscuro
function initDarkMode() {
    const toggleContainer = document.getElementById('dark-mode-toggle-container');
    const toggle = document.getElementById('toggle');
    
    if (toggleContainer && toggle) {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            toggle.checked = true;
        }

        toggleContainer.addEventListener('click', function() {
            toggle.checked = !toggle.checked;
            if (toggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', null);
            }
        });
    } else {
        console.error('Dark mode toggle elements not found');
    }
}

// Manejar la transición entre secciones
function handlePageTransition() {
    const homeLink = document.querySelector('.u-logo');
    const galleryLink = document.getElementById('gallery-link');
    const aboutLink = document.getElementById('about-link');
    const menuAboutLink = document.getElementById('menu-about-link');
    const heroGalleryLink = document.querySelector('.u-hero .u-cta-container .u-cta-button#gallery-link');
    const heroStoryLink = document.querySelector('.u-hero .u-cta-container .u-cta-button#stories-link');
    const menuStoryLink = document.querySelector('.dropdown-item[href="stories.html"]');

    const showSection = function(e, section) {
        if (e) e.preventDefault();
        Object.values(sections).forEach(sec => {
            if (sec) {
                sec.style.display = 'none';
                sec.classList.remove('active-section');
            }
        });
        if (section) {
            section.style.display = 'block';
            section.classList.add('active-section');
            section.classList.add('fade-in');
            setTimeout(() => {
                section.classList.remove('fade-in');
            }, 500);
        }

        // Asegurarse de que la sección de inicio siempre mantenga su estilo centrado
        if (sections.home) {
            sections.home.style.display = section === sections.home ? 'flex' : 'none';
            sections.home.style.alignItems = 'center';
            sections.home.style.justifyContent = 'center';
            sections.home.style.minHeight = '100vh';
        }
    };

    if (galleryLink) galleryLink.addEventListener('click', (e) => showSection(e, sections.gallery));
    if (heroGalleryLink) heroGalleryLink.addEventListener('click', (e) => showSection(e, sections.gallery));
    if (aboutLink) aboutLink.addEventListener('click', (e) => loadAboutContent());
    if (menuAboutLink) menuAboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadAboutContent();
    });
    if (homeLink) homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(e, sections.home);
    });

    // Manejar la redirección a stories.html
    if (heroStoryLink) {
        heroStoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'stories.html';
        });
    }
    if (menuStoryLink) {
        menuStoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'stories.html';
        });
    }
}

// Configurar el botón del menú
function setupMenuButton() {
    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (!menuButton || !dropdownMenu) {
        console.error('Menu button or dropdown menu not found');
        return;
    }

    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
            menuButton.classList.remove('menu-open');
        } else {
            dropdownMenu.style.display = 'block';
            menuButton.classList.add('menu-open');
        }
    });

    document.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
            menuButton.classList.remove('menu-open');
        }
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const section = e.target.getAttribute('data-section');
            dropdownMenu.style.display = 'none';
            menuButton.classList.remove('menu-open');
            if (section === 'gallery') {
                document.getElementById('gallery-link').click();
            } else if (section === 'about') {
                loadAboutContent();
            }
        });
    });

    const galleryMenuItem = document.querySelector('.dropdown-item[data-section="gallery"]');
    if (galleryMenuItem) {
        galleryMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('gallery-link').click();
        });
    }
}

// Cargar datos de la galería
function loadGalleryData() {
    console.log('Intentando cargar datos de la galería...');
    fetch('./gallery-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data);
            galleryData = data.images;
            populateProjectSelect();
            renderGallery(galleryData);
        })
        .catch(error => {
            console.error('Error loading gallery data:', error);
            if (galleryGrid) {
                galleryGrid.innerHTML = '<p>Error al cargar los datos de la galería. Por favor, verifica la ruta del archivo JSON y vuelve a intentarlo.</p>';
            }
        });
}

// Poblar el select de proyectos
function populateProjectSelect() {
    if (!projectSelect) {
        console.error('Project select element not found');
        return;
    }
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
    if (!galleryGrid) {
        console.error('Gallery grid element not found');
        return;
    }
    console.log('Renderizando galería con', images.length, 'imágenes');
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
    if (!sortSelect || !projectSelect) {
        console.error('Sort or project select elements not found');
        return;
    }
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
    if (!modal || !modalImg || !modalTitle || !modalDescription || !modalLongDescription || !modalDate) {
        console.error('Modal elements not found');
        return;
    }
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
    if (!modalImg) return;
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

// Cargar contenido de About
function loadAboutContent() {
    if (aboutContent) {
        showAboutContent();
        return;
    }
    
    fetch('about.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const aboutContentElement = doc.querySelector('.about-content');
            if (aboutContentElement) {
                // Crear la estructura necesaria para el contenido
                const aboutSection = document.createElement('div');
                aboutSection.className = 'about-content';
                
                // Agregar el contenido al nuevo contenedor
                aboutSection.innerHTML = aboutContentElement.innerHTML;
                
                // Actualizar el contenido global
                aboutContent = aboutSection.outerHTML;
                
                showAboutContent();
            } else {
                console.error('No se encontró el elemento .about-content en about.html');
                sections.about.innerHTML = '<p>Error al cargar el contenido. Por favor, intenta de nuevo más tarde.</p>';
                showAboutContent();
            }
        })
        .catch(error => {
            console.error('Error loading about content:', error);
            sections.about.innerHTML = '<p>Error al cargar el contenido. Por favor, intenta de nuevo más tarde.</p>';
            showAboutContent();
        });
}

// Mostrar contenido de About
function showAboutContent() {
    if (sections.about) {
        sections.about.innerHTML = aboutContent;
        Object.values(sections).forEach(section => {
            section.style.display = section === sections.about ? 'flex' : 'none';
        });
        if (sections.about.style.display === 'flex') {
            sections.about.style.alignItems = 'center';
            sections.about.style.justifyContent = 'center';
        }
        sections.about.classList.add('fade-in');
        setTimeout(() => {
            sections.about.classList.remove('fade-in');
        }, 500);
    } else {
        console.error('About section not found');
    }
}

// Agregar event listeners
function addEventListeners() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.u-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    const closeBtn = document.querySelector('.close');
    if (closeBtn && modal) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    window.addEventListener('resize', resizeImage);

    if (sortSelect && projectSelect) {
        sortSelect.addEventListener('change', sortImages);
        projectSelect.addEventListener('change', sortImages);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupMenuButton();
    initDarkMode();
});