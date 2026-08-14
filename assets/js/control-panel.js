// Combined Control Panel (Music + Discord)
const initControlPanel = () => {
  const panel = document.getElementById('control-panel');
  const toggle = document.getElementById('control-toggle');
  const surface = document.querySelector('.control-panel__surface');
  
  if (!panel || !toggle || !surface) return;

  const AUTO_HIDE_DELAY = 8000;
  let hideTimer;
  let isOpen = false;

  // Panel state management
  const setOpen = (shouldOpen) => {
    isOpen = shouldOpen;
    panel.classList.toggle('is-open', shouldOpen);
    toggle.setAttribute('aria-expanded', String(shouldOpen));
  };

  const clearAutoHide = () => window.clearTimeout(hideTimer);

  const queueAutoHide = () => {
    clearAutoHide();
    hideTimer = window.setTimeout(() => setOpen(false), AUTO_HIDE_DELAY);
  };

  const show = () => {
    setOpen(true);
    queueAutoHide();
  };

  // Toggle click
  toggle.addEventListener('click', () => {
    if (isOpen) {
      clearAutoHide();
      setOpen(false);
    } else {
      show();
    }
  });

  // Hover management
  panel.addEventListener('pointerenter', clearAutoHide);
  panel.addEventListener('pointerleave', queueAutoHide);
  panel.addEventListener('focusin', clearAutoHide);
  panel.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!panel.contains(document.activeElement)) queueAutoHide();
    }, 0);
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      clearAutoHide();
      setOpen(false);
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener('pointerdown', (e) => {
    if (!panel.contains(e.target)) {
      clearAutoHide();
      setOpen(false);
    }
  });

  // ==================== DISCORD STATUS ====================
  const DISCORD_USER_ID = 'YOUR_DISCORD_USER_ID_HERE';
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const activityContainer = document.getElementById('discord-activity');

  const updateDiscordStatus = (status, activities = []) => {
    statusDot.classList.remove('online', 'idle', 'dnd', 'offline');
    statusDot.classList.add(status);

    const statusMap = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    };
    statusText.textContent = statusMap[status] || 'Unknown';

    // Show activity
    activityContainer.innerHTML = '';
    if (activities && activities.length > 0) {
      const activity = activities[0];
      if (activity.name) {
        const icons = {
          'Visual Studio Code': '💻',
          'Code': '💻',
          'Gaming': '🎮',
          'Music': '🎵',
          'default': '🎮'
        };
        let icon = icons['default'];
        for (const [key, val] of Object.entries(icons)) {
          if (activity.name.includes(key)) {
            icon = val;
            break;
          }
        }
        activityContainer.textContent = `${icon} ${activity.name}`;
      }
    }
  };

  const fetchDiscordStatus = async () => {
    if (DISCORD_USER_ID === 'YOUR_DISCORD_USER_ID_HERE') {
      const statuses = ['online', 'idle', 'offline'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      updateDiscordStatus(randomStatus);
      return;
    }

    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      if (data.success && data.data) {
        const status = data.data.discord_status || 'offline';
        const activities = data.data.activities || [];
        updateDiscordStatus(status, activities);
      }
    } catch (error) {
      console.warn('Discord status error:', error);
      updateDiscordStatus('offline');
    }
  };

  // Initial Discord status
  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 15000);

  // ==================== MUSIC PLAYER ====================
  const audio = document.getElementById('hero-audio');
  const playControl = document.getElementById('play-control');
  const nextControl = document.getElementById('next-control');
  const nowPlayingTitle = document.getElementById('now-playing-title');

  if (audio && playControl && nextControl) {
    // Play/Pause control
    playControl.addEventListener('click', async (e) => {
      e.stopPropagation();
      show();
      
      if (audio.paused) {
        try {
          await audio.play();
          playControl.innerHTML = '<i class="fas fa-pause"></i>';
        } catch (error) {
          console.warn('Playback error:', error);
        }
      } else {
        audio.pause();
        playControl.innerHTML = '<i class="fas fa-play"></i>';
      }
    });

    // Next track control
    nextControl.addEventListener('click', (e) => {
      e.stopPropagation();
      show();
      // Skip 10 seconds
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    });

    // Update play button on audio state change
    audio.addEventListener('play', () => {
      playControl.innerHTML = '<i class="fas fa-pause"></i>';
    });

    audio.addEventListener('pause', () => {
      playControl.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Update current time display
    audio.addEventListener('timeupdate', () => {
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60);
      // Optional: Add time display if needed
    });
  }

  // ==================== TOUCH/SWIPE GESTURES ====================
  let touchStartX = 0;
  let touchStartY = 0;

  toggle.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  toggle.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Swipe up to open
    if (deltaY < -50 && Math.abs(deltaX) < 50) {
      show();
    }
    // Swipe down to close
    else if (deltaY > 50 && Math.abs(deltaX) < 50 && isOpen) {
      setOpen(false);
      clearAutoHide();
    }
  });
};

// Initialize control panel after loading
if (document.body.classList.contains('crt-complete')) {
  initControlPanel();
} else {
  window.addEventListener('loadingComplete', initControlPanel, { once: true });
}
