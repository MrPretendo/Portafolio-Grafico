// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.u-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Gallery image modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementsByClassName('close')[0];
const galleryImages = document.querySelectorAll('.image-container img');

function resizeImage() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const imgRatio = modalImg.naturalWidth / modalImg.naturalHeight;
    const windowRatio = windowWidth / windowHeight;

    if (imgRatio > windowRatio) {
        // Image is wider than the window ratio
        modalImg.style.width = '90%';
        modalImg.style.height = 'auto';
    } else {
        // Image is taller than the window ratio
        modalImg.style.height = '90%';
        modalImg.style.width = 'auto';
    }
}

galleryImages.forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.onload = resizeImage;
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