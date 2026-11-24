/* DIGITAR — service worker (gerado por ferramentas/pwa.mjs; não edite à mão)
   versão bf994b2589b0: muda sozinha quando qualquer arquivo de site/ muda. */
"use strict";
const VERSAO = "bf994b2589b0";
const CACHE = "digitar-" + VERSAO;
const CACHE_EXTERNO = "digitar-externo";          // Pyodide e fontes: guardados no primeiro uso
const ARQUIVOS = ["./","404.html","acervo.html","acervo/catalogo.json","app/index.html","assets/acervo.css","assets/acervo.js","assets/apple-touch-icon.png","assets/captura-larga.png","assets/digitar-256.png","assets/digitar-32.png","assets/digitar-horizontal.svg","assets/digitar.svg","assets/estilo.css","assets/pwa-192.png","assets/pwa-512.png","assets/pwa-maskable-192.png","assets/pwa-maskable-512.png","assets/python.js","assets/site.js","baixar.html","como-aprender.html","index.html","manifest.webmanifest","programar.html","python/01-o-que-e-python.html","python/02-instalando-python.html","python/03-primeiro-programa.html","python/04-comentarios-docstrings.html","python/05-ambiente-moderno.html","python/06-lendo-mensagens-de-erro.html","python/10-print.html","python/100-name-main.html","python/101-datetime.html","python/102-timedelta-strftime.html","python/103-os-pathlib.html","python/104-shutil.html","python/105-json-avancado.html","python/106-csv.html","python/107-random-secrets.html","python/108-string-template.html","python/109-email-smtp.html","python/11-tipos-str.html","python/110-argumentos-linha-comando.html","python/111-requests.html","python/112-web-scraping.html","python/113-selenium.html","python/114-subprocess.html","python/115-jupyter.html","python/116-pdf.html","python/117-deque.html","python/118-excel-openpyxl.html","python/119-imagens-pillow.html","python/12-tipos-numeros-bool.html","python/13-conversao-tipos.html","python/130-por-que-testar.html","python/131-unittest.html","python/132-tdd-na-pratica.html","python/133-mocks.html","python/134-pytest.html","python/14-variaveis.html","python/140-regex-intro.html","python/141-regex-meta.html","python/142-regex-grupos.html","python/143-regex-ancoras-flags.html","python/144-regex-lookaround.html","python/145-regex-projeto.html","python/15-operadores-aritmeticos.html","python/150-solid.html","python/151-criacionais.html","python/152-estruturais.html","python/153-comportamentais.html","python/16-formatacao-strings.html","python/17-input.html","python/170-sql-intro.html","python/171-sql-crud.html","python/172-sql-filtros.html","python/173-sql-relacoes.html","python/174-sqlite3.html","python/175-placeholders.html","python/176-mysql-pymysql.html","python/177-env-segredos.html","python/18-if-elif-else.html","python/19-operadores-relacionais-logicos.html","python/190-pyside6-intro.html","python/191-layouts-janela.html","python/192-sinais-slots.html","python/193-calculadora.html","python/194-qt-designer.html","python/195-qthread.html","python/196-pyinstaller.html","python/20-fatiamento-len.html","python/200-django-intro.html","python/201-urls-views.html","python/202-templates.html","python/203-models-admin.html","python/204-querysets.html","python/205-forms.html","python/206-usuarios-login.html","python/207-projeto-agenda.html","python/21-none-is-id.html","python/210-docker.html","python/211-projeto-blog.html","python/215-projeto-loja.html","python/22-while.html","python/220-deploy.html","python/225-api-rest.html","python/23-atribuicao-composta.html","python/24-for-range.html","python/240-terminal.html","python/241-html.html","python/242-css.html","python/243-landing-page.html","python/244-git-github.html","python/249-proximos-passos.html","python/25-listas.html","python/26-mutaveis-copy.html","python/27-tuplas-enumerate.html","python/28-split-join-strip.html","python/29-float-decimal.html","python/30-ternario.html","python/31-projeto-cpf.html","python/32-projeto-jogo-de-adivinhacao.html","python/40-funcoes.html","python/41-argumentos.html","python/42-escopo.html","python/43-args-kwargs.html","python/44-parametros-especiais.html","python/45-funcoes-primeira-classe.html","python/46-dicionarios.html","python/47-copia-rasa-profunda.html","python/48-sets.html","python/49-lambda.html","python/50-comprehensions.html","python/51-truthy-falsy.html","python/52-geradores.html","python/53-excecoes.html","python/54-modulos.html","python/55-pacotes.html","python/56-decoradores.html","python/57-itertools.html","python/58-map-filter-reduce.html","python/59-recursao.html","python/60-venv-pip.html","python/61-arquivos.html","python/62-json.html","python/63-guard-clause.html","python/64-pep8-e-bons-nomes.html","python/65-organizacao-de-projeto.html","python/66-depuracao.html","python/67-projeto-analisador-de-texto.html","python/68-projeto-treino-de-digitacao.html","python/69-projeto-intermediario.html","python/70-classes.html","python/71-atributos-metodos.html","python/72-classmethod-staticmethod.html","python/73-property.html","python/74-encapsulamento.html","python/75-associacao-agregacao-composicao.html","python/76-heranca.html","python/77-heranca-multipla.html","python/78-classes-abstratas.html","python/79-polimorfismo.html","python/80-excecoes-proprias.html","python/81-metodos-especiais.html","python/82-new-init.html","python/83-context-manager.html","python/84-decoradores-classes.html","python/85-metaclasses.html","python/86-documentacao.html","python/87-enum.html","python/88-dataclasses.html","python/89-namedtuple.html","python/90-colecoes-proprias.html","python/91-type-hints.html","python/92-match-case.html","python/93-projeto-agenda-de-contatos.html","python/99-projeto-poo.html","python/aulas.json","python/index.html","python/trechos.json","app/","python/"];
const EXTERNOS = [/^https:\/\/cdn\.jsdelivr\.net\/pyodide\//, /^https:\/\/fonts\.(googleapis|gstatic)\.com\//];

self.addEventListener("install", evento => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // um por um: se um arquivo falhar, os outros continuam (e ele é buscado na rede depois)
    await Promise.all(ARQUIVOS.map(a => cache.add(new Request(a, { cache: "reload" })).catch(() => {})));
    // a primeira instalação já assume sozinha; uma atualização espera o aluno clicar em "Atualizar"
    // (mensagem "pular-espera"), para não trocar os arquivos no meio de uma lição
  })());
});

self.addEventListener("message", evento => { if (evento.data === "pular-espera") self.skipWaiting(); });

self.addEventListener("activate", evento => {
  evento.waitUntil((async () => {
    for (const nome of await caches.keys())
      if (nome.startsWith("digitar-") && nome !== CACHE && nome !== CACHE_EXTERNO) await caches.delete(nome);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable().catch(() => {});
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;
  const url = new URL(pedido.url);

  if (url.origin === location.origin) {
    if (!url.pathname.startsWith(new URL("./", location).pathname)) return;
    evento.respondWith(local(evento, url));
    return;
  }
  if (EXTERNOS.some(re => re.test(pedido.url))) evento.respondWith(externo(pedido));
  // o resto (contador de visitas e afins) vai direto para a rede
});

// páginas e arquivos do site: primeiro o cache (abre sem internet), a rede só para o que faltar
async function local(evento, url) {
  const cache = await caches.open(CACHE);
  const chave = url.origin + url.pathname;                 // ignora ?origem=pwa e afins
  const guardado = await cache.match(chave) || (url.pathname.endsWith("/") && await cache.match(chave + "index.html"));
  if (guardado) return guardado;
  try {
    const resposta = (evento.preloadResponse && await evento.preloadResponse) || await fetch(evento.request);
    if (resposta.ok && resposta.type === "basic") cache.put(chave, resposta.clone());
    return resposta;
  } catch (erro) {
    if (evento.request.mode === "navigate")
      return (await cache.match(new URL("404.html", location).href)) || (await cache.match(new URL("./", location).href)) || Response.error();
    return Response.error();
  }
}

// Pyodide e fontes: arquivos com versão no endereço, então o cache vale para sempre
async function externo(pedido) {
  const cache = await caches.open(CACHE_EXTERNO);
  const guardado = await cache.match(pedido);
  if (guardado) return guardado;
  const resposta = await fetch(pedido);
  if (resposta.ok || resposta.type === "opaque") cache.put(pedido, resposta.clone()).catch(() => {});
  return resposta;
}
