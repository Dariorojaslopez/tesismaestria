/**
 * Tipos y catálogo estático para seed de PostgreSQL.
 * Fuente de verdad en runtime: base de datos vía Prisma.
 * Regenerar seed: `python scripts/generate_ellas_treatments.py` → `npm run db:seed`
 */

export type AfroSubType = "4A" | "4B" | "4C";

export type TreatmentRecord = {
  id: string;
  /** Nombre comercial del producto */
  name: string;
  ingredients: string[];
  benefits: string[];
  symptoms: string[];
  vitamins?: string;
  afroBenefitByType?: Partial<Record<AfroSubType, string>>;
  chemicallyTreatedNote?: string;
  generalNote?: string;
};

export const TREATMENTS: readonly TreatmentRecord[] = [
  {
    id: 'coco-glow',
    name: 'COCO GLOW',
    ingredients: [
      'Coco',
    ],
    benefits: [
      'Mantiene el cabello fuerte y saludable',
      'mejora la circulación del cuero cabelludo',
      'promoviendo crecimiento saludable',
    ],
    symptoms: [
      'Crecimiento lento',
    ],
    vitamins: 'E (hidratar y protege el cabello), La vitamina E, Conocida  por  sus propiedades antioxidantes, lo que significa que ayuda a proteger las celulas del cabello contra daños de los radicales libres. ',
    afroBenefitByType: {
      '4A': 'La mascarilla de Coco ayuda a mantener la hidratación, reducir el frizzy mantener rizos definidos.',
      '4B': 'La mascarilla de coco proporciona nutricion y mejora la manejabilidad',
      '4C': 'la mascarilla de coco ayuda a nutrir profundamente y mejorar la elastcidad',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general, la mascarilla de coco, es versatil y sirve para todo tipo de cabello, afro, ya que aporta hidratación  y nutricion',
  },
  {
    id: 'avosilk',
    name: 'AVOSILK',
    ingredients: [
      'Aguacate',
    ],
    benefits: [
      'Ayuda a hidratar profundamente',
      'suavizar',
      'dar brillo',
      'fortalece el cabello y previene la rotura',
    ],
    symptoms: [
      'Sequedad',
      'Rotura o puntas abiertas',
      'Falta de brillo',
    ],
    vitamins: 'E (hidratar y protege el cabello), La vitamina E, Conocida  por  sus propiedades antioxidantes, lo que significa que ayuda a proteger las celulas del cabello contra daños de los radicales libres y contribuye al crecimiento. C(Ayuda a producir colageno, lo que foralece el cabello y previene la rotura. B( Biotina contribuye a la fuerza y Crecimiento del  cabello)',
    afroBenefitByType: {
      '4A': 'La mascarilla de Aguacateayuda a mantener la hidratación, ry mantener los rizos definidos.',
      '4B': 'La mascarilla de Aguacate proporciona nutricion y mejora la elasticidad del cabello',
      '4C': 'la mascarilla de Aguacate ideal para aportar hidratación y nutrición profunda, evita la sequedad y la rotura.',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general, la mascarilla de Aguacate, es versatil y sirve para todo tipo de cabello, afro, debido a sus propiedades hidratantes y nutritivas',
  },
  {
    id: 'banaglow',
    name: 'BANAGLOW',
    ingredients: [
      'Banano',
    ],
    benefits: [
      'Hidrata',
      'Suaviza y da brillo',
      'tambien ayuda a reducir la caspa y mejorar la elasticidad de cabello',
    ],
    symptoms: [
      'Sequedad',
      'Caspa o picor leve',
      'Falta de brillo',
    ],
    vitamins: 'A(ayuda a mantener el cabello hidratado, previniendo la sequedad) C (contribuye a la produccion de colageno, fortaleciendo el cabello) B6( ayuda a nutrir el cabello y mantiene  la salud capilar)',
    afroBenefitByType: {
      '4A': 'la mascarilla de Banano aporta hidratación, ayudando a mantener la elasticidad y el brillo.',
      '4B': 'nutre y reduce caspa',
      '4C': 'reduce la fragilidad y rotura',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general sirve para todo tipo de cabello afro, aporta suavidad, nutrición',
  },
  {
    id: 'onion-boost',
    name: 'ONION BOOST',
    ingredients: [
      'Cebolla',
    ],
    benefits: [
      'Estimula el crecimiento del cabello',
      'mejora la circulación sanguinea en el cuero cabelludo y reduce caspa',
    ],
    symptoms: [
      'Crecimiento lento',
      'Caspa o picor leve',
    ],
    vitamins: 'C( ayuda a la producción de colageno en el cuero cabelludo, B6( ayuda a fortalecer el cabello, Acido fólico( ayuda a la renovacion celular; mejorando la salud capilar',
    afroBenefitByType: {
      '4A': 'La mascarilla de cebolla aporta brillo e hidratación, ayudando a mantener la elasticidad y el brillo.',
      '4B': 'suaviza y definir rizos',
      '4C': 'fortalece el cabello desde la raiz y reduce la fragilidad y rotura, promoviendo crecimiento saludable',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general estimulan  el crecimiento, mejoran la circulacion  saguinea en el cuero cabelludo, reducen la caspa y fortalecen el cabello.',
  },
  {
    id: 'chontahair',
    name: 'CHONTAHAIR',
    ingredients: [
      'Chontaduro',
    ],
    benefits: [
      'Hidrata',
      'fortalece y aporta brillo al cabello. Ademas',
      'puede mejorar la elasticidad y prevenir la rotura',
    ],
    symptoms: [
      'Sequedad',
      'Rotura o puntas abiertas',
      'Falta de brillo',
    ],
    vitamins: 'A(ayuda a mantener el cabello hidratado, previniendo la sequedad) C (contribuye a la produccion de colageno, fortaleciendo el cabello) E( previene y mantiene  la salud capilar).',
    afroBenefitByType: {
      '4A': 'La mascarilla de Chontaduro aporta nutrición e hidratación',
      '4B': 'Fortalece y reparacion',
      '4C': 'hidratación profunda y reducción de la fragilidad',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general es adecuado para cabellos secos,dañados o que necesitan fortalecerse.',
  },
  {
    id: 'yukaress',
    name: 'YUKARESS',
    ingredients: [
      'Yuca',
    ],
    benefits: [
      'Hidrata',
      'suaviza',
      'fortale y mantiene la elasticidad y la salud capilar.',
    ],
    symptoms: [
      'Sequedad',
    ],
    vitamins: 'C( ayuda a la producción de colageno en el cuero cabelludo, B6( ayuda a fortalecer el cabello, Antioxidantes( ayuda a mantener cabello suave e hidratado).',
    afroBenefitByType: {
      '4A': 'la mascarilla de yuca aporta hidtatacón y definición ayudando a mantener los risos suaves y brillantes',
      '4B': 'fortalece, nutre mejora la elasticidad y reduce la rotura',
      '4C': 'hidratación, Combate la sequedad , mejora la manejabilidad',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general se pude usar para todos los tipos de  cabello 4A, 4B y 4C, por sus propiedades hidratantes y nuritivas, util para cabellos  secos y dañados',
  },
  {
    id: 'guavamask',
    name: 'GUAVAMASK',
    ingredients: [
      'Guayaba',
    ],
    benefits: [
      'Nutre',
      'fortalece',
      'previene la caida',
    ],
    symptoms: [
      'Caída o debilitamiento',
    ],
    vitamins: 'A( Estimula la produccion de sebo; para mantener el cabello hidratado) B(Fortalece los  los foliculos pilosos para prevenir la  caida) C( Es Antioxidante y ayuda a la producción de colageno dando fuerza y elasticidad al cabello).',
    afroBenefitByType: {
      '4A': 'la mascarilla de guayaba hidrata, mantiene la elasticidad lo que combate el frizz',
      '4B': 'fortalece y laelasticidad, reduce rotura',
      '4C': 'este tipo de cabello tiende a encogerse mucho, la mascarilla de guayaba mejora la resistencia,hidrata y evita la sequedad y el quiebre',
    },
    generalNote: 'En general la mascarilla de guayaba es excelente para nutrir, fortalecer y definir rizos en todos los cabelllo tipo 4.',
  },
  {
    id: 'gunaba-luxe',
    name: 'GUNABA LUXE',
    ingredients: [
      'Guanabana',
    ],
    benefits: [
      'Fortalece',
      'mejora la elasticidad y ayuda a eliminar la caspa',
    ],
    symptoms: [
      'Caspa o picor leve',
    ],
    vitamins: 'C(Fortalece el cabello y mejora su elasticidad) tambien tiene propiedades Antimicrobianas( mantiene el cuero cabelludo sano y libre de infecciones)',
    afroBenefitByType: {
      '4A': 'la mascarilla de Guanabana ayuda a mantener la humedad, aporta brillo y mejora la elasticidad gracias a los nutrientes y antioxidantes',
      '4B': 'fortalece y ayuda a prevenir la rotura gracias a propiedades microbianas y antioxidantes',
      '4C': 'Hidratación intensa, mejorando la manejabilidad y reduce el encrespamiento',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'Especialmente útil para cabello secos o dañados, popensos a la caspa,proporcionando hidratación  y nutrición',
  },
  {
    id: 'papayasmooth',
    name: 'PAPAYASMOOTH',
    ingredients: [
      'Papaya',
    ],
    benefits: [
      'Fortalece',
      'hidrata',
      'da elasticidad y previene el dano ambiental',
    ],
    symptoms: [
      'Sequedad',
    ],
    vitamins: 'A(Fortalece  los foliculos, promueve la produccion de cebo, C(Potencia la produccion de colageno, mejora la circulacion en el cuero cabelludo y protege el cabello contra el daño  ambiental, promueve la elasticida, da brillo',
    afroBenefitByType: {
      '4A': 'brinda hidratación, definicion y fortalezza sin apermasar,',
      '4B': 'brinda elasticidad y combate el frizz dejando rizos mas definidos',
      '4C': 'Hidrata profundamente,reduce la sequedad y ayuda a mantener la forma natural del rizo',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general   hidratar, nutre  y mejora la textura del cabello, se puede adaptar para todos los tipos de cabello',
  },
  {
    id: 'botanihair-blend',
    name: 'BOTANIHAIR BLEND',
    ingredients: [
      'Romero: Antiinflamatorio en curo cabelludo, ayuda  disminuir irritaciones',
      'Quina: Fortalece y estimula el foliculo piloso',
      'Linaza: Protege del daño, sequedad , quiebre  por calor',
      'Cepa de coco: Fortalece el cabello desde la raiz hasta las puntas',
      'Cevada: fortalece, repara, oxigena los foliculos del cabello ademas por sus antioxidantes mantiente el cabello sano, ayudando a prevenir la caspa',
    ],
    benefits: [
      'Antiinflamatorio en curo cabelludo, ayuda disminuir irritaciones; Fortalece y estimula el foliculo piloso; Protege del daño, sequedad , quiebre por calor; Fortalece el cabello desde la raiz hasta las …',
    ],
    symptoms: [
      'Sequedad',
      'Rotura o puntas abiertas',
      'Caspa o picor leve',
    ],
    vitamins: 'Romero: ACIDOS FENOLICOS -ROSMARINICO, FLAVONOIDES; Quina: alcaloides. quinina; Linaza: ACIDOS GRASOS, OMEGA 3,  E Y ANTIOXIDANTES; Cepa de coco: E y K(; Cevada: B, hierro y zin',
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'ayuda a fortalecer, reducir su caida  y estimula el crecimiento. mejora la vitalidad y combatete la resequedad En general para defir rizos, reducir el frizz,   En general fortalecen el cabello desde la raiz, aporta brillo en general da brillo  y porta volumen al cabello',
  },
  {
    id: 'vigor-coffe',
    name: 'VIGOR COFFE',
    ingredients: [
      'Café',
    ],
    benefits: [
      'Fortalece',
      'mejora la circulacion saguiñea y nutre desde la raiz.',
    ],
    symptoms: [
      'Falta de brillo',
    ],
    vitamins: 'B3 ( mejora la circulacion en cuero cabelludo y cafeina( estimula los foliculos pilosos mejorando la circulacion saguinea y fortalece el cabello desde la raiz)',
    afroBenefitByType: {
      '4A': 'Aporta hidratacion y definicion a los rizos',
      '4B': 'hidrata y suaviza evitando el encrespamientoy definiendo los rizos',
      '4C': 'hidrata, reduce la sequedad y ayuda a mantener la forma natural del rizo',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'en  general  nutre desde la raiz, hidrata y fortalece los foliculos piilosos',
  },
  {
    id: 'chocohair-glow',
    name: 'CHOCOHAIR GLOW',
    ingredients: [
      'Chocolate',
    ],
    benefits: [
      'Protege del daño ambiental y envejecimiento prematuro capilar productos de malos procedimientos',
    ],
    symptoms: [
      'Falta de brillo',
    ],
    vitamins: 'E( Repara el cabello y sus antioxidantes projen contra el daño ambiental envejecimiento prematuro',
    afroBenefitByType: {
      '4A': 'hidrita, define rizos, reduce frizz y aporta brillo',
      '4B': 'hidrata, da elasticidad, define los risos mas apretados',
      '4C': 'Hidrata , mejora la elasticidad y difine los rizos',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'en general aporta hidrata y mejora la elasticidad en todos los tipos de cabello)',
  },
  {
    id: 'beetrootradiance',
    name: 'BEETROOTRADIANCE',
    ingredients: [
      'Remolacha',
    ],
    benefits: [
      'fortalece y estimula la produccion de colageno',
    ],
    symptoms: [
      'Falta de brillo',
    ],
    vitamins: 'C( promueve la producccion de colagano) B6(ayuda a tener cuero cabelludo saludable y fomenta el crecimiento)',
    afroBenefitByType: {
      '4A': 'Hidrata, define rizos, elimina frizz y aporta brillo',
      '4B': 'Hidrata, da elasticidad y define risos mas apretados',
      '4C': 'hidrata , da elasticidad y mejora la apariencia de los rizos',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'en general  hidrata , estimula el colageno y fortalece el cabello',
  },
  {
    id: 'caro-tress-elixir',
    name: 'CARO TRESS ELIXIR',
    ingredients: [
      'Zanahoria',
    ],
    benefits: [
      'hidrata',
      'fortalece',
      'protege de daños',
    ],
    symptoms: [
      'Sequedad',
    ],
    vitamins: 'A( Estimula la produccion de sebo; para mantener el cabello hidratado y saludable) E(mejora la circculación en el cuero cabelludo y beneficia el crecimiento del cabello) C( Es Antioxidante y ayuda a la producción de colageno dando fuerza y elasticidad al cabello y protege de daños)',
    afroBenefitByType: {
      '4A': 'HIdrita, define rizos y aporta brillo',
      '4B': 'hidrata, da elasticidad, define los risos mas apretados',
      '4C': 'Hidrata , mejora la elasticidad y difine los rizos',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'en general ayuda Ayuda a hidratar, fortalecer y proger de daños',
  },
  {
    id: 'rosvitalhair',
    name: 'ROSVITALHAIR',
    ingredients: [
      'Arroz',
    ],
    benefits: [
      'fortale y aporta brillo',
    ],
    symptoms: [
      'Falta de brillo',
    ],
    vitamins: 'B3  ( mejora la circulacion en cuero cabelludo y B6 ( fortalece el cabello)',
    afroBenefitByType: {
      '4B': 'Fortalece, da elasticidad y aporta brillo',
      '4C': 'Hoidrata fortalece y aporta brillo',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'en genaral esta mascarilla fortalece, hidrata y da brillo a todos los cabellos.',
  },
  {
    id: 'aloe-fresh-hair',
    name: 'ALOE FRESH HAIR',
    ingredients: [
      'Sabila',
    ],
    benefits: [
      'hidrata y da elasticidad',
    ],
    symptoms: [
      'Sequedad',
    ],
    vitamins: 'E ( hidrata y mejora la circulacion  y elasticidad del cuero cabelludo)',
    afroBenefitByType: {
      '4A': 'hidrata, da elasticidad y mejora la circulacion en el cuero cabelludo',
      '4B': 'hidrata, da elasticidad y mejora la circulacion en el cuero cabelludo',
      '4C': 'hidrata, da elasticidad y mejora la circulacion en el cuero cabelludo',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general hidrata, da elasticidad y mejora la circulación.',
  },
  {
    id: 'mango-glow-hair',
    name: 'MANGO GLOW HAIR',
    ingredients: [
      ' Mango Dulce',
    ],
    benefits: [
      'hidrata',
      'fortalece y aporta brillo al cabello y protege el cuero cabelludo afro',
    ],
    symptoms: [
      'Sequedad',
      'Falta de brillo',
    ],
    vitamins: 'A( Ayuda al crecimiento del cabello y previene el daño)  C( ayuda  a combatir el daño y a generar billo, E (es unantioxidante que ayuda a proteger el cuero cabelludo de daños y mantenerlo saludables)',
    afroBenefitByType: {
      '4A': 'Hidrata,fortalece y aporta elasticidad a los risos',
      '4B': 'Hidrata,fortalece y aporta elasticidad a los risos',
      '4C': 'Hidrata,fortalece y aporta elasticidad a los risos',
    },
    chemicallyTreatedNote: 'funcional  para cabellos tratados quimicamente con alisados permanentes o quekatina',
    generalNote: 'En general ayuda  a hidratar , aporta elasticidad  y protege el cuero cabelludo  al manterlo saludable',
  },
  {
    id: 'afroglow',
    name: 'AFROGLOW',
    ingredients: [
      'Aguacate, Banano y Guayaba',
    ],
    benefits: [
      'Hidratación profunda',
      'brillo y fortalecimiento del cabello seco o dañado',
    ],
    symptoms: [
      'Sequedad',
      'Falta de brillo',
    ],
  },
  {
    id: 'herbal-roots',
    name: 'HERBAL ROOTS',
    ingredients: [
      'Cebolla y Zanahoria',
    ],
    benefits: [
      'Fortalece las raices',
      'reduce la caida del cabello',
    ],
    symptoms: [
      'Caída o debilitamiento',
    ],
  },
  {
    id: 'tropical-repair',
    name: 'TROPICAL  REPAIR',
    ingredients: [
      'Banano y Chontaduro',
    ],
    benefits: [
      'Repara puntas abiertas y protege contra factores ambientales',
    ],
    symptoms: [
      'Rotura o puntas abiertas',
    ],
  },
] as const;

export function getTreatmentById(id: string): TreatmentRecord | undefined {
  return TREATMENTS.find((t) => t.id === id);
}
