/* DIGITAR — código Python nas páginas do curso
   - realça a sintaxe de todo pre.codigo > code (sem bibliotecas)
   - em pre.codigo[data-executar="sim"] adiciona o botão "Executar", que carrega o Pyodide
     só no primeiro uso e mostra a saída (stdout e erros) logo abaixo do bloco
   - input() abre o prompt() do navegador */
(function () {
  "use strict";

  var PYODIDE_JS = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  var PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  var PYODIDE_SRI = "sha384-i3R37b3tF+HWudsUf1VSEOY2YxwSNMqY8DQa9Z0O3xh+NkJ9o+yjcGyIi5huj+nB";

  function esc(t) {
    return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; });
  }

  /* ---------- realce de sintaxe ---------- */
  var PALAVRAS = ("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case").split(" ");
  var EMBUTIDAS = ("print input len range int float str bool list dict set tuple type abs min max sum round sorted reversed enumerate zip map filter open isinstance help any all format chr ord divmod pow super object Exception ValueError TypeError NameError KeyError IndexError ZeroDivisionError self").split(" ");
  var CONST = { True: 1, False: 1, None: 1 };
  var RE = /(#[^\n]*)|((?:[rRbBuUfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b)|([\p{L}_][\p{L}\p{N}_]*)/gu;

  function realcar(codigo) {
    var saida = "", ultimo = 0, anterior = "", m;
    RE.lastIndex = 0;
    while ((m = RE.exec(codigo))) {
      saida += esc(codigo.slice(ultimo, m.index));
      var t = m[0], cls = "";
      if (m[1]) cls = "py-com";
      else if (m[2]) cls = "py-str";
      else if (m[3]) cls = "py-num";
      else if (m[4]) {
        if (anterior === "def" || anterior === "class") cls = "py-fn";
        else if (CONST[t]) cls = "py-const";
        else if (PALAVRAS.indexOf(t) >= 0) cls = "py-kw";
        else if (EMBUTIDAS.indexOf(t) >= 0 && codigo.charAt(m.index - 1) !== ".") cls = "py-bi";
        anterior = t;
      }
      saida += cls ? '<span class="' + cls + '">' + esc(t) + "</span>" : esc(t);
      ultimo = m.index + t.length;
      if (RE.lastIndex === m.index) RE.lastIndex++;
    }
    return saida + esc(codigo.slice(ultimo));
  }

  /* ---------- Pyodide sob demanda ---------- */
  var promessa = null, pronto = false, coletor = null;

  function carregarScript() {
    return new Promise(function (ok, falha) {
      if (window.loadPyodide) return ok();
      var s = document.createElement("script");
      s.src = PYODIDE_JS;
      // Subresource Integrity: se o arquivo do CDN for alterado, o navegador se recusa a rodá-lo.
      // Hash da versão 0.26.4 (confere com o publicado pelo jsDelivr). Ao trocar a versão, recalcule.
      s.integrity = PYODIDE_SRI;
      s.crossOrigin = "anonymous";
      s.onload = function () { ok(); };
      s.onerror = function () { s.remove(); falha(new Error("rede")); };
      document.head.appendChild(s);
    });
  }

  var PRELUDIO = [
    "import builtins, sys",
    "import js",
    "class EntradaCancelada(Exception):",
    "    pass",
    "builtins.EntradaCancelada = EntradaCancelada",
    "def _input(mensagem=''):",
    "    mensagem = str(mensagem)",
    "    print(mensagem, end='')",
    "    sys.stdout.flush()",
    "    resposta = js.window.prompt(mensagem)",
    "    if resposta is None:",
    "        print()",
    "        raise EntradaCancelada('a caixa de entrada foi cancelada')",
    "    print(resposta)",
    "    return resposta",
    "builtins.input = _input"
  ].join("\n");

  function obterPython() {
    if (!promessa) {
      promessa = carregarScript().then(function () {
        return window.loadPyodide({ indexURL: PYODIDE_BASE });
      }).then(function (py) {
        py.setStdout({ batched: function (s) { if (coletor) coletor.push({ t: "out", s: s }); } });
        py.setStderr({ batched: function (s) { if (coletor) coletor.push({ t: "err", s: s }); } });
        py.runPython(PRELUDIO);
        pronto = true;
        return py;
      }).catch(function (e) {
        promessa = null;
        throw e;
      });
    }
    return promessa;
  }

  /* ---------- mensagens de erro ---------- */
  function limparErro(msg) {
    var linhas = String(msg || "").replace(/\s+$/, "").split("\n");
    var i = -1;
    for (var k = 0; k < linhas.length; k++) if (/File "<exec>"/.test(linhas[k])) { i = k; break; }
    if (i < 0) return linhas.slice(-1).join("\n");
    var corpo = linhas.slice(i).filter(function (l) { return !/, in _input$/.test(l); });
    var ehSintaxe = /^(SyntaxError|IndentationError|TabError)/.test(corpo[corpo.length - 1] || "");
    return (ehSintaxe ? "" : "Traceback (most recent call last):\n") + corpo.join("\n").replace(/File "<exec>"/g, 'File "seu código"');
  }
  var EXPLICA = {
    SyntaxError: "Erro de sintaxe: o Python não entendeu a forma do código. Confira parênteses, aspas e dois-pontos na linha indicada.",
    IndentationError: "Erro de indentação: os espaços no começo da linha não estão certos. Blocos depois de dois-pontos ficam 4 espaços para dentro.",
    TabError: "Mistura de Tab e espaços na indentação. Use só espaços (4 por nível).",
    NameError: "Nome não definido: você usou uma variável ou função que o Python ainda não conhece. Veja se o nome está escrito igual e se foi criado antes.",
    TypeError: "Tipo errado: a operação não funciona com esse tipo de valor (por exemplo, somar texto com número). Use int(), float() ou str() para converter.",
    ValueError: "Valor inválido: o tipo está certo, mas o valor não serve (por exemplo, int(\"abc\")).",
    ZeroDivisionError: "Divisão por zero: nenhum número pode ser dividido por zero.",
    IndexError: "Índice fora da lista: você pediu uma posição que não existe. Lembre que a contagem começa em 0.",
    KeyError: "Chave inexistente: o dicionário não tem essa chave.",
    AttributeError: "Atributo inexistente: esse tipo de valor não tem esse método ou atributo.",
    ModuleNotFoundError: "Módulo não encontrado: confira o nome do import. Alguns módulos não existem no navegador.",
    EntradaCancelada: "A execução parou porque a caixa de entrada foi cancelada. Clique em Executar de novo e responda à pergunta."
  };
  function explicacao(texto) {
    var ultima = texto.split("\n").pop() || "";
    var tipo = (ultima.match(/^(\w+)/) || [])[1];
    return EXPLICA[tipo] || "";
  }

  /* ---------- executar ---------- */
  function executar(bloco, botao, estado, saidaEl, codigo) {
    botao.disabled = true;
    estado.textContent = pronto ? "Executando…" : "Carregando o Python… (só na primeira vez; pode levar alguns segundos)";
    saidaEl.hidden = true;
    obterPython().then(function (py) {
      estado.textContent = "Executando…";
      return py.loadPackagesFromImports(codigo).then(function () {
        var linhas = [];
        coletor = linhas;
        var ns = py.globals.get("dict")();
        var erro = null;
        return py.runPythonAsync(codigo, { globals: ns }).catch(function (e) { erro = e; }).then(function () {
          try { py.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()"); } catch (e) { /* nada */ }
          coletor = null;
          try { ns.destroy(); } catch (e) { /* nada */ }
          mostrar(saidaEl, linhas, erro ? limparErro(erro.message) : "");
          estado.textContent = erro ? "Terminou com erro. Leia a última linha da mensagem." : "Pronto.";
        });
      });
    }).catch(function () {
      coletor = null;
      estado.textContent = "";
      saidaEl.hidden = false;
      saidaEl.className = "resultado com-erro";
      saidaEl.innerHTML = '<span class="erro">Não foi possível carregar o Python. Confira a conexão com a internet e tente de novo.</span>';
    }).then(function () {
      botao.disabled = false;
    });
  }

  function mostrar(saidaEl, linhas, erro) {
    var html = linhas.map(function (l) {
      return l.t === "err" ? '<span class="erro">' + esc(l.s) + "</span>" : esc(l.s);
    }).join("\n");
    if (erro) {
      html += (html ? "\n" : "") + '<span class="erro">' + esc(erro) + "</span>";
      var ex = explicacao(erro);
      if (ex) html += '<span class="explica-erro">' + esc(ex) + "</span>";
    }
    if (!html) html = '<span class="vazio">O código rodou e não mostrou nada. Use print() para ver valores.</span>';
    saidaEl.className = "resultado" + (erro ? " com-erro" : "");
    saidaEl.innerHTML = html;
    saidaEl.hidden = false;
  }

  function prepararBloco(pre) {
    var code = pre.querySelector("code") || pre;
    var codigo = code.textContent.replace(/^\n/, "").replace(/\s+$/, "");
    code.innerHTML = realcar(codigo);
    if (pre.getAttribute("data-executar") !== "sim") return;
    var acoes = document.createElement("div");
    acoes.className = "cod-acoes";
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao pequeno";
    botao.textContent = "Executar";
    var estado = document.createElement("span");
    estado.className = "cod-estado";
    estado.setAttribute("aria-live", "polite");
    acoes.appendChild(botao);
    acoes.appendChild(estado);
    var saida = document.createElement("div");
    saida.className = "resultado";
    saida.hidden = true;
    saida.setAttribute("aria-live", "polite");
    pre.insertAdjacentElement("afterend", acoes);
    acoes.insertAdjacentElement("afterend", saida);
    botao.addEventListener("click", function () { executar(pre, botao, estado, saida, codigo); });
  }

  function iniciar() {
    Array.prototype.forEach.call(document.querySelectorAll("pre.codigo"), prepararBloco);
  }
  window.DIGITAR_PYTHON = { realcar: realcar, carregar: obterPython };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
