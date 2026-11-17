// Copy buttons for the install snippets.
document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const pre = btn.parentElement.querySelector('pre');
    if (!pre) return;
    // Copy the commands only, not the comment lines.
    const text = Array.from(pre.querySelectorAll('.line'))
      .map((el) => el.textContent)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch (e) {
      btn.textContent = 'Press Ctrl+C';
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  });
});

// Expand every manual section so the browser's find works across all of them.
const manAll = document.getElementById('man-all');
if (manAll) {
  manAll.addEventListener('click', () => {
    const secs = document.querySelectorAll('.man-sec, .man-sub');
    const open = Array.from(secs).some((d) => !d.open);
    secs.forEach((d) => { d.open = open; });
    manAll.textContent = open ? 'collapse everything' : 'expand everything';
  });
}

// Dark/Light switch for every screenshot: follows the page theme until a button is used.
const themeSwitch = document.querySelector('.theme-switch');
if (themeSwitch) {
  const btns = themeSwitch.querySelectorAll('button');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const show = (theme) => {
    document.documentElement.dataset.shot = theme;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === theme)));
  };
  show(dark.matches ? 'dark' : 'light');
  btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.theme)));
}

// Page theme toggle (sun icon in the nav): follows the OS until used, then remembers the choice.
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  const root = document.documentElement;
  const osDark = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (osDark.matches ? 'dark' : 'light');
  const label = () => themeBtn.setAttribute('aria-label', 'Switch to ' + (current() === 'dark' ? 'light' : 'dark') + ' theme');
  label();
  themeBtn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
  });
}
