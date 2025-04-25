// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all timeline events
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const tooltips = document.querySelectorAll('.timeline-tooltip');

  // Function to adjust tooltip position based on viewport
  function adjustTooltipPosition() {
    tooltips.forEach(tooltip => {
      // Position tooltips close to the timeline events for better usability
      tooltip.style.top = '90%';
      tooltip.style.bottom = 'auto';
      
      // Set correct arrow position
      const arrow = tooltip.querySelector('.timeline-tooltip::after');
      if (arrow) {
        arrow.style.top = 'auto';
        arrow.style.bottom = '100%';
        arrow.style.borderColor = 'transparent transparent var(--tooltip-bg) transparent';
      }
    });
  }

  // Adjust all tooltips after layout is complete
  setTimeout(adjustTooltipPosition, 500);

  // Add resize listener for responsive adjustments
  window.addEventListener('resize', adjustTooltipPosition);
  
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
        
        // Toggle this tooltip
        if (tooltip.style.visibility === 'visible') {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        } else {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateX(-50%) translateY(0)';
          
          // Make sure this event is above others
          event.style.zIndex = '50';
          
          // Re-position tooltips for mobile view
          adjustTooltipPosition();
        }
      });
      
      // Prevent clicks on tooltip from triggering the event's click handler
      tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  });

  // Language switcher functionality
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      languageLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
  
  // Bootstrap-specific initialization
  try {
    // Initialize any Bootstrap tooltips (if used)
    var bootstrapTooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    bootstrapTooltips.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  } catch (e) {
    console.log('Bootstrap tooltips not initialized');
  }
});
