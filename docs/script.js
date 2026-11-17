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

// Dark/Light switch for the screenshot: follows the page theme until a button is used.
const shot = document.getElementById('shot');
if (shot) {
  const btns = shot.querySelectorAll('.theme-switch button');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const show = (theme) => {
    shot.dataset.theme = theme;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === theme)));
  };
  show(dark.matches ? 'dark' : 'light');
  btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.theme)));
}
