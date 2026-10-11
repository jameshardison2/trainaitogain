// chat.js
// "Ask AI Recruiter" chat widget removed per user request

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      const currentWindowPath = window.location.pathname;
      
      // If the path matches (ignoring empty/index differences)
      if (linkPath === currentWindowPath || (currentWindowPath === '/' && linkPath.includes('index'))) {
        // Don't mess with the green 'The Hiring Pipeline' button
        if (link.style && !link.style.background.includes('var(--primary)')) {
          link.style.color = 'var(--primary)';
          link.style.fontWeight = '700';
        }
      }
    } catch (e) {
      // ignore
    }
  });
});
