(() => {
  const loadingScreen = document.getElementById('site-loader');
  const loadingWord = document.getElementById('site-loader-word');
  const progressFill = document.getElementById('site-loader-progress-fill');
  const progressValue = document.getElementById('site-loader-progress-value');
  const statusText = document.getElementById('site-loader-status');

  if (!loadingScreen || !loadingWord || !progressFill || !progressValue || !statusText) return;

  const languages = ['LOADING', '読み込み中', '加载中', 'CARGANDO', 'LADEN', 'CHARGEMENT', 'CARREGANDO', 'تحميل', 'ЗАГРУЗКА', '로딩 중', 'LOADING'];
  const statuses = ['INITIALIZING...', 'CONNECTING...', 'LOADING DATA...', 'VERIFYING...', 'PREPARING INTERFACE...', 'ALMOST READY...'];
  const minimumDisplayTime = 5000; // 5 seconds
  const startedAt = performance.now();
  let languageIndex = 0;
  let progress = 0;
  let pageLoaded = document.readyState === 'complete';
  let hasFinished = false;

  const setProgress = () => {
    const value = Math.floor(progress);
    const statusIndex = Math.min(statuses.length - 1, Math.floor((progress / 100) * statuses.length));

    progressFill.style.width = `${progress}%`;
    progressValue.textContent = `${value}%`;
    statusText.textContent = statuses[statusIndex];
  };

  const changeLanguage = () => {
    if (hasFinished) return;

    languageIndex = (languageIndex + 1) % languages.length;
    const nextLanguage = languages[languageIndex];
    loadingWord.classList.add('is-glitching');

    window.setTimeout(() => {
      loadingWord.textContent = nextLanguage;
      loadingWord.dataset.text = nextLanguage;
      loadingWord.prepend(Object.assign(document.createElement('span'), { className: 'site-loader__glitch-bars', ariaHidden: 'true' }));
    }, 130);

    window.setTimeout(() => loadingWord.classList.remove('is-glitching'), 360);
  };

  const finish = () => {
    if (hasFinished) return;

    hasFinished = true;
    window.clearInterval(languageTimer);
    window.clearInterval(progressTimer);
    progress = 100;
    loadingWord.textContent = 'READY';
    loadingWord.dataset.text = 'READY';
    loadingWord.prepend(Object.assign(document.createElement('span'), { className: 'site-loader__glitch-bars', ariaHidden: 'true' }));
    progressFill.style.width = '100%';
    progressValue.textContent = '100%';
    statusText.textContent = 'INTERFACE READY';

    window.setTimeout(() => loadingScreen.classList.add('is-finished'), 350);
    window.setTimeout(() => loadingScreen.remove(), 1200);
  };

  const languageTimer = window.setInterval(changeLanguage, 1300);
  const progressTimer = window.setInterval(() => {
    const minimumTimeElapsed = performance.now() - startedAt >= minimumDisplayTime;
    const maximumProgress = pageLoaded && minimumTimeElapsed ? 100 : 92;
    const increment = pageLoaded && minimumTimeElapsed ? 3 : Math.random() * 1.2; // Slower increment

    progress = Math.min(maximumProgress, progress + increment);
    setProgress();

    if (progress === 100) finish();
  }, 150); // Slightly slower update interval

  window.addEventListener('load', () => { pageLoaded = true; }, { once: true });
})();
