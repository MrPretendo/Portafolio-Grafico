// Efecto de scroll en la barra de navegación
window.addEventListener('scroll', function() {
    const header = document.querySelector('.u-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Elementos del DOM
const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLongDescription = document.getElementById('modal-long-description');
const modalDate = document.getElementById('modal-date');
const closeBtn = document.getElementsByClassName('close')[0];

// Cargar datos de la galería
fetch('/public/gallery-data.json')
    .then(response => response.json())
    .then(data => {
        data.images.forEach(image => {
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

        // Añadir event listeners a las imágenes después de cargarlas
        document.querySelectorAll('.image-container img').forEach(img => {
            img.onclick = function() {
                const image = data.images.find(img => img.fullImage === this.getAttribute('data-full-img'));
                openModal(image);
            }
        });
    })
    .catch(error => console.error('Error loading gallery data:', error));

function openModal(image) {
    modal.style.display = "block";
    modalImg.src = image.fullImage;
    modalImg.onload = resizeImage;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
    modalLongDescription.textContent = image.longDescription;
    modalDate.textContent = image.date;
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

// Desplazamiento suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});