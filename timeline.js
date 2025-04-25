// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all timeline events
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const tooltips = document.querySelectorAll('.timeline-tooltip');

  // Get current language from HTML lang attribute
  const currentLang = document.documentElement.lang;
  
  // Handle language-specific links
  function filterLinksByLanguage() {
    // Only show links that match the current language
    const allLinks = document.querySelectorAll('.timeline-tooltip a');
    
    allLinks.forEach(link => {
      const url = link.getAttribute('href');
      
      // Check if links contain language identifiers
      const showForCurrentLang = true;
      
      // Example: Hide links that don't match the current language
      // This can be customized based on your URL structure
      if (currentLang === 'en' && url.includes('/ko/')) {
        link.style.display = 'none';
      } else if (currentLang === 'ko' && !url.includes('/ko/')) {
        link.style.display = 'none';
      }
      
      // Similarly for other languages
      // Customize this logic based on your URL patterns
    });
  }
  
  // Call once on page load
  filterLinksByLanguage();
  
  // Function to ensure tooltips stay within viewport
  function adjustTooltipPosition(tooltip, event) {
    // Get the position of the event relative to the viewport width
    const eventRect = event.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const eventCenterX = eventRect.left + (eventRect.width / 2);
    const viewportPosition = eventCenterX / viewportWidth;
    
    // Determine if tooltip should appear left, center, or right of the event
    if (viewportPosition < 0.33) {
      // Event is on the left side of viewport - align tooltip to the right
      tooltip.style.left = '0';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'translateX(0)';
    } else if (viewportPosition > 0.66) {
      // Event is on the right side of viewport - align tooltip to the left
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
      tooltip.style.transform = 'translateX(0)';
    } else {
      // Event is in the center - center the tooltip
      tooltip.style.left = '50%';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'translateX(-50%)';
    }
  }

  // Add click event listener to timeline events
  timelineEvents.forEach(event => {
    // Handle clicking on an event (opens the link)
    event.addEventListener('click', () => {
      // Get the link from the event
      const link = event.getAttribute('data-link');
      if (link) {
        // Open the link in a new tab
        window.open(link, '_blank');
      }
    });
    
    // Add event listeners for tooltips
    const tooltip = event.querySelector('.timeline-tooltip');
    if (tooltip) {
      // For hover/mouseover
      event.addEventListener('mouseenter', function() {
        // Adjust tooltip position based on viewport
        adjustTooltipPosition(tooltip, event);
      });
      
      // For touch devices
      event.addEventListener('touchstart', function(e) {
        e.preventDefault();
        
        // Hide all other tooltips
        tooltips.forEach(t => {
          if (t !== tooltip) {
            t.style.visibility = 'hidden';
            t.style.opacity = '0';
          }
        });
        
        // Adjust tooltip position based on viewport
        adjustTooltipPosition(tooltip, event);
        
        // Toggle this tooltip
        if (tooltip.style.visibility === 'visible') {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        } else {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        }
      });
      
      // Prevent clicks on tooltip from triggering the event's click handler
      tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  });

  // Language switcher setup
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      languageLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
  
  // Update tooltip positions on window resize
  window.addEventListener('resize', function() {
    timelineEvents.forEach(event => {
      const tooltip = event.querySelector('.timeline-tooltip');
      if (tooltip && tooltip.style.visibility === 'visible') {
        adjustTooltipPosition(tooltip, event);
      }
    });
  });
});
