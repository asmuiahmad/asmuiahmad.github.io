// Discord Status Widget
const initDiscordStatus = () => {
  const statusWidget = document.getElementById('discord-status');
  const toggleBtn = document.getElementById('discord-toggle');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const activityContainer = document.getElementById('discord-activity');

  if (!statusWidget || !toggleBtn) return;

  const AUTO_HIDE_DELAY = 6000;
  let hideTimer;

  // Discord User ID - Replace with your actual Discord User ID
  // To get your Discord ID: Enable Developer Mode in Discord > Right-click your profile > Copy ID
  const DISCORD_USER_ID = 'YOUR_DISCORD_USER_ID_HERE';

  // Lanyard API endpoint (public Discord presence API)
  const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

  const setStatusOpen = (shouldOpen) => {
    statusWidget.classList.toggle('is-open', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', String(shouldOpen));
    toggleBtn.setAttribute('aria-label', shouldOpen ? 'Hide Discord status' : 'Show Discord status');
  };

  const clearAutoHide = () => window.clearTimeout(hideTimer);

  const queueAutoHide = () => {
    clearAutoHide();
    hideTimer = window.setTimeout(() => setStatusOpen(false), AUTO_HIDE_DELAY);
  };

  const showStatus = () => {
    setStatusOpen(true);
    queueAutoHide();
  };

  // Toggle button click
  toggleBtn.addEventListener('click', () => {
    if (statusWidget.classList.contains('is-open')) {
      clearAutoHide();
      setStatusOpen(false);
    } else {
      showStatus();
    }
  });

  // Auto-hide on hover out
  statusWidget.addEventListener('pointerenter', clearAutoHide);
  statusWidget.addEventListener('pointerleave', queueAutoHide);
  statusWidget.addEventListener('focusin', clearAutoHide);
  statusWidget.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!statusWidget.contains(document.activeElement)) queueAutoHide();
    }, 0);
  });

  // Close on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && statusWidget.classList.contains('is-open')) {
      clearAutoHide();
      setStatusOpen(false);
      toggleBtn.focus();
    }
  });

  // Update status display
  const updateStatusDisplay = (status, activities = []) => {
    // Remove previous status classes
    statusDot.classList.remove('online', 'idle', 'dnd', 'offline');
    statusWidget.classList.remove('is-online', 'is-idle', 'is-dnd', 'is-offline');

    // Add new status class
    statusDot.classList.add(status);
    statusWidget.classList.add(`is-${status}`);

    // Update status text
    const statusMap = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    };
    statusText.textContent = statusMap[status] || 'Unknown';

    // Update activity
    activityContainer.innerHTML = '';
    if (activities && activities.length > 0) {
      const activity = activities[0]; // Show first activity
      if (activity.name) {
        const activityEl = document.createElement('div');
        activityEl.className = 'activity-item';
        
        let activityIcon = '🎮';
        if (activity.type === 2) activityIcon = '🎵'; // Listening
        if (activity.type === 3) activityIcon = '📺'; // Watching
        if (activity.name.includes('Visual Studio') || activity.name.includes('Code')) activityIcon = '💻';
        
        activityEl.innerHTML = `
          <span class="activity-icon">${activityIcon}</span>
          <span>${activity.name}</span>
        `;
        activityContainer.appendChild(activityEl);
      }
    }
  };

  // Fetch Discord status
  const fetchDiscordStatus = async () => {
    try {
      const response = await fetch(LANYARD_API);
      if (!response.ok) throw new Error('Failed to fetch status');
      
      const data = await response.json();
      if (data.success && data.data) {
        const status = data.data.discord_status || 'offline';
        const activities = data.data.activities || [];
        updateStatusDisplay(status, activities);
      } else {
        updateStatusDisplay('offline');
      }
    } catch (error) {
      console.warn('Could not fetch Discord status:', error);
      // Simulate status for demo purposes if API fails
      simulateStatus();
    }
  };

  // Simulate status (for demo if API not configured)
  const simulateStatus = () => {
    const statuses = ['online', 'idle', 'dnd', 'offline'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    updateStatusDisplay(randomStatus);
  };

  // Initial status check
  if (DISCORD_USER_ID === 'YOUR_DISCORD_USER_ID_HERE') {
    // If user hasn't set their Discord ID, simulate status
    simulateStatus();
    // Update every 30 seconds
    setInterval(simulateStatus, 30000);
  } else {
    // Fetch real status
    fetchDiscordStatus();
    // Update every 15 seconds
    setInterval(fetchDiscordStatus, 15000);
  }
};

// Initialize Discord status after loading is complete
if (document.body.classList.contains('crt-complete')) {
  initDiscordStatus();
} else {
  window.addEventListener('loadingComplete', initDiscordStatus, { once: true });
}
