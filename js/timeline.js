// Timeline JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get all timeline events
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const tooltips = document.querySelectorAll('.timeline-tooltip');
  let currentHoveredEvent = null;

  // Get current language from HTML lang attribute
  const currentLang = document.documentElement.lang;
  
  // Function to calculate and update days of government silence
  function updateDaysOfSilence() {
    // April 10, 2025 is when evidence was sent to government agencies
    const evidenceDate = new Date('2025-04-10T00:00:00');
    const currentDate = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(currentDate - evidenceDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Find all elements that need to be updated - expanded selector list to ensure we catch all instances
    const elements = {
      // Timeline elements from main index page
      timelineTitle: document.querySelectorAll('.timeline-title'),
      timelineSnippet: document.querySelectorAll('.timeline-snippet'),
      timelineTooltip: document.querySelectorAll('.timeline-tooltip p'),
      // Blog post content elements
      blogHeadings: document.querySelectorAll('.article-body h1, .article-body h2'),
      blogParagraphs: document.querySelectorAll('.article-body p, p')
    };
    
    // Update all relevant elements with the new day count
    Object.keys(elements).forEach(type => {
      elements[type].forEach(el => {
        // Expanded pattern matching to catch more variations including Japanese and Chinese patterns
        if (el.textContent.includes('25 Days of') || 
            el.textContent.includes('25 days of') || 
            el.textContent.includes('25 Days') || 
            el.textContent.includes('25 days') || 
            el.textContent.includes('25일간의') ||
            el.textContent.includes('25日間の') ||
            el.textContent.includes('25天政府沉默') ||
            el.textContent.includes('25天政府沉默') ||
            el.textContent.includes('政府の25日間') ||
            el.textContent.includes('25日間完全')) {
          
          // Replace "25 Days" with the actual number in various formats
          el.textContent = el.textContent.replace(/25 Days of/g, `${diffDays} Days of`);
          el.textContent = el.textContent.replace(/25 days of/g, `${diffDays} days of`);
          el.textContent = el.textContent.replace(/25 Days/g, `${diffDays} Days`);
          el.textContent = el.textContent.replace(/25 days/g, `${diffDays} days`);
          el.textContent = el.textContent.replace(/25일간의/g, `${diffDays}일간의`);
          el.textContent = el.textContent.replace(/25日間の/g, `${diffDays}日間の`);
          // Update Chinese versions (both simplified and traditional)
          el.textContent = el.textContent.replace(/25天政府沉默/g, `${diffDays}天政府沉默`);
          el.textContent = el.textContent.replace(/政府の25日間/g, `政府の${diffDays}日間`);
          el.textContent = el.textContent.replace(/25日間完全/g, `${diffDays}日間完全`);
        }
      });
    });
    
    // Also update any explicit 25-day mentions in paragraph text
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (p.textContent.includes('25-day') || 
          p.textContent.includes('25 day') ||
          p.textContent.includes('25日間') ||
          p.textContent.includes('25천') ||
          p.textContent.includes('25일')) {
        p.textContent = p.textContent.replace(/25-day/g, `${diffDays}-day`);
        p.textContent = p.textContent.replace(/25 day/g, `${diffDays} day`);
        p.textContent = p.textContent.replace(/25日間/g, `${diffDays}日間`);
        p.textContent = p.textContent.replace(/25천/g, `${diffDays}천`);
        p.textContent = p.textContent.replace(/25일/g, `${diffDays}일`);
      }
    });
    
    // Add a direct approach to update the specific Chinese and Korean timeline entries
    document.querySelectorAll('.timeline-title').forEach(title => {
      if (title.textContent === '25天政府沉默') {
        title.textContent = `${diffDays}天政府沉默`;
      }
      if (title.textContent === '25일간의 정부 침묵') {
        title.textContent = `${diffDays}일간의 정부 침묵`;
      }
    });
    
    // Specifically update the timeline entries containing "Days of Government Silence" in various languages
    // Instead of using the custom contains selector which might be unreliable, directly find and update elements
    const allTimelineTitles = document.querySelectorAll('.timeline-event .timeline-title');
    allTimelineTitles.forEach(title => {
      const text = title.textContent;
      
      // English version
      if (text.includes('Days of Government Silence')) {
        title.textContent = text.replace(/\d+ Days/g, `${diffDays} Days`);
      }
      
      // Japanese version
      if (text.includes('政府の') && text.includes('日間の沈黙')) {
        title.textContent = text.replace(/\d+日間/g, `${diffDays}日間`);
      }
      
      // Chinese versions (both simplified and traditional)
      if (text.includes('天政府沉默')) {
        title.textContent = text.replace(/\d+天政府沉默/g, `${diffDays}天政府沉默`);
      }
      
      // Korean version
      if (text.includes('일간의 정부 침묵')) {
        title.textContent = text.replace(/\d+일간의/g, `${diffDays}일간의`);
      }
    });
    
    // Also look for specific snippets that mention the day count
    document.querySelectorAll('.timeline-snippet').forEach(snippet => {
      if (snippet.textContent.includes('days') || 
          snippet.textContent.includes('Days') || 
          snippet.textContent.includes('日間') || 
          snippet.textContent.includes('天') ||
          snippet.textContent.includes('일')) {
        // Update English
        snippet.textContent = snippet.textContent.replace(/\d+ days/g, `${diffDays} days`);
        snippet.textContent = snippet.textContent.replace(/\d+ Days/g, `${diffDays} Days`);
        // Update Japanese
        snippet.textContent = snippet.textContent.replace(/\d+日間/g, `${diffDays}日間`);
        // Update Chinese versions (both simplified and traditional)
        snippet.textContent = snippet.textContent.replace(/\d+天/g, `${diffDays}天`);
        // Update Korean
        snippet.textContent = snippet.textContent.replace(/\d+일/g, `${diffDays}일`);
      }
    });
  }

  // Add a jQuery-like contains selector for plain JavaScript
  // This helps us find elements containing specific text
  Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
  };

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
      
      // Reset all tooltip positioning when switching to single column mode
      if (singleColumn) {
        resetAllTooltipPositioning();
      }
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
  
  // Call to update the days of silence on page load
  updateDaysOfSilence();
  
  // Call again after a short delay to ensure all content is loaded
  setTimeout(updateDaysOfSilence, 500);
  
  // Function to ensure tooltips stay within viewport in desktop view
  function adjustTooltipPosition(tooltip, event) {
    // If in single column mode, reset positioning and return
    if (isSingleColumnMode()) {
      tooltip.style.left = '';
      tooltip.style.right = '';
      tooltip.style.transform = '';
      return;
    }
    
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
    
    // Reset tooltip positioning in single column mode
    if (isSingleColumnMode()) {
      const tooltip = event.querySelector('.timeline-tooltip');
      if (tooltip) {
        // Reset all positioning styles to default for mobile view
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.transform = '';
      }
    }
    
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
  window.addEventListener('load', function() {
    updateDisplayMode();
    updateDaysOfSilence(); // Update days again after full page load
  });
  
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

  // Add an additional function to reset all tooltip positioning when switching to single column mode
  function resetAllTooltipPositioning() {
    const tooltips = document.querySelectorAll('.timeline-tooltip');
    tooltips.forEach(tooltip => {
      tooltip.style.left = '';
      tooltip.style.right = '';
      tooltip.style.transform = '';
    });
  }
});
