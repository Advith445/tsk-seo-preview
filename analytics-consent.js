/* Optional GA4. Nothing is loaded or sent until the visitor accepts. */
(() => {
  'use strict';
  const ID = 'G-HLX4G8BV7E';
  // PREVIEW TEST ONLY: consent-gated collection to existing GA property.
  // Never copy this enabled gate into production; inspect requests manually.
  const RELEASE_ENABLED = true;
  const KEY = 'tsk.previewAnalyticsConsent.v1';
  let choice = null;
  let started = false;
  let previousFocus = null;
  const panel = document.getElementById('analytics-consent');
  if (!panel) return;
  const status = document.getElementById('analytics-consent-status');
  const read = () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } };
  const remember = value => { try { localStorage.setItem(KEY, value); } catch (_) { /* choice lasts for this page */ } };
  const open = () => {
    previousFocus = document.activeElement;
    panel.hidden = false;
    status.textContent = choice === 'accepted'
      ? (RELEASE_ENABLED ? 'Optional analytics is on.' : 'Consent accepted. Optional analytics is disabled for this release.')
      : 'Optional analytics is off.';
    document.getElementById('analytics-reject').focus();
  };
  const close = () => { panel.hidden = true; if (previousFocus) previousFocus.focus(); };
  const clearCookies = () => {
    // Remove only GA cookies, leaving order/menu storage untouched.
    const domains = ['', location.hostname, '.' + location.hostname];
    document.cookie.split(';').forEach(part => {
      const name = part.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      domains.forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  };
  const start = () => {
    if (!RELEASE_ENABLED || started || choice !== 'accepted') return;
    started = true;
    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    // Only these public paths/titles can be sent. Never read query, hash,
    // referrer, page title, form fields, or WhatsApp link destinations.
    const privacy = location.pathname === '/tsk-seo-preview/privacy.html';
    const safeLocation = 'https://advith445.github.io/tsk-seo-preview/' + (privacy ? 'privacy.html' : '');
    const safeTitle = privacy ? 'SYNTHETIC PREVIEW - TSK Privacy Policy' : 'SYNTHETIC PREVIEW - TSK Website';
    window.gtag('config', ID, {
      send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false, ignore_referrer: true,
      page_location: safeLocation, page_referrer: '', page_title: safeTitle,
      cookie_expires: 7776000, cookie_update: false
    });
    window.gtag('event', 'page_view', {
      page_location: safeLocation, page_referrer: '', page_title: safeTitle
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    script.id = 'tsk-analytics-loader';
    script.referrerPolicy = 'no-referrer';
    document.head.appendChild(script);
  };
  const reject = () => {
    choice = 'rejected';
    remember(choice);
    window['ga-disable-' + ID] = true;
    clearCookies();
    close();
    // Reload unloads Google's code and listeners; the saved rejection prevents
    // loading again. No consent-update ping is sent on withdrawal.
    if (started) location.reload();
  };
  document.getElementById('analytics-accept').addEventListener('click', () => {
    choice = 'accepted'; remember(choice); close(); start();
  });
  document.getElementById('analytics-reject').addEventListener('click', reject);
  document.querySelectorAll('[data-analytics-settings]').forEach(button => button.addEventListener('click', open));
  window.addEventListener('storage', event => { if (event.key === KEY && event.newValue !== 'accepted') reject(); });
  choice = read();
  if (choice === 'accepted') start();
  else {
    window['ga-disable-' + ID] = true;
    clearCookies();
    if (choice !== 'rejected') open();
  }
})();
