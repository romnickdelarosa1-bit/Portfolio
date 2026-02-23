// ========== NAVBAR: Hamburger & Smooth Scroll ==========
document.getElementById('hamburger').addEventListener('click', function () {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
  const icon = this.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navLinks = document.getElementById('navLinks');
      const hamburgerIcon = document.querySelector('.hamburger i');
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
      }
      window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(10, 10, 10, 0.98)';
    header.style.backdropFilter = 'blur(15px)';
  } else {
    header.style.background = 'rgba(10, 10, 10, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  }
});

// ========== QUOTESLATE API ==========
async function fetchRandomQuote() {
  const el = document.getElementById('random-quote');
  const btn = document.getElementById('refresh-quote-btn');

  // Fade out
  el.style.transition = 'opacity 0.3s';
  el.style.opacity = '0';

  if (btn) {
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
  }

  try {
    const response = await fetch('https://quoteslate.vercel.app/api/quotes/random');
    if (!response.ok) throw new Error('QuoteSlate API error');
    const data = await response.json();

    setTimeout(() => {
      el.innerHTML = `
        <p style="font-style:italic; color:var(--lighter); margin-bottom:0.5rem; font-size:0.95rem;">"${data.quote}"</p>
        <span style="color:var(--gold); font-weight:600; font-size:0.85rem;">— ${data.author}</span>
      `;
      el.style.opacity = '1';
      if (btn) {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
      }
    }, 300);

  } catch (err) {
    console.error('QuoteSlate error:', err);
    setTimeout(() => {
      el.innerHTML = `
        <p style="font-style:italic; color:var(--lighter); margin-bottom:0.5rem; font-size:0.95rem;">"The only way to do great work is to love what you do."</p>
        <span style="color:var(--gold); font-weight:600; font-size:0.85rem;">— Steve Jobs</span>
      `;
      el.style.opacity = '1';
      if (btn) {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
      }
    }, 300);
  }
}

fetchRandomQuote();

// Attach refresh button click (button must have id="refresh-quote-btn" in HTML)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('refresh-quote-btn');
  if (btn) btn.addEventListener('click', fetchRandomQuote);
});

// ========== IMAGE MODAL ==========
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const modalCaption = document.getElementById('modalCaption');

document.querySelectorAll('.project-image').forEach(projectImage => {
  projectImage.addEventListener('click', function () {
    const img = this.querySelector('img');
    const projectTitle = this.closest('.project-card').querySelector('.project-title h3').textContent;
    if (img && img.src) {
      modal.style.display = 'block';
      modalImage.src = img.src;
      modalCaption.textContent = projectTitle;
      document.body.style.overflow = 'hidden';
    }
  });
});

closeModal.addEventListener('click', function () {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ========== CONTACT FORM (EmailJS only — no backend) ==========
emailjs.init('A_pw5fadi7TmA_doC'); // Your EmailJS Public Key

const contactForm = document.getElementById('contact-form');
const contactResult = document.getElementById('contact-result');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    contactResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> All fields are required.</div>';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    contactResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Please enter a valid email address.</div>';
    return;
  }

  contactResult.innerHTML = '<div class="api-loading" style="padding:0;"><i class="fas fa-spinner fa-pulse"></i> Sending...</div>';

  try {
    await emailjs.send(
      'service_iumelhm',   // Your EmailJS Service ID
      'template_yocysnv',  // Your EmailJS Template ID
      { name, email, message }
    );
    contactResult.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Message sent successfully!</div>';
    contactForm.reset();
  } catch (error) {
    contactResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Failed to send. Please try again.</div>';
    console.error('EmailJS error:', error);
  }
});

// ========== FEEDBACK (localStorage — no backend) ==========
const feedbackForm = document.getElementById('feedback-form');
const feedbackResult = document.getElementById('feedback-result');
const feedbackContainer = document.getElementById('feedback-list-container');
const toggleBtn = document.getElementById('toggle-feedback-btn');
const toggleIcon = document.getElementById('toggle-icon');

const STORAGE_KEY = 'portfolio_feedbacks';

function getFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFeedback(entry) {
  const feedbacks = getFeedbacks();
  feedbacks.unshift(entry); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}

function renderFeedbacks() {
  const feedbacks = getFeedbacks();
  const count = feedbacks.length;
  const isHidden = feedbackContainer.style.display === 'none';

  toggleBtn.innerHTML = `<i class="fas ${isHidden ? 'fa-chevron-down' : 'fa-chevron-up'}" id="toggle-icon"></i> ${
    count === 0
      ? 'No feedback yet'
      : (isHidden ? 'Show' : 'Hide') + ` past feedback (${count})`
  }`;

  if (count === 0) {
    feedbackContainer.innerHTML = '<p style="opacity:0.7;">No feedback yet. Be the first to leave one!</p>';
    return;
  }

  feedbackContainer.innerHTML = feedbacks.map(fb => `
    <div style="background: rgba(212,175,55,0.05); border-left: 3px solid var(--gold); padding: 1rem; margin-bottom: 1rem; border-radius: 0 8px 8px 0;">
      <strong style="color: var(--gold);">${fb.name}</strong>
      <span style="font-size:0.8rem; opacity:0.6; margin-left:0.8rem;">${new Date(fb.date).toLocaleString()}</span>
      <p style="margin-top:0.5rem;">${fb.message}</p>
    </div>
  `).join('');
}

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('feedback-name').value.trim();
  const message = document.getElementById('feedback-message').value.trim();

  if (!name || !message) {
    feedbackResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Both fields are required.</div>';
    return;
  }

  saveFeedback({ name, message, date: new Date().toISOString() });
  feedbackResult.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> Thank you ${name}! Your feedback has been recorded.</div>`;
  feedbackForm.reset();
  renderFeedbacks();

  // Auto-open the feedback list after submitting
  if (feedbackContainer.style.display === 'none') {
    feedbackContainer.style.display = 'block';
    renderFeedbacks();
  }
});

toggleBtn.addEventListener('click', () => {
  const isHidden = feedbackContainer.style.display === 'none';
  feedbackContainer.style.display = isHidden ? 'block' : 'none';
  renderFeedbacks();
});

// Load on page start
renderFeedbacks();

// ========== GITHUB & DEV.TO APIs ==========
(function () {
  const GITHUB_USERNAME = 'romnickdelarosa1-bit';

  async function fetchGitHubRepos() {
    const loading = document.getElementById('github-loading');
    const repoContainer = document.getElementById('github-repos');
    const errorDiv = document.getElementById('github-error');
    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
      if (!response.ok) throw new Error('GitHub API error');
      const repos = await response.json();
      loading.style.display = 'none';
      if (repos.length === 0) {
        repoContainer.style.display = 'block';
        repoContainer.innerHTML = '<p style="text-align:center;">No public repositories found.</p>';
        return;
      }
      repoContainer.style.display = 'grid';
      repoContainer.innerHTML = repos.map(repo => `
        <div class="repo-card">
          <div class="repo-name"><i class="fab fa-github"></i> ${repo.name}</div>
          <div class="repo-desc">${repo.description || 'No description provided'}</div>
          <div class="repo-meta">
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            ${repo.language ? `<span><i class="fas fa-circle" style="color:var(--gold);"></i> ${repo.language}</span>` : ''}
            <span><i class="fas fa-external-link-alt"></i> <a href="${repo.html_url}" target="_blank" style="color:var(--gold);">view</a></span>
          </div>
        </div>
      `).join('');
    } catch (err) {
      loading.style.display = 'none';
      errorDiv.style.display = 'block';
      errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Failed to load GitHub repos. ${err.message}`;
    }
  }

  window.addEventListener('load', function () {
    fetchGitHubRepos();
  });
})();

// ========== PROJECT INQUIRY MODAL ==========
const inquiryModal = document.getElementById('inquiryModal');
const closeInquiry = document.getElementById('closeInquiryModal');
const inquiryForm = document.getElementById('inquiry-form');
const inquiryResult = document.getElementById('inquiry-result');
const inquiryProject = document.getElementById('inquiry-project');
const inquiryName = document.getElementById('inquiry-name');
const inquiryEmail = document.getElementById('inquiry-email');
const inquiryMessage = document.getElementById('inquiry-message');

// Open modal on button click
document.querySelectorAll('.btn-inquiry').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const projectName = this.getAttribute('data-project');
    inquiryProject.value = projectName;
    // Pre-fill a default message (optional)
    inquiryMessage.value = `I'm interested in "${projectName}" and would like more details.`;
    inquiryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
closeInquiry.addEventListener('click', function() {
  inquiryModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  inquiryResult.innerHTML = ''; // clear previous messages
});

// Click outside to close
window.addEventListener('click', function(e) {
  if (e.target === inquiryModal) {
    inquiryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    inquiryResult.innerHTML = '';
  }
});

// Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && inquiryModal.style.display === 'block') {
    inquiryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    inquiryResult.innerHTML = '';
  }
});

// Form submission
inquiryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = inquiryName.value.trim();
  const email = inquiryEmail.value.trim();
  const message = inquiryMessage.value.trim();
  const project = inquiryProject.value.trim();

  if (!name || !email || !message) {
    inquiryResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> All fields are required.</div>';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    inquiryResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Please enter a valid email address.</div>';
    return;
  }

  inquiryResult.innerHTML = '<div class="api-loading" style="padding:0;"><i class="fas fa-spinner fa-pulse"></i> Sending...</div>';

  // Combine project name into the message (since the template only has name, email, message)
  const fullMessage = `Inquiry about project: ${project}\n\n${message}`;

  try {
    await emailjs.send(
      'service_iumelhm',   
      'template_yocysnv', 
      { name, email, message: fullMessage }
    );
    inquiryResult.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Inquiry sent successfully!</div>';
    inquiryForm.reset();
    // Optionally close modal after 2 seconds
    setTimeout(() => {
      inquiryModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      inquiryResult.innerHTML = '';
    }, 2000);
  } catch (error) {
    inquiryResult.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Failed to send. Please try again.</div>';
    console.error('EmailJS error:', error);
  }
});