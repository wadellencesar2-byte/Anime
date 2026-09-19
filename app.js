/* =============================================================================
   ██████████████████████████████████████████████████████████████████████████
   WC DEV IA — app.js
   ██████████████████████████████████████████████████████████████████████████

   TUDO fica neste arquivo (junto com index.html, que só tem estrutura e
   estilo). Está dividido em blocos numerados:

     1. CONFIGURAÇÃO (edite aqui o e-mail do administrador)
     2. "BANCO DE DADOS" (localStorage do navegador)
     3. AUTENTICAÇÃO GOOGLE (login real, com verificação de assinatura)
     4. MOTOR DE IA (base de conhecimento + busca de contexto + provedores)
     5. INTERFACE DO CHAT
     6. PAINEL ADMINISTRATIVO
     7. INICIALIZAÇÃO

   LEIA ISTO ANTES DE USAR:
   Este projeto roda 100% no navegador, sem nenhum servidor — é só
   HTML + JS estático, então funciona direto no GitHub Pages, sem
   precisar configurar nada em nenhum outro site. Isso quer dizer que:
     - O login é simples (só nome + e-mail, sem verificação nenhuma).
       Não é um login "seguro" de verdade — é só uma forma de separar
       o histórico de cada pessoa dentro do mesmo navegador.
     - Os dados (usuários, conversas, conhecimentos) ficam salvos só
       NESTE navegador/aparelho — não são compartilhados entre pessoas
       diferentes nem sincronizados entre dispositivos.
     - A verificação de quem é "administrador" acontece aqui no
       JavaScript, comparando o e-mail digitado com ADMIN_EMAIL abaixo.
       Qualquer um pode digitar esse e-mail e virar admin — pra
       proteção de verdade, essa checagem precisaria acontecer num
       servidor (o que exigiria sair do modelo "só GitHub Pages").
     - Chamar uma IA externa (Anthropic, OpenAI etc.) direto do
       navegador normalmente NÃO funciona — os provedores bloqueiam
       esse tipo de chamada por segurança (política de CORS). O botão
       de "usar API externa" nas Configurações está aqui preparado,
       mas é bem provável que a chamada falhe sem um servidor/proxy no
       meio. Nesse caso, o motor local assume a resposta.
   ============================================================================= */


/* =============================================================================
   1. CONFIGURAÇÃO
   ============================================================================= */

const CONFIG = {
  // E-mail que recebe privilégios de administrador automaticamente ao logar
  // (basta digitar esse e-mail exato na tela de login).
  ADMIN_EMAIL: "wadellencesar2@gmail.com",

  STORAGE_PREFIX: "wcdev_ia_",
  AI_NAME_DEFAULT: "WC DEV IA",
};

// Aviso de diagnóstico: se você abrir o Console do navegador (F12) e ver essa
// mensagem, o arquivo conversas.js não carregou — confira se ele está na
// mesma pasta do index.html e se o <script> dele aparece ANTES do app.js.
window.addEventListener('load', () => {
  if (!window.CONVERSAS_BASE) {
    console.warn('[WC DEV IA] conversas.js não foi detectado. A IA vai responder só com a base mínima embutida. Confira se o arquivo conversas.js está na mesma pasta e se está referenciado no index.html antes do app.js.');
  }
});


/* =============================================================================
   2. "BANCO DE DADOS" — tudo salvo em localStorage (só neste navegador)
   ============================================================================= */

const DB = {
  _key(name) { return CONFIG.STORAGE_PREFIX + name; },

  read(name, fallback) {
    try {
      const raw = localStorage.getItem(this._key(name));
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.error('Erro lendo DB:', name, e);
      return fallback;
    }
  },

  write(name, value) {
    try {
      localStorage.setItem(this._key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Erro salvando DB:', name, e);
      return false;
    }
  },
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- Usuários ----------
function getUsers() { return DB.read('users', []); }
function saveUsers(list) { DB.write('users', list); }

function upsertUser(profile) {
  const users = getUsers();
  const isAdmin = profile.email.toLowerCase() === CONFIG.ADMIN_EMAIL.toLowerCase();
  const now = new Date().toISOString();
  const idx = users.findIndex(u => u.email === profile.email);

  if (idx >= 0) {
    users[idx].name = profile.name;
    users[idx].picture = profile.picture;
    users[idx].lastLogin = now;
    users[idx].role = isAdmin ? 'admin' : users[idx].role || 'user';
  } else {
    users.push({
      id: uid(),
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      role: isAdmin ? 'admin' : 'user',
      status: 'active',
      createdAt: now,
      lastLogin: now,
    });
  }
  saveUsers(users);
  return users.find(u => u.email === profile.email);
}

function getUserByEmail(email) { return getUsers().find(u => u.email === email); }

// ---------- Sessão atual ----------
function getSession() { return DB.read('session', null); }
function setSession(email) { DB.write('session', { email, since: new Date().toISOString() }); }
function clearSession() { DB.write('session', null); }

// ---------- Conversas ----------
function getConversations(email) {
  return DB.read('conversations', []).filter(c => c.userEmail === email).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getAllConversations() { return DB.read('conversations', []); }
function saveAllConversations(list) { DB.write('conversations', list); }

function createConversation(email) {
  const all = getAllConversations();
  const conv = { id: uid(), userEmail: email, title: null, messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  all.unshift(conv);
  saveAllConversations(all);
  return conv;
}

function getConversation(id) { return getAllConversations().find(c => c.id === id); }

function updateConversation(id, patch) {
  const all = getAllConversations();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  saveAllConversations(all);
  return all[idx];
}

function addMessageToConversation(id, role, content) {
  const conv = getConversation(id);
  if (!conv) return null;
  conv.messages.push({ role, content, createdAt: new Date().toISOString() });
  if (!conv.title && role === 'user') conv.title = content.slice(0, 42);
  return updateConversation(id, { messages: conv.messages, title: conv.title });
}

function deleteConversation(id) {
  const all = getAllConversations().filter(c => c.id !== id);
  saveAllConversations(all);
}

// ---------- Conhecimento (base de treinamento) ----------
function getKnowledge() { return DB.read('knowledge', []); }
function saveKnowledge(list) { DB.write('knowledge', list); }

function addKnowledge({ question, answer, category, createdBy }) {
  const list = getKnowledge();
  const item = {
    id: uid(), question, answer, category: category || 'geral', createdBy,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  list.unshift(item);
  saveKnowledge(list);
  addLog(createdBy, 'criou conhecimento', item.id);
  return item;
}

function updateKnowledge(id, patch, editedBy) {
  const list = getKnowledge();
  const idx = list.findIndex(k => k.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  saveKnowledge(list);
  addLog(editedBy, 'editou conhecimento', id);
  return list[idx];
}

function deleteKnowledge(id, deletedBy) {
  const list = getKnowledge().filter(k => k.id !== id);
  saveKnowledge(list);
  addLog(deletedBy, 'excluiu conhecimento', id);
}

// ---------- Logs ----------
function getLogs() { return DB.read('logs', []); }
function addLog(adminEmail, action, targetId) {
  const logs = getLogs();
  logs.unshift({ id: uid(), adminEmail, action, targetId, createdAt: new Date().toISOString() });
  DB.write('logs', logs.slice(0, 300)); // guarda só os 300 mais recentes
}

// ---------- Configurações da IA ----------
function getAIConfig() {
  return DB.read('ai_config', {
    aiName: CONFIG.AI_NAME_DEFAULT,
    personality: 'Assistente prestativo, direto e educado, que fala em português do Brasil.',
    provider: 'local', // 'local' | 'external'
    apiKey: '',
    model: 'claude-sonnet-4-6',
    temperature: 0.7,
    welcomeMessage: 'No que posso ajudar?',
  });
}
function setAIConfig(patch) {
  const cfg = { ...getAIConfig(), ...patch };
  DB.write('ai_config', cfg);
  return cfg;
}


/* =============================================================================
   3. LOGIN SIMPLES (sem servidor, sem verificação externa)
   -----------------------------------------------------------------------------
   Sem backend não dá pra ter um login seguro de verdade — então aqui o
   login é só uma forma de identificar quem é quem dentro do mesmo
   navegador: a pessoa digita um nome (e opcionalmente um e-mail), e isso
   vira a "conta" dela salva no localStorage. Se o e-mail digitado bater
   com CONFIG.ADMIN_EMAIL, a conta vira administradora automaticamente.
   Isso é intencionalmente simples — não tem senha, não tem verificação,
   qualquer um pode digitar o e-mail de admin. Pra login de verdade
   seguro, seria necessário um servidor.
   ============================================================================= */

function gerarEmailLocal(nome) {
  const base = normalize(nome).replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
  return (base || 'usuario') + '@local';
}

function tryLogin() {
  const name = document.getElementById('login-name').value.trim();
  const emailInput = document.getElementById('login-email').value.trim();

  if (!name) {
    showLoginError('Digite um nome pra continuar.');
    return;
  }

  const email = emailInput || gerarEmailLocal(name);
  completeLogin({ email, name, picture: '' });
}

function completeLogin(profile) {
  const user = upsertUser(profile);
  if (user.status === 'blocked') {
    showLoginError('Esta conta foi bloqueada pelo administrador.');
    return;
  }
  setSession(user.email);
  renderAppForUser(user);
}

function logout() {
  clearSession();
  location.reload();
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.style.display = 'block';
}


/* =============================================================================
   4. MOTOR DE IA
   -----------------------------------------------------------------------------
   Arquitetura em camadas, como pedido:
     AIService  →  Provider (local ou externo)  →  "modelo"
   Trocar de provider é só mudar getAIConfig().provider — o resto do app
   não precisa saber qual provider está ativo.
   ============================================================================= */

function normalize(text) {
  let t = text.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  // aplica as gírias/abreviações do conversas.js, se o arquivo estiver carregado
  if (typeof window !== 'undefined' && window.CONVERSAS_SYNONYMS) {
    t = t.split(/\s+/).map(w => window.CONVERSAS_SYNONYMS[w] || w).join(' ');
  }
  // tira pontuação colada nas palavras (ex: "dia!" -> "dia") pra não
  // atrapalhar a comparação de palavra-chave
  t = t.replace(/[.,!?;:()"'`]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Palavras que quase não carregam significado — ignoradas na comparação,
// pra "qual é o seu nome" bater com a palavra-chave "qual seu nome" mesmo
// tendo uma palavra a mais no meio.
const STOPWORDS = new Set(['a','o','os','as','um','uma','uns','umas','de','da','do','das','dos','e','é','que','com','em','no','na','nos','nas','pra','para','por','se','ta','tá','esta','voce','você','meu','minha','teu','tua','seu','sua','me','te','lhe','muito','mto']);

// Compara a mensagem normalizada com uma palavra-chave (que pode ter mais
// de uma palavra) sem exigir que seja um trecho EXATO e contíguo — basta
// que as palavras importantes da keyword apareçam em qualquer ordem na
// mensagem. Isso cobre um monte de jeitos diferentes de perguntar a
// mesma coisa sem precisar cadastrar cada variação manualmente.
function keywordMatches(normMsg, keywordPhrase) {
  return keywordMatchScore(normMsg, keywordPhrase) > 0;
}

// Mesma lógica de keywordMatches, mas devolve um número: 0 = não bateu,
// e quanto maior o número, mais específica (mais palavras de peso) foi a
// combinação. Isso permite escolher a categoria MAIS ESPECÍFICA quando
// várias batem ao mesmo tempo, em vez de sempre pegar a primeira da lista.
function keywordMatchScore(normMsg, keywordPhrase) {
  const kwWords = keywordPhrase.split(/\s+/).filter(Boolean);
  const msgWords = normMsg.split(/\s+/);

  if (kwWords.length === 1) return msgWords.includes(kwWords[0]) ? 1 : 0;

  const significant = kwWords.filter(w => !STOPWORDS.has(w) && w.length > 2);
  const wordsToCheck = significant.length >= 2 ? significant : kwWords;
  return wordsToCheck.every(w => msgWords.includes(w)) ? wordsToCheck.length : 0;
}

// Varre uma lista de categorias e devolve a que tiver a combinação mais
// específica com a mensagem (não a primeira que bater).
function findBestMatch(normMsg, base) {
  let best = null, bestScore = 0;
  for (const entry of base) {
    for (const kw of entry.keywords) {
      const score = keywordMatchScore(normMsg, kw);
      if (score > bestScore) { bestScore = score; best = entry; }
    }
  }
  return best;
}

// ---- Calculadora seguRa (sem eval/Function) ----
function trySolveMath(text) {
  const match = text.match(/[-+/*().\d\s^%]{3,}/);
  if (!match) return null;
  let expr = match[0].trim();
  if (!/\d/.test(expr) || !/[-+*/^%]/.test(expr)) return null;
  try {
    const result = evalExpression(expr.replace(/\^/g, '**'));
    if (result === null || Number.isNaN(result)) return null;
    const rounded = Number.isInteger(result) ? result : Math.round(result * 1e6) / 1e6;
    return { expr, result: rounded };
  } catch (e) { return null; }
}
function evalExpression(src) {
  let i = 0;
  const skip = () => { while (src[i] === ' ') i++; };
  function num() { skip(); let s = i; if (src[i] === '-' || src[i] === '+') i++; while (i < src.length && /[\d.]/.test(src[i])) i++; if (s === i) throw new Error('num'); return parseFloat(src.slice(s, i)); }
  function factor() { skip(); if (src[i] === '(') { i++; const v = expr_(); skip(); if (src[i] !== ')') throw new Error(')'); i++; return v; } if (src[i] === '-') { i++; return -factor(); } if (src[i] === '+') { i++; return factor(); } return num(); }
  function power() { let b = factor(); skip(); if (src[i] === '*' && src[i + 1] === '*') { i += 2; return Math.pow(b, power()); } return b; }
  function term() { let v = power(); skip(); while (src[i] === '*' || src[i] === '/' || src[i] === '%') { const op = src[i]; i++; const r = power(); v = op === '*' ? v * r : op === '/' ? v / r : v % r; skip(); } return v; }
  function expr_() { let v = term(); skip(); while (src[i] === '+' || src[i] === '-') { const op = src[i]; i++; const r = term(); v = op === '+' ? v + r : v - r; skip(); } return v; }
  const result = expr_(); skip();
  if (i !== src.length) throw new Error('sobra');
  return result;
}

// ---- Base de conhecimento embutida (a mesma família de assuntos de antes,
//      versão resumida pra caber bem junto com o resto do app) ----
const BUILTIN_KNOWLEDGE = [
  { keywords: ["oi", "eae", "e ai", "bom dia", "boa tarde", "boa noite", "salve"], responses: ["Opa! Como posso ajudar?", "Fala! Em que posso ajudar hoje?", "Oi! Pronto pra ajudar no que precisar."] },
  { keywords: ["tudo bem", "como voce esta", "de boa"], responses: ["Tudo certo por aqui! E você, como está?", "Rodando redondo! Como vai?"] },
  { keywords: ["obrigado", "valeu", "brigado"], responses: ["Disponha!", "Por nada, precisando é só chamar."] },
  { keywords: ["tchau", "ate mais", "falou"], responses: ["Até mais!", "Falou, volte sempre!"] },
  { keywords: ["qual seu nome", "como te chamo", "seu nome"], responses: ["Pode me chamar de assistente da WC DEV!"] },
  { keywords: ["quem e voce", "quem te criou", "wcdev"], responses: ["Sou o assistente da plataforma WC DEV IA, rodando localmente no seu navegador."] },
  { keywords: ["voce e um robo", "voce e real", "voce e uma ia"], responses: ["Sou um programa: por padrão respondo com um motor de regras local, mas dá pra ligar um provedor de IA externo nas configurações (se o servidor permitir)."] },
  { keywords: ["piada", "engracado"], responses: ["Por que o programador confundiu Halloween com o Natal? Porque OCT 31 == DEC 25.", "Existem 10 tipos de pessoas: as que entendem binário e as que não entendem."] },
  { keywords: ["codigo", "erro", "bug", "javascript", "python", "api", "backend", "frontend"], responses: ["Percebi que é sobre código — no motor local eu não executo nada de verdade, mas fica registrado na conversa."] },
];

// Junta a base fixa acima com o que o administrador cadastrou no painel.
function getFullKnowledgeBase() {
  const trained = getKnowledge().map(k => ({
    keywords: normalize(k.question).split(/\s+/).filter(w => w.length > 2),
    responses: [k.answer],
    _trained: true,
    _id: k.id,
  }));
  return [...trained, ...BUILTIN_KNOWLEDGE];
}

// Busca simples por sobreposição de palavras (RAG "raiz de feijão", sem embeddings)
function retrieveContext(message, topN = 3) {
  const norm = normalize(message);
  const words = new Set(norm.split(/\s+/).filter(w => w.length > 2));
  const scored = getKnowledge().map(k => {
    const kWords = normalize(k.question + ' ' + k.answer).split(/\s+/);
    const overlap = kWords.filter(w => words.has(w)).length;
    return { item: k, score: overlap };
  }).filter(s => s.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(s => s.item);
}

const FALLBACK_QUESTIONS = [
  'Boa pergunta! Ainda não sei responder isso — o administrador pode ensinar essa resposta no Painel Admin > Treinamento da IA.',
  'Não tenho essa informação na base de conhecimento ainda.',
];
const FALLBACK_STATEMENTS = [
  'Entendi: "{trecho}". Pode me dar mais detalhes?',
  'Anotado. Ainda não tenho uma resposta pronta pra isso.',
  'Interessante! Me conta mais.',
];
const THINKING_PHRASES = ["Analisando sua mensagem", "Buscando contexto na base de conhecimento", "Formulando a resposta", "Quase lá"];

/* ---------- Provedores de IA ---------- */

const AIProviders = {
  // Motor local: usa conhecimento treinado > biblioteca de conversas (conversas.js)
  // > base embutida pequena > glossário técnico > fallback.
  async local(message, contextItems) {
    const norm = normalize(message);

    const mathResult = trySolveMath(message);
    if (mathResult) return `O resultado de \`${mathResult.expr}\` é **${mathResult.result}**.`;

    if (norm.includes('que horas')) { const d = new Date(); return `Agora são ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}.`; }
    if (norm.includes('que dia') || norm.includes('data de hoje')) { const d = new Date(); return `Hoje é ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}.`; }

    // 1) conhecimento cadastrado pelo admin (o mais específico, sempre ganha)
    if (contextItems && contextItems.length > 0) {
      return contextItems[0].answer;
    }

    // 2) glossário técnico ("o que é X" / "o que significa X") — checado antes
    //    das categorias gerais, porque senão uma palavra como "api" seria
    //    pega primeiro pela categoria de código genérica.
    if (window.CONVERSAS_GLOSSARY) {
      const m = norm.match(/(?:o\s*que\s*e|o\s*que\s*significa|defina|significado de)\s+(.+)/);
      if (m) {
        const termo = m[1].trim().replace(/[?.!]+$/, '');
        if (window.CONVERSAS_GLOSSARY[termo]) return window.CONVERSAS_GLOSSARY[termo];
        for (const chave of Object.keys(window.CONVERSAS_GLOSSARY)) {
          if (norm.includes(chave)) return window.CONVERSAS_GLOSSARY[chave];
        }
      }
    }

    // 3) biblioteca grande de conversas do dia a dia (conversas.js) — pega a
    //    categoria MAIS ESPECÍFICA entre as que baterem, não a primeira.
    if (window.CONVERSAS_BASE) {
      const best = findBestMatch(norm, window.CONVERSAS_BASE);
      if (best) return pick(best.responses);
    }

    // 4) base embutida pequena (funciona mesmo se o conversas.js não carregar)
    const builtinBest = findBestMatch(norm, BUILTIN_KNOWLEDGE);
    if (builtinBest) return pick(builtinBest.responses);

    // 5) fallback
    let trecho = message.trim();
    if (trecho.length > 60) trecho = trecho.slice(0, 57) + '...';
    const isQuestion = trecho.endsWith('?');
    const fallbacks = window.CONVERSAS_FALLBACKS || { questions: FALLBACK_QUESTIONS, statements: FALLBACK_STATEMENTS };
    const pool = isQuestion ? fallbacks.questions : fallbacks.statements;
    return pick(pool).replace('{trecho}', trecho);
  },

  // Provedor externo: tenta chamar uma API de IA de verdade com a chave que
  // o admin colocou nas Configurações. ATENÇÃO: isso quase certamente vai
  // falhar por bloqueio de CORS quando chamado direto do navegador — está
  // aqui pra já deixar a "tomada" pronta caso um dia isso rode atrás de um
  // servidor/proxy que repasse a chamada.
  async external(message, contextItems, cfg) {
    if (!cfg.apiKey) throw new Error('Nenhuma chave de API configurada.');

    const contextText = contextItems && contextItems.length
      ? '\n\nContexto relevante:\n' + contextItems.map(c => `- ${c.question}: ${c.answer}`).join('\n')
      : '';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: cfg.model || 'claude-sonnet-4-6',
        max_tokens: 800,
        system: cfg.personality + contextText,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) throw new Error('A API externa recusou a chamada (status ' + response.status + '). Isso geralmente é bloqueio de CORS — precisa de um servidor/proxy no meio.');
    const data = await response.json();
    return data.content?.[0]?.text || '(resposta vazia)';
  },
};

async function generateAIReply(message) {
  const cfg = getAIConfig();
  const contextItems = retrieveContext(message);

  if (cfg.provider === 'external') {
    try {
      const text = await AIProviders.external(message, contextItems, cfg);
      return { text, providerUsed: 'external', context: contextItems };
    } catch (err) {
      console.warn('Provedor externo falhou, caindo para o motor local:', err.message);
      const text = await AIProviders.local(message, contextItems);
      return { text: text + `\n\n_(motor externo indisponível: ${err.message} — respondido pelo motor local)_`, providerUsed: 'local-fallback', context: contextItems };
    }
  }

  const text = await AIProviders.local(message, contextItems);
  return { text, providerUsed: 'local', context: contextItems };
}


/* =============================================================================
   5. INTERFACE DO CHAT
   ============================================================================= */

let currentUser = null;
let currentConversationId = null;
let thinkingInterval = null;

function escapeHtml(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function renderContent(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/```([\s\S]*?)```/g, (_, c) => `<pre><code>${c.trim()}</code></pre>`);
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/_([^_]+)_/g, '<em>$1</em>');
  return safe;
}

function renderAppForUser(user) {
  currentUser = user;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');

  document.getElementById('user-avatar').src = user.picture || ('https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.name));
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-role').innerHTML = user.role === 'admin' ? 'Administrador <span class="badge-admin">ADMIN</span>' : 'Usuário';
  document.getElementById('open-admin-link').classList.toggle('hidden', user.role !== 'admin');
  document.getElementById('open-settings-link').classList.toggle('hidden', user.role !== 'admin');
  document.getElementById('admin-hint').classList.toggle('hidden', user.role === 'admin');

  const cfg = getAIConfig();
  document.getElementById('topbar-ai-name').textContent = cfg.aiName;
  document.getElementById('provider-badge').textContent = cfg.provider === 'external' ? 'PROVEDOR EXTERNO' : 'MOTOR LOCAL';
  document.getElementById('empty-state-desc').textContent = cfg.welcomeMessage;

  renderHistoryList();
  startNewConversation(false);
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  getConversations(currentUser.email).forEach(conv => {
    const li = document.createElement('li');
    li.className = conv.id === currentConversationId ? 'active' : '';
    li.innerHTML = `<span class="title">${escapeHtml(conv.title || 'Nova conversa')}</span><button title="Excluir">🗑</button>`;
    li.querySelector('.title').addEventListener('click', () => loadConversation(conv.id));
    li.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); deleteConversation(conv.id); if (conv.id === currentConversationId) startNewConversation(false); renderHistoryList(); });
    list.appendChild(li);
  });
}

function startNewConversation(persist = true) {
  const conv = createConversation(currentUser.email);
  currentConversationId = conv.id;
  document.getElementById('chat-inner').innerHTML = `
    <div class="empty-state" id="empty-state">
      <div class="empty-state__mark">&gt;_</div>
      <h1>${escapeHtml(getAIConfig().aiName)}</h1>
      <p>${escapeHtml(getAIConfig().welcomeMessage)}</p>
    </div>`;
  renderHistoryList();
}

function loadConversation(id) {
  const conv = getConversation(id);
  if (!conv) return;
  currentConversationId = id;
  const inner = document.getElementById('chat-inner');
  inner.innerHTML = '';
  conv.messages.forEach(m => appendMessage(m.role, m.content));
  renderHistoryList();
}

function appendMessage(role, content) {
  const inner = document.getElementById('chat-inner');
  const empty = document.getElementById('empty-state');
  if (empty) empty.remove();

  const msg = document.createElement('div');
  msg.className = `msg msg--${role === 'user' ? 'user' : 'bot'}`;
  const avatar = document.createElement('div');
  avatar.className = 'msg__avatar';
  if (role === 'user' && currentUser.picture) avatar.innerHTML = `<img src="${currentUser.picture}">`;
  else avatar.textContent = role === 'user' ? (currentUser.name || 'V')[0].toUpperCase() : 'IA';

  const body = document.createElement('div');
  body.className = 'msg__body';
  const name = document.createElement('div');
  name.className = 'msg__name';
  name.textContent = role === 'user' ? currentUser.name : getAIConfig().aiName;
  const contentEl = document.createElement('div');
  contentEl.className = 'msg__content';
  contentEl.innerHTML = renderContent(content);

  body.appendChild(name); body.appendChild(contentEl);
  msg.appendChild(avatar); msg.appendChild(body);
  inner.appendChild(msg);
  document.getElementById('chat-scroll').scrollTop = 999999;
  return contentEl;
}

function appendBotShell() {
  const inner = document.getElementById('chat-inner');
  const empty = document.getElementById('empty-state');
  if (empty) empty.remove();
  const msg = document.createElement('div');
  msg.className = 'msg msg--bot';
  const avatar = document.createElement('div'); avatar.className = 'msg__avatar'; avatar.textContent = 'IA';
  const body = document.createElement('div'); body.className = 'msg__body';
  const name = document.createElement('div'); name.className = 'msg__name'; name.textContent = getAIConfig().aiName;
  const contentEl = document.createElement('div'); contentEl.className = 'msg__content';
  body.appendChild(name); body.appendChild(contentEl);
  msg.appendChild(avatar); msg.appendChild(body);
  inner.appendChild(msg);
  document.getElementById('chat-scroll').scrollTop = 999999;
  return contentEl;
}

function typeOutText(el, fullText, onDone) {
  const words = fullText.split(' ');
  let i = 0;
  const cursor = document.createElement('span'); cursor.className = 'cursor';
  function step() {
    if (i >= words.length) { el.innerHTML = renderContent(fullText); if (onDone) onDone(); return; }
    i++;
    el.textContent = words.slice(0, i).join(' ');
    el.appendChild(cursor);
    document.getElementById('chat-scroll').scrollTop = 999999;
    setTimeout(step, 20 + Math.random() * 30);
  }
  step();
}

function appendThinking() {
  const inner = document.getElementById('chat-inner');
  const msg = document.createElement('div');
  msg.className = 'msg msg--bot'; msg.id = 'typing-indicator';
  const avatar = document.createElement('div');
  avatar.className = 'msg__avatar thinking-avatar';
  avatar.innerHTML = `<svg class="spin-logo" width="16" height="16" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="none" stroke="#4FD1C5" stroke-width="2.5"/>
    <path d="M9 11 L16 16 L9 21" stroke="#4FD1C5" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="18" y1="21" x2="24" y2="21" stroke="#4FD1C5" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
  const body = document.createElement('div'); body.className = 'msg__body';
  body.innerHTML = `<div class="msg__name">${escapeHtml(getAIConfig().aiName)}</div><div class="thinking"><span class="thinking__text" id="thinking-text">${THINKING_PHRASES[0]}</span><span class="thinking__dots"><span></span><span></span><span></span></span></div>`;
  msg.appendChild(avatar); msg.appendChild(body);
  inner.appendChild(msg);
  document.getElementById('chat-scroll').scrollTop = 999999;
  let idx = 0;
  thinkingInterval = setInterval(() => { idx = (idx + 1) % THINKING_PHRASES.length; document.getElementById('thinking-text').textContent = THINKING_PHRASES[idx]; }, 600);
}
function removeThinking() { clearInterval(thinkingInterval); const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

async function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  if (!text) return;

  const user = getUserByEmail(currentUser.email);
  if (user && user.status === 'blocked') { alert('Sua conta foi bloqueada pelo administrador.'); return; }

  appendMessage('user', text);
  addMessageToConversation(currentConversationId, 'user', text);
  input.value = ''; input.style.height = 'auto';
  document.getElementById('send-btn').disabled = true;

  appendThinking();
  const start = performance.now();

  // Tempo de "raciocínio" — varia com o tamanho da pergunta, pra parecer que
  // ela está processando de verdade em vez de responder instantaneamente.
  const thinkTime = 700 + Math.min(text.length * 18, 1800) + Math.random() * 500;
  const [{ text: reply, providerUsed }] = await Promise.all([
    generateAIReply(text),
    new Promise(resolve => setTimeout(resolve, thinkTime)),
  ]);
  const elapsed = Math.round(performance.now() - start);

  removeThinking();
  const contentEl = appendBotShell();
  typeOutText(contentEl, reply, () => {
    addMessageToConversation(currentConversationId, 'bot', reply);
    renderHistoryList();
    document.getElementById('send-btn').disabled = false;
    input.focus();
  });
}

function wireChatEvents() {
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  const input = document.getElementById('message-input');
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 160) + 'px'; });
  document.getElementById('new-chat-btn').addEventListener('click', () => { startNewConversation(); closeMobileSidebar(); });
  document.getElementById('logout-link').addEventListener('click', logout);
  document.getElementById('open-admin-link').addEventListener('click', () => location.hash = '#/admin');
  document.getElementById('open-settings-link').addEventListener('click', () => location.hash = '#/admin/configuracoes');

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.querySelector('#app-screen .sidebar').classList.add('open');
    document.getElementById('sidebar-backdrop').classList.add('open');
  });
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);
}
function closeMobileSidebar() {
  document.querySelector('#app-screen .sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
}


/* =============================================================================
   6. PAINEL ADMINISTRATIVO
   ============================================================================= */

function showToast(msg, isError = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function openAdmin(tab) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Acesso negado: essa conta não é administradora.', true);
    location.hash = '';
    return;
  }
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('admin-screen').classList.remove('hidden');
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderAdminTab(tab || 'dashboard');
}

function closeAdmin() {
  document.getElementById('admin-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  location.hash = '';
}

function renderAdminTab(tab) {
  const main = document.getElementById('admin-main');
  if (tab === 'dashboard') return renderDashboard(main);
  if (tab === 'usuarios') return renderUsuarios(main);
  if (tab === 'treinamento') return renderTreinamento(main);
  if (tab === 'chat-treino') return renderChatTreino(main);
  if (tab === 'testar') return renderTestarIA(main);
  if (tab === 'configuracoes') return renderConfiguracoes(main);
  if (tab === 'logs') return renderLogs(main);
}

function renderDashboard(main) {
  const users = getUsers();
  const convs = getAllConversations();
  const totalMsgs = convs.reduce((sum, c) => sum + c.messages.length, 0);
  const knowledge = getKnowledge();
  const recentUsers = [...users].sort((a, b) => b.lastLogin.localeCompare(a.lastLogin)).slice(0, 5);
  const recentLogs = getLogs().slice(0, 6);

  main.innerHTML = `
    <div class="admin-header"><div><h2>Dashboard</h2><p>Visão geral — dados deste navegador</p></div></div>
    <div class="admin-warning">⚠️ Estes números refletem só o que aconteceu <strong>neste navegador</strong>. Sem um servidor real, não existe uma visão central de todos os usuários do mundo — cada pessoa teria seus próprios dados locais.</div>
    <div class="cards-grid">
      <div class="stat-card"><div class="stat-card__value">${users.length}</div><div class="stat-card__label">Usuários (neste navegador)</div></div>
      <div class="stat-card"><div class="stat-card__value">${convs.length}</div><div class="stat-card__label">Conversas</div></div>
      <div class="stat-card"><div class="stat-card__value">${totalMsgs}</div><div class="stat-card__label">Mensagens trocadas</div></div>
      <div class="stat-card"><div class="stat-card__value">${knowledge.length}</div><div class="stat-card__label">Conhecimentos cadastrados</div></div>
    </div>
    <div class="panel-block">
      <h3>Usuários recentes</h3>
      <table><thead><tr><th>Nome</th><th>E-mail</th><th>Último acesso</th></tr></thead><tbody>
        ${recentUsers.map(u => `<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${new Date(u.lastLogin).toLocaleString('pt-BR')}</td></tr>`).join('') || '<tr><td colspan="3">Nenhum usuário ainda.</td></tr>'}
      </tbody></table>
    </div>
    <div class="panel-block">
      <h3>Atividade recente</h3>
      ${recentLogs.map(l => `<div class="log-item"><div class="log-item__time">${new Date(l.createdAt).toLocaleString('pt-BR')}</div><div>${escapeHtml(l.adminEmail)} ${escapeHtml(l.action)}</div></div>`).join('') || '<div style="color:var(--text-muted);font-size:13px;">Sem atividade registrada ainda.</div>'}
    </div>
  `;
}

function renderUsuarios(main) {
  const users = getUsers();
  main.innerHTML = `
    <div class="admin-header"><div><h2>Usuários</h2><p>Contas que já fizeram login neste navegador</p></div></div>
    <div class="panel-block">
      <table>
        <thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Status</th><th>Conversas</th><th>Ações</th></tr></thead>
        <tbody id="users-tbody"></tbody>
      </table>
    </div>
  `;
  const tbody = document.getElementById('users-tbody');
  users.forEach(u => {
    const convCount = getConversations(u.email).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge badge-role-${u.role}">${u.role}</span></td>
      <td><span class="badge badge-status-${u.status}">${u.status === 'blocked' ? 'bloqueado' : 'ativo'}</span></td>
      <td>${convCount}</td>
      <td></td>
    `;
    const actionsTd = tr.querySelector('td:last-child');
    if (u.email !== CONFIG.ADMIN_EMAIL) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm ' + (u.status === 'blocked' ? '' : 'btn-danger');
      btn.textContent = u.status === 'blocked' ? 'Desbloquear' : 'Bloquear';
      btn.addEventListener('click', () => {
        const list = getUsers();
        const idx = list.findIndex(x => x.email === u.email);
        list[idx].status = list[idx].status === 'blocked' ? 'active' : 'blocked';
        saveUsers(list);
        addLog(currentUser.email, (list[idx].status === 'blocked' ? 'bloqueou' : 'desbloqueou') + ' usuário ' + u.email, u.id);
        renderUsuarios(main);
      });
      actionsTd.appendChild(btn);
    } else {
      actionsTd.textContent = '—';
    }
    tbody.appendChild(tr);
  });
  if (users.length === 0) tbody.innerHTML = '<tr><td colspan="6">Nenhum usuário ainda.</td></tr>';
}

function renderTreinamento(main) {
  main.innerHTML = `
    <div class="admin-header"><div><h2>Treinamento da IA</h2><p>Ensine perguntas e respostas — usadas pelo motor local (e como contexto se um provedor externo estiver ativo)</p></div></div>

    <div class="panel-block">
      <h3>Adicionar conhecimento</h3>
      <div class="form-row"><label>Pergunta</label><input type="text" id="kb-question" placeholder='Ex: "Qual é o nome do projeto?"'></div>
      <div class="form-row"><label>Resposta</label><textarea id="kb-answer" placeholder="Ex: O nome do projeto é WC DEV IA."></textarea></div>
      <div class="form-row"><label>Categoria (opcional)</label><input type="text" id="kb-category" placeholder="geral"></div>
      <button class="btn btn-primary" id="kb-save-btn">Salvar conhecimento</button>
    </div>

    <div class="panel-block">
      <h3>Chat de treinamento rápido</h3>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:-8px;">Escreva no formato: <code>Quando perguntarem "X" responda "Y"</code> — o sistema tenta separar pergunta e resposta automaticamente pra você revisar antes de salvar.</p>
      <div class="form-row"><input type="text" id="kb-quick-input" placeholder='Quando perguntarem "quem te criou" responda "Fui criado no projeto WC DEV IA"'></div>
      <button class="btn" id="kb-quick-btn">Interpretar</button>
      <div id="kb-quick-result"></div>
    </div>

    <div class="panel-block">
      <div class="toolbar"><input type="text" id="kb-search" placeholder="Buscar conhecimento..."></div>
      <div id="kb-list"></div>
    </div>
  `;

  function refreshList(filter = '') {
    const list = getKnowledge().filter(k => !filter || normalize(k.question + k.answer).includes(normalize(filter)));
    const container = document.getElementById('kb-list');
    container.innerHTML = '';
    if (list.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhum conhecimento cadastrado ainda.</p>'; return; }
    list.forEach(k => {
      const div = document.createElement('div');
      div.className = 'knowledge-item';
      div.innerHTML = `
        <div style="flex:1;min-width:0;">
          <div class="knowledge-item__q">${escapeHtml(k.question)}</div>
          <div class="knowledge-item__a">${escapeHtml(k.answer)}</div>
          <div class="knowledge-item__meta">categoria: ${escapeHtml(k.category)} · criado por ${escapeHtml(k.createdBy)} em ${new Date(k.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="knowledge-item__actions">
          <button class="btn btn-sm" data-action="edit">Editar</button>
          <button class="btn btn-sm btn-danger" data-action="delete">Excluir</button>
        </div>`;
      div.querySelector('[data-action="delete"]').addEventListener('click', () => {
        if (confirm('Excluir este conhecimento?')) { deleteKnowledge(k.id, currentUser.email); refreshList(document.getElementById('kb-search').value); showToast('Conhecimento excluído.'); }
      });
      div.querySelector('[data-action="edit"]').addEventListener('click', () => {
        const novaResposta = prompt('Editar resposta:', k.answer);
        if (novaResposta !== null) { updateKnowledge(k.id, { answer: novaResposta }, currentUser.email); refreshList(document.getElementById('kb-search').value); showToast('Conhecimento atualizado.'); }
      });
      container.appendChild(div);
    });
  }

  document.getElementById('kb-save-btn').addEventListener('click', () => {
    const q = document.getElementById('kb-question').value.trim();
    const a = document.getElementById('kb-answer').value.trim();
    const c = document.getElementById('kb-category').value.trim();
    if (!q || !a) { showToast('Preencha pergunta e resposta.', true); return; }
    addKnowledge({ question: q, answer: a, category: c, createdBy: currentUser.email });
    document.getElementById('kb-question').value = ''; document.getElementById('kb-answer').value = ''; document.getElementById('kb-category').value = '';
    refreshList(); showToast('Conhecimento salvo!');
  });

  document.getElementById('kb-quick-btn').addEventListener('click', () => {
    const raw = document.getElementById('kb-quick-input').value;
    const match = raw.match(/perguntarem\s+["“](.+?)["”]\s+responda\s+["“](.+?)["”]/i);
    const resultDiv = document.getElementById('kb-quick-result');
    if (!match) { resultDiv.innerHTML = '<p style="color:var(--danger);font-size:12.5px;">Não consegui separar pergunta e resposta. Use o formato exato do exemplo, com aspas.</p>'; return; }
    const [, q, a] = match;
    resultDiv.innerHTML = `
      <div class="test-result">
        <div class="test-result__label">Pergunta identificada</div>${escapeHtml(q)}
        <div class="test-result__label">Resposta identificada</div>${escapeHtml(a)}
        <div style="margin-top:12px;"><button class="btn btn-primary btn-sm" id="kb-quick-confirm">Confirmar e salvar</button></div>
      </div>`;
    document.getElementById('kb-quick-confirm').addEventListener('click', () => {
      addKnowledge({ question: q, answer: a, category: 'treinamento-rapido', createdBy: currentUser.email });
      document.getElementById('kb-quick-input').value = ''; resultDiv.innerHTML = '';
      refreshList(); showToast('Conhecimento salvo a partir do treinamento rápido!');
    });
  });

  document.getElementById('kb-search').addEventListener('input', e => refreshList(e.target.value));
  refreshList();
}

// ---------- Chat de Treinamento (conversa de verdade, separada do chat normal) ----------
// Guarda o histórico dessa conversa separado, e um "estado" pra saber se está
// no meio de uma pergunta esperando a resposta que o admin vai digitar a seguir.
function getTrainingChat() { return DB.read('training_chat', []); }
function saveTrainingChat(list) { DB.write('training_chat', list); }
function getTrainingState() { return DB.read('training_state', { awaiting: null }); }
function setTrainingState(s) { DB.write('training_state', s); }

function parseTeachPattern(text) {
  const match = text.match(/perguntarem\s+["“](.+?)["”]\s+responda\s+["“](.+?)["”]/i);
  if (match) return { question: match[1], answer: match[2] };
  return null;
}

function renderChatTreino(main) {
  main.innerHTML = `
    <div class="admin-header"><div><h2>Chat de Treinamento</h2><p>Converse ensinando a IA — diferente do chat normal, aqui tudo vira conhecimento revisável</p></div></div>
    <div class="admin-warning">Duas formas de ensinar aqui: (1) escreva direto no formato <code>Quando perguntarem "pergunta" responda "resposta"</code>, ou (2) simplesmente digite uma pergunta — a IA vai te perguntar qual deve ser a resposta, e você responde na mensagem seguinte.</div>
    <div class="panel-block" style="padding:0;overflow:hidden;">
      <div id="train-chat-scroll" style="height:min(52vh,480px);overflow-y:auto;padding:20px;">
        <div id="train-chat-inner"></div>
      </div>
      <div style="border-top:1px solid var(--border);padding:14px;display:flex;gap:10px;align-items:flex-end;">
        <textarea id="train-chat-input" rows="1" placeholder='Ex: Quando perguntarem "qual seu horário" responda "Funcionamos das 8h às 18h"' style="flex:1;background:var(--panel-raised);border:1px solid var(--border);border-radius:9px;padding:10px 12px;color:var(--text);font-size:13.5px;resize:none;outline:none;"></textarea>
        <button class="btn btn-primary" id="train-chat-send">Enviar</button>
      </div>
    </div>
  `;

  const inner = document.getElementById('train-chat-inner');
  const scrollBox = document.getElementById('train-chat-scroll');

  function bubble(role, html) {
    const msg = document.createElement('div');
    msg.className = `msg msg--${role === 'user' ? 'user' : 'bot'}`;
    const avatar = document.createElement('div');
    avatar.className = 'msg__avatar';
    avatar.textContent = role === 'user' ? (currentUser.name || 'A')[0].toUpperCase() : 'IA';
    const body = document.createElement('div');
    body.className = 'msg__body';
    const name = document.createElement('div');
    name.className = 'msg__name';
    name.textContent = role === 'user' ? currentUser.name : 'Treinador WC DEV';
    const content = document.createElement('div');
    content.className = 'msg__content';
    content.innerHTML = html;
    body.appendChild(name); body.appendChild(content);
    msg.appendChild(avatar); msg.appendChild(body);
    inner.appendChild(msg);
    scrollBox.scrollTop = 999999;
    return content;
  }

  function loadHistory() {
    inner.innerHTML = '';
    getTrainingChat().forEach(m => bubble(m.role, m.html));
  }

  function persist(role, html) {
    const chat = getTrainingChat();
    chat.push({ role, html, createdAt: new Date().toISOString() });
    saveTrainingChat(chat.slice(-60)); // guarda só as últimas 60 mensagens
  }

  function confirmBubble(question, answer) {
    const html = `Entendido! Vou registrar assim:<br><strong>Pergunta:</strong> ${escapeHtml(question)}<br><strong>Resposta:</strong> ${escapeHtml(answer)}
      <div style="margin-top:10px;"><button class="btn btn-primary btn-sm" data-save>Salvar conhecimento</button> <button class="btn btn-sm" data-discard>Descartar</button></div>`;
    const el = bubble('bot', html);
    persist('bot', html);
    el.querySelector('[data-save]').addEventListener('click', () => {
      addKnowledge({ question, answer, category: 'chat-treinamento', createdBy: currentUser.email });
      el.innerHTML = '✅ Conhecimento salvo! Já pode ser usado pelo chat normal.';
      showToast('Conhecimento salvo!');
    });
    el.querySelector('[data-discard]').addEventListener('click', () => { el.innerHTML = 'Ok, descartado.'; });
  }

  function handleSend() {
    const input = document.getElementById('train-chat-input');
    const text = input.value.trim();
    if (!text) return;
    bubble('user', escapeHtml(text));
    persist('user', escapeHtml(text));
    input.value = '';

    const state = getTrainingState();

    // Já estava esperando a resposta de uma pergunta feita antes
    if (state.awaiting) {
      confirmBubble(state.awaiting, text);
      setTrainingState({ awaiting: null });
      return;
    }

    // Formato direto: "Quando perguntarem X responda Y"
    const parsed = parseTeachPattern(text);
    if (parsed) {
      confirmBubble(parsed.question, parsed.answer);
      return;
    }

    // Mensagem parece uma pergunta solta -> pergunta qual a resposta
    if (text.includes('?') || normalize(text).startsWith('quando')) {
      const html = `Entendido, essa vai ser a pergunta: <strong>"${escapeHtml(text)}"</strong>. Qual deve ser a resposta quando alguém perguntar isso?`;
      bubble('bot', html);
      persist('bot', html);
      setTrainingState({ awaiting: text });
      return;
    }

    // Não entendeu o formato
    const html = `Não consegui identificar uma pergunta aí. Você pode: digitar só a pergunta (ex: <em>"Qual o horário de funcionamento?"</em>) que eu pergunto a resposta, ou já mandar tudo no formato <code>Quando perguntarem "X" responda "Y"</code>.`;
    bubble('bot', html);
    persist('bot', html);
  }

  document.getElementById('train-chat-send').addEventListener('click', handleSend);
  document.getElementById('train-chat-input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });

  loadHistory();
  if (inner.children.length === 0) {
    const html = 'Oi! Pode me ensinar coisas novas por aqui. Digite uma pergunta (ex: <em>"Qual o nome do projeto?"</em>) que eu te pergunto a resposta certa, ou já escreva tudo no formato <code>Quando perguntarem "X" responda "Y"</code>.';
    bubble('bot', html);
    persist('bot', html);
  }
}


function renderTestarIA(main) {
  main.innerHTML = `
    <div class="admin-header"><div><h2>Testar IA</h2><p>Teste sem afetar o histórico dos usuários</p></div></div>
    <div class="panel-block">
      <div class="form-row"><label>Pergunta de teste</label><input type="text" id="test-input" placeholder="Digite uma pergunta..."></div>
      <button class="btn btn-primary" id="test-btn">Testar</button>
      <div id="test-output"></div>
    </div>
  `;
  document.getElementById('test-btn').addEventListener('click', async () => {
    const msg = document.getElementById('test-input').value.trim();
    if (!msg) return;
    const start = performance.now();
    const { text, providerUsed, context } = await generateAIReply(msg);
    const elapsed = Math.round(performance.now() - start);
    document.getElementById('test-output').innerHTML = `
      <div class="test-result">
        <div class="test-result__label">Contextos recuperados (${context.length})</div>
        ${context.length ? context.map(c => `<span class="context-chip">${escapeHtml(c.question)}</span>`).join('') : '<span style="color:var(--text-muted);">nenhum</span>'}
        <div class="test-result__label">Resposta</div>${escapeHtml(text)}
        <div class="test-result__label">Provedor usado</div>${providerUsed}
        <div class="test-result__label">Tempo de resposta</div>${elapsed} ms
      </div>`;
  });
}

function renderConfiguracoes(main) {
  const cfg = getAIConfig();
  main.innerHTML = `
    <div class="admin-header"><div><h2>Configurações</h2><p>Personalidade e provedor da IA</p></div></div>

    <div class="panel-block">
      <div class="form-row"><label>Nome da IA</label><input type="text" id="cfg-name" value="${escapeHtml(cfg.aiName)}"></div>
      <div class="form-row"><label>Mensagem inicial (tela vazia do chat)</label><input type="text" id="cfg-welcome" value="${escapeHtml(cfg.welcomeMessage)}"></div>
      <div class="form-row"><label>Personalidade / prompt de sistema</label><textarea id="cfg-personality">${escapeHtml(cfg.personality)}</textarea></div>
    </div>

    <div class="panel-block">
      <h3>Provedor de IA</h3>
      <div class="admin-warning">⚠️ O provedor "externo" chama a API de IA direto do navegador. Isso normalmente é <strong>bloqueado por CORS</strong> pelos provedores de IA — funciona melhor com um backend/proxy no meio. Se falhar, o motor local assume automaticamente.</div>
      <div class="form-row">
        <label>Provedor ativo</label>
        <select id="cfg-provider">
          <option value="local" ${cfg.provider === 'local' ? 'selected' : ''}>Motor local (regras + conhecimento treinado)</option>
          <option value="external" ${cfg.provider === 'external' ? 'selected' : ''}>API externa (ex: Anthropic) — experimental</option>
        </select>
      </div>
      <div class="form-row-inline">
        <div class="form-row"><label>Chave de API (fica salva só neste navegador)</label><input type="password" id="cfg-apikey" value="${escapeHtml(cfg.apiKey)}" placeholder="sk-ant-..."></div>
        <div class="form-row"><label>Modelo</label><input type="text" id="cfg-model" value="${escapeHtml(cfg.model)}"></div>
      </div>
    </div>

    <button class="btn btn-primary" id="cfg-save-btn">Salvar configurações</button>
  `;
  document.getElementById('cfg-save-btn').addEventListener('click', () => {
    setAIConfig({
      aiName: document.getElementById('cfg-name').value.trim() || CONFIG.AI_NAME_DEFAULT,
      welcomeMessage: document.getElementById('cfg-welcome').value.trim(),
      personality: document.getElementById('cfg-personality').value.trim(),
      provider: document.getElementById('cfg-provider').value,
      apiKey: document.getElementById('cfg-apikey').value.trim(),
      model: document.getElementById('cfg-model').value.trim(),
    });
    addLog(currentUser.email, 'alterou configurações da IA', '-');
    showToast('Configurações salvas!');
  });
}

function renderLogs(main) {
  const logs = getLogs();
  main.innerHTML = `
    <div class="admin-header"><div><h2>Logs</h2><p>Ações administrativas registradas neste navegador</p></div></div>
    <div class="panel-block" id="logs-list"></div>
  `;
  const container = document.getElementById('logs-list');
  if (logs.length === 0) { container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhum log ainda.</p>'; return; }
  logs.forEach(l => {
    const div = document.createElement('div');
    div.className = 'log-item';
    div.innerHTML = `<div class="log-item__time">${new Date(l.createdAt).toLocaleString('pt-BR')}</div><div>${escapeHtml(l.adminEmail)} — ${escapeHtml(l.action)}</div>`;
    container.appendChild(div);
  });
}

function wireAdminEvents() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => { location.hash = '#/admin/' + tab.dataset.tab; closeMobileAdminSidebar(); });
  });
  document.getElementById('admin-back-btn').addEventListener('click', closeAdmin);

  document.getElementById('admin-mobile-menu-btn').addEventListener('click', () => {
    document.querySelector('.admin-sidebar').classList.add('open');
    document.getElementById('admin-sidebar-backdrop').classList.add('open');
  });
  document.getElementById('admin-sidebar-backdrop').addEventListener('click', closeMobileAdminSidebar);
}
function closeMobileAdminSidebar() {
  document.querySelector('.admin-sidebar').classList.remove('open');
  document.getElementById('admin-sidebar-backdrop').classList.remove('open');
}

function handleHashChange() {
  const hash = location.hash;
  if (hash.startsWith('#/admin')) {
    const tab = hash.split('/')[2] || 'dashboard';
    openAdmin(tab);
  } else if (currentUser) {
    closeAdmin();
  }
}


/* =============================================================================
   7. INICIALIZAÇÃO
   ============================================================================= */

function init() {
  wireChatEvents();
  wireAdminEvents();
  window.addEventListener('hashchange', handleHashChange);

  document.getElementById('login-btn').addEventListener('click', tryLogin);
  document.getElementById('login-name').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

  const session = getSession();
  if (session) {
    const user = getUserByEmail(session.email);
    if (user && user.status !== 'blocked') {
      renderAppForUser(user);
      if (location.hash.startsWith('#/admin')) handleHashChange();
      return;
    }
  }
  // sem sessão válida: fica na tela de login
}

document.addEventListener('DOMContentLoaded', init);
