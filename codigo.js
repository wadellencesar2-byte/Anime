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
  // prioriza a ÚLTIMA ocorrência de "para X" — geralmente é ali que fica o
  // nome de verdade, mesmo quando a frase tem outros gatilhos antes (tipo
  // "página de produto PARA Fone XYZ").
  const idxPara = message.toLowerCase().lastIndexOf(' para ');
  if (idxPara !== -1) {
    let assunto = message.slice(idxPara + 6).trim().replace(/[.!?]+$/, '');
    if (assunto.length > 2 && assunto.length < 60) return assunto;
  }
  const m = message.match(/(?:para a|para o|para|de|do|da|sobre|chamad[oa])\s+(.+)/i);
  if (m) {
    let assunto = m[1].trim().replace(/[.!?]+$/, '');
    if (assunto.length > 2 && assunto.length < 60) return assunto;
  }
  return padrao;
}


/* =============================================================================
/* =============================================================================
   PALETAS DE COR E FONTES — sorteadas a cada site gerado, pra cada um
   sair visualmente diferente mesmo usando as mesmas peças de seção.
   ============================================================================= */

const PALETTES = [
  { nome: 'azul',      accent: '#2563eb', bright: '#3b82f6', dark: '#0f172a', muted: '#64748b', soft: '#eff6ff' },
  { nome: 'roxo',      accent: '#7c3aed', bright: '#8b5cf6', dark: '#111827', muted: '#6b7280', soft: '#f5f3ff' },
  { nome: 'verde',     accent: '#059669', bright: '#10b981', dark: '#052e2b', muted: '#5b6b68', soft: '#ecfdf5' },
  { nome: 'laranja',   accent: '#ea580c', bright: '#f97316', dark: '#1c1917', muted: '#78716c', soft: '#fff7ed' },
  { nome: 'rosa',      accent: '#db2777', bright: '#ec4899', dark: '#1f2937', muted: '#6b7280', soft: '#fdf2f8' },
  { nome: 'ciano',     accent: '#0891b2', bright: '#06b6d4', dark: '#082f36', muted: '#5c7278', soft: '#ecfeff' },
  { nome: 'vermelho',  accent: '#dc2626', bright: '#ef4444', dark: '#1c1917', muted: '#78716c', soft: '#fef2f2' },
  { nome: 'dourado',   accent: '#b45309', bright: '#d97706', dark: '#292524', muted: '#78716c', soft: '#fffbeb' },
  { nome: 'indigo',    accent: '#4f46e5', bright: '#6366f1', dark: '#0f172a', muted: '#64748b', soft: '#eef2ff' },
  { nome: 'teal',      accent: '#0d9488', bright: '#14b8a6', dark: '#042f2c', muted: '#5c6f6d', soft: '#f0fdfa' },
  { nome: 'marinho',   accent: '#1e40af', bright: '#2563eb', dark: '#0b1120', muted: '#64748b', soft: '#eff6ff' },
  { nome: 'terroso',   accent: '#92400e', bright: '#b45309', dark: '#292524', muted: '#78716c', soft: '#fefce8' },
  { nome: 'lima',      accent: '#65a30d', bright: '#84cc16', dark: '#1a2e05', muted: '#65746b', soft: '#f7fee7' },
  { nome: 'grafite',   accent: '#475569', bright: '#64748b', dark: '#0f172a', muted: '#64748b', soft: '#f8fafc' },
  { nome: 'coral',     accent: '#e11d48', bright: '#fb7185', dark: '#1f2937', muted: '#6b7280', soft: '#fff1f2' },
  { nome: 'lavanda',   accent: '#9333ea', bright: '#a855f7', dark: '#1e1b2e', muted: '#6b7280', soft: '#faf5ff' },
  { nome: 'esmeralda', accent: '#047857', bright: '#059669', dark: '#022c22', muted: '#5b6b68', soft: '#f0fdf4' },
  { nome: 'ameixa',    accent: '#86198f', bright: '#a21caf', dark: '#1e1b2e', muted: '#6b7280', soft: '#fdf4ff' },
];

const FONT_PAIRS = [
  { titulo: "-apple-system,'Segoe UI',Roboto,sans-serif", corpo: "-apple-system,'Segoe UI',Roboto,sans-serif" },
  { titulo: "Georgia,'Times New Roman',serif",             corpo: "-apple-system,'Segoe UI',Roboto,sans-serif" },
  { titulo: "'Trebuchet MS',sans-serif",                    corpo: "Verdana,Geneva,sans-serif" },
  { titulo: "'Courier New',monospace",                      corpo: "-apple-system,'Segoe UI',Roboto,sans-serif" },
  { titulo: "'Arial Black',Impact,sans-serif",              corpo: "Arial,Helvetica,sans-serif" },
  { titulo: "'Palatino Linotype','Book Antiqua',serif",     corpo: "Tahoma,Geneva,sans-serif" },
  { titulo: "'Century Gothic',sans-serif",                  corpo: "'Segoe UI',sans-serif" },
];

function _pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _sorteiaTema() { return { p: _pick(PALETTES), f: _pick(FONT_PAIRS) }; }

// Reset + estilos-base compartilhados por qualquer site montado
function _baseCss(p, f) { return `
:root{--accent:${p.accent};--bright:${p.bright};--dark:${p.dark};--muted:${p.muted};--soft:${p.soft};}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:${f.corpo};color:var(--dark);line-height:1.6;}
h1,h2,h3{font-family:${f.titulo};}
.container{max-width:1100px;margin:0 auto;padding:0 24px;}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:600;border:none;font-size:15px;cursor:pointer;}
.btn:hover{opacity:.9;}
.btn-outline{display:inline-block;background:none;color:var(--accent);padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:600;border:2px solid var(--accent);font-size:15px;cursor:pointer;}
@media(max-width:720px){.grid-3{grid-template-columns:1fr !important;}.grid-2{grid-template-columns:1fr !important;}.grid-4{grid-template-columns:repeat(2,1fr) !important;}}
`; }


/* =============================================================================
   VARIAÇÕES DE MENU (navbar) — 6 estilos
   ============================================================================= */
const NAVBARS = [
  (topic, p) => `<header style="padding:20px 0;border-bottom:1px solid #e5e7eb;">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center;">
    <div style="font-weight:800;font-size:20px;">${topic}</div>
    <nav style="display:flex;gap:28px;"><a href="#recursos" style="text-decoration:none;color:var(--dark);font-size:14px;">Recursos</a><a href="#contato" style="text-decoration:none;color:var(--dark);font-size:14px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:26px 0;text-align:center;border-bottom:1px solid #e5e7eb;">
  <div style="font-weight:800;font-size:22px;letter-spacing:.5px;">${topic.toUpperCase()}</div>
  <nav style="display:flex;justify-content:center;gap:24px;margin-top:10px;"><a href="#recursos" style="text-decoration:none;color:var(--muted);font-size:13px;">RECURSOS</a><a href="#contato" style="text-decoration:none;color:var(--muted);font-size:13px;">CONTATO</a></nav>
</header>`,
  (topic, p) => `<header style="padding:18px 0;background:var(--dark);">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center;">
    <div style="font-weight:800;font-size:19px;color:#fff;">${topic}</div>
    <nav style="display:flex;gap:24px;"><a href="#recursos" style="text-decoration:none;color:#cbd5e1;font-size:14px;">Recursos</a><a href="#contato" class="btn" style="padding:9px 18px;font-size:13px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:16px 0;">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center;background:var(--soft);padding:14px 24px;border-radius:14px;">
    <div style="font-weight:800;font-size:18px;color:var(--accent);">${topic}</div>
    <nav style="display:flex;gap:22px;"><a href="#recursos" style="text-decoration:none;color:var(--dark);font-size:13.5px;">Recursos</a><a href="#contato" style="text-decoration:none;color:var(--dark);font-size:13.5px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:22px 0;border-bottom:2px solid var(--accent);">
  <div class="container" style="display:flex;justify-content:space-between;align-items:baseline;">
    <div style="font-weight:800;font-size:21px;">${topic}<span style="color:var(--accent);">.</span></div>
    <nav style="display:flex;gap:26px;"><a href="#recursos" style="text-decoration:none;color:var(--dark);font-size:14px;">Recursos</a><a href="#contato" style="text-decoration:none;color:var(--dark);font-size:14px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:14px 0;background:#fff;box-shadow:0 2px 10px -4px rgba(0,0,0,.1);position:relative;">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:8px;"><div style="width:28px;height:28px;background:var(--accent);border-radius:8px;"></div><div style="font-weight:800;font-size:17px;">${topic}</div></div>
    <nav style="display:flex;gap:22px;"><a href="#recursos" style="text-decoration:none;color:var(--dark);font-size:13.5px;">Recursos</a><a href="#contato" style="text-decoration:none;color:var(--dark);font-size:13.5px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:20px 0;">
  <div class="container" style="display:flex;justify-content:space-between;align-items:center;">
    <div style="font-weight:800;font-size:19px;background:linear-gradient(90deg,var(--accent),var(--bright));-webkit-background-clip:text;background-clip:text;color:transparent;">${topic}</div>
    <nav style="display:flex;gap:24px;align-items:center;"><a href="#recursos" style="text-decoration:none;color:var(--dark);font-size:14px;">Recursos</a><a href="#contato" class="btn-outline" style="padding:8px 18px;font-size:13px;">Contato</a></nav>
  </div>
</header>`,
  (topic, p) => `<header style="padding:24px 0 0;">
  <div class="container" style="display:flex;justify-content:center;">
    <div style="display:flex;gap:32px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:40px;padding:10px 24px;">
      <div style="font-weight:800;font-size:16px;">${topic}</div>
      <a href="#recursos" style="text-decoration:none;color:var(--muted);font-size:13px;">Recursos</a>
      <a href="#contato" style="text-decoration:none;color:var(--accent);font-size:13px;font-weight:700;">Contato</a>
    </div>
  </div>
</header>`,
];


/* =============================================================================
   VARIAÇÕES DE HERO (topo de página) — 6 estilos
   ============================================================================= */
const HEROES = [
  (topic, p) => `<section style="padding:100px 0 80px;text-align:center;background:linear-gradient(180deg,var(--soft),#fff);">
  <div class="container">
    <h1 style="font-size:44px;font-weight:800;margin-bottom:18px;max-width:700px;margin-left:auto;margin-right:auto;">${topic} — a solução que você procurava</h1>
    <p style="color:var(--muted);font-size:18px;max-width:560px;margin:0 auto 32px;">Descrição curta do que ${topic} resolve pra quem chega nessa página.</p>
    <a class="btn" href="#contato">Começar agora</a>
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:90px 0;display:grid;grid-template-columns:1.1fr .9fr;gap:50px;align-items:center;" >
  <div>
    <div style="color:var(--accent);font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Apresentando</div>
    <h1 style="font-size:38px;font-weight:800;margin-bottom:16px;">${topic}</h1>
    <p style="color:var(--muted);font-size:17px;margin-bottom:28px;">Uma frase explicando o valor principal de ${topic} de um jeito direto.</p>
    <a class="btn" href="#contato" style="margin-right:10px;">Começar agora</a>
    <a class="btn-outline" href="#recursos">Saiba mais</a>
  </div>
  <div style="background:var(--soft);border-radius:20px;height:320px;display:flex;align-items:center;justify-content:center;font-size:64px;">✨</div>
</section>`,
  (topic, p) => `<section style="padding:110px 0;text-align:center;background:var(--dark);color:#fff;">
  <div class="container">
    <div style="display:inline-block;background:rgba(255,255,255,.1);padding:6px 16px;border-radius:20px;font-size:12.5px;margin-bottom:20px;">Novidade</div>
    <h1 style="font-size:42px;font-weight:800;margin-bottom:18px;max-width:680px;margin-left:auto;margin-right:auto;">${topic}</h1>
    <p style="color:#94a3b8;font-size:17px;max-width:540px;margin:0 auto 32px;">Uma descrição direta sobre a proposta de ${topic}.</p>
    <a class="btn" href="#contato">Quero conhecer</a>
  </div>
</section>`,
  (topic, p) => `<section style="padding:90px 24px;text-align:left;background:var(--accent);color:#fff;">
  <div class="container" style="max-width:640px;">
    <h1 style="font-size:40px;font-weight:800;margin-bottom:16px;">${topic}</h1>
    <p style="font-size:17px;opacity:.9;margin-bottom:30px;">Uma frase curta e direta sobre o que torna ${topic} diferente.</p>
    <a href="#contato" style="display:inline-block;background:#fff;color:var(--accent);padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:700;">Vamos começar</a>
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:100px 0;text-align:center;">
  <h1 style="font-size:52px;font-weight:900;letter-spacing:-1px;margin-bottom:20px;">${topic}</h1>
  <p style="color:var(--muted);font-size:19px;max-width:500px;margin:0 auto 36px;">A frase que resume tudo sobre ${topic} em uma linha.</p>
  <div style="display:flex;gap:14px;justify-content:center;">
    <a class="btn" href="#contato">Começar</a>
    <a class="btn-outline" href="#recursos">Ver recursos</a>
  </div>
</section>`,
  (topic, p) => `<section style="padding:80px 0;background:var(--soft);">
  <div class="container" style="display:grid;grid-template-columns:.9fr 1.1fr;gap:50px;align-items:center;">
    <div style="background:var(--accent);border-radius:20px;height:280px;display:flex;align-items:center;justify-content:center;font-size:56px;color:#fff;">🚀</div>
    <div>
      <h1 style="font-size:36px;font-weight:800;margin-bottom:16px;">${topic}</h1>
      <p style="color:var(--muted);font-size:16px;margin-bottom:26px;">Explicação direta do que ${topic} entrega de valor.</p>
      <a class="btn" href="#contato">Quero saber mais</a>
    </div>
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:90px 0;text-align:center;">
  <div style="width:64px;height:64px;background:var(--soft);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 24px;">🎯</div>
  <h1 style="font-size:40px;font-weight:800;margin-bottom:16px;max-width:640px;margin-left:auto;margin-right:auto;">${topic}</h1>
  <p style="color:var(--muted);font-size:17px;max-width:500px;margin:0 auto 30px;">Uma frase objetiva sobre o que torna ${topic} a escolha certa.</p>
  <a class="btn" href="#contato">Experimentar agora</a>
</section>`,
  (topic, p) => `<section style="padding:100px 24px;background:radial-gradient(circle at top, var(--soft), #fff);text-align:center;">
  <div class="container">
    <h1 style="font-size:46px;font-weight:900;margin-bottom:16px;">${topic}</h1>
    <p style="color:var(--muted);font-size:18px;max-width:540px;margin:0 auto 30px;">Descrição envolvente sobre a proposta de ${topic}.</p>
    <a class="btn" href="#contato" style="margin-right:10px;">Começar</a>
    <a class="btn-outline" href="#recursos">Ver mais</a>
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:80px 0;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;">
  <div>
    <h1 style="font-size:34px;font-weight:800;margin-bottom:14px;">${topic}</h1>
    <p style="color:var(--muted);font-size:15.5px;margin-bottom:24px;">Um parágrafo curto contextualizando o que é ${topic} e pra quem serve.</p>
    <a class="btn" href="#contato">Saiba mais</a>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <div style="background:var(--soft);border-radius:14px;height:90px;"></div>
    <div style="background:var(--accent);border-radius:14px;height:90px;"></div>
    <div style="background:var(--accent);border-radius:14px;height:90px;opacity:.6;"></div>
    <div style="background:var(--soft);border-radius:14px;height:90px;"></div>
  </div>
</section>`,
];


/* =============================================================================
   VARIAÇÕES DE RECURSOS/FEATURES — 5 estilos
   ============================================================================= */
const FEATURES = [
  (topic, p) => `<section id="recursos" class="container" style="padding:80px 0;">
  <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
    <div style="padding:28px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="width:44px;height:44px;background:var(--soft);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px;">⚡</div>
      <h3 style="font-size:18px;margin-bottom:8px;">Rápido</h3><p style="color:var(--muted);font-size:14px;">Primeiro grande benefício de ${topic}.</p>
    </div>
    <div style="padding:28px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="width:44px;height:44px;background:var(--soft);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px;">🔒</div>
      <h3 style="font-size:18px;margin-bottom:8px;">Confiável</h3><p style="color:var(--muted);font-size:14px;">Segundo benefício, o que dá segurança pro cliente.</p>
    </div>
    <div style="padding:28px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="width:44px;height:44px;background:var(--soft);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px;">💡</div>
      <h3 style="font-size:18px;margin-bottom:8px;">Simples</h3><p style="color:var(--muted);font-size:14px;">Terceiro benefício, o que facilita a vida de quem usa.</p>
    </div>
  </div>
</section>`,
  (topic, p) => `<section id="recursos" class="container" style="padding:80px 0;max-width:700px;">
  <h2 style="font-size:26px;margin-bottom:30px;">Por que escolher ${topic}</h2>
  <div style="display:flex;gap:18px;margin-bottom:26px;"><div style="font-size:24px;">⚡</div><div><h3 style="font-size:16px;margin-bottom:4px;">Rápido</h3><p style="color:var(--muted);font-size:14px;">Primeiro benefício explicado em uma frase.</p></div></div>
  <div style="display:flex;gap:18px;margin-bottom:26px;"><div style="font-size:24px;">🔒</div><div><h3 style="font-size:16px;margin-bottom:4px;">Confiável</h3><p style="color:var(--muted);font-size:14px;">Segundo benefício explicado em uma frase.</p></div></div>
  <div style="display:flex;gap:18px;"><div style="font-size:24px;">💡</div><div><h3 style="font-size:16px;margin-bottom:4px;">Simples</h3><p style="color:var(--muted);font-size:14px;">Terceiro benefício explicado em uma frase.</p></div></div>
</section>`,
  (topic, p) => `<section id="recursos" style="padding:80px 0;background:var(--soft);">
  <div class="container">
    <h2 style="font-size:26px;margin-bottom:30px;text-align:center;">O que ${topic} oferece</h2>
    <div class="grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;">
      <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:26px;margin-bottom:8px;">⚡</div><h3 style="font-size:14px;">Rápido</h3></div>
      <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:26px;margin-bottom:8px;">🔒</div><h3 style="font-size:14px;">Seguro</h3></div>
      <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:26px;margin-bottom:8px;">💡</div><h3 style="font-size:14px;">Simples</h3></div>
      <div style="background:#fff;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:26px;margin-bottom:8px;">📈</div><h3 style="font-size:14px;">Escalável</h3></div>
    </div>
  </div>
</section>`,
  (topic, p) => `<section id="recursos" class="container" style="padding:80px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
    <div style="border-left:3px solid var(--accent);padding-left:20px;"><h3 style="font-size:17px;margin-bottom:6px;">Rápido</h3><p style="color:var(--muted);font-size:14px;">Descrição do primeiro grande benefício de ${topic}.</p></div>
    <div style="border-left:3px solid var(--accent);padding-left:20px;"><h3 style="font-size:17px;margin-bottom:6px;">Confiável</h3><p style="color:var(--muted);font-size:14px;">Descrição do segundo benefício.</p></div>
    <div style="border-left:3px solid var(--accent);padding-left:20px;"><h3 style="font-size:17px;margin-bottom:6px;">Simples</h3><p style="color:var(--muted);font-size:14px;">Descrição do terceiro benefício.</p></div>
    <div style="border-left:3px solid var(--accent);padding-left:20px;"><h3 style="font-size:17px;margin-bottom:6px;">Flexível</h3><p style="color:var(--muted);font-size:14px;">Descrição do quarto benefício.</p></div>
  </div>
</section>`,
  (topic, p) => `<section id="recursos" style="padding:80px 24px;text-align:center;">
  <h2 style="font-size:26px;margin-bottom:12px;">Tudo que ${topic} entrega</h2>
  <p style="color:var(--muted);max-width:480px;margin:0 auto 40px;font-size:14.5px;">Uma frase curta contextualizando essa lista de benefícios.</p>
  <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:900px;margin:0 auto;">
    <div style="background:var(--accent);color:#fff;border-radius:14px;padding:26px;"><div style="font-size:22px;margin-bottom:10px;">⚡</div><h3 style="font-size:15px;">Rápido</h3></div>
    <div style="background:var(--soft);border-radius:14px;padding:26px;"><div style="font-size:22px;margin-bottom:10px;">🔒</div><h3 style="font-size:15px;">Confiável</h3></div>
    <div style="background:var(--soft);border-radius:14px;padding:26px;"><div style="font-size:22px;margin-bottom:10px;">💡</div><h3 style="font-size:15px;">Simples</h3></div>
  </div>
</section>`,
  (topic, p) => `<section id="recursos" class="container" style="padding:80px 0;">
  <h2 style="font-size:26px;margin-bottom:8px;">Recursos de ${topic}</h2>
  <p style="color:var(--muted);margin-bottom:30px;font-size:14.5px;">Tudo pensado pra facilitar sua rotina.</p>
  <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:#e5e7eb;border-radius:14px;overflow:hidden;">
    <div style="background:#fff;padding:26px;"><h3 style="font-size:15px;margin-bottom:6px;">⚡ Rápido</h3><p style="color:var(--muted);font-size:13px;">Primeiro benefício.</p></div>
    <div style="background:#fff;padding:26px;"><h3 style="font-size:15px;margin-bottom:6px;">🔒 Confiável</h3><p style="color:var(--muted);font-size:13px;">Segundo benefício.</p></div>
    <div style="background:#fff;padding:26px;"><h3 style="font-size:15px;margin-bottom:6px;">💡 Simples</h3><p style="color:var(--muted);font-size:13px;">Terceiro benefício.</p></div>
  </div>
</section>`,
];


/* =============================================================================
   VARIAÇÕES DE DEPOIMENTOS (inclusão opcional) — 4 estilos
   ============================================================================= */
const TESTIMONIALS = [
  (topic, p) => `<section class="container" style="padding:60px 0;">
  <div class="grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div style="background:var(--soft);border-radius:12px;padding:22px;"><p style="font-style:italic;margin-bottom:14px;">"${topic} mudou completamente como eu resolvo isso no dia a dia."</p><div style="font-weight:700;">Nome do Cliente</div></div>
    <div style="background:var(--soft);border-radius:12px;padding:22px;"><p style="font-style:italic;margin-bottom:14px;">"Resultado além do esperado, recomendo demais."</p><div style="font-weight:700;">Nome do Cliente</div></div>
  </div>
</section>`,
  (topic, p) => `<section style="padding:70px 24px;text-align:center;background:var(--soft);">
  <p style="font-size:22px;font-style:italic;max-width:600px;margin:0 auto 18px;">"${topic} é exatamente o que a gente precisava. Simples, direto e funciona."</p>
  <div style="font-weight:700;">Nome do Cliente — Empresa</div>
</section>`,
  (topic, p) => `<section class="container" style="padding:60px 0;">
  <h2 style="text-align:center;font-size:24px;margin-bottom:30px;">O que estão dizendo</h2>
  <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;">
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;"><div style="color:var(--accent);margin-bottom:8px;">★★★★★</div><p style="font-size:13.5px;color:var(--muted);">"Muito bom, superou expectativas."</p><div style="font-weight:700;font-size:13.5px;margin-top:10px;">Cliente A</div></div>
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;"><div style="color:var(--accent);margin-bottom:8px;">★★★★★</div><p style="font-size:13.5px;color:var(--muted);">"Recomendo pra todo mundo."</p><div style="font-weight:700;font-size:13.5px;margin-top:10px;">Cliente B</div></div>
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;"><div style="color:var(--accent);margin-bottom:8px;">★★★★★</div><p style="font-size:13.5px;color:var(--muted);">"Atendimento excelente."</p><div style="font-weight:700;font-size:13.5px;margin-top:10px;">Cliente C</div></div>
  </div>
</section>`,
  (topic, p) => `<section style="padding:70px 0;background:var(--dark);color:#fff;text-align:center;">
  <div class="container" style="max-width:600px;">
    <div style="font-size:40px;color:var(--accent);margin-bottom:10px;">"</div>
    <p style="font-size:20px;margin-bottom:18px;">${topic} entregou exatamente o que prometeu, sem enrolação.</p>
    <div style="color:#94a3b8;font-size:13.5px;">Nome do Cliente, Cargo na Empresa</div>
  </div>
</section>`,
];


/* =============================================================================
   VARIAÇÕES DE TABELA DE PREÇOS (inclusão opcional) — 2 estilos
   ============================================================================= */
const PRICING_SECTIONS = [
  (topic, p) => `<section class="container" style="padding:70px 0;">
  <h2 style="text-align:center;font-size:26px;margin-bottom:36px;">Planos</h2>
  <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
    <div style="border:1px solid #e5e7eb;border-radius:14px;padding:28px;text-align:center;">
      <h3>Básico</h3><div style="font-size:30px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:13px;color:var(--muted);">/mês</span></div>
      <ul style="list-style:none;color:var(--muted);font-size:13.5px;line-height:2;text-align:left;padding-left:10px;"><li>✔ Recurso básico 1</li><li>✔ Recurso básico 2</li></ul>
      <a href="#contato" class="btn-outline" style="margin-top:16px;width:100%;">Escolher</a>
    </div>
    <div style="border:2px solid var(--accent);border-radius:14px;padding:28px;text-align:center;">
      <h3>Pro</h3><div style="font-size:30px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:13px;color:var(--muted);">/mês</span></div>
      <ul style="list-style:none;color:var(--muted);font-size:13.5px;line-height:2;text-align:left;padding-left:10px;"><li>✔ Tudo do Básico</li><li>✔ Recurso 3</li><li>✔ Recurso 4</li></ul>
      <a href="#contato" class="btn" style="margin-top:16px;width:100%;">Escolher</a>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:14px;padding:28px;text-align:center;">
      <h3>Empresarial</h3><div style="font-size:30px;font-weight:800;margin:12px 0;">R$ 0<span style="font-size:13px;color:var(--muted);">/mês</span></div>
      <ul style="list-style:none;color:var(--muted);font-size:13.5px;line-height:2;text-align:left;padding-left:10px;"><li>✔ Tudo do Pro</li><li>✔ Suporte dedicado</li></ul>
      <a href="#contato" class="btn-outline" style="margin-top:16px;width:100%;">Escolher</a>
    </div>
  </div>
</section>`,
  (topic, p) => `<section style="padding:70px 24px;background:var(--soft);">
  <div class="container" style="max-width:700px;">
    <h2 style="text-align:center;font-size:24px;margin-bottom:30px;">Um plano só, sem complicação</h2>
    <div style="background:#fff;border-radius:16px;padding:36px;text-align:center;">
      <div style="font-size:38px;font-weight:800;">R$ 0<span style="font-size:15px;color:var(--muted);">/mês</span></div>
      <p style="color:var(--muted);margin:10px 0 20px;">Tudo que ${topic} oferece, sem taxa escondida.</p>
      <a href="#contato" class="btn">Assinar agora</a>
    </div>
  </div>
</section>`,
];


/* =============================================================================
   VARIAÇÕES DE CTA (chamada final pra ação) — 5 estilos
   ============================================================================= */
const CTAS = [
  (topic, p) => `<section id="contato" style="background:var(--dark);color:#fff;padding:70px 0;text-align:center;">
  <div class="container"><h2 style="font-size:30px;margin-bottom:20px;">Pronto pra começar com ${topic}?</h2><a class="btn" href="mailto:contato@exemplo.com">Fale conosco</a></div>
</section>`,
  (topic, p) => `<section id="contato" class="container" style="padding:60px 0;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;background:var(--soft);border-radius:16px;padding:50px 40px;">
  <h2 style="font-size:24px;">Vamos conversar sobre ${topic}?</h2><a class="btn" href="mailto:contato@exemplo.com" style="white-space:nowrap;">Entrar em contato</a>
</section>`,
  (topic, p) => `<section id="contato" style="padding:80px 24px;text-align:center;background:var(--accent);color:#fff;">
  <h2 style="font-size:28px;margin-bottom:14px;">${topic} está esperando por você</h2>
  <p style="opacity:.9;margin-bottom:26px;">Dê o primeiro passo agora mesmo.</p>
  <a href="mailto:contato@exemplo.com" style="display:inline-block;background:#fff;color:var(--accent);padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:700;">Começar agora</a>
</section>`,
  (topic, p) => `<section id="contato" class="container" style="padding:70px 0;text-align:center;">
  <h2 style="font-size:26px;margin-bottom:10px;">Fale com ${topic}</h2>
  <p style="color:var(--muted);margin-bottom:24px;">Respondemos em até 1 dia útil.</p>
  <form onsubmit="event.preventDefault();alert('Enviado! (exemplo)');" style="display:flex;gap:10px;max-width:420px;margin:0 auto;">
    <input type="email" placeholder="Seu e-mail" required style="flex:1;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;">
    <button type="submit" class="btn">Enviar</button>
  </form>
</section>`,
  (topic, p) => `<section id="contato" style="padding:70px 0;background:var(--soft);text-align:center;">
  <div class="container">
    <h2 style="font-size:26px;margin-bottom:20px;">${topic} — vamos nessa?</h2>
    <div style="display:flex;gap:14px;justify-content:center;">
      <a class="btn" href="mailto:contato@exemplo.com">Fale conosco</a>
      <a class="btn-outline" href="#recursos">Ver recursos</a>
    </div>
  </div>
</section>`,
  (topic, p) => `<section id="contato" class="container" style="padding:80px 0;text-align:center;border-top:1px solid #e5e7eb;">
  <h2 style="font-size:28px;margin-bottom:10px;">${topic} — bora começar?</h2>
  <p style="color:var(--muted);margin-bottom:26px;">Sem enrolação, sem compromisso.</p>
  <a class="btn" href="mailto:contato@exemplo.com">Entrar em contato</a>
</section>`,
];


/* =============================================================================
   VARIAÇÕES DE RODAPÉ — 5 estilos
   ============================================================================= */
const FOOTERS = [
  (topic, p) => `<footer style="padding:32px 0;text-align:center;color:var(--muted);font-size:13px;"><div class="container">© ${new Date().getFullYear()} ${topic}. Todos os direitos reservados.</div></footer>`,
  (topic, p) => `<footer style="background:var(--dark);color:#94a3b8;padding:40px 0;text-align:center;font-size:13px;"><div class="container"><div style="color:#fff;font-weight:700;margin-bottom:8px;">${topic}</div>© ${new Date().getFullYear()} Todos os direitos reservados.</div></footer>`,
  (topic, p) => `<footer style="padding:44px 0 24px;border-top:1px solid #e5e7eb;">
  <div class="container" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:24px;margin-bottom:24px;">
    <div><div style="font-weight:800;font-size:17px;margin-bottom:8px;">${topic}</div><p style="color:var(--muted);font-size:13px;max-width:260px;">Uma breve descrição da empresa ou projeto.</p></div>
    <div><div style="font-weight:700;font-size:13px;margin-bottom:10px;">Links</div><div style="display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--muted);"><a href="#" style="color:inherit;text-decoration:none;">Início</a><a href="#" style="color:inherit;text-decoration:none;">Recursos</a></div></div>
    <div><div style="font-weight:700;font-size:13px;margin-bottom:10px;">Contato</div><div style="font-size:13px;color:var(--muted);">contato@exemplo.com</div></div>
  </div>
  <div style="text-align:center;color:var(--muted);font-size:12px;border-top:1px solid #e5e7eb;padding-top:18px;">© ${new Date().getFullYear()} ${topic}</div>
</footer>`,
  (topic, p) => `<footer style="padding:30px 0;text-align:center;font-size:13px;color:var(--muted);background:var(--soft);"><div class="container">Feito com carinho por <strong style="color:var(--dark);">${topic}</strong> · ${new Date().getFullYear()}</div></footer>`,
  (topic, p) => `<footer style="padding:36px 0;text-align:center;color:#fff;background:var(--accent);font-size:13px;"><div class="container">${topic} © ${new Date().getFullYear()} — todos os direitos reservados.</div></footer>`,
  (topic, p) => `<footer style="padding:34px 0;border-top:1px solid #e5e7eb;"><div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;"><div style="font-weight:700;">${topic}</div><div style="color:var(--muted);font-size:12.5px;">© ${new Date().getFullYear()} — Todos os direitos reservados</div></div></footer>`,
];


/* =============================================================================
   VARIAÇÕES DE GRADE DE PROJETOS (portfólio) — 4 estilos
   ============================================================================= */
const PROJECT_GRIDS = [
  (topic, p) => `<section class="container" style="padding:60px 0;">
  <h2 style="font-size:24px;margin-bottom:24px;">Projetos</h2>
  <div class="grid-2" style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px;">
    ${['🎨','💻','📱','🚀'].map((icone, i) => `<div style="border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
      <div style="height:150px;background:var(--soft);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:28px;">${icone}</div>
      <div style="padding:18px;"><h3 style="font-size:16px;margin-bottom:6px;">Nome do projeto ${i + 1}</h3><p style="font-size:13.5px;color:var(--muted);">Breve descrição do que foi feito e as ferramentas usadas.</p></div>
    </div>`).join('\n    ')}
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:60px 0;">
  <h2 style="font-size:24px;margin-bottom:24px;">Trabalhos recentes</h2>
  ${['Projeto Um','Projeto Dois','Projeto Três'].map(nome => `<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-bottom:1px solid #e5e7eb;">
    <div><h3 style="font-size:17px;">${nome}</h3><p style="font-size:13.5px;color:var(--muted);">Breve descrição do projeto.</p></div>
    <a href="#" style="color:var(--accent);text-decoration:none;font-weight:600;font-size:14px;">Ver →</a>
  </div>`).join('\n  ')}
</section>`,
  (topic, p) => `<section style="padding:60px 24px;background:var(--soft);">
  <div class="container">
    <h2 style="font-size:24px;margin-bottom:24px;text-align:center;">Alguns trabalhos</h2>
    <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      ${['🖌️','📐','🖼️'].map((icone, i) => `<div style="background:#fff;border-radius:12px;padding:22px;text-align:center;">
        <div style="font-size:30px;margin-bottom:10px;">${icone}</div><h3 style="font-size:14px;">Projeto ${i + 1}</h3>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`,
  (topic, p) => `<section class="container" style="padding:60px 0;">
  <h2 style="font-size:24px;margin-bottom:24px;">Destaques</h2>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">
    <div style="background:var(--soft);border-radius:14px;height:220px;display:flex;align-items:center;justify-content:center;font-size:40px;">⭐</div>
    <div style="background:var(--soft);border-radius:14px;height:220px;display:flex;align-items:center;justify-content:center;font-size:40px;">🎯</div>
  </div>
  <p style="color:var(--muted);font-size:13.5px;text-align:center;">Passe o mouse ou clique nos destaques pra ver mais sobre cada projeto (adicione os links de verdade aqui).</p>
</section>`,
];

const BIO_SECTIONS = [
  (topic, p) => `<header class="container" style="text-align:center;padding:80px 0 20px;">
  <h1 style="font-size:36px;font-weight:800;">${topic}</h1>
  <p style="color:var(--accent);font-weight:600;margin-top:8px;">Sua profissão / especialidade aqui</p>
  <p style="color:var(--muted);max-width:520px;margin:16px auto 0;font-size:15px;">Uma breve bio contando quem você é, o que faz e o que te diferencia.</p>
</header>`,
  (topic, p) => `<header style="background:var(--soft);padding:90px 24px;text-align:center;">
  <div style="width:90px;height:90px;border-radius:50%;background:var(--accent);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;">${topic.charAt(0).toUpperCase()}</div>
  <h1 style="font-size:32px;font-weight:800;">${topic}</h1>
  <p style="color:var(--muted);max-width:480px;margin:14px auto 0;font-size:15px;">Uma breve bio contando quem você é e o que você faz.</p>
</header>`,
  (topic, p) => `<header class="container" style="padding:90px 0;display:grid;grid-template-columns:.7fr 1.3fr;gap:40px;align-items:center;">
  <div style="width:100%;aspect-ratio:1;background:var(--soft);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:48px;">👤</div>
  <div><h1 style="font-size:32px;font-weight:800;margin-bottom:10px;">${topic}</h1><p style="color:var(--muted);font-size:15px;">Uma bio um pouco mais longa, contando a trajetória e as áreas de interesse.</p></div>
</header>`,
  (topic, p) => `<header style="padding:100px 24px;text-align:center;background:var(--dark);color:#fff;">
  <h1 style="font-size:34px;font-weight:800;">${topic}</h1>
  <p style="color:var(--accent);margin-top:8px;font-weight:600;">Especialidade aqui</p>
  <p style="color:#94a3b8;max-width:480px;margin:16px auto 0;font-size:14.5px;">Uma breve bio profissional.</p>
</header>`,
];


/* =============================================================================
   MONTADORES — sorteiam as peças e juntam num documento só
   ============================================================================= */

function assembleLanding(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    _pick(HEROES)(topic, p),
    _pick(FEATURES)(topic, p),
  ];
  if (Math.random() < 0.5) partes.push(_pick(TESTIMONIALS)(topic, p));
  if (Math.random() < 0.4) partes.push(_pick(PRICING_SECTIONS)(topic, p));
  partes.push(_pick(CTAS)(topic, p));
  partes.push(_pick(FOOTERS)(topic, p));
  return _montarDocumento(topic, p, f, partes);
}

function assemblePortfolio(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    _pick(BIO_SECTIONS)(topic, p),
    _pick(PROJECT_GRIDS)(topic, p),
    _pick(CTAS)(topic, p),
    _pick(FOOTERS)(topic, p),
  ];
  return _montarDocumento(topic, p, f, partes);
}

function assembleProduto(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    _pick(HEROES)(topic, p),
    _pick(FEATURES)(topic, p),
    _pick(PRICING_SECTIONS)(topic, p),
    _pick(TESTIMONIALS)(topic, p),
    _pick(CTAS)(topic, p),
    _pick(FOOTERS)(topic, p),
  ];
  return _montarDocumento(topic, p, f, partes);
}

function assembleApp(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    _pick(HEROES)(topic, p),
    _pick(FEATURES)(topic, p),
  ];
  if (Math.random() < 0.6) partes.push(_pick(TESTIMONIALS)(topic, p));
  partes.push(`<section class="container" style="padding:60px 0;text-align:center;">
  <h2 style="font-size:24px;margin-bottom:24px;">Disponível onde você estiver</h2>
  <div style="display:flex;gap:14px;justify-content:center;">
    <div style="background:var(--dark);color:#fff;padding:12px 24px;border-radius:8px;font-size:13.5px;">📱 App Store</div>
    <div style="background:var(--dark);color:#fff;padding:12px 24px;border-radius:8px;font-size:13.5px;">🤖 Google Play</div>
  </div>
</section>`);
  partes.push(_pick(CTAS)(topic, p));
  partes.push(_pick(FOOTERS)(topic, p));
  return _montarDocumento(topic, p, f, partes);
}

function assembleSobreNos(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    `<section class="container" style="padding:80px 0;text-align:center;"><h1 style="font-size:36px;font-weight:800;margin-bottom:16px;">Sobre ${topic}</h1><p style="color:var(--muted);max-width:600px;margin:0 auto;font-size:16px;">Uma história contando como ${topic} começou, o que motivou a criação e onde quer chegar.</p></section>`,
    _pick(FEATURES)(topic, p),
    _pick(TESTIMONIALS)(topic, p),
    _pick(CTAS)(topic, p),
    _pick(FOOTERS)(topic, p),
  ];
  return _montarDocumento(topic, p, f, partes);
}

function assembleAgencia(topic) {
  const { p, f } = _sorteiaTema();
  const partes = [
    _pick(NAVBARS)(topic, p),
    _pick(HEROES)(topic, p),
    _pick(FEATURES)(topic, p),
    _pick(PROJECT_GRIDS)(topic, p),
    _pick(TESTIMONIALS)(topic, p),
    _pick(CTAS)(topic, p),
    _pick(FOOTERS)(topic, p),
  ];
  return _montarDocumento(topic, p, f, partes);
}

function _montarDocumento(topic, p, f, partes) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>${_baseCss(p, f)}</style>
</head>
<body>
${partes.join('\n\n')}
</body>
</html>`;
}


/* =============================================================================
   SITES COMPLETOS
   -----------------------------------------------------------------------------
   "landing", "portfolio", "produto", "app", "sobrenos" e "agencia" são
   MONTADOS na hora, sorteando entre várias variações de cada seção + uma
   paleta de cor + uma fonte. Os outros (cardápio, currículo, evento,
   contato, blog, em breve) têm estrutura mais fixa (fazem mais sentido
   assim), mas também sorteiam a paleta de cor a cada geração.
   ============================================================================= */

const SITE_TEMPLATES = [

  { id: 'landing', keywords: ['landing page', 'pagina de vendas', 'site de vendas', 'pagina de venda'],
    defaultTopic: 'Minha Empresa', build(topic) { return assembleLanding(topic); } },

  { id: 'portfolio', keywords: ['portfolio', 'meu portfolio', 'site portfolio', 'portfolio pessoal', 'site pessoal'],
    defaultTopic: 'Seu Nome', build(topic) { return assemblePortfolio(topic); } },

  { id: 'produto', keywords: ['pagina de produto', 'loja de um produto', 'vender um produto', 'pagina de venda de produto', 'site de um produto'],
    defaultTopic: 'Meu Produto', build(topic) { return assembleProduto(topic); } },

  { id: 'app', keywords: ['landing de aplicativo', 'pagina do app', 'divulgar meu app', 'site do aplicativo', 'pagina de aplicativo'],
    defaultTopic: 'Meu App', build(topic) { return assembleApp(topic); } },

  { id: 'sobrenos', keywords: ['pagina sobre nos', 'sobre a empresa', 'quem somos', 'pagina sobre a empresa'],
    defaultTopic: 'Nossa Empresa', build(topic) { return assembleSobreNos(topic); } },

  { id: 'agencia', keywords: ['site de agencia', 'agencia de marketing', 'pagina de servicos', 'agencia digital'],
    defaultTopic: 'Minha Agência', build(topic) { return assembleAgencia(topic); } },

  { id: 'cardapio', keywords: ['cardapio', 'menu de restaurante', 'cardapio de', 'cardapio para', 'cardapio do restaurante'],
    defaultTopic: 'Meu Restaurante',
    build(topic) {
      const { p } = _sorteiaTema();
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cardápio — ${topic}</title>
<style>
:root{--accent:${p.accent};--dark:#292524;--muted:#78716c;--bg:${p.soft};}
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
  <div class="categoria"><h2>Entradas</h2>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
  </div>
  <div class="categoria"><h2>Pratos principais</h2>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
    <div class="item"><div><span class="nome">Nome do prato</span><span class="desc">Breve descrição dos ingredientes</span></div><span class="preco">R$ 0,00</span></div>
  </div>
  <div class="categoria"><h2>Sobremesas</h2>
    <div class="item"><div><span class="nome">Nome da sobremesa</span><span class="desc">Breve descrição</span></div><span class="preco">R$ 0,00</span></div>
  </div>
  <footer>${topic} — atualize os pratos e preços editando o código</footer>
</div>
</body>
</html>`; } },

  { id: 'curriculo', keywords: ['curriculo online', 'cv online', 'curriculo digital', 'meu curriculo online'],
    defaultTopic: 'Seu Nome',
    build(topic) {
      const { p } = _sorteiaTema();
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Currículo — ${topic}</title>
<style>
:root{--accent:${p.accent};--dark:#1f2937;--muted:#6b7280;--soft:${p.soft};}
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
  <header><h1>${topic}</h1><div class="cargo">Seu cargo / área de atuação</div><div class="contato">email@exemplo.com · (00) 00000-0000 · Cidade, UF</div></header>
  <section><h2>Resumo</h2><p style="font-size:14px;color:#374151;">Um parágrafo curto contando sua trajetória e o que você busca profissionalmente.</p></section>
  <section><h2>Experiência</h2>
    <div class="exp"><div class="titulo">Cargo na Empresa X</div><div class="periodo">2022 — atual</div><p>Principais responsabilidades e conquistas nessa posição.</p></div>
    <div class="exp"><div class="titulo">Cargo na Empresa Y</div><div class="periodo">2020 — 2022</div><p>Principais responsabilidades e conquistas nessa posição.</p></div>
  </section>
  <section><h2>Formação</h2><div class="exp"><div class="titulo">Curso — Instituição</div><div class="periodo">Ano de conclusão</div></div></section>
  <section><h2>Habilidades</h2><div class="skills"><span class="skill">Habilidade 1</span><span class="skill">Habilidade 2</span><span class="skill">Habilidade 3</span><span class="skill">Habilidade 4</span></div></section>
</div>
</body>
</html>`; } },

  { id: 'evento', keywords: ['pagina de evento', 'site de evento', 'convite online', 'convite digital', 'pagina do evento'],
    defaultTopic: 'Meu Evento',
    build(topic) {
      const { p } = _sorteiaTema();
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>
:root{--accent:${p.accent};--dark:#1f2937;--muted:#6b7280;--soft:${p.soft};}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--dark);}
.hero{background:linear-gradient(135deg,var(--accent),${p.bright});color:#fff;text-align:center;padding:90px 24px;}
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
<div class="hero"><h1>${topic}</h1><p>Data, horário e local do evento aqui</p></div>
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
</html>`; } },

  { id: 'contato', keywords: ['formulario de contato', 'pagina de contato', 'site de contato'],
    defaultTopic: 'Fale Conosco',
    build(topic) {
      const { p } = _sorteiaTema();
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>
:root{--accent:${p.accent};--dark:#1f2937;--muted:#6b7280;}
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
    <label>Nome</label><input type="text" required>
    <label>E-mail</label><input type="email" required>
    <label>Mensagem</label><textarea rows="4" required></textarea>
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
</html>`; } },

  { id: 'blog', keywords: ['blog', 'pagina de blog', 'site de blog', 'lista de artigos'],
    defaultTopic: 'Meu Blog',
    build(topic) {
      const { p, f } = _sorteiaTema();
      const posts = ['Primeiro artigo', 'Um assunto interessante', 'Dicas do dia a dia', 'Uma novidade recente'];
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic}</title>
<style>${_baseCss(p, f)}
.post{border-bottom:1px solid #e5e7eb;padding:26px 0;}
.post h2{font-size:20px;margin-bottom:6px;}
.post .meta{color:var(--muted);font-size:12.5px;margin-bottom:8px;}
.post p{color:#374151;font-size:14.5px;}
</style>
</head>
<body>
${_pick(NAVBARS)(topic, p)}
<div class="container" style="max-width:700px;padding-top:50px;padding-bottom:60px;">
  <h1 style="font-size:30px;margin-bottom:30px;">${topic}</h1>
  ${posts.map((titulo, i) => `<div class="post"><h2>${titulo}</h2><div class="meta">${new Date().toLocaleDateString('pt-BR')} · Categoria</div><p>Um resumo curto do artigo, contando do que se trata pra despertar interesse em continuar lendo.</p></div>`).join('\n  ')}
</div>
${_pick(FOOTERS)(topic, p)}
</body>
</html>`; } },

  { id: 'embreve', keywords: ['pagina em breve', 'coming soon', 'pagina de lancamento', 'lista de espera', 'em construcao'],
    defaultTopic: 'Algo Novo Está Chegando',
    build(topic) {
      const { p, f } = _sorteiaTema();
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic} — Em breve</title>
<style>${_baseCss(p, f)}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--dark);color:#fff;text-align:center;}
</style>
</head>
<body>
<div class="container" style="max-width:520px;">
  <div style="font-size:13px;color:var(--bright);text-transform:uppercase;letter-spacing:2px;margin-bottom:18px;">Em breve</div>
  <h1 style="font-size:38px;font-weight:800;margin-bottom:16px;">${topic}</h1>
  <p style="color:#94a3b8;margin-bottom:32px;">Estamos preparando algo especial. Deixe seu e-mail pra ser avisado assim que estiver no ar.</p>
  <form onsubmit="event.preventDefault();this.innerHTML='<p style=&quot;color:#4ade80;&quot;>✅ Anotado! Avisamos assim que estiver pronto.</p>';" style="display:flex;gap:10px;max-width:380px;margin:0 auto;">
    <input type="email" placeholder="seu@email.com" required style="flex:1;padding:13px 14px;border-radius:8px;border:none;">
    <button type="submit" class="btn">Avisar</button>
  </form>
</div>
</body>
</html>`; } },
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

  { id: 'tabs', keywords: ['abas', 'tabs', 'criar abas', 'menu de abas'],
    title: 'Abas (tabs)', lang: 'html',
    code: `<div style="max-width:500px;font-family:sans-serif;">
  <div style="display:flex;border-bottom:2px solid #e5e7eb;">
    <button onclick="mudarAba(0)" class="aba-btn" style="flex:1;padding:12px;border:none;background:none;cursor:pointer;border-bottom:2px solid #2563eb;color:#2563eb;font-weight:700;">Aba 1</button>
    <button onclick="mudarAba(1)" class="aba-btn" style="flex:1;padding:12px;border:none;background:none;cursor:pointer;color:#64748b;">Aba 2</button>
    <button onclick="mudarAba(2)" class="aba-btn" style="flex:1;padding:12px;border:none;background:none;cursor:pointer;color:#64748b;">Aba 3</button>
  </div>
  <div class="aba-conteudo" style="padding:20px 0;">Conteúdo da aba 1.</div>
  <div class="aba-conteudo" style="padding:20px 0;display:none;">Conteúdo da aba 2.</div>
  <div class="aba-conteudo" style="padding:20px 0;display:none;">Conteúdo da aba 3.</div>
</div>
<script>
function mudarAba(indice) {
  document.querySelectorAll('.aba-conteudo').forEach((el, i) => el.style.display = i === indice ? 'block' : 'none');
  document.querySelectorAll('.aba-btn').forEach((el, i) => {
    el.style.color = i === indice ? '#2563eb' : '#64748b';
    el.style.borderBottom = i === indice ? '2px solid #2563eb' : 'none';
    el.style.fontWeight = i === indice ? '700' : '400';
  });
}
</script>` },

  { id: 'carrossel', keywords: ['carrossel', 'slider de imagens', 'carrossel de depoimentos'],
    title: 'Carrossel simples', lang: 'html',
    code: `<div style="max-width:500px;margin:0 auto;font-family:sans-serif;text-align:center;">
  <div id="carrossel-texto" style="background:#f1f5f9;border-radius:12px;padding:30px;font-size:15px;min-height:80px;display:flex;align-items:center;justify-content:center;">"Primeiro depoimento ou slide aqui."</div>
  <div style="display:flex;justify-content:center;gap:10px;margin-top:14px;">
    <button onclick="carrosselMover(-1)" style="padding:8px 16px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">◀</button>
    <button onclick="carrosselMover(1)" style="padding:8px 16px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">▶</button>
  </div>
</div>
<script>
const carrosselItens = ['"Primeiro depoimento ou slide aqui."', '"Segundo depoimento ou slide aqui."', '"Terceiro depoimento ou slide aqui."'];
let carrosselIndice = 0;
function carrosselMover(direcao) {
  carrosselIndice = (carrosselIndice + direcao + carrosselItens.length) % carrosselItens.length;
  document.getElementById('carrossel-texto').textContent = carrosselItens[carrosselIndice];
}
</script>` },

  { id: 'barra_progresso', keywords: ['barra de progresso', 'progress bar', 'barra de carregamento'],
    title: 'Barra de progresso', lang: 'html',
    code: `<div style="max-width:300px;">
  <div style="background:#e5e7eb;border-radius:20px;height:14px;overflow:hidden;">
    <div id="barra-progresso" style="background:#2563eb;height:100%;width:60%;transition:width .3s;"></div>
  </div>
  <div style="font-size:12px;color:#64748b;margin-top:6px;">60% concluído</div>
</div>
<!-- pra mudar o progresso: document.getElementById('barra-progresso').style.width = '80%'; -->` },

  { id: 'notificacao', keywords: ['notificacao toast', 'toast', 'mensagem de aviso flutuante', 'alerta flutuante'],
    title: 'Notificação (toast)', lang: 'html',
    code: `<button onclick="mostrarToast()" style="padding:10px 18px;border-radius:8px;border:none;background:#2563eb;color:#fff;cursor:pointer;">Mostrar notificação</button>
<div id="meu-toast" style="display:none;position:fixed;bottom:24px;right:24px;background:#111827;color:#fff;padding:14px 20px;border-radius:8px;font-family:sans-serif;font-size:14px;"></div>
<script>
function mostrarToast() {
  const toast = document.getElementById('meu-toast');
  toast.textContent = '✅ Ação concluída com sucesso!';
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}
</script>` },

  { id: 'avaliacao_estrelas', keywords: ['avaliacao com estrelas', 'nota com estrelas', 'star rating'],
    title: 'Avaliação com estrelas', lang: 'html',
    code: `<div id="estrelas" style="font-size:28px;cursor:pointer;display:inline-block;">
  ${[1,2,3,4,5].map(n => `<span onclick="avaliar(${n})" data-n="${n}" style="color:#d1d5db;">★</span>`).join('')}
</div>
<script>
function avaliar(nota) {
  document.querySelectorAll('#estrelas span').forEach(s => {
    s.style.color = Number(s.dataset.n) <= nota ? '#f59e0b' : '#d1d5db';
  });
}
</script>` },

  { id: 'breadcrumb', keywords: ['breadcrumb', 'trilha de navegacao', 'caminho de navegacao'],
    title: 'Breadcrumb (trilha de navegação)', lang: 'html',
    code: `<nav style="font-size:13.5px;color:#64748b;font-family:sans-serif;">
  <a href="#" style="color:#64748b;text-decoration:none;">Início</a> /
  <a href="#" style="color:#64748b;text-decoration:none;">Categoria</a> /
  <span style="color:#111827;font-weight:600;">Página atual</span>
</nav>` },

  { id: 'tooltip', keywords: ['tooltip', 'dica ao passar o mouse', 'texto flutuante'],
    title: 'Tooltip (dica ao passar o mouse)', lang: 'html',
    code: `<span style="position:relative;display:inline-block;border-bottom:1px dashed #64748b;cursor:help;" onmouseenter="this.querySelector('.tooltip-texto').style.display='block'" onmouseleave="this.querySelector('.tooltip-texto').style.display='none'">
  Passe o mouse aqui
  <span class="tooltip-texto" style="display:none;position:absolute;bottom:130%;left:50%;transform:translateX(-50%);background:#111827;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;white-space:nowrap;">Texto da dica</span>
</span>` },

  { id: 'spinner', keywords: ['spinner de carregamento', 'loading', 'icone de carregando'],
    title: 'Spinner de carregamento', lang: 'html',
    code: `<div style="width:36px;height:36px;border:4px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:girar 0.8s linear infinite;"></div>
<style>@keyframes girar { to { transform: rotate(360deg); } }</style>` },

  { id: 'newsletter', keywords: ['newsletter', 'cadastro de email', 'inscricao por email'],
    title: 'Formulário de newsletter', lang: 'html',
    code: `<div style="max-width:400px;text-align:center;font-family:sans-serif;">
  <h3 style="margin-bottom:8px;">Receba novidades</h3>
  <p style="color:#64748b;font-size:13.5px;margin-bottom:14px;">Cadastre seu e-mail e não perca nenhuma atualização.</p>
  <form onsubmit="event.preventDefault();alert('Inscrito! (exemplo)');" style="display:flex;gap:8px;">
    <input type="email" placeholder="seu@email.com" required style="flex:1;padding:11px 14px;border:1px solid #e5e7eb;border-radius:8px;">
    <button type="submit" style="padding:11px 20px;border:none;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer;">Inscrever</button>
  </form>
</div>` },

  { id: 'banner_cookies', keywords: ['banner de cookies', 'aviso de cookies', 'lgpd banner'],
    title: 'Banner de cookies', lang: 'html',
    code: `<div id="banner-cookies" style="position:fixed;bottom:0;left:0;right:0;background:#111827;color:#fff;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:sans-serif;font-size:13.5px;">
  <span>Este site usa cookies pra melhorar sua experiência.</span>
  <button onclick="document.getElementById('banner-cookies').remove()" style="padding:8px 18px;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;white-space:nowrap;">Entendi</button>
</div>` },

  { id: 'voltar_topo', keywords: ['botao voltar ao topo', 'scroll to top', 'ir para o topo'],
    title: 'Botão de voltar ao topo', lang: 'html',
    code: `<button onclick="window.scrollTo({top:0,behavior:'smooth'})" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;border:none;background:#2563eb;color:#fff;font-size:18px;cursor:pointer;">↑</button>` },

  { id: 'compartilhar', keywords: ['botoes de compartilhar', 'compartilhar nas redes sociais', 'social share'],
    title: 'Botões de compartilhar', lang: 'html',
    code: `<div style="display:flex;gap:10px;font-family:sans-serif;">
  <a href="https://wa.me/?text=Confira" target="_blank" style="padding:10px 16px;border-radius:8px;background:#25D366;color:#fff;text-decoration:none;font-size:13.5px;">WhatsApp</a>
  <a href="https://twitter.com/intent/tweet" target="_blank" style="padding:10px 16px;border-radius:8px;background:#111827;color:#fff;text-decoration:none;font-size:13.5px;">X / Twitter</a>
  <a href="mailto:?subject=Confira" style="padding:10px 16px;border-radius:8px;background:#64748b;color:#fff;text-decoration:none;font-size:13.5px;">E-mail</a>
</div>` },

  { id: 'lista_tags', keywords: ['lista de tags', 'etiquetas', 'chips'],
    title: 'Lista de tags/etiquetas', lang: 'html',
    code: `<div style="display:flex;flex-wrap:wrap;gap:8px;font-family:sans-serif;">
  <span style="background:#eff6ff;color:#2563eb;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">Tag 1</span>
  <span style="background:#eff6ff;color:#2563eb;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">Tag 2</span>
  <span style="background:#eff6ff;color:#2563eb;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">Tag 3</span>
</div>` },

  { id: 'timeline', keywords: ['linha do tempo', 'timeline', 'historico de eventos'],
    title: 'Linha do tempo (timeline)', lang: 'html',
    code: `<div style="border-left:2px solid #e5e7eb;padding-left:24px;font-family:sans-serif;max-width:400px;">
  ${['2024','2025','2026'].map(ano => `<div style="position:relative;margin-bottom:26px;">
    <div style="position:absolute;left:-30px;top:2px;width:10px;height:10px;border-radius:50%;background:#2563eb;"></div>
    <div style="font-weight:700;font-size:13px;color:#2563eb;">${ano}</div>
    <p style="font-size:14px;color:#374151;margin-top:4px;">Descrição do que aconteceu nesse período.</p>
  </div>`).join('\n  ')}
</div>` },

  { id: 'formulario_login', keywords: ['formulario de login', 'tela de login', 'pagina de login'],
    title: 'Formulário de login', lang: 'html',
    code: `<div style="max-width:340px;margin:0 auto;font-family:sans-serif;padding:32px;border:1px solid #e5e7eb;border-radius:14px;">
  <h2 style="margin-bottom:18px;text-align:center;">Entrar</h2>
  <form onsubmit="event.preventDefault();alert('Login de exemplo!');" style="display:flex;flex-direction:column;gap:12px;">
    <input type="email" placeholder="E-mail" required style="padding:11px;border:1px solid #e5e7eb;border-radius:8px;">
    <input type="password" placeholder="Senha" required style="padding:11px;border:1px solid #e5e7eb;border-radius:8px;">
    <button type="submit" style="padding:12px;border:none;border-radius:8px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer;">Entrar</button>
  </form>
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
  'transition css': '`transition` faz uma mudança de estilo acontecer suavemente em vez de instantânea. Exemplo: `transition: all 0.3s ease;` faz qualquer mudança (cor, tamanho, posição) demorar 0.3s pra acontecer.',
  'animation css': '`@keyframes` define uma animação com estágios, e `animation` aplica ela num elemento. Exemplo: `@keyframes girar { to { transform: rotate(360deg); } }` e depois `animation: girar 1s linear infinite;`.',
  'pseudo elemento': 'Pseudo-elementos como `::before` e `::after` inserem conteúdo antes ou depois de um elemento sem precisar de HTML extra. Exemplo: `.item::before { content: "→ "; }` adiciona uma seta antes do texto.',
  'variaveis css': 'Variáveis CSS (custom properties) guardam valores reutilizáveis. Define com `--nome: valor;` dentro de `:root` e usa com `var(--nome)`. Exemplo: `:root { --accent: #2563eb; }` e depois `color: var(--accent);`.',
  'promise javascript': 'Promise representa uma operação assíncrona que vai terminar no futuro, com sucesso ou erro. Exemplo: `fetch(url).then(res => res.json()).catch(err => console.log(err));` — `.then()` roda se der certo, `.catch()` se der erro.',
  'async await': '`async/await` é uma forma mais legível de trabalhar com Promises. Exemplo: `async function buscar() { const res = await fetch(url); const dados = await res.json(); return dados; }` — o código parece síncrono mas continua assíncrono por trás.',
  'json stringify parse': '`JSON.stringify(objeto)` transforma um objeto JavaScript em texto (útil pra salvar no localStorage). `JSON.parse(texto)` faz o caminho inverso, transformando o texto de volta em objeto.',
  'array map filter': '`.map()` transforma cada item de um array e devolve um novo array. `.filter()` devolve só os itens que passam num teste. Exemplo: `[1,2,3].map(n => n * 2)` vira `[2,4,6]`; `[1,2,3].filter(n => n > 1)` vira `[2,3]`.',
  'criar elemento dom': 'Pra criar um elemento novo em JavaScript: `const div = document.createElement("div"); div.textContent = "Olá"; document.body.appendChild(div);` — cria, preenche e insere na página.',
  'validacao de formulario': 'HTML já valida campos básicos com atributos como `required`, `type="email"` e `minlength`. Pra validação customizada em JavaScript, use o evento `submit` do formulário e verifique os valores antes de deixar enviar.',
  'meta viewport': 'A tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">` no `<head>` é essencial pra o site funcionar bem no celular — sem ela, o navegador mobile renderiza como se fosse desktop e depois encolhe tudo.',
  'meta tags seo': 'Tags importantes pra SEO: `<title>` (título da aba/resultado de busca), `<meta name="description" content="...">` (resumo que aparece no Google), e `<meta property="og:image">` (imagem que aparece ao compartilhar o link).',
  'html semantico': 'HTML semântico usa tags que descrevem o significado do conteúdo, não só a aparência: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>` em vez de `<div>` pra tudo. Ajuda acessibilidade e SEO.',
  'acessibilidade': 'Acessibilidade básica: usar `alt="descrição"` em imagens, `label` associado a cada `input`, contraste de cor suficiente entre texto e fundo, e garantir que o site funcione navegando só com o teclado (Tab).',
  'unidades css': '`px` é fixo. `%` é relativo ao elemento pai. `rem` é relativo ao tamanho de fonte raiz (bom pra tamanhos consistentes). `vh`/`vw` são relativos ao tamanho da tela (`100vh` = altura total da tela).',
  'transform css': '`transform` move, gira, escala ou inclina um elemento sem afetar o layout ao redor. Exemplos: `transform: scale(1.1);` (aumenta 10%), `transform: rotate(45deg);` (gira), `transform: translateX(20px);` (move).',
  'box shadow': '`box-shadow` adiciona sombra a um elemento. Formato: `box-shadow: deslocamentoX deslocamentoY desfoque cor;`. Exemplo: `box-shadow: 0 4px 12px rgba(0,0,0,0.15);` cria uma sombra suave embaixo.',
  'border radius': '`border-radius` arredonda os cantos de um elemento. `border-radius: 8px;` arredonda um pouco, `border-radius: 50%;` transforma um quadrado em círculo.',
  'gradiente css': 'Gradiente cria uma transição suave entre cores. Exemplo: `background: linear-gradient(135deg, #2563eb, #7c3aed);` cria um degradê diagonal de azul pra roxo.',
  'position sticky': '`position: sticky` faz um elemento rolar normalmente até chegar numa borda definida (`top: 0`, por exemplo), aí ele "gruda" ali enquanto o resto da página continua rolando por baixo. Ótimo pra menus fixos.',
  'overflow css': '`overflow` controla o que acontece quando o conteúdo é maior que a caixa. `overflow: hidden;` esconde o excesso, `overflow: auto;` adiciona barra de rolagem só quando necessário, `overflow: scroll;` sempre mostra a barra.',
  'hover css': '`:hover` aplica um estilo só quando o mouse está sobre o elemento. Exemplo: `.botao:hover { background: #1d4ed8; }` muda a cor de fundo ao passar o mouse.',
};


/* =============================================================================
   GERADOR DE PROMPTS — ensina a IA a montar prompts prontos pra usar em
   outras ferramentas de IA (geração de imagem, texto, código), do mesmo
   jeito que ela monta sites: reconhece o pedido e preenche um modelo.
   ============================================================================= */

const PROMPT_TEMPLATES = {
  imagem(topic) { return `Prompt para gerar imagem — "${topic}":

${topic}, estilo [fotografia realista / ilustração digital / pintura a óleo / aquarela — escolha um], iluminação [suave e natural / dramática / dourada de pôr do sol], composição [close-up / plano aberto / vista aérea], paleta de cores [vibrante / pastel / monocromática], alta qualidade, muito detalhado, 4k, nitidez alta

Prompt negativo (o que evitar): baixa qualidade, borrado, distorcido, marca d'água, texto, assinatura, mãos deformadas`; },

  texto(topic) { return `Prompt para gerar texto — "${topic}":

Você é um redator especialista em [área relacionada a ${topic}]. Escreva um texto sobre "${topic}" com:
- Objetivo: [informar / persuadir / entreter — escolha um]
- Público-alvo: [descreva quem vai ler]
- Tom de voz: [formal / casual / técnico / inspirador]
- Tamanho: [curto (até 200 palavras) / médio / longo]
- Formato: [parágrafos corridos / tópicos / passo a passo]

Restrições: evite jargão excessivo, use frases curtas e diretas, inclua uma chamada pra ação no final.`; },

  codigo(topic) { return `Prompt para gerar código — "${topic}":

Preciso de código pra: ${topic}

Contexto técnico:
- Linguagem/framework: [especifique, ex: JavaScript puro, Python, React]
- Onde vai rodar: [navegador / servidor / mobile]

Requisitos:
1. [primeiro requisito funcional]
2. [segundo requisito funcional]
3. [terceiro requisito funcional]

Formato da resposta: código comentado em português, explicando as partes principais, sem bibliotecas externas desnecessárias.`; },

  geral(topic) { return `Prompt geral — "${topic}":

Papel: Você é um especialista em ${topic}.

Contexto: [explique brevemente a situação ou o motivo do pedido]

Tarefa: [descreva exatamente o que você quer que a IA faça sobre ${topic}]

Formato de saída: [lista / texto corrido / tabela / passo a passo]

Restrições: [tamanho máximo, o que evitar, tom de voz desejado]`; },
};

function _detectaTipoPrompt(norm) {
  if (norm.includes('imagem') || norm.includes('foto') || norm.includes('ilustracao') || norm.includes('desenho') || norm.includes('midjourney') || norm.includes('dall-e') || norm.includes('dalle')) return 'imagem';
  if (norm.includes('codigo') || norm.includes('programar') || norm.includes('programacao') || norm.includes('funcao') || norm.includes('script')) return 'codigo';
  if (norm.includes('texto') || norm.includes('redacao') || norm.includes('artigo') || norm.includes('escrever') || norm.includes('post') || norm.includes('legenda')) return 'texto';
  return 'geral';
}

const PROMPT_ENGINE = {
  generate(message) {
    const norm = _codigoNormalize(message);
    const gatilhos = ['prompt para', 'prompt pra', 'criar um prompt', 'cria um prompt', 'escreve um prompt', 'escrever um prompt', 'monta um prompt', 'prompt de imagem', 'me ajuda a escrever um prompt', 'prompt para ia', 'prompt para chatgpt', 'prompt para midjourney', 'prompt para claude'];
    if (!gatilhos.some(g => norm.includes(g))) return null;

    const tipo = _detectaTipoPrompt(norm);
    const topic = extrairAssunto(message, 'o assunto que você quiser');
    const texto = PROMPT_TEMPLATES[tipo](topic);
    return {
      text: `Montei um prompt pronto (tipo: ${tipo}) — é só preencher os colchetes [assim] com o que fizer sentido e colar na IA que for usar:\n\n\`\`\`\n${texto}\n\`\`\``,
    };
  },
};

window.PROMPT_ENGINE = PROMPT_ENGINE;


/* =============================================================================
   FUNÇÃO PRINCIPAL — chamada pelo app.js
   ============================================================================= */

const CODIGO_ENGINE = {
  // Devolve null se a mensagem não parece um pedido de código/site/prompt.
  // Devolve { text, code, filename } quando é um site ou componente.
  // Devolve { text } (sem code) quando é uma explicação ou um prompt gerado.
  generate(message) {
    const norm = _codigoNormalize(message);

    // Pedido de PROMPT primeiro (é bem específico, não colide com o resto)
    const promptResult = PROMPT_ENGINE.generate(message);
    if (promptResult) return promptResult;

    // Explicações de conceito (mais específico, sem gerar arquivo)
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

    // Pedido genérico de site sem tipo específico → cai pra landing page.
    // Reconhece um bocado de jeitos diferentes de pedir (verbos no
    // imperativo, indicativo, infinitivo) + qualquer sinônimo de "site".
    const verboCriacao = /\b(crie|cria|criar|criando|faca|faça|faz|fazer|monta|montar|montando|gera|gerar|gerando|constroi|constr[oó]i|construir|desenvolve|desenvolver|elabora|elaborar|quero|preciso|voce consegue|voce sabe)\b/;
    const substantivoSite = /\b(site|pagina|página|landing|paginaweb)\b/;
    const pedeGenerico = verboCriacao.test(norm) && substantivoSite.test(norm);
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
