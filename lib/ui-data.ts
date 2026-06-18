export type TableStatus =
  | "libre"
  | "reservada"
  | "ocupada"
  | "pendiente cocina"
  | "cuenta emitida"
  | "incidencia";

export type TableZone = {
  id: string;
  name: string;
  shortName: string;
  description: string;
};

export type Table = {
  id: string;
  number: string;
  name: string;
  zoneId: string;
  zone: string;
  seats: number;
  status: TableStatus;
  total: number;
  covers: number;
  elapsed: string;
  reservation?: string;
  note?: string;
};

export type OrderLineStatus =
  | "draft"
  | "sent"
  | "preparing"
  | "ready"
  | "served"
  | "voided";

export type Station = "cocina" | "barra" | "postres";

export type OrderLine = {
  id: string;
  name: string;
  qty: number;
  price: number;
  station: Station;
  status: OrderLineStatus;
  note?: string;
  modifiers?: string[];
  course?: string;
  paid?: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  station: Station;
  visible: boolean;
  source: "Cheffing mock";
  color: "blue" | "green" | "amber" | "cyan" | "rose" | "violet" | "slate";
};

export type ReservationStatus =
  | "requested"
  | "confirmed"
  | "assigned"
  | "seated"
  | "completed"
  | "cancelled"
  | "no-show";

export type Reservation = {
  id: string;
  time: string;
  guest: string;
  partySize: number;
  status: ReservationStatus;
  assignedTable?: string;
  zone?: string;
  notes?: string;
};

export type CashSession = {
  businessDate: string;
  service: string;
  status: "mock abierta";
  user: string;
  device: string;
  openedAt: string;
  openingCash: number;
  countedCash: number;
  expectedCash: number;
};

export type ProductionTicket = {
  id: string;
  table: string;
  station: Station;
  elapsed: string;
  status: "pending" | "sent" | "preparing" | "ready" | "claimed" | "error";
  lines: string[];
  notes: string;
  printStatus: string;
};

export type AdminModule = {
  title: string;
  href: string;
  description: string;
  status: string;
};

export const staffContext = {
  service: "Cena",
  turn: "Turno tarde",
  user: "Manager turno",
  date: "18/06/2026",
  device: "iPad 1",
  permissionMode: "Permisos mock/local",
};

export const cashSession: CashSession = {
  businessDate: "2026-06-18",
  service: "Cena",
  status: "mock abierta",
  user: "Manager turno",
  device: "iPad 1",
  openedAt: "12:36",
  openingCash: 250,
  countedCash: 430,
  expectedCash: 436.2,
};

export const operatorLinks = [
  { href: "/turno", label: "Abrir turno" },
  { href: "/pos", label: "POS sala" },
  { href: "/pos/comanda", label: "Comanda" },
  { href: "/pos/cobro", label: "Cobro" },
  { href: "/cocina", label: "Cocina/barra" },
  { href: "/ticket", label: "Ticket" },
  { href: "/ayuda", label: "Ayuda" },
];

export const adminLinks = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/catalogo", label: "Catalogo" },
  { href: "/admin/mesas", label: "Mesas" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/comandas", label: "Comandas" },
  { href: "/admin/produccion", label: "Produccion" },
  { href: "/admin/caja", label: "Caja" },
  { href: "/admin/informes", label: "Informes" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export const tableZones: TableZone[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    shortName: "Restaurant",
    description: "Sala principal y mesas interiores",
  },
  {
    id: "invernadero",
    name: "Invernadero",
    shortName: "Invern.",
    description: "Zona cubierta con alto uso en cena",
  },
  {
    id: "terraza",
    name: "Terraza",
    shortName: "Terraza",
    description: "Exterior y reservas grandes",
  },
  {
    id: "food-truck",
    name: "Food Truck",
    shortName: "Truck",
    description: "Pases rapidos y consumo informal",
  },
  {
    id: "mediterraneo",
    name: "Mediterraneo",
    shortName: "Medit.",
    description: "Area de apoyo para temporada",
  },
  {
    id: "lounge-bar",
    name: "Lounge Bar",
    shortName: "Lounge",
    description: "Barra, copas y mesas bajas",
  },
];

const zoneSeatPattern: Record<string, number[]> = {
  restaurant: [2, 4, 4, 6, 2, 4, 4, 6, 2, 4, 4, 6, 2, 4, 4, 6, 2, 4, 4, 6],
  invernadero: [2, 4, 4, 6, 2, 4, 4, 6],
  terraza: [2, 4, 4, 6, 2, 4, 4, 6, 2, 4, 4, 6, 2, 8],
  "food-truck": [2, 2, 4, 4],
  mediterraneo: [2, 4, 4, 6, 2, 4, 6],
  "lounge-bar": [2, 2, 4, 4, 6, 2, 4, 6],
};

const tableOverrides: Record<string, Partial<Table>> = {
  "restaurant-1": {
    status: "ocupada",
    covers: 2,
    total: 32.5,
    elapsed: "46 min",
    note: "Ticket con productos enviados",
  },
  "restaurant-4": {
    status: "reservada",
    covers: 6,
    reservation: "Reserva demo 21:00",
    elapsed: "18 min",
  },
  "restaurant-6": {
    status: "pendiente cocina",
    covers: 4,
    total: 47.8,
    elapsed: "21 min",
  },
  "restaurant-9": {
    status: "incidencia",
    covers: 2,
    total: 18.4,
    elapsed: "33 min",
    note: "Incidencia mock de alergeno",
  },
  "restaurant-19": {
    status: "cuenta emitida",
    covers: 4,
    total: 86.6,
    elapsed: "74 min",
  },
  "terraza-303": {
    status: "reservada",
    covers: 6,
    reservation: "Reserva demo terraza",
    elapsed: "12 min",
  },
  "terraza-304": {
    status: "reservada",
    covers: 4,
    reservation: "Reserva demo grupo",
    elapsed: "12 min",
  },
  "lounge-bar-LB3": {
    status: "ocupada",
    covers: 4,
    total: 52,
    elapsed: "38 min",
  },
};

function buildTables() {
  const restaurantNumbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "222",
  ];
  const zoneNumbers: Record<string, string[]> = {
    restaurant: restaurantNumbers,
    invernadero: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"],
    terraza: [
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308",
      "309",
      "310",
      "311",
      "312",
      "313",
      "314",
    ],
    "food-truck": ["FT1", "FT2", "FT3", "FT4"],
    mediterraneo: ["M1", "M2", "M3", "M4", "M5", "M6", "M7"],
    "lounge-bar": ["LB1", "LB2", "LB3", "LB4", "LB5", "LB6", "LB7", "LB8"],
  };

  return tableZones.flatMap((zone) =>
    zoneNumbers[zone.id].map((number, index) => {
      const id = `${zone.id}-${number}`;
      const base: Table = {
        id,
        number,
        name: zone.id === "restaurant" ? `Mesa ${number}` : `${zone.shortName} ${number}`,
        zoneId: zone.id,
        zone: zone.name,
        seats: zoneSeatPattern[zone.id][index],
        status: "libre",
        total: 0,
        covers: 0,
        elapsed: "0 min",
      };

      return { ...base, ...tableOverrides[id] };
    }),
  );
}

export const tables: Table[] = buildTables();
export const zones = tableZones.map((zone) => zone.name);
export const tableCount = tables.length;

export const tableStatusLegend: { status: TableStatus; label: string }[] = [
  { status: "libre", label: "Disponible" },
  { status: "pendiente cocina", label: "Pendiente cocina" },
  { status: "ocupada", label: "Ocupada" },
  { status: "cuenta emitida", label: "Cuenta emitida" },
  { status: "reservada", label: "Reservada" },
  { status: "incidencia", label: "Incidencia" },
];

export const reservations: Reservation[] = [
  {
    id: "r1",
    time: "13:00",
    guest: "Reserva demo A",
    partySize: 4,
    status: "requested",
    notes: "Sin mesa asignada",
  },
  {
    id: "r2",
    time: "13:00",
    guest: "Reserva demo B",
    partySize: 4,
    status: "assigned",
    assignedTable: "Mesa 4",
    zone: "Restaurant",
  },
  {
    id: "r3",
    time: "21:00",
    guest: "Reserva demo grupo",
    partySize: 10,
    status: "confirmed",
    assignedTable: "Terraza 303 + Terraza 304",
    zone: "Terraza",
  },
  {
    id: "r4",
    time: "19:00",
    guest: "Reserva demo cancelada",
    partySize: 4,
    status: "cancelled",
    assignedTable: "Lounge LB2",
    zone: "Lounge Bar",
  },
  {
    id: "r5",
    time: "14:00",
    guest: "Reserva demo no-show",
    partySize: 2,
    status: "no-show",
    assignedTable: "Mesa 9",
    zone: "Restaurant",
  },
  {
    id: "r6",
    time: "22:00",
    guest: "Reserva demo sentada",
    partySize: 4,
    status: "seated",
    assignedTable: "Lounge LB3",
    zone: "Lounge Bar",
  },
  {
    id: "r7",
    time: "12:00",
    guest: "Reserva demo completada",
    partySize: 2,
    status: "completed",
    assignedTable: "Food Truck FT1",
    zone: "Food Truck",
  },
];

export const productCategories = [
  "Cercar",
  "Favoritos",
  "Menus",
  "Entrantes",
  "Arroces",
  "Pescado",
  "Carne",
  "Postres",
  "Bebidas",
  "Configurados",
  "Otros",
];

export const products: Product[] = [
  {
    id: "menu-migdia",
    name: "Menu mediodia",
    category: "Menus",
    price: 24,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "blue",
  },
  {
    id: "menu-infantil",
    name: "Menu infantil",
    category: "Menus",
    price: 14.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "blue",
  },
  {
    id: "bravas-sikim",
    name: "Bravas Sikim",
    category: "Entrantes",
    price: 8.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "green",
  },
  {
    id: "nachos-artesanales",
    name: "Nachos artesanales",
    category: "Entrantes",
    price: 12.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "green",
  },
  {
    id: "croquetas-jamon",
    name: "Croquetas jamon",
    category: "Entrantes",
    price: 9.8,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "green",
  },
  {
    id: "pan-cristal",
    name: "Pan cristal tomate",
    category: "Entrantes",
    price: 6.2,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "green",
  },
  {
    id: "arroz-marisco",
    name: "Arroz marisco",
    category: "Arroces",
    price: 24.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "amber",
  },
  {
    id: "paella-mixta",
    name: "Paella mixta",
    category: "Arroces",
    price: 23.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "amber",
  },
  {
    id: "dorada-plancha",
    name: "Dorada plancha",
    category: "Pescado",
    price: 22.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "cyan",
  },
  {
    id: "pulpo-brasa",
    name: "Pulpo brasa",
    category: "Pescado",
    price: 24,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "cyan",
  },
  {
    id: "entrecot",
    name: "Entrecot",
    category: "Carne",
    price: 26.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "rose",
  },
  {
    id: "pollo-brasa",
    name: "Pollo brasa",
    category: "Carne",
    price: 16.5,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "rose",
  },
  {
    id: "cheesecake",
    name: "Cheesecake",
    category: "Postres",
    price: 6.9,
    station: "postres",
    visible: true,
    source: "Cheffing mock",
    color: "violet",
  },
  {
    id: "crema-catalana",
    name: "Crema catalana",
    category: "Postres",
    price: 6.5,
    station: "postres",
    visible: true,
    source: "Cheffing mock",
    color: "violet",
  },
  {
    id: "agua",
    name: "Agua",
    category: "Bebidas",
    price: 2.2,
    station: "barra",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
  {
    id: "cana",
    name: "Cana",
    category: "Bebidas",
    price: 2.9,
    station: "barra",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
  {
    id: "copa-vino-blanco",
    name: "Copa vino blanco",
    category: "Bebidas",
    price: 4.2,
    station: "barra",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
  {
    id: "cafe",
    name: "Cafe",
    category: "Bebidas",
    price: 1.8,
    station: "barra",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
  {
    id: "extra-salsa",
    name: "Extra salsa",
    category: "Otros",
    price: 1.2,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
  {
    id: "suplemento-pan",
    name: "Suplemento pan",
    category: "Otros",
    price: 1.8,
    station: "cocina",
    visible: true,
    source: "Cheffing mock",
    color: "slate",
  },
];

export const orderLines: OrderLine[] = [
  {
    id: "l1",
    name: "Bravas Sikim",
    qty: 1,
    price: 8.5,
    station: "cocina",
    status: "sent",
    note: "Sin cebolla",
    modifiers: ["Al punto"],
    course: "Entrante",
  },
  {
    id: "l2",
    name: "Menu mediodia",
    qty: 1,
    price: 24,
    station: "cocina",
    status: "preparing",
    modifiers: ["Primero: Bravas", "Segundo: Paella mixta", "Postre: Cheesecake"],
    course: "Principal",
  },
  {
    id: "l3",
    name: "Copa vino blanco",
    qty: 2,
    price: 4.2,
    station: "barra",
    status: "ready",
    course: "Bebida",
  },
  {
    id: "l4",
    name: "Crema catalana",
    qty: 1,
    price: 6.5,
    station: "postres",
    status: "draft",
    note: "Pendiente de enviar",
    course: "Seguido",
  },
  {
    id: "l5",
    name: "Agua",
    qty: 1,
    price: 2.2,
    station: "barra",
    status: "served",
    paid: true,
  },
  {
    id: "l6",
    name: "Extra salsa",
    qty: 1,
    price: 1.2,
    station: "cocina",
    status: "voided",
    note: "Anulacion mock con motivo requerido",
  },
];

export const paymentSummary = {
  table: "Restaurant - Mesa 1",
  covers: 2,
  mode: "Cuenta completa",
  method: "Efectivo mock",
  paid: 0,
};

export const productionTickets: ProductionTicket[] = [
  {
    id: "K-104",
    table: "Mesa 1",
    station: "cocina",
    elapsed: "12 min",
    status: "preparing",
    lines: ["1 Bravas Sikim", "1 Menu mediodia"],
    notes: "Sin cebolla. Menu con paella mixta.",
    printStatus: "Print job mock en cola de cocina",
  },
  {
    id: "B-031",
    table: "Mesa 6",
    station: "barra",
    elapsed: "6 min",
    status: "sent",
    lines: ["2 Copa vino blanco", "1 Agua"],
    notes: "Servir con hielo aparte.",
    printStatus: "Impresion pendiente de conectar",
  },
  {
    id: "P-008",
    table: "Mesa 19",
    station: "postres",
    elapsed: "3 min",
    status: "ready",
    lines: ["1 Crema catalana"],
    notes: "Mesa en cuenta emitida.",
    printStatus: "Sin impresora real",
  },
  {
    id: "K-105",
    table: "Terraza 303",
    station: "cocina",
    elapsed: "18 min",
    status: "claimed",
    lines: ["2 Arroz marisco"],
    notes: "Reclamado desde sala mock.",
    printStatus: "Reimpresion mock solicitada",
  },
  {
    id: "B-032",
    table: "Lounge LB3",
    station: "barra",
    elapsed: "1 min",
    status: "pending",
    lines: ["1 Cana", "1 Cafe"],
    notes: "Pendiente de envio real.",
    printStatus: "Aun no hay print job real",
  },
  {
    id: "K-106",
    table: "Food Truck FT2",
    station: "cocina",
    elapsed: "25 min",
    status: "error",
    lines: ["1 Nachos artesanales"],
    notes: "Error mock de ruta de impresora.",
    printStatus: "Error simulado. Reintentar pendiente",
  },
];

export const adminModules: AdminModule[] = [
  {
    title: "Catalogo POS",
    href: "/admin/catalogo",
    description: "Visibilidad TPV, estacion y precio de referencia desde Cheffing.",
    status: "Shell",
  },
  {
    title: "Mesas y zonas",
    href: "/admin/mesas",
    description: "Mapa fisico, capacidad y agrupaciones futuras.",
    status: "Shell",
  },
  {
    title: "Reservas",
    href: "/admin/reservas",
    description: "Relacion conceptual entre reservas y sesiones de mesa.",
    status: "Shell",
  },
  {
    title: "Produccion",
    href: "/admin/produccion",
    description: "Estaciones, rutas logicas e intentos de impresion previstos.",
    status: "Shell",
  },
  {
    title: "Caja",
    href: "/admin/caja",
    description: "Resumen de cobros, movimientos y cierre de turno.",
    status: "Inicial",
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    description: "Capacidades POS propuestas, sin auth real.",
    status: "Plan",
  },
];

export const orderReview = [
  {
    id: "CMD-1004",
    table: "Mesa 1",
    status: "En cocina",
    total: 32.5,
    payment: "Pendiente",
  },
  {
    id: "CMD-1005",
    table: "Mesa 19",
    status: "En cobro",
    total: 86.6,
    payment: "Parcial",
  },
  {
    id: "CMD-1006",
    table: "Lounge LB3",
    status: "Cerrada",
    total: 52,
    payment: "Tarjeta mock",
  },
];

export const permissions = [
  "Acceso POS",
  "Gestionar comandas",
  "Enviar a cocina/barra",
  "Anular/cancelar items",
  "Tomar cobros",
  "Cerrar turnos",
  "Administracion POS",
];

export const shiftActions = [
  "Abrir caja/sesion",
  "Cerrar caja/sesion",
  "Anadir ingreso",
  "Retirar efectivo",
  "Anadir gasto",
  "Generar resumen",
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function orderTotal(lines = orderLines) {
  return lines.reduce((total, line) => total + line.price * line.qty, 0);
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    libre: "Disponible",
    reservada: "Reservada",
    ocupada: "Ocupada",
    "pendiente cocina": "Pendiente cocina",
    "cuenta emitida": "Cuenta emitida",
    incidencia: "Incidencia",
    draft: "Borrador",
    sent: "Enviado",
    preparing: "Preparando",
    ready: "Listo",
    served: "Servido",
    voided: "Anulado",
    requested: "Solicitada",
    confirmed: "Confirmada",
    assigned: "Asignada",
    seated: "Sentada",
    completed: "Completada",
    cancelled: "Cancelada",
    "no-show": "No-show",
    pending: "Pendiente",
    claimed: "Reclamado",
    error: "Error",
  };

  return labels[status] ?? status;
}
