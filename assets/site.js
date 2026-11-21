/* DIGITAR — script comum do site
   - preenche #topo e #rodape
   - na aula do curso, preenche nav.trilha com python/aulas.json
   - em python/index.html, preenche #lista-aulas
   - monta o teclado ABNT2 e a demonstração de digitação ([data-demo], [data-teclado])
   Funciona na raiz e em python/ porque calcula a base a partir do próprio endereço deste arquivo. */
(function () {
  "use strict";

  var script = document.currentScript || document.querySelector('script[src*="site.js"]');
  var BASE = new URL("../", script ? script.src : location.href); // pasta site/
  function url(caminho) { return new URL(caminho, BASE).href; }

  var LINKS = {
    inicio: url("index.html"),
    aprender: url("como-aprender.html"),
    programar: url("programar.html"),
    python: url("python/index.html"),
    baixar: url("baixar.html"),
    acervo: url("acervo.html"),
    app: url("app/"),
    instalador: "https://github.com/regivaldsud/digitar/releases/latest/download/DIGITAR_Instalador.exe",
    repositorio: "https://github.com/regivaldsud/digitar"
  };

  /* Contador de visitas (serviço em site-next/, publicado na Vercel). Vazio = desligado.
     Este é o único lugar para configurar o endereço: ferramentas/montar.mjs também o leva para o app.
     O contador nunca bloqueia a página: se o endereço não responder, nada acontece. */
  var CONTADOR_URL = "https://digitar-contador.regivaldo2017.workers.dev";
  function ligarContador() {
    if (!CONTADOR_URL || !/^https?:$/.test(location.protocol) || window.Contador) return;
    var s = document.createElement("script");
    s.src = CONTADOR_URL.replace(/\/$/, "") + "/contador.js";
    s.defer = true;
    document.head.appendChild(s);
  }

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- página atual ---------- */
  var caminho = decodeURIComponent(location.pathname).replace(/\\/g, "/");
  var arquivoAtual = caminho.split("/").pop() || "index.html";
  var dentroDoCurso = /\/python\//.test(caminho);
  function secaoAtual() {
    if (dentroDoCurso) return "python";
    if (arquivoAtual === "como-aprender.html") return "aprender";
    if (arquivoAtual === "programar.html") return "programar";
    if (arquivoAtual === "baixar.html") return "baixar";
    if (arquivoAtual === "acervo.html") return "acervo";
    if (arquivoAtual === "index.html" || arquivoAtual === "") return "inicio";
    return "";
  }

  /* ---------- logotipo (marca oficial; versão sem o slogan para caber no topo) ---------- */
  var LOGO =
    '<svg viewBox="0 0 1210 360" role="img" aria-label="DIGITAR" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="topo-fundo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b8cf0"/><stop offset="1" stop-color="#1a55a8"/></linearGradient>' +
    '<linearGradient id="topo-tecla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e4edfa"/></linearGradient></defs>' +
    '<g transform="translate(24 24) scale(0.609)">' +
    '<rect width="512" height="512" rx="116" fill="url(#topo-fundo)"/>' +
    '<rect x="92" y="132" width="328" height="300" rx="74" fill="#0e3d80"/>' +
    '<rect x="92" y="92" width="328" height="300" rx="74" fill="url(#topo-tecla)"/>' +
    '<polyline points="172,178 252,242 172,306" fill="none" stroke="#2a78d6" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="270" y="284" width="86" height="28" rx="14" fill="#eda100"/></g>' +
    '<text class="logo-nome" x="380" y="234" font-family="Segoe UI, Inter, system-ui, sans-serif" font-size="150" font-weight="800" letter-spacing="4">DIGI<tspan class="logo-nome-azul">TAR</tspan></text>' +
    "</svg>";

  function montarTopo() {
    var alvo = document.getElementById("topo");
    if (!alvo) return;
    var atual = secaoAtual();
    var itens = [
      ["inicio", "Início"],
      ["aprender", "Como aprender"],
      ["programar", "Programar"],
      ["python", "Curso de Python"],
      ["acervo", "Acervo"],
      ["baixar", "Baixar"]
    ];
    var menu = itens.map(function (i) {
      return '<li><a href="' + LINKS[i[0]] + '"' + (i[0] === atual ? ' aria-current="page"' : "") + ">" + i[1] + "</a></li>";
    }).join("");
    alvo.innerHTML =
      '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' +
      '<header class="topo"><div class="topo-dentro">' +
      '<a class="logo" href="' + LINKS.inicio + '" aria-label="DIGITAR, página inicial">' + LOGO + "</a>" +
      '<button class="menu-botao" type="button" aria-expanded="false" aria-controls="menu-principal">Menu</button>' +
      '<nav aria-label="Principal"><ul class="menu" id="menu-principal">' + menu +
      '<li><a class="botao pequeno" href="' + LINKS.app + '">Usar online</a></li></ul></nav>' +
      "</div></header>";
    var topo = alvo.querySelector(".topo");
    var botao = alvo.querySelector(".menu-botao");
    botao.addEventListener("click", function () {
      var aberto = topo.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", String(aberto));
      botao.textContent = aberto ? "Fechar" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && topo.classList.contains("aberto")) { botao.click(); botao.focus(); }
    });
    // alvo do link "Pular para o conteúdo"
    var principal = document.querySelector("main");
    if (principal && !document.getElementById("conteudo")) principal.id = "conteudo";
  }

  function montarRodape() {
    var alvo = document.getElementById("rodape");
    if (!alvo) return;
    alvo.innerHTML =
      '<footer class="rodape"><div class="rodape-dentro">' +
      '<div class="rodape-marca"><img src="' + url("assets/digitar.svg") + '" alt="" width="40" height="40">' +
      "<div><p><strong>DIGITAR</strong> é um curso gratuito de digitação com os dez dedos e de programação em Python.</p>" +
      "<p>Seus dados de treino ficam no seu navegador.</p>" +
      (CONTADOR_URL ? '<p data-contador-selo hidden><span data-contador-visitantes></span> pessoas já visitaram o site.</p>' : "") +
      "</div></div>" +
      '<div><h2>Aprender</h2><ul>' +
      '<li><a href="' + LINKS.aprender + '">Como aprender a digitar</a></li>' +
      '<li><a href="' + LINKS.programar + '">Digitar para programar</a></li>' +
      '<li><a href="' + LINKS.python + '">Curso de Python</a></li>' +
      '<li><a href="' + LINKS.acervo + '">Acervo do GitHub</a></li></ul></div>' +
      '<div><h2>Usar</h2><ul>' +
      '<li><a href="' + LINKS.app + '">Usar online</a></li>' +
      '<li><a href="' + LINKS.baixar + '">Baixar para Windows</a></li>' +
      '<li><a href="' + LINKS.repositorio + '">Código no GitHub</a></li></ul></div>' +
      "</div></footer>";
  }

  /* ---------- aulas do curso (python/aulas.json) ---------- */
  var promessaAulas = null;
  function carregarAulas() {
    if (!promessaAulas) {
      promessaAulas = fetch(url("python/aulas.json"), { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (dados) {
        if (!dados || !Array.isArray(dados.modulos) || !dados.modulos.length) throw new Error("sem módulos");
        return dados.modulos;
      });
    }
    return promessaAulas;
  }
  function tituloModulo(t) {
    // "Módulo 1 · Fundamentos" vira "Fundamentos" quando o número já aparece ao lado
    return String(t || "").replace(/^\s*m[óo]dulo\s*\d+\s*[·:.\-–—]?\s*/i, "") || String(t || "");
  }

  function montarTrilha() {
    var nav = document.querySelector("nav.trilha");
    if (!nav) return;
    var estreito = window.matchMedia("(max-width: 900px)").matches;
    nav.innerHTML = '<p class="trilha-aviso">Carregando a lista de aulas…</p>';
    carregarAulas().then(function (modulos) {
      var html = '<details class="trilha-caixa"' + (estreito ? "" : " open") + '><summary>Aulas do curso</summary>' +
        '<p class="trilha-inicio"><a href="' + LINKS.python + '">Apresentação do curso</a></p><ol>';
      var achou = null;
      modulos.forEach(function (m, i) {
        html += '<li><span class="trilha-modulo">Módulo ' + (i + 1) + ": " + esc(tituloModulo(m.titulo)) + "</span><ol>";
        (m.aulas || []).forEach(function (a) {
          var atual = a.arquivo === arquivoAtual;
          if (atual) achou = a;
          html += '<li><a href="' + url("python/" + a.arquivo) + '"' + (atual ? ' aria-current="page"' : "") + ">" + esc(a.titulo) + "</a></li>";
        });
        html += "</ol></li>";
      });
      html += "</ol></details>";
      nav.innerHTML = html;
      var marcado = nav.querySelector('[aria-current="page"]');
      if (marcado && !estreito && marcado.scrollIntoView) {
        var caixa = nav.getBoundingClientRect(), item = marcado.getBoundingClientRect();
        if (item.bottom > caixa.bottom) nav.scrollTop += item.top - caixa.top - 80;
      }
      if (achou && estreito) {
        nav.querySelector("summary").textContent = "Aulas do curso (você está em: " + achou.titulo + ")";
      }
    }).catch(function () {
      nav.innerHTML = '<p class="trilha-aviso">A lista de aulas não carregou. <a href="' + LINKS.python + '">Abra a apresentação do curso</a> para ver todas as aulas.</p>';
    });
  }

  function montarIndiceCurso() {
    var alvo = document.getElementById("lista-aulas");
    if (!alvo) return;
    carregarAulas().then(function (modulos) {
      var total = 0;
      var html = '<ol class="modulos">';
      modulos.forEach(function (m, i) {
        var aulas = m.aulas || [];
        total += aulas.length;
        html += '<li><span class="modulo-num" aria-hidden="true">' + (i + 1) + "</span><div>" +
          "<h3>Módulo " + (i + 1) + ": " + esc(tituloModulo(m.titulo)) + "</h3><ol>";
        aulas.forEach(function (a) {
          html += '<li><a href="' + url("python/" + a.arquivo) + '">' + esc(a.titulo) + "</a></li>";
        });
        html += "</ol></div></li>";
      });
      html += "</ol>";
      var resumo = document.getElementById("resumo-aulas");
      if (resumo) resumo.textContent = modulos.length + (modulos.length === 1 ? " módulo" : " módulos") + " e " + total + (total === 1 ? " aula" : " aulas") + ", em ordem. Comece pela primeira.";
      alvo.innerHTML = html;
    }).catch(function () {
      alvo.innerHTML =
        '<div class="aviso-vazio"><p><strong>As aulas estão sendo preparadas.</strong> A lista aparece aqui assim que forem publicadas.</p>' +
        '<p>Enquanto isso, firme a digitação: no <a href="' + LINKS.app + '">DIGITAR</a>, passe pelas lições do teclado e depois treine os símbolos no modo Programar. ' +
        'Veja <a href="' + LINKS.programar + '">o caminho do teclado ao código</a>.</p></div>';
    });
  }

  /* ---------- teclado ABNT2 ---------- */
  var NOME_DEDO = {
    me1: "mindinho esquerdo", me2: "anelar esquerdo", me3: "médio esquerdo", me4: "indicador esquerdo",
    md4: "indicador direito", md3: "médio direito", md2: "anelar direito", md1: "mindinho direito", pol: "polegar"
  };
  // [rótulo, dedo, largura, caractere digitado]
  var LINHAS = [
    [["'", "me1"], ["1", "me1"], ["2", "me2"], ["3", "me3"], ["4", "me4"], ["5", "me4"], ["6", "md4"], ["7", "md4"], ["8", "md3"], ["9", "md2"], ["0", "md1"], ["-", "md1"], ["=", "md1"], ["Apagar", "", 2]],
    [["Tab", "", 1.5], ["q", "me1"], ["w", "me2"], ["e", "me3"], ["r", "me4"], ["t", "me4"], ["y", "md4"], ["u", "md4"], ["i", "md3"], ["o", "md2"], ["p", "md1"], ["´", "md1"], ["[", "md1"], ["", "", 1.5]],
    [["Caps", "", 1.75], ["a", "me1"], ["s", "me2"], ["d", "me3"], ["f", "me4"], ["g", "me4"], ["h", "md4"], ["j", "md4"], ["k", "md3"], ["l", "md2"], ["ç", "md1"], ["~", "md1"], ["]", "md1"], ["Enter", "", 1.25]],
    [["Shift", "", 1.25], ["\\", "me1"], ["z", "me1"], ["x", "me2"], ["c", "me3"], ["v", "me4"], ["b", "me4"], ["n", "md4"], ["m", "md4"], [",", "md3"], [".", "md2"], [";", "md1"], ["/", "md1"], ["Shift", "", 1.75]],
    [["Ctrl", "", 1.5], ["Alt", "", 1.5], ["espaço", "pol", 9, " "], ["AltGr", "", 1.5], ["Ctrl", "", 1.5]]
  ];

  function montarTeclado(alvo, realce) {
    var mapa = {};
    var html = "";
    LINHAS.forEach(function (linha) {
      html += '<div class="teclado-linha">';
      linha.forEach(function (k) {
        var rotulo = k[0], dedo = k[1], larg = k[2] || 1, ch = k[3] || (dedo ? rotulo : null);
        var classes = ["tecla"];
        if (!dedo) classes.push("fn");
        if (rotulo === "f" || rotulo === "j") classes.push("relevo");
        if (realce && dedo && realce.indexOf(ch) < 0) classes.push("fora");
        html += '<span class="' + classes.join(" ") + '"' + (dedo ? ' data-dedo="' + dedo + '"' : "") +
          (ch ? ' data-ch="' + esc(ch) + '"' : "") + ' style="flex-grow:' + larg + '">' +
          (rotulo === "espaço" ? "" : esc(rotulo === "Apagar" ? "⌫" : rotulo)) + "</span>";
      });
      html += "</div>";
    });
    alvo.classList.add("teclado");
    alvo.setAttribute("aria-hidden", "true");
    alvo.innerHTML = html;
    Array.prototype.forEach.call(alvo.querySelectorAll("[data-ch]"), function (el) { mapa[el.getAttribute("data-ch")] = el; });
    return mapa;
  }

  function legendaDedos() {
    var ordem = ["me1", "me2", "me3", "me4", "md4", "md3", "md2", "md1", "pol"];
    return '<ul class="legenda-dedos" aria-hidden="true">' + ordem.map(function (d) {
      return '<li><i style="background:var(--d-' + d + ')"></i>' + NOME_DEDO[d] + "</li>";
    }).join("") + "</ul>";
  }

  function dedoDe(ch) {
    for (var i = 0; i < LINHAS.length; i++) for (var j = 0; j < LINHAS[i].length; j++) {
      var k = LINHAS[i][j], c = k[3] || (k[1] ? k[0] : null);
      if (c === ch) return k[1];
    }
    return "";
  }

  /* teclados estáticos: <div data-teclado data-realce="asdfjklç"></div> */
  function montarTecladosEstaticos() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-teclado]"), function (el) {
      var caixa = document.createElement("div");
      el.appendChild(caixa);
      montarTeclado(caixa, el.getAttribute("data-realce") || "");
      if (el.hasAttribute("data-legenda")) el.insertAdjacentHTML("beforeend", legendaDedos());
    });
  }

  /* ---------- demonstração: digite a frase ---------- */
  function montarDemo(el) {
    var frases;
    try { frases = JSON.parse(el.getAttribute("data-frases")); } catch (e) { frases = null; }
    if (!frases || !frases.length) frases = ["asdf jklç asdf jklç"];
    var id = "demo-entrada-" + Math.random().toString(36).slice(2, 7);
    el.innerHTML =
      '<div class="demo-topo"><h2>' + esc(el.getAttribute("data-titulo") || "Experimente: digite a frase") + "</h2>" +
      '<dl class="demo-medidas"><div><dt>PPM</dt><dd data-ppm>0</dd></div><div><dt>de precisão</dt><dd data-prec>100%</dd></div></dl></div>' +
      '<label class="visualmente-oculto" for="' + id + '">Área de prática. Digite a frase mostrada.</label>' +
      '<input class="demo-entrada" id="' + id + '" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text">' +
      '<p class="demo-frase" aria-hidden="true"></p>' +
      '<p class="demo-dedo"></p>' +
      '<div class="demo-teclado"></div>' + legendaDedos() +
      '<p class="demo-convite">Clique aqui (ou toque) e comece pela primeira letra.</p>' +
      '<p class="visualmente-oculto" aria-live="polite" data-anuncio></p>';

    var entrada = el.querySelector(".demo-entrada");
    var fraseEl = el.querySelector(".demo-frase");
    var dedoEl = el.querySelector(".demo-dedo");
    var ppmEl = el.querySelector("[data-ppm]");
    var precEl = el.querySelector("[data-prec]");
    var anuncio = el.querySelector("[data-anuncio]");
    var teclas = montarTeclado(el.querySelector(".demo-teclado"));
    var nFrase = 0, texto = "", pos = 0, acertos = 0, erros = 0, inicio = 0, errouAgora = false, pausa = false;

    function carregar() {
      texto = frases[nFrase % frases.length];
      pos = 0; acertos = 0; erros = 0; inicio = 0; errouAgora = false; pausa = false;
      ppmEl.textContent = "0"; precEl.textContent = "100%";
      desenhar();
      anuncio.textContent = "Frase: " + texto;
    }
    function desenhar() {
      var feito = esc(texto.slice(0, pos));
      var atual = texto.charAt(pos);
      var resto = esc(texto.slice(pos + 1));
      fraseEl.innerHTML = '<span class="feito">' + feito + "</span>" +
        (atual ? '<span class="atual' + (errouAgora ? " errou" : "") + '">' + (atual === " " ? "&nbsp;" : esc(atual)) + "</span>" : "") +
        '<span class="falta">' + resto + "</span>";
      Array.prototype.forEach.call(el.querySelectorAll(".alvo"), function (t) { t.classList.remove("alvo"); });
      if (atual && teclas[atual]) teclas[atual].classList.add("alvo");
      if (atual) {
        var d = dedoDe(atual);
        dedoEl.innerHTML = "Próxima tecla: <kbd>" + (atual === " " ? "espaço" : esc(atual)) + "</kbd> com o <strong>" + (NOME_DEDO[d] || "dedo indicado") + "</strong>";
      }
    }
    function medir() {
      var min = (Date.now() - inicio) / 60000;
      var ppm = min > 0 ? Math.round((acertos / 5) / min) : 0;
      ppmEl.textContent = String(Math.min(ppm, 300));
      precEl.textContent = Math.round(100 * acertos / Math.max(1, acertos + erros)) + "%";
      return ppm;
    }
    function apertar(t) {
      if (!t) return;
      t.classList.add("apertou");
      setTimeout(function () { t.classList.remove("apertou"); }, 110);
    }
    function receber(ch) {
      if (pausa || pos >= texto.length) return;
      var esperado = texto.charAt(pos);
      var c = ch.toLowerCase();
      if (esperado === "ç" && c === ";") c = "ç"; // teclado sem ç: a tecla fica no mesmo lugar
      if (!inicio) inicio = Date.now();
      apertar(teclas[c]);
      if (c === esperado) {
        acertos++; pos++; errouAgora = false;
        Array.prototype.forEach.call(el.querySelectorAll(".errou-aqui"), function (t) { t.classList.remove("errou-aqui"); });
      } else {
        erros++; errouAgora = true;
        if (teclas[c]) { teclas[c].classList.add("errou-aqui"); setTimeout(function () { teclas[c] && teclas[c].classList.remove("errou-aqui"); }, 300); }
      }
      var ppm = medir();
      desenhar();
      if (pos >= texto.length) {
        pausa = true;
        var prec = precEl.textContent;
        dedoEl.innerHTML = "<strong>Pronto: " + ppm + " PPM com " + prec + " de precisão.</strong> Vem outra frase.";
        anuncio.textContent = "Frase concluída: " + ppm + " palavras por minuto, " + prec + " de precisão.";
        setTimeout(function () { nFrase++; carregar(); }, 1600);
      }
    }

    entrada.addEventListener("input", function () {
      var v = entrada.value;
      entrada.value = "";
      for (var i = 0; i < v.length; i++) receber(v.charAt(i));
    });
    entrada.addEventListener("keydown", function (e) {
      if (e.key === "Enter") e.preventDefault();
    });
    el.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      entrada.focus({ preventScroll: true });
    });
    carregar();
  }

  /* ---------- início ---------- */
  function iniciar() {
    montarTopo();
    montarRodape();
    montarTrilha();
    montarIndiceCurso();
    montarTecladosEstaticos();
    Array.prototype.forEach.call(document.querySelectorAll("[data-demo]"), montarDemo);
    ligarContador();
  }
  window.DIGITAR = { base: BASE.href, url: url, carregarAulas: carregarAulas };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
