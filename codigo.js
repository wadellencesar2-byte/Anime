/* =============================================================================
   ██████████████████████████████████████████████████████████████████████████
   codigo.js — MOTOR DE GERAÇÃO DE CÓDIGO DA WC DEV IA
   ██████████████████████████████████████████████████████████████████████████

   LEIA ISTO PRIMEIRO — importante:
   Isto NÃO é uma inteligência artificial de verdade que escreve qualquer
   código do zero. É uma biblioteca de SITES E COMPONENTES PRONTOS, de
   verdade, funcionais — que são personalizados (nome, assunto) e
   devolvidos como código real que você pode copiar e usar. A "IA" aqui
   reconhece o que você pediu e escolhe/monta o template certo. Ela não
   inventa um site totalmente novo pra qualquer ideia maluca que você
   descrever — ela sabe montar bem um conjunto específico de coisas
   (veja a lista abaixo), com o nome/tema que você pedir.

   O QUE ELA SABE MONTAR:
   Sites completos: landing page, portfólio, cardápio de restaurante,
   currículo online, página de evento, página de contato.
   Componentes soltos: menu de navegação, rodapé, seção hero, grade de
   cards, FAQ (perguntas frequentes), formulário de contato, tabela de
   preços, depoimentos, galeria de imagens, contador regressivo,
   calculadora, lista de tarefas, botão de modo escuro, menu hambúrguer,
   janela modal.
   Também explica conceitos: flexbox, grid, centralizar uma div, box
   model, eventos de clique, variáveis/funções em JS, localStorage, etc.

   COMO ENSINAR MAIS TEMPLATES:
   Copie um bloco de SITE_TEMPLATES ou COMPONENTS e adicione o seu,
   seguindo o mesmo formato (keywords + função build que devolve o
   código como texto).
   ============================================================================= */

function _codigoNormalize(text) {
  return text.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[.,!?;:()"'`]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// Tenta achar o "assunto" que a pessoa quer no site (nome da empresa, do
// evento, da pessoa etc.), procurando por "para X", "de X", "chamado X",
// "sobre X" na mensagem ORIGINAL (preserva maiúsculas).
function extrairAssunto(message, padrao) {
  const m = message.match(/(?:para a|para o|para|de|do|da|sobre|chamad[oa])\s+(.+)/i);
  if (m) {
    let assunto = m[1].trim().replace(/[.!?]+$/, '');
    if (assunto.length > 2 && assunto.length < 60) return assunto;
  }
  return padrao;
}


/* =============================================================================
   SITES COMPLETOS
   ============================================================================= */

const SITE_TEMPLATES = [

  {
    id: 'landing',
    keywords: ['landing page', 'pagina de vendas', 'site de vendas', 'pagina de venda'],
    defaultTopic: 'Minha Empresa',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>
:root{--accent:#2563eb;--dark:#0f172a;--muted:#64748b;--bg:#ffffff;--soft:#f1f5f9;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);line-height:1.6;}
.container{max-width:1100px;margin:0 auto;padding:0 24px;}
header{padding:20px 0;border-bottom:1px solid #e2e8f0;}
header .container{display:flex;justify-content:space-between;align-items:center;}
.logo{font-weight:800;font-size:20px;}
nav a{margin-left:28px;text-decoration:none;color:var(--dark);font-size:14px;}
.hero{padding:100px 0 80px;text-align:center;background:linear-gradient(180deg,var(--soft),var(--bg));}
.hero h1{font-size:44px;font-weight:800;margin-bottom:18px;max-width:700px;margin-left:auto;margin-right:auto;}
.hero p{color:var(--muted);font-size:18px;max-width:560px;margin:0 auto 32px;}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;border:none;font-size:16px;cursor:pointer;}
.btn:hover{opacity:.9;}
.features{padding:80px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:32px;}
.feature{padding:28px;border:1px solid #e2e8f0;border-radius:12px;}
.feature .icon{width:44px;height:44px;background:var(--soft);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px;}
.feature h3{font-size:18px;margin-bottom:8px;}
.feature p{color:var(--muted);font-size:14px;}
.cta{background:var(--dark);color:#fff;padding:70px 0;text-align:center;}
.cta h2{font-size:30px;margin-bottom:20px;}
footer{padding:32px 0;text-align:center;color:var(--muted);font-size:13px;}
@media(max-width:720px){.features{grid-template-columns:1fr;}.hero h1{font-size:32px;}nav{display:none;}}
</style>
</head>
<body>
<header><div class="container">
  <div class="logo">${topic}</div>
  <nav><a href="#features">Recursos</a><a href="#cta">Contato</a></nav>
</div></header>

<section class="hero"><div class="container">
  <h1>${topic} — a solução que você estava procurando</h1>
  <p>Descrição curta e direta sobre o que ${topic} resolve pra quem visita essa página.</p>
  <a class="btn" href="#cta">Começar agora</a>
</div></section>

<section class="features" id="features"><div class="container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
  <div class="feature"><div class="icon">⚡</div><h3>Rápido</h3><p>Explique aqui o primeiro grande benefício do que você oferece.</p></div>
  <div class="feature"><div class="icon">🔒</div><h3>Confiável</h3><p>Explique aqui o segundo benefício — o que dá segurança pro cliente.</p></div>
  <div class="feature"><div class="icon">💡</div><h3>Simples</h3><p>Explique aqui o terceiro benefício — o que facilita a vida de quem usa.</p></div>
</div></section>

<section class="cta" id="cta"><div class="container">
  <h2>Pronto pra começar com ${topic}?</h2>
  <a class="btn" href="mailto:contato@exemplo.com">Fale conosco</a>
</div></section>

<footer><div class="container">© ${new Date().getFullYear()} ${topic}. Todos os direitos reservados.</div></footer>
</body>
</html>`; }
  },

  {
    id: 'portfolio',
    keywords: ['portfolio', 'meu portfolio', 'site portfolio', 'portfolio pessoal', 'site pessoal'],
    defaultTopic: 'Seu Nome',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic} — Portfólio</title>
<style>
:root{--accent:#7c3aed;--dark:#111827;--muted:#6b7280;--bg:#ffffff;--soft:#f5f3ff;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);}
.container{max-width:960px;margin:0 auto;padding:0 24px;}
header{padding:80px 0 50px;text-align:center;}
header h1{font-size:38px;font-weight:800;}
header p{color:var(--accent);font-size:16px;margin-top:8px;font-weight:600;}
header .bio{color:var(--muted);max-width:520px;margin:18px auto 0;font-size:15px;}
section{padding:50px 0;}
h2{font-size:24px;margin-bottom:24px;}
.projects{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}
.project{border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;}
.project .thumb{height:150px;background:var(--soft);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:28px;}
.project .info{padding:18px;}
.project h3{font-size:16px;margin-bottom:6px;}
.project p{font-size:13.5px;color:var(--muted);}
.contact{background:var(--dark);color:#fff;text-align:center;padding:60px 0;}
.contact a{color:#fff;background:var(--accent);padding:12px 26px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600;}
footer{text-align:center;padding:28px 0;color:var(--muted);font-size:13px;}
@media(max-width:640px){.projects{grid-template-columns:1fr;}}
</style>
</head>
<body>
<header class="container">
  <h1>${topic}</h1>
  <p>Sua profissão / especialidade aqui</p>
  <p class="bio">Uma breve bio contando quem você é, o que faz e o que te diferencia.</p>
</header>

<section class="container">
  <h2>Projetos</h2>
  <div class="projects">
    <div class="project"><div class="thumb">🎨</div><div class="info"><h3>Nome do projeto 1</h3><p>Breve descrição do que foi feito e as ferramentas usadas.</p></div></div>
    <div class="project"><div class="thumb">💻</div><div class="info"><h3>Nome do projeto 2</h3><p>Breve descrição do que foi feito e as ferramentas usadas.</p></div></div>
    <div class="project"><div class="thumb">📱</div><div class="info"><h3>Nome do projeto 3</h3><p>Breve descrição do que foi feito e as ferramentas usadas.</p></div></div>
    <div class="project"><div class="thumb">🚀</div><div class="info"><h3>Nome do projeto 4</h3><p>Breve descrição do que foi feito e as ferramentas usadas.</p></div></div>
  </div>
</section>

<section class="contact">
  <div class="container">
    <h2 style="color:#fff;">Vamos trabalhar juntos?</h2>
    <a href="mailto:contato@exemplo.com">Entrar em contato</a>
  </div>
</section>

<footer>© ${new Date().getFullYear()} ${topic}</footer>
</body>
</html>`; }
  },

  {
    id: 'cardapio',
    keywords: ['cardapio', 'menu de restaurante', 'cardapio de', 'cardapio para', 'cardapio do restaurante'],
    defaultTopic: 'Meu Restaurante',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cardápio — ${topic}</title>
<style>
:root{--accent:#b45309;--dark:#292524;--muted:#78716c;--bg:#fffbeb;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Georgia,'Times New Roman',serif;background:var(--bg);color:var(--dark);}
.container{max-width:700px;margin:0 auto;padding:60px 24px;}
header{text-align:center;margin-bottom:44px;}
header h1{font-size:36px;color:var(--accent);}
header p{color:var(--muted);margin-top:8px;font-style:italic;}
.categoria{margin-bottom:36px;}
.categoria h2{font-size:20px;color:var(--accent);border-bottom:2px solid var(--accent);padding-bottom:8px;margin-bottom:16px;text-transform:uppercase;letter-spacing:1px;}
.item{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px dashed #e7dfce;}
.item .nome{font-weight:700;}
.item .desc{color:var(--muted);font-size:13.5px;display:block;margin-top:3px;font-family:-apple-system,sans-serif;}
.item .preco{font-weight:700;color:var(--accent);white-space:nowrap;}
footer{text-align:center;color:var(--muted);font-size:13px;margin-top:40px;}
</style>
</head>
<body>
<div class="container">
  <header><h1>${topic}</h1><p>Cardápio</p></header>

  <div class="categoria">
    <h2>Entradas</h2>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
  </div>

  <div class="categoria">
    <h2>Pratos principais</h2>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
  </div>

  <div class="categoria">
    <h2>Sobremesas</h2>
    <div class="item"><div><span class="nome">Nome da sobremesa</span><span class="desc">Breve descrição</span></div><span class="preco">R$ 0,00</span></div>
  </div>

  <footer>${topic} — atualize os pratos e preços editando o código</footer>
</div>
</body>
</html>`; }
  },

  {
    id: 'curriculo',
    keywords: ['curriculo online', 'cv online', 'curriculo digital', 'meu curriculo online'],
    defaultTopic: 'Seu Nome',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Currículo — ${topic}</title>
<style>
:root{--accent:#0f766e;--dark:#1f2937;--muted:#6b7280;--soft:#f0fdfa;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);background:#fff;}
.container{max-width:760px;margin:0 auto;padding:50px 24px;}
header{border-bottom:3px solid var(--accent);padding-bottom:20px;margin-bottom:30px;}
header h1{font-size:32px;}
header .cargo{color:var(--accent);font-weight:600;margin-top:4px;}
header .contato{color:var(--muted);font-size:13.5px;margin-top:10px;}
section{margin-bottom:28px;}
section h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;color:var(--accent);margin-bottom:14px;}
.exp{margin-bottom:16px;}
.exp .titulo{font-weight:700;font-size:15px;}
.exp .periodo{color:var(--muted);font-size:12.5px;}
.exp p{font-size:14px;color:#374151;margin-top:4px;}
.skills{display:flex;flex-wrap:wrap;gap:8px;}
.skill{background:var(--soft);color:var(--accent);padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;}
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>${topic}</h1>
    <div class="cargo">Seu cargo / área de atuação</div>
    <div class="contato">email@exemplo.com · (00) 00000-0000 · Cidade, UF</div>
  </header>

  <section>
    <h2>Resumo</h2>
    <p style="font-size:14px;color:#374151;">Um parágrafo curto contando sua trajetória e o que você busca profissionalmente.</p>
  </section>

  <section>
    <h2>Experiência</h2>
    <div class="exp"><div class="titulo">Cargo na Empresa X</div><div class="periodo">2022 — atual</div><p>Principais responsabilidades e conquistas nessa posição.</p></div>
    <div class="exp"><div class="titulo">Cargo na Empresa Y</div><div class="periodo">2020 — 2022</div><p>Principais responsabilidades e conquistas nessa posição.</p></div>
  </section>

  <section>
    <h2>Formação</h2>
    <div class="exp"><div class="titulo">Curso — Instituição</div><div class="periodo">Ano de conclusão</div></div>
  </section>

  <section>
    <h2>Habilidades</h2>
    <div class="skills">
      <span class="skill">Habilidade 1</span><span class="skill">Habilidade 2</span><span class="skill">Habilidade 3</span><span class="skill">Habilidade 4</span>
    </div>
  </section>
</div>
</body>
</html>`; }
  },

  {
    id: 'evento',
    keywords: ['pagina de evento', 'site de evento', 'convite online', 'convite digital', 'pagina do evento'],
    defaultTopic: 'Meu Evento',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>
:root{--accent:#db2777;--dark:#1f2937;--muted:#6b7280;--soft:#fdf2f8;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);}
.hero{background:linear-gradient(135deg,var(--accent),#f472b6);color:#fff;text-align:center;padding:90px 24px;}
.hero h1{font-size:38px;font-weight:800;}
.hero p{margin-top:12px;font-size:17px;opacity:.95;}
.container{max-width:640px;margin:0 auto;padding:50px 24px;}
.detalhes{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;text-align:center;margin-bottom:40px;}
.detalhes div{background:var(--soft);border-radius:12px;padding:20px;}
.detalhes .label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.detalhes .valor{font-weight:700;font-size:17px;margin-top:6px;color:var(--accent);}
form{display:flex;flex-direction:column;gap:12px;}
input,textarea{padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;}
button{background:var(--accent);color:#fff;border:none;padding:14px;border-radius:8px;font-weight:700;font-size:15px;cursor:pointer;}
footer{text-align:center;padding:24px;color:var(--muted);font-size:13px;}
@media(max-width:600px){.detalhes{grid-template-columns:1fr;}}
</style>
</head>
<body>
<div class="hero">
  <h1>${topic}</h1>
  <p>Data, horário e local do evento aqui</p>
</div>

<div class="container">
  <div class="detalhes">
    <div><div class="label">Data</div><div class="valor">00/00/0000</div></div>
    <div><div class="label">Horário</div><div class="valor">00:00</div></div>
    <div><div class="label">Local</div><div class="valor">Endereço aqui</div></div>
  </div>

  <h2 style="margin-bottom:16px;">Confirme presença</h2>
  <form onsubmit="event.preventDefault(); alert('Presença confirmada! (isso é só um exemplo — conecte a um formulário de verdade)');">
    <input type="text" placeholder="Seu nome" required>
    <input type="email" placeholder="Seu e-mail" required>
    <textarea placeholder="Alguma observação?" rows="3"></textarea>
    <button type="submit">Confirmar presença</button>
  </form>
</div>

<footer>${topic} · ${new Date().getFullYear()}</footer>
</body>
</html>`; }
  },

  {
    id: 'contato',
    keywords: ['formulario de contato', 'pagina de contato', 'site de contato'],
    defaultTopic: 'Fale Conosco',
    build(topic) { return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>
:root{--accent:#2563eb;--dark:#1f2937;--muted:#6b7280;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
.card{background:#fff;max-width:440px;width:100%;padding:40px;border-radius:16px;box-shadow:0 10px 40px -10px rgba(0,0,0,.15);}
.card h1{font-size:24px;margin-bottom:6px;}
.card p{color:var(--muted);font-size:14px;margin-bottom:24px;}
form{display:flex;flex-direction:column;gap:14px;}
label{font-size:13px;font-weight:600;margin-bottom:-8px;}
input,textarea{padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;outline:none;}
input:focus,textarea:focus{border-color:var(--accent);}
button{background:var(--accent);color:#fff;border:none;padding:14px;border-radius:8px;font-weight:700;font-size:15px;cursor:pointer;margin-top:6px;}
button:hover{opacity:.92;}
.sucesso{display:none;text-align:center;color:#16a34a;font-weight:600;margin-top:14px;}
</style>
</head>
<body>
<div class="card">
  <h1>${topic}</h1>
  <p>Preencha o formulário que retornamos assim que possível.</p>
  <form id="form-contato">
    <label>Nome</label>
    <input type="text" required>
    <label>E-mail</label>
    <input type="email" required>
    <label>Mensagem</label>
    <textarea rows="4" required></textarea>
    <button type="submit">Enviar mensagem</button>
  </form>
  <div class="sucesso" id="sucesso">✅ Mensagem enviada! (exemplo — conecte a um backend/serviço de e-mail de verdade)</div>
</div>
<script>
document.getElementById('form-contato').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('sucesso').style.display = 'block';
  this.reset();
});
</script>
</body>
</html>`; }
  },
];


/* =============================================================================
   COMPONENTES SOLTOS (pra colar dentro de um site já existente)
   ============================================================================= */

const COMPONENTS = [
  { id: 'navbar', keywords: ['menu de navegacao', 'criar um menu', 'navbar', 'barra de navegacao'],
    title: 'Menu de navegação', lang: 'html',
    code: `<nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb;">
  <div style="font-weight:800;font-size:18px;">Logo</div>
  <div style="display:flex;gap:28px;">
    <a href="#" style="text-decoration:none;color:#1f2937;">Início</a>
    <a href="#" style="text-decoration:none;color:#1f2937;">Sobre</a>
    <a href="#" style="text-decoration:none;color:#1f2937;">Serviços</a>
    <a href="#" style="text-decoration:none;color:#1f2937;">Contato</a>
  </div>
</nav>` },

  { id: 'footer', keywords: ['rodape', 'criar um rodape', 'footer do site'],
    title: 'Rodapé', lang: 'html',
    code: `<footer style="background:#111827;color:#9ca3af;padding:40px 32px;text-align:center;font-family:sans-serif;">
  <div style="font-weight:700;color:#fff;margin-bottom:8px;">Nome da Empresa</div>
  <div style="font-size:13px;">© ${new Date().getFullYear()} Todos os direitos reservados.</div>
</footer>` },

  { id: 'hero', keywords: ['secao hero', 'criar um hero', 'banner principal'],
    title: 'Seção Hero', lang: 'html',
    code: `<section style="text-align:center;padding:100px 24px;background:#f1f5f9;font-family:sans-serif;">
  <h1 style="font-size:40px;font-weight:800;margin-bottom:16px;">Título chamativo aqui</h1>
  <p style="color:#64748b;font-size:17px;max-width:520px;margin:0 auto 28px;">Uma frase curta explicando a proposta principal.</p>
  <a href="#" style="background:#2563eb;color:#fff;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:600;">Chamada pra ação</a>
</section>` },

  { id: 'cards', keywords: ['grade de cards', 'criar cards', 'cards de recursos'],
    title: 'Grade de cards', lang: 'html',
    code: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:40px;font-family:sans-serif;">
  <div style="border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
    <h3 style="margin-bottom:8px;">Card 1</h3><p style="color:#64748b;font-size:14px;">Descrição do card.</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
    <h3 style="margin-bottom:8px;">Card 2</h3><p style="color:#64748b;font-size:14px;">Descrição do card.</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
    <h3 style="margin-bottom:8px;">Card 3</h3><p style="color:#64748b;font-size:14px;">Descrição do card.</p>
  </div>
</div>` },

  { id: 'faq', keywords: ['faq', 'perguntas frequentes', 'accordion', 'sanfona de perguntas'],
    title: 'FAQ (perguntas frequentes)', lang: 'html',
    code: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif;">
  <details style="border-bottom:1px solid #e5e7eb;padding:16px 0;">
    <summary style="cursor:pointer;font-weight:600;">Primeira pergunta frequente?</summary>
    <p style="margin-top:10px;color:#64748b;font-size:14px;">Resposta da primeira pergunta.</p>
  </details>
  <details style="border-bottom:1px solid #e5e7eb;padding:16px 0;">
    <summary style="cursor:pointer;font-weight:600;">Segunda pergunta frequente?</summary>
    <p style="margin-top:10px;color:#64748b;font-size:14px;">Resposta da segunda pergunta.</p>
  </details>
  <details style="border-bottom:1px solid #e5e7eb;padding:16px 0;">
    <summary style="cursor:pointer;font-weight:600;">Terceira pergunta frequente?</summary>
    <p style="margin-top:10px;color:#64748b;font-size:14px;">Resposta da terceira pergunta.</p>
  </details>
</div>` },

  { id: 'formulario', keywords: ['formulario', 'criar um formulario', 'form de contato'],
    title: 'Formulário de contato', lang: 'html',
    code: `<form style="max-width:400px;display:flex;flex-direction:column;gap:12px;font-family:sans-serif;" onsubmit="event.preventDefault(); alert('Enviado! (exemplo)');">
  <input type="text" placeholder="Nome" required style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
  <input type="email" placeholder="E-mail" required style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
  <textarea placeholder="Mensagem" rows="4" required style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;"></textarea>
  <button type="submit" style="background:#2563eb;color:#fff;border:none;padding:14px;border-radius:8px;font-weight:700;cursor:pointer;">Enviar</button>
</form>` },

  { id: 'precos', keywords: ['tabela de precos', 'planos de preco', 'pricing'],
    title: 'Tabela de preços', lang: 'html',
    code: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:40px;font-family:sans-serif;max-width:900px;margin:0 auto;">
  <div style="border:1px solid #e5e7eb;border-radius:14px;padding:28px;text-align:center;">
    <h3>Básico</h3><div style="font-size:32px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:14px;color:#64748b;">/mês</span></div>
    <ul style="list-style:none;color:#64748b;font-size:14px;line-height:2;">
      <li>✔ Recurso 1</li><li>✔ Recurso 2</li>
    </ul>
    <button style="margin-top:16px;width:100%;padding:12px;border-radius:8px;border:1px solid #2563eb;background:#fff;color:#2563eb;font-weight:700;cursor:pointer;">Escolher</button>
  </div>
  <div style="border:2px solid #2563eb;border-radius:14px;padding:28px;text-align:center;">
    <h3>Pro</h3><div style="font-size:32px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:14px;color:#64748b;">/mês</span></div>
    <ul style="list-style:none;color:#64748b;font-size:14px;line-height:2;">
      <li>✔ Tudo do Básico</li><li>✔ Recurso 3</li><li>✔ Recurso 4</li>
    </ul>
    <button style="margin-top:16px;width:100%;padding:12px;border-radius:8px;border:none;background:#2563eb;color:#fff;font-weight:700;cursor:pointer;">Escolher</button>
  </div>
  <div style="border:1px solid #e5e7eb;border-radius:14px;padding:28px;text-align:center;">
    <h3>Empresarial</h3><div style="font-size:32px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:14px;color:#64748b;">/mês</span></div>
    <ul style="list-style:none;color:#64748b;font-size:14px;line-height:2;">
      <li>✔ Tudo do Pro</li><li>✔ Suporte dedicado</li>
    </ul>
    <button style="margin-top:16px;width:100%;padding:12px;border-radius:8px;border:1px solid #2563eb;background:#fff;color:#2563eb;font-weight:700;cursor:pointer;">Escolher</button>
  </div>
</div>` },

  { id: 'depoimentos', keywords: ['depoimentos', 'testemunhos', 'avaliacoes de clientes'],
    title: 'Depoimentos', lang: 'html',
    code: `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;padding:40px;font-family:sans-serif;max-width:800px;margin:0 auto;">
  <div style="background:#f8fafc;border-radius:12px;padding:22px;">
    <p style="font-style:italic;color:#374151;margin-bottom:14px;">"Depoimento do cliente sobre a experiência com o produto ou serviço."</p>
    <div style="font-weight:700;">Nome do Cliente</div>
    <div style="font-size:12.5px;color:#64748b;">Cargo, Empresa</div>
  </div>
  <div style="background:#f8fafc;border-radius:12px;padding:22px;">
    <p style="font-style:italic;color:#374151;margin-bottom:14px;">"Outro depoimento positivo contando o resultado obtido."</p>
    <div style="font-weight:700;">Nome do Cliente</div>
    <div style="font-size:12.5px;color:#64748b;">Cargo, Empresa</div>
  </div>
</div>` },

  { id: 'galeria', keywords: ['galeria de imagens', 'grade de fotos', 'galeria de fotos'],
    title: 'Galeria de imagens', lang: 'html',
    code: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:24px;">
  <div style="aspect-ratio:1;background:#cbd5e1;border-radius:8px;"></div>
  <div style="aspect-ratio:1;background:#94a3b8;border-radius:8px;"></div>
  <div style="aspect-ratio:1;background:#cbd5e1;border-radius:8px;"></div>
  <div style="aspect-ratio:1;background:#94a3b8;border-radius:8px;"></div>
</div>
<!-- troque as divs cinzas por <img src="sua-imagem.jpg" style="width:100%;border-radius:8px;"> -->` },

  { id: 'contador', keywords: ['contador regressivo', 'countdown', 'contagem regressiva'],
    title: 'Contador regressivo', lang: 'html',
    code: `<div id="contador" style="font-family:monospace;font-size:32px;text-align:center;padding:40px;font-weight:800;"></div>
<script>
const dataAlvo = new Date('2026-12-31T00:00:00').getTime();
setInterval(() => {
  const diff = dataAlvo - Date.now();
  if (diff <= 0) { document.getElementById('contador').textContent = 'Chegou a hora!'; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('contador').textContent = \`\${d}d \${h}h \${m}m \${s}s\`;
}, 1000);
</script>` },

  { id: 'calculadora', keywords: ['calculadora', 'criar uma calculadora'],
    title: 'Calculadora simples', lang: 'html',
    code: `<div style="max-width:240px;margin:0 auto;font-family:sans-serif;">
  <input id="calc-visor" readonly style="width:100%;padding:14px;font-size:22px;text-align:right;margin-bottom:8px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
    ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(b => `<button onclick="calcClique('${b}')" style="padding:14px;font-size:16px;border:1px solid #e5e7eb;border-radius:6px;background:#f8fafc;cursor:pointer;">${b}</button>`).join('\n    ')}
    <button onclick="calcLimpar()" style="grid-column:span 4;padding:12px;border:none;border-radius:6px;background:#ef4444;color:#fff;cursor:pointer;">Limpar (C)</button>
  </div>
</div>
<script>
function calcClique(v) {
  const visor = document.getElementById('calc-visor');
  if (v === '=') { try { visor.value = eval(visor.value.replace(/[^0-9+\\-*/.]/g, '')); } catch(e) { visor.value = 'Erro'; } }
  else visor.value += v;
}
function calcLimpar() { document.getElementById('calc-visor').value = ''; }
</script>` },

  { id: 'todolist', keywords: ['lista de tarefas', 'todo list', 'to do list'],
    title: 'Lista de tarefas', lang: 'html',
    code: `<div style="max-width:340px;margin:0 auto;font-family:sans-serif;">
  <div style="display:flex;gap:8px;margin-bottom:14px;">
    <input id="todo-input" placeholder="Nova tarefa..." style="flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:8px;">
    <button onclick="todoAdicionar()" style="padding:10px 16px;border:none;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer;">+</button>
  </div>
  <ul id="todo-lista" style="list-style:none;"></ul>
</div>
<script>
function todoAdicionar() {
  const input = document.getElementById('todo-input');
  if (!input.value.trim()) return;
  const li = document.createElement('li');
  li.textContent = input.value;
  li.style.cssText = 'padding:10px;border-bottom:1px solid #e5e7eb;cursor:pointer;';
  li.onclick = () => li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through';
  document.getElementById('todo-lista').appendChild(li);
  input.value = '';
}
</script>` },

  { id: 'modotema', keywords: ['modo escuro', 'dark mode', 'alternar tema', 'botao de tema'],
    title: 'Alternador de modo escuro', lang: 'html',
    code: `<button id="botao-tema" style="padding:10px 18px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">🌙 Modo escuro</button>
<script>
document.getElementById('botao-tema').addEventListener('click', function() {
  document.body.classList.toggle('modo-escuro');
  document.body.style.background = document.body.classList.contains('modo-escuro') ? '#111827' : '#fff';
  document.body.style.color = document.body.classList.contains('modo-escuro') ? '#f1f5f9' : '#111827';
});
</script>` },

  { id: 'menu_hamburguer', keywords: ['menu hamburguer', 'menu mobile', 'menu sanduiche'],
    title: 'Menu hambúrguer (mobile)', lang: 'html',
    code: `<button id="btn-menu" style="font-size:24px;background:none;border:none;cursor:pointer;">☰</button>
<nav id="menu-mobile" style="display:none;flex-direction:column;gap:12px;padding:16px;background:#f8fafc;">
  <a href="#">Início</a><a href="#">Sobre</a><a href="#">Contato</a>
</nav>
<script>
document.getElementById('btn-menu').addEventListener('click', function() {
  const menu = document.getElementById('menu-mobile');
  menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
});
</script>` },

  { id: 'modal', keywords: ['janela modal', 'popup', 'modal de aviso', 'criar um modal'],
    title: 'Janela modal (popup)', lang: 'html',
    code: `<button onclick="document.getElementById('meu-modal').style.display='flex'" style="padding:10px 18px;border-radius:8px;border:none;background:#2563eb;color:#fff;cursor:pointer;">Abrir modal</button>

<div id="meu-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);align-items:center;justify-content:center;">
  <div style="background:#fff;padding:28px;border-radius:12px;max-width:360px;">
    <h3 style="margin-bottom:10px;">Título do modal</h3>
    <p style="color:#64748b;font-size:14px;margin-bottom:18px;">Conteúdo do modal aqui.</p>
    <button onclick="document.getElementById('meu-modal').style.display='none'" style="padding:10px 18px;border-radius:8px;border:none;background:#111827;color:#fff;cursor:pointer;">Fechar</button>
  </div>
</div>` },
];


/* =============================================================================
   EXPLICAÇÕES DE CONCEITOS (sem código, só explicação)
   ============================================================================= */

const EXPLANATIONS = {
  'flexbox': 'Flexbox é um sistema de layout do CSS pra organizar elementos em linha ou coluna, com alinhamento fácil. Ativa com `display: flex;` no elemento pai. Use `justify-content` pra alinhar no eixo principal e `align-items` no eixo cruzado.',
  'grid css': 'CSS Grid é um sistema de layout em duas dimensões (linhas e colunas). Ativa com `display: grid;` e você define as colunas com `grid-template-columns`, ex: `grid-template-columns: repeat(3, 1fr);` pra 3 colunas iguais.',
  'centralizar uma div': 'A forma mais fácil hoje é com flexbox: no elemento pai, `display: flex; justify-content: center; align-items: center;` centraliza tanto na horizontal quanto na vertical.',
  'box model': 'Todo elemento HTML é uma caixa formada por: conteúdo, padding (espaço interno), border (borda) e margin (espaço externo). Usar `box-sizing: border-box;` faz o padding e a borda entrarem dentro da largura definida, em vez de somar por fora.',
  'position absolute': '`position: absolute` tira o elemento do fluxo normal da página e posiciona ele em relação ao ancestral mais próximo que tenha `position: relative` (ou ao body, se nenhum tiver). Use com `top`, `left`, `right`, `bottom` pra definir a posição exata.',
  'media query': 'Media query deixa o site responsivo, aplicando estilos diferentes conforme o tamanho da tela. Exemplo: `@media (max-width: 768px) { .menu { display: none; } }` esconde o menu em telas menores que 768px.',
  'evento de clique': 'Em JavaScript, pra reagir a um clique: `elemento.addEventListener("click", function() { /* código aqui */ });` — roda a função toda vez que o elemento for clicado.',
  'variavel javascript': 'Em JavaScript moderno, se usa `let` pra variáveis que podem mudar de valor, e `const` pra valores que não vão mudar. Exemplo: `let contador = 0;` ou `const nome = "Cesar";`. Evite usar `var`, é uma forma mais antiga.',
  'funcao javascript': 'Função é um bloco de código reutilizável. Exemplo: `function somar(a, b) { return a + b; }` — chama com `somar(2, 3)`, que devolve 5. Também dá pra escrever como arrow function: `const somar = (a, b) => a + b;`.',
  'array javascript': 'Array é uma lista de valores. Exemplo: `const frutas = ["maçã", "banana", "uva"];`. Pra acessar um item: `frutas[0]` (primeiro item). Pra adicionar: `frutas.push("laranja")`.',
  'dom javascript': 'DOM (Document Object Model) é a representação da página HTML que o JavaScript consegue acessar e modificar. Pra pegar um elemento: `document.getElementById("meu-id")` ou `document.querySelector(".minha-classe")`.',
  'fetch api': '`fetch()` é a forma moderna de fazer requisições HTTP em JavaScript. Exemplo básico: `fetch("https://api.exemplo.com/dados").then(res => res.json()).then(dados => console.log(dados));`',
  'localstorage': '`localStorage` guarda dados no navegador da pessoa, que continuam salvos mesmo depois de fechar a aba. Salvar: `localStorage.setItem("chave", "valor")`. Ler: `localStorage.getItem("chave")`.',
  'responsivo': 'Site responsivo é aquele que se adapta bem a qualquer tamanho de tela. As três bases são: usar `max-width` em vez de `width` fixo, usar `%` ou `fr` em vez de pixels fixos, e usar media queries pra ajustar em telas menores.',
};


/* =============================================================================
   FUNÇÃO PRINCIPAL — chamada pelo app.js
   ============================================================================= */

const CODIGO_ENGINE = {
  // Devolve null se a mensagem não parece um pedido de código/site.
  // Devolve { text, code, filename } quando é um site ou componente.
  // Devolve { text } (sem code) quando é só uma explicação.
  generate(message) {
    const norm = _codigoNormalize(message);

    // Explicações de conceito primeiro (mais específico, sem gerar arquivo)
    for (const chave of Object.keys(EXPLANATIONS)) {
      if (norm.includes(chave)) return { text: EXPLANATIONS[chave] };
    }

    // Sites completos
    for (const tpl of SITE_TEMPLATES) {
      if (tpl.keywords.some(k => norm.includes(k))) {
        const topic = extrairAssunto(message, tpl.defaultTopic);
        const code = tpl.build(topic);
        const filename = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.html';
        return {
          text: `Prontinho! Montei um site de "${tpl.id}" personalizado pra "${topic}". Aqui está o código completo — pode copiar, ou usar o botão de baixar embaixo da mensagem:\n\n\`\`\`html\n${code}\n\`\`\``,
          code, filename,
        };
      }
    }

    // Componentes soltos
    for (const comp of COMPONENTS) {
      if (comp.keywords.some(k => norm.includes(k))) {
        const filename = comp.id + '.html';
        return {
          text: `Aqui está o componente "${comp.title}" pronto — copia e cola dentro do seu site, ou baixa o arquivo:\n\n\`\`\`html\n${comp.code}\n\`\`\``,
          code: comp.code, filename,
        };
      }
    }

    // Pedido genérico de site sem tipo específico → cai pra landing page
    const pedeGenerico = /\b(crie|criar|faca|faça|monta|montar|gera|gerar|quero um site|preciso de um site)\b/.test(norm) && norm.includes('site');
    if (pedeGenerico) {
      const tpl = SITE_TEMPLATES[0]; // landing page
      const topic = extrairAssunto(message, tpl.defaultTopic);
      const code = tpl.build(topic);
      const filename = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.html';
      return {
        text: `Não especificou o tipo, então montei uma landing page (o formato mais versátil) pra "${topic}". Se quiser outro tipo, é só falar: portfólio, cardápio, currículo, página de evento ou de contato.\n\n\`\`\`html\n${code}\n\`\`\``,
        code, filename,
      };
    }

    return null;
  },
};

window.CODIGO_ENGINE = CODIGO_ENGINE;
