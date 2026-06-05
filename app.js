// ===== ANIVERSE — MAIN APP =====

// ---- DATABASE (localStorage simulation) ----
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('av_'+key)) } catch { return null } },
  set(key, val) { try { localStorage.setItem('av_'+key, JSON.stringify(val)) } catch {} },
  users() { return this.get('users') || [] },
  saveUsers(u) { this.set('users', u) },
  currentUser() { return this.get('currentUser') },
  saveCurrentUser(u) { this.set('currentUser', u) },
  animes() { return this.get('animes') || defaultAnimes },
  saveAnimes(a) { this.set('animes', a) },
  favorites(uid) { return this.get('fav_'+uid) || [] },
  saveFavorites(uid, f) { this.set('fav_'+uid, f) },
  watching(uid) { return this.get('watching_'+uid) || [] },
  saveWatching(uid, f) { this.set('watching_'+uid, f) },
  planned(uid) { return this.get('planned_'+uid) || [] },
  savePlanned(uid, f) { this.set('planned_'+uid, f) },
  completed(uid) { return this.get('completed_'+uid) || [] },
  saveCompleted(uid, f) { this.set('completed_'+uid, f) },
  history(uid) { return this.get('history_'+uid) || [] },
  addHistory(uid, entry) {
    let h = this.history(uid);
    h = h.filter(e => !(e.animeId===entry.animeId && e.ep===entry.ep));
    h.unshift(entry);
    if(h.length > 100) h = h.slice(0,100);
    this.set('history_'+uid, h);
  },
  ratings(uid) { return this.get('ratings_'+uid) || {} },
  saveRating(uid, animeId, r) { let rt=this.ratings(uid); rt[animeId]=r; this.set('ratings_'+uid, rt); },
  comments(animeId) { return this.get('comments_'+animeId) || [] },
  addComment(animeId, c) { let cs=this.comments(animeId); cs.push(c); this.set('comments_'+animeId, cs); },
  watched(uid, animeId) { return this.get('watched_'+uid+'_'+animeId) || [] },
  markWatched(uid, animeId, ep) {
    let w = this.watched(uid, animeId);
    if(!w.includes(ep)) w.push(ep);
    this.set('watched_'+uid+'_'+animeId, w);
  }
};

// ---- DEFAULT ANIMES DATA ----
const defaultAnimes = [
  { id:1, name:'Attack on Titan', nameJp:'進撃の巨人', synopsis:'A humanidade vive aterrorizada dentro de muralhas que protegem contra os Titãs, criaturas gigantescas que devoram humanos. Eren Yeager e seus amigos ingressam no exército para lutar contra eles após um ataque devastador.', cover:'https://cdn.myanimelist.net/images/anime/10/47347.jpg', banner:'https://images4.alphacoders.com/102/1025956.jpg', genres:['Ação','Drama','Fantasia','Mistério'], year:2013, status:'finished', score:9.0, episodes:87, type:'TV', views:980000 },
  { id:2, name:'Fullmetal Alchemist: Brotherhood', nameJp:'鋼の錬金術師', synopsis:'Dois irmãos alquimistas buscam a Pedra Filosofal para recuperar seus corpos perdidos em uma transmutação humana proibida, enquanto descobrem uma conspiração que ameaça o mundo.', cover:'https://cdn.myanimelist.net/images/anime/1223/96541.jpg', banner:'https://wallpapers.com/images/featured/fullmetal-alchemist-brotherhood-pictures-cjajamrx1cxnrpqv.jpg', genres:['Ação','Aventura','Fantasia','Drama'], year:2009, status:'finished', score:9.1, episodes:64, type:'TV', views:920000 },
  { id:3, name:'Death Note', nameJp:'デスノート', synopsis:'Um caderno sobrenatural cai nas mãos de Light Yagami, que decide usá-lo para eliminar criminosos. Mas um detetive genial chamado L começa a investigar a série de mortes misteriosas.', cover:'https://cdn.myanimelist.net/images/anime/9/9453.jpg', banner:'https://wallpapers.com/images/featured/death-note-pictures-f94ef18t1d91tnwz.jpg', genres:['Suspense','Sobrenatural','Psicológico'], year:2006, status:'finished', score:8.6, episodes:37, type:'TV', views:890000 },
  { id:4, name:'Demon Slayer', nameJp:'鬼滅の刃', synopsis:'Tanjiro Kamado se torna um Caçador de Demônios após sua família ser massacrada e sua irmã transformada em demônio. Uma aventura épica repleta de lutas incríveis e emoções intensas.', cover:'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', banner:'https://wallpapers.com/images/featured/demon-slayer-4k-pictures-3xg08rjb4wqvlqnt.jpg', genres:['Ação','Aventura','Sobrenatural','Histórico'], year:2019, status:'ongoing', score:8.7, episodes:44, type:'TV', views:870000 },
  { id:5, name:'One Piece', nameJp:'ワンピース', synopsis:'Monkey D. Luffy quer se tornar o Rei dos Piratas. Junto com sua tripulação, ele navega pelo Grand Line em busca do lendário tesouro One Piece, enfrentando desafios épicos.', cover:'https://cdn.myanimelist.net/images/anime/6/73245.jpg', banner:'https://wallpapers.com/images/featured/one-piece-pictures-yue5bo95v0lnpxhb.jpg', genres:['Aventura','Comédia','Ação','Fantasia'], year:1999, status:'ongoing', score:8.7, episodes:1070, type:'TV', views:1100000 },
  { id:6, name:'Hunter x Hunter', nameJp:'ハンター×ハンター', synopsis:'Gon Freecss decide se tornar um Hunter para encontrar seu pai. Durante sua jornada, faz amizades profundas e enfrenta desafios que colocam à prova seus limites físicos e mentais.', cover:'https://cdn.myanimelist.net/images/anime/11/33657.jpg', banner:'https://wallpapers.com/images/featured/hunter-x-hunter-pictures-8y3l0i7x4fsjp1vc.jpg', genres:['Ação','Aventura','Fantasia'], year:2011, status:'finished', score:9.0, episodes:148, type:'TV', views:780000 },
  { id:7, name:'Naruto Shippuden', nameJp:'ナルト 疾風伝', synopsis:'Naruto Uzumaki retorna ao vilarejo da Folha após anos de treinamento. Agora ele deve enfrentar ameaças ainda maiores para proteger seus entes queridos e realizar seu sonho de se tornar Hokage.', cover:'https://cdn.myanimelist.net/images/anime/1565/111305.jpg', banner:'https://wallpapers.com/images/featured/naruto-shippuden-pictures-6hkqbh9b3qhnbqpv.jpg', genres:['Ação','Aventura','Artes Marciais','Sobrenatural'], year:2007, status:'finished', score:8.2, episodes:500, type:'TV', views:950000 },
  { id:8, name:'Steins;Gate', nameJp:'シュタインズ・ゲート', synopsis:'Um grupo de amigos acidentalmente cria uma forma de enviar mensagens para o passado. O que começa como uma aventura científica se torna uma luta desesperada contra o tempo e a morte.', cover:'https://cdn.myanimelist.net/images/anime/5/73199.jpg', banner:'https://wallpapers.com/images/featured/steins-gate-pictures-5kb9dgnpwl6t1vc8.jpg', genres:['Sci-Fi','Suspense','Drama','Psicológico'], year:2011, status:'finished', score:9.1, episodes:24, type:'TV', views:650000 },
  { id:9, name:'Jujutsu Kaisen', nameJp:'呪術廻戦', synopsis:'Yuji Itadori engole um dedo amaldiçoado de um poderoso demônio e acaba se tornando seu hospedeiro. Agora ele deve lutar como Feiticeiro de Jujutsu para exorcizar maldições.', cover:'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', banner:'https://wallpapers.com/images/featured/jujutsu-kaisen-pictures-7t1bqqz2f3bn9f7z.jpg', genres:['Ação','Sobrenatural','Escola'], year:2020, status:'ongoing', score:8.6, episodes:48, type:'TV', views:760000 },
  { id:10, name:'Dragon Ball Z', nameJp:'ドラゴンボールZ', synopsis:'Goku e seus amigos continuam protegendo a Terra contra ameaças cada vez mais poderosas, desde Saiyajins invasores até vilões galácticos e demônios de outras dimensões.', cover:'https://cdn.myanimelist.net/images/anime/1607/117271.jpg', banner:'https://wallpapers.com/images/featured/dragon-ball-z-pictures-kl60l0f1t1ib5c98.jpg', genres:['Ação','Aventura','Comédia','Fantasia'], year:1989, status:'finished', score:8.0, episodes:291, type:'TV', views:1200000 },
  { id:11, name:'Sword Art Online', nameJp:'ソードアート・オンライン', synopsis:'Kirito está preso em um jogo de realidade virtual onde a morte no jogo significa morte real. Junto com Asuna, ele luta para chegar ao andar 100 e libertar os jogadores presos.', cover:'https://cdn.myanimelist.net/images/anime/11/39717.jpg', banner:'https://wallpapers.com/images/featured/sword-art-online-pictures-00cuwmxb0c2mua3m.jpg', genres:['Ação','Aventura','Romance','Fantasia'], year:2012, status:'finished', score:7.2, episodes:25, type:'TV', views:700000 },
  { id:12, name:'My Hero Academia', nameJp:'僕のヒーローアカデミア', synopsis:'Em um mundo onde a maioria das pessoas tem superpoderes, Izuku Midoriya nasce sem nenhum. Mas o maior herói de todos lhe passa seu poder, e Izuku começa sua jornada para se tornar um herói.', cover:'https://cdn.myanimelist.net/images/anime/10/78745.jpg', banner:'https://wallpapers.com/images/featured/my-hero-academia-pictures-fqkdpq53q5lkhf3a.jpg', genres:['Ação','Escola','Comédia','Super-Herói'], year:2016, status:'ongoing', score:7.9, episodes:113, type:'TV', views:680000 },
  { id:13, name:'Evangelion', nameJp:'新世紀エヴァンゲリオン', synopsis:'Shinji Ikari é convocado para pilotar um robô gigante chamado EVA para combater seres misteriosos conhecidos como Anjos. Uma obra-prima que explora temas psicológicos profundos.', cover:'https://cdn.myanimelist.net/images/anime/1314/108941.jpg', banner:'https://wallpapers.com/images/featured/neon-genesis-evangelion-pictures-s8ebn7xi7qbap4me.jpg', genres:['Ação','Sci-Fi','Drama','Psicológico','Mecha'], year:1995, status:'finished', score:8.5, episodes:26, type:'TV', views:540000 },
  { id:14, name:'Bleach', nameJp:'ブリーチ', synopsis:'Ichigo Kurosaki, um adolescente capaz de ver fantasmas, acidentalmente se torna um Shinigami. Agora ele deve proteger os humanos das criaturas Hollow enquanto equilibra sua vida normal.', cover:'https://cdn.myanimelist.net/images/anime/3/40451.jpg', banner:'https://wallpapers.com/images/featured/bleach-pictures-1a8k2y7n3xqg2p9h.jpg', genres:['Ação','Aventura','Sobrenatural'], year:2004, status:'ongoing', score:7.9, episodes:366, type:'TV', views:720000 },
  { id:15, name:'Vinland Saga', nameJp:'ヴィンランド・サガ', synopsis:'Thorfinn busca vingança contra o mercenário que assassinou seu pai. Uma saga épica de vikings ambientada na Europa medieval, com batalhas brutais e uma profunda reflexão sobre a guerra.', cover:'https://cdn.myanimelist.net/images/anime/1500/103005.jpg', banner:'https://wallpapers.com/images/featured/vinland-saga-pictures-uw0e2mt3q1kh6f2j.jpg', genres:['Ação','Aventura','Drama','Histórico'], year:2019, status:'ongoing', score:8.7, episodes:48, type:'TV', views:480000 },
  { id:16, name:'Spy × Family', nameJp:'スパイファミリー', synopsis:'Um espião de elite deve criar uma família falsa para completar uma missão. Ele adota uma garota que é telépata e se casa com uma assassina, sem nenhum saber os segredos dos outros.', cover:'https://cdn.myanimelist.net/images/anime/1441/122795.jpg', banner:'https://wallpapers.com/images/featured/spy-x-family-pictures-z7a5q8wb1d2nf3he.jpg', genres:['Ação','Comédia','Família','Escola'], year:2022, status:'ongoing', score:8.5, episodes:37, type:'TV', views:560000 },
];

const allGenres = ['Ação','Aventura','Comédia','Drama','Fantasia','Romance','Sci-Fi','Terror','Sobrenatural','Suspense','Psicológico','Mecha','Escola','Histórico','Artes Marciais','Mistério'];
const avatars = [
  'https://api.dicebear.com/7.x/anime/svg?seed=Felix',
  'https://api.dicebear.com/7.x/anime/svg?seed=Lily',
  'https://api.dicebear.com/7.x/anime/svg?seed=Akira',
  'https://api.dicebear.com/7.x/anime/svg?seed=Sora',
  'https://api.dicebear.com/7.x/anime/svg?seed=Kira',
];

// ---- STATE ----
let state = {
  currentPage: 'home',
  heroIndex: 0,
  heroTimer: null,
  activeGenre: '',
  searchQuery: '',
  currentAnimeId: null,
  currentEpNum: null,
  theme: localStorage.getItem('av_theme') || 'dark',
  activeListTab: 'favorites',
};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  renderHeader();
  initHome();
  populateFilters();
});

// ---- THEME ----
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('av_theme', state.theme);
  applyTheme(state.theme);
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : '');
}

// ---- NAVIGATION ----
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-'+page)?.classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  state.currentPage = page;
  window.scrollTo({top:0, behavior:'smooth'});
  if(page==='catalog') renderCatalog();
  if(page==='recent') renderRecentPage();
  if(page==='favorites') renderFavoritesPage();
}

// ---- HEADER USER ----
function renderHeader() {
  const u = DB.currentUser();
  const area = document.getElementById('user-area');
  if(u) {
    area.innerHTML = `
      <div class="user-menu">
        <img class="user-avatar-btn" src="${u.avatar||avatars[0]}" onclick="openProfile()" title="Perfil">
        <span class="user-name-btn" onclick="openProfile()">${u.name.split(' ')[0]}</span>
        ${u.isAdmin ? `<button class="admin-btn" onclick="openAdmin()">⚙ Admin</button>` : ''}
        <button class="btn-logout" onclick="doLogout()">Sair</button>
      </div>`;
  } else {
    area.innerHTML = `
      <button class="btn-login" onclick="openModal('modal-login')">Entrar</button>
      <button class="btn-register" onclick="openModal('modal-register')">Cadastrar</button>`;
  }
}

// ---- AUTH ----
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  if(!email||!pass){ notify('Preencha todos os campos','error'); return; }
  const users = DB.users();
  // Auto-create admin if first login with admin@aniverse.com
  if(email==='admin@aniverse.com' && pass==='admin123') {
    const admUser = users.find(u=>u.email===email) || {id:Date.now(),name:'Administrador',email,password:hashPass(pass),avatar:avatars[4],isAdmin:true};
    if(!users.find(u=>u.email===email)) { users.push(admUser); DB.saveUsers(users); }
    DB.saveCurrentUser(admUser);
    closeModal('modal-login'); renderHeader(); notify('Bem-vindo, Admin! 🎉','success'); return;
  }
  const user = users.find(u => u.email===email && u.password===hashPass(pass));
  if(!user){ notify('Email ou senha incorretos','error'); return; }
  DB.saveCurrentUser(user);
  closeModal('modal-login'); renderHeader(); notify(`Bem-vindo de volta, ${user.name.split(' ')[0]}! 🎉`,'success');
}
function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  if(!name||!email||!pass){ notify('Preencha todos os campos','error'); return; }
  if(pass.length < 6){ notify('Senha deve ter ao menos 6 caracteres','error'); return; }
  const users = DB.users();
  if(users.find(u=>u.email===email)){ notify('Email já cadastrado','error'); return; }
  const user = { id:Date.now(), name, email, password:hashPass(pass), avatar:avatars[Math.floor(Math.random()*avatars.length)], isAdmin:false };
  users.push(user); DB.saveUsers(users); DB.saveCurrentUser(user);
  closeModal('modal-register'); renderHeader(); notify(`Conta criada com sucesso! Bem-vindo, ${name.split(' ')[0]}! 🎉`,'success');
}
function doRecover() {
  const email = document.getElementById('rec-email').value.trim();
  if(!email){ notify('Digite seu email','error'); return; }
  notify('Se o email existir, você receberá um link de recuperação 📧','info');
  closeModal('modal-recover');
}
function doLogout() {
  DB.saveCurrentUser(null);
  renderHeader();
  notify('Você saiu da conta','info');
  navigateTo('home');
}
function hashPass(p) { let h=0; for(let c of p){h=((h<<5)-h)+c.charCodeAt(0);h|=0} return h.toString(16); }

// ---- HOME ----
function initHome() {
  const animes = DB.animes();
  renderHeroCarousel(animes.slice(0,5));
  renderScrollRow('popular-grid', [...animes].sort((a,b)=>b.views-a.views).slice(0,12));
  renderScrollRow('recent-grid', [...animes].sort((a,b)=>b.year-a.year).slice(0,12));
  renderGenrePills();
  renderRanking([...animes].sort((a,b)=>b.score-a.score).slice(0,10));
}

// ---- HERO ----
function renderHeroCarousel(animes) {
  const slidesEl = document.getElementById('hero-slides');
  const dotsEl = document.getElementById('hero-dots');
  slidesEl.innerHTML = animes.map((a,i) => `
    <div class="hero-slide" onclick="if(event.target.tagName!=='BUTTON'){}">
      <div class="hero-slide-bg" style="background-image:url(${a.banner||a.cover})"></div>
      <div class="hero-slide-overlay"></div>
      <div class="hero-slide-content">
        <span class="hero-badge">✦ Em Destaque</span>
        <h1 class="hero-title">${a.name}</h1>
        <div class="hero-meta">
          <span class="stars">${'★'.repeat(Math.round(a.score/2))}${'☆'.repeat(5-Math.round(a.score/2))}</span>
          <span>${a.score}/10</span>
          <span>•</span>
          <span>${a.year}</span>
          <span>•</span>
          <span>${a.episodes} eps</span>
        </div>
        <div class="hero-genres">${a.genres.slice(0,3).map(g=>`<span class="hero-genre">${g}</span>`).join('')}</div>
        <p class="hero-synopsis">${a.synopsis}</p>
        <div class="hero-actions">
          <button class="btn-hero-watch" onclick="openEpisode(${a.id},1)">▶ Assistir Agora</button>
          <button class="btn-hero-info" onclick="openAnimeDetail(${a.id})">ℹ Saiba Mais</button>
        </div>
      </div>
    </div>`).join('');
  dotsEl.innerHTML = animes.map((_,i)=>`<div class="hero-dot${i===0?' active':''}" onclick="goToSlide(${i})"></div>`).join('');
  startHeroTimer();
}
function startHeroTimer() {
  clearInterval(state.heroTimer);
  state.heroTimer = setInterval(nextSlide, 5000);
}
function goToSlide(i) {
  const slides = document.getElementById('hero-slides');
  const n = document.querySelectorAll('.hero-slide').length;
  state.heroIndex = (i+n)%n;
  slides.style.transform = `translateX(-${state.heroIndex*100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d,j)=>d.classList.toggle('active',j===state.heroIndex));
  startHeroTimer();
}
function nextSlide() { goToSlide(state.heroIndex+1); }
function prevSlide() { goToSlide(state.heroIndex-1); }

// ---- ANIME CARD ----
function animeCard(a, extraClass='') {
  const u = DB.currentUser();
  const favs = u ? DB.favorites(u.id) : [];
  const isFav = favs.includes(a.id);
  return `
    <div class="anime-card ${extraClass}" onclick="openAnimeDetail(${a.id})">
      <div class="card-thumb">
        <img src="${a.cover}" alt="${a.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x280/111827/e63946?text=Sem+Capa'">
        <div class="card-overlay">
          <div class="card-overlay-actions">
            <span class="btn-card-play" onclick="event.stopPropagation();openEpisode(${a.id},1)">▶ Assistir</span>
            <span class="btn-card-fav ${isFav?'active':''}" onclick="event.stopPropagation();toggleFavorite(${a.id},this)" title="${isFav?'Remover dos favoritos':'Adicionar aos favoritos'}">${isFav?'❤':'♡'}</span>
          </div>
        </div>
        <span class="card-status ${a.status==='ongoing'?'status-ongoing':'status-finished'}">${a.status==='ongoing'?'Em Andamento':'Finalizado'}</span>
        <span class="card-score">★ ${a.score}</span>
      </div>
      <div class="card-info">
        <div class="card-title">${a.name}</div>
        <div class="card-meta">
          <span>${a.year}</span>
          <span>•</span>
          <span>${a.episodes} eps</span>
          <span class="card-genre-tag">${a.genres[0]||''}</span>
        </div>
      </div>
    </div>`;
}

function renderScrollRow(containerId, animes) {
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = animes.map(a => animeCard(a)).join('');
}
function renderGrid(containerId, animes) {
  const el = document.getElementById(containerId);
  if(!el) return;
  if(!animes.length) { el.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><h3>Nenhum anime encontrado</h3><p>Tente outros filtros ou termos de pesquisa.</p></div>`; return; }
  el.innerHTML = animes.map(a => animeCard(a)).join('');
}

// ---- GENRES ----
function renderGenrePills() {
  const el = document.getElementById('genre-pills');
  el.innerHTML = allGenres.map(g => `<span class="genre-pill${state.activeGenre===g?' active':''}" onclick="filterByGenre('${g}')">${g}</span>`).join('');
}
function filterByGenre(genre) {
  state.activeGenre = state.activeGenre===genre ? '' : genre;
  renderGenrePills();
  const animes = DB.animes();
  const filtered = state.activeGenre ? animes.filter(a=>a.genres.includes(state.activeGenre)) : [];
  renderGrid('genre-results', filtered);
}

// ---- RANKING ----
function renderRanking(animes) {
  const el = document.getElementById('ranking-list');
  el.innerHTML = animes.map((a,i) => `
    <div class="ranking-item" onclick="openAnimeDetail(${a.id})">
      <span class="rank-num rank-${i+1}">#${i+1}</span>
      <img class="rank-thumb" src="${a.cover}" alt="${a.name}" onerror="this.src='https://via.placeholder.com/50x70/111827/e63946?text=?'">
      <div class="rank-info">
        <div class="rank-title">${a.name}</div>
        <div class="rank-meta">${a.year} · ${a.genres.slice(0,2).join(', ')}</div>
      </div>
      <div class="rank-score">★${a.score}</div>
    </div>`).join('');
}

// ---- CATALOG ----
function populateFilters() {
  const genreSelect = document.getElementById('filter-genre');
  allGenres.forEach(g => { const o=document.createElement('option'); o.value=g; o.textContent=g; genreSelect.appendChild(o); });
  const yearSelect = document.getElementById('filter-year');
  for(let y=2024;y>=1985;y--){ const o=document.createElement('option'); o.value=y; o.textContent=y; yearSelect.appendChild(o); }
}
function applyFilters() {
  let animes = DB.animes();
  const genre = document.getElementById('filter-genre').value;
  const year = document.getElementById('filter-year').value;
  const status = document.getElementById('filter-status').value;
  const sort = document.getElementById('filter-sort').value;
  if(genre) animes = animes.filter(a=>a.genres.includes(genre));
  if(year) animes = animes.filter(a=>a.year==year);
  if(status) animes = animes.filter(a=>a.status===status);
  if(sort==='popular') animes.sort((a,b)=>b.views-a.views);
  else if(sort==='recent') animes.sort((a,b)=>b.year-a.year);
  else if(sort==='rating') animes.sort((a,b)=>b.score-a.score);
  else if(sort==='az') animes.sort((a,b)=>a.name.localeCompare(b.name));
  renderGrid('catalog-grid', animes);
}
function renderCatalog() { applyFilters(); }
function renderRecentPage() {
  const animes = [...DB.animes()].sort((a,b)=>b.year-a.year);
  renderGrid('recent-page-grid', animes);
}

// ---- FAVORITES ----
function toggleFavorite(animeId, btn) {
  const u = DB.currentUser();
  if(!u) { openModal('modal-login'); notify('Faça login para favoritar','info'); return; }
  let favs = DB.favorites(u.id);
  const isFav = favs.includes(animeId);
  if(isFav) { favs = favs.filter(id=>id!==animeId); notify('Removido dos favoritos','info'); }
  else { favs.push(animeId); notify('Adicionado aos favoritos ❤','success'); }
  DB.saveFavorites(u.id, favs);
  if(btn) { btn.textContent = favs.includes(animeId)?'❤':'♡'; btn.classList.toggle('active', favs.includes(animeId)); }
  if(state.currentPage==='favorites') renderFavoritesPage();
}
function addToList(animeId, list) {
  const u = DB.currentUser();
  if(!u) { openModal('modal-login'); return; }
  const maps = { watching: [DB.watching, DB.saveWatching], planned: [DB.planned, DB.savePlanned], completed: [DB.completed, DB.saveCompleted] };
  const [getter, setter] = maps[list]||[null,null];
  if(!getter) return;
  let arr = getter.call(DB, u.id);
  if(!arr.includes(animeId)) { arr.push(animeId); setter.call(DB, u.id, arr); notify(`Adicionado à lista!`,'success'); }
  else notify('Já está nessa lista','info');
}

function renderFavoritesPage() {
  const u = DB.currentUser();
  const tab = state.activeListTab;
  const content = document.getElementById('favorites-content');
  if(!u) { content.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><h3>Faça login</h3><p>Você precisa estar logado para ver suas listas.</p></div>`; return; }
  const animes = DB.animes();
  let ids = [];
  if(tab==='favorites') ids = DB.favorites(u.id);
  else if(tab==='watching') ids = DB.watching(u.id);
  else if(tab==='planned') ids = DB.planned(u.id);
  else if(tab==='completed') ids = DB.completed(u.id);
  else if(tab==='history') {
    const history = DB.history(u.id);
    if(!history.length) { content.innerHTML = `<div class="empty-state"><div class="empty-icon">⏱</div><h3>Histórico vazio</h3><p>Assista episódios para ver o histórico aqui.</p></div>`; return; }
    content.innerHTML = `<div style="display:grid;gap:0.75rem">${history.slice(0,20).map(h=>{
      const a = animes.find(x=>x.id===h.animeId)||{};
      return `<div class="ranking-item" onclick="openAnimeDetail(${h.animeId})"><img class="rank-thumb" src="${a.cover||''}" onerror="this.src='https://via.placeholder.com/50x70'"><div class="rank-info"><div class="rank-title">${a.name||'?'}</div><div class="rank-meta">Episódio ${h.ep} · ${h.date}</div></div><button class="btn-secondary" style="font-size:0.8rem;padding:0.3rem 0.7rem" onclick="event.stopPropagation();openEpisode(${h.animeId},${h.ep})">▶</button></div>`;
    }).join('')}</div>`; return;
  }
  const filtered = animes.filter(a=>ids.includes(a.id));
  if(!filtered.length) { content.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><h3>Lista vazia</h3><p>Adicione animes à sua lista!</p></div>`; return; }
  content.innerHTML = `<div class="anime-grid">${filtered.map(a=>animeCard(a)).join('')}</div>`;
}
function switchListTab(tab, btn) {
  state.activeListTab = tab;
  document.querySelectorAll('.list-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  renderFavoritesPage();
}

// ---- SEARCH ----
function searchAnimes(query) {
  state.searchQuery = query;
  const dropdown = document.getElementById('search-dropdown');
  if(!query || query.length < 2) { dropdown.classList.add('hidden'); return; }
  const results = DB.animes().filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.genres.some(g=>g.toLowerCase().includes(query.toLowerCase()))).slice(0,6);
  if(!results.length) { dropdown.classList.add('hidden'); return; }
  dropdown.innerHTML = results.map(a => `
    <div class="search-dropdown-item" onclick="openAnimeDetail(${a.id});document.getElementById('search-dropdown').classList.add('hidden');document.getElementById('search-input').value=''">
      <img src="${a.cover}" onerror="this.src='https://via.placeholder.com/36x50'">
      <div class="info"><strong>${a.name}</strong><span>${a.year} · ${a.genres[0]}</span></div>
    </div>`).join('');
  dropdown.classList.remove('hidden');
}
document.addEventListener('click', e => {
  if(!e.target.closest('.search-bar')) document.getElementById('search-dropdown')?.classList.add('hidden');
});

// ---- ANIME DETAIL ----
function openAnimeDetail(animeId) {
  const a = DB.animes().find(x=>x.id===animeId);
  if(!a) return;
  state.currentAnimeId = animeId;
  const u = DB.currentUser();
  const favs = u ? DB.favorites(u.id) : [];
  const isFav = favs.includes(a.id);
  const userRating = u ? (DB.ratings(u.id)[a.id]||0) : 0;
  const comments = DB.comments(a.id);
  const recommendations = DB.animes().filter(x => x.id!==a.id && x.genres.some(g=>a.genres.includes(g))).sort(()=>Math.random()-0.5).slice(0,8);
  const epCount = Math.min(a.episodes, 50);
  const watchedEps = u ? DB.watched(u.id, a.id) : [];

  const content = document.getElementById('modal-anime-content');
  content.innerHTML = `
    <button class="anime-detail-close modal-close" onclick="closeModal('modal-anime')">✕</button>
    <div class="anime-detail">
      <div class="anime-banner">
        <img src="${a.banner||a.cover}" onerror="this.src='${a.cover}'" alt="${a.name}">
        <div class="anime-banner-overlay"></div>
      </div>
      <div class="anime-detail-body">
        <div class="anime-poster"><img src="${a.cover}" alt="${a.name}" onerror="this.src='https://via.placeholder.com/180x250/111827/e63946?text=No+Cover'"></div>
        <div class="anime-info-main">
          <h1 class="anime-title-main">${a.name}</h1>
          <div class="anime-meta-row">
            <span>⭐ ${a.score}/10</span>
            <span>📅 ${a.year}</span>
            <span>🎬 ${a.episodes} eps</span>
            <span>📺 ${a.type||'TV'}</span>
            <span class="card-status ${a.status==='ongoing'?'status-ongoing':'status-finished'}" style="position:static">${a.status==='ongoing'?'Em Andamento':'Finalizado'}</span>
          </div>
          <div class="anime-genres-row">${a.genres.map(g=>`<span class="anime-genre-badge">${g}</span>`).join('')}</div>
          <p class="anime-synopsis">${a.synopsis}</p>
          <div class="anime-actions-row">
            <button class="btn-primary" onclick="openEpisode(${a.id},1)">▶ Assistir EP 1</button>
            <button class="btn-secondary" id="fav-btn-${a.id}" onclick="toggleFavorite(${a.id},this)">${isFav?'❤ Favorito':'♡ Favoritar'}</button>
            <button class="btn-secondary" onclick="addToList(${a.id},'watching')">▶ Assistindo</button>
            <button class="btn-secondary" onclick="addToList(${a.id},'planned')">📌 Planejar</button>
            <button class="btn-secondary" onclick="addToList(${a.id},'completed')">✓ Concluído</button>
          </div>
          <div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem">Sua avaliação:</p>
            <div class="star-rating" id="star-rating-${a.id}">${[1,2,3,4,5].map(s=>`<span class="star ${userRating>=s?'active':''}" onclick="rateAnime(${a.id},${s})" onmouseover="previewRating(${a.id},${s})" onmouseout="resetRating(${a.id},${userRating})">★</span>`).join('')}</div>
          </div>
        </div>
      </div>
      <div style="padding:0 1.5rem 1.5rem">
        <div class="episodes-section">
          <h3>📺 Episódios (${a.episodes})</h3>
          <div class="episodes-grid">${Array.from({length:epCount},(_,i)=>i+1).map(ep=>`<div class="episode-btn ${watchedEps.includes(ep)?'watched':''}" onclick="openEpisode(${a.id},${ep})">Ep ${ep}</div>`).join('')}${a.episodes>50?`<div class="episode-btn" style="cursor:default;opacity:0.5">+${a.episodes-50} mais</div>`:''}</div>
        </div>
        <div class="recommendations">
          <h3>💡 Recomendações</h3>
          <div class="rec-grid">${recommendations.map(r=>`<div class="rec-card" onclick="openAnimeDetail(${r.id})"><img src="${r.cover}" onerror="this.src='https://via.placeholder.com/120x160'"><span>${r.name}</span></div>`).join('')}</div>
        </div>
        <div class="comments-section">
          <h3>💬 Comentários (${comments.length})</h3>
          ${u ? `<div class="comment-form"><textarea id="comment-input-${a.id}" placeholder="Deixe seu comentário sobre ${a.name}..." rows="3"></textarea><div class="comment-form-actions"><button class="btn-primary" onclick="submitComment(${a.id})">Enviar Comentário</button></div></div>` : `<p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:1rem"><a onclick="openModal('modal-login')">Faça login</a> para comentar.</p>`}
          <div id="comments-list-${a.id}">${renderComments(a.id)}</div>
        </div>
      </div>
    </div>`;
  openModal('modal-anime');
}

function renderComments(animeId) {
  const cs = DB.comments(animeId);
  if(!cs.length) return `<p style="color:var(--text-muted);font-size:0.875rem">Nenhum comentário ainda. Seja o primeiro!</p>`;
  return cs.map(c => `
    <div class="comment-item">
      <div class="comment-avatar"><img src="${c.avatar||avatars[0]}" onerror="this.src='${avatars[0]}'"></div>
      <div class="comment-body">
        <div class="comment-author">${c.author}</div>
        <div class="comment-text">${c.text}</div>
        <div class="comment-date">${c.date}</div>
      </div>
    </div>`).join('');
}

function submitComment(animeId) {
  const u = DB.currentUser();
  if(!u) return;
  const input = document.getElementById(`comment-input-${animeId}`);
  const text = input.value.trim();
  if(!text) { notify('Digite algo para comentar','error'); return; }
  DB.addComment(animeId, { author:u.name, avatar:u.avatar, text, date: new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}) });
  input.value = '';
  document.getElementById(`comments-list-${animeId}`).innerHTML = renderComments(animeId);
  notify('Comentário enviado! 💬','success');
}

function rateAnime(animeId, rating) {
  const u = DB.currentUser();
  if(!u) { openModal('modal-login'); return; }
  DB.saveRating(u.id, animeId, rating);
  notify(`Você avaliou com ${rating} estrela${rating>1?'s':''}! ⭐`,'success');
  updateStarDisplay(animeId, rating);
}
function previewRating(animeId, r) { updateStarDisplay(animeId, r, true); }
function resetRating(animeId, r) { updateStarDisplay(animeId, r); }
function updateStarDisplay(animeId, r, preview=false) {
  const stars = document.querySelectorAll(`#star-rating-${animeId} .star`);
  stars.forEach((s,i) => s.classList.toggle('active', i<r));
}

// ---- EPISODE PLAYER ----
function openEpisode(animeId, epNum) {
  const a = DB.animes().find(x=>x.id===animeId);
  if(!a) return;
  state.currentAnimeId = animeId;
  state.currentEpNum = epNum;
  const u = DB.currentUser();
  if(u) {
    DB.markWatched(u.id, animeId, epNum);
    DB.addHistory(u.id, { animeId, ep:epNum, date: new Date().toLocaleDateString('pt-BR') });
  }
  const hasPrev = epNum > 1;
  const hasNext = epNum < Math.min(a.episodes, 50);
  const content = document.getElementById('modal-episode-content');
  content.innerHTML = `
    <div class="episode-player-wrap" style="position:relative">
      <button class="episode-close modal-close" onclick="closeModal('modal-episode')" style="position:absolute;top:0.75rem;right:0.75rem;z-index:10">✕</button>
      <div class="video-placeholder">
        <div class="play-big-btn" id="fake-play-btn" onclick="startPlayback(${animeId},${epNum})">▶</div>
        <p style="color:var(--text-secondary);font-size:0.9rem">Episódio ${epNum} — Clique para reproduzir</p>
        <p style="color:var(--text-muted);font-size:0.78rem;margin-top:0.5rem">🔗 Player de demonstração (integre com sua API de vídeo)</p>
      </div>
      <div class="episode-info-bar">
        <div>
          <div class="episode-title-bar">${a.name} — Episódio ${epNum}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">${a.type||'TV'} · ${a.year}</div>
        </div>
        <div class="episode-nav">
          ${hasPrev?`<button class="btn-secondary" onclick="openEpisode(${animeId},${epNum-1})" style="font-size:0.85rem;padding:0.4rem 0.9rem">‹ Anterior</button>`:''}
          ${hasNext?`<button class="btn-primary" onclick="openEpisode(${animeId},${epNum+1})" style="font-size:0.85rem;padding:0.4rem 0.9rem">Próximo ›</button>`:''}
        </div>
      </div>
      <div style="padding:1rem 1.5rem">
        <p style="font-size:0.85rem;color:var(--text-secondary)">${a.synopsis.slice(0,200)}...</p>
        <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
          ${Array.from({length:Math.min(a.episodes,20)},(_,i)=>i+1).map(ep=>`<button class="episode-btn ${ep===epNum?'current':''} ${u&&DB.watched(u.id,animeId).includes(ep)?'watched':''}" onclick="openEpisode(${animeId},${ep})" style="min-width:50px">Ep${ep}</button>`).join('')}
          ${a.episodes>20?`<span style="color:var(--text-muted);font-size:0.8rem;padding:0.4rem">+${a.episodes-20} mais...</span>`:''}
        </div>
      </div>
    </div>`;
  closeModal('modal-anime');
  openModal('modal-episode');
}
function startPlayback(animeId, epNum) {
  const btn = document.getElementById('fake-play-btn');
  const vp = btn?.closest('.video-placeholder');
  if(!vp) return;
  vp.innerHTML = `
    <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;aspect-ratio:16/9;background:linear-gradient(135deg,#050810,#0a0520)">
      <div style="font-size:3rem">📺</div>
      <p style="color:#fff;font-size:1rem;font-weight:700">Reproduzindo Episódio ${epNum}</p>
      <p style="color:var(--text-muted);font-size:0.8rem">Integre com JWPlayer, VideoJS ou sua CDN de vídeos</p>
      <div style="width:200px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:0.5rem"><div style="width:30%;height:100%;background:var(--accent);border-radius:2px;animation:playbar 10s linear forwards"></div></div>
    </div>`;
  const style = document.createElement('style');
  style.textContent = '@keyframes playbar{from{width:0}to{width:100%}}';
  document.head.appendChild(style);
}

// ---- PROFILE ----
function openProfile() {
  const u = DB.currentUser();
  if(!u) { openModal('modal-login'); return; }
  const favs = DB.favorites(u.id).length;
  const watched = DB.watching(u.id).length;
  const completed = DB.completed(u.id).length;
  document.getElementById('modal-profile-content').innerHTML = `
    <div class="profile-header">
      <img class="profile-avatar" src="${u.avatar}" onerror="this.src='${avatars[0]}'" alt="${u.name}">
      <div class="profile-name">${u.name}</div>
      <div class="profile-email">${u.email}</div>
      ${u.isAdmin?'<span style="background:var(--accent-purple);color:#fff;font-size:0.75rem;padding:0.2rem 0.6rem;border-radius:100px;margin-top:0.4rem;display:inline-block">⚙ Administrador</span>':''}
    </div>
    <div class="profile-stats">
      <div class="stat-item"><div class="stat-num">${favs}</div><div class="stat-label">Favoritos</div></div>
      <div class="stat-item"><div class="stat-num">${watched}</div><div class="stat-label">Assistindo</div></div>
      <div class="stat-item"><div class="stat-num">${completed}</div><div class="stat-label">Concluídos</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <h4 style="font-family:var(--font-display);font-size:0.85rem;color:var(--text-muted)">AVATAR</h4>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap">${avatars.map((av,i)=>`<img src="${av}" onclick="changeAvatar('${av}')" style="width:46px;height:46px;border-radius:50%;cursor:pointer;border:2px solid ${u.avatar===av?'var(--accent)':'var(--border)'};transition:var(--transition)" onerror="this.style.display='none'">`).join('')}</div>
      <button class="btn-danger" onclick="doLogout();closeModal('modal-profile')">Sair da conta</button>
    </div>`;
  openModal('modal-profile');
}
function changeAvatar(av) {
  const u = DB.currentUser();
  if(!u) return;
  u.avatar = av;
  DB.saveCurrentUser(u);
  const users = DB.users();
  const idx = users.findIndex(x=>x.id===u.id);
  if(idx>-1) { users[idx]=u; DB.saveUsers(users); }
  openProfile();
  renderHeader();
  notify('Avatar atualizado! 🎨','success');
}

// ---- ADMIN ----
function openAdmin() {
  const u = DB.currentUser();
  if(!u||!u.isAdmin) { notify('Acesso negado','error'); return; }
  renderAdminPanel();
  openModal('modal-admin');
}
function renderAdminPanel() {
  const animes = DB.animes();
  const users = DB.users();
  document.getElementById('modal-admin-content').innerHTML = `
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="adminTab('stats',this)">📊 Estatísticas</button>
      <button class="admin-tab" onclick="adminTab('add',this)">➕ Adicionar Anime</button>
      <button class="admin-tab" onclick="adminTab('manage',this)">📋 Gerenciar Animes</button>
      <button class="admin-tab" onclick="adminTab('users',this)">👥 Usuários</button>
    </div>
    <div id="admin-stats" class="admin-section active">
      <div class="admin-stats-grid">
        <div class="admin-stat"><div class="admin-stat-num">${animes.length}</div><div class="admin-stat-label">Animes</div></div>
        <div class="admin-stat"><div class="admin-stat-num">${users.length}</div><div class="admin-stat-label">Usuários</div></div>
        <div class="admin-stat"><div class="admin-stat-num">${animes.reduce((s,a)=>s+a.episodes,0).toLocaleString()}</div><div class="admin-stat-label">Episódios</div></div>
        <div class="admin-stat"><div class="admin-stat-num">${animes.filter(a=>a.status==='ongoing').length}</div><div class="admin-stat-label">Em Andamento</div></div>
        <div class="admin-stat"><div class="admin-stat-num">${(animes.reduce((s,a)=>s+a.score,0)/animes.length).toFixed(1)}</div><div class="admin-stat-label">Score Médio</div></div>
        <div class="admin-stat"><div class="admin-stat-num">${(animes.reduce((s,a)=>s+a.views,0)/1000).toFixed(0)}k</div><div class="admin-stat-label">Visualizações</div></div>
      </div>
      <h4 style="font-family:var(--font-display);font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem">TOP ANIMES POR VIEWS</h4>
      <table class="admin-table"><thead><tr><th>#</th><th>Nome</th><th>Score</th><th>Status</th><th>Views</th></tr></thead><tbody>
      ${[...animes].sort((a,b)=>b.views-a.views).slice(0,8).map((a,i)=>`<tr><td>${i+1}</td><td>${a.name}</td><td>⭐ ${a.score}</td><td>${a.status==='ongoing'?'Em Andamento':'Finalizado'}</td><td>${(a.views/1000).toFixed(0)}k</td></tr>`).join('')}
      </tbody></table>
    </div>
    <div id="admin-add" class="admin-section">
      <div class="admin-form-grid">
        <div class="form-group"><label>Nome</label><input type="text" id="adm-name" placeholder="Nome do anime"></div>
        <div class="form-group"><label>Ano</label><input type="number" id="adm-year" placeholder="2024" min="1960" max="2030"></div>
        <div class="form-group full"><label>Sinopse</label><textarea id="adm-synopsis" rows="3" placeholder="Sinopse do anime..."></textarea></div>
        <div class="form-group"><label>URL da Capa</label><input type="url" id="adm-cover" placeholder="https://..."></div>
        <div class="form-group"><label>URL do Banner</label><input type="url" id="adm-banner" placeholder="https://..."></div>
        <div class="form-group"><label>Gêneros (vírgula)</label><input type="text" id="adm-genres" placeholder="Ação, Aventura"></div>
        <div class="form-group"><label>Episódios</label><input type="number" id="adm-eps" placeholder="12" min="1"></div>
        <div class="form-group"><label>Status</label><select id="adm-status"><option value="ongoing">Em Andamento</option><option value="finished">Finalizado</option></select></div>
        <div class="form-group"><label>Score (0-10)</label><input type="number" id="adm-score" placeholder="8.5" min="0" max="10" step="0.1"></div>
        <div class="form-group"><label>Tipo</label><select id="adm-type"><option>TV</option><option>Filme</option><option>OVA</option><option>Especial</option></select></div>
      </div>
      <button class="btn-primary" onclick="adminAddAnime()">➕ Adicionar Anime</button>
    </div>
    <div id="admin-manage" class="admin-section">
      <table class="admin-table"><thead><tr><th>ID</th><th>Nome</th><th>Ano</th><th>Score</th><th>Ações</th></tr></thead><tbody>
      ${animes.slice(0,20).map(a=>`<tr><td>${a.id}</td><td>${a.name}</td><td>${a.year}</td><td>${a.score}</td><td><button class="btn-danger" onclick="adminDeleteAnime(${a.id})">🗑 Deletar</button></td></tr>`).join('')}
      </tbody></table>
    </div>
    <div id="admin-users" class="admin-section">
      ${users.length ? `<table class="admin-table"><thead><tr><th>Nome</th><th>Email</th><th>Admin</th></tr></thead><tbody>${users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.isAdmin?'✓ Sim':'—'}</td></tr>`).join('')}</tbody></table>` : '<p style="color:var(--text-muted)">Nenhum usuário cadastrado ainda.</p>'}
    </div>`;
}
function adminTab(tab, btn) {
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('admin-'+tab)?.classList.add('active');
  btn.classList.add('active');
}
function adminAddAnime() {
  const name = document.getElementById('adm-name').value.trim();
  const year = parseInt(document.getElementById('adm-year').value)||2024;
  const synopsis = document.getElementById('adm-synopsis').value.trim();
  const cover = document.getElementById('adm-cover').value.trim();
  const banner = document.getElementById('adm-banner').value.trim();
  const genres = document.getElementById('adm-genres').value.split(',').map(g=>g.trim()).filter(Boolean);
  const episodes = parseInt(document.getElementById('adm-eps').value)||12;
  const status = document.getElementById('adm-status').value;
  const score = parseFloat(document.getElementById('adm-score').value)||7.0;
  const type = document.getElementById('adm-type').value;
  if(!name) { notify('Nome obrigatório','error'); return; }
  const animes = DB.animes();
  const newAnime = { id:Date.now(), name, synopsis, cover, banner, genres, year, status, score, episodes, type, views:0 };
  animes.push(newAnime);
  DB.saveAnimes(animes);
  notify(`"${name}" adicionado com sucesso! 🎉`,'success');
  renderAdminPanel();
  adminTab('manage', document.querySelectorAll('.admin-tab')[2]);
}
function adminDeleteAnime(id) {
  if(!confirm('Tem certeza que deseja excluir este anime?')) return;
  let animes = DB.animes().filter(a=>a.id!==id);
  DB.saveAnimes(animes);
  notify('Anime excluído','info');
  renderAdminPanel();
}

// ---- MODALS ----
function openModal(id) {
  document.querySelectorAll('.modal').forEach(m => { if(m.id!==id) m.classList.add('hidden'); });
  document.getElementById(id)?.classList.remove('hidden');
  document.getElementById('modal-overlay')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
  const anyOpen = document.querySelectorAll('.modal:not(.hidden)').length > 0;
  if(!anyOpen) {
    document.getElementById('modal-overlay')?.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
document.getElementById('modal-overlay')?.addEventListener('click', () => {
  document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));
  document.getElementById('modal-overlay')?.classList.add('hidden');
  document.body.style.overflow = '';
});

// ---- NOTIFICATION ----
let notifTimer;
function notify(msg, type='info') {
  const el = document.getElementById('notification');
  el.textContent = type==='success'?'✓ '+msg : type==='error'?'✗ '+msg : 'ℹ '+msg;
  el.className = `notification ${type}`;
  el.classList.remove('hidden');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

// ---- PREMIUM ----
function showPremium() {
  alert('⭐ AniVerse Premium\n\n✓ Sem anúncios\n✓ Qualidade 4K\n✓ Download de episódios\n✓ Acesso antecipado\n✓ Servidor prioritário\n\nR$ 19,90/mês ou R$ 149,90/ano');
}

// ---- MOBILE MENU ----
function toggleMobileMenu() {
  document.getElementById('main-nav')?.classList.toggle('open');
}
