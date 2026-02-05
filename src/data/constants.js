// Modalidades y sus configuraciones
export const MODALIDADES = {
  coros: { label: "Coro", color: "#6B8FD4", maxPasan: 7 },
  comparsas: { label: "Comparsa", color: "#9B7EC8", maxPasan: 10 },
  chirigotas: { label: "Chirigota", color: "#E08B8B", maxPasan: 10 },
  cuartetos: { label: "Cuarteto", color: "#5DB89C", maxPasan: 5 },
};

// Agrupaciones por modalidad (Cuartos 2026)
export const AGRUPACIONES = {
  coros: [
    "El Sindicato",
    "Dame Veneno",
    "La ciudad perfecta",
    "ADN",
    "El reino de los cielos",
    "La carnicería",
    "Las mil maravillas",
    "La esencia",
    "¡Qué pechá de paja!",
    "Los mentirosos"
  ],
  comparsas: [
    "La palabra de Cádiz",
    "El desguace",
    "El manicomio",
    "La Camorra",
    "La Marea",
    "Las Muñecas",
    "El hombre de hojalata",
    "El patriota",
    "Los Humanos",
    "Los Locos",
    "OBDC me quedo contigo",
    "Las jorobadas",
    "Los hijos de Cádiz",
    "El jovencito Frankenstein",
    "Los pájaros carpinteros",
    "DSAS3",
    "La Carne-Vale",
    "Los invisibles",
    "La Biblioteca",
    "La Condená"
  ],
  chirigotas: [
    "Los hombres de Paco",
    "Los Semicuraos",
    "Los Camerún de la isla",
    "Nos hemos venío arriba",
    "Seguimos cayendo mal",
    "Los Robins",
    "Una chirigota en teoría",
    "Los Cadisapiens",
    "Los antiguos",
    "La Purga: Los que no pasan",
    "Los niños con nombre",
    "Los Compay",
    "Piensa mal y acertarás: Los desconfiaos",
    "Los muerting planner",
    "Los Amish del mono",
    "Los que van a coger papas",
    "Los camper del sur",
    "L@s quince en las algas",
    "Los que la tienen de mármol",
    "Ssshhhhh!!"
  ],
  cuartetos: [
    "El despertar de la fuerza. Abre el ojete",
    "Crónica de una muerte más que anunciada",
    "Los latin king de la calle Paskin",
    "¡Que no vengan!"
  ],
};

// Sistema de puntuación del jurado (máx 100 pts)
export const SCORING = {
  coros: [
    { key: "presentacion", label: "Presentación", max: 6 },
    { key: "tango1", label: "Tango 1", max: 22 },
    { key: "tango2", label: "Tango 2", max: 22 },
    { key: "cuple1", label: "Cuplé 1", max: 9 },
    { key: "cuple2", label: "Cuplé 2", max: 9 },
    { key: "estribillo1", label: "Estribillo 1", max: 3 },
    { key: "estribillo2", label: "Estribillo 2", max: 3 },
    { key: "popurri", label: "Popurrí", max: 20 },
    { key: "vestuario", label: "Vestuario", max: 4 },
    { key: "impresion", label: "Impresión general", max: 2 }
  ],
  comparsas: [
    { key: "presentacion", label: "Presentación", max: 6 },
    { key: "pasodoble1", label: "Pasodoble 1", max: 22 },
    { key: "pasodoble2", label: "Pasodoble 2", max: 22 },
    { key: "cuple1", label: "Cuplé 1", max: 9 },
    { key: "cuple2", label: "Cuplé 2", max: 9 },
    { key: "estribillo1", label: "Estribillo 1", max: 3 },
    { key: "estribillo2", label: "Estribillo 2", max: 3 },
    { key: "popurri", label: "Popurrí", max: 20 },
    { key: "vestuario", label: "Vestuario", max: 4 },
    { key: "impresion", label: "Impresión general", max: 2 }
  ],
  chirigotas: [
    { key: "presentacion", label: "Presentación", max: 6 },
    { key: "pasodoble1", label: "Pasodoble 1", max: 12 },
    { key: "pasodoble2", label: "Pasodoble 2", max: 12 },
    { key: "cuple1", label: "Cuplé 1", max: 18 },
    { key: "cuple2", label: "Cuplé 2", max: 18 },
    { key: "estribillo1", label: "Estribillo 1", max: 4 },
    { key: "estribillo2", label: "Estribillo 2", max: 4 },
    { key: "popurri", label: "Popurrí", max: 20 },
    { key: "vestuario", label: "Vestuario", max: 4 },
    { key: "impresion", label: "Impresión general", max: 2 }
  ],
  cuartetos: [
    { key: "parodia", label: "Parodia", max: 44 },
    { key: "cuple1", label: "Cuplé 1", max: 12 },
    { key: "cuple2", label: "Cuplé 2", max: 12 },
    { key: "estribillo1", label: "Estribillo 1", max: 3 },
    { key: "estribillo2", label: "Estribillo 2", max: 3 },
    { key: "otras", label: "Otras composiciones", max: 20 },
    { key: "vestuario", label: "Vestuario", max: 4 },
    { key: "impresion", label: "Impresión general", max: 2 }
  ],
};

// Sesiones de Cuartos (30 ene - 5 feb 2026)
export const SESIONES_CUARTOS = [
  {
    id: 1,
    fecha: "2026-01-30",
    label: "Función 1",
    dia: "Viernes 30 enero",
    hora: "20:30h",
    agrupaciones: [
      { nombre: "El Sindicato", modalidad: "coros" },
      { nombre: "La palabra de Cádiz", modalidad: "comparsas" },
      { nombre: "El despertar de la fuerza. Abre el ojete", modalidad: "cuartetos" },
      { nombre: "Los hombres de Paco", modalidad: "chirigotas" },
      { nombre: "Dame Veneno", modalidad: "coros" },
      { nombre: "Los Semicuraos", modalidad: "chirigotas" },
      { nombre: "El desguace", modalidad: "comparsas" },
      { nombre: "Los Camerún de la isla", modalidad: "chirigotas" }
    ]
  },
  {
    id: 2,
    fecha: "2026-01-31",
    label: "Función 2",
    dia: "Sábado 31 enero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "La ciudad perfecta", modalidad: "coros" },
      { nombre: "Nos hemos venío arriba", modalidad: "chirigotas" },
      { nombre: "Crónica de una muerte más que anunciada", modalidad: "cuartetos" },
      { nombre: "El manicomio", modalidad: "comparsas" },
      { nombre: "ADN", modalidad: "coros" },
      { nombre: "La Camorra", modalidad: "comparsas" },
      { nombre: "Seguimos cayendo mal", modalidad: "chirigotas" },
      { nombre: "La Marea", modalidad: "comparsas" }
    ]
  },
  {
    id: 3,
    fecha: "2026-02-01",
    label: "Función 3",
    dia: "Domingo 1 febrero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "El reino de los cielos", modalidad: "coros" },
      { nombre: "Los Robins", modalidad: "chirigotas" },
      { nombre: "Los latin king de la calle Paskin", modalidad: "cuartetos" },
      { nombre: "Las Muñecas", modalidad: "comparsas" },
      { nombre: "La carnicería", modalidad: "coros" },
      { nombre: "Una chirigota en teoría", modalidad: "chirigotas" },
      { nombre: "El hombre de hojalata", modalidad: "comparsas" },
      { nombre: "Los Cadisapiens", modalidad: "chirigotas" }
    ]
  },
  {
    id: 4,
    fecha: "2026-02-02",
    label: "Función 4",
    dia: "Lunes 2 febrero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "Las mil maravillas", modalidad: "coros" },
      { nombre: "El patriota", modalidad: "comparsas" },
      { nombre: "Los antiguos", modalidad: "chirigotas" },
      { nombre: "Los Humanos", modalidad: "comparsas" },
      { nombre: "La Purga: Los que no pasan", modalidad: "chirigotas" },
      { nombre: "Los Locos", modalidad: "comparsas" },
      { nombre: "Los niños con nombre", modalidad: "chirigotas" },
      { nombre: "OBDC me quedo contigo", modalidad: "comparsas" }
    ]
  },
  {
    id: 5,
    fecha: "2026-02-03",
    label: "Función 5",
    dia: "Martes 3 febrero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "La esencia", modalidad: "coros" },
      { nombre: "Las jorobadas", modalidad: "comparsas" },
      { nombre: "¡Que no vengan!", modalidad: "cuartetos" },
      { nombre: "Los Compay", modalidad: "chirigotas" },
      { nombre: "Los hijos de Cádiz", modalidad: "comparsas" },
      { nombre: "Piensa mal y acertarás: Los desconfiaos", modalidad: "chirigotas" },
      { nombre: "El jovencito Frankenstein", modalidad: "comparsas" },
      { nombre: "Los muerting planner", modalidad: "chirigotas" }
    ]
  },
  {
    id: 6,
    fecha: "2026-02-04",
    label: "Función 6",
    dia: "Miércoles 4 febrero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "¡Qué pechá de paja!", modalidad: "coros" },
      { nombre: "Los Amish del mono", modalidad: "chirigotas" },
      { nombre: "Los pájaros carpinteros", modalidad: "comparsas" },
      { nombre: "Los que van a coger papas", modalidad: "chirigotas" },
      { nombre: "DSAS3", modalidad: "comparsas" },
      { nombre: "Los camper del sur", modalidad: "chirigotas" },
      { nombre: "La Carne-Vale", modalidad: "comparsas" }
    ]
  },
  {
    id: 7,
    fecha: "2026-02-05",
    label: "Función 7",
    dia: "Jueves 5 febrero",
    hora: "20:00h",
    agrupaciones: [
      { nombre: "Los mentirosos", modalidad: "coros" },
      { nombre: "Los invisibles", modalidad: "comparsas" },
      { nombre: "L@s quince en las algas", modalidad: "chirigotas" },
      { nombre: "La Biblioteca", modalidad: "comparsas" },
      { nombre: "Los que la tienen de mármol", modalidad: "chirigotas" },
      { nombre: "La Condená", modalidad: "comparsas" },
      { nombre: "Ssshhhhh!!", modalidad: "chirigotas" }
    ]
  },
];

// Fases del concurso
export const FECHAS_CLAVE = [
  { label: "Cuartos de Final", dates: "30 ene – 5 feb", status: "active" },
  { label: "Semifinales", dates: "8 – 11 feb", status: "upcoming" },
  { label: "Gran Final", dates: "13 feb", status: "upcoming" },
];

// Máximo que pasan por fase
export const MAX_PASAN = {
  cuartos: { coros: 7, comparsas: 10, chirigotas: 10, cuartetos: 5 },
  semifinales: { coros: 4, comparsas: 4, chirigotas: 4, cuartetos: 4 },
};

// PIN de admin (configura VITE_ADMIN_PIN en Vercel)
export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "0000";
