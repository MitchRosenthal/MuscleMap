document.addEventListener('DOMContentLoaded', function() {
  // Get current muscle group from URL
  const urlParams = new URLSearchParams(window.location.search);
  const muscleName = urlParams.get('muscle_name');
  const currentPage = parseInt(urlParams.get('page') || '1');

  // Get progress tracker elements
  const tracker = document.querySelector('.progress-tracker');
  const trackerItems = tracker.querySelectorAll('li');
  const toggleButton = document.querySelector('.progress-tracker-toggle');

  // Mobile toggle functionality
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      tracker.classList.toggle('show');
    });
  }

  // Update tracker state based on current page
  trackerItems.forEach((item, index) => {
    const pageNum = index + 1;
    
    if (pageNum < currentPage) {
      // Previous pages are completed
      item.classList.remove('locked', 'current');
      item.classList.add('completed');
    } else if (pageNum === currentPage) {
      // Current page
      item.classList.remove('locked', 'completed');
      item.classList.add('current');
    } else {
      // Future pages are locked
      item.classList.remove('completed', 'current');
      item.classList.add('locked');
    }

    // Add click handler
    item.addEventListener('click', function() {
      const targetPage = parseInt(this.dataset.page);
      
      // Only allow navigation to completed pages or the next available page
      if (targetPage <= currentPage) {
        window.location.href = `/muscle_page/${muscleName}?page=${targetPage}`;
      }
    });
  });

  // Close tracker when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && 
        !tracker.contains(e.target) && 
        !toggleButton.contains(e.target)) {
      tracker.classList.remove('show');
    }
  });
}); 