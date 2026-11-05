/* Runs before the page is drawn, so a saved theme choice does not flash the other theme first.
   The key must match THEME_STORAGE_KEY in theme.js. */
try {
  var savedTheme = localStorage.getItem('sockmap-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
} catch (e) { /* storage can be blocked: follow the device setting */ }
