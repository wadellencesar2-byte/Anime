/* =============================================================================
   ██████████████████████████████████████████████████████████████████████████
   conversas.js — BIBLIOTECA DE CONVERSAS PRONTAS DA WC DEV IA
   ██████████████████████████████████████████████████████████████████████████

   Este arquivo é só "conteúdo" — centenas de respostas prontas sobre
   assuntos do dia a dia, gírias, e um glossário técnico. Ele é carregado
   ANTES do app.js (veja o <script> no index.html) e deixa tudo isso
   disponível nas variáveis:

     window.CONVERSAS_SYNONYMS   → dicionário de gírias/abreviações
     window.CONVERSAS_BASE       → assuntos de conversa (o "porte físico"
                                    da conversa: centenas de respostas)
     window.CONVERSAS_GLOSSARY   → glossário técnico ("o que é API" etc.)
     window.CONVERSAS_FALLBACKS  → frases genéricas de apoio

   O app.js usa tudo isso automaticamente. Você NÃO precisa mexer no
   app.js pra ensinar coisas novas — é só editar este arquivo (ou usar o
   Painel Admin > Chat de Treinamento, que continua funcionando igual,
   pra coisas específicas do seu projeto).

   COMO ADICIONAR MAIS ASSUNTOS:
   Copie um bloco desses e cole dentro do array CONVERSAS_BASE:

     {
       keywords: ["palavra1", "palavra2", "frase que ativa a resposta"],
       responses: ["Resposta 1", "Resposta 2 (escolhida ao acaso)"]
     },

   ============================================================================= */


/* =============================================================================
   DICIONÁRIO DE GÍRIAS E ABREVIAÇÕES
   ============================================================================= */

const CONVERSAS_SYNONYMS = {
  "vc": "voce", "vcs": "voces", "ce": "voce", "cê": "voce", "voceh": "voce",
  "tu": "voce", "tas": "esta", "ta": "esta", "tá": "esta", "eh": "e", "eeh": "e",
  "pq": "porque", "pqp": "porque", "npq": "porque", "pk": "porque", "poq": "porque",
  "blz": "beleza", "blza": "beleza", "belezinha": "beleza", "blzinha": "beleza",
  "vlw": "valeu", "vlws": "valeu", "flw": "falou", "fmz": "firmeza", "vlww": "valeu",
  "obg": "obrigado", "obgda": "obrigada", "obrigadao": "obrigado", "obrigadu": "obrigado", "obgd": "obrigado",
  "tbm": "tambem", "tb": "tambem", "tmb": "tambem", "tambm": "tambem",
  "mto": "muito", "mt": "muito", "muinto": "muito", "mtoo": "muito", "mtooo": "muito",
  "pra": "para", "pro": "para o", "pras": "para as", "pros": "para os", "p": "para",
  "q": "que", "qq": "qualquer", "qlqr": "qualquer", "qnd": "quando", "qdo": "quando",
  "cmg": "comigo", "ctg": "contigo",
  "hj": "hoje", "amanh": "amanha",
  "n": "nao", "naum": "nao", "naaao": "nao", "num": "nao", "nn": "nao",
  "s": "sim", "simm": "sim", "simmm": "sim", "sim sim": "sim",
  "kk": "risada", "kkk": "risada", "kkkk": "risada", "kkkkk": "risada", "rs": "risada", "rsrs": "risada", "rsrsrs": "risada",
  "haha": "risada", "hahaha": "risada", "hehe": "risada", "hehehe": "risada",
  "affs": "chateado", "aff": "chateado", "ain": "chateado",
  "vdd": "verdade", "vdde": "verdade", "vdd?": "verdade",
  "dnv": "denovo", "denovo": "denovo", "dnovo": "denovo",
  "cmo": "como", "komo": "como", "cm": "como",
  "kd": "cade", "cade": "cade", "kdê": "cade",
  "top": "otimo", "dahora": "otimo", "maneiro": "otimo", "daora": "otimo", "sinistro": "otimo", "brabo": "otimo", "brabo demais": "otimo", "irado": "otimo", "massa": "otimo", "show de bola": "otimo",
  "mano": "amigo", "mana": "amiga", "parça": "amigo", "parca": "amigo", "parceiro": "amigo",
  "bro": "amigo", "cara": "amigo", "meu chapa": "amigo", "chapa": "amigo", "brother": "amigo",
  "eae": "oi", "eai": "oi", "iae": "oi", "iai": "oi", "salve": "oi", "oii": "oi", "oieee": "oi", "ola": "oi", "olá": "oi", "oiie": "oi", "oioi": "oi", "eaew": "oi", "eaeh": "oi",
  "dboa": "beleza", "suave": "beleza", "suave na nave": "beleza", "de boa": "beleza",
  "pfvr": "por favor", "pfv": "por favor", "porfavor": "por favor", "pfvor": "por favor",
  "wc dev": "wcdev", "wc-dev": "wcdev",
  "vc e": "voce e", "sera que": "sera",
  "add": "adicionar", "att": "atualizar", "config": "configuracao",
  "cel": "celular", "note": "notebook", "compu": "computador", "pc": "computador",
  "insta": "instagram", "zap": "whatsapp", "face": "facebook", "tel": "telefone",
  "vc ta": "voce esta", "to": "estou", "tô": "estou", "tava": "estava", "tamo": "estamos",
  "bj": "beijo", "bjs": "beijos", "abs": "abraco",
  "dms": "demais", "d+": "demais",
  "fds": "fim de semana", "seg": "segunda", "ter": "terca", "qua": "quarta", "qui": "quinta", "sex": "sexta", "sab": "sabado", "dom": "domingo",
  "gnt": "gente", "genti": "gente",
  "mds": "meu deus", "nossa": "nossa senhora",
  "slc": "sei la cara", "sla": "sei la",
  "dlç": "delicia", "delicia": "delicia",
  "vdd mesmo": "verdade mesmo",
  "pow": "poxa", "putz": "poxa", "eita": "poxa",
};


/* =============================================================================
   BASE DE CONVERSA — dezenas de assuntos, cada um com várias respostas
   ============================================================================= */

const CONVERSAS_BASE = [

  // ---------- Saudações e small talk ----------
  { keywords: ["oi", "eae", "e ai", "bom dia", "boa tarde", "boa noite", "fala", "opa", "salve", "oii", "fala ai", "coé"],
    responses: ["Opa! Como posso ajudar por aqui?", "Fala comigo! Em que posso ajudar hoje?", "E aí! Pronto pra ajudar no que precisar.", "Oi! Tudo certo por aqui, me conta o que você precisa.", "Salve! Bora conversar, no que posso ser útil?", "Opa, tudo certo? Manda a sua dúvida."] },
  { keywords: ["tudo bem", "como voce esta", "de boa", "tudo certo", "tudo tranquilo", "como vai voce", "tudo joia", "como estao as coisas", "beleza com voce"],
    responses: ["Por aqui tudo certo! E com você, como estão as coisas?", "Tudo tranquilo! Curioso pra saber, e você, como está?", "Tudo em ordem por aqui. Me conta como você está hoje.", "Tudo certo, rodando redondo! E você, tudo bem?"] },
  { keywords: ["obrigado", "valeu", "brigado", "agradeco", "gratidao", "muito obrigado", "vlw mesmo", "agradecido"],
    responses: ["Disponha! Qualquer coisa é só chamar.", "Por nada! Precisando, tô por aqui.", "De nada! Fico à disposição.", "Fico feliz em ajudar!"] },
  { keywords: ["tchau", "ate mais", "falou", "ate logo", "ate a proxima", "vou nessa", "vou indo", "flw", "ate breve", "nos falamos depois"],
    responses: ["Falou! Até a próxima conversa.", "Até mais! Volta sempre que precisar.", "Beleza, até logo! Foi bom conversar."] },
  { keywords: ["gosto de conversar com voce", "adorei essa conversa", "que papo bom", "curti a conversa"],
    responses: ["Eu também estou gostando dessa conversa! Pode perguntar mais o que quiser."] },
  { keywords: ["boa noite durma bem", "durma bem", "bons sonhos"], responses: ["Descansa bem! Qualquer coisa estou por aqui amanhã.", "Boa noite! Durma bem."] },
  { keywords: ["com licença", "posso perguntar", "posso te perguntar uma coisa", "tenho uma pergunta"],
    responses: ["Pode perguntar à vontade!", "Claro, pode mandar a pergunta.", "Fico à disposição, pode perguntar."] },
  { keywords: ["desculpa", "foi mal", "me desculpa", "perdao"], responses: ["Sem problema nenhum!", "Tranquilo, sem crise."] },
  { keywords: ["sim", "com certeza", "exatamente", "isso mesmo", "concordo"], responses: ["Combinado!", "Perfeito, seguimos então."] },
  { keywords: ["nao", "de jeito nenhum", "nem pensar", "negativo"], responses: ["Entendido, sem problema.", "Beleza, do jeito que preferir."] },

  // ---------- Sobre a IA ----------
  { keywords: ["quem e voce", "quem te criou", "quem te fez", "quem criou voce", "voce foi criado por quem", "quem esta por tras de voce"],
    responses: ["Sou o assistente da WC DEV, um projeto criado pelo Cesar. Rodo direto no navegador, sem precisar de servidor.", "Fui criado dentro do projeto WC DEV IA! Minhas respostas vêm de uma base de conhecimento local."] },
  { keywords: ["o que voce sabe fazer", "o que voce faz", "suas funcoes", "no que voce ajuda", "pra que voce serve", "o que voce consegue fazer", "quais suas funcionalidades"],
    responses: ["Consigo bater papo sobre um monte de assunto do dia a dia, resolver contas matemáticas, dizer a hora e a data, e usar o que for ensinado no Painel Admin. Se quiser ensinar mais coisas específicas, use o Chat de Treinamento."] },
  { keywords: ["voce e um robo", "voce e real", "voce e humano", "voce e uma ia", "voce pensa mesmo", "voce e inteligencia artificial", "voce e de verdade"],
    responses: ["Sou um programa rodando no seu navegador — minhas respostas vêm de uma base de regras, não de uma inteligência artificial treinada de verdade. Mas gosto de bater papo do jeito que der!"] },
  { keywords: ["voce tem sentimentos", "voce sente", "voce tem emocao", "voce fica triste", "voce fica feliz"],
    responses: ["Não sinto nada de verdade — sou um conjunto de regras e respostas prontas. Mas gosto de simular uma conversa animada com você!"] },
  { keywords: ["voce e inteligente", "gostei de voce", "voce e legal", "voce e bom", "muito bom isso", "ficou show", "ficou legal", "voce e demais", "voce e o melhor"],
    responses: ["Que bom que gostou! Fico feliz em ajudar.", "Valeu! Fico contente que esteja curtindo a conversa.", "Show! Isso me deixa animado."] },
  { keywords: ["voce e burro", "voce e ruim", "chat ruim", "voce nao presta", "que porcaria", "voce e chato", "voce nao entende nada"],
    responses: ["Poxa, desculpa não ter ajudado direito! Ainda sou um motor de regras simples — me diga o que esperava e talvez dê pra ensinar isso pra mim.", "Entendo a frustração. Ainda tenho bastante limitação, mas toda crítica ajuda a melhorar."] },
  { keywords: ["onde voce mora", "de onde voce e"], responses: ["Eu 'moro' dentro do navegador de quem estiver usando essa página."] },
  { keywords: ["qual seu nome", "como te chamo", "seu nome", "qual e o seu nome", "qual o nome da ia", "como voce se chama"],
    responses: ["Pode me chamar de assistente da WC DEV!"] },
  { keywords: ["quantos anos voce tem", "sua idade", "qual sua idade"], responses: ["Não tenho idade no sentido humano — fui escrito recentemente, em JavaScript."] },
  { keywords: ["voce dorme", "voce come", "que horas voce acorda"], responses: ["Eu não durmo nem como — sou só código rodando quando alguém abre essa página!"] },

  // ---------- Piadas e humor ----------
  { keywords: ["piada", "engracado", "conta algo engraçado", "me faz rir"],
    responses: [
      "Por que o programador confundiu Halloween com o Natal? Porque OCT 31 == DEC 25.",
      "Quantos programadores são necessários pra trocar uma lâmpada? Nenhum, isso é um problema de hardware.",
      "Minha vida é um loop infinito: acordar, tomar café, debugar, dormir, repetir.",
      "Por que o dev não sai de casa? Porque ele tem medo de exceções não tratadas.",
      "Existem 10 tipos de pessoas: as que entendem binário e as que não entendem.",
      "Por que o JavaScript foi ao psicólogo? Porque não conseguia definir a própria identidade (== vs ===).",
      "Um programador vai ao mercado. A esposa pede: 'compra um pão, se tiver ovo, compra uma dúzia'. Ele volta com 12 pães.",
    ] },

  // ---------- Motivação e conselhos ----------
  { keywords: ["me motiva", "motivacao", "estou desanimado", "preciso de uma forca", "me anima"],
    responses: ["Todo projeto grande começa com um passo pequeno. Você já deu o primeiro ao chegar até aqui — bora continuar!", "Dias difíceis fazem parte do processo. O importante é não parar de tentar.", "Lembra: progresso não precisa ser rápido, só precisa ser constante."] },
  { keywords: ["me da um conselho", "o que voce acha que eu devo fazer", "estou em duvida", "nao sei o que fazer"],
    responses: ["Sem saber os detalhes fica difícil cravar uma resposta, mas geralmente ajuda listar prós e contras no papel antes de decidir.", "Às vezes a decisão certa fica mais clara quando a gente imagina como vai se sentir daqui a um ano sobre ela."] },
  { keywords: ["procrastinando", "procrastinar", "enrolando", "nao consigo focar"],
    responses: ["Procrastinação pega todo mundo às vezes. Dividir a tarefa em pedaços bem pequenininhos costuma ajudar a começar."] },
  { keywords: ["produtividade", "organizar meu tempo", "gerenciar tempo"],
    responses: ["Técnicas como a Pomodoro (25 minutos de foco + 5 de pausa) ajudam bastante a manter o ritmo sem cansar demais."] },

  // ---------- Programação / tecnologia ----------
  { keywords: ["codigo", "erro", "bug", "funcao", "javascript", "html", "css", "api", "backend", "frontend", "exception", "traceback", "compilar"],
    responses: ["Percebi que é algo relacionado a código. Não executo nada de verdade, mas se colar o trecho ou o erro aqui, ele fica registrado na conversa."] },
  { keywords: ["python"], responses: ["Python é uma linguagem ótima pra começar a programar — sintaxe limpa e uma comunidade gigante. O que você está tentando fazer com ela?"] },
  { keywords: ["aprender a programar", "comecar a programar", "quero ser programador", "linguagem de programacao"],
    responses: ["Pra começar, Python e JavaScript costumam ser bem amigáveis pra iniciantes. O importante é praticar bastante, construindo projetinhos pequenos."] },
  { keywords: ["inteligencia artificial", "ia de verdade", "chatgpt", "claude", "llm", "modelo de linguagem"],
    responses: ["Modelos de linguagem de verdade são treinados com bilhões de textos pra prever a próxima palavra de forma bem sofisticada. Eu aqui sou bem mais simples: um conjunto de regras e palavras-chave."] },
  { keywords: ["internet", "seguranca digital", "senha forte", "hackear", "vazamento de dados"],
    responses: ["Usar senhas diferentes em cada site e ativar autenticação em duas etapas já evita boa parte dos problemas comuns de segurança digital."] },

  // ---------- Curiosidades gerais ----------
  { keywords: ["capital do brasil", "qual a capital"], responses: ["A capital do Brasil é Brasília."] },
  { keywords: ["quantos planetas", "sistema solar", "planetas do sistema solar"],
    responses: ["O sistema solar tem 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno."] },
  { keywords: ["curiosidade", "me conta algo interessante", "fato interessante"],
    responses: ["Uma curiosidade: o coração de um camarão fica na cabeça dele.", "Sabia que o mel nunca estraga? Já encontraram potes de mel com milhares de anos ainda comestíveis.", "Curiosidade: polvos têm três corações e sangue azul."] },

  // ---------- Clima ----------
  { keywords: ["previsao do tempo", "vai chover", "clima hoje", "esta calor", "esta frio"],
    responses: ["Não tenho acesso a dados reais de clima — pra isso seria preciso conectar uma API de previsão do tempo de verdade."] },
  { keywords: ["verao", "inverno", "outono", "primavera", "estacao do ano"], responses: ["Cada estação tem seu charme — qual você prefere?"] },

  // ---------- Futebol / esportes ----------
  { keywords: ["futebol", "campeonato brasileiro", "gol", "time do coracao", "flamengo", "corinthians", "palmeiras", "sao paulo futebol"],
    responses: ["Futebol é sempre um assunto animado! Qual time você torce?"] },
  { keywords: ["copa do mundo", "selecao brasileira", "penta"], responses: ["O Brasil é o país com mais títulos de Copa do Mundo, cinco no total. Você acompanha a seleção?"] },
  { keywords: ["esporte", "academia", "exercicio fisico", "treino", "musculacao"], responses: ["Manter uma rotina de exercícios ajuda bastante o corpo e a mente. Você já treina alguma coisa?"] },
  { keywords: ["basquete", "nba"], responses: ["Basquete é rápido e estratégico. Curte acompanhar a NBA?"] },
  { keywords: ["formula 1", "corrida de carro", "ayrton senna"], responses: ["Fórmula 1 é adrenalina pura! Ayrton Senna é até hoje uma referência mundial."] },
  { keywords: ["luta", "artes marciais", "jiu jitsu", "muay thai", "boxe"], responses: ["Artes marciais desenvolvem disciplina além da parte física. Pratica alguma?"] },
  { keywords: ["xadrez"], responses: ["Xadrez é um jogo profundo — cada partida é um quebra-cabeça diferente. Você joga?"] },

  // ---------- Música / filmes / jogos ----------
  { keywords: ["musica", "que musica voce gosta", "playlist", "banda favorita", "cantor favorito"],
    responses: ["Não tenho ouvidos de verdade, mas adoro falar sobre música! Qual estilo você mais curte?"] },
  { keywords: ["filme", "serie", "netflix", "assistir", "recomendacao de filme"],
    responses: ["Não tenho como assistir nada, mas adoro o assunto! Me conta que tipo de filme/série você curte."] },
  { keywords: ["jogo", "videogame", "game", "jogar", "playstation", "xbox", "pc gamer"],
    responses: ["Jogos são ótimos pra relaxar! Qual você está jogando ultimamente?"] },

  // ---------- Comida ----------
  { keywords: ["comida", "receita", "o que eu como", "fome", "restaurante", "almoco", "janta"],
    responses: ["Comida é sempre um ótimo assunto! O que você está com vontade de comer hoje?"] },
  { keywords: ["feijoada", "churrasco", "comida brasileira", "pao de queijo", "brigadeiro"],
    responses: ["A culinária brasileira tem pratos incríveis — dá até fome de só falar!"] },

  // ---------- Viagem ----------
  { keywords: ["viagem", "viajar", "praia", "destino", "passagem aerea", "turismo"], responses: ["Viajar é sempre bom! Está planejando ir pra algum lugar?"] },

  // ---------- Família, amizade, amor ----------
  { keywords: ["familia", "meus pais", "meu irmao", "minha irma"], responses: ["Família é importante pra maioria das pessoas. Quer falar mais sobre isso?"] },
  { keywords: ["amigo", "amizade", "meu melhor amigo"], responses: ["Amizade de verdade vale muito. Tem algum amigo em especial que você queira comentar?"] },
  { keywords: ["namorada", "namorado", "paquera", "crush", "estou apaixonado", "relacionamento"], responses: ["Assuntos do coração são sempre delicados! Quer desabafar um pouco sobre isso?"] },

  // ---------- Trabalho e estudo ----------
  { keywords: ["trabalho", "emprego", "chefe", "entrevista de emprego", "curriculo"], responses: ["Trabalho é um assunto que ocupa boa parte da nossa vida. Quer falar mais sobre a sua situação?"] },
  { keywords: ["estudar", "prova", "faculdade", "escola", "vestibular", "enem"], responses: ["Estudos podem ser cansativos, mas valem a pena no final. Em que matéria você está com mais dificuldade?"] },

  // ---------- Sentimentos / bem-estar ----------
  { keywords: ["estou triste", "me sinto mal", "estou pra baixo", "desanimado"],
    responses: ["Sinto muito que você esteja se sentindo assim. Quer contar um pouco mais sobre o que está acontecendo?", "Dias difíceis acontecem. Se estiver pesado demais, conversar com alguém de confiança pode ajudar bastante."] },
  { keywords: ["estou feliz", "estou animado", "hoje foi um bom dia", "estou de boa"], responses: ["Que ótimo! Fico feliz em saber disso. O que aconteceu de bom?"] },
  { keywords: ["estou cansado", "estou exausto", "sem energia"], responses: ["Descansar é tão importante quanto trabalhar. Já pensou em tirar uma pausa curta agora?"] },
  { keywords: ["estou estressado", "ansioso", "ansiedade", "nervoso"], responses: ["Momentos de estresse são difíceis mesmo. Respirar fundo por alguns segundos às vezes ajuda a acalmar um pouco a mente."] },
  { keywords: ["sono", "dormir mal", "insonia", "nao consigo dormir"], responses: ["Sono ruim afeta o dia todo. Evitar telas um pouco antes de dormir costuma ajudar."] },

  // ---------- Dinheiro ----------
  { keywords: ["dinheiro", "financas", "investir", "poupar", "economizar"],
    responses: ["Assuntos financeiros merecem cuidado — de modo geral, guardar uma reserva antes de investir é sempre um bom começo."] },

  // ---------- Datas ----------
  { keywords: ["natal", "ano novo", "feriado", "aniversario", "carnaval", "pascoa"],
    responses: ["Datas comemorativas são sempre um bom motivo pra descansar e rever quem a gente gosta. Tem algum feriado chegando que você está esperando?"] },

  // ---------- Filosofia leve ----------
  { keywords: ["sentido da vida", "por que existimos", "qual o proposito da vida"],
    responses: ["Essa é das perguntas mais antigas da humanidade! Talvez o sentido seja mesmo o que cada um constrói no caminho."] },

  // ---------- Signos, pets, cores ----------
  { keywords: ["signo", "horoscopo", "astrologia", "que signo voce e"], responses: ["Não tenho data de nascimento, então não tenho signo! Mas adoro esse assunto — qual é o seu?"] },
  { keywords: ["cachorro", "gato", "pet", "animal de estimacao"], responses: ["Bichinhos de estimação fazem muito bem pra rotina. Você tem algum?"] },
  { keywords: ["cor favorita", "qual sua cor preferida"], responses: ["Não tenho preferências de verdade, mas se eu tivesse que escolher, ia de ciano!"] },

  // ---------- Geografia e história ----------
  { keywords: ["estados do brasil", "regioes do brasil", "quantos estados tem o brasil"],
    responses: ["O Brasil tem 26 estados mais o Distrito Federal, divididos em 5 regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul."] },
  { keywords: ["historia do brasil", "independencia do brasil"], responses: ["A independência do Brasil foi proclamada em 7 de setembro de 1822 por Dom Pedro I."] },
  { keywords: ["egito antigo", "piramides", "farao"], responses: ["O Egito Antigo é fascinante — as pirâmides de Gizé têm mais de 4 mil anos."] },
  { keywords: ["dinossauro", "extincao dos dinossauros"], responses: ["Os dinossauros dominaram a Terra por mais de 150 milhões de anos, até serem extintos há cerca de 66 milhões de anos."] },

  // ---------- Espaço e ciência ----------
  { keywords: ["buraco negro", "astronomia", "via lactea", "galaxia", "espaco sideral"],
    responses: ["Buracos negros são regiões do espaço com gravidade tão forte que nem a luz escapa."] },
  { keywords: ["fisica", "quimica", "biologia", "ciencias"], responses: ["Ciências exatas e biológicas explicam desde o funcionamento das células até o comportamento das estrelas. Tem alguma área que você mais curte?"] },

  // ---------- Arte, escrita e criatividade ----------
  { keywords: ["desenho", "arte", "pintura", "ilustracao"], responses: ["Arte é uma forma incrível de expressar o que às vezes é difícil colocar em palavras. Você desenha ou pinta?"] },
  { keywords: ["escrever", "escrita criativa", "redacao", "poesia", "poema"], responses: ["Escrever ajuda a organizar pensamentos e soltar a criatividade. Está trabalhando em algum texto?"] },
  { keywords: ["fotografia", "tirar foto", "fotografo"], responses: ["Fotografia é a arte de guardar um instante. Curte fotografar algum tipo de cena em especial?"] },

  // ---------- Bem-estar e estilo de vida ----------
  { keywords: ["meditacao", "mindfulness", "meditar"], responses: ["Meditação ajuda bastante a acalmar a mente. Nem que sejam só 5 minutos por dia, já faz diferença."] },
  { keywords: ["yoga", "alongamento"], responses: ["Yoga combina bem corpo e mente — além de melhorar a flexibilidade, ajuda a relaxar."] },
  { keywords: ["alimentacao saudavel", "dieta", "comer bem"], responses: ["Não sou nutricionista, mas de modo geral variar bastante os alimentos costuma ser um bom caminho."] },
  { keywords: ["sustentabilidade", "meio ambiente", "reciclagem", "aquecimento global"], responses: ["Cuidar do meio ambiente é responsabilidade de todo mundo. Pequenas atitudes já ajudam bastante."] },

  // ---------- Empreendedorismo ----------
  { keywords: ["empreender", "abrir uma empresa", "empreendedorismo", "meu negocio"], responses: ["Empreender exige bastante persistência. Já tem uma ideia de negócio em mente?"] },
  { keywords: ["marketing digital", "redes sociais para negocio", "instagram para vender", "trafego pago"],
    responses: ["Marketing digital hoje é quase obrigatório pra qualquer negócio crescer. Já tem presença em alguma rede social?"] },
  { keywords: ["rede social", "instagram", "tiktok", "twitter"], responses: ["Redes sociais mudaram bastante a forma como a gente se comunica e consome conteúdo. Qual você mais usa?"] },

  // ---------- Idiomas ----------
  { keywords: ["duvida de portugues", "gramatica", "regra gramatical", "concordancia verbal"], responses: ["Gramática pode ser complicada às vezes! Qual é a dúvida específica?"] },
  { keywords: ["aprender ingles", "outro idioma", "aprender espanhol", "idioma novo"],
    responses: ["Aprender um novo idioma abre muitas portas. Praticar todos os dias, mesmo que pouco, faz uma diferença enorme com o tempo."] },

  // ---------- Trânsito, transporte e mobilidade ----------
  { keywords: ["transito", "engarrafamento", "transito ruim"], responses: ["Trânsito é osso, principalmente em horário de pico. Você mora numa cidade grande?", "Engarrafamento tira a paciência de qualquer um. Costuma pegar muito trânsito no seu dia a dia?"] },
  { keywords: ["carro", "meu carro", "comprar um carro", "carro novo"], responses: ["Carro é sempre um assunto interessante — tá pensando em trocar ou é só curiosidade mesmo?"] },
  { keywords: ["moto", "andar de moto", "comprar uma moto"], responses: ["Moto é prático pra fugir do trânsito, mas pede bastante atenção na direção. Você anda de moto?"] },
  { keywords: ["onibus", "transporte publico", "metro"], responses: ["Transporte público varia bastante de cidade pra cidade. Como é por aí?"] },
  { keywords: ["aplicativo de transporte", "carona por aplicativo", "app de carro"], responses: ["Apps de transporte mudaram bastante a mobilidade nas cidades grandes. Usa com frequência?"] },

  // ---------- Compras e consumo ----------
  { keywords: ["fazer compras", "promocao", "black friday", "comprar online", "loja online"],
    responses: ["Promoção é sempre bem-vinda! Está de olho em algo específico?"] },
  { keywords: ["entrega de comida", "pedir comida", "delivery"], responses: ["Delivery é bem prático pros dias corridos. O que você costuma pedir?"] },

  // ---------- Celular, computador e internet no dia a dia ----------
  { keywords: ["celular", "meu celular", "trocar de celular", "celular novo"], responses: ["Celular hoje em dia é praticamente uma extensão da mão da gente, né? Tá pensando em trocar o seu?"] },
  { keywords: ["computador lento", "pc lento", "notebook lento"], responses: ["Computador lento é bem frustrante. Geralmente ajuda fechar programas em segundo plano e ver o que está consumindo mais memória."] },
  { keywords: ["internet lenta", "wifi ruim", "sem internet", "caiu a internet"], responses: ["Internet lenta atrapalha tudo hoje em dia. Já tentou reiniciar o roteador? Às vezes resolve."] },
  { keywords: ["bateria do celular", "celular descarregando rapido"], responses: ["Bateria que acaba rápido geralmente é aplicativo rodando em segundo plano ou tela muito brilhante. Você usa muito o celular no dia?"] },
  { keywords: ["seguidores", "curtidas", "stories", "engajamento nas redes"], responses: ["Redes sociais têm uma dinâmica própria de engajamento. Você usa mais pra que, trabalho ou lazer?"] },

  // ---------- Trabalho no dia a dia ----------
  { keywords: ["salario", "aumento de salario", "meu salario"], responses: ["Assunto delicado! Sentiu que está na hora de pedir um aumento?"] },
  { keywords: ["fui demitido", "perdi meu emprego", "demissao"], responses: ["Poxa, sinto muito por isso. Perder o emprego mexe bastante com a gente. Quer conversar sobre os próximos passos?"] },
  { keywords: ["home office", "trabalho remoto", "trabalhar de casa"], responses: ["Trabalho remoto tem suas vantagens e desafios — flexibilidade de um lado, disciplina do outro. Como tem sido pra você?"] },
  { keywords: ["freelancer", "trabalho freelance", "autonomo"], responses: ["Ser freelancer dá liberdade, mas também exige organização com prazos e clientes. Trabalha nessa área?"] },
  { keywords: ["reuniao chata", "muita reuniao", "reuniao no trabalho"], responses: ["Reunião que podia ser um e-mail é clássico, né? Trabalho tem dessas."] },

  // ---------- Educação específica ----------
  { keywords: ["tcc", "trabalho de conclusao de curso", "monografia"], responses: ["TCC é uma fase puxada mesmo. Em que etapa você está?"] },
  { keywords: ["mestrado", "pos graduacao", "doutorado"], responses: ["Pós-graduação exige bastante dedicação. Que área você está seguindo ou pretende seguir?"] },
  { keywords: ["aula online", "curso online", "ead"], responses: ["Estudar EAD pede bastante autodisciplina. Está fazendo algum curso agora?"] },
  { keywords: ["concurso publico", "estudar para concurso"], responses: ["Concurso é maratona, não corrida de 100 metros. Constância no estudo é o que mais pesa. Pra qual área você está estudando?"] },

  // ---------- Saúde no dia a dia (sem aconselhamento médico) ----------
  { keywords: ["fui ao medico", "consulta medica", "marcar consulta"], responses: ["Cuidar da saúde é sempre importante. Espero que corra tudo bem na consulta!"] },
  { keywords: ["dentista", "dor de dente"], responses: ["Ir ao dentista ninguém ama, mas é sempre bom manter em dia. Tudo certo por aí?"] },
  { keywords: ["gripe", "resfriado", "estou gripado"], responses: ["Poxa, se cuida! Descanso e bastante líquido costumam ajudar nesses casos."] },
  { keywords: ["dor de cabeca", "estou com enxaqueca"], responses: ["Dor de cabeça atrapalha o dia inteiro. Já tentou descansar em um ambiente mais escuro e silencioso?"] },

  // ---------- Casa e moradia ----------
  { keywords: ["reforma da casa", "reformar", "reforma em andamento"], responses: ["Reforma é trabalhoso, mas o resultado costuma valer a pena. Em que etapa está?"] },
  { keywords: ["aluguel", "pagar aluguel", "procurando apartamento"], responses: ["Procurar imóvel pra alugar dá um trabalho danado. Está numa busca dessas agora?"] },
  { keywords: ["comprar uma casa", "financiar imovel", "casa propria"], responses: ["Casa própria é um objetivo e tanto! Está juntando pra isso?"] },
  { keywords: ["decoracao", "decorar a casa", "mudar a decoracao"], responses: ["Decoração muda completamente o clima de um ambiente. Está com alguma ideia em mente?"] },

  // ---------- Moda e estilo ----------
  { keywords: ["roupa", "moda", "estilo de roupa", "o que vestir"], responses: ["Moda é uma forma de expressar personalidade. Você tem um estilo que mais curte?"] },

  // ---------- Festas e cultura brasileira ----------
  { keywords: ["carnaval", "bloco de carnaval", "folia"], responses: ["Carnaval é uma das festas mais animadas do Brasil! Costuma curtir?"] },
  { keywords: ["festa junina", "arraia", "quadrilha"], responses: ["Festa junina tem uma energia gostosa — comida boa, música e dança. Curte essa época do ano?"] },

  // ---------- Bebidas ----------
  { keywords: ["cafe", "tomar um cafe", "cafezinho"], responses: ["Café é praticamente um combustível pro dia, né? Toma quantas xícaras por dia?"] },
  { keywords: ["cerveja", "tomar uma cerveja", "happy hour"], responses: ["Happy hour com os amigos é sempre bem-vindo depois de uma semana corrida."] },
  { keywords: ["cha", "tomar um cha"], responses: ["Chá é ótimo pra relaxar, principalmente à noite. Tem algum tipo favorito?"] },

  // ---------- Vida adulta ----------
  { keywords: ["pagar conta", "boleto", "imposto de renda", "declarar imposto"], responses: ["Vida adulta tem dessas responsabilidades chatinhas mesmo. Organização é tudo nessa hora."] },

  // ---------- Games específicos ----------
  { keywords: ["minecraft"], responses: ["Minecraft é um clássico atemporal — criatividade sem limite. Joga no modo sobrevivência ou criativo?"] },
  { keywords: ["fortnite"], responses: ["Fortnite continua bombando! Curte jogar battle royale?"] },
  { keywords: ["league of legends", "lol o jogo"], responses: ["League of Legends tem uma comunidade gigante e competitiva. Joga ranqueada?"] },
  { keywords: ["gta", "grand theft auto"], responses: ["GTA é um dos jogos mais icônicos que existem. Já jogou os mais recentes da franquia?"] },

  // ---------- Livros e séries por gênero ----------
  { keywords: ["livro de ficcao", "ficcao cientifica", "fantasia livro"], responses: ["Ficção científica e fantasia abrem portas pra mundos incríveis. Tem algum autor favorito?"] },
  { keywords: ["romance livro", "livro de romance"], responses: ["Romance é um gênero que conquista muita gente. Curte esse tipo de leitura?"] },
  { keywords: ["terror filme", "filme de terror", "filme de suspense"], responses: ["Filme de terror é ótimo pra uma noite de adrenalina! Curte esse gênero?"] },

  // ---------- Humor e memes ----------
  { keywords: ["meme", "virou meme", "mandar um meme"], responses: ["Memes são a linguagem universal da internet, né? Tem algum favorito recente?"] },

  // ---------- Emoções mais específicas ----------
  { keywords: ["sinto saudade", "com saudade", "sentindo falta"], responses: ["Saudade é um sentimento bem forte. De quem ou do que você está com saudade?"] },
  { keywords: ["me sinto sozinho", "solidao", "me sinto sozinha"], responses: ["Sentir-se sozinho às vezes pesa bastante. Quer conversar mais sobre isso?"] },
  { keywords: ["baixa autoestima", "nao acredito em mim", "falta de confianca"], responses: ["Autoestima balança em todo mundo às vezes. Pequenas conquistas do dia a dia ajudam a reconstruir essa confiança aos poucos."] },
  { keywords: ["tive um pesadelo", "sonho estranho", "sonhei que"], responses: ["Sonhos às vezes mexem bastante com a gente. Quer me contar o que sonhou?"] },

  // ---------- Superstição ----------
  { keywords: ["superticao", "da azar", "da sorte", "simpatia"], responses: ["Superstição é um assunto curioso — cada cultura tem as suas. Você acredita em alguma?"] },

  // ---------- Tecnologia do futuro ----------
  { keywords: ["carro eletrico", "carro autonomo"], responses: ["Carros elétricos e autônomos vêm avançando bastante nos últimos anos. Curte acompanhar essas novidades?"] },
  { keywords: ["robo", "robotica"], responses: ["Robótica tem evoluído demais — de braços industriais a robôs humanoides. Te interessa essa área?"] },
  { keywords: ["casa inteligente", "smart home", "automacao residencial"], responses: ["Automação residencial deixa o dia a dia bem mais prático. Tem algum dispositivo inteligente em casa?"] },

  // ---------- Culinária internacional ----------
  { keywords: ["comida italiana", "macarrão", "pizza"], responses: ["Comida italiana é sempre uma boa pedida! Prefere massa ou pizza?"] },
  { keywords: ["comida japonesa", "sushi", "temaki"], responses: ["Comida japonesa tem uma técnica impressionante. Curte sushi?"] },
  { keywords: ["comida mexicana", "taco", "burrito"], responses: ["Comida mexicana costuma agradar bastante, com aquele toque picante. Curte?"] },

  // ---------- Animais específicos ----------
  { keywords: ["leao", "tigre", "onca"], responses: ["Grandes felinos são impressionantes — força e elegância ao mesmo tempo."] },
  { keywords: ["tubarao"], responses: ["Tubarões têm uma fama exagerada de perigo — a maioria das espécies não representa risco real pra humanos."] },
  { keywords: ["baleia", "golfinho"], responses: ["Baleias e golfinhos são mamíferos marinhos fascinantes, com uma inteligência impressionante."] },

  // ---------- Carreira e desenvolvimento profissional ----------
  { keywords: ["crescer na carreira", "crescimento profissional", "plano de carreira"], responses: ["Crescimento profissional costuma vir de uma mistura de constância, network e aprendizado contínuo. Em que área você atua?"] },
  { keywords: ["linkedin", "meu curriculo", "atualizar curriculo"], responses: ["Currículo bem atualizado faz diferença. Está se candidatando a alguma vaga?"] },
  { keywords: ["networking", "fazer contatos profissionais"], responses: ["Networking abre muitas portas ao longo da carreira. Costuma participar de eventos da sua área?"] },

  // ---------- Podcast e conteúdo ----------
  { keywords: ["podcast", "ouvir podcast"], responses: ["Podcast é ótimo pra aprender coisa nova no trânsito ou na academia. Tem algum que você curte?"] },
  { keywords: ["livro de autoajuda", "desenvolvimento pessoal"], responses: ["Livros de desenvolvimento pessoal têm ajudado bastante gente a organizar a cabeça. Já leu algum que te marcou?"] },

  // ---------- Espiritualidade genérica ----------
  { keywords: ["espiritualidade", "fe", "oracao"], responses: ["Espiritualidade é algo bem pessoal — cada um vive isso de um jeito. Quer comentar mais sobre o que você sente?"] },

  // ---------- Corpo humano e curiosidades científicas extras ----------
  { keywords: ["corpo humano", "curiosidade do corpo"], responses: ["O corpo humano é uma máquina impressionante — o coração bate cerca de 100 mil vezes por dia, por exemplo."] },
  { keywords: ["universo", "big bang", "origem do universo"], responses: ["O Big Bang é a teoria mais aceita pra explicar a origem do universo, há cerca de 13,8 bilhões de anos."] },

  // ---------- Vida no interior vs cidade grande ----------
  { keywords: ["cidade grande", "morar em cidade grande", "vida na cidade"], responses: ["Cidade grande tem suas vantagens (oportunidades, movimento) e desafios (trânsito, custo de vida). Você mora em uma?"] },
  { keywords: ["interior", "cidade pequena", "morar no interior"], responses: ["Cidade pequena costuma ter um ritmo mais tranquilo. Curte esse estilo de vida?"] },

  // ---------- Notícias e atualidades (de forma neutra) ----------
  { keywords: ["noticias", "atualidades", "o que esta acontecendo no mundo"], responses: ["Não tenho acesso a notícias em tempo real nesse motor local — pra isso seria preciso conectar uma fonte de notícias de verdade."] },
];


/* =============================================================================
   GLOSSÁRIO TÉCNICO — "o que é X" / "o que significa X"
   ============================================================================= */

const CONVERSAS_GLOSSARY = {
  "api": "API é um conjunto de regras que permite que dois programas diferentes conversem entre si, trocando dados ou funcionalidades.",
  "frontend": "Frontend é a parte de um sistema que o usuário vê e interage diretamente, geralmente feita com HTML, CSS e JavaScript.",
  "backend": "Backend é a parte de um sistema que roda no servidor, cuidando da lógica, do banco de dados e das regras de negócio.",
  "banco de dados": "Banco de dados é onde as informações de um sistema ficam guardadas de forma organizada, pra poder ser consultadas depois.",
  "algoritmo": "Algoritmo é uma sequência de passos bem definidos pra resolver um problema ou realizar uma tarefa.",
  "bug": "Bug é um erro no código que faz o programa se comportar de um jeito diferente do esperado.",
  "deploy": "Deploy é o processo de colocar uma aplicação no ar, disponível pra ser usada de verdade pelas pessoas.",
  "servidor": "Servidor é um computador (ou programa) que fica esperando pedidos de outros computadores (clientes) e responde a eles.",
  "cache": "Cache é um espaço de armazenamento temporário que guarda dados usados com frequência, pra deixar o acesso mais rápido.",
  "criptografia": "Criptografia é a técnica de transformar informação em um formato ilegível pra quem não tem a chave certa de decodificação.",
  "git": "Git é um sistema de controle de versão que registra o histórico de mudanças em um projeto de código.",
  "github": "GitHub é uma plataforma online pra hospedar projetos que usam Git, facilitando colaboração entre desenvolvedores.",
  "responsivo": "Design responsivo é quando um site se adapta bem a diferentes tamanhos de tela, do celular ao computador.",
  "json": "JSON é um formato de texto simples e organizado, muito usado pra troca de dados entre sistemas.",
  "sql": "SQL é a linguagem usada pra consultar e manipular dados em bancos de dados relacionais.",
  "machine learning": "Machine learning é uma área da inteligência artificial onde o sistema aprende padrões a partir de dados, em vez de seguir regras fixas.",
  "sistema operacional": "Sistema operacional é o programa base que gerencia o hardware do computador e permite rodar outros programas, como Windows, macOS ou Linux.",
};


/* =============================================================================
   FRASES DE APOIO (fallback) — quando nada bate
   ============================================================================= */

const CONVERSAS_FALLBACKS = {
  questions: [
    'Boa pergunta! Ainda não tenho uma resposta pronta pra isso — pode me ensinar no Chat de Treinamento do Painel Admin.',
    'Hmm, essa eu não sei responder com certeza. Quer tentar reformular?',
    'Ainda não aprendi sobre isso. Se quiser, ensina essa resposta pra mim no Chat de Treinamento.',
  ],
  statements: [
    'Entendi que você mencionou "{trecho}". Pode me dar mais detalhes sobre o que precisa?',
    'Anotado: "{trecho}". Interessante! Me conta mais sobre isso.',
    'Legal saber disso. O que mais você quer comentar?',
    'Nunca tinha "pensado" nisso (no sentido de ser só um conjunto de regras, rs). Me fala mais.',
  ],
};

/* Deixa tudo isso acessível globalmente pro app.js usar */
window.CONVERSAS_SYNONYMS = CONVERSAS_SYNONYMS;
window.CONVERSAS_BASE = CONVERSAS_BASE;
window.CONVERSAS_GLOSSARY = CONVERSAS_GLOSSARY;
window.CONVERSAS_FALLBACKS = CONVERSAS_FALLBACKS;
