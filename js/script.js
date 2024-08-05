// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.u-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Gallery image modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLongDescription = document.getElementById('modal-long-description');
const modalDate = document.getElementById('modal-date');
const closeBtn = document.getElementsByClassName('close')[0];
const galleryImages = document.querySelectorAll('.image-container img');

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

galleryImages.forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.onload = resizeImage;

        // Get the parent gallery item
        const galleryItem = this.closest('.u-gallery-item');
        
        // Fill in the modal information
        modalTitle.textContent = galleryItem.querySelector('h3').textContent;
        modalDescription.textContent = galleryItem.querySelector('h4').textContent;
        
        // Get the long description
        const longDescElement = galleryItem.querySelector('.long-description');
        modalLongDescription.textContent = longDescElement 
            ? longDescElement.textContent 
            : "Esta es una descripción más larga de la imagen. Puedes agregar más detalles aquí.";
        
        // Get the date
        const dateElement = galleryItem.querySelector('.hidden-date');
        modalDate.textContent = dateElement ? dateElement.textContent : '';
    }
});

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('resize', resizeImage);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});