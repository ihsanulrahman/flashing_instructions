'use strict';

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="icons.svg#${name}"/></svg>`;
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) { /* Usable without storage. */ } }
  };

  // Keep the preference consistent between the hub and both guides.
  const themeButton = document.querySelector('.theme-toggle');
  function updateThemeButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (themeButton) {
      themeButton.innerHTML = icon(dark ? 'sun' : 'moon');
      themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
      themeButton.setAttribute('aria-pressed', String(dark));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#181c18' : '#f7f7f2');
  }
  updateThemeButton();
  themeButton?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    storage.set('miatoll-theme', theme);
    updateThemeButton();
  });

  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuButton.innerHTML = icon(open ? 'close' : 'menu');
  }
  menuButton?.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (mobileMenu && !mobileMenu.hidden && !event.target.closest('.nav-wrap')) setMenu(false);
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  // Every tab remains readable without JavaScript and when printing.
  document.querySelectorAll('.tab-bar').forEach(bar => {
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', 'Google Apps installation option');
    const tabs = [...bar.querySelectorAll('.tab-btn')];
    const panels = tabs.map(tab => document.getElementById(tab.dataset.tab));
    function selectTab(selected, focus = false) {
      tabs.forEach((tab, index) => {
        const active = tab === selected;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[index]?.classList.toggle('active', active);
        panels[index]?.setAttribute('aria-hidden', String(!active));
      });
      if (focus) selected.focus();
    }
    tabs.forEach((tab, index) => {
      tab.id = `tab-${tab.dataset.tab}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.tab);
      if (panels[index]) {
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;
      }
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); selectTab(next, true); }
      });
    });
    selectTab(tabs.find(tab => tab.classList.contains('active')) || tabs[0]);
    // Direct links to a tab's content also open its parent panel.
    function revealHash() {
      const target = document.getElementById(location.hash.slice(1));
      const panel = target?.closest('.tab-content');
      const tab = tabs.find(item => item.dataset.tab === panel?.id);
      if (tab) selectTab(tab);
    }
    revealHash();
    window.addEventListener('hashchange', revealHash);
  });

  // Clipboard access may be missing on a local or non-HTTPS page.
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* Try the local-page fallback. */ }
    }
    const textarea = document.createElement('textarea');
    const previousFocus = document.activeElement;
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Report failure below. */ }
    textarea.remove();
    previousFocus?.focus({ preventScroll: true });
    return copied;
  }
  const copyStatus = document.getElementById('copy-status');
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const code = button.closest('.code-wrap')?.querySelector('code');
      if (!code) return;
      button.disabled = true;
      const success = await copyText(code.textContent.trim());
      button.innerHTML = `${icon(success ? 'check' : 'info')} ${success ? 'Copied!' : 'Select to copy'}`;
      button.classList.add(success ? 'copied' : 'copy-failed');
      if (copyStatus) copyStatus.textContent = success ? 'Command copied to clipboard.' : 'Copy unavailable. Select the command and copy it manually.';
      if (!success) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setTimeout(() => {
        button.innerHTML = `${icon('copy')} Copy`;
        button.classList.remove('copied', 'copy-failed');
        button.disabled = false;
      }, 2200);
    });
  });

  const checklistInputs = [...document.querySelectorAll('[data-prep]')];
  let preparation = {};
  try {
    const saved = JSON.parse(storage.get('miatoll-preparation') || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) preparation = saved;
  } catch (_) { /* Ignore an invalid saved checklist. */ }
  function updateChecklist() {
    checklistInputs.forEach(input => { input.checked = preparation[input.dataset.prep] === true; });
    const checked = checklistInputs.filter(input => input.checked).length;
    const count = document.querySelector('.checklist-count');
    if (count) count.textContent = `${checked} / ${checklistInputs.length} ready`;
    const progress = document.querySelector('.checklist-progress > span');
    if (progress) progress.style.width = `${checked / checklistInputs.length * 100}%`;
  }
  updateChecklist();
  checklistInputs.forEach(input => input.addEventListener('change', () => {
    preparation[input.dataset.prep] = input.checked;
    storage.set('miatoll-preparation', JSON.stringify(preparation));
    updateChecklist();
  }));
  document.querySelector('.reset-checklist')?.addEventListener('click', () => {
    preparation = {};
    storage.set('miatoll-preparation', '{}');
    updateChecklist();
  });

  // Native anchors preserve deep links, history, and keyboard navigation.
  const backButton = document.getElementById('back-to-top');
  backButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('.nav-logo')?.focus({ preventScroll: true });
  });
  let progressBar;
  if (document.body.classList.contains('guide-page')) {
    progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.querySelector('.nav-wrap').appendChild(progressBar);
  }
  let scrollQueued = false;
  const tocLinks = [...document.querySelectorAll('.toc-link')];
  const tocTargets = tocLinks.map(link => document.getElementById(link.hash.slice(1)));
  function updateScroll() {
    scrollQueued = false;
    if (backButton) backButton.hidden = window.scrollY < 350;
    if (progressBar) {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0})`;
    }
    let activeIndex = -1;
    let closest = -Infinity;
    tocTargets.forEach((target, index) => {
      const top = target?.getBoundingClientRect().top;
      if (top !== undefined && top <= 155 && top > closest) { closest = top; activeIndex = index; }
    });
    tocLinks.forEach((link, index) => {
      const active = index === activeIndex;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
});
