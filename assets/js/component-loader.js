// Component Loader - loads HTML components into the page
const loadComponent = async (componentPath, targetSelector) => {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`Failed to load component: ${componentPath}`);
    
    const html = await response.text();
    const target = document.querySelector(targetSelector);
    
    if (!target) {
      console.warn(`Target selector not found: ${targetSelector}`);
      return;
    }
    
    target.insertAdjacentHTML('beforeend', html);
  } catch (error) {
    console.error('Component loading error:', error);
  }
};

// Load the music player component before the soundwave canvas
document.addEventListener('DOMContentLoaded', () => {
  const soundwaveCanvas = document.getElementById('soundwave-bg');
  if (soundwaveCanvas && soundwaveCanvas.parentNode) {
    // Use relative path that works from html/index.html
    loadComponent('../components/music-player.html', 'body');
  }
});
