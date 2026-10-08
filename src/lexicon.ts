/**
 * SKEW - Massive Lexicon & AI Cliche Replacement Database
 * 
 * Comprehensive multilingual (Italian & English) dataset mapping AI clichés,
 * robotic buzzwords, syntactic tics, and hollow nominalizations to natural human alternatives.
 * 
 * Used for:
 * 1. Deep statistical metric analysis & detector audits
 * 2. Few-shot contrastive injection into LLM system prompts
 * 3. Deterministic post-processing cleanup
 * 4. Offline heuristic engine transformations
 */

export interface LexiconEntry {
  pattern: RegExp;
  category: 'opener' | 'transition' | 'inflated_verb' | 'buzzword' | 'closer' | 'nominalization';
  alternatives: {
    natural: string[];
    casual?: string[];
    editorial?: string[];
    academic?: string[];
    executive?: string[];
  };
  explanation: string;
}

// ---------------------------------------------------------------------------
// 1. MASSIVE ITALIAN AI VOCABULARY & HUMAN ALTERNATIVES
// ---------------------------------------------------------------------------

export const ITALIAN_AI_LEXICON: LexiconEntry[] = [
  // --- A. Inflated Verbs & Periphrastic Evasions (Evitare il verbo essere) ---
  {
    pattern: /(?<!\p{L})rappresenta una sfida costante(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["è una sfida continua", "è sempre difficile", "richiede attenzione costante"],
      casual: ["non è mai una passeggiata", "è una bella gatta da pelare"],
      editorial: ["costringe a fare i conti ogni giorno", "è un banco di prova continuo"],
      academic: ["costituisce un fattore di criticità permanente"],
      executive: ["è un nodo operativo critico"]
    },
    explanation: "Sostituisce la perifrasi burocratica 'rappresenta una sfida' con verbi diretti."
  },
  {
    pattern: /(?<!\p{L})rappresenta un(?:o|a)?(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["è un", "è una", "si dimostra un"],
      casual: ["è un", "è proprio un"],
      editorial: ["si rivela un", "è a tutti gli effetti un"],
      academic: ["costituisce un"],
      executive: ["è un"]
    },
    explanation: "AI usa compulsivamente 'rappresenta' per evitare 'è'."
  },
  {
    pattern: /(?<!\p{L})si configura come(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["è", "diventa", "si rivela"],
      casual: ["è in pratica", "è a conti fatti"],
      editorial: ["assume i tratti di", "si mostra come"],
      academic: ["assume la natura di", "si caratterizza quale"],
      executive: ["è", "si traduce in"]
    },
    explanation: "Elimina la perifrasi formale 'si configura come'."
  },
  {
    pattern: /(?<!\p{L})si pone come (?:obiettivo|traguardo)(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["punta a", "mira a", "ha lo scopo di"],
      casual: ["vuole solo", "l'idea è di"],
      editorial: ["punta dritto a", "si fissa di"],
      academic: ["si prefigge di conseguire"],
      executive: ["ha come target"]
    },
    explanation: "Semplifica 'si pone come obiettivo' con verbi d'azione diretti."
  },
  {
    pattern: /(?<!\p{L})svolge un ruolo (?:cruciale|fondamentale|chiave|centrale|primario|determinante)(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["fa la differenza", "ha un peso decisivo", "conta moltissimo", "è determinante"],
      casual: ["è la chiave di volta", "conta parecchio", "è fondamentale davvero"],
      editorial: ["è il motore pulsante", "detta il ritmo", "sposta gli equilibri"],
      academic: ["esercita un influsso determinante", "assume rilievo preponderante"],
      executive: ["è un driver decisivo", "ha un impatto diretto"]
    },
    explanation: "Uno dei più famosi cliché AI in assoluto."
  },
  {
    pattern: /(?<!\p{L})gioca un ruolo (?:chiave|fondamentale|importante)(?!\p{L})/giu,
    category: 'inflated_verb',
    alternatives: {
      natural: ["conta parecchio", "è determinante", "incide direttamente"],
      casual: ["fa la sua parte", "è decisivo"],
      editorial: ["pesa come un macigno", "fa da perno"],
      academic: ["esplica una funzione primaria"],
      executive: ["è un fattore critico"]
    },
    explanation: "Calco anglofono 'gioca un ruolo' (plays a role)."
  },

  // --- B. Openers & Formulaic Assertions ---
  {
    pattern: /(?<!\p{L})è fondamentale (?:sottolineare|ricordare|comprendere|evidenziare) che(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["va detto che", "è chiaro che", "conta ricordare che", "non va dimenticato che"],
      casual: ["sia chiaro:", "il punto vero è che", "la verità è che"],
      editorial: ["un dato è certo:", "i fatti parlano chiaro:", "la realtà parla da sé:"],
      academic: ["risulta primario rilevare che", "si evidenzia in primo luogo che"],
      executive: ["punto chiave:", "dato essenziale:"]
    },
    explanation: "Apertura artificiale pontificante usata all'inizio dei paragrafi."
  },
  {
    pattern: /(?<!\p{L})è (?:importante|cruciale|essenziale) (?:notare|ricordare|sottolineare) che(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["va tenuto presente che", "ricordiamo che", "non dimentichiamo che"],
      casual: ["teniamo a mente che", "occhio al fatto che"],
      editorial: ["non va scordato che", "il punto fermo è che"],
      academic: ["conviene considerare che", "merita rilievo il fatto che"],
      executive: ["nota operativa:", "tenere presente che"]
    },
    explanation: "Ripetizione cerimoniale di avvertimenti."
  },
  {
    pattern: /(?<!\p{L})vale la pena (?:notare|sottolineare|ricordare) che(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["salta all'occhio che", "è interessante osservare come", "notiamo che"],
      casual: ["curioso notare come", "da notare che"],
      editorial: ["il dato interessante è che", "colpisce subito che"],
      academic: ["merita attenta considerazione la circostanza che"],
      executive: ["da segnalare che"]
    },
    explanation: "Calco anglofono da 'it is worth noting that'."
  },
  {
    pattern: /(?<!\p{L})nel mondo moderno (?:di oggi|in cui viviamo)?(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["oggi", "nella realtà attuale", "ormai"],
      casual: ["al giorno d'oggi", "oggi come oggi"],
      editorial: ["nel panorama presente", "nei fatti odierni"],
      academic: ["nella contemporaneità", "nello scenario attuale"],
      executive: ["nel contesto attuale"]
    },
    explanation: "Apertura scolastica stereotipata da saggio AI."
  },
  {
    pattern: /(?<!\p{L})all'interno del panorama (?:attuale|odierno|in continua evoluzione)(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["nello scenario attuale", "sul mercato di oggi", "nella pratica quotidiana"],
      casual: ["nel mondo di oggi", "in questo settore"],
      editorial: ["nella corsa quotidiana", "nel vivo dell'ecosistema"],
      academic: ["nel quadro sistemico contemporaneo"],
      executive: ["nel comparto di riferimento"]
    },
    explanation: "Espressione pomposa per dire semplicemente 'oggi' o 'in questo settore'."
  },
  {
    pattern: /(?<!\p{L})non si può negare che(?!\p{L})/giu,
    category: 'opener',
    alternatives: {
      natural: ["è innegabile che", "è palese che", "tutti sanno che"],
      casual: ["non ci piove che", "è chiaro a tutti che"],
      editorial: ["la verità nuda e cruda è che", "i numeri confermano che"],
      academic: ["risulta incontrovertibile che"],
      executive: ["dato acquisito:"]
    },
    explanation: "Doppia negazione cerimoniale."
  },

  // --- C. Mechanical Transitions & Linking Words ---
  {
    pattern: /(?<!\p{L})inoltre,?\s*/giu,
    category: 'transition',
    alternatives: {
      natural: ["Accanto a questo, ", "In più, ", "Al contempo, ", "D'altro canto, ", ""],
      casual: ["E poi, ", "Oltretutto, ", "Tra l'altro, "],
      editorial: ["Non solo: ", "C'è dell'altro: ", "A ciò si unisce che "],
      academic: ["Sotto un ulteriore profilo, ", "Si aggiunge a ciò la considerazione che "],
      executive: ["In parallelo, ", "Inoltre, "]
    },
    explanation: "Connettivo ripetuto compulsivamente dall'AI per allungare il brodo."
  },
  {
    pattern: /(?<!\p{L})in conclusione,?\s*/giu,
    category: 'closer',
    alternatives: {
      natural: ["In sintesi, ", "Tirando le somme, ", "Alla fine, ", "Arrivando al punto, "],
      casual: ["In parole povere, ", "Stringi stringi, ", "Tutto sommato, "],
      editorial: ["Il quadro è chiaro: ", "La realtà è una sola: ", "In sostanza, "],
      academic: ["In ultima analisi, ", "Dall'analisi svolta emerge che "],
      executive: ["In sintesi, ", "Conclusioni operative: "]
    },
    explanation: "Chiusura scolastica obbligata tipica di ChatGPT/Llama."
  },
  {
    pattern: /(?<!\p{L})pertanto,?\s*/giu,
    category: 'transition',
    alternatives: {
      natural: ["Di riflesso, ", "Ne consegue che ", "Per questa ragione, ", "Quindi "],
      casual: ["Quindi, ", "Ecco perché ", "Di conseguenza, "],
      editorial: ["Il risultato? ", "Inevitabilmente, "],
      academic: ["Ne discende pertanto che ", "Si evince conseguentemente che "],
      executive: ["Quindi, ", "Conseguenza diretta: "]
    },
    explanation: "Transizione burocratica antiquata."
  },
  {
    pattern: /(?<!\p{L})alla luce di (?:quanto sopra|ciò|queste considerazioni)(?!\p{L})/giu,
    category: 'transition',
    alternatives: {
      natural: ["visto questo", "su queste basi", "per questo motivo"],
      casual: ["viste le cose così", "per forza di cose"],
      editorial: ["a questo punto", "davanti a questi fatti"],
      academic: ["in ragione di tali premesse"],
      executive: ["su queste evidenze"]
    },
    explanation: "Formula forense/giuridica usata fuori contesto dai modelli linguistici."
  },

  // --- D. Shallow Closers & Slogans (Wikipedia §2, §4, §15) ---
  {
    pattern: /(?<!\p{L})ponendo le basi per (?:un|una|il|la)?(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["favorendo così", "creando i presupposti per", "permettendo"],
      casual: ["aprendo la strada a", "dando il via a"],
      editorial: ["spianando la strada verso", "gettando le fondamenta per"],
      academic: ["costituendo il presupposto applicativo per"],
      executive: ["abilitando"]
    },
    explanation: "Gerundio di coda artificiale (-ing rider) per chiudere in trionfalismo."
  },
  {
    pattern: /(?<!\p{L})apre la strada a (?:nuove possibilità|un futuro migliore|nuove opportunità)?(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["consente nuove soluzioni", "rende possibili nuovi sviluppi", "facilita la crescita"],
      casual: ["apre un mondo di possibilità", "dà via libera a nuove opzioni"],
      editorial: ["sblocca opzioni inedite", "accende nuovi orizzonti"],
      academic: ["dischiude inedite prospettive di ricerca"],
      executive: ["genera nuove opportunità operative"]
    },
    explanation: "Frase a effetto preconfezionata da brochure promozionale."
  },
  {
    pattern: /(?<!\p{L})minimizzando (?:il rischio|la probabilità|l'impatto) di(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["riduce al minimo", "abbassa nettamente la probabilità di", "evita così"],
      casual: ["taglia a zero il rischio di", "evita guai con"],
      editorial: ["azzera quasi del tutto", "sbarra la strada a"],
      academic: ["attenuando significativamente l'incidenza di"],
      executive: ["mitigando il rischio di"]
    },
    explanation: "Gerundio pendente alla fine del periodo."
  },
  {
    pattern: /(?<!\p{L})garantendo (?:così )?(?:un|una|il|la)?(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["e assicura", "il che offre", "permettendo"],
      casual: ["dando così", "assicurando"],
      editorial: ["blindando di fatto", "consolidando"],
      academic: ["assicurando in tal modo"],
      executive: ["garantendo"]
    },
    explanation: "Gerundio conclusivo aggiunto come formula fissa."
  },

  // --- E. Buzzwords, Metaphors & Hollow Grandeur ---
  {
    pattern: /(?<!\p{L})un mosaico di(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["un insieme di", "una varietà di", "una combinazione di"],
      casual: ["un bel mix di", "una serie di"],
      editorial: ["un intreccio vivace di"],
      academic: ["un quadro articolato di"],
      executive: ["un ventaglio di"]
    },
    explanation: "Traduzione letterale della buzzword AI 'a rich tapestry of'."
  },
  {
    pattern: /(?<!\p{L})un testamento (?:a|di|al|alla)(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["una prova concreta di", "una dimostrazione di", "un chiaro segno di"],
      casual: ["la prova evidente che", "la dimostrazione che"],
      editorial: ["la testimonianza vivente di", "la firma inequivocabile di"],
      academic: ["una tangibile attestazione di"],
      executive: ["evidenza diretta di"]
    },
    explanation: "Traduzione grottesca del cliché anglofono 'a testament to'."
  },
  {
    pattern: /(?<!\p{L})viaggio trasformativo(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["profondo cambiamento", "fase di evoluzione", "trasformazione in atto"],
      casual: ["salto in avanti", "cambio di passo"],
      editorial: ["svolta radicale", "corsa al cambiamento"],
      academic: ["processo di mutamento strutturale"],
      executive: ["piano di trasformazione strategica"]
    },
    explanation: "Cliché motivazionale vuoto 'transformative journey'."
  },
  {
    pattern: /(?<!\p{L})approccio olistico(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["visione d'insieme", "metodo integrato", "approccio completo"],
      casual: ["sguardo a tutto tondo", "visione a 360 gradi"],
      editorial: ["quadro complessivo", "prospettiva a largo raggio"],
      academic: ["paradigma sistemico integrato"],
      executive: ["gestione end-to-end"]
    },
    explanation: "Buzzword aziendale iperusata dai modelli."
  },
  {
    pattern: /(?<!\p{L})tassello (?:fondamentale|essenziale|cruciale|chiave)(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["passo importante", "elemento decisivo", "fattore chiave"],
      casual: ["pezzo grosso", "cosa irrinunciabile"],
      editorial: ["ingranaggio centrale", "mattoncino decisivo"],
      academic: ["componente determinante"],
      executive: ["milestone critica"]
    },
    explanation: "Metafora trita e ritrita ('crucial piece of the puzzle')."
  },
  {
    pattern: /(?<!\p{L})senza precedenti(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["mai visto prima", "straordinario", "del tutto nuovo"],
      casual: ["davvero inedito", "mai visto"],
      editorial: ["di portata storica", "senza eguali recenti"],
      academic: ["inedito nella letteratura o prassi"],
      executive: ["di impatto inedito"]
    },
    explanation: "Iperbole da comunicato stampa generato da IA ('unprecedented')."
  },
  {
    pattern: /(?<!\p{L})navigare le complessità(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["affrontare le difficoltà", "gestire i nodi complessi", "muoversi tra i problemi"],
      casual: ["districarsi tra i problemi", "venire a capo dei dettagli"],
      editorial: ["fare i conti con le complessità", "farsi largo tra gli ostacoli"],
      academic: ["governare la complessità intrinseca"],
      executive: ["gestire i fattori critici"]
    },
    explanation: "Calco anglofono da 'navigate the complexities'."
  },
  {
    pattern: /(?<!\p{L})in sinergia(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["insieme", "di concerto", "lavorando a stretto contatto"],
      casual: ["braccio a braccio", "a quattro mani"],
      editorial: ["facendo fronte comune", "in perfetta sintonia"],
      academic: ["in cooperazione congiunta"],
      executive: ["integrandosi operativamente"]
    },
    explanation: "Buzzword da slide corporate."
  },
  {
    pattern: /(?<!\p{L})catalizzatore di (?:cambiamento|innovazione)(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["motore del cambiamento", "fattore scatenante", "spinta all'innovazione"],
      casual: ["molla per rinnovare", "miccia del cambiamento"],
      editorial: ["innesco di una rivoluzione", "leva di svolta"],
      academic: ["fattore accelerante"],
      executive: ["acceleratore strategico"]
    },
    explanation: "Cliché pseudo-scientifico ('catalyst for change')."
  },
  {
    pattern: /(?<!\p{L})armonioso(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["equilibrato", "coerente", "ben calibrato"],
      casual: ["fluido", "ben fatto"],
      editorial: ["senza sbavature", "coeso"],
      academic: ["organico"],
      executive: ["allineato"]
    },
    explanation: "Aggettivo idilliaco inserito dai bot per suonare positivi."
  },
  {
    pattern: /(?<!\p{L})poliedrico(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["versatile", "ricco di sfaccettature", "variegato"],
      casual: ["versatile", "dai mille volti"],
      editorial: ["a tutto campo"],
      academic: ["multidimensionale"],
      executive: ["multifunzionale"]
    },
    explanation: "Calco di 'multifaceted'."
  },

  // --- F. Tech Marketing & Hollow Product Copy (SaaS Brochure Clichés) ---
  {
    pattern: /(?<!\p{L})fondersi perfettamente nel flusso di lavoro(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["integrarsi nel lavoro quotidiano", "inserirsi direttamente nelle abitudini di sviluppo", "lavorare nel proprio ambiente"],
      casual: ["entrare nel giro di lavoro senza farsi notare", "girare liscio nel lavoro di ogni giorno"],
      editorial: ["incastrarsi senza attrito nella routine quotidiana"],
      academic: ["integrarsi pienamente nei flussi operativi vigenti"],
      executive: ["integrarsi direttamente nel workflow aziendale"]
    },
    explanation: "Collocazione da brochure marketing ('seamlessly blend into workflow')."
  },
  {
    pattern: /(?<!\p{L})fondersi perfettamente(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["integrarsi senza sforzo", "adattarsi subito", "inserirsi naturalmente"],
      casual: ["andare d'accordo", "funzionare all'istante"],
      editorial: ["aderire alla perfezione"],
      academic: ["integrarsi armoniosamente"],
      executive: ["integrarsi senza attriti"]
    },
    explanation: "Calco di 'seamlessly blend'."
  },
  {
    pattern: /(?<!\p{L})architettura snella(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["struttura leggera", "pochi megabyte di footprint", "base di codice essenziale"],
      casual: ["struttura snella e leggera", "senza codice spazzatura"],
      editorial: ["impianto essenziale e leggero"],
      academic: ["architettura modulare a basso overhead"],
      executive: ["struttura snella a basso consumo di risorse"]
    },
    explanation: "Buzzword vuota per descrivere qualsiasi software senza dire quanto pesa."
  },
  {
    pattern: /(?<!\p{L})reattività istantanea(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["risposte immediate", "senza latenza percettibile", "tempi di risposta fulminei"],
      casual: ["zero lag", "velocissimo nei click"],
      editorial: ["scatto immediato", "risposta al millisecondo"],
      academic: ["elevata responsività con latenze minime"],
      executive: ["latenza quasi nulla"]
    },
    explanation: "Aggettivo iperbolico da brochure."
  },
  {
    pattern: /(?<!\p{L})interfaccia (?:è )?(?:pulita e intuitiva|intuitiva e pulita)(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["comandi subito a portata di mano", "interfaccia essenziale e ordinata", "schermata priva di elementi superflui"],
      casual: ["facile da usare al primo colpo", "senza pulsanti inutili"],
      editorial: ["un'interfaccia che non fa perdere tempo", "un layout pulito ed efficace"],
      academic: ["interfaccia utente a bassa complessità cognitiva"],
      executive: ["interfaccia essenziale e di immediata adozione"]
    },
    explanation: "Il cliché marketing più abusato per le UI ('clean and intuitive interface')."
  },
  {
    pattern: /(?<!\p{L})con un semplice cli(?:ck|c)(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["subito", "con un solo comando", "direttamente", "all'istante"],
      casual: ["al volo", "in un attimo"],
      editorial: ["in un lampo", "con un colpo solo"],
      academic: ["in un unico passaggio operativo"],
      executive: ["con un solo passaggio"]
    },
    explanation: "Formula archetipica del copy pubblicitario generico ('with a single click')."
  },
  {
    pattern: /(?<!\p{L})(?:, )?permettendo di monitorare(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: [": così controlli", ", per seguire", "; si possono monitorare"],
      casual: [" e ti fa tenere d'occhio", ", così vedi subito"],
      editorial: [", aprendo la vista su"],
      academic: [", consentendo la rilevazione di"],
      executive: [", abilitando il tracking di"]
    },
    explanation: "Connettore funzionale feature -> beneficio generico."
  },
  {
    pattern: /(?<!\p{L})(?:, )?consentendo di gestire(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: [", così da gestire", "; permette di organizzare", " e gestisce"],
      casual: [" e ti fa gestire", ", per sistemare"],
      editorial: [", prendendo il controllo di"],
      academic: [", facilitando l'amministrazione di"],
      executive: [", semplificando la governance di"]
    },
    explanation: "Connettore funzionale 'consentendo di'."
  },
  {
    pattern: /(?<!\p{L})assicura uniformità in ogni sessione(?!\p{L})/giu,
    category: 'closer',
    alternatives: {
      natural: ["mantiene coerente lo stato dell'applicazione", "evita discrepanze nei dati tra una sessione e l'altra", "garantisce che i dati restino allineati"],
      casual: ["lascia tutto sincronizzato tra una sessione e l'altra", "non perde un dato da una sessione all'altra"],
      editorial: ["preserva la totale coerenza dello stato tra sessioni"],
      academic: ["garantisce la persistenza e l'allineamento deterministico dello stato"],
      executive: ["mantiene allineati i dati operativi in tempo reale"]
    },
    explanation: "Plausibilità semantica fasulla: sincronizzazione assicura coerenza/allineamento di stato, non 'uniformità'."
  },
  {
    pattern: /(?<!\p{L})parametri cruciali senza distrazioni(?!\p{L})/giu,
    category: 'buzzword',
    alternatives: {
      natural: ["metriche essenziali senza ingombrare lo schermo", "parametri chiave senza elementi di disturbo", "dati utili a colpo d'occhio"],
      casual: ["i dati che contano davvero senza perdersi nei menu", "le cose importanti al volo"],
      editorial: ["i segnali vitali senza rumore di fondo"],
      academic: ["le variabili critiche con ridotto carico visivo"],
      executive: ["i KPI operativi senza rumore informativo"]
    },
    explanation: "Promessa promozionale vuota."
  }
];

// ---------------------------------------------------------------------------
// 2. MASSIVE ENGLISH AI LEXICON & HUMAN ALTERNATIVES
// ---------------------------------------------------------------------------

export const ENGLISH_AI_LEXICON: LexiconEntry[] = [
  {
    pattern: /\bdelve(?:s|d|ing)?\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["look into", "explore", "dig into", "examine"],
      casual: ["check out", "dive in", "look closer at"],
      editorial: ["probe", "investigate", "dissect"],
      academic: ["investigate", "analyze in detail"],
      executive: ["review", "assess"]
    },
    explanation: "The #1 classic sign of ChatGPT output."
  },
  {
    pattern: /\brich tapestry\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["diverse mix", "broad range", "mosaic", "blend"],
      casual: ["colorful mix", "wild blend"],
      editorial: ["layered fabric", "vibrant cross-section"],
      academic: ["complex matrix", "multifaceted composition"],
      executive: ["broad spectrum"]
    },
    explanation: "Extremely overused generative AI metaphor."
  },
  {
    pattern: /\ba testament to\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["proof of", "evidence of", "a clear sign of"],
      casual: ["living proof that", "shows how"],
      editorial: ["hard proof of", "concrete proof that"],
      academic: ["empirical corroboration of"],
      executive: ["clear evidence of"]
    },
    explanation: "Staged praise trope."
  },
  {
    pattern: /\bplays a (?:pivotal|crucial|vital|key) role\b/gi,
    category: 'inflated_verb',
    alternatives: {
      natural: ["matters deeply", "is central", "drives", "makes a big difference"],
      casual: ["is huge", "is a big deal"],
      editorial: ["is the bedrock", "anchors", "fuels"],
      academic: ["exerts a decisive influence"],
      executive: ["is a primary driver"]
    },
    explanation: "Mechanical importance booster."
  },
  {
    pattern: /\bstands as a (?:testament|beacon|symbol)\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["is a clear example", "remains a strong proof", "embodies"],
      casual: ["is living proof", "really shows"],
      editorial: ["is a monument to", "anchors"],
      academic: ["exemplifies"],
      executive: ["demonstrates"]
    },
    explanation: "Hollow grandeur marker."
  },
  {
    pattern: /\bnavigat(?:e|ing|es) the complexities\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["handling the challenges", "dealing with complications", "sorting through"],
      casual: ["figuring things out", "working through the mess"],
      editorial: ["confronting the friction", "tackling"],
      academic: ["addressing systemic friction"],
      executive: ["managing operational risks"]
    },
    explanation: "Cliche corporate navigation metaphor."
  },
  {
    pattern: /\bever-evolving (?:landscape|world|domain)\b/gi,
    category: 'opener',
    alternatives: {
      natural: ["fast-changing scene", "rapidly shifting sector", "modern market"],
      casual: ["fast-moving world", "today's crazy scene"],
      editorial: ["fast-shifting frontier", "moving target of"],
      academic: ["dynamic environment"],
      executive: ["competitive sector"]
    },
    explanation: "Tired throat-clearing intro."
  },
  {
    pattern: /\bin conclusion,?\b/gi,
    category: 'closer',
    alternatives: {
      natural: ["In short, ", "To wrap up, ", "Ultimately, ", "The bottom line is: "],
      casual: ["All in all, ", "Long story short, "],
      editorial: ["The takeaway is unmistakable: ", "At the end of the day, "],
      academic: ["In sum, ", "The evidence indicates that "],
      executive: ["Key takeaway: ", "Bottom line: "]
    },
    explanation: "Middle school essay transition marker."
  },
  {
    pattern: /\bfurthermore,?\b/gi,
    category: 'transition',
    alternatives: {
      natural: ["Beyond that, ", "Also, ", "At the same time, ", ""],
      casual: ["Plus, ", "On top of that, "],
      editorial: ["What's more: ", "Better yet, "],
      academic: ["Additionally, ", "Moreover, "],
      executive: ["In addition, "]
    },
    explanation: "Overly formal AI linker."
  },
  {
    pattern: /\bit is (?:important|crucial|essential) to remember that\b/gi,
    category: 'opener',
    alternatives: {
      natural: ["keep in mind that", "worth noting that", "remember that"],
      casual: ["don't forget that", "keep in mind that"],
      editorial: ["the reality is that", "one thing is certain:"],
      academic: ["one must take into account that"],
      executive: ["note that:"]
    },
    explanation: "Pontificating assertion opener."
  },
  {
    pattern: /\bit is worth noting that\b/gi,
    category: 'opener',
    alternatives: {
      natural: ["notably, ", "interestingly, ", "notice that"],
      casual: ["fun fact: ", "worth noting: "],
      editorial: ["what stands out is that", "the striking detail is:"],
      academic: ["it is relevant to observe that"],
      executive: ["notable metric:"]
    },
    explanation: "Mechanical observation formula."
  },
  {
    pattern: /\btransformative journey\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["major shift", "sweeping change", "evolution"],
      casual: ["wild ride", "huge shift"],
      editorial: ["sea change", "radical pivot"],
      academic: ["structural transition"],
      executive: ["strategic transformation"]
    },
    explanation: "Melodramatic journey cliché."
  },
  {
    pattern: /\blaying the groundwork for\b/gi,
    category: 'closer',
    alternatives: {
      natural: ["setting up", "enabling", "paving the way for"],
      casual: ["setting the stage for", "opening doors to"],
      editorial: ["laying rails for", "priming"],
      academic: ["establishing the foundational parameters for"],
      executive: ["enabling"]
    },
    explanation: "Shallow participial tail rider."
  },
  {
    pattern: /\bseamlessly\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["smoothly", "directly", "without friction"],
      casual: ["like a charm", "cleanly"],
      editorial: ["without missing a beat"],
      academic: ["with minimal friction"],
      executive: ["frictionless"]
    },
    explanation: "AI marketing buzzword overused for software descriptions."
  },
  {
    pattern: /\bholistic approach\b/gi,
    category: 'buzzword',
    alternatives: {
      natural: ["big-picture view", "comprehensive strategy", "end-to-end plan"],
      casual: ["all-around view", "full-circle plan"],
      editorial: ["panoramic view", "complete blueprint"],
      academic: ["systemic perspective"],
      executive: ["integrated strategy"]
    },
    explanation: "Corporate generic adjective."
  }
];

// ---------------------------------------------------------------------------
// 3. COMBINED FLAT CLICHE ARRAY FOR ULTRA-FAST AUDITS
// ---------------------------------------------------------------------------

export const ALL_AUDIT_CLICHES: { phrase: string; lang: 'it' | 'en'; weight: number }[] = [
  // Italian items (ordered by high to low specificity)
  { phrase: "è fondamentale sottolineare che", lang: 'it', weight: 3 },
  { phrase: "è fondamentale sottolineare", lang: 'it', weight: 2 },
  { phrase: "è fondamentale ricordare che", lang: 'it', weight: 2 },
  { phrase: "è fondamentale", lang: 'it', weight: 1 },
  { phrase: "vale la pena notare che", lang: 'it', weight: 2 },
  { phrase: "vale la pena notare", lang: 'it', weight: 1 },
  { phrase: "svolge un ruolo cruciale", lang: 'it', weight: 3 },
  { phrase: "svolge un ruolo fondamentale", lang: 'it', weight: 3 },
  { phrase: "svolge un ruolo chiave", lang: 'it', weight: 2 },
  { phrase: "gioca un ruolo chiave", lang: 'it', weight: 2 },
  { phrase: "gioca un ruolo fondamentale", lang: 'it', weight: 2 },
  { phrase: "rappresenta una sfida costante", lang: 'it', weight: 3 },
  { phrase: "rappresenta una sfida", lang: 'it', weight: 2 },
  { phrase: "rappresenta un tassello", lang: 'it', weight: 3 },
  { phrase: "rappresenta un elemento", lang: 'it', weight: 2 },
  { phrase: "si configura come", lang: 'it', weight: 2 },
  { phrase: "si pone come obiettivo", lang: 'it', weight: 2 },
  { phrase: "un mosaico di", lang: 'it', weight: 3 },
  { phrase: "un testamento a", lang: 'it', weight: 3 },
  { phrase: "un testamento al", lang: 'it', weight: 3 },
  { phrase: "viaggio trasformativo", lang: 'it', weight: 3 },
  { phrase: "approccio olistico", lang: 'it', weight: 2 },
  { phrase: "tassello fondamentale", lang: 'it', weight: 2 },
  { phrase: "tassello essenziale", lang: 'it', weight: 2 },
  { phrase: "senza precedenti", lang: 'it', weight: 2 },
  { phrase: "navigare le complessità", lang: 'it', weight: 3 },
  { phrase: "panorama in continua evoluzione", lang: 'it', weight: 3 },
  { phrase: "alla luce di ciò", lang: 'it', weight: 2 },
  { phrase: "ponendo le basi per", lang: 'it', weight: 3 },
  { phrase: "apre la strada a", lang: 'it', weight: 2 },
  { phrase: "minimizzando il rischio", lang: 'it', weight: 2 },
  { phrase: "fondersi perfettamente", lang: 'it', weight: 3 },
  { phrase: "architettura snella", lang: 'it', weight: 3 },
  { phrase: "reattività istantanea", lang: 'it', weight: 3 },
  { phrase: "pulita e intuitiva", lang: 'it', weight: 3 },
  { phrase: "con un semplice clic", lang: 'it', weight: 3 },
  { phrase: "con un semplice click", lang: 'it', weight: 3 },
  { phrase: "permettendo di monitorare", lang: 'it', weight: 3 },
  { phrase: "consentendo di gestire", lang: 'it', weight: 3 },
  { phrase: "assicura uniformità", lang: 'it', weight: 3 },
  { phrase: "parametri cruciali senza distrazioni", lang: 'it', weight: 3 },
  { phrase: "nel regno di", lang: 'it', weight: 2 },
  { phrase: "far luce su", lang: 'it', weight: 2 },
  { phrase: "catalizzatore di cambiamento", lang: 'it', weight: 3 },
  { phrase: "in conclusione", lang: 'it', weight: 2 },
  { phrase: "inoltre", lang: 'it', weight: 1 },
  { phrase: "pertanto", lang: 'it', weight: 1 },

  // English items
  { phrase: "delve", lang: 'en', weight: 3 },
  { phrase: "delving into", lang: 'en', weight: 3 },
  { phrase: "rich tapestry", lang: 'en', weight: 3 },
  { phrase: "tapestry of", lang: 'en', weight: 2 },
  { phrase: "a testament to", lang: 'en', weight: 3 },
  { phrase: "stands as a testament", lang: 'en', weight: 3 },
  { phrase: "stands as a beacon", lang: 'en', weight: 3 },
  { phrase: "plays a pivotal role", lang: 'en', weight: 3 },
  { phrase: "plays a crucial role", lang: 'en', weight: 3 },
  { phrase: "plays a vital role", lang: 'en', weight: 3 },
  { phrase: "navigate the complexities", lang: 'en', weight: 3 },
  { phrase: "navigating the complexities", lang: 'en', weight: 3 },
  { phrase: "ever-evolving landscape", lang: 'en', weight: 3 },
  { phrase: "dynamic landscape", lang: 'en', weight: 2 },
  { phrase: "it is worth noting that", lang: 'en', weight: 2 },
  { phrase: "it is important to remember that", lang: 'en', weight: 2 },
  { phrase: "in conclusion", lang: 'en', weight: 2 },
  { phrase: "furthermore", lang: 'en', weight: 1 },
  { phrase: "moreover", lang: 'en', weight: 1 },
  { phrase: "transformative journey", lang: 'en', weight: 3 },
  { phrase: "laying the groundwork for", lang: 'en', weight: 3 },
  { phrase: "seamlessly integrated", lang: 'en', weight: 2 },
  { phrase: "seamlessly", lang: 'en', weight: 1 },
  { phrase: "holistic approach", lang: 'en', weight: 2 },
  { phrase: "game-changer", lang: 'en', weight: 2 },
  { phrase: "foster a culture of", lang: 'en', weight: 2 },
  { phrase: "in the realm of", lang: 'en', weight: 3 }
];

/**
 * Returns a human-friendly dictionary of contrastive before/after pairs
 * suitable for inclusion directly into an LLM prompt as few-shot rules.
 */
export function getPromptContrastiveExamples(isItalian: boolean): string {
  if (isItalian) {
    return `
DIZIONARIO CONTRASTIVO DI TRASFORMAZIONE (CLICHÉ DA BOT -> ALTERNATIVA UMANA):
- "rappresenta una sfida costante" -> "è una sfida continua" / "richiede attenzione costante"
- "rappresenta un elemento / si configura come" -> "è" / "si rivela"
- "svolge un ruolo cruciale / fondamentale" -> "fa la differenza" / "è determinante" / "pesa molto"
- "gioca un ruolo chiave" -> "conta parecchio" / "incide direttamente"
- "è fondamentale sottolineare che" -> "va detto che" / "è chiaro che" / "conta ricordare che"
- "vale la pena notare che" -> "salta all'occhio che" / "notiamo che"
- "nel mondo moderno di oggi / all'interno del panorama" -> "oggi" / "nella realtà attuale"
- "inoltre, l'implementazione di..." -> "introdurre..." / "al contempo, usare..." (MAI usare 'inoltre')
- "in conclusione, un'architettura..." -> "alla fine dei conti, una buona architettura..." (MAI usare 'in conclusione')
- "un mosaico di / un testamento a" -> "un insieme di" / "una prova lampante di"
- "viaggio trasformativo" -> "profondo cambiamento" / "evoluzione"
- "approccio olistico" -> "visione d'insieme" / "metodo completo"
- "navigare le complessità" -> "gestire le difficoltà" / "districarsi tra i problemi"
- "ponendo le basi per / minimizzando il rischio" -> "riduce il rischio" / "e crea le condizioni per" (NO gerundi di coda)
- "fondersi perfettamente nel flusso di lavoro" -> "integrarsi nel lavoro quotidiano" / "lavorare nel proprio ambiente"
- "architettura snella / reattività istantanea" -> "struttura leggera" / "senza latenza" / "risponde subito"
- "interfaccia pulita e intuitiva" -> "comandi subito a portata di mano" / "interfaccia ordinata"
- "con un semplice clic" -> "subito" / "con un solo comando" / "all'istante"
- "permettendo di monitorare / consentendo di gestire" -> ": così controlli" / "e permette di organizzare"
- "assicura uniformità in ogni sessione" -> "mantiene allineato e coerente lo stato dell'applicazione"
`;
  }

  return `
CONTRASTIVE TRANSFORMATION DICTIONARY (AI BOT CLICHÉ -> NATURAL HUMAN ALTERNATIVE):
- "delve into" -> "examine" / "look into" / "dig into"
- "rich tapestry of" -> "diverse mix of" / "broad spectrum of"
- "stands as a testament to" -> "is clear proof of" / "proves that"
- "plays a pivotal / crucial / vital role" -> "is central to" / "drives" / "matters deeply"
- "navigate the complexities of" -> "manage the challenges of" / "work through"
- "ever-evolving landscape" -> "fast-changing scene" / "current environment"
- "it is important to remember that" -> "keep in mind that" / "remember that"
- "it is worth noting that" -> "notably," / "notice that"
- "furthermore / moreover" -> "also," / "beyond that," / (integrate smoothly without transitional filler)
- "in conclusion" -> "in short," / "ultimately," / "the bottom line is"
- "transformative journey" -> "major evolution" / "deep shift"
- "laying the groundwork for" -> "setting up" / "paving the way for"
- "seamlessly" -> "smoothly" / "cleanly" / "without friction"
`;
}

