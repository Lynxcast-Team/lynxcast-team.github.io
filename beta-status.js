// Early access status (open / paused / ended), set from the Lynxcast dev panel.
// ended: the Beta tab and the "Get early access" button disappear from every page.
// paused or ended: the beta page shows the message instead of the form.
(function () {
  // old links / browser history with .html: tidy the address bar to the clean version (no reload)
  if (/\.html$/.test(location.pathname) && !/google/.test(location.pathname)) {
    try { history.replaceState(null, '', location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '') + location.search + location.hash); } catch (e) { /* ignore */ }
  }
  var page = document.getElementById('beta-open');
  if (page) document.documentElement.classList.add('beta-wait');
  var done = function () { document.documentElement.classList.remove('beta-wait'); };
  setTimeout(done, 3000);   // server slow? show the normal page
  fetch('https://squad-redeems-relay.coltkings.workers.dev/beta/status').then(function (r) { return r.json(); }).then(function (s) {
    if (s.mode === 'ended') document.querySelectorAll('nav a[href="beta"], a.cta[href="beta"]').forEach(function (a) { a.remove(); });
    if (page && (s.mode === 'paused' || s.mode === 'ended')) {
      var shut = document.getElementById('beta-closed');
      document.getElementById('closed-title').textContent = s.mode === 'ended' ? "That's a wrap" : 'Doors are shut (for now)';
      document.getElementById('closed-msg').textContent = s.message || (s.mode === 'ended' ? 'The beta is over. Thanks to everyone who tested!' : 'Early access is closed for now. Check our socials for news.');
      page.hidden = true; shut.hidden = false;
      document.title = 'Lynxcast · early access ' + (s.mode === 'ended' ? 'is over' : 'is closed');
    }
    done();
  }).catch(done);
})();
