// Glassmorphism Music Player with Real-time Visualizer
const audio = document.getElementById('hero-audio');
const musicBtn = document.getElementById('music-toggle-btn');
const visualizerBars = document.querySelectorAll('.music-visualizer .bar');

// Audio Context for Visualizer
let audioCtx, analyser, source, dataArray;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // Much higher for more detail
    analyser.smoothingTimeConstant = 0.6; // Less smoothing for more responsiveness
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
}

// Update visualizer bars based on audio frequency
function updateVisualizer() {
  if (!analyser) return;
  
  analyser.getByteFrequencyData(dataArray);
  
  // Map frequency data to 5 bars
  visualizerBars.forEach((bar, index) => {
    const dataIndex = Math.floor((index / visualizerBars.length) * dataArray.length);
    const value = dataArray[dataIndex];
    const height = Math.max(8, (value / 255) * 35); // Min 8px, max 35px
    bar.style.height = `${height}px`;
  });
  
  if (musicBtn.classList.contains('playing')) {
    requestAnimationFrame(updateVisualizer);
  }
}

// Play/Pause Toggle
if (musicBtn && audio) {
  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      // Initialize audio context on first interaction
      initAudioContext();
      
      audio.play();
      musicBtn.classList.add('playing');
      musicBtn.title = 'Pause Music';
      
      // Start visualizer
      updateVisualizer();
      startBackgroundVisualizer();
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
      musicBtn.title = 'Play Music';
      
      // Stop background visualizer
      stopBackgroundVisualizer();
    }
  });

  // Handle audio end
  audio.addEventListener('ended', () => {
    musicBtn.classList.remove('playing');
    musicBtn.title = 'Play Music';
    stopBackgroundVisualizer();
  });
}

// Background Visualizer (Canvas)
const soundwaveCanvas = document.getElementById('soundwave-bg');
const soundwaveCtx = soundwaveCanvas.getContext('2d');
let bgAnalyser, bgDataArray, bgAnimationId, isVisualizerActive = false;

// Neon Sine Wave Animation (Default)
let neonWaveAnimId = null;
function drawNeonWave(time) {
  soundwaveCtx.clearRect(0, 0, soundwaveCanvas.width, soundwaveCanvas.height);
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
requestAnimationFrame(drawNeonWave);

// Audio Visualizer (When Playing)
function startBackgroundVisualizer() {
  if (!analyser) return;
  
  bgAnalyser = analyser;
  bgDataArray = new Uint8Array(bgAnalyser.frequencyBinCount);
  isVisualizerActive = true;
  cancelAnimationFrame(neonWaveAnimId);
  drawBackgroundVisualizer();
}

function stopBackgroundVisualizer() {
  isVisualizerActive = false;
  if (bgAnimationId) cancelAnimationFrame(bgAnimationId);
  requestAnimationFrame(drawNeonWave);
}

function drawBackgroundVisualizer() {
  soundwaveCtx.clearRect(0, 0, soundwaveCanvas.width, soundwaveCanvas.height);
  bgAnalyser.getByteTimeDomainData(bgDataArray);
  
  soundwaveCtx.save();
  
  // Create gradient for the waveform
  const grad = soundwaveCtx.createLinearGradient(0, 0, soundwaveCanvas.width, 0);
  grad.addColorStop(0, '#3a8bfd');
  grad.addColorStop(0.3, '#6a5cff');
  grad.addColorStop(0.7, '#a259ff');
  grad.addColorStop(1, '#ec4899');
  
  soundwaveCtx.strokeStyle = grad;
  soundwaveCtx.lineWidth = 3;
  soundwaveCtx.shadowColor = '#3a8bfd';
  soundwaveCtx.shadowBlur = 20;
  soundwaveCtx.lineCap = 'round';
  soundwaveCtx.lineJoin = 'round';
  
  soundwaveCtx.beginPath();
  
  const sliceWidth = soundwaveCanvas.width / bgDataArray.length;
  let x = 0;
  
  for (let i = 0; i < bgDataArray.length; i++) {
    const v = bgDataArray[i] / 128.0; // Normalize to 0-2
    const y = (v * soundwaveCanvas.height) / 2;
    
    if (i === 0) {
      soundwaveCtx.moveTo(x, y);
    } else {
      soundwaveCtx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  soundwaveCtx.stroke();
  soundwaveCtx.restore();
  
  if (isVisualizerActive) {
    bgAnimationId = requestAnimationFrame(drawBackgroundVisualizer);
  }
}
