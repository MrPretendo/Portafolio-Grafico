// Función para manejar rutas de archivos
function getAssetPath(path) {
    // Eliminar '/public' si está presente al principio de la ruta
    path = path.replace(/^\/public/, '');
    
    // Si la ruta no comienza con '/', añadirlo
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    
    return path;
}

// Cargar la estructura de historias
fetch('stories.json')
  .then(response => response.json())
  .then(data => {
    createMenu(data.projects);
  })
  .catch(error => {
    console.error('Error loading stories data:', error);
    document.getElementById('stories-menu').innerHTML = '<p>Error loading stories. Please try again later.</p>';
  });

function createMenu(projects) {
  const menu = document.getElementById('stories-menu');
  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    
    // Usar la función getAssetPath para manejar la ruta de la imagen
    const coverPath = getAssetPath(project.cover);
    
    projectItem.innerHTML = `
      <div class="project-cover">
        <img src="${coverPath}" alt="${project.title} cover">
        <h3>${project.title}</h3>
      </div>
      <ul class="chapter-list" style="display: none;">
        ${project.chapters.map(chapter => `
          <li data-project="${project.id}" data-project-path="${project.projectPath}" data-file="${chapter.file}">${chapter.title}</li>
        `).join('')}
      </ul>
    `;
    menu.appendChild(projectItem);

    projectItem.querySelector('.project-cover').addEventListener('click', () => {
      const chapterList = projectItem.querySelector('.chapter-list');
      chapterList.style.display = chapterList.style.display === 'none' ? 'block' : 'none';
    });
  });

  menu.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
      const projectId = event.target.dataset.project;
      const projectPath = event.target.dataset.projectPath;
      const file = event.target.dataset.file;
      loadChapter(projectId, projectPath, file);
      // Highlight the selected chapter
      menu.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
      event.target.classList.add('selected');
    }
  });
}

function loadChapter(projectId, projectPath, file) {
  const chapterPath = getAssetPath(`${projectPath}${file}`);
  console.log('Attempting to load:', chapterPath);
  fetch(chapterPath)
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Chapter not found');
      }
      return response.text();
    })
    .then(markdown => {
      console.log('Markdown loaded, length:', markdown.length);
      const html = marked.parse(markdown);
      document.getElementById('story-content').innerHTML = html;
      // Scroll to the top of the content
      document.getElementById('story-content').scrollTop = 0;
      // Save the last read chapter
      saveLastReadChapter(projectId, projectPath, file);
    })
    .catch(error => {
      console.error('Error loading chapter:', error);
      document.getElementById('story-content').innerHTML = '<p>Error loading chapter. Please try again later.</p>';
    });
}

// Función para manejar las imágenes en el contenido Markdown
marked.use({
  renderer: {
    image(href, title, text) {
      return `<img src="${getAssetPath(href)}" alt="${text}" title="${title || ''}" loading="lazy">`;
    }
  }
});

// Función para guardar el último capítulo leído
function saveLastReadChapter(projectId, projectPath, file) {
  localStorage.setItem('lastRead', JSON.stringify({ projectId, projectPath, file }));
}

// Función para cargar el último capítulo leído
function loadLastReadChapter() {
  const lastRead = JSON.parse(localStorage.getItem('lastRead'));
  if (lastRead) {
    const chapterElement = document.querySelector(`li[data-project="${lastRead.projectId}"][data-project-path="${lastRead.projectPath}"][data-file="${lastRead.file}"]`);
    if (chapterElement) {
      chapterElement.click();
    }
  }
}

// Llamar a loadLastReadChapter después de crear el menú
document.addEventListener('DOMContentLoaded', () => {
  // El menú se crea cuando se carga el JSON, así que esperamos un poco
  setTimeout(loadLastReadChapter, 500);
});

// Manejar la navegación entre capítulos
function setupChapterNavigation() {
  const prevButton = document.getElementById('prev-chapter');
  const nextButton = document.getElementById('next-chapter');

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => navigateChapter('prev'));
    nextButton.addEventListener('click', () => navigateChapter('next'));
  }
}

function navigateChapter(direction) {
  const currentChapter = document.querySelector('.chapter-list li.selected');
  if (currentChapter) {
    const chapters = Array.from(currentChapter.parentNode.children);
    const currentIndex = chapters.indexOf(currentChapter);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : chapters.length - 1;
    } else {
      newIndex = currentIndex < chapters.length - 1 ? currentIndex + 1 : 0;
    }

    chapters[newIndex].click();
  }
}

// Función para manejar el cambio de tema (claro/oscuro)
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Aplicar el tema guardado al cargar la página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
    }
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupChapterNavigation();
  setupThemeToggle();
});