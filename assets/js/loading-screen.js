(() => {
  const loadingScreen = document.getElementById('site-loader');
  const loadingWord = document.getElementById('site-loader-word');
  const progressFill = document.getElementById('site-loader-progress-fill');
  const progressValue = document.getElementById('site-loader-progress-value');
  const statusText = document.getElementById('site-loader-status');

  if (!loadingScreen || !loadingWord || !progressFill || !progressValue || !statusText) return;

  const languages = ['LOADING', '読み込み中', '加载中', 'CARGANDO', 'LADEN', 'CHARGEMENT', 'CARREGANDO', 'تحميل', 'ЗАГРУЗКА', '로딩 중', 'LOADING'];
  const statuses = ['INITIALIZING...', 'CONNECTING...', 'LOADING DATA...', 'VERIFYING...', 'PREPARING INTERFACE...', 'ALMOST READY...'];
  const minimumDisplayTime = 6000; // 6 seconds
  const startedAt = performance.now();
  let languageIndex = 0;
  let progress = 0;
  let pageLoaded = document.readyState === 'complete';
  let hasFinished = false;
  
  // Store original title to restore later
  const originalTitle = document.title;
  
  // Title typing animation
  const titleText = "Initialize...";
  let titleIndex = 0;
  let titleDirection = 1; // 1 for typing, -1 for deleting
  let titleCursorVisible = true;
  
  const updateLoadingTitle = () => {
    if (hasFinished) return;
    
    const currentText = titleText.substring(0, titleIndex);
    const cursor = titleCursorVisible ? '█' : '';
    document.title = currentText + cursor;
    
    // Toggle cursor
    titleCursorVisible = !titleCursorVisible;
  };
  
  const typeTitle = () => {
    if (hasFinished) return;
    
    if (titleDirection === 1) {
      // Typing forward
      if (titleIndex < titleText.length) {
        titleIndex++;
      } else {
        // Finished typing, pause then restart
        window.setTimeout(() => {
          titleDirection = -1;
        }, 2000);
      }
    } else {
      // Deleting backward
      if (titleIndex > 0) {
        titleIndex--;
      } else {
        // Finished deleting, start typing again
        titleDirection = 1;
      }
    }
  };
  
  // Start title animation
  const titleCursorTimer = window.setInterval(updateLoadingTitle, 400); // Cursor blink
  const titleTypeTimer = window.setInterval(() => {
    typeTitle();
    updateLoadingTitle();
  }, 150); // Typing speed

  // Get user info
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "0.0";
    
    if (ua.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "0.0";
    } else if (ua.indexOf("Edg") > -1) {
      browserName = "Edge";
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || "0.0";
    } else if (ua.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "0.0";
    } else if (ua.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "0.0";
    }
    
    return { name: browserName, version: browserVersion };
  };

  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") > -1) return "Windows";
    if (ua.indexOf("Mac") > -1) return "MacOS";
    if (ua.indexOf("Linux") > -1) return "Linux";
    if (ua.indexOf("Android") > -1) return "Android";
    if (ua.indexOf("iOS") > -1) return "iOS";
    return "Unknown OS";
  };

  // Create terminal
  const createTerminal = () => {
    const terminal = document.createElement('div');
    terminal.className = 'site-loader__terminal';
    terminal.id = 'site-loader-terminal';
    loadingScreen.appendChild(terminal);
    return terminal;
  };

  const addTerminalLine = (terminal, text, delay, className = '') => {
    return new Promise(resolve => {
      window.setTimeout(() => {
        const line = document.createElement('div');
        line.className = `site-loader__terminal-line ${className}`;
        line.innerHTML = text;
        terminal.appendChild(line);
        resolve();
      }, delay);
    });
  };

  const typeTerminalLine = (terminal, text, delay, typeSpeed = 30) => {
    return new Promise(resolve => {
      window.setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'site-loader__terminal-line';
        terminal.appendChild(line);
        
        let charIndex = 0;
        const typeInterval = window.setInterval(() => {
          if (charIndex < text.length) {
            line.innerHTML = text.substring(0, charIndex + 1) + '<span class="terminal-cursor"></span>';
            charIndex++;
          } else {
            window.clearInterval(typeInterval);
            line.innerHTML = text;
            resolve();
          }
        }, typeSpeed);
      }, delay);
    });
  };

  // Initialize terminal sequence
  const initTerminal = async () => {
    const terminal = createTerminal();
    const browser = getBrowserInfo();
    const os = getOS();
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    
    await addTerminalLine(terminal, '<span class="terminal-prompt">root@system:~$</span> init_session', 100);
    await addTerminalLine(terminal, '<span class="terminal-info">[SYSTEM]</span> Initializing secure connection...', 200);
    await typeTerminalLine(terminal, '<span class="terminal-info">[DETECT]</span> Scanning client environment...', 250, 15);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Browser:</span> ' + browser.name + ' v' + browser.version, 150);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Platform:</span> ' + os, 150);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Resolution:</span> ' + screenRes, 150);
    await typeTerminalLine(terminal, '<span class="terminal-warning">[NETWORK]</span> Resolving IP address...', 200, 12);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Connection:</span> Secure', 300);
    await addTerminalLine(terminal, '<span class="terminal-info">[AUTH]</span> Verifying credentials...', 200);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Status:</span> Authorized', 250);
    await typeTerminalLine(terminal, '<span class="terminal-info">[LOAD]</span> Loading interface modules...', 200, 12);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Core:</span> Ready', 200);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Assets:</span> Ready', 150);
    await addTerminalLine(terminal, '<span class="terminal-success">  ✓ Render:</span> Ready', 150);
    await addTerminalLine(terminal, '<span class="terminal-prompt">[OK]</span> <span class="terminal-success">System online. Access granted.</span>', 200);
  };

  initTerminal();

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
    window.clearInterval(titleCursorTimer);
    window.clearInterval(titleTypeTimer);
    
    // Restore original title
    document.title = originalTitle;
    
    progress = 100;
    loadingWord.textContent = 'READY';
    loadingWord.dataset.text = 'READY';
    loadingWord.prepend(Object.assign(document.createElement('span'), { className: 'site-loader__glitch-bars', ariaHidden: 'true' }));
    progressFill.style.width = '100%';
    progressValue.textContent = '100%';
    statusText.textContent = 'INTERFACE READY';

    window.setTimeout(() => loadingScreen.classList.add('is-finished'), 350);
    window.setTimeout(() => {
      loadingScreen.remove();
      // Trigger CRT TV turn on effect
      showCRTEffect();
    }, 1200);
  };

  const showCRTEffect = () => {
    // Start fading in main page content
    document.body.classList.add('crt-started');
    
    // Create CRT TV effect overlay
    const crtEffect = document.createElement('div');
    crtEffect.className = 'crt-tv-effect';
    crtEffect.innerHTML = `
      <div class="crt-tv-effect__screen"></div>
      <div class="crt-tv-effect__line"></div>
      <div class="crt-tv-effect__scanline"></div>
      <div class="crt-tv-effect__vignette"></div>
    `;
    document.body.appendChild(crtEffect);

    // Trigger animation sequence with slight delay for black screen
    window.setTimeout(() => crtEffect.classList.add('is-active'), 50);
    window.setTimeout(() => crtEffect.classList.add('is-flashing'), 100);
    window.setTimeout(() => crtEffect.classList.add('is-collapsing'), 150);
    window.setTimeout(() => crtEffect.classList.add('is-complete'), 1400);
    window.setTimeout(() => {
      crtEffect.remove();
      // Mark CRT effect as complete but keep frozen for 0.3s
      document.body.classList.add('crt-complete');
      
      // Wait 0.3 seconds before starting animations
      window.setTimeout(() => {
        // Trigger custom event to signal main page can start
        window.dispatchEvent(new Event('loadingComplete'));
      }, 300);
    }, 1900);
  };

  const languageTimer = window.setInterval(changeLanguage, 1300);
  const progressTimer = window.setInterval(() => {
    const minimumTimeElapsed = performance.now() - startedAt >= minimumDisplayTime;
    const maximumProgress = pageLoaded && minimumTimeElapsed ? 100 : 92;
    const increment = pageLoaded && minimumTimeElapsed ? 3 : Math.random() * 1.2; // Adjusted for 6 seconds

    progress = Math.min(maximumProgress, progress + increment);
    setProgress();

    if (progress === 100) finish();
  }, 150); // Update interval

  window.addEventListener('load', () => { pageLoaded = true; }, { once: true });
})();
