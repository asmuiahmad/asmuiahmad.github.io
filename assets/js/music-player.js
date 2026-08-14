// Auto-hiding music player controls with an audio-reactive background wave and Discord status.
const audio = document.getElementById('hero-audio');
const player = document.getElementById('music-player');
const panelToggle = document.getElementById('music-toggle');
const playToggle = document.getElementById('music-play-toggle');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const seekBackward = document.getElementById('seek-backward');
const seekForward = document.getElementById('seek-forward');
const soundwaveCanvas = document.getElementById('soundwave-bg');

// Discord status elements
const statusDotInline = document.getElementById('status-dot-inline');
const statusTextInline = document.getElementById('status-text-inline');
const activityContainerInline = document.getElementById('discord-activity-inline');

const AUTO_HIDE_DELAY = 6000;
let hideTimer;
let progressAnimationId;
let idleWaveAnimationId;
let spectrumAnimationId;
let audioContext;
let analyser;
let audioSource;
let waveformData;
let backgroundMode = 'idle';
const soundwaveContext = soundwaveCanvas?.getContext('2d');

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

const setRangeProgress = (range) => {
  const min = Number(range.min) || 0;
  const max = Number(range.max) || 1;
  const value = Number(range.value);
  const progress = ((value - min) / (max - min)) * 100;
  range.style.setProperty('--progress', `${Math.max(0, Math.min(progress, 100))}%`);
};

const setPlayerOpen = (shouldOpen) => {
  player.classList.toggle('is-open', shouldOpen);
  panelToggle.setAttribute('aria-expanded', String(shouldOpen));
  panelToggle.setAttribute('aria-label', shouldOpen ? 'Hide music player' : 'Open music player');
};

const clearAutoHide = () => window.clearTimeout(hideTimer);

const queueAutoHide = () => {
  clearAutoHide();
  hideTimer = window.setTimeout(() => setPlayerOpen(false), AUTO_HIDE_DELAY);
};

const showPlayer = () => {
  setPlayerOpen(true);
  queueAutoHide();
};

const resizeSoundwaveCanvas = () => {
  if (!soundwaveCanvas) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  soundwaveCanvas.width = Math.floor(window.innerWidth * pixelRatio);
  soundwaveCanvas.height = Math.floor(window.innerHeight * pixelRatio);
  soundwaveCanvas.style.width = `${window.innerWidth}px`;
  soundwaveCanvas.style.height = `${window.innerHeight}px`;
  soundwaveContext?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

const drawIdleWave = (time) => {
  if (!soundwaveContext || backgroundMode !== 'idle') return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerY = height / 2;
  const gradient = soundwaveContext.createLinearGradient(0, centerY, width, centerY);
  gradient.addColorStop(0, '#00ffe7');
  gradient.addColorStop(0.6, '#3a8bfd');
  gradient.addColorStop(1, '#ffe259');

  soundwaveContext.clearRect(0, 0, width, height);
  soundwaveContext.save();
  soundwaveContext.shadowColor = '#00ffe7';
  soundwaveContext.shadowBlur = 32;
  soundwaveContext.strokeStyle = gradient;
  soundwaveContext.lineWidth = 6;
  soundwaveContext.beginPath();

  for (let x = 0; x <= width; x += 2) {
    const phase = time * 0.0005;
    const y = centerY
      + Math.sin(x * 0.012 + phase) * 32
      + Math.sin(x * 0.021 - phase * 1.5) * 18;
    if (x === 0) soundwaveContext.moveTo(x, y);
    else soundwaveContext.lineTo(x, y);
  }

  soundwaveContext.stroke();
  soundwaveContext.restore();
  idleWaveAnimationId = requestAnimationFrame(drawIdleWave);
};

const startIdleWave = () => {
  if (!soundwaveContext || backgroundMode === 'idle') return;

  backgroundMode = 'idle';
  window.cancelAnimationFrame(spectrumAnimationId);
  idleWaveAnimationId = requestAnimationFrame(drawIdleWave);
};

const drawAudioSpectrum = () => {
  if (!soundwaveContext || !analyser || backgroundMode !== 'spectrum') return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const gradient = soundwaveContext.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#3a8bfd');
  gradient.addColorStop(0.3, '#6a5cff');
  gradient.addColorStop(0.7, '#a259ff');
  gradient.addColorStop(1, '#ec4899');

  analyser.getByteTimeDomainData(waveformData);
  soundwaveContext.clearRect(0, 0, width, height);
  soundwaveContext.save();
  soundwaveContext.strokeStyle = gradient;
  soundwaveContext.lineWidth = 3;
  soundwaveContext.shadowColor = '#3a8bfd';
  soundwaveContext.shadowBlur = 20;
  soundwaveContext.lineCap = 'round';
  soundwaveContext.lineJoin = 'round';
  soundwaveContext.beginPath();

  const sliceWidth = width / waveformData.length;
  waveformData.forEach((sample, index) => {
    const x = index * sliceWidth;
    const y = (sample / 255) * height;
    if (index === 0) soundwaveContext.moveTo(x, y);
    else soundwaveContext.lineTo(x, y);
  });

  soundwaveContext.stroke();
  soundwaveContext.restore();
  spectrumAnimationId = requestAnimationFrame(drawAudioSpectrum);
};

const startAudioSpectrum = () => {
  if (!soundwaveContext || !analyser || backgroundMode === 'spectrum') return;

  backgroundMode = 'spectrum';
  window.cancelAnimationFrame(idleWaveAnimationId);
  spectrumAnimationId = requestAnimationFrame(drawAudioSpectrum);
};

const initialiseAudioAnalyser = async () => {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;
    waveformData = new Uint8Array(analyser.frequencyBinCount);
    audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  if (audioContext.state === 'suspended') await audioContext.resume();
};

// ==================== DISCORD STATUS ====================
const updateDiscordStatus = (status, activities = []) => {
  statusDotInline.classList.remove('online', 'idle', 'dnd', 'offline');
  statusDotInline.classList.add(status);

  const statusMap = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline'
  };
  statusTextInline.textContent = statusMap[status] || 'Unknown';

  // Show activity
  activityContainerInline.innerHTML = '';
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
      activityContainerInline.textContent = `${icon} ${activity.name}`;
    }
  }
};

const fetchDiscordStatus = async () => {
  // Discord User ID for asmui_ahmad - UPDATE THIS WITH YOUR ACTUAL ID
  // To find your ID: Enable Developer Mode in Discord → Right-click your username → Copy User ID
  const DISCORD_USER_ID = 'YOUR_USER_ID_HERE'; // Replace with your actual Discord user ID
  
  if (DISCORD_USER_ID === 'YOUR_USER_ID_HERE') {
    // Demo mode - show random status
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

// ==================== DISCORD MESSAGING ====================
const messageInput = document.getElementById('discord-message-input');
const sendBtn = document.getElementById('discord-send-btn');
const dmStatus = document.getElementById('dm-status');

const sendDiscordMessage = () => {
  const message = messageInput.value.trim();
  
  if (!message) {
    dmStatus.textContent = 'Type a message first';
    dmStatus.classList.add('error');
    setTimeout(() => {
      dmStatus.textContent = '';
      dmStatus.classList.remove('error');
    }, 2000);
    return;
  }

  sendBtn.disabled = true;
  dmStatus.textContent = 'Opening Discord...';
  dmStatus.classList.remove('success', 'error');

  try {
    // Copy message to clipboard
    navigator.clipboard.writeText(message).then(() => {
      dmStatus.textContent = '✓ Message copied to clipboard!';
      dmStatus.classList.add('success');
      messageInput.value = '';
      
      // Open Discord to chat with asmui_ahmad
      // Discord usernames can be opened via: discord.com/users/@username or discord app
      window.open('https://discord.com/users/asmui_ahmad', '_blank');
      
      setTimeout(() => {
        dmStatus.textContent = '';
        dmStatus.classList.remove('success');
      }, 3000);
    }).catch(() => {
      throw new Error('Clipboard failed');
    });

  } catch (error) {
    console.error('Message error:', error);
    dmStatus.textContent = '✗ Failed - open Discord manually';
    dmStatus.classList.add('error');
    
    // Still open Discord if clipboard fails
    window.open('https://discord.com/users/asmui_ahmad', '_blank');
    
    setTimeout(() => {
      dmStatus.textContent = '';
      dmStatus.classList.remove('error');
    }, 3000);
  } finally {
    sendBtn.disabled = false;
  }
};

if (messageInput && sendBtn) {
  sendBtn.addEventListener('click', sendDiscordMessage);
  
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendDiscordMessage();
    }
  });
}

// Initialize soundwave only after loading is complete
const initSoundwave = () => {
  if (soundwaveContext) {
    resizeSoundwaveCanvas();
    window.addEventListener('resize', resizeSoundwaveCanvas);
    backgroundMode = 'starting';
    startIdleWave();
  }
};

// Wait for loading to complete before starting soundwave animation
if (document.body.classList.contains('crt-complete')) {
  initSoundwave();
} else {
  window.addEventListener('loadingComplete', initSoundwave, { once: true });
}

if (
  audio
  && player
  && panelToggle
  && playToggle
  && seekBar
  && volumeBar
  && currentTime
  && duration
  && seekBackward
  && seekForward
) {
  const syncDuration = () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    seekBar.max = String(audio.duration);
    duration.textContent = formatTime(audio.duration);
    setRangeProgress(seekBar);
  };

  const syncProgress = () => {
    syncDuration();
    seekBar.value = String(Math.min(audio.currentTime, Number(seekBar.max)));
    currentTime.textContent = formatTime(audio.currentTime);
    setRangeProgress(seekBar);
  };

  const renderProgress = () => {
    syncProgress();
    if (!audio.paused) progressAnimationId = requestAnimationFrame(renderProgress);
  };

  const startProgressUpdates = () => {
    window.cancelAnimationFrame(progressAnimationId);
    renderProgress();
  };

  const updatePlayState = () => {
    const isPlaying = !audio.paused;
    player.classList.toggle('is-playing', isPlaying);
    playToggle.innerHTML = `<i class="fas fa-${isPlaying ? 'pause' : 'play'}" aria-hidden="true"></i>`;
    playToggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  };

  audio.volume = Number(volumeBar.value);
  setRangeProgress(volumeBar);
  setRangeProgress(seekBar);
  syncDuration();
  syncProgress();

  panelToggle.addEventListener('click', () => {
    if (player.classList.contains('is-open')) {
      clearAutoHide();
      setPlayerOpen(false);
    } else {
      showPlayer();
    }
  });

  playToggle.addEventListener('click', async () => {
    showPlayer();
    if (audio.paused) {
      try {
        const playback = audio.play();
        const visualiserSetup = initialiseAudioAnalyser().catch((error) => {
          // The optional visualizer must never stop the music from playing.
          console.warn('Music visualizer could not start.', error);
        });

        await playback;
        await visualiserSetup;
        if (!audio.paused) startAudioSpectrum();
      } catch (error) {
        // A user gesture is required by browsers before playback can begin.
        console.warn('Music playback could not start.', error);
      }
    } else {
      audio.pause();
    }
  });

  [seekBackward, seekForward].forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button === seekBackward ? -10 : 10;
      const trackDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + direction, trackDuration));
      syncProgress();
      showPlayer();
    });
  });

  seekBar.addEventListener('input', () => {
    audio.currentTime = Number(seekBar.value);
    syncProgress();
    showPlayer();
  });

  volumeBar.addEventListener('input', () => {
    audio.volume = Number(volumeBar.value);
    setRangeProgress(volumeBar);
    showPlayer();
  });

  audio.addEventListener('loadedmetadata', syncDuration);
  audio.addEventListener('durationchange', syncDuration);
  audio.addEventListener('timeupdate', syncProgress);
  audio.addEventListener('seeking', syncProgress);
  audio.addEventListener('play', () => {
    updatePlayState();
    startProgressUpdates();
    startAudioSpectrum();
  });
  audio.addEventListener('pause', () => {
    window.cancelAnimationFrame(progressAnimationId);
    syncProgress();
    updatePlayState();
    startIdleWave();
  });
  audio.addEventListener('ended', () => {
    window.cancelAnimationFrame(progressAnimationId);
    updatePlayState();
    startIdleWave();
  });

  player.addEventListener('pointerenter', clearAutoHide);
  player.addEventListener('pointerleave', queueAutoHide);
  player.addEventListener('focusin', clearAutoHide);
  player.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!player.contains(document.activeElement)) queueAutoHide();
    }, 0);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && player.classList.contains('is-open')) {
      clearAutoHide();
      setPlayerOpen(false);
      panelToggle.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!player.contains(event.target)) {
      clearAutoHide();
      setPlayerOpen(false);
    }
  });

  updatePlayState();
}
