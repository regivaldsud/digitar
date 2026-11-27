/* DIGITAR — Acervo do GitHub
   Digite um tema e veja os melhores repositórios, skills, agentes, plugins e servidores MCP,
   cada um com o comando pronto para copiar para o seu projeto.
   - acervo/catalogo.json: curadoria conferida por ferramentas/acervo.mjs (estrelas, licença, caminhos)
   - busca ao vivo na API pública do GitHub para qualquer tema fora da curadoria
   - "Meu kit": junta vários itens num script único (bash ou PowerShell), com link para compartilhar
   - interface em português, inglês e espanhol */
(function () {
  "use strict";

  var script = document.currentScript || document.querySelector('script[src*="acervo.js"]');
  var BASE = new URL("../", script ? script.src : location.href);
  var REPO_SITE = "regivaldsud/digitar";

  /* ---------- textos ---------- */
  var T = {
    pt: {
      titulo: "O melhor do GitHub, tema por tema",
      lead: "Digite o que você quer construir. Aparecem os repositórios, skills, agentes, plugins e servidores MCP mais úteis, cada um com o comando pronto para copiar para o seu projeto.",
      rotuloBusca: "Tema", buscar: "Buscar", placeholder: "python, react, segurança, bim, jogos…",
      tipo: "Tipo", destino: "Copiar para", terminal: "Terminal",
      tudo: "Tudo", repositorio: "Repositório", skill: "Skill", agente: "Agente", plugin: "Plugin", mcp: "MCP", lista: "Lista",
      repositorios: "Repositórios", skills: "Skills", agentes: "Agentes", plugins: "Plugins", listas: "Listas",
      projeto: "Este projeto", usuario: "Meu usuário", livre: "Outra pasta",
      destaques: "Os mais estrelados do acervo. Escolha um tema ou digite o seu.",
      achados: function (n, q) { return n + (n === 1 ? " recurso" : " recursos") + " para “" + q + "”"; },
      nada: function (q) { return "Nada na curadoria para “" + q + "”. Veja abaixo o que o GitHub encontrou."; },
      conferido: function (n, r, d) { return n + " recursos em " + r + " repositórios, conferidos no GitHub em " + d + "."; },
      copiar: "Copiar", copiado: "Copiado", noKit: "No kit", porKit: "Pôr no kit",
      abrir: "Abrir no GitHub", estrelas: "estrelas", atualizado: "atualizado em",
      semLicenca: "Sem licença declarada: para reutilizar o código, peça permissão ao autor.",
      arquivado: "Arquivado: não recebe mais manutenção.",
      clonar: "git clone", degit: "Copiar sem histórico", submodulo: "Submódulo", sparse: "Só a pasta (git)",
      baixarArquivo: "Baixar o arquivo", adicionar: "Adicionar", noClaude: "Cole dentro do Claude Code",
      notaMcp: "Rode no terminal; o Claude Code passa a usar o servidor na próxima sessão.",
      notaSkill: "A skill vira uma pasta com SKILL.md; o agente a carrega quando o assunto aparece.",
      notaAgente: "O agente vira um arquivo .md; chame-o pelo nome ou deixe o Claude escolher.",
      notaRepo: "Rode na pasta onde o código deve ficar.",
      aoVivoTitulo: "Direto do GitHub, agora",
      aoVivoTexto: "Os repositórios com mais estrelas para este tema. Não foram conferidos por nós: veja a licença antes de copiar.",
      buscandoGh: "Buscando no GitHub…", semGh: "O GitHub não encontrou nada com esse nome.",
      limiteGh: "O GitHub limita buscas sem login a 10 por minuto. Espere um minuto e tente de novo.",
      erroGh: "Não deu para falar com o GitHub agora (sem internet?). A curadoria acima funciona mesmo assim.",
      sugerirTitulo: "Falta algum recurso?",
      sugerirTexto: "O acervo é aberto. Sugira um repositório, skill ou agente e ele entra na próxima conferência.",
      sugerirBotao: "Sugerir no GitHub",
      kit: "Meu kit", recolher: "Recolher", expandir: "Expandir",
      kitCopiar: "Copiar script", kitBaixar: "Baixar script", kitLink: "Copiar link do kit", kitLimpar: "Esvaziar",
      kitCabeca: "Kit gerado pelo Acervo DIGITAR", kitRode: "Rode na pasta raiz do seu projeto.",
      kitPlugins: "Plugins: cole estas linhas dentro do Claude Code",
      remover: "Remover", linkCopiado: "Link do kit copiado", scriptCopiado: "Script copiado",
      falhaCopia: "Não deu para copiar. Selecione o texto e copie com Ctrl+C.",
      linkKit: function (n) { return "Este link traz " + n + (n === 1 ? " item" : " itens") + " para o seu kit. Confira antes de rodar qualquer comando."; },
      linkSim: "Adicionar ao kit", linkNao: "Ignorar"
    },
    en: {
      titulo: "The best of GitHub, topic by topic",
      lead: "Type what you want to build. You get the most useful repositories, skills, agents, plugins and MCP servers, each with a ready-to-copy command for your project.",
      rotuloBusca: "Topic", buscar: "Search", placeholder: "python, react, security, bim, games…",
      tipo: "Type", destino: "Copy to", terminal: "Shell",
      tudo: "All", repositorio: "Repository", skill: "Skill", agente: "Agent", plugin: "Plugin", mcp: "MCP", lista: "List",
      repositorios: "Repositories", skills: "Skills", agentes: "Agents", plugins: "Plugins", listas: "Lists",
      projeto: "This project", usuario: "My user", livre: "Other folder",
      destaques: "The most starred in the collection. Pick a topic or type your own.",
      achados: function (n, q) { return n + (n === 1 ? " resource" : " resources") + " for “" + q + "”"; },
      nada: function (q) { return "Nothing curated for “" + q + "” yet. See what GitHub found below."; },
      conferido: function (n, r, d) { return n + " resources across " + r + " repositories, checked on GitHub on " + d + "."; },
      copiar: "Copy", copiado: "Copied", noKit: "In kit", porKit: "Add to kit",
      abrir: "Open on GitHub", estrelas: "stars", atualizado: "updated",
      semLicenca: "No license declared: ask the author before reusing the code.",
      arquivado: "Archived: no longer maintained.",
      clonar: "git clone", degit: "Copy without history", submodulo: "Submodule", sparse: "Folder only (git)",
      baixarArquivo: "Download the file", adicionar: "Add", noClaude: "Paste inside Claude Code",
      notaMcp: "Run it in your terminal; Claude Code picks up the server on the next session.",
      notaSkill: "The skill becomes a folder with SKILL.md; the agent loads it when the topic comes up.",
      notaAgente: "The agent becomes a .md file; call it by name or let Claude pick it.",
      notaRepo: "Run it in the folder where the code should live.",
      aoVivoTitulo: "Live from GitHub",
      aoVivoTexto: "The most starred repositories for this topic. Not checked by us: look at the license before copying.",
      buscandoGh: "Searching GitHub…", semGh: "GitHub found nothing with that name.",
      limiteGh: "GitHub allows 10 anonymous searches per minute. Wait a minute and try again.",
      erroGh: "Could not reach GitHub right now (offline?). The curated list above still works.",
      sugerirTitulo: "Missing something?",
      sugerirTexto: "The collection is open. Suggest a repository, skill or agent and it joins the next review.",
      sugerirBotao: "Suggest on GitHub",
      kit: "My kit", recolher: "Collapse", expandir: "Expand",
      kitCopiar: "Copy script", kitBaixar: "Download script", kitLink: "Copy kit link", kitLimpar: "Clear",
      kitCabeca: "Kit generated by the DIGITAR Collection", kitRode: "Run it from your project's root folder.",
      kitPlugins: "Plugins: paste these lines inside Claude Code",
      remover: "Remove", linkCopiado: "Kit link copied", scriptCopiado: "Script copied",
      falhaCopia: "Could not copy. Select the text and press Ctrl+C.",
      linkKit: function (n) { return "This link brings " + n + (n === 1 ? " item" : " items") + " to your kit. Review them before running any command."; },
      linkSim: "Add to kit", linkNao: "Ignore"
    },
    es: {
      titulo: "Lo mejor de GitHub, tema por tema",
      lead: "Escribe lo que quieres construir. Aparecen los repositorios, skills, agentes, plugins y servidores MCP más útiles, cada uno con el comando listo para copiar a tu proyecto.",
      rotuloBusca: "Tema", buscar: "Buscar", placeholder: "python, react, seguridad, bim, juegos…",
      tipo: "Tipo", destino: "Copiar a", terminal: "Terminal",
      tudo: "Todo", repositorio: "Repositorio", skill: "Skill", agente: "Agente", plugin: "Plugin", mcp: "MCP", lista: "Lista",
      repositorios: "Repositorios", skills: "Skills", agentes: "Agentes", plugins: "Plugins", listas: "Listas",
      projeto: "Este proyecto", usuario: "Mi usuario", livre: "Otra carpeta",
      destaques: "Los más destacados del acervo. Elige un tema o escribe el tuyo.",
      achados: function (n, q) { return n + (n === 1 ? " recurso" : " recursos") + " para “" + q + "”"; },
      nada: function (q) { return "Aún no hay curaduría para “" + q + "”. Mira abajo lo que encontró GitHub."; },
      conferido: function (n, r, d) { return n + " recursos en " + r + " repositorios, verificados en GitHub el " + d + "."; },
      copiar: "Copiar", copiado: "Copiado", noKit: "En el kit", porKit: "Añadir al kit",
      abrir: "Abrir en GitHub", estrelas: "estrellas", atualizado: "actualizado el",
      semLicenca: "Sin licencia declarada: pide permiso al autor antes de reutilizar el código.",
      arquivado: "Archivado: ya no recibe mantenimiento.",
      clonar: "git clone", degit: "Copiar sin historial", submodulo: "Submódulo", sparse: "Solo la carpeta (git)",
      baixarArquivo: "Descargar el archivo", adicionar: "Añadir", noClaude: "Pega dentro de Claude Code",
      notaMcp: "Ejecútalo en la terminal; Claude Code usará el servidor en la próxima sesión.",
      notaSkill: "La skill es una carpeta con SKILL.md; el agente la carga cuando surge el tema.",
      notaAgente: "El agente es un archivo .md; llámalo por su nombre o deja que Claude lo elija.",
      notaRepo: "Ejecútalo en la carpeta donde debe quedar el código.",
      aoVivoTitulo: "Directo de GitHub",
      aoVivoTexto: "Los repositorios con más estrellas para este tema. No los revisamos: mira la licencia antes de copiar.",
      buscandoGh: "Buscando en GitHub…", semGh: "GitHub no encontró nada con ese nombre.",
      limiteGh: "GitHub permite 10 búsquedas anónimas por minuto. Espera un minuto e inténtalo de nuevo.",
      erroGh: "No se pudo contactar con GitHub (¿sin internet?). La curaduría de arriba sigue funcionando.",
      sugerirTitulo: "¿Falta algo?",
      sugerirTexto: "El acervo es abierto. Sugiere un repositorio, skill o agente y entrará en la próxima revisión.",
      sugerirBotao: "Sugerir en GitHub",
      kit: "Mi kit", recolher: "Contraer", expandir: "Expandir",
      kitCopiar: "Copiar script", kitBaixar: "Descargar script", kitLink: "Copiar enlace del kit", kitLimpar: "Vaciar",
      kitCabeca: "Kit generado por el Acervo DIGITAR", kitRode: "Ejecútalo en la carpeta raíz de tu proyecto.",
      kitPlugins: "Plugins: pega estas líneas dentro de Claude Code",
      remover: "Quitar", linkCopiado: "Enlace del kit copiado", scriptCopiado: "Script copiado",
      falhaCopia: "No se pudo copiar. Selecciona el texto y pulsa Ctrl+C.",
      linkKit: function (n) { return "Este enlace trae " + n + (n === 1 ? " elemento" : " elementos") + " a tu kit. Revísalos antes de ejecutar cualquier comando."; },
      linkSim: "Añadir al kit", linkNao: "Ignorar"
    }
  };
  var LOCAL = { pt: "pt-BR", en: "en", es: "es" };
  var TIPOS = ["repositorio", "skill", "agente", "plugin", "mcp", "lista"];
  var PLURAL = { repositorio: "repositorios", skill: "skills", agente: "agentes", plugin: "plugins", mcp: "mcp", lista: "listas" };

  /* ---------- estado ---------- */
  function ler(chave, padrao) { try { var v = localStorage.getItem("acervo." + chave); return v == null ? padrao : JSON.parse(v); } catch (e) { return padrao; } }
  function gravar(chave, valor) { try { localStorage.setItem("acervo." + chave, JSON.stringify(valor)); } catch (e) { /* modo privado */ } }

  var params = new URLSearchParams(location.search);
  function idiomaInicial() {
    var p = params.get("lang"); if (p && T[p]) return p;
    var g = ler("lang", null); if (g && T[g]) return g;
    var n = (navigator.language || "pt").slice(0, 2).toLowerCase();
    return T[n] ? n : "en";
  }
  var estado = {
    lang: idiomaInicial(),
    q: params.get("q") || "",
    tipo: TIPOS.indexOf(params.get("tipo")) >= 0 ? params.get("tipo") : "tudo",
    destino: ler("destino", "projeto"),
    livre: ler("livre", "./.claude"),
    shell: ler("shell", /win/i.test(navigator.platform || navigator.userAgent) ? "ps" : "bash"),
    formato: {},
    kit: [] // [{id, item}]: refeito do catálogo ao carregar; nada salvo no navegador vira comando sem conferência
  };
  function t(k) { return T[estado.lang][k] != null ? T[estado.lang][k] : T.pt[k]; }

  var catalogo = null, itens = [], porId = {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function compacto(n) { try { return new Intl.NumberFormat(LOCAL[estado.lang], { notation: "compact", maximumFractionDigits: 1 }).format(n); } catch (e) { return String(n); } }
  function data(iso) { if (!iso) return ""; try { return new Intl.DateTimeFormat(LOCAL[estado.lang], { dateStyle: "medium" }).format(new Date(iso + "T12:00:00")); } catch (e) { return iso; } }
  function idDe(i) { return i.tipo + ":" + i.repo + (i.caminho ? "/" + i.caminho : (i.tipo === "plugin" || i.tipo === "mcp") ? "#" + i.nome : ""); }
  function info(i) { return (catalogo && catalogo.repos && catalogo.repos[i.repo]) || i.gh || {}; }
  // tudo que entra num comando só pode ter letras, números e . _ / @ - (nada de ; $ ` | & espaço)
  var SEGURO = /^[\w.\/@-]+$/;
  function ramo(i) { var r = info(i).ramo; return r && SEGURO.test(r) ? r : "HEAD"; }
  function itemSeguro(i) {
    // o nome só vira pasta ou arquivo em skill, agente e plugin; em repositório e lista é só o título do cartão
    var nomeNoComando = i && (i.tipo === "skill" || i.tipo === "agente" || i.tipo === "plugin");
    return !!i && SEGURO.test(i.repo || "") && (!nomeNoComando || SEGURO.test(i.nome || "")) &&
      (!i.caminho || SEGURO.test(i.caminho)) && (!i.mercado || SEGURO.test(i.mercado));
  }
  function urlGitHub(i) {
    var b = "https://github.com/" + i.repo;
    if (!i.caminho) return b;
    return b + (i.tipo === "agente" ? "/blob/" : "/tree/") + ramo(i) + "/" + i.caminho;
  }
  // pasta escolhida pela pessoa: aspas simples, que nem bash nem PowerShell expandem ($(...), `...`)
  function aspas(p) {
    if (/^(\$HOME\/|~\/)?[\w.\/@:+-]+$/.test(p)) return p;
    return estado.shell === "ps" ? "'" + p.replace(/'/g, "''") + "'" : "'" + p.replace(/'/g, "'\\''") + "'";
  }

  /* ---------- comandos ---------- */
  function pastaBase() {
    if (estado.destino === "usuario") return estado.shell === "ps" ? "$HOME/.claude" : "~/.claude";
    if (estado.destino === "livre") return (estado.livre || ".").replace(/[\\/]+$/, "");
    return ".claude";
  }
  function formatos(i) {
    var ps = estado.shell === "ps", git = "https://github.com/" + i.repo + ".git", nome = i.repo.split("/")[1];
    if (i.tipo === "repositorio" || i.tipo === "lista") return [
      { id: "clone", rotulo: t("clonar"), cmd: "git clone --depth 1 " + git, nota: t("notaRepo") },
      { id: "degit", rotulo: t("degit"), cmd: "npx degit " + i.repo + " " + nome, nota: t("notaRepo") },
      { id: "sub", rotulo: t("submodulo"), cmd: "git submodule add " + git + " vendor/" + nome, nota: t("notaRepo") }
    ];
    if (i.tipo === "skill") {
      var destino = pastaBase() + "/skills/" + i.nome, pai = pastaBase() + "/skills";
      var sparse = ps
        ? "$t = Join-Path $env:TEMP ([guid]::NewGuid()); git clone --depth 1 --filter=blob:none --sparse " + git + " $t; git -C $t sparse-checkout set " + i.caminho +
          "; New-Item -ItemType Directory -Force " + aspas(pai) + " | Out-Null; Copy-Item -Recurse \"$t/" + i.caminho + "\" " + aspas(destino) + "; Remove-Item -Recurse -Force $t"
        : "t=$(mktemp -d) && git clone --depth 1 --filter=blob:none --sparse " + git + " \"$t\" && git -C \"$t\" sparse-checkout set " + i.caminho +
          " && mkdir -p " + aspas(pai) + " && cp -r \"$t/" + i.caminho + "\" " + aspas(destino) + " && rm -rf \"$t\"";
      return [
        { id: "degit", rotulo: t("degit"), cmd: "npx degit " + i.repo + "/" + i.caminho + "#" + ramo(i) + " " + aspas(destino), nota: t("notaSkill") },
        { id: "sparse", rotulo: t("sparse"), cmd: sparse, nota: t("notaSkill") }
      ];
    }
    if (i.tipo === "agente") {
      var arq = pastaBase() + "/agents/" + i.nome + ".md", dir = pastaBase() + "/agents";
      var bruto = "https://raw.githubusercontent.com/" + i.repo + "/" + ramo(i) + "/" + i.caminho;
      return [{
        id: "baixar", rotulo: t("baixarArquivo"), nota: t("notaAgente"),
        cmd: ps
          ? "New-Item -ItemType Directory -Force " + aspas(dir) + " | Out-Null; Invoke-WebRequest " + bruto + " -OutFile " + aspas(arq)
          : "mkdir -p " + aspas(dir) + " && curl -fsSL " + bruto + " -o " + aspas(arq)
      }];
    }
    if (i.tipo === "mcp") {
      var escopo = estado.destino === "projeto" ? "--scope project " : estado.destino === "usuario" ? "--scope user " : "";
      return [{ id: "mcp", rotulo: t("adicionar"), cmd: i.comando.replace(/^claude mcp add /, "claude mcp add " + escopo), nota: t("notaMcp") }];
    }
    if (i.tipo === "plugin") return [{
      id: "plugin", rotulo: t("noClaude"), nota: t("noClaude") + ".",
      cmd: "/plugin marketplace add " + i.repo + "\n/plugin install " + i.nome + "@" + i.mercado
    }];
    return [];
  }
  function formatoEscolhido(i) {
    var lista = formatos(i), id = estado.formato[idDe(i)];
    for (var k = 0; k < lista.length; k++) if (lista[k].id === id) return lista[k];
    return lista[0];
  }

  /* ---------- busca na curadoria ---------- */
  function pontuar(q) {
    var nq = norm(q), achados = {};
    if (!nq) return null;
    var palavras = nq.split(" ").filter(function (p) { return p.length > 1; });
    function marcar(i, p) { var id = idDe(i); if (!achados[id] || achados[id].p < p) achados[id] = { i: i, p: p }; }
    catalogo.temas.forEach(function (tema) {
      var chaves = [tema.id].concat(tema.apelidos, [tema.nome.pt, tema.nome.en, tema.nome.es]).map(norm);
      var p = 0;
      chaves.forEach(function (c) {
        if (c === nq) p = Math.max(p, 100);
        else if (nq.length >= 3 && (c.indexOf(nq) === 0 || nq.indexOf(c) >= 0 && c.length >= 3)) p = Math.max(p, 60);
        else if (palavras.some(function (w) { return w.length >= 3 && c === w; })) p = Math.max(p, 50);
      });
      if (p) tema.itens.forEach(function (i) { marcar(i, p); });
    });
    itens.forEach(function (i) {
      var nome = norm(i.nome + " " + i.repo), desc = norm(i.desc + " " + (info(i).descricao || ""));
      if (nome.indexOf(nq) >= 0) marcar(i, 70);
      else if (palavras.length && palavras.every(function (w) { return nome.indexOf(w) >= 0 || desc.indexOf(w) >= 0; })) marcar(i, nome.indexOf(palavras[0]) >= 0 ? 40 : 20);
    });
    return Object.keys(achados).map(function (k) { return achados[k]; }).sort(function (a, b) {
      return b.p - a.p || (info(b.i).estrelas || 0) - (info(a.i).estrelas || 0);
    }).map(function (x) { return x.i; });
  }
  function destaques() {
    var vistos = {}, lista = [];
    itens.filter(function (i) { return estado.tipo === "tudo" || i.tipo === estado.tipo; }).sort(function (a, b) { return (info(b).estrelas || 0) - (info(a).estrelas || 0); }).forEach(function (i) {
      if (!vistos[idDe(i)]) { vistos[idDe(i)] = 1; lista.push(i); }
    });
    // mistura os tipos para a vitrine não virar só repositórios gigantes
    var porTipo = {}; lista.forEach(function (i) { (porTipo[i.tipo] = porTipo[i.tipo] || []).push(i); });
    var saida = [], rodada = 0;
    while (saida.length < 24 && rodada < 30) {
      TIPOS.forEach(function (tp) { var l = porTipo[tp]; if (l && l[rodada] && saida.length < 24) saida.push(l[rodada]); });
      rodada++;
    }
    return saida;
  }

  /* ---------- desenho ---------- */
  function noKit(id) { return estado.kit.some(function (k) { return k.id === id; }); }
  function cartao(i, aoVivo) {
    var id = idDe(i), g = info(i), f = formatoEscolhido(i), lista = formatos(i);
    var desc = estado.lang === "pt" && i.desc ? i.desc : (g.descricao || i.desc || "");
    var meta = [];
    if (g.estrelas != null) meta.push('<li title="' + esc(g.estrelas.toLocaleString(LOCAL[estado.lang]) + " " + t("estrelas")) + '"><span aria-hidden="true">★</span> ' + compacto(g.estrelas) + '<span class="visualmente-oculto"> ' + t("estrelas") + "</span></li>");
    if (g.licenca) meta.push("<li>" + esc(g.licenca) + "</li>");
    if (g.linguagem) meta.push("<li>" + esc(g.linguagem) + "</li>");
    if (g.atualizado) meta.push("<li>" + t("atualizado") + " " + data(g.atualizado) + "</li>");
    var alertas = "";
    if (g.arquivado) alertas += '<p class="cartao-alerta">' + t("arquivado") + "</p>";
    else if (g.estrelas != null && !g.licenca && (i.tipo === "repositorio" || aoVivo)) alertas += '<p class="cartao-alerta">' + t("semLicenca") + "</p>";
    var abas = lista.length > 1 ? '<div class="comando-abas" role="group">' + lista.map(function (x) {
      return '<button type="button" data-formato="' + x.id + '" aria-pressed="' + (x.id === f.id) + '">' + esc(x.rotulo) + "</button>";
    }).join("") + "</div>" : "";
    return '<article class="cartao" data-id="' + esc(id) + '" data-tipo="' + i.tipo + '">' +
      '<div class="cartao-topo"><span class="selo selo-' + i.tipo + '">' + t(i.tipo) + "</span>" +
      '<button type="button" class="kit-botao" data-kit aria-pressed="' + noKit(id) + '">' + (noKit(id) ? "✓ " + t("noKit") : "+ " + t("porKit")) + "</button></div>" +
      '<h3><a href="' + esc(urlGitHub(i)) + '" target="_blank" rel="noopener">' + esc(i.nome) + "</a></h3>" +
      '<p class="cartao-repo">' + esc(i.repo) + (i.caminho ? '<span class="cartao-caminho">/' + esc(i.caminho) + "</span>" : "") + "</p>" +
      (desc ? '<p class="cartao-desc">' + esc(desc) + "</p>" : "") +
      (meta.length ? '<ul class="cartao-meta">' + meta.join("") + "</ul>" : "") + alertas +
      '<div class="comando">' + abas +
      '<div class="comando-caixa"><pre><code>' + esc(f.cmd) + '</code></pre><button type="button" class="botao pequeno" data-copiar>' + t("copiar") + "</button></div>" +
      '<p class="comando-nota">' + esc(f.nota || "") + "</p></div></article>";
  }

  function traduzirFixos() {
    document.documentElement.lang = LOCAL[estado.lang];
    document.querySelectorAll("[data-t]").forEach(function (el) { var v = t(el.getAttribute("data-t")); if (typeof v === "string") el.textContent = v; });
    $("termo").placeholder = t("placeholder");
    document.querySelectorAll(".acervo-idiomas button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === estado.lang)); });
    $("kit-recolher").textContent = $("kit").classList.contains("fechado") ? t("expandir") : t("recolher");
    var titulo = encodeURIComponent("Acervo: sugestão de recurso"), corpo = encodeURIComponent("Tema:\nRepositório (dono/nome):\nTipo (repositório, skill, agente, plugin, MCP ou lista):\nPor que é um dos melhores:\n");
    $("sugerir").href = "https://github.com/" + REPO_SITE + "/issues/new?title=" + titulo + "&body=" + corpo + "&labels=acervo";
  }

  function segmentos(alvo, opcoes, atual, aoEscolher) {
    alvo.innerHTML = opcoes.map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] === atual) + '">' + esc(o[1]) + "</button>"; }).join("");
    alvo.onclick = function (e) { var b = e.target.closest("button[data-v]"); if (b) aoEscolher(b.getAttribute("data-v")); };
  }
  function desenharAjustes() {
    var contagem = {}; itens.forEach(function (i) { contagem[i.tipo] = (contagem[i.tipo] || 0) + 1; });
    segmentos($("filtro-tipo"), [["tudo", t("tudo")]].concat(TIPOS.map(function (tp) { return [tp, t(PLURAL[tp]) + " " + (contagem[tp] || 0)]; })), estado.tipo,
      function (v) { estado.tipo = v; desenharTudo(); });
    segmentos($("destino"), [["projeto", t("projeto")], ["usuario", t("usuario")], ["livre", t("livre")]], estado.destino,
      function (v) { estado.destino = v; gravar("destino", v); desenharTudo(); if (v === "livre") $("destino-livre").focus(); });
    segmentos($("shell"), [["bash", "bash / zsh"], ["ps", "PowerShell"]], estado.shell,
      function (v) { estado.shell = v; gravar("shell", v); desenharTudo(); });
    $("destino-livre").hidden = estado.destino !== "livre";
    $("destino-livre").value = estado.livre;
  }
  function desenharTemas() {
    var nq = norm(estado.q);
    $("temas").innerHTML = catalogo.temas.map(function (tema) {
      var nome = tema.nome[estado.lang] || tema.nome.pt;
      return '<button type="button" class="tema" data-tema="' + esc(nome) + '" aria-pressed="' + (nq === norm(nome)) + '">' + esc(nome) + ' <span>' + tema.itens.length + "</span></button>";
    }).join("");
  }

  var listaAtual = [];
  function desenharResultados() {
    var q = estado.q.trim(), achados = q ? pontuar(q) : destaques();
    listaAtual = achados.filter(function (i) { return estado.tipo === "tudo" || i.tipo === estado.tipo; });
    $("resultados").innerHTML = listaAtual.map(function (i) { return cartao(i, false); }).join("");
    if (!q) $("resumo").textContent = t("destaques") + " " + t("conferido")(itens.length, Object.keys(catalogo.repos || {}).length, data(catalogo.atualizado));
    else if (listaAtual.length) $("resumo").textContent = t("achados")(listaAtual.length, q);
    else $("resumo").textContent = t("nada")(q);
  }
  function desenharTudo() {
    traduzirFixos(); desenharAjustes(); desenharTemas(); desenharResultados(); desenharAoVivo(); desenharKit();
    var p = new URLSearchParams();
    if (estado.q.trim()) p.set("q", estado.q.trim());
    if (estado.tipo !== "tudo") p.set("tipo", estado.tipo);
    if (params.get("lang")) p.set("lang", estado.lang);
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "") + location.hash);
  }

  /* ---------- busca ao vivo no GitHub ---------- */
  var aoVivo = { q: "", itens: [], estado: "" };
  var vivosPorId = {};
  function buscarNoGitHub(q) {
    q = q.trim();
    if (q.length < 2 || q === aoVivo.q) return;
    aoVivo = { q: q, itens: [], estado: "buscando" }; desenharAoVivo();
    var chave = "acervo.gh." + norm(q), guardado = null;
    try { guardado = JSON.parse(sessionStorage.getItem(chave) || "null"); } catch (e) { /* sem sessionStorage */ }
    var promessa = guardado ? Promise.resolve(guardado) : fetch("https://api.github.com/search/repositories?per_page=12&sort=stars&order=desc&q=" +
      encodeURIComponent(q + " stars:>50 archived:false"), { headers: { Accept: "application/vnd.github+json" } }).then(function (r) {
        if (r.status === 403 || r.status === 429) throw new Error("limite");
        if (!r.ok) throw new Error("http");
        return r.json();
      }).then(function (j) {
        var l = (j.items || []).map(function (r) {
          return { tipo: "repositorio", repo: r.full_name, nome: r.name, desc: "", gh: {
            estrelas: r.stargazers_count, descricao: r.description || "", licenca: r.license && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
            linguagem: r.language, atualizado: (r.pushed_at || "").slice(0, 10), ramo: r.default_branch, arquivado: r.archived } };
        });
        try { sessionStorage.setItem(chave, JSON.stringify(l)); } catch (e) { /* cheio */ }
        return l;
      });
    promessa.then(function (l) {
      if (aoVivo.q !== q) return;
      var curados = {}; itens.forEach(function (i) { curados[i.repo.toLowerCase()] = 1; });
      aoVivo.itens = l.filter(function (i) { return !curados[i.repo.toLowerCase()] && itemSeguro(i); });
      aoVivo.itens.forEach(function (i) { vivosPorId[idDe(i)] = i; });
      aoVivo.estado = aoVivo.itens.length ? "ok" : "vazio"; desenharAoVivo();
    }).catch(function (e) {
      if (aoVivo.q !== q) return;
      aoVivo.estado = e.message === "limite" ? "limite" : "erro"; aoVivo.q = ""; aoVivo.ultimo = q; desenharAoVivo();
    });
  }
  function desenharAoVivo() {
    var mostrar = !!estado.q.trim() && (estado.tipo === "tudo" || estado.tipo === "repositorio") && !!aoVivo.estado;
    $("ao-vivo").hidden = !mostrar;
    if (!mostrar) return;
    $("ao-vivo-estado").textContent = { buscando: t("buscandoGh"), vazio: t("semGh"), limite: t("limiteGh"), erro: t("erroGh"), ok: "" }[aoVivo.estado] || "";
    $("ao-vivo-lista").innerHTML = aoVivo.estado === "ok" ? aoVivo.itens.map(function (i) { return cartao(i, true); }).join("") : "";
  }

  /* ---------- kit ---------- */
  function itemPorId(id) {
    if (porId[id]) return porId[id];
    if (vivosPorId[id]) return vivosPorId[id];
    var m = /^repositorio:([\w.-]+\/[\w.-]+)$/.exec(id); // repositório de fora da curadoria, vindo de um link
    return m ? { tipo: "repositorio", repo: m[1], nome: m[1].split("/")[1], desc: "" } : null;
  }
  function alternarKit(id) {
    if (noKit(id)) estado.kit = estado.kit.filter(function (k) { return k.id !== id; });
    else { var i = itemPorId(id); if (i) estado.kit.push({ id: id, item: i }); }
    gravar("kit", estado.kit);
    document.querySelectorAll('.cartao[data-id="' + CSS.escape(id) + '"] [data-kit]').forEach(function (b) {
      var sim = noKit(id); b.setAttribute("aria-pressed", String(sim)); b.textContent = sim ? "✓ " + t("noKit") : "+ " + t("porKit");
    });
    desenharKit();
  }
  function desenharKit() {
    var kit = $("kit");
    kit.hidden = !estado.kit.length;
    document.body.classList.toggle("com-kit", !!estado.kit.length);
    $("kit-conta").textContent = estado.kit.length;
    $("kit-lista").innerHTML = estado.kit.map(function (k) {
      return '<li><span class="selo selo-' + esc(k.item.tipo) + '">' + t(k.item.tipo) + "</span> <b>" + esc(k.item.nome) + '</b> <button type="button" data-remover="' + esc(k.id) + '" aria-label="' + esc(t("remover") + " " + k.item.nome) + '">×</button></li>';
    }).join("");
  }
  function scriptDoKit() {
    var ps = estado.shell === "ps", linhas = [], plugins = [];
    if (ps) linhas.push("# " + t("kitCabeca") + " (" + new Date().toISOString().slice(0, 10) + ")", "# " + t("kitRode"), '$ErrorActionPreference = "Stop"', "");
    else linhas.push("#!/usr/bin/env bash", "# " + t("kitCabeca") + " (" + new Date().toISOString().slice(0, 10) + ")", "# " + t("kitRode"), "set -euo pipefail", "");
    estado.kit.forEach(function (k) {
      var i = k.item;
      if (i.tipo === "plugin") { plugins.push(formatos(i)[0].cmd); return; }
      // no script, a opção que só precisa de git (sem Node) é a mais garantida
      var lista = formatos(i), f = lista.filter(function (x) { return x.id === "clone" || x.id === "sparse"; })[0] || lista[0];
      linhas.push((ps ? 'Write-Host "-> ' : 'echo "-> ') + i.nome.replace(/"/g, "") + ' (' + i.repo + ')"', f.cmd, "");
    });
    if (plugins.length) {
      linhas.push("# " + t("kitPlugins") + ":");
      plugins.join("\n").split("\n").forEach(function (l) { linhas.push("#   " + l); });
    }
    return linhas.join("\n") + "\n";
  }

  /* ---------- copiar ---------- */
  var timerAviso;
  function avisar(msg) { var a = $("aviso"); a.textContent = msg; a.classList.add("visivel"); clearTimeout(timerAviso); timerAviso = setTimeout(function () { a.classList.remove("visivel"); }, 2200); }
  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto);
    return new Promise(function (ok, falha) {
      var ta = document.createElement("textarea"); ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? ok() : falha(); } catch (e) { falha(e); } finally { ta.remove(); }
    });
  }

  /* ---------- eventos ---------- */
  function ligar() {
    var termo = $("termo"), espera;
    termo.value = estado.q;
    termo.addEventListener("input", function () {
      estado.q = termo.value; desenharTudo();
      clearTimeout(espera);
      // procura no GitHub sozinho quando a curadoria tem pouco para mostrar
      espera = setTimeout(function () { if (estado.q.trim().length >= 3 && listaAtual.length < 6) buscarNoGitHub(estado.q); }, 800);
    });
    $("busca").addEventListener("submit", function (e) { e.preventDefault(); clearTimeout(espera); estado.q = termo.value; desenharTudo(); buscarNoGitHub(estado.q); });
    $("temas").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tema]"); if (!b) return;
      estado.q = b.getAttribute("data-tema"); termo.value = estado.q; desenharTudo();
      $("resumo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("destino-livre").addEventListener("input", function (e) { estado.livre = e.target.value; gravar("livre", estado.livre); desenharResultados(); });
    document.querySelector(".acervo-idiomas").addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]"); if (!b) return;
      estado.lang = b.getAttribute("data-lang"); gravar("lang", estado.lang); desenharTudo();
    });
    document.querySelector("main").addEventListener("click", function (e) {
      var c = e.target.closest(".cartao"); if (!c) return;
      var id = c.getAttribute("data-id"), i = itemPorId(id); if (!i) return;
      var fb = e.target.closest("[data-formato]");
      if (fb) {
        estado.formato[id] = fb.getAttribute("data-formato");
        var vivo = !!c.closest("#ao-vivo"), novo = document.createElement("div");
        novo.innerHTML = cartao(i, vivo); c.replaceWith(novo.firstChild); return;
      }
      if (e.target.closest("[data-kit]")) { alternarKit(id); return; }
      var cb = e.target.closest("[data-copiar]");
      if (cb) copiar(formatoEscolhido(i).cmd).then(function () {
        cb.textContent = "✓ " + t("copiado"); cb.classList.add("feito");
        setTimeout(function () { cb.textContent = t("copiar"); cb.classList.remove("feito"); }, 1600);
      }, function () { avisar(t("falhaCopia")); });
    });
    $("kit-lista").addEventListener("click", function (e) { var b = e.target.closest("[data-remover]"); if (b) alternarKit(b.getAttribute("data-remover")); });
    $("kit-copiar").addEventListener("click", function () { copiar(scriptDoKit()).then(function () { avisar(t("scriptCopiado")); }, function () { avisar(t("falhaCopia")); }); });
    $("kit-baixar").addEventListener("click", function () {
      var blob = new Blob([scriptDoKit()], { type: "text/plain;charset=utf-8" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = estado.shell === "ps" ? "kit-acervo.ps1" : "kit-acervo.sh";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    $("kit-link").addEventListener("click", function () {
      var u = new URL(location.href); u.search = ""; u.searchParams.set("kit", estado.kit.map(function (k) { return k.id; }).join(","));
      copiar(u.href).then(function () { avisar(t("linkCopiado")); }, function () { avisar(t("falhaCopia")); });
    });
    $("kit-limpar").addEventListener("click", function () { estado.kit = []; gravar("kit", []); desenharResultados(); desenharKit(); });
    $("kit-recolher").addEventListener("click", function () {
      var fechado = $("kit").classList.toggle("fechado");
      $("kit-recolher").setAttribute("aria-expanded", String(!fechado)); $("kit-recolher").textContent = fechado ? t("expandir") : t("recolher");
    });
    // "/" leva à busca, como em boa parte dos sites de código
    document.addEventListener("keydown", function (e) {
      var alvo = e.target, digitando = alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName));
      if (e.key === "/" && !digitando && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); termo.focus(); termo.select(); }
    });
  }

  /* ---------- início ---------- */
  fetch(new URL("acervo/catalogo.json", BASE), { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error("HTTP " + r.status); return r.json();
  }).then(function (c) {
    catalogo = c;
    c.temas.forEach(function (tema) { tema.itens.forEach(function (i) { var id = idDe(i); if (!porId[id] && itemSeguro(i)) { porId[id] = i; itens.push(i); } }); });
    // kit vindo de um link compartilhado: soma ao kit salvo
    var doLink = params.get("kit");
    // kit salvo e kit de link: só entram ids do catálogo (ou repositório com nome válido), refeitos daqui
    function somarAoKit(id) {
      if (typeof id !== "string" || id.length > 300 || noKit(id)) return;
      var i = itemPorId(id); if (i && itemSeguro(i)) estado.kit.push({ id: id, item: i });
    }
    var salvo = ler("kit", []);
    (Array.isArray(salvo) ? salvo : []).forEach(function (k) { somarAoKit(k && k.id); });
    gravar("kit", estado.kit);
    // kit vindo de um link: só entra se a pessoa confirmar (um link não muda o kit sozinho)
    var doLinkIds = doLink ? doLink.split(",").slice(0, 50).filter(function (id) { var i = itemPorId(id); return i && itemSeguro(i) && !noKit(id); }) : [];
    if (doLinkIds.length) {
      var aviso = document.createElement("div");
      aviso.className = "kit-convite"; aviso.setAttribute("role", "region");
      aviso.innerHTML = "<p>" + esc(t("linkKit")(doLinkIds.length)) + "</p><ul>" + doLinkIds.map(function (id) { var i = itemPorId(id); return "<li><b>" + esc(i.nome) + "</b> <span>" + esc(i.repo) + "</span></li>"; }).join("") +
        '</ul><div class="botoes"><button type="button" class="botao pequeno" data-sim>' + esc(t("linkSim")) + '</button><button type="button" class="botao pequeno secundario" data-nao>' + esc(t("linkNao")) + "</button></div>";
      $("busca").parentNode.insertBefore(aviso, $("busca"));
      aviso.querySelector("[data-sim]").onclick = function () { doLinkIds.forEach(somarAoKit); gravar("kit", estado.kit); aviso.remove(); desenharResultados(); desenharKit(); };
      aviso.querySelector("[data-nao]").onclick = function () { aviso.remove(); };
    }
    // no celular a gaveta do kit começa recolhida, para não cobrir os cartões
    if (window.matchMedia("(max-width: 620px)").matches) { $("kit").classList.add("fechado"); $("kit-recolher").setAttribute("aria-expanded", "false"); }
    ligar(); desenharTudo();
    if (estado.q.trim().length >= 3 && listaAtual.length < 6) buscarNoGitHub(estado.q);
  }).catch(function () {
    $("resumo").textContent = "Não foi possível carregar o acervo (acervo/catalogo.json). Abra o site por um servidor, não direto do arquivo.";
  });
})();
