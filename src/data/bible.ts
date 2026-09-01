import type { BibleBook, Chapter, QuizQuestion } from "@/types";

/**
 * Conteúdo do MVP: texto bíblico em tradução livre de direitos autorais
 * (domínio público) + camada de linguagem atual e camada de explicação.
 * A estrutura permite adicionar outras versões futuramente
 * (basta acrescentar campos de texto por versículo).
 */

const salmos23: Chapter = {
  number: 23,
  title: "O Senhor é o meu pastor",
  minutes: 3,
  verses: [
    {
      n: 1,
      text: "O Senhor é o meu pastor; nada me faltará.",
      simple: "Deus cuida de mim como um pastor cuida das suas ovelhas. Com Ele, não me falta o essencial.",
    },
    {
      n: 2,
      text: "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
      simple: "Ele me leva para lugares de descanso e me conduz com calma até onde eu posso me recuperar.",
    },
    {
      n: 3,
      text: "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
      simple: "Ele renova as minhas forças por dentro e me mostra o caminho certo.",
    },
    {
      n: 4,
      text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      simple: "Mesmo nos momentos mais difíceis e escuros, eu não preciso viver com medo, porque não estou sozinho.",
    },
    {
      n: 5,
      text: "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.",
      simple: "Mesmo diante de quem torce contra, Deus me trata com cuidado e generosidade.",
    },
    {
      n: 6,
      text: "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.",
      simple: "A bondade de Deus me acompanha todos os dias, e eu posso viver perto dEle sempre.",
    },
  ],
  insight: {
    summary:
      "Um poema sobre confiança: Deus é apresentado como alguém que guia, protege e cuida, assim como um pastor cuida das ovelhas.",
    speaker: "Davi, que foi pastor de ovelhas antes de se tornar rei de Israel.",
    audience: "O povo de Israel, que usava os Salmos como orações e cânticos.",
    place: "Regiões de pastagem e desertos de Judá.",
    period: "Por volta do século X a.C.",
    context:
      "Pastorear era um trabalho comum e perigoso: o pastor procurava água, defendia o rebanho de animais selvagens e conhecia cada ovelha. Ao usar essa imagem, Davi fala de cuidado próximo e diário, não de algo distante.",
    meaning:
      "O texto não promete uma vida sem vales escuros. Ele promete companhia dentro deles. A frase central não é 'nada vai dar errado', e sim 'tu estás comigo'.",
    today:
      "Em fases de incerteza — saúde, trabalho, relacionamentos — esta passagem convida a trocar o controle absoluto pela confiança de que você é acompanhado.",
    reflection: "Em quais áreas da sua vida você sente dificuldade de confiar?",
  },
};

const mateus5: Chapter = {
  number: 5,
  title: "As bem-aventuranças",
  minutes: 5,
  verses: [
    {
      n: 1,
      text: "E Jesus, vendo a multidão, subiu ao monte; e, assentando-se, aproximaram-se dele os seus discípulos.",
      simple: "Ao ver a multidão, Jesus subiu numa encosta, sentou-se e os discípulos se aproximaram para ouvir.",
    },
    {
      n: 2,
      text: "E, abrindo a sua boca, os ensinava, dizendo:",
      simple: "Então ele começou a ensinar:",
    },
    {
      n: 3,
      text: "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.",
      simple: "Felizes as pessoas que reconhecem que precisam de Deus: o Reino pertence a elas.",
    },
    {
      n: 4,
      text: "Bem-aventurados os que choram, porque eles serão consolados.",
      simple: "Felizes os que estão sofrendo agora, porque serão consolados.",
    },
    {
      n: 5,
      text: "Bem-aventurados os mansos, porque eles herdarão a terra.",
      simple: "Felizes os que não vivem pela força e pela arrogância: o futuro é deles.",
    },
    {
      n: 6,
      text: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.",
      simple: "Felizes os que desejam profundamente um mundo mais justo: esse desejo será satisfeito.",
    },
    {
      n: 7,
      text: "Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia.",
      simple: "Felizes os que tratam os outros com compaixão: também receberão compaixão.",
    },
    {
      n: 8,
      text: "Bem-aventurados os limpos de coração, porque eles verão a Deus.",
      simple: "Felizes os que são íntegros por dentro, sem fingimento: eles enxergarão Deus.",
    },
    {
      n: 9,
      text: "Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.",
      simple: "Felizes os que constroem paz onde há conflito: serão reconhecidos como filhos de Deus.",
    },
    {
      n: 10,
      text: "Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o reino dos céus.",
      simple: "Felizes os que enfrentam perseguição por fazer o que é certo.",
    },
    {
      n: 11,
      text: "Bem-aventurados sois vós, quando vos injuriarem e perseguirem e, mentindo, disserem todo o mal contra vós por minha causa.",
      simple: "Você é feliz mesmo quando é atacado ou caluniado por seguir a Jesus.",
    },
    {
      n: 12,
      text: "Exultai e alegrai-vos, porque é grande o vosso galardão nos céus; porque assim perseguiram os profetas que foram antes de vós.",
      simple: "Tenha ânimo: a recompensa é grande, e você está na mesma linha dos profetas do passado.",
    },
  ],
  insight: {
    summary:
      "A abertura do Sermão do Monte inverte a lógica comum de sucesso: Jesus chama de felizes justamente os que o mundo considera frágeis.",
    speaker: "Jesus de Nazaré.",
    audience: "Discípulos e uma multidão de pessoas comuns na Galileia; o evangelho foi escrito especialmente para leitores de origem judaica.",
    place: "Uma encosta próxima ao mar da Galileia.",
    period: "Por volta do ano 30 d.C.; o evangelho foi escrito décadas depois.",
    context:
      "A Galileia vivia sob domínio romano, com impostos pesados e forte desigualdade. Muitos esperavam um líder político. Jesus começa falando de caráter, e não de poder.",
    meaning:
      "As bem-aventuranças não são regras para conquistar o favor de Deus. São o retrato de quem já vive sob o cuidado dele: humilde, compassivo, íntegro e construtor de paz.",
    today:
      "Num ambiente que premia aparência e competição, este texto propõe outra régua: como você trata quem não pode te devolver nada?",
    reflection: "Qual dessas atitudes é a mais difícil para você hoje?",
    interpretations:
      "Existem diferentes interpretações cristãs sobre quando o 'Reino dos céus' se realiza plenamente: já agora, no futuro, ou nos dois momentos.",
  },
};

const genesis1: Chapter = {
  number: 1,
  title: "No princípio",
  minutes: 4,
  verses: [
    {
      n: 1,
      text: "No princípio criou Deus os céus e a terra.",
      simple: "Tudo o que existe começou com Deus.",
    },
    {
      n: 2,
      text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
      simple: "No começo tudo era caos e vazio, e o Espírito de Deus estava presente ali.",
    },
    {
      n: 3,
      text: "E disse Deus: Haja luz; e houve luz.",
      simple: "Deus falou e a luz apareceu.",
    },
    {
      n: 4,
      text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.",
      simple: "Deus reconheceu que a luz era boa e a separou da escuridão.",
    },
    {
      n: 26,
      text: "E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança.",
      simple: "Deus decidiu criar o ser humano parecido com Ele, capaz de amar, criar e cuidar.",
    },
    {
      n: 27,
      text: "E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.",
      simple: "Homem e mulher foram criados com o mesmo valor e a mesma dignidade.",
    },
    {
      n: 31,
      text: "E viu Deus tudo quanto tinha feito, e eis que era muito bom.",
      simple: "Deus olhou para tudo o que tinha feito e aprovou: era muito bom.",
    },
  ],
  insight: {
    summary: "O primeiro capítulo da Bíblia apresenta um mundo criado com intenção, ordem e valor.",
    speaker: "Narrador do livro de Gênesis, tradicionalmente associado a Moisés.",
    audience: "O povo de Israel, cercado por culturas com muitas histórias de criação.",
    place: "Tradição transmitida no Oriente Médio antigo.",
    period: "Textos formados ao longo de séculos, antes do exílio babilônico.",
    context:
      "Outros povos da região contavam que o mundo nasceu de guerras entre deuses e que humanos eram escravos divinos. Gênesis afirma o contrário: o mundo é bom e o ser humano tem dignidade.",
    meaning:
      "O foco do texto é quem criou e por quê, mais do que um manual científico do como.",
    today:
      "Se cada pessoa carrega a imagem de Deus, isso muda a forma como você olha para si mesmo e para quem discorda de você.",
    reflection: "O que muda no seu dia se você tratar cada pessoa como alguém de valor inegociável?",
    interpretations:
      "Existem diferentes interpretações cristãs sobre os 'dias' da criação — literais, longos períodos ou linguagem poética.",
  },
};

const filipenses4: Chapter = {
  number: 4,
  title: "Ansiedade e paz",
  minutes: 3,
  verses: [
    {
      n: 4,
      text: "Regozijai-vos sempre no Senhor; outra vez digo: regozijai-vos.",
      simple: "Encontre alegria em Deus, sempre. Repito: alegre-se.",
    },
    {
      n: 5,
      text: "Seja a vossa equidade notória a todos os homens. Perto está o Senhor.",
      simple: "Que a sua gentileza seja visível para todos. Deus está por perto.",
    },
    {
      n: 6,
      text: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.",
      simple: "Em vez de carregar a ansiedade sozinho, leve o que te preocupa a Deus, com gratidão.",
    },
    {
      n: 7,
      text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
      simple: "E uma paz que você não consegue explicar vai proteger o seu coração e a sua mente.",
    },
    {
      n: 8,
      text: "Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.",
      simple: "Escolha com cuidado aquilo em que você alimenta o pensamento.",
    },
    {
      n: 13,
      text: "Posso todas as coisas naquele que me fortalece.",
      simple: "Consigo enfrentar qualquer situação porque recebo força de Cristo.",
    },
  ],
  insight: {
    summary: "Uma carta escrita da prisão que fala sobre ansiedade, gratidão e paz interior.",
    speaker: "Paulo, apóstolo, escrevendo preso.",
    audience: "A comunidade cristã da cidade de Filipos, na Macedônia.",
    place: "Provavelmente Roma.",
    period: "Por volta dos anos 60 d.C.",
    context:
      "Filipos era uma colônia romana e a comunidade cristã ali enfrentava pressão social. Paulo escreve agradecendo o apoio recebido e encorajando a igreja.",
    meaning:
      "O texto não manda 'não sentir' ansiedade. Ele propõe um destino para ela: transformar preocupação em oração concreta.",
    today:
      "Vale como prática diária: escrever o que preocupa, transformar em pedido e registrar uma coisa pela qual agradecer.",
    reflection: "Qual preocupação você poderia entregar hoje, em vez de repetir mentalmente?",
  },
};

const eclesiastes3: Chapter = {
  number: 3,
  title: "Tudo tem o seu tempo",
  minutes: 3,
  verses: [
    {
      n: 1,
      text: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.",
      simple: "Cada coisa tem o seu momento certo na vida.",
    },
    {
      n: 2,
      text: "Há tempo de nascer, e tempo de morrer; tempo de plantar, e tempo de arrancar o que se plantou.",
      simple: "Há momentos de começo e momentos de fim; de plantar e de encerrar ciclos.",
    },
    {
      n: 4,
      text: "Tempo de chorar, e tempo de rir; tempo de prantear, e tempo de dançar.",
      simple: "Existe espaço para a dor e existe espaço para a alegria.",
    },
    {
      n: 7,
      text: "Tempo de rasgar, e tempo de coser; tempo de estar calado, e tempo de falar.",
      simple: "Há hora de falar e hora de ouvir em silêncio.",
    },
    {
      n: 11,
      text: "Tudo fez formoso em seu tempo; também pôs o mundo no coração do homem.",
      simple: "Deus faz cada coisa bonita no momento certo e colocou no ser humano o desejo de entender o todo.",
    },
  ],
  insight: {
    summary: "Um poema realista sobre ciclos: nem tudo acontece quando queremos.",
    speaker: "O Pregador (Qohelet), tradicionalmente associado a Salomão.",
    audience: "Leitores em busca de sentido diante das contradições da vida.",
    place: "Jerusalém.",
    period: "Período pós-exílico, entre os séculos V e III a.C.",
    context:
      "Eclesiastes é uma obra de sabedoria que encara a vida sem romantizar: trabalho, perdas, prazeres e limites.",
    meaning: "Aceitar que existem estações reduz a pressão de exigir de si mesmo tudo ao mesmo tempo.",
    today: "Serve para quem está impaciente com um processo que ainda não deu resultado visível.",
    reflection: "Que estação você está vivendo agora — de plantar, esperar ou colher?",
  },
};

const proverbios3: Chapter = {
  number: 3,
  title: "Confiança e sabedoria",
  minutes: 3,
  verses: [
    {
      n: 5,
      text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.",
      simple: "Confie em Deus por inteiro, sem depender só do que você consegue calcular.",
    },
    {
      n: 6,
      text: "Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
      simple: "Inclua Deus nas suas decisões e o caminho ficará mais claro.",
    },
    {
      n: 13,
      text: "Bem-aventurado o homem que acha sabedoria, e o homem que adquire conhecimento.",
      simple: "É feliz quem busca sabedoria de verdade.",
    },
    {
      n: 27,
      text: "Não detenhas o bem de quem o pedir, estando na tua mão o poder de fazê-lo.",
      simple: "Se você pode ajudar alguém agora, não adie.",
    },
  ],
  insight: {
    summary: "Provérbios reúne conselhos práticos para decisões do dia a dia.",
    speaker: "Um mestre de sabedoria orientando um jovem aprendiz.",
    audience: "Jovens em formação em Israel.",
    place: "Jerusalém e cortes reais.",
    period: "Coletânea reunida ao longo de séculos.",
    context:
      "A literatura sapiencial era comum no Oriente Médio antigo: ensinava a viver bem por meio de frases curtas e memoráveis.",
    meaning: "Confiar não significa desligar a razão, e sim não fazer dela o único critério.",
    today: "Antes de uma decisão importante, escrever prós, contras e orar sobre ela é uma aplicação direta.",
    reflection: "Que decisão você está tentando resolver apenas na base do controle?",
  },
};

const joao1: Chapter = {
  number: 1,
  title: "A Palavra se fez carne",
  minutes: 4,
  verses: [
    {
      n: 1,
      text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
      simple: "Antes de tudo já existia a Palavra: ela estava com Deus e era Deus.",
    },
    {
      n: 4,
      text: "Nele estava a vida, e a vida era a luz dos homens.",
      simple: "Nele há vida, e essa vida ilumina as pessoas.",
    },
    {
      n: 5,
      text: "E a luz resplandece nas trevas, e as trevas não a compreenderam.",
      simple: "A luz continua brilhando no escuro, e a escuridão não conseguiu apagá-la.",
    },
    {
      n: 12,
      text: "Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus.",
      simple: "Quem o recebe passa a ser tratado como filho de Deus.",
    },
    {
      n: 14,
      text: "E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, cheio de graça e de verdade.",
      simple: "Deus se aproximou de forma concreta: viveu entre as pessoas, com graça e verdade.",
    },
  ],
  insight: {
    summary: "João apresenta Jesus não a partir do nascimento, mas da eternidade.",
    speaker: "O evangelista João.",
    audience: "Comunidades cristãs em ambiente grego e judaico.",
    place: "Provavelmente Éfeso.",
    period: "Final do século I d.C.",
    context:
      "A palavra grega 'logos' era familiar tanto para filósofos gregos quanto para leitores judaicos. João usa essa ponte para explicar quem é Jesus.",
    meaning: "A ideia central é aproximação: Deus não fica distante, ele vem morar perto.",
    today: "Fé aqui não é ideia abstrata, é relação — e relação se constrói com tempo e presença.",
    reflection: "O que muda quando você pensa em Deus como alguém próximo, e não distante?",
  },
};

export const books: BibleBook[] = [
  {
    id: "genesis",
    name: "Gênesis",
    testament: "antigo",
    group: "Pentateuco",
    summary: "As origens: criação, primeiras famílias e o começo do povo de Israel.",
    totalChapters: 50,
    chapters: [genesis1],
  },
  {
    id: "salmos",
    name: "Salmos",
    testament: "antigo",
    group: "Poéticos",
    summary: "Orações e cânticos para todas as emoções humanas.",
    totalChapters: 150,
    chapters: [salmos23],
  },
  {
    id: "proverbios",
    name: "Provérbios",
    testament: "antigo",
    group: "Poéticos",
    summary: "Sabedoria prática para decisões do dia a dia.",
    totalChapters: 31,
    chapters: [proverbios3],
  },
  {
    id: "eclesiastes",
    name: "Eclesiastes",
    testament: "antigo",
    group: "Poéticos",
    summary: "Uma busca honesta por sentido diante dos limites da vida.",
    totalChapters: 12,
    chapters: [eclesiastes3],
  },
  {
    id: "mateus",
    name: "Mateus",
    testament: "novo",
    group: "Evangelhos",
    summary: "A vida e os ensinos de Jesus apresentados a leitores judaicos.",
    totalChapters: 28,
    chapters: [mateus5],
  },
  {
    id: "joao",
    name: "João",
    testament: "novo",
    group: "Evangelhos",
    summary: "Quem é Jesus, contado a partir de sinais e conversas profundas.",
    totalChapters: 21,
    chapters: [joao1],
  },
  {
    id: "filipenses",
    name: "Filipenses",
    testament: "novo",
    group: "Cartas",
    summary: "Alegria e paz escritas de dentro de uma prisão.",
    totalChapters: 4,
    chapters: [filipenses4],
  },
];

export function getBook(id: string) {
  return books.find((b) => b.id === id);
}

export function getChapter(bookId: string, chapter: number) {
  const book = getBook(bookId);
  if (!book) return undefined;
  const found = book.chapters.find((c) => c.number === chapter) ?? book.chapters[0];
  return found ? { book, chapter: found } : undefined;
}

export const quizzes: Record<string, QuizQuestion[]> = {
  "salmos-23": [
    {
      id: "q1",
      kind: "multipla",
      question: "Qual imagem é usada para falar de Deus neste salmo?",
      options: ["Um rei distante", "Um pastor que cuida", "Um juiz severo", "Um viajante"],
      answer: 1,
      explanation: "Davi usa a imagem do pastor, alguém que conhece e protege cada ovelha.",
    },
    {
      id: "q2",
      kind: "verdadeiro-falso",
      question: "O salmo promete uma vida sem dificuldades.",
      options: ["Verdadeiro", "Falso"],
      answer: 1,
      explanation: "Ele fala do 'vale da sombra', ou seja, admite dificuldades — mas com companhia.",
    },
    {
      id: "q3",
      kind: "completar",
      question: "Complete: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria...'",
      options: ["mal algum", "os inimigos", "a solidão", "o futuro"],
      answer: 0,
      explanation: "A frase completa é 'não temeria mal algum, porque tu estás comigo'.",
    },
  ],
  "mateus-5": [
    {
      id: "q1",
      kind: "multipla",
      question: "Onde Jesus ensinou essa mensagem?",
      options: ["No templo", "Num monte", "Num barco", "Numa sinagoga"],
      answer: 1,
      explanation: "Por isso o trecho é conhecido como Sermão do Monte.",
    },
    {
      id: "q2",
      kind: "verdadeiro-falso",
      question: "Jesus chama de felizes as pessoas que constroem paz.",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      explanation: "'Bem-aventurados os pacificadores' — os que criam paz.",
    },
  ],
};

export function quizFor(bookId: string, chapter: number) {
  return quizzes[`${bookId}-${chapter}`] ?? quizzes["salmos-23"]!;
}
