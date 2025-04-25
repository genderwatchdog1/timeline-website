// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all timeline events
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const tooltips = document.querySelectorAll('.timeline-tooltip');
  let currentHoveredEvent = null;

  // Get current language from HTML lang attribute
  const currentLang = document.documentElement.lang;
  
  // Check if we're in single column mode (events stacked to 1 per row)
  const isSingleColumnMode = () => {
    // Simple and reliable approach - use actual column width vs container width
    const events = document.querySelectorAll('.timeline-event');
    if (events.length === 0) return false;
    
    const firstEvent = events[0].closest('[class*="col-"]');
    if (!firstEvent) return false;
    
    const parentRow = firstEvent.closest('.row');
    if (!parentRow) return false;
    
    // If column takes up at least 75% of row width, we're in single column mode
    const columnWidth = firstEvent.getBoundingClientRect().width;
    const rowWidth = parentRow.getBoundingClientRect().width;
    
    return (columnWidth / rowWidth) >= 0.75;
  };
  
  // Function to set the appropriate display mode based on layout
  function updateDisplayMode() {
    const singleColumn = isSingleColumnMode();
    const wasSingleColumn = document.body.classList.contains('single-column-mode');
    
    // Only update if the mode has changed
    if (wasSingleColumn !== singleColumn) {
      console.log("Layout changed to " + (singleColumn ? "single" : "multi") + " column mode");
      document.body.classList.toggle('single-column-mode', singleColumn);
      
      // Reset any active states when changing modes
      timelineEvents.forEach(event => {
        event.classList.remove('active');
      });
    }
  }
  
  // Handle language-specific links
  function filterLinksByLanguage() {
    // Simplified language filter - can be extended if needed
    const allLinks = document.querySelectorAll('.timeline-tooltip a');
    allLinks.forEach(link => {
      const url = link.getAttribute('href');
      // Custom handling based on URL patterns
    });
  }
  
  // Call once on page load
  filterLinksByLanguage();
  
  // Function to ensure tooltips stay within viewport in desktop view
  function adjustTooltipPosition(tooltip, event) {
    // If in single column mode, don't adjust position
    if (isSingleColumnMode()) return;
    
    // Get the position of the event relative to the viewport width
    const eventRect = event.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const eventCenterX = eventRect.left + (eventRect.width / 2);
    const viewportPosition = eventCenterX / viewportWidth;
    
    // Determine if tooltip should appear left, center, or right of the event
    if (viewportPosition < 0.3) {
      // Event is on the left side of viewport - align tooltip to the right
      tooltip.style.left = '0';
      tooltip.style.right = 'auto';
      tooltip.style.transform = 'translateX(0)';
    } else if (viewportPosition > 0.7) {
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

  // Toggle tooltip visibility for single column mode
  function toggleTooltip(event) {
    // Check if already active
    const isActive = event.classList.contains('active');
    
    // Close all tooltips first
    timelineEvents.forEach(e => {
      if (e !== event) {
        e.classList.remove('active');
      }
    });
    
    // Toggle this event's active state
    event.classList.toggle('active', !isActive);
    
    // Debug logging
    console.log("Toggled event active state:", event.classList.contains('active'));
  }

  // Add event listeners to all timeline events
  timelineEvents.forEach(event => {
    // Track hover state for multi-column view
    event.addEventListener('mouseenter', function() {
      if (!isSingleColumnMode()) {
        const tooltip = event.querySelector('.timeline-tooltip');
        if (tooltip) {
          adjustTooltipPosition(tooltip, event);
        }
      }
    });
    
    // Handle clicking on an event
    event.addEventListener('click', function(e) {
      const singleColumn = isSingleColumnMode();
      
      if (singleColumn) {
        // In single column mode, toggle tooltip visibility
        toggleTooltip(event);
        e.preventDefault();
        e.stopPropagation();
      } else {
        // In multi-column mode, open link if available
        const link = event.getAttribute('data-link');
        if (link) {
          window.open(link, '_blank');
        }
      }
    });
    
    // For tooltips, prevent event bubbling
    const tooltip = event.querySelector('.timeline-tooltip');
    if (tooltip) {
      tooltip.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  });

  // Language switcher setup
  const languageLinks = document.querySelectorAll('.language-link');
  languageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      languageLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Initial layout check
  updateDisplayMode();
  
  // Debug function
  window.forceLayoutMode = function(mode) {
    if (mode === 'single') {
      document.body.classList.add('single-column-mode');
    } else if (mode === 'multi') {
      document.body.classList.remove('single-column-mode');
    }
  };
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateDisplayMode, 100);
  });
  
  // Additional check after everything loads
  window.addEventListener('load', updateDisplayMode);
  
  // Close tooltips when clicking outside
  document.addEventListener('click', function(e) {
    if (isSingleColumnMode()) {
      // Check if click was outside any timeline event
      const isOutside = !e.target.closest('.timeline-event');
      
      if (isOutside) {
        timelineEvents.forEach(event => {
          event.classList.remove('active');
        });
      }
    }
  });
});
