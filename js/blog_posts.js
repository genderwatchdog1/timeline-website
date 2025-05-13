// Blog posts functionality
document.addEventListener('DOMContentLoaded', function() {
  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Add active class to current language link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.language-link').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && !currentPath.includes(link.getAttribute('href'))) {
      link.classList.remove('active');
    }
  });
});

// Dynamically add the structured-data.js script
(function() {
  // Create script element for structured data
  const structuredDataScript = document.createElement('script');
  structuredDataScript.src = '../../js/structured-data.js';
  document.body.appendChild(structuredDataScript);
})();
