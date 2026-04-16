import type { Locale } from "@/lib/i18n";

export type TipCategoryId = "habits" | "foods" | "exercises" | "discipline";

export interface TipItem {
  title: string;
  description: string;
}

export interface TipExercise {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  steps: string[];
}

export interface TipCategoryContent {
  title: string;
  subtitle: string;
  emoji: string;
  intro: string;
  items: TipItem[];
  exercise?: TipExercise;
}

type TipsContent = Record<TipCategoryId, TipCategoryContent>;
type TipsByLocale = Record<Locale, TipsContent>;

export const tipsContent: TipsByLocale = {
  es: {
    habits: {
      title: "Hábitos para mejorar la memoria",
      subtitle: "Pequeños cambios diarios, gran impacto",
      emoji: "🧠",
      intro: "Tu memoria se entrena como un músculo. Estos hábitos refuerzan las conexiones neuronales.",
      items: [
        { title: "Duerme 7-9 horas", description: "Durante el sueño profundo el cerebro consolida los recuerdos del día." },
        { title: "Hidrátate constantemente", description: "Una deshidratación leve reduce la atención y memoria a corto plazo." },
        { title: "Lee 20 minutos al día", description: "Estimula la imaginación y fortalece la red neuronal del lenguaje." },
        { title: "Aprende algo nuevo cada semana", description: "Idiomas, instrumentos o recetas crean nuevas vías neuronales." },
        { title: "Reduce el tiempo en pantallas", description: "El exceso de estímulos rápidos debilita la memoria de trabajo." },
        { title: "Medita 10 minutos diarios", description: "La atención plena mejora la concentración y reduce el estrés que daña la memoria." },
      ],
    },
    foods: {
      title: "Alimentos que potencian la memoria",
      subtitle: "Nutre tu cerebro desde el plato",
      emoji: "🥑",
      intro: "El cerebro consume el 20% de tu energía. Estos alimentos aportan nutrientes clave para su rendimiento.",
      items: [
        { title: "Pescados azules", description: "Salmón, sardinas y caballa aportan omega-3, esenciales para las membranas neuronales." },
        { title: "Frutos rojos", description: "Arándanos y fresas son ricos en antioxidantes que retrasan el envejecimiento cerebral." },
        { title: "Nueces y semillas", description: "Contienen vitamina E y grasas saludables que protegen las neuronas." },
        { title: "Cacao puro", description: "Los flavonoides aumentan el flujo sanguíneo cerebral y mejoran la concentración." },
        { title: "Aguacate", description: "Sus grasas monoinsaturadas favorecen la circulación cerebral." },
        { title: "Té verde", description: "Combina cafeína y L-teanina para una atención calmada y sostenida." },
        { title: "Cúrcuma", description: "Su curcumina tiene efectos antiinflamatorios y neuroprotectores." },
        { title: "Huevos", description: "La colina es clave para producir acetilcolina, neurotransmisor de la memoria." },
      ],
    },
    exercises: {
      title: "Ejercicios para entrenar la memoria",
      subtitle: "Activa tu mente cada día",
      emoji: "🎯",
      intro: "Como cualquier habilidad, la memoria mejora con práctica deliberada. Prueba estos ejercicios.",
      items: [
        { title: "Método del palacio de la memoria", description: "Asocia ideas con lugares conocidos de tu casa para recordar listas largas." },
        { title: "Cuenta atrás de 7 en 7", description: "Desde 100, resta 7 mentalmente: 93, 86, 79… Ejercita la memoria de trabajo." },
        { title: "Memoriza una lista de la compra", description: "Antes de salir, intenta recordar 10 productos sin mirar." },
        { title: "Repite números al revés", description: "Lee un número de teléfono y repítelo al revés. Aumenta los dígitos progresivamente." },
        { title: "Aprende una palabra nueva al día", description: "Búscala, úsala en una frase y repítela en voz alta tres veces." },
        { title: "Juega ajedrez o sudoku", description: "Estimulan la planificación, lógica y memoria visual." },
      ],
      exercise: {
        id: "memory-sequence",
        title: "Reto: Secuencia de palabras",
        description: "Memoriza la lista en 30 segundos. Luego intenta escribirla.",
        durationSec: 30,
        steps: [
          "Manzana",
          "Bicicleta",
          "Lámpara",
          "Océano",
          "Guitarra",
          "Pirámide",
          "Cuaderno",
          "Mariposa",
        ],
      },
    },
    discipline: {
      title: "Disciplina y no procrastinar",
      subtitle: "El motor invisible del éxito",
      emoji: "⚡",
      intro: "La disciplina vence a la motivación. Cuando tienes un sistema, no necesitas esperar a 'tener ganas'.",
      items: [
        { title: "Más libertad real", description: "Quien controla sus impulsos elige su vida; quien procrastina vive reaccionando." },
        { title: "Mejor autoestima", description: "Cumplir lo que prometes a ti mismo construye confianza día a día." },
        { title: "Menos ansiedad", description: "La procrastinación acumula tareas y multiplica el estrés. La acción inmediata lo disuelve." },
        { title: "Resultados compuestos", description: "Pequeñas acciones diarias generan grandes cambios a 6-12 meses." },
        { title: "Regla de los 2 minutos", description: "Si una tarea toma menos de 2 min, hazla ya. Si es grande, comprométete solo 2 min." },
        { title: "Diseña tu entorno", description: "Quita distracciones del campo visual: el teléfono lejos, la pestaña cerrada." },
        { title: "Time blocking", description: "Asigna bloques fijos a tareas importantes en tu agenda; trátalos como citas inquebrantables." },
        { title: "Celebra el proceso", description: "No esperes al resultado: reconoce cada acción cumplida como una victoria." },
      ],
    },
  },
  en: {
    habits: {
      title: "Habits to improve memory",
      subtitle: "Small daily changes, big impact",
      emoji: "🧠",
      intro: "Memory is trained like a muscle. These habits strengthen neural connections.",
      items: [
        { title: "Sleep 7-9 hours", description: "During deep sleep your brain consolidates the day's memories." },
        { title: "Stay hydrated", description: "Mild dehydration reduces attention and short-term memory." },
        { title: "Read 20 minutes a day", description: "Stimulates imagination and strengthens language networks." },
        { title: "Learn something new weekly", description: "Languages, instruments or recipes build new neural pathways." },
        { title: "Limit screen time", description: "Excess fast stimuli weakens working memory." },
        { title: "Meditate 10 minutes daily", description: "Mindfulness boosts focus and reduces memory-damaging stress." },
      ],
    },
    foods: {
      title: "Foods that boost memory",
      subtitle: "Nourish your brain from the plate",
      emoji: "🥑",
      intro: "Your brain uses 20% of your energy. These foods provide key nutrients for performance.",
      items: [
        { title: "Fatty fish", description: "Salmon, sardines and mackerel provide omega-3, essential for neural membranes." },
        { title: "Berries", description: "Blueberries and strawberries are rich in antioxidants that slow brain aging." },
        { title: "Nuts and seeds", description: "Contain vitamin E and healthy fats that protect neurons." },
        { title: "Dark cocoa", description: "Flavonoids increase brain blood flow and improve focus." },
        { title: "Avocado", description: "Its monounsaturated fats support brain circulation." },
        { title: "Green tea", description: "Combines caffeine and L-theanine for calm, sustained attention." },
        { title: "Turmeric", description: "Curcumin has anti-inflammatory and neuroprotective effects." },
        { title: "Eggs", description: "Choline is key to produce acetylcholine, the memory neurotransmitter." },
      ],
    },
    exercises: {
      title: "Exercises to train memory",
      subtitle: "Activate your mind every day",
      emoji: "🎯",
      intro: "Like any skill, memory improves with deliberate practice. Try these exercises.",
      items: [
        { title: "Memory palace method", description: "Link ideas to familiar places in your home to remember long lists." },
        { title: "Count down by 7s", description: "From 100, subtract 7 mentally: 93, 86, 79… Trains working memory." },
        { title: "Memorize a shopping list", description: "Before leaving, try to recall 10 products without looking." },
        { title: "Repeat numbers backwards", description: "Read a phone number and repeat it backwards. Increase digits gradually." },
        { title: "Learn a new word daily", description: "Look it up, use it in a sentence and say it aloud three times." },
        { title: "Play chess or sudoku", description: "They train planning, logic and visual memory." },
      ],
      exercise: {
        id: "memory-sequence",
        title: "Challenge: Word sequence",
        description: "Memorize the list in 30 seconds. Then try to write it down.",
        durationSec: 30,
        steps: [
          "Apple",
          "Bicycle",
          "Lamp",
          "Ocean",
          "Guitar",
          "Pyramid",
          "Notebook",
          "Butterfly",
        ],
      },
    },
    discipline: {
      title: "Discipline and not procrastinating",
      subtitle: "The invisible engine of success",
      emoji: "⚡",
      intro: "Discipline beats motivation. With a system, you don't need to wait to 'feel like it'.",
      items: [
        { title: "Real freedom", description: "Who controls their impulses chooses their life; who procrastinates merely reacts." },
        { title: "Better self-esteem", description: "Keeping promises to yourself builds confidence day by day." },
        { title: "Less anxiety", description: "Procrastination piles up tasks and multiplies stress. Immediate action dissolves it." },
        { title: "Compound results", description: "Small daily actions create big changes in 6-12 months." },
        { title: "2-minute rule", description: "If a task takes under 2 min, do it now. If big, commit to just 2 min." },
        { title: "Design your environment", description: "Remove visual distractions: phone away, tab closed." },
        { title: "Time blocking", description: "Assign fixed blocks to important tasks in your calendar; treat them as unbreakable." },
        { title: "Celebrate the process", description: "Don't wait for results: honor each action completed as a win." },
      ],
    },
  },
  pt: {
    habits: {
      title: "Hábitos para melhorar a memória",
      subtitle: "Pequenas mudanças diárias, grande impacto",
      emoji: "🧠",
      intro: "A memória se treina como um músculo. Estes hábitos fortalecem conexões neurais.",
      items: [
        { title: "Durma 7-9 horas", description: "No sono profundo o cérebro consolida as memórias do dia." },
        { title: "Hidrate-se sempre", description: "Uma desidratação leve reduz atenção e memória de curto prazo." },
        { title: "Leia 20 minutos por dia", description: "Estimula a imaginação e fortalece a rede neural da linguagem." },
        { title: "Aprenda algo novo toda semana", description: "Idiomas, instrumentos ou receitas criam novos caminhos neurais." },
        { title: "Reduza o tempo de tela", description: "O excesso de estímulos rápidos enfraquece a memória de trabalho." },
        { title: "Medite 10 minutos por dia", description: "A atenção plena melhora a concentração e reduz o estresse." },
      ],
    },
    foods: {
      title: "Alimentos que potencializam a memória",
      subtitle: "Nutra seu cérebro pelo prato",
      emoji: "🥑",
      intro: "O cérebro consome 20% da sua energia. Estes alimentos fornecem nutrientes chave.",
      items: [
        { title: "Peixes gordurosos", description: "Salmão, sardinha e cavala fornecem ômega-3, essenciais para as membranas neurais." },
        { title: "Frutas vermelhas", description: "Mirtilos e morangos são ricos em antioxidantes que retardam o envelhecimento cerebral." },
        { title: "Nozes e sementes", description: "Contêm vitamina E e gorduras saudáveis que protegem os neurônios." },
        { title: "Cacau puro", description: "Os flavonoides aumentam o fluxo sanguíneo cerebral e melhoram a concentração." },
        { title: "Abacate", description: "Suas gorduras monoinsaturadas favorecem a circulação cerebral." },
        { title: "Chá verde", description: "Combina cafeína e L-teanina para atenção calma e sustentada." },
        { title: "Cúrcuma", description: "Sua curcumina tem efeitos anti-inflamatórios e neuroprotetores." },
        { title: "Ovos", description: "A colina é chave para produzir acetilcolina, neurotransmissor da memória." },
      ],
    },
    exercises: {
      title: "Exercícios para treinar a memória",
      subtitle: "Ative sua mente todos os dias",
      emoji: "🎯",
      intro: "Como qualquer habilidade, a memória melhora com prática deliberada.",
      items: [
        { title: "Método do palácio da memória", description: "Associe ideias com lugares conhecidos da sua casa para lembrar listas longas." },
        { title: "Contagem regressiva de 7 em 7", description: "A partir de 100, subtraia 7 mentalmente: 93, 86, 79… Exercita a memória de trabalho." },
        { title: "Memorize uma lista de compras", description: "Antes de sair, tente lembrar 10 produtos sem olhar." },
        { title: "Repita números ao contrário", description: "Leia um telefone e repita ao contrário. Aumente os dígitos gradualmente." },
        { title: "Aprenda uma palavra nova por dia", description: "Procure-a, use em uma frase e repita em voz alta três vezes." },
        { title: "Jogue xadrez ou sudoku", description: "Estimulam planejamento, lógica e memória visual." },
      ],
      exercise: {
        id: "memory-sequence",
        title: "Desafio: Sequência de palavras",
        description: "Memorize a lista em 30 segundos. Depois tente escrever.",
        durationSec: 30,
        steps: [
          "Maçã",
          "Bicicleta",
          "Lâmpada",
          "Oceano",
          "Guitarra",
          "Pirâmide",
          "Caderno",
          "Borboleta",
        ],
      },
    },
    discipline: {
      title: "Disciplina e não procrastinar",
      subtitle: "O motor invisível do sucesso",
      emoji: "⚡",
      intro: "A disciplina vence a motivação. Com um sistema, você não precisa esperar 'ter vontade'.",
      items: [
        { title: "Liberdade real", description: "Quem controla seus impulsos escolhe sua vida; quem procrastina apenas reage." },
        { title: "Melhor autoestima", description: "Cumprir o que promete a si mesmo constrói confiança dia após dia." },
        { title: "Menos ansiedade", description: "A procrastinação acumula tarefas e multiplica o estresse. A ação imediata dissolve isso." },
        { title: "Resultados compostos", description: "Pequenas ações diárias geram grandes mudanças em 6-12 meses." },
        { title: "Regra dos 2 minutos", description: "Se uma tarefa leva menos de 2 min, faça já. Se é grande, comprometa-se só 2 min." },
        { title: "Desenhe seu ambiente", description: "Tire distrações do campo visual: telefone longe, aba fechada." },
        { title: "Time blocking", description: "Atribua blocos fixos a tarefas importantes na agenda; trate como inquebrantáveis." },
        { title: "Celebre o processo", description: "Não espere o resultado: honre cada ação cumprida como vitória." },
      ],
    },
  },
  fr: {
    habits: {
      title: "Habitudes pour améliorer la mémoire",
      subtitle: "Petits changements quotidiens, grand impact",
      emoji: "🧠",
      intro: "La mémoire s'entraîne comme un muscle. Ces habitudes renforcent les connexions neuronales.",
      items: [
        { title: "Dormez 7-9 heures", description: "Pendant le sommeil profond, le cerveau consolide les souvenirs du jour." },
        { title: "Hydratez-vous", description: "Une légère déshydratation réduit l'attention et la mémoire à court terme." },
        { title: "Lisez 20 minutes par jour", description: "Stimule l'imagination et renforce le réseau neuronal du langage." },
        { title: "Apprenez du nouveau chaque semaine", description: "Langues, instruments ou recettes créent de nouvelles voies neuronales." },
        { title: "Réduisez le temps d'écran", description: "L'excès de stimuli rapides affaiblit la mémoire de travail." },
        { title: "Méditez 10 minutes par jour", description: "La pleine conscience améliore la concentration et réduit le stress." },
      ],
    },
    foods: {
      title: "Aliments qui boostent la mémoire",
      subtitle: "Nourrissez votre cerveau",
      emoji: "🥑",
      intro: "Le cerveau consomme 20% de votre énergie. Ces aliments fournissent les nutriments clés.",
      items: [
        { title: "Poissons gras", description: "Saumon, sardines et maquereau apportent des oméga-3, essentiels aux membranes neuronales." },
        { title: "Fruits rouges", description: "Myrtilles et fraises sont riches en antioxydants qui ralentissent le vieillissement cérébral." },
        { title: "Noix et graines", description: "Contiennent vitamine E et bonnes graisses qui protègent les neurones." },
        { title: "Cacao pur", description: "Les flavonoïdes augmentent le flux sanguin cérébral et améliorent la concentration." },
        { title: "Avocat", description: "Ses graisses mono-insaturées favorisent la circulation cérébrale." },
        { title: "Thé vert", description: "Combine caféine et L-théanine pour une attention calme et soutenue." },
        { title: "Curcuma", description: "Sa curcumine a des effets anti-inflammatoires et neuroprotecteurs." },
        { title: "Œufs", description: "La choline est clé pour produire l'acétylcholine, neurotransmetteur de la mémoire." },
      ],
    },
    exercises: {
      title: "Exercices pour entraîner la mémoire",
      subtitle: "Activez votre esprit chaque jour",
      emoji: "🎯",
      intro: "Comme toute compétence, la mémoire s'améliore par la pratique délibérée.",
      items: [
        { title: "Méthode du palais de la mémoire", description: "Associez des idées à des lieux familiers pour mémoriser de longues listes." },
        { title: "Compte à rebours de 7 en 7", description: "Depuis 100, soustrayez 7 mentalement : 93, 86, 79… Entraîne la mémoire de travail." },
        { title: "Mémorisez une liste de courses", description: "Avant de sortir, essayez de rappeler 10 produits sans regarder." },
        { title: "Répétez des nombres à l'envers", description: "Lisez un numéro de téléphone et répétez-le à l'envers." },
        { title: "Apprenez un mot nouveau par jour", description: "Cherchez-le, utilisez-le dans une phrase et répétez trois fois." },
        { title: "Jouez aux échecs ou sudoku", description: "Stimulent planification, logique et mémoire visuelle." },
      ],
      exercise: {
        id: "memory-sequence",
        title: "Défi : Séquence de mots",
        description: "Mémorisez la liste en 30 secondes. Puis essayez de l'écrire.",
        durationSec: 30,
        steps: [
          "Pomme",
          "Vélo",
          "Lampe",
          "Océan",
          "Guitare",
          "Pyramide",
          "Cahier",
          "Papillon",
        ],
      },
    },
    discipline: {
      title: "Discipline et anti-procrastination",
      subtitle: "Le moteur invisible du succès",
      emoji: "⚡",
      intro: "La discipline bat la motivation. Avec un système, pas besoin d'attendre 'l'envie'.",
      items: [
        { title: "Liberté réelle", description: "Qui contrôle ses impulsions choisit sa vie ; qui procrastine ne fait que réagir." },
        { title: "Meilleure estime de soi", description: "Tenir ses promesses construit la confiance jour après jour." },
        { title: "Moins d'anxiété", description: "La procrastination accumule les tâches et multiplie le stress. L'action immédiate le dissout." },
        { title: "Résultats composés", description: "De petites actions quotidiennes créent de grands changements en 6-12 mois." },
        { title: "Règle des 2 minutes", description: "Si une tâche prend moins de 2 min, faites-la. Sinon, engagez-vous juste 2 min." },
        { title: "Concevez votre environnement", description: "Retirez les distractions visuelles : téléphone loin, onglet fermé." },
        { title: "Time blocking", description: "Assignez des blocs fixes aux tâches importantes ; traitez-les comme inviolables." },
        { title: "Célébrez le processus", description: "N'attendez pas le résultat : honorez chaque action accomplie." },
      ],
    },
  },
  it: {
    habits: {
      title: "Abitudini per migliorare la memoria",
      subtitle: "Piccoli cambiamenti, grande impatto",
      emoji: "🧠",
      intro: "La memoria si allena come un muscolo. Queste abitudini rafforzano le connessioni neurali.",
      items: [
        { title: "Dormi 7-9 ore", description: "Nel sonno profondo il cervello consolida i ricordi del giorno." },
        { title: "Idratati sempre", description: "Una lieve disidratazione riduce attenzione e memoria a breve termine." },
        { title: "Leggi 20 minuti al giorno", description: "Stimola l'immaginazione e rafforza la rete neurale del linguaggio." },
        { title: "Impara qualcosa di nuovo ogni settimana", description: "Lingue, strumenti o ricette creano nuove vie neurali." },
        { title: "Riduci il tempo davanti allo schermo", description: "L'eccesso di stimoli rapidi indebolisce la memoria di lavoro." },
        { title: "Medita 10 minuti al giorno", description: "La consapevolezza migliora la concentrazione e riduce lo stress." },
      ],
    },
    foods: {
      title: "Alimenti che potenziano la memoria",
      subtitle: "Nutri il tuo cervello dal piatto",
      emoji: "🥑",
      intro: "Il cervello consuma il 20% della tua energia. Questi alimenti forniscono nutrienti chiave.",
      items: [
        { title: "Pesce azzurro", description: "Salmone, sardine e sgombro forniscono omega-3, essenziali per le membrane neurali." },
        { title: "Frutti rossi", description: "Mirtilli e fragole sono ricchi di antiossidanti che rallentano l'invecchiamento cerebrale." },
        { title: "Noci e semi", description: "Contengono vitamina E e grassi sani che proteggono i neuroni." },
        { title: "Cacao puro", description: "I flavonoidi aumentano il flusso sanguigno cerebrale e migliorano la concentrazione." },
        { title: "Avocado", description: "I suoi grassi monoinsaturi favoriscono la circolazione cerebrale." },
        { title: "Tè verde", description: "Combina caffeina e L-teanina per un'attenzione calma e sostenuta." },
        { title: "Curcuma", description: "La curcumina ha effetti antinfiammatori e neuroprotettivi." },
        { title: "Uova", description: "La colina è chiave per produrre acetilcolina, neurotrasmettitore della memoria." },
      ],
    },
    exercises: {
      title: "Esercizi per allenare la memoria",
      subtitle: "Attiva la tua mente ogni giorno",
      emoji: "🎯",
      intro: "Come ogni abilità, la memoria migliora con la pratica deliberata.",
      items: [
        { title: "Metodo del palazzo della memoria", description: "Associa idee a luoghi familiari per ricordare liste lunghe." },
        { title: "Conto alla rovescia di 7 in 7", description: "Da 100, sottrai 7 mentalmente: 93, 86, 79… Allena la memoria di lavoro." },
        { title: "Memorizza una lista della spesa", description: "Prima di uscire, prova a ricordare 10 prodotti senza guardare." },
        { title: "Ripeti numeri al contrario", description: "Leggi un numero di telefono e ripetilo al contrario." },
        { title: "Impara una parola nuova al giorno", description: "Cercala, usala in una frase e ripetila ad alta voce tre volte." },
        { title: "Gioca a scacchi o sudoku", description: "Stimolano pianificazione, logica e memoria visiva." },
      ],
      exercise: {
        id: "memory-sequence",
        title: "Sfida: Sequenza di parole",
        description: "Memorizza la lista in 30 secondi. Poi prova a scriverla.",
        durationSec: 30,
        steps: [
          "Mela",
          "Bicicletta",
          "Lampada",
          "Oceano",
          "Chitarra",
          "Piramide",
          "Quaderno",
          "Farfalla",
        ],
      },
    },
    discipline: {
      title: "Disciplina e non procrastinare",
      subtitle: "Il motore invisibile del successo",
      emoji: "⚡",
      intro: "La disciplina batte la motivazione. Con un sistema, non serve aspettare di 'avere voglia'.",
      items: [
        { title: "Libertà reale", description: "Chi controlla i propri impulsi sceglie la sua vita; chi procrastina reagisce soltanto." },
        { title: "Migliore autostima", description: "Mantenere le promesse a se stessi costruisce fiducia giorno dopo giorno." },
        { title: "Meno ansia", description: "La procrastinazione accumula compiti e moltiplica lo stress. L'azione immediata lo dissolve." },
        { title: "Risultati composti", description: "Piccole azioni quotidiane creano grandi cambiamenti in 6-12 mesi." },
        { title: "Regola dei 2 minuti", description: "Se un compito dura meno di 2 min, fallo subito. Se è grande, impegnati solo 2 min." },
        { title: "Progetta il tuo ambiente", description: "Togli distrazioni visive: telefono lontano, scheda chiusa." },
        { title: "Time blocking", description: "Assegna blocchi fissi ai compiti importanti; trattali come inviolabili." },
        { title: "Celebra il processo", description: "Non aspettare il risultato: onora ogni azione compiuta come vittoria." },
      ],
    },
  },
};

export const TIP_CATEGORIES: TipCategoryId[] = ["habits", "foods", "exercises", "discipline"];

export function getTipsContent(locale: Locale): TipsContent {
  return tipsContent[locale] || tipsContent.es;
}
