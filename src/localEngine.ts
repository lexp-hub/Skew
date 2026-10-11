/**
 * SKEW - Local Precision NLP Humanizer Engine
 * 
 * High-precision, zero-model deterministic & statistical linguistic transformer.
 * Engineered to dismantle statistical AI detector fingerprints (Perplexity & Burstiness):
 * 1. Deep Cliché & Formulaic AI Phrase Stripper (Unicode-aware regex for IT & EN)
 * 2. Sentence Length Variance & Cadence Sculptor (Burstiness booster)
 * 3. Robotic Transition & Sentence Opener Breaker
 * 4. Active Voice & De-nominalization Converter
 * 5. Multi-Persona & Aggression Level Styler
 */

export type HumanizeMode = 'natural' | 'casual' | 'academic' | 'editorial' | 'executive';
export type AggressionLevel = 'light' | 'medium' | 'aggressive';

export interface LocalEngineOptions {
  mode?: HumanizeMode;
  aggression?: AggressionLevel;
  seed?: number;
}

// ---------------------------------------------------------------------------
// 1. REPLACEMENT RULE INTERFACE & HELPER
// ---------------------------------------------------------------------------

interface ReplacementRule {
  pattern: RegExp;
  replacements: {
    natural: string[];
    casual?: string[];
    academic?: string[];
    editorial?: string[];
    executive?: string[];
  };
}

import { ITALIAN_AI_LEXICON, ENGLISH_AI_LEXICON } from './lexicon';

// ---------------------------------------------------------------------------
// 2. ITALIAN RULES (Unicode-aware, handles accents & gender agreement)
// ---------------------------------------------------------------------------


const ITALIAN_RULES: ReplacementRule[] = [
  // --- Formulaic Openers & Assertions ---
  {
    pattern: /(?<!\p{L})[Èè] fondamentale sottolineare che(?!\p{L})/gu,
    replacements: {
      natural: ["va detto chiaramente che", "è evidente che", "conta ricordare che", "emerge con forza che"],
      casual: ["sia chiaro:", "il punto vero è che", "la realtà è che", "diciamolo:"],
      academic: ["risulta primario osservare che", "si evidenzia in primo luogo che", "è determinante rilevare che"],
      editorial: ["un dato è certo:", "i fatti parlano chiaro:", "la realtà parla da sé:"],
      executive: ["punto chiave:", "dato essenziale:", "è prioritario che"]
    }
  },
  {
    pattern: /(?<!\p{L})[Èè] (?:importante|cruciale|essenziale) ricordare che(?!\p{L})/gu,
    replacements: {
      natural: ["ricordiamo che", "non dimentichiamo che", "va tenuto presente che"],
      casual: ["teniamo a mente che", "ricordati che", "vale la pena ricordarsi che"],
      academic: ["conviene rammentare che", "è opportuno considerare che"],
      editorial: ["non va scordato che", "resta impresso che"],
      executive: ["teniamo a mente che", "nota operativa:"]
    }
  },
  {
    pattern: /(?<!\p{L})vale la pena notare che(?!\p{L})/gu,
    replacements: {
      natural: ["è interessante osservare come", "salta all'occhio che", "notiamo che"],
      casual: ["curioso come", "da notare che", "tra le altre cose,"],
      academic: ["merita attenta considerazione il fatto che", "è rilevante notare che"],
      editorial: ["colpisce come", "il dato interessante è che"],
      executive: ["da segnalare che", "aspetto rilevante:"]
    }
  },
  {
    pattern: /(?<!\p{L})non si può ignorare il fatto che(?!\p{L})/gu,
    replacements: {
      natural: ["è innegabile che", "resta evidente che", "non possiamo trascurare che"],
      casual: ["è palese che", "non ci piove che"],
      academic: ["non è trascurabile la circostanza che"],
      editorial: ["impossibile negarlo:", "la verità nuda e cruda è che"],
      executive: ["dato certo:", "chiaramente,"]
    }
  },

  // --- Formulaic Transitions ---
  {
    pattern: /(?<!\p{L})In conclusione,\s*/gu,
    replacements: {
      natural: ["In sintesi, ", "Tirando le somme, ", "Alla fine dei conti, ", "Arrivando al sodo, "],
      casual: ["In parole povere, ", "Stringi stringi, ", "Tutto sommato, "],
      academic: ["In ultima analisi, ", "In sede di sintesi, ", "Dall'analisi svolta emerge che "],
      editorial: ["Il quadro finale è netto: ", "La sintesi è una sola: ", "In sostanza, "],
      executive: ["In sintesi, ", "Risultato netto: ", "Conclusioni operative: "]
    }
  },
  {
    pattern: /(?<!\p{L})Inoltre,\s*/gu,
    replacements: {
      natural: ["Accanto a questo, ", "Al contempo, ", "In più, ", "D'altro canto, "],
      casual: ["E poi, ", "Oltretutto, ", "Tra le altre cose, ", "In più, "],
      academic: ["Sotto un ulteriore profilo, ", "Si aggiunge a ciò la considerazione che ", "In secondo luogo, "],
      editorial: ["Non solo: ", "C'è dell'altro: ", "A ciò si unisce che "],
      executive: ["Elemento ulteriore: ", "In parallelo, ", "Inoltre, "]
    }
  },
  {
    pattern: /(?<!\p{L})Pertanto,\s*/gu,
    replacements: {
      natural: ["Di riflesso, ", "Ne consegue che ", "Per questa ragione, "],
      casual: ["Quindi, ", "Ecco perché ", "Di fatto, "],
      academic: ["Ne discende pertanto che ", "Si evince di conseguenza che "],
      editorial: ["Il risultato? ", "Inevitabilmente, "],
      executive: ["Quindi, ", "Conseguenza diretta: "]
    }
  },

  // --- Abstract Nominalizations & Metaphors ---
  {
    pattern: /(?<!\p{L})svolge un ruolo (?:cruciale|fondamentale|chiave|centrale|primario)(?!\p{L})/gu,
    replacements: {
      natural: ["fa la vera differenza", "ha un peso determinante", "conta moltissimo", "è determinante"],
      casual: ["è davvero centrale", "conta parecchio", "è la chiave di volta"],
      academic: ["esplica una funzione determinante", "assume rilievo prioritario"],
      editorial: ["è il motore pulsante", "detta il ritmo", "pesa moltissimo"],
      executive: ["ha un impatto decisivo", "è un driver strategico"]
    }
  },
  {
    pattern: /(?<!\p{L})un mosaico di innovazione senza precedenti(?!\p{L})/gu,
    replacements: {
      natural: ["un fermento continuo di soluzioni nuove", "una serie tangibile di progressi concreti"],
      casual: ["un mix esplosivo di novità", "un'ondata continua di idee"],
      academic: ["un articolato sistema di soluzioni tecnologiche all'avanguardia"],
      editorial: ["un salto tecnologico reale", "una pioggia di cambiamenti radicali"],
      executive: ["un solido ecosistema di innovazione"]
    }
  },
  {
    pattern: /(?<!\p{L})un mosaico di(?!\p{L})/gu,
    replacements: {
      natural: ["un insieme ricco di", "una combinazione variegata di", "un ventaglio di"],
      casual: ["un bel mix di", "una varietà di"],
      academic: ["un quadro articolato di", "una pluralità di"],
      editorial: ["un intreccio vivace di"],
      executive: ["un portfolio articolato di"]
    }
  },
  {
    pattern: /(?<!\p{L})che testimonia il progresso umano(?!\p{L})/gu,
    replacements: {
      natural: ["a riprova del progresso compiuto", "che dimostra quanto stiamo avanzando"],
      casual: ["che mostra bene dove siamo arrivati", "segno chiaro che si va avanti"],
      academic: ["tangibile evidenza dello sviluppo tecnologico"],
      editorial: ["fotografia di un'evoluzione continua", "specchio della crescita umana"],
      executive: ["evidenza concreta dell'avanzamento tecnologico"]
    }
  },
  {
    pattern: /(?<!\p{L})un testamento (?:a|di|al)(?!\p{L})/gu,
    replacements: {
      natural: ["una prova lampante di", "una dimostrazione concreta di", "un chiaro segno di"],
      casual: ["la prova evidente di", "la dimostrazione che"],
      academic: ["una palese attestazione di", "una tangibile testimonianza di"],
      editorial: ["la firma inequivocabile di", "la conferma di"],
      executive: ["la dimostrazione diretta di"]
    }
  },
  {
    pattern: /(?<!\p{L})navigare le complessità di(?!\p{L})/gu,
    replacements: {
      natural: ["gestire i nodi di", "affrontare le sfide di", "muoversi tra i dettagli di"],
      casual: ["districarsi tra", "venire a capo di", "affrontare senza perdersi"],
      academic: ["governare la complessità intrinseca di", "analizzare i molteplici risvolti di"],
      editorial: ["scavare dentro", "fare i conti con"],
      executive: ["gestire i rischi di", "governare le complessità di"]
    }
  },
  {
    pattern: /(?<!\p{L})questo viaggio trasformativo(?!\p{L})/gu,
    replacements: {
      natural: ["questo profondo cambiamento", "questa evoluzione in corso", "questa fase di transizione"],
      casual: ["questo salto in avanti", "questo cambio di passo"],
      academic: ["questo processo di mutamento strutturale"],
      editorial: ["questa svolta epocale", "questa corsa al cambiamento"],
      executive: ["questo piano di trasformazione", "questo cambio strategico"]
    }
  },
  {
    pattern: /(?<!\p{L})viaggio trasformativo(?!\p{L})/gu,
    replacements: {
      natural: ["percorso di cambiamento", "fase di profonda evoluzione", "trasformazione in atto"],
      casual: ["salto in avanti", "cambio di passo"],
      academic: ["processo di mutamento strutturale"],
      editorial: ["svolta epocale"],
      executive: ["piano di trasformazione"]
    }
  },
  {
    pattern: /(?<!\p{L})con un approccio olistico e armonioso(?!\p{L})/giu,
    replacements: {
      natural: ["con una visione d'insieme equilibrata", "con un metodo integrato e concreto", "con un approccio pratico e bilanciato"],
      casual: ["con uno sguardo a 360 gradi", "con un approccio sensato ed equilibrato"],
      academic: ["attraverso un paradigma sistemico e ponderato"],
      editorial: ["con una prospettiva lucida ed equilibrata"],
      executive: ["con una strategia integrata ed efficiente"]
    }
  },
  {
    pattern: /(?<!\p{L})approccio olistico e armonioso(?!\p{L})/giu,
    replacements: {
      natural: ["visione d'insieme equilibrata", "metodo integrato e concreto"],
      casual: ["sguardo a 360 gradi", "approccio sensato ed equilibrato"],
      academic: ["paradigma sistemico e ponderato"],
      editorial: ["prospettiva lucida ed equilibrata"],
      executive: ["strategia integrata ed efficiente"]
    }
  },
  {
    pattern: /(?<!\p{L})approccio olistico(?!\p{L})/giu,
    replacements: {
      natural: ["visione d'insieme", "metodo integrato", "approccio globale"],
      casual: ["sguardo complessivo", "visione a tutto tondo"],
      academic: ["metodologia sistemica"],
      editorial: ["quadro d'insieme"],
      executive: ["approccio integrato"]
    }
  },
  {
    pattern: /(?<!\p{L})armonioso(?!\p{L})/giu,
    replacements: {
      natural: ["equilibrato", "coerente", "ben bilanciato"],
      casual: ["fluido", "ben fatto"],
      academic: ["organico", "ben calibrato"],
      editorial: ["lucido"],
      executive: ["allineato"]
    }
  },
  {
    pattern: /(?<!\p{L})(?:nel|all'interno del) panorama in continua evoluzione della(?!\p{L})/giu,
    replacements: {
      natural: ["nello scenario attuale della", "nella rapida evoluzione della", "sul fronte della"],
      casual: ["nel mondo dinamico della", "nel settore in continuo movimento della"],
      academic: ["nel contesto della progressiva evoluzione della"],
      editorial: ["nella corsa sfrenata della", "nel vivo della"],
      executive: ["nel contesto competitivo della", "nel mercato attuale della"]
    }
  },
  {
    pattern: /(?<!\p{L})panorama in continua evoluzione(?!\p{L})/gu,
    replacements: {
      natural: ["scenario in rapido cambiamento", "settore dinamico", "mondo attuale"],
      casual: ["settore che corre veloce", "mondo di oggi"],
      academic: ["quadro in costante mutamento"],
      editorial: ["scacchiere in continuo movimento"],
      executive: ["mercato in rapida evoluzione"]
    }
  },
  {
    pattern: /(?<!\p{L})tassello fondamentale(?!\p{L})/gu,
    replacements: {
      natural: ["elemento cardine", "punto essenziale", "componente centrale"],
      casual: ["passo decisivo", "pezzo irrinunciabile"],
      academic: ["snodo primario"],
      editorial: ["pilastro portante"],
      executive: ["driver chiave"]
    }
  },
  {
    pattern: /(?<!\p{L})nel regno di(?!\p{L})/gu,
    replacements: {
      natural: ["nell'ambito di", "nel settore di", "sul terreno di"],
      casual: ["nel mondo di", "quando si parla di"],
      academic: ["nella sfera di"],
      editorial: ["sul fronte di"],
      executive: ["nel comparto di"]
    }
  },
  {
    pattern: /(?<!\p{L})catalizzatore di(?!\p{L})/gu,
    replacements: {
      natural: ["motore di", "propulsore di", "spinta verso"],
      casual: ["leva per", "scintilla di"],
      academic: ["fattore trainante di"],
      editorial: ["miccia per"],
      executive: ["acceleratore di"]
    }
  },

  // --- Technical & Architectural AI Patterns ---
  {
    pattern: /(?<!\p{L})affronta costantemente il problema della(?!\p{L})/giu,
    replacements: {
      natural: ["deve fare i conti ogni giorno con la", "si scontra continuamente con la", "gestisce quotidianamente la"],
      casual: ["deve vedersela continuamente con la", "lotta ogni giorno con la"],
      academic: ["si confronta sistematicamente con la"],
      editorial: ["è in costante lotta contro la", "fa i conti ogni giorno con la"],
      executive: ["affronta la gestione della"]
    }
  },
  {
    pattern: /(?<!\p{L})quando un'applicazione cresce di scala(?!\p{L})/giu,
    replacements: {
      natural: ["quando un'applicazione cresce", "man mano che il software si espande", "quando il sistema scala"],
      casual: ["quando il progetto si ingrandisce", "quando l'app comincia a crescere sul serio"],
      academic: ["all'aumentare della scala applicativa"],
      editorial: ["quando i volumi crescono", "con la crescita dell'applicazione"],
      executive: ["in fase di scalabilità applicativa"]
    }
  },
  {
    pattern: /(?<!\p{L})la manutenibilità del codice diventa cruciale per il successo a lungo termine del team di sviluppo(?!\p{L})/giu,
    replacements: {
      natural: ["mantenere il codice pulito e comprensibile è vitale per la tenuta nel tempo del team di sviluppo", "la manutenibilità del codice diventa irrinunciabile per la crescita del team"],
      casual: ["mantenere il codice in ordine è ciò che salva la vita agli sviluppatori sul lungo periodo"],
      academic: ["la manutenibilità della base di codice assume un rilievo strategico per la continuità operativa del team"],
      editorial: ["la manutenibilità del codice diventa una questione di sopravvivenza per il team di sviluppo"],
      executive: ["la manutenibilità del codice è un asset critico per la sostenibilità del team"]
    }
  },
  {
    pattern: /(?<!\p{L})diventa cruciale per il successo a lungo termine del(?!\p{L})/giu,
    replacements: {
      natural: ["è vitale per la tenuta nel tempo del", "diventa determinante per il futuro del", "è decisivo per la crescita del"],
      casual: ["salva il futuro del", "fa tutta la differenza per il"],
      academic: ["costituisce un fattore determinante per la sostenibilità di lungo periodo del"],
      editorial: ["è lo spartiacque per il futuro del"],
      executive: ["è un driver fondamentale per il successo del"]
    }
  },
  {
    pattern: /(?<!\p{L})[Èè] fondamentale adottare un approccio modulare(?!\p{L})/giu,
    replacements: {
      natural: ["Puntare su un'architettura modulare fa la differenza", "Adottare una struttura a moduli indipendenti è la chiave", "La modularità è decisiva"],
      casual: ["Lavorare a moduli separati è la vera mossa vincente", "La chiave è dividere tutto in moduli"],
      academic: ["L'adozione di un paradigma architetturale modulare risulta imprescindibile"],
      editorial: ["La modularità è l'unica vera salvezza", "Puntare su moduli ben definiti cambia tutto"],
      executive: ["L'approccio modulare è una priorità strategica"]
    }
  },
  {
    pattern: /(?<!\p{L})poiché la separazione delle responsabilità permette di ridurre il debito tecnico in modo significativo(?!\p{L})/giu,
    replacements: {
      natural: ["dividere bene le responsabilità permette infatti di tagliare il debito tecnico drasticamente", "separare i compiti consente di abbattere il debito tecnico in maniera tangibile"],
      casual: ["separando bene le responsabilità si evita di accumulare debito tecnico"],
      academic: ["giacché la separazione delle responsabilità attenua sensibilmente l'accumulo di debito tecnico"],
      editorial: ["perché separare le responsabilità è il modo più efficace per abbattere il debito tecnico"],
      executive: ["in quanto il disaccoppiamento dei componenti riduce drasticamente il debito tecnico"]
    }
  },
  {
    pattern: /(?<!\p{L})in modo significativo(?!\p{L})/giu,
    replacements: {
      natural: ["drasticamente", "nettamente", "in maniera sensibile", "notevolmente"],
      casual: ["alla grande", "sul serio"],
      academic: ["in misura consistente", "in termini tangibili"],
      editorial: ["in modo vistoso"],
      executive: ["in misura sostanziale"]
    }
  },
  {
    pattern: /(?<!\p{L})l'implementazione di test automatizzati garantisce un flusso di lavoro efficiente, minimizzando la probabilità di regressioni in produzione(?!\p{L})/giu,
    replacements: {
      natural: ["introdurre test automatizzati rende il flusso di lavoro molto più fluido, riducendo al minimo il rischio di regressioni in produzione", "l'uso di test automatizzati mantiene il flusso di sviluppo snello ed evita brutte sorprese durante il rilascio"],
      casual: ["con test automatizzati seri il lavoro scorre che è un piacere e non rischi di rompere le cose in produzione"],
      academic: ["l'integrazione di pipeline di testing automatizzato assicura efficienza nei rilasci e mitiga le regressioni in ambiente di produzione"],
      editorial: ["affiancare test automatizzati solleva il team da ore di debug e blocca le regressioni prima che arrivino in produzione"],
      executive: ["l'adozione di test automatizzati ottimizza la pipeline di delivery, abbattendo il rischio operativo in produzione"]
    }
  },
  {
    pattern: /(?<!\p{L})l'implementazione di test automatizzati garantisce un flusso di lavoro efficiente(?!\p{L})/giu,
    replacements: {
      natural: ["introdurre test automatizzati rende il flusso di lavoro molto più snello", "l'uso di test automatici garantisce processi agili e sicuri"],
      casual: ["con test automatici ben fatti il lavoro scorre veloce"],
      academic: ["l'impiego di test automatizzati consolida l'efficienza dei cicli di sviluppo"],
      editorial: ["i test automatizzati tengono il flusso di lavoro rapido e pulito"],
      executive: ["l'automazione dei test ottimizza l'efficienza della delivery"]
    }
  },
  {
    pattern: /(?<!\p{L})minimizzando la probabilità di regressioni in produzione(?!\p{L})/giu,
    replacements: {
      natural: ["riducendo al minimo il rischio di errori in produzione", "ed evita brutte sorprese durante i rilasci in produzione"],
      casual: ["evitando di spaccare tutto in produzione"],
      academic: ["mitigando sensibilmente l'insorgenza di anomalie in produzione"],
      editorial: ["blindando il codice prima del deploy"],
      executive: ["riducendo al minimo i disservizi in ambiente operativo"]
    }
  },
  {
    pattern: /(?<!\p{L})un'architettura ben strutturata non solo ottimizza le prestazioni del sistema, ma facilita anche la collaborazione tra sviluppatori(?!\p{L})/giu,
    replacements: {
      natural: ["un'architettura ben congegnata non si limita a spingere le prestazioni del sistema: agevola concretamente la collaborazione tra sviluppatori", "una struttura solida non serve solo a migliorare le prestazioni, ma rende molto più fluido il lavoro di squadra"],
      casual: ["un'architettura fatta bene non velocizza solo il software: rende la vita facilissima a tutti gli sviluppatori del team"],
      academic: ["un impianto architetturale coerente non ottimizza meramente le performance computazionali, bensì favorisce la sinergia collaborativa tra ingegneri del software"],
      editorial: ["un'architettura solida fa molto più che migliorare le prestazioni: crea armonia nel lavoro di squadra"],
      executive: ["un'architettura solida genera efficienza sistemica e velocizza la collaborazione tra team"]
    }
  },
  {
    pattern: /(?<!\p{L})ponendo le basi per un'evoluzione sostenibile del progetto(?!\p{L})/giu,
    replacements: {
      natural: ["permettendo al progetto di evolvere nel tempo senza intoppi", "creando le condizioni ideali perché il software cresca in modo sano e scalabile"],
      casual: ["lasciando crescere il progetto senza che diventi una trappola complicata"],
      academic: ["garantendo le condizioni necessarie per la scalabilità evolutiva del software nel lungo termine"],
      editorial: ["spianando la strada a una crescita sana che dura nel tempo"],
      executive: ["assicurando la scalabilità sostenibile della roadmap tecnologica"]
    }
  }
];

// ---------------------------------------------------------------------------
// 3. ENGLISH RULES
// ---------------------------------------------------------------------------

const ENGLISH_RULES: ReplacementRule[] = [
  // --- Formulaic Openers & Assertions ---
  {
    pattern: /(?<!\p{L})In today's ever-evolving digital landscape,\s*/giu,
    replacements: {
      natural: ["In today's fast-moving world, ", "Across the tech space right now, ", "In modern practice, "],
      casual: ["Right now, things move fast: ", "In tech today, ", "These days, "],
      academic: ["Within the contemporary technological paradigm, ", "In the current technological context, "],
      editorial: ["The digital world moves at breakneck speed. ", "Tech shifts by the day: "],
      executive: ["In today's market, ", "Across current digital operations, "]
    }
  },
  {
    pattern: /(?<!\p{L})ever-evolving(?: digital)? landscape(?!\p{L})/giu,
    replacements: {
      natural: ["rapidly shifting market", "fast-changing scene", "current technology sector"],
      casual: ["fast-moving space", "tech world today"],
      academic: ["dynamically evolving ecosystem"],
      editorial: ["shifting ground", "moving battlefield"],
      executive: ["rapidly changing market"]
    }
  },
  {
    pattern: /(?<!\p{L})(?:it is|it's) (?:important|crucial|essential) to remember that\s*/giu,
    replacements: {
      natural: ["we should keep in mind that ", "notably, ", "it is clear that "],
      casual: ["keep in mind: ", "the reality is, ", "don't forget that "],
      academic: ["it is pertinent to observe that ", "one must emphasize that "],
      editorial: ["here's the key: ", "one fact stands out: "],
      executive: ["note that ", "key takeaway: "]
    }
  },
  {
    pattern: /(?<!\p{L})(?:it is|it's) worth noting that\s*/giu,
    replacements: {
      natural: ["notably, ", "interestingly, ", "it is telling that "],
      casual: ["worth noting: ", "check this out: ", "truth is, "],
      academic: ["merits examination that ", "it is significant that "],
      editorial: ["strikingly, ", "the telltale sign is that "],
      executive: ["notably, ", "specifically, "]
    }
  },

  // --- Formulaic Transitions ---
  {
    pattern: /(?<!\p{L})Furthermore,\s*/giu,
    replacements: {
      natural: ["At the same time, ", "Alongside this, ", "What is more, ", "Beyond that, "],
      casual: ["Plus, ", "On top of that, ", "And there's another thing: "],
      academic: ["In addition to this, ", "Correlatively, ", "Substantively, "],
      editorial: ["What's more: ", "The story doesn't end there: "],
      executive: ["Additionally, ", "Equally important, "]
    }
  },
  {
    pattern: /(?<!\p{L})Moreover,\s*/giu,
    replacements: {
      natural: ["Equally important, ", "By the same token, ", "Adding to this, "],
      casual: ["Also, ", "Even better, ", "And let's be honest, "],
      academic: ["Furthermore, on closer inspection, ", "In tandem with this, "],
      editorial: ["Add to that: ", "Crucially: "],
      executive: ["Moreover, ", "In parallel, "]
    }
  },
  {
    pattern: /(?<!\p{L})In conclusion,\s*/giu,
    replacements: {
      natural: ["To pull these threads together, ", "All in all, ", "When the dust settles, "],
      casual: ["Bottom line: ", "Long story short, ", "At the end of the day, "],
      academic: ["To synthesize these insights, ", "Ultimately, the evidence suggests "],
      editorial: ["Here's the bottom line: ", "The takeaway is clear: "],
      executive: ["Bottom line: ", "Key takeaway: ", "In summary: "]
    }
  },
  {
    pattern: /(?<!\p{L})Ultimately,\s*/giu,
    replacements: {
      natural: ["In the end, ", "When all is said and done, ", "At its core, "],
      casual: ["At the end of the day, ", "Plain and simple, "],
      academic: ["In the final analysis, "],
      editorial: ["Stripped bare, ", "The bottom line? "],
      executive: ["Net result: ", "Ultimately, "]
    }
  },

  // --- Abstract Nominalizations & Metaphors ---
  {
    pattern: /(?<!\p{L})delve(?:s)? into the (?:complexities|intricacies|depths) of(?!\p{L})/giu,
    replacements: {
      natural: ["examine the nuances of", "explore the moving parts of", "dig into"],
      casual: ["unpack", "break down", "look under the hood of"],
      academic: ["rigorously analyze the mechanics of", "investigate the underlying factors of"],
      editorial: ["expose the real gears of", "dissect"],
      executive: ["evaluate the core drivers of", "assess"]
    }
  },
  {
    pattern: /(?<!\p{L})delving into(?!\p{L})/giu,
    replacements: {
      natural: ["exploring", "looking into", "digging into", "examining"],
      casual: ["unpacking", "breaking down", "looking into"],
      academic: ["investigating", "scrutinizing"],
      editorial: ["dissecting", "probing"],
      executive: ["evaluating", "reviewing"]
    }
  },
  {
    pattern: /(?<!\p{L})delve into(?!\p{L})/giu,
    replacements: {
      natural: ["explore", "examine", "look closely at", "investigate"],
      casual: ["dig into", "look into", "break down"],
      academic: ["investigate", "interrogate", "scrutinize"],
      editorial: ["dissect", "zero in on"],
      executive: ["analyze", "assess"]
    }
  },
  {
    pattern: /(?<!\p{L})plays a (?:pivotal|crucial|vital) role in (?:shaping|driving|fostering)(?!\p{L})/giu,
    replacements: {
      natural: ["is central to shaping", "drives much of", "steers"],
      casual: ["makes a huge difference in", "is right at the heart of"],
      academic: ["acts as a primary catalyst in determining"],
      editorial: ["pulls the heavy levers in", "fuels the engine of"],
      executive: ["directly impacts", "is a core driver of"]
    }
  },
  {
    pattern: /(?<!\p{L})plays a (?:pivotal|crucial|vital) role(?!\p{L})/giu,
    replacements: {
      natural: ["is essential", "matters deeply", "makes a big difference"],
      casual: ["is a huge deal", "carries real weight"],
      academic: ["exerts a decisive influence"],
      editorial: ["steers the ship", "pulls the strings"],
      executive: ["is mission-critical"]
    }
  },
  {
    pattern: /(?<!\p{L})a rich tapestry of(?!\p{L})/giu,
    replacements: {
      natural: ["a wide range of", "a nuanced blend of", "a diverse set of"],
      casual: ["a vibrant mix of", "a whole spread of"],
      academic: ["a heterogeneous array of", "a multifaceted matrix of"],
      editorial: ["a sprawling kaleidoscope of"],
      executive: ["a broad portfolio of", "a diversified set of"]
    }
  },
  {
    pattern: /(?<!\p{L})rich tapestry(?!\p{L})/giu,
    replacements: {
      natural: ["diverse mix", "broad variety", "wide array"],
      casual: ["healthy mix", "colorful spread"],
      academic: ["complex matrix"],
      editorial: ["vivid panorama"],
      executive: ["broad portfolio"]
    }
  },
  {
    pattern: /(?<!\p{L})(?:this )?serves as a testament to(?!\p{L})/giu,
    replacements: {
      natural: ["this proves clearly", "this shows beyond doubt", "this stands as living proof of"],
      casual: ["this proves that", "this shows just how real"],
      academic: ["this furnishes empirical demonstration of", "this provides concrete evidence of"],
      editorial: ["this rings out as proof of", "this underscores"],
      executive: ["this demonstrates", "this proves"]
    }
  },
  {
    pattern: /(?<!\p{L})a testament to(?!\p{L})/giu,
    replacements: {
      natural: ["clear proof of", "living evidence of", "a direct reflection of"],
      casual: ["proof positive that", "showing just how much"],
      academic: ["an empirical demonstration of", "concrete evidence of"],
      editorial: ["a ringing endorsement of", "exhibit A of"],
      executive: ["concrete proof of"]
    }
  },
  {
    pattern: /(?<!\p{L})navigate the complexities of(?!\p{L})/giu,
    replacements: {
      natural: ["manage the challenges of", "deal with the hurdles in", "work through"],
      casual: ["tackle the hard parts of", "find our way through"],
      academic: ["address the operational friction within"],
      editorial: ["wrestle with", "brave the stormy waters of"],
      executive: ["mitigate risks across", "navigate"]
    }
  },
  {
    pattern: /(?<!\p{L})transformative journey(?!\p{L})/giu,
    replacements: {
      natural: ["deep shift", "ongoing transition", "major evolution"],
      casual: ["game-changing period", "massive turnaround"],
      academic: ["paradigm shift", "structural transformation"],
      editorial: ["seismic shift", "revolution in progress"],
      executive: ["strategic transformation", "operational transition"]
    }
  },
  {
    pattern: /(?<!\p{L})with a holistic and harmonious approach(?!\p{L})/giu,
    replacements: {
      natural: ["with a balanced, realistic mindset", "with a grounded plan"],
      casual: ["with common sense and balance"],
      academic: ["employing an integrated, coherent methodology"],
      editorial: ["with a clear-eyed strategy"],
      executive: ["with an aligned, pragmatic framework"]
    }
  },
  {
    pattern: /(?<!\p{L})holistic approach(?!\p{L})/gu,
    replacements: {
      natural: ["comprehensive plan", "balanced view", "complete picture"],
      casual: ["big-picture look", "well-rounded method"],
      academic: ["systemic paradigm"],
      editorial: ["panoramic view"],
      executive: ["integrated strategy"]
    }
  },
  {
    pattern: /(?<!\p{L})beacon of hope(?!\p{L})/gu,
    replacements: {
      natural: ["promising sign", "clear point of reference"],
      casual: ["bright spot", "welcome relief"],
      academic: ["focal benchmark"],
      editorial: ["bright beacon"],
      executive: ["key benchmark"]
    }
  }
];

// ---------------------------------------------------------------------------
// 4. LANGUAGE DETECTION & PSEUDO-RANDOM NUMBER GENERATOR
// ---------------------------------------------------------------------------

function detectLanguage(text: string): 'it' | 'en' {
  const itIndicators = /(?<!\p{L})(?:di|che|il|la|per|un|in|con|non|ed|ad|del|della|dei|sono|questo|questa|nostro|nostra|anche|come|molto|tutto|stato|più|dobbiamo|svolge|fondamentale|ruolo)(?!\p{L})/giu;
  const enIndicators = /(?<!\p{L})(?:the|and|to|of|in|that|is|for|with|as|at|this|from|by|they|have|from|will|which|their|play|role|crucial|testament|tapestry)(?!\p{L})/giu;

  const itMatches = (text.match(itIndicators) || []).length;
  const enMatches = (text.match(enIndicators) || []).length;

  return itMatches >= enMatches ? 'it' : 'en';
}

class SimplePRNG {
  private state: number;
  constructor(seed: number = 42) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }
  next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }
  pick<T>(arr: T[]): T {
    if (!arr || arr.length === 0) return '' as any;
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
}

// ---------------------------------------------------------------------------
// 5. SENTENCE SPLITTING, CADENCE & BURSTINESS ENGINE
// ---------------------------------------------------------------------------

function splitIntoSentences(text: string): string[] {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (!clean) return [];

  // Protect common abbreviations and numbers
  const protectedText = clean
    .replace(/\b(e\.g\.|i\.e\.|etc\.|dott\.|dott\.ssa|prof\.|ing\.|avv\.|sig\.|sig\.ra|vs\.|vol\.|p\.es\.)/gi, (match) => {
      return match.replace(/\./g, '__DOT__');
    })
    .replace(/(\d+)\.(\d+)/g, '$1__DOT__$2');

  const rawParts = protectedText.split(/([.!?]+(?:\s+|\n+|$))/);
  const sentences: string[] = [];

  for (let i = 0; i < rawParts.length; i += 2) {
    const body = rawParts[i];
    const punct = rawParts[i + 1] || '';
    if (body.trim()) {
      const restored = (body + punct).replace(/__DOT__/g, '.').trim();
      sentences.push(restored);
    }
  }

  return sentences;
}

/**
 * Cadence sculpting:
 * - Breaks uniform long compound sentences (> 16 words)
 * - Injects short punchy micro-sentences (3-5 words)
 * - Guarantees both short (<= 5) and long (>= 18) sentence diversity
 */
function sculptCadenceAndBurstiness(
  sentences: string[],
  lang: 'it' | 'en',
  mode: HumanizeMode,
  aggression: AggressionLevel,
  prng: SimplePRNG
): string[] {
  const result: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const words = s.split(/\s+/).filter(Boolean);

    // If sentence is compound and longer than 15 words, split it
    if (words.length >= 15 && (aggression === 'aggressive' || (aggression === 'medium' && prng.next() > 0.25))) {
      let splitSuccess = false;

      if (lang === 'it') {
        const match = s.match(/,\s+(e|ma|però|tuttavia|mentre|infatti)\s+/i);
        if (match && match.index) {
          const conj = match[1].toLowerCase();
          const p1 = s.substring(0, match.index).trim();
          let p2 = s.substring(match.index + match[0].length).trim();

          if (p1.split(/\s+/).length >= 4 && p2.split(/\s+/).length >= 4) {
            p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
            const prefix = (mode === 'casual' || mode === 'editorial')
              ? (conj === 'e' ? 'E ' : (conj === 'ma' ? 'Ma ' : ''))
              : '';

            result.push(`${p1}.`);
            result.push(`${prefix}${p2}`);
            splitSuccess = true;
          }
        }
      } else {
        const match = s.match(/,\s+(and|but|yet|while|whereas)\s+/i);
        if (match && match.index) {
          const conj = match[1].toLowerCase();
          const p1 = s.substring(0, match.index).trim();
          let p2 = s.substring(match.index + match[0].length).trim();

          if (p1.split(/\s+/).length >= 4 && p2.split(/\s+/).length >= 4) {
            p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
            const prefix = (mode === 'casual' || mode === 'editorial')
              ? (conj === 'and' ? 'And ' : (conj === 'but' ? 'Yet ' : ''))
              : '';

            result.push(`${p1}.`);
            result.push(`${prefix}${p2}`);
            splitSuccess = true;
          }
        }
      }

      if (!splitSuccess) {
        result.push(s);
      }
    } else {
      result.push(s);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// 6. STYLE & CASUAL CONTRACTIONS REWRITER
// ---------------------------------------------------------------------------

function applyStyleFormulas(text: string, lang: 'it' | 'en', mode: HumanizeMode): string {
  let res = text;

  if (lang === 'en') {
    if (mode === 'casual' || mode === 'editorial' || mode === 'natural') {
      res = res
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bit is\b/gi, "it's")
        .replace(/\bthat is\b/gi, "that's")
        .replace(/\bthere is\b/gi, "there's")
        .replace(/\bwe are\b/gi, "we're")
        .replace(/\bthey are\b/gi, "they're")
        .replace(/\bhave not\b/gi, "haven't")
        .replace(/\bwill not\b/gi, "won't")
        .replace(/\bis not\b/gi, "isn't")
        .replace(/\bare not\b/gi, "aren't")
        .replace(/\bwould not\b/gi, "wouldn't")
        .replace(/\bdoes not\b/gi, "doesn't");
    }
    if (mode === 'executive') {
      res = res
        .replace(/\bleverage\b/gi, "use")
        .replace(/\butilize\b/gi, "apply")
        .replace(/\bsynergy\b/gi, "alignment");
    }
  } else {
    if (mode === 'casual' || mode === 'editorial') {
      res = res
        .replace(/\bnon vi è\b/gi, "non c'è")
        .replace(/\bvi sono\b/gi, "ci sono")
        .replace(/\bpoiché\b/gi, "dato che")
        .replace(/\bpertanto\b/gi, "quindi")
        .replace(/\baffinché\b/gi, "in modo che");
    }
  }

  // Clean double spaces or clumsy punctuation
  res = res
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\.{2,}/g, '.')
    .replace(/,\s*,/g, ',');

  return res.trim();
}

// ---------------------------------------------------------------------------
// 7. MASTER LOCAL PRECISION ENGINE
// ---------------------------------------------------------------------------

export function localPrecisionHumanize(
  text: string,
  options: LocalEngineOptions = {}
): string {
  const input = (text || '').trim();
  if (!input) return '';

  const {
    mode = 'natural',
    aggression = 'medium',
    seed = 42
  } = options;

  const prng = new SimplePRNG(seed);
  const lang = detectLanguage(input);
  const baseRules = lang === 'it' ? ITALIAN_RULES : ENGLISH_RULES;
  const lexiconRules = (lang === 'it' ? ITALIAN_AI_LEXICON : ENGLISH_AI_LEXICON).map(entry => ({
    pattern: entry.pattern,
    replacements: entry.alternatives
  }));
  const rules = [...lexiconRules, ...baseRules];

  // Step 1: Execute Pattern & Cliché Transformations
  let transformed = input;

  for (const rule of rules) {
    transformed = transformed.replace(rule.pattern, (matched) => {
      const candidates: string[] = (rule.replacements as any)[mode] || rule.replacements.natural;
      let chosen: string = prng.pick(candidates) || '';

      // Preserve capitalization of the first letter if original was capitalized
      if (/^[A-Z\xC0-\xDF]/u.test(matched.trim())) {
        chosen = chosen.charAt(0).toUpperCase() + chosen.slice(1);
      }
      return chosen;
    });
  }

  // Step 2: Sentence Segmentation
  const sentences = splitIntoSentences(transformed);
  if (sentences.length === 0) return transformed;

  // Step 3: Burstiness & Cadence Sculpting (Sentence Length Variance Engine)
  const burstySentences = sculptCadenceAndBurstiness(
    sentences,
    lang,
    mode,
    aggression,
    prng
  );

  // Step 4: Reassemble text with organic spacing
  let assembled = burstySentences.join(' ');

  // Step 5: Stylistic Tone, Contractions & Polish
  assembled = applyStyleFormulas(assembled, lang, mode);

  return assembled;
}
