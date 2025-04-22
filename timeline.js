// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all timeline events
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const tooltips = document.querySelectorAll('.timeline-tooltip');

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
      // Needed for touch devices
      event.addEventListener('touchstart', function(e) {
        e.preventDefault();
        
        // Hide all other tooltips
        tooltips.forEach(t => {
          if (t !== tooltip) {
            t.style.visibility = 'hidden';
            t.style.opacity = '0';
          }
        });
        
        // Toggle this tooltip
        if (tooltip.style.visibility === 'visible') {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        } else {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateX(-50%) translateY(0)';
        }
      });
      
      // Prevent clicks on tooltip from triggering the event's click handler
      tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  });

  // Language switcher setup - can be expanded later
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      languageLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
});
