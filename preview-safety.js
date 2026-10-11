/* Preview only: block real transactions and outbound contact navigation. */
(() => {
  'use strict';
  const blocked = '[data-preview-disabled], #sendOrder, #bookSend, [data-cart-open], [data-buy], .sig__buy, [data-inc], [data-dec], [data-copy], #bookForm, #drawer';
  const stop = e => {
    const target = e.target instanceof Element ? e.target : null;
    const link = target && target.closest('a');
    if ((target && target.closest(blocked)) || (link && /^(?:https?:|tel:|mailto:|whatsapp:)/i.test(link.getAttribute('href') || ''))) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  };
  ['click','auxclick','keydown'].forEach(type => document.addEventListener(type, e => {
    if (type !== 'keydown' || e.key === 'Enter' || e.key === ' ') stop(e);
  }, true));
  document.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); }, true);
})();
