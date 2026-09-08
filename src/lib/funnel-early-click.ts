/**
 * Pré-hidratação: intercepta cliques nos CTAs de funil antes do React assumir.
 *
 * Sem isso, um clique disparado enquanto o bundle ainda carrega segue o
 * `href` de fallback (`/f/<slug>`), tirando a pessoa da página do cliente.
 * Aqui o clique é segurado em `window.__0webPendingFunnel`; o
 * `FunnelCTAButton` consome esse valor ao montar e abre o modal do projeto.
 * Se a hidratação não acontecer em 8s, a navegação original é liberada.
 */
export const FUNNEL_EARLY_CLICK_SCRIPT = `(function(){
  if (window.__0webFunnelEarlyClick) return; window.__0webFunnelEarlyClick = 1;
  document.addEventListener('click', function(e){
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var el = e.target && e.target.closest ? e.target.closest('[data-funnel-slug]') : null;
    if (!el) return;
    var slug = el.getAttribute('data-funnel-slug');
    if (!slug) return;
    e.preventDefault();
    window.__0webPendingFunnel = slug;
    var href = el.getAttribute('href');
    setTimeout(function(){
      if (window.__0webPendingFunnel === slug && href) { window.location.href = href; }
    }, 8000);
  }, true);
})();`;
