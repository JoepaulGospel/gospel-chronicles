// ================= CLOUDINARY CONFIG =================
const CLOUDINARY_CONFIG = {
  cloudName: 'drigva9i0',
  uploadPreset: 'joepaul_portfolio' // Must match your Cloudinary Upload Preset
};

// ================= DOM ELEMENTS =================
const loginSection = document.getElementById('login-section');
const uploadSection = document.getElementById('upload-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const uploadStatus = document.getElementById('upload-status');
const videoFile = document.getElementById('video-file');
const videoPreview = document.getElementById('video-preview');
const thumbnailFile = document.getElementById('thumbnail-file');
const projectList = document.getElementById('projects-container');
const uploadBtn = document.getElementById('upload-btn');

// ================= SIMPLE AUTH =================
const ADMIN_CREDS = { email: 'admin@joepaul.com', password: 'joepaul2026' };
let isAdmin = false;

if (localStorage.getItem('adminLoggedIn') === 'true') showAdminPanel();

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminPanel();
  } else {
    showStatus(loginError, 'Invalid credentials', 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminLoggedIn');
  isAdmin = false;
  loginSection.classList.remove('hidden');
  uploadSection.classList.add('hidden');
});

function showAdminPanel() {
  isAdmin = true;
  loginSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
  loadProjects();
}

// ================= FILE PREVIEW =================
videoFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    videoPreview.textContent = file.name;
    videoPreview.style.color = 'var(--text)';
  }
});

// ================= UPLOAD HANDLER =================
uploadBtn.addEventListener('click', async () => {
  const title = document.getElementById('project-title').value;
  const category = document.getElementById('project-category').value;
  const description = document.getElementById('project-description').value;
  const link = document.getElementById('project-link').value;
  
  if (!title || !videoFile.files[0]) {
    showStatus(uploadStatus, 'Title and video are required', 'error');
    return;
  }
  
  showStatus(uploadStatus, 'Uploading video to Cloudinary...', 'success');
  uploadBtn.disabled = true;
  
  try {
    const videoUrl = await uploadToCloudinary(videoFile.files[0], 'video');
    let thumbnailUrl = '';
    if (thumbnailFile.files[0]) {
      thumbnailUrl = await uploadToCloudinary(thumbnailFile.files[0], 'image');
    }
    
    const project = {
      id: Date.now(),
      title, category, description,
      link: link || '',
      videoUrl, thumbnailUrl,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    
    await saveProjectToCloudinary(project);
    showStatus(uploadStatus, '✅ Project uploaded successfully!', 'success');
    
    // Reset form
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-link').value = '';
    videoFile.value = '';
    thumbnailFile.value = '';
    videoPreview.textContent = 'No video selected';
    videoPreview.style.color = 'var(--text-muted)';
    
    loadProjects();
  } catch (error) {
    console.error('Upload error:', error);
    showStatus(uploadStatus, '❌ Upload failed: ' + error.message, 'error');
  } finally {
    uploadBtn.disabled = false;
  }
});

// ================= CLOUDINARY UPLOAD WIDGET =================
async function uploadToCloudinary(file, resourceType) {
  return new Promise((resolve, reject) => {
    cloudinary.openUploadWidget({
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      resourceType: resourceType,
      sources: ['local']
    }, (error, result) => {
      if (error) reject(error);
      else if (result && result.event === 'success') {
        resolve(result.info.secure_url);
      }
    });
  });
}

// ================= SAVE PROJECT (LocalStorage Fallback) =================
async function saveProjectToCloudinary(project) {
  const res = await fetch('https://res.cloudinary.com/drigva9i0/raw/upload/portfolio-projects.json');
  let projects = [];
  if (res.ok) projects = await res.json();
  
  projects.unshift(project);
  console.log('Update portfolio-projects.json with:', JSON.stringify(projects, null, 2));
  localStorage.setItem('portfolio-projects', JSON.stringify(projects));
}

// ================= LOAD & RENDER PROJECTS =================
async function loadProjects() {
  try {
    const local = localStorage.getItem('portfolio-projects');
    if (local) { renderProjectList(JSON.parse(local)); return; }
    
    const res = await fetch('https://res.cloudinary.com/drigva9i0/raw/upload/portfolio-projects.json');
    if (res.ok) { renderProjectList(await res.json()); }
    else { projectList.innerHTML = '<p style="color: var(--text-muted);">No projects yet. Upload your first!</p>'; }
  } catch (error) {
    projectList.innerHTML = '<p style="color: #ef4444;">Failed to load projects.</p>';
  }
}

function renderProjectList(projects) {
  if (!projects || projects.length === 0) {
    projectList.innerHTML = '<p style="color: var(--text-muted);">No projects yet. Upload your first!</p>';
    return;
  }
  
  projectList.innerHTML = projects.map(p => `
    <div class="project-item">
      <div>
        <h4>${p.title}</h4>
        <p>${p.category} • ${p.date}</p>
      </div>
      <button class="delete-btn" data-id="${p.id}">Delete</button>
    </div>
  `).join('');
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (confirm('Delete this project?')) {
        const id = parseInt(e.target.dataset.id);
        let projects = JSON.parse(localStorage.getItem('portfolio-projects') || '[]');
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('portfolio-projects', JSON.stringify(projects));
        loadProjects();
      }
    });
  });
}

// ================= STATUS HELPER =================
function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status-msg status-${type}`;
  element.classList.toggle('hidden', !message);
}