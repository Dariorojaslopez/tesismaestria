import type { AfroSubType } from "@/data/treatments";
import { describeHabits, type CareHabits } from "@/lib/diagnosis/careHabits";
import { pickPhrase } from "@/lib/diagnosis/phraseVariants";

/**
 * Criterios de cuidado redactados para este diagnóstico.
 * No son citas. Se apoyan en:
 * - Aguh y Okoye (eds.), Fundamentos del cabello étnico (Springer, 2017).
 * - Cribier, B. Histología de la piel normal y lesiones histopatológicas
 *   elementales. EMC - Dermatología, 2021. DOI 10.1016/S1761-2896(21)45139-3.
 * - King, A. M. El cabello como fruto de lo que brota de nuestras cabezas.
 *   Ensayo a partir de su investigación de máster (Université de Strasbourg, 2009; texto de 2015).
 */
export const ETHNIC_HAIR_REFERENCE =
  "Aguh, C. y Okoye, G. A. (eds.). Fundamentos del cabello étnico: la perspectiva dermatológica. Springer, 2017.";

export const SKIN_HISTOLOGY_REFERENCE =
  "Cribier, B. Histología de la piel normal y lesiones histopatológicas elementales. EMC - Dermatología, 2021. https://doi.org/10.1016/S1761-2896(21)45139-3";

export const HAIR_IDENTITY_REFERENCE =
  "King, A. M. El cabello como fruto de lo que brota de nuestras cabezas. Ensayo a partir de su investigación de máster, Université de Strasbourg, 2009.";

export const CARE_REFERENCE_LINE =
  "Estos criterios se apoyan en Fundamentos del cabello étnico (Aguh y Okoye, 2017), en la histología de la piel normal (Cribier, 2021) y en El cabello como fruto de lo que brota de nuestras cabezas (King, 2015).";

export const CARE_DISCLAIMER =
  "Es una orientación de cuidado cosmético, no un diagnóstico médico. Lo que se ve en el cabello no basta para saber qué ocurre dentro de la piel. Si la caída es muy rápida, hay dolor, heridas, calvas o picor fuerte, consulta a un dermatólogo.";

/** El tallo que cuida una mascarilla frente a la piel y el folículo vivo. */
const SKIN_STRUCTURE =
  "El cabello nace en el folículo pilosebáceo, un anexo de la piel, junto a la glándula sebácea. La mascarilla cuida el tallo de queratina y la superficie del cuero cabelludo; no modifica la dermis ni la raíz viva del folículo.";

export type HairGuidance = {
  context: string;
  structure: string;
  notes: string[];
  disclaimer: string;
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasSymptom(symptoms: readonly string[], needles: readonly string[]): boolean {
  const blob = symptoms.map(normalize).join(" ");
  return needles.some((needle) => blob.includes(normalize(needle)));
}

function hairPattern(hairType?: string, hairLabel?: string): string {
  const raw = normalize(`${hairType ?? ""} ${hairLabel ?? ""}`);
  if (raw.includes("coily") || raw.includes("crespo") || raw.includes("afro")) {
    return "coily";
  }
  if (raw.includes("curly") || raw.includes("rizado")) return "curly";
  if (raw.includes("wavy") || raw.includes("ondulado")) return "wavy";
  if (raw.includes("straight") || raw.includes("liso")) return "straight";
  return "unknown";
}

export function careReferenceLine(): string {
  return pickPhrase([
    CARE_REFERENCE_LINE,
    "La orientación se apoya en Fundamentos del cabello étnico (Aguh y Okoye, 2017), en la histología de la piel normal (Cribier, 2021) y en El cabello como fruto de lo que brota de nuestras cabezas (King, 2015).",
    "Para este cuidado uso criterios de Aguh y Okoye (2017), de Cribier (2021) y del ensayo de King (2015).",
  ]);
}

export function careDisclaimer(): string {
  return pickPhrase([
    CARE_DISCLAIMER,
    "Esto orienta el cuidado del cabello, no reemplaza una consulta médica. Ver sequedad o caída no dice qué pasa dentro de la piel. Si la caída es muy rápida, hay dolor, heridas, calvas o picor fuerte, ve a un dermatólogo.",
    "Te lo digo como cuidado cosmético. No es un diagnóstico de la piel. Si hay caída rápida, dolor, heridas, calvas o picor intenso, lo tiene que revisar un dermatólogo.",
  ]);
}

function skinStructure(): string {
  return pickPhrase([
    SKIN_STRUCTURE,
    "El folículo pilosebáceo, junto a la glándula sebácea, es el anexo de la piel del que sale el cabello. Una mascarilla trabaja el tallo de queratina y la superficie del cuero cabelludo, no la dermis ni la raíz viva.",
    "El cabello que vemos es un tallo de queratina que produce el folículo. La mascarilla lo cuida por fuera, junto con la superficie del cuero cabelludo.",
  ]);
}

function curlRespect(): string {
  return pickPhrase([
    "Ese rizo no es un cabello difícil que haya que alisar para verse ordenado. Hidratarlo y peinarlo con suavidad lo cuida, y esa humedad no significa que esté sucio.",
    "No trato ese rizo como algo que haya que alisar para que se vea en orden. Hidratarlo y manipularlo con calma es el cuidado, y sentirlo húmedo no quiere decir que esté sucio.",
    "El rizo se acompaña, no se corrige alisándolo. La hidratación lo define y bajar el volumen con producto no es lo mismo que tenerlo sucio.",
  ]);
}

function withCurlRespect(text: string): string {
  return `${text} ${curlRespect()}`;
}

function curlContext(pattern: string, afroSubType?: AfroSubType): string {
  if (pattern === "coily") {
    if (afroSubType === "4A") {
      return withCurlRespect(
        "En un rizo 4A, en forma de S, el sebo del cuero cabelludo recorre mal la fibra. Hidratar mantiene la definición y peinar con el cabello húmedo evita nudos.",
      );
    }
    if (afroSubType === "4B") {
      return withCurlRespect(
        "En un rizo 4B, en forma de Z, los ángulos cerrados favorecen nudos y quiebre. La prioridad es hidratar y manipular el cabello con suavidad.",
      );
    }
    if (afroSubType === "4C") {
      return withCurlRespect(
        "En un rizo 4C el sebo casi no llega a las puntas y los giros son muy cerrados. Hidratar y evitar el peine en seco reduce la rotura que acorta el largo que se ve.",
      );
    }
    return withCurlRespect(
      "En el cabello crespo el sebo baja con dificultad por la curvatura. La fibra se reseca con facilidad y el peinado en seco favorece nudos y rotura.",
    );
  }
  if (pattern === "curly") {
    return withCurlRespect(
      "En el cabello rizado el sebo no recorre bien el tallo. Por eso se siente seco con más facilidad, y la humedad del ambiente encrespa más la fibra si la cutícula está abierta.",
    );
  }
  if (pattern === "wavy") {
    return "En el cabello ondulado el sebo llega por tramos. La humedad puede hinchar la fibra y marcar el encrespado cuando la cutícula está dañada.";
  }
  if (pattern === "straight") {
    return "En el cabello liso el sebo recorre mejor la fibra. Si se siente seco u opaco, suele deberse al lavado, al calor o a una cutícula gastada, más que a la forma del rizo.";
  }
  return "El patrón del rizo importa más que una etiqueta étnica al elegir el cuidado: cuanto más cerrado es el rizo, más cuesta que el sebo hidrate el tallo.";
}

function habitNotes(
  symptoms: readonly string[],
  pattern: string,
  habits?: CareHabits,
): string[] {
  if (!habits) return [];
  const notes: string[] = [];
  const tightCurl = pattern === "curly" || pattern === "coily";
  const breakage = hasSymptom(symptoms, ["rotura", "puntas"]);
  const dry = hasSymptom(symptoms, ["sequedad", "seco"]);
  const dull = hasSymptom(symptoms, ["brillo", "opaco"]);
  const frizz = hasSymptom(symptoms, ["encresp", "frizz"]);
  const flakes = hasSymptom(symptoms, ["caspa", "picor"]);
  const shedding = hasSymptom(symptoms, ["caida", "debilit"]);
  const fiberIssue = breakage || dry || dull || frizz;
  const stressed = habits.usesHeat === true || habits.usesChemicals === true;
  const noStress =
    habits.usesHeat === false && habits.usesChemicals === false;

  if (stressed && fiberIssue) {
    const how = [
      habits.usesHeat ? "calor" : "",
      habits.usesChemicals ? "tinte o alisado" : "",
    ].filter(Boolean).join(" y ");
    notes.push(
      pickPhrase([
        `Como usas ${how}, la cutícula se abre y el tallo pierde agua. Lo que marcas encaja con ese desgaste. La mascarilla cuida la fibra que queda.`,
        `El ${how} abre la cutícula y la fibra suelta agua. Por eso lo que cuentas encaja con un tallo desgastado, y la mascarilla acompaña lo que aún está.`,
        `Con ${how} frecuente, el desgaste del tallo explica mejor la queja que el rizo solo. La mascarilla no deshace ese proceso: cuida la fibra que queda.`,
      ]),
    );
  } else if (noStress && tightCurl && (dry || breakage)) {
    notes.push(
      pickPhrase([
        "Sin calor ni alisado, en este rizo la sequedad y la rotura encajan con el sebo que no baja por el tallo y con peinar en seco.",
        "Como no hay calor ni alisado, miro el propio rizo: el sebo no recorre bien el tallo y peinar en seco lo quiebra.",
        "Sin plancha ni químico, la sequedad y la rotura de este rizo se explican por la curvatura y por manipularlo seco.",
      ]),
    );
  }

  if (habits.concernZone === "lengths" && (dry || breakage || dull)) {
    notes.push(
      "Lo notas en las puntas y el largo, que es donde el tallo ya formado se gasta primero.",
    );
  } else if (habits.concernZone === "scalp" && (flakes || shedding || dry)) {
    notes.push(
      "Lo notas en el cuero cabelludo. La mascarilla acompaña esa superficie; si la caída sale de la raíz, el folículo lo tiene que ver un dermatólogo.",
    );
  } else if (habits.concernZone === "both" && (fiberIssue || flakes || shedding)) {
    notes.push(
      "Lo notas en el cuero cabelludo y también en el largo, así que hay que cuidar la superficie y el tallo ya crecido.",
    );
  }

  if (flakes && habits.washRhythm === "rare") {
    notes.push(
      "Lavas cada dos semanas o menos y hay escamas: en la epidermis puede acumularse producto o sebo.",
    );
  } else if (flakes && habits.washRhythm === "often") {
    notes.push(
      "Lavas varias veces por semana y el picor o las escamas siguen. Eso ya no se explica solo por lavar poco; si persiste, conviene un dermatólogo.",
    );
  } else if (dry && habits.washRhythm === "often" && !stressed) {
    notes.push(
      "Lavas varias veces por semana. Si el cabello ya se reseca, ese ritmo puede quitar el poco sebo que llega al tallo.",
    );
  }

  return notes;
}

function careNotes(
  symptoms: readonly string[],
  pattern: string,
  habits?: CareHabits,
): string[] {
  const notes: string[] = [];
  const tightCurl = pattern === "curly" || pattern === "coily";
  const breakage = hasSymptom(symptoms, ["rotura", "puntas"]);
  const slowGrowth = hasSymptom(symptoms, ["crecimiento"]);
  const shedding = hasSymptom(symptoms, ["caida", "debilit"]);
  const flakes = hasSymptom(symptoms, ["caspa", "picor"]);
  const frizz = hasSymptom(symptoms, ["encresp", "frizz"]);
  const dull = hasSymptom(symptoms, ["brillo", "opaco"]);
  const staticHair = hasSymptom(symptoms, ["estatica", "rebelde"]);
  const dry = hasSymptom(symptoms, ["sequedad", "seco"]);

  if (shedding) {
    notes.push(
      "La caída que se ve puede estar en el tallo o en el folículo, y una mascarilla solo acompaña el tallo. Peinados tirantes, el calor y los alisados debilitan la fibra. No trata una alopecia.",
    );
  }
  if (flakes) {
    notes.push(
      "Las escamas están en la epidermis del cuero cabelludo. Pueden ir con acumulación de producto o con lavar poco. Si el picor sigue, hace falta una revisión médica: una mascarilla no distingue una descamación leve de una inflamación.",
    );
  }
  if (breakage) {
    notes.push(
      tightCurl
        ? "La rotura está en el tallo de queratina ya formado: la cutícula se gasta, se ve opaca y se abre en puntas. En rizos cerrados eso suele limitar el largo visible más que la velocidad de crecimiento. Alisarlo una y otra vez con calor o con químicos desgasta esa fibra con el tiempo."
        : "La rotura está en el tallo de queratina ya formado. Una cutícula gastada lo deja opaco y con puntas abiertas; el calor y los procesos químicos aumentan esa fragilidad.",
    );
  } else if (slowGrowth) {
    notes.push(
      tightCurl
        ? "El ciclo de crecimiento es parecido entre tipos de cabello. En un rizo cerrado, el largo que se ve también depende de cuánta fibra se rompe y de cuánto encoge el rizo."
        : "Perder varias decenas de cabellos al día entra en lo habitual. Si el largo no avanza, conviene revisar rotura, calor y procesos químicos, no solo el crecimiento.",
    );
  }
  if (frizz) {
    notes.push(
      "La humedad hincha la fibra y el efecto es mayor con la cutícula dañada. Sellar la hidratación baja el volumen y el frizz.",
    );
  }
  if (dull) {
    notes.push(
      "El brillo aparece cuando la cutícula está lisa y refleja la luz. Si está levantada, el cabello se ve opaco.",
    );
  }
  if (staticHair) {
    notes.push(
      "La electricidad estática aumenta cuando la fibra está seca y la cutícula irregular, porque los mechones no se deslizan entre sí.",
    );
  }
  if (dry && pattern === "straight") {
    notes.push(
      "Reponer la hidratación y no desengrasar de más la fibra ayuda a que el cabello liso se sienta nutrido.",
    );
  }

  return [...habitNotes(symptoms, pattern, habits), ...notes].slice(0, 2);
}

export function ethnicHairGuidance(input: {
  symptoms: readonly string[];
  hairType?: string;
  hairLabel?: string;
  afroSubType?: AfroSubType;
  habits?: CareHabits;
}): HairGuidance {
  const pattern = hairPattern(input.hairType, input.hairLabel);
  return {
    context: curlContext(pattern, input.afroSubType),
    structure: skinStructure(),
    notes: careNotes(input.symptoms, pattern, input.habits),
    disclaimer: careDisclaimer(),
  };
}

export { describeHabits };
