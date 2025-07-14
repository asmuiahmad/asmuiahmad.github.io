// Music Player Logic
const playlist = [
  {
    title: 'Moon - Crystals (Hotline Miami OST)',
    src: 'assets/audio/Crystals - Hotline Miami Soundtrack.mp3'
  }
];
let currentTrack = 0;
const audio = document.getElementById('music-audio');
const playBtn = document.getElementById('music-play');
const prevBtn = document.getElementById('music-prev');
const nextBtn = document.getElementById('music-next');
const progress = document.getElementById('music-progress');
const title = document.getElementById('music-title');
const popup = document.getElementById('music-player-popup');
const expandBtn = document.getElementById('music-player-expand');
const chevron = document.getElementById('music-chevron');

function loadTrack(idx) {
  audio.src = playlist[idx].src;
  title.textContent = playlist[idx].title;
  progress.value = 0;
}

function playTrack() {
  audio.play();
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseTrack() {
  audio.pause();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  playTrack();
});

nextBtn.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  playTrack();
});

audio.addEventListener('ended', () => {
  nextBtn.click();
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

expandBtn.addEventListener('click', () => {
  const isCollapsed = popup.classList.toggle('collapsed');
  if (isCollapsed) {
    expandBtn.title = 'Expand';
    chevron.style.transform = 'rotate(180deg)'; // right
  } else {
    expandBtn.title = 'Collapse';
    chevron.style.transform = 'rotate(0deg)'; // left
  }
});

// On load, ensure chevron is correct and player is collapsed
chevron.style.transform = 'rotate(180deg)';
popup.classList.add('collapsed');
// Remove the close (X) button from the DOM
const closeBtn = document.getElementById('music-player-close');
if (closeBtn) closeBtn.remove();

// Music Visualizer
const musicAudio = document.getElementById('music-audio');
const soundwaveCanvas = document.getElementById('soundwave-bg');
const soundwaveCtx = soundwaveCanvas.getContext('2d');
let audioCtx, analyser, source, dataArray, animationId, isVisualizerActive = false;

// Neon Sine Wave Animation
let neonWaveAnimId = null;
function drawNeonWave(time) {
  soundwaveCtx.clearRect(0, 0, soundwaveCanvas.width, soundwaveCanvas.height);
  // Neon gradient
  const grad = soundwaveCtx.createLinearGradient(0, soundwaveCanvas.height/2, soundwaveCanvas.width, soundwaveCanvas.height/2);
  grad.addColorStop(0, '#00ffe7');
  grad.addColorStop(0.6, '#3a8bfd');
  grad.addColorStop(1, '#ffe259');
  soundwaveCtx.save();
  soundwaveCtx.shadowColor = '#00ffe7';
  soundwaveCtx.shadowBlur = 32;
  soundwaveCtx.strokeStyle = grad;
  soundwaveCtx.lineWidth = 6;
  soundwaveCtx.beginPath();
  for (let x = 0; x <= soundwaveCanvas.width; x += 2) {
    const t = time * 0.0005;
    const y = soundwaveCanvas.height/2 + Math.sin(x * 0.012 + t) * 32 + Math.sin(x * 0.021 - t * 1.5) * 18;
    if (x === 0) {
      soundwaveCtx.moveTo(x, y);
    } else {
      soundwaveCtx.lineTo(x, y);
    }
  }
  soundwaveCtx.stroke();
  soundwaveCtx.restore();
  neonWaveAnimId = requestAnimationFrame(drawNeonWave);
}
// Start the neon wave by default
requestAnimationFrame(drawNeonWave);

function startVisualizer() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source = audioCtx.createMediaElementSource(musicAudio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  isVisualizerActive = true;
  cancelAnimationFrame(neonWaveAnimId);
  drawVisualizer();
}
function stopVisualizer() {
  isVisualizerActive = false;
  if (animationId) cancelAnimationFrame(animationId);
  requestAnimationFrame(drawNeonWave);
}

function drawVisualizer() {
  soundwaveCtx.clearRect(0, 0, soundwaveCanvas.width, soundwaveCanvas.height);
  analyser.getByteTimeDomainData(dataArray);
  soundwaveCtx.save();
  // Create gradient for the line
  const grad = soundwaveCtx.createLinearGradient(0, 0, soundwaveCanvas.width, 0);
  grad.addColorStop(0, '#3a8bfd');
  grad.addColorStop(0.7, '#6a5cff');
  grad.addColorStop(1, '#a259ff');
  soundwaveCtx.strokeStyle = grad;
  soundwaveCtx.lineWidth = 4;
  soundwaveCtx.shadowColor = '#3a8bfd';
  soundwaveCtx.shadowBlur = 16;
  soundwaveCtx.beginPath();
  for (let i = 0; i < dataArray.length; i++) {
    const x = (i / (dataArray.length - 1)) * soundwaveCanvas.width;
    const v = dataArray[i] / 255;
    const y = soundwaveCanvas.height * v;
    if (i === 0) {
      soundwaveCtx.moveTo(x, y);
    } else {
      soundwaveCtx.lineTo(x, y);
    }
  }
  soundwaveCtx.stroke();
  soundwaveCtx.restore();
  if (isVisualizerActive) {
    animationId = requestAnimationFrame(drawVisualizer);
  }
}

musicAudio.addEventListener('play', () => {
  startVisualizer();
});
musicAudio.addEventListener('pause', () => {
  stopVisualizer();
});
musicAudio.addEventListener('ended', () => {
  stopVisualizer();
}); 