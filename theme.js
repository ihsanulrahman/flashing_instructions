// Apply the saved preference before the page paints. Storage may be unavailable.
try {
  const theme = localStorage.getItem('miatoll-theme');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch (_) { /* The default light theme also works without storage. */ }
