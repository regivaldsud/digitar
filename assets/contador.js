/*!
 * Contador do DIGITAR — visitantes, tempo no site e fases alcançadas.
 * Sem cookies e sem dados pessoais: guarda só um identificador aleatório no navegador.
 * Respeita "Do Not Track" e "Global Privacy Control" (nesses casos não envia nada).
 *
 * Uso numa página (tag script com src apontando para uma cópia deste arquivo, defer e os atributos abaixo).
 * No app ele vai embutido e a configuração vem de window.CONTADOR_CONFIG = { endpoint, fase }.
 * - data-fase (opcional): fase desta página. Sem ela, a fase sai do endereço da página.
 * - data-endpoint (opcional): endereço da API; o padrão é o mesmo domínio deste script.
 * - <a data-fase-clique="download"> registra a fase ao clicar (links para .exe já contam como download).
 * - <span data-contador-visitantes></span> mostra o total de pessoas que já visitaram.
 * - Em código: window.Contador.fase("exercicio")
 */
(function () {
  "use strict";
  if (window.Contador) return;
  var script = document.currentScript;
  // embutido no app (sem <script src>): a configuração vem de window.CONTADOR_CONFIG = { endpoint, fase }
  var cfg = window.CONTADOR_CONFIG || {};
  var noop = { fase: function () {}, ativo: false };
  if (!/^https?:$/.test(location.protocol)) { window.Contador = noop; return; } // programa offline (file://)
  var privado = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";

  var base = cfg.endpoint || (script && script.getAttribute("data-endpoint")) || (script && script.src ? new URL(script.src).origin : location.origin);
  // os dados só vão para um endereço https (ou o servidor local de testes)
  if (!/^https:\/\/[a-z0-9.-]+(:\d+)?\/?$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(base)) { window.Contador = noop; return; }
  base = base.replace(/\/$/, "");
  var URL_EVENTO = base + "/api/metricas/evento";
  var URL_PUBLICO = base + "/api/metricas/publico";

  function idAleatorio() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }
  function guardado(area, chave) {
    try {
      var v = area.getItem(chave);
      if (!v) { v = idAleatorio(); area.setItem(chave, v); }
      return v;
    } catch { return idAleatorio(); }
  }

  /* selo público (funciona mesmo com privacidade ligada: só lê um número) */
  function mostrarSelos() {
    var alvos = document.querySelectorAll("[data-contador-visitantes]");
    if (!alvos.length) return;
    fetch(URL_PUBLICO, { mode: "cors" }).then(function (r) { return r.json(); }).then(function (j) {
      if (typeof j.visitantes !== "number") return;
      var txt = j.visitantes.toLocaleString("pt-BR");
      alvos.forEach(function (el) { el.textContent = txt; });
      document.querySelectorAll("[data-contador-selo]").forEach(function (el) { el.hidden = false; });
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mostrarSelos);
  else mostrarSelos();

  // navegador controlado por automação (testes, robôs com Playwright/Puppeteer/Selenium) não é visitante
  if (privado || navigator.webdriver === true) { window.Contador = noop; return; }

  var visitante = guardado(localStorage, "digitar.visitante");
  var sessao = guardado(sessionStorage, "digitar.sessao");

  function enviar(eventos, usarBeacon) {
    var corpo = JSON.stringify(eventos);
    if (usarBeacon && navigator.sendBeacon) {
      try { if (navigator.sendBeacon(URL_EVENTO, new Blob([corpo], { type: "text/plain" }))) return; } catch {}
    }
    try {
      fetch(URL_EVENTO, { method: "POST", body: corpo, headers: { "Content-Type": "text/plain" }, keepalive: true, mode: "cors" }).catch(function () {});
    } catch {}
  }
  function evento(tipo, extra) {
    var e = { tipo: tipo, v: visitante, s: sessao };
    for (var k in extra) e[k] = extra[k];
    return e;
  }

  var enviadas = {};
  function fase(id) {
    if (!id || enviadas[id]) return;
    enviadas[id] = true;
    enviar([evento("fase", { fase: String(id) })]);
  }

  /* fase da página: atributo do script, do <body>, ou pelo endereço */
  function faseDoEndereco() {
    var p = location.pathname.toLowerCase();
    if (/\/python\/\d+[^/]*\.html$/.test(p)) return "aula-python";
    if (/\/python\/?(index\.html)?$/.test(p) || /programar/.test(p)) return "programar";
    if (/como-aprender/.test(p)) return "como-aprender";
    if (/baixar/.test(p)) return "baixar";
    if (/\/app\/?(index\.html)?$|digitar\.html$|sigerdig\.html$/.test(p)) return "app";
    return null;
  }
  function iniciar() {
    var f = cfg.fase || (script && script.getAttribute("data-fase")) || (document.body && document.body.getAttribute("data-fase")) || faseDoEndereco();
    var inicio = [evento("visita", { caminho: location.pathname })];
    if (f) { enviadas[f] = true; inicio.push(evento("fase", { fase: f })); }
    enviar(inicio);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();

  /* cliques que contam como fase */
  document.addEventListener("click", function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest("[data-fase-clique], a[href]") : null;
    if (!el) return;
    var f = el.getAttribute("data-fase-clique");
    if (!f && /\.(exe|msi|zip)(\?|#|$)/i.test(el.getAttribute("href") || "")) f = "download";
    if (f) { enviadas[f] = false; fase(f); }
  }, true);

  /* tempo no site: só conta com a aba visível; envia a cada 15 s e ao sair */
  var acumulado = 0, desde = document.visibilityState === "visible" ? Date.now() : null;
  function fecharTrecho() {
    if (desde !== null) { acumulado += (Date.now() - desde) / 1000; desde = Date.now(); }
  }
  function enviarTempo(usarBeacon) {
    fecharTrecho();
    var seg = Math.floor(acumulado);
    if (seg < 1) return;
    acumulado -= seg;
    while (seg > 0) { var parte = Math.min(seg, 30); enviar([evento("tempo", { seg: parte })], usarBeacon); seg -= parte; }
  }
  setInterval(function () { if (document.visibilityState === "visible") enviarTempo(false); }, 15000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { enviarTempo(true); desde = null; }
    else desde = Date.now();
  });
  window.addEventListener("pagehide", function () { enviarTempo(true); });

  window.Contador = { fase: fase, ativo: true };
})();
